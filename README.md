# Next.js PDF RAG Chat (VerityAI)

A full-stack Retrieval-Augmented Generation (RAG) chat application built with Next.js App Router, Google Gemini, Drizzle ORM, PostgreSQL with `pgvector` (Neon), Clerk Authentication, and the Vercel AI SDK.

Upload PDF documents to automatically extract text, generate semantic vector embeddings, store them in a vector database, and chat with your documents using an AI assistant powered by Gemini.

---

## 🚀 Features

- **Next.js 16 & React 19 App Router**: Modern server and client component architecture.
- **AI SDK & Streaming Responses**: Real-time token streaming with `@ai-sdk/google` and `@ai-sdk/react`.
- **Google Gemini Integration**:
  - `gemini-3.6-flash` for multi-step reasoning, tool execution, and grounded answer generation.
  - `gemini-embedding-2` with 1536 output dimensions for vector embeddings.
- **RAG Knowledge Base & Tool Calling**: Autonomous tool-driven similarity search (`searchKnowledgeBase`) using cosine distance on Postgres vector embeddings.
- **PDF Processing Pipeline**: Automated PDF text parsing (`pdf-parse`), semantic recursive chunking (`@langchain/textsplitters`), and batch vector embedding creation.
- **Vector Database**: PostgreSQL with `pgvector` extension and HNSW indexing using Drizzle ORM and Neon serverless.
- **Clerk Authentication & Access Control**: Route protection middleware and role-based permissions (admin-only knowledge base uploads).
- **Tailwind CSS & AI Elements**: Polished chat UI and document upload interface.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/), Tailwind CSS
- **AI & LLM Orchestration**: [Vercel AI SDK](https://sdk.vercel.ai/), `@ai-sdk/google` (Gemini)
- **Database & ORM**: [PostgreSQL (Neon)](https://neon.tech/), [`pgvector`](https://github.com/pgvector/pgvector), [Drizzle ORM](https://orm.drizzle.team/)
- **Document Processing**: `pdf-parse`, `@langchain/textsplitters`
- **Authentication**: [Clerk](https://clerk.com/)
- **Language**: TypeScript

---

## 🔄 Detailed System Flow & Architecture

The system operates across two primary pipelines: the **PDF Ingestion & Indexing Flow** and the **RAG Retrieval & Chat Flow**.

### 1. High-Level Architecture Diagram

```text
[ User / Admin ]
       │
       ├─► (1) Upload PDF ──► Next.js Server Action ──► pdf-parse (Extract Text)
       │                                                      │
       │                                                      ▼
       │                                            Recursive Text Splitter (150 chars, 20 overlap)
       │                                                      │
       │                                                      ▼
       │                                            Gemini Embedding-2 (1536-dim)
       │                                                      │
       │                                                      ▼
       │                                            PostgreSQL (Neon) + pgvector (HNSW Index)
       │                                                      ▲
       │                                                      │
       └─► (2) Ask Question ──► /api/chat ──► Gemini 3.6 Flash │ (Cosine Distance Search)
                                     │         │ (Tool Call)  │
                                     │         └──────────────┘
                                     ▼
                            Streaming UI Response
```

---

### 2. PDF Ingestion & Indexing Flow (`processPdfFile` Server Action)

> **Upload guidance:** For best results, keep uploaded documents around 2MB or less and prefer text-based content formats when possible. Plain text and clean PDF source material chunk more effectively and produce more consistent embeddings than heavily formatted or noisy files.

The document ingestion workflow is executed on the server via the `processPdfFile(formData)` Server Action in `src/app/upload/actions.ts`:

1. **Authentication Check (`auth.protect()`)**:
   - The user must be authenticated with Clerk. Unauthenticated invocations are automatically rejected.
2. **Database Connection Verification**:
   - Validates that `DATABASE_URL` or `NEON_DATABASE_URL` is configured before proceeding.
3. **File Extraction & Buffer Conversion**:
   - Extracts the `File` object from `FormData` (`formData.get("pdf")`).
   - Converts the file's `ArrayBuffer` into a Node.js `Buffer` (`Buffer.from(bytes)`).
4. **Text Extraction (`pdf-parse`)**:
   - Passes the buffer to `new PDFParse({ data: buffer })` and extracts raw textual content via `parser.getText()`.
5. **Content Validation**:
   - Ensures extracted text is present and non-empty (`data.text.trim().length > 0`).
6. **Recursive Text Chunking (`chunkContent`)**:
   - Uses LangChain's `RecursiveCharacterTextSplitter` in `src/lib/chunking.ts` (`chunkSize: 150`, `chunkOverlap: 20`) to split raw text into clean, contextual segments while preserving paragraph and sentence boundaries.
7. **Batch Vector Embedding Generation (`generateEmbeddings`)**:
   - Sends all text chunks in batch to Google Gemini's `gemini-embedding-2` model via `embedMany()` in `src/lib/embeddings.ts`, configured with `outputDimensionality: 1536`.
8. **Record Mapping**:
   - Maps each chunk text and its corresponding 1536-dimensional vector embedding into database record structures:
     ```typescript
     const records = chunks.map((chunk, index) => ({
       content: chunk,
       embedding: embeddings[index],
     }));
     ```
9. **Vector Storage & Indexing via Drizzle ORM**:
   - Inserts all document records in batch into PostgreSQL (`await db.insert(documents).values(records)`).
   - The HNSW cosine index (`vector_cosine_ops`) immediately indexes the new vectors for fast nearest-neighbor similarity search.
10. **Error Handling & Response**:
    - Returns `{ success: true, message: "Created X searchable chunks" }` on success, or logs errors and returns structured failure messages (`{ success: false, error: ... }`).

---

### 3. RAG Retrieval & Chat Flow (Step-by-Step)

1. **User Query**:
   - The user navigates to `/chat` and submits a prompt in natural language.
   - The client hook `useChat()` from `@ai-sdk/react` packages the conversation and issues a `POST` request to `/api/chat`.
2. **Route Handling & Auth Verification**:
   - `src/app/api/chat/route.ts` validates the session with Clerk (`auth.protect()`).
   - UI messages are parsed and converted to model messages with `convertToModelMessages()`.
3. **LLM Orchestration & Tool Calling**:
   - `streamText()` initializes `gemini-3.6-flash` with system instructions to search the knowledge base before answering.
   - When relevant context is needed, the model calls the `searchKnowledgeBase` tool with a generated search `query`.
4. **Vector Similarity Retrieval**:
   - `searchDocuments(query, 3, 0.5)` in `src/lib/search.ts`:
     1. Generates a 1536-dimensional embedding of the search query using `gemini-embedding-2`.
     2. Queries the Postgres database using Drizzle ORM and computes cosine similarity:
        $$\text{similarity} = 1 - \text{cosineDistance}(\text{documents.embedding}, \text{queryEmbedding})$$
     3. Filters records exceeding the similarity threshold (`> 0.5`), sorts by highest similarity (`desc`), and returns top matches.
5. **Context Grounding & Response Generation**:
   - The retrieved document passages are formatted and returned to the model (`stopWhen: stepCountIs(2)`).
   - Gemini synthesizes a grounded, concise answer based strictly on the retrieved knowledge base content.
6. **Real-Time Streaming**:
   - The response is streamed back to the client via `createUIMessageStreamResponse()` and rendered dynamically in the chat UI.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory by copying `env.example`:

```bash
cp env.example .env.local
```

### Required Variables Reference

| Variable Name                         | Required | Description                                                                                                       | Example / Default                                                    |
| :------------------------------------ | :------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY`        | **Yes**  | Google Gemini API key used for chat generation (`gemini-3.6-flash`) and vector embeddings (`gemini-embedding-2`). | `AIzaSy...`                                                          |
| `GEMINI_API_KEY`                      | Optional | Alternative alias for the Gemini API key (fallback if `GOOGLE_GENERATIVE_AI_API_KEY` is not set).                 | `AIzaSy...`                                                          |
| `DATABASE_URL`                        | **Yes**  | PostgreSQL connection string (e.g. Neon) with `pgvector` support.                                                 | `postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require` |
| `NEON_DATABASE_URL`                   | Optional | Alternative alias for the database connection URL.                                                                | `postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | **Yes**  | Clerk publishable key for client-side authentication.                                                             | `pk_test_...`                                                        |
| `CLERK_SECRET_KEY`                    | **Yes**  | Clerk secret key for server-side auth, middleware route protection, and server actions.                           | `sk_test_...`                                                        |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | Optional | Custom sign-in route path for Clerk.                                                                              | `/sign-in`                                                           |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | Optional | Custom sign-up route path for Clerk.                                                                              | `/sign-up`                                                           |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Optional | Redirect path after user logs in.                                                                                 | `/chat`                                                              |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Optional | Redirect path after user registers.                                                                               | `/chat`                                                              |

---

## 📦 Getting Started & Local Setup

### 1. Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: Package manager (`npm install -g pnpm`)
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)
- **Neon Database**: Free serverless Postgres database from [Neon](https://neon.tech/) with `pgvector` enabled
- **Clerk Account**: Free authentication app from [Clerk](https://clerk.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd nextjs-pdf-rag
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp env.example .env.local
```

### 4. Database Setup & Migrations

#### A. Enabling `pgvector` & Generating Migrations

PostgreSQL requires the `vector` extension to store and query high-dimensional vector embeddings.

If generating a custom migration for pgvector:

1. **Generate custom migration**:
   ```bash
   npx drizzle-kit generate --custom
   ```
2. **Add vector extension statement in the generated migration file** (e.g., `migrations/0000_cuddly_tenebrous.sql`):
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;  -- to enable vector
   ```
3. **Apply the migrations**:
   ```bash
   npx drizzle-kit migrate
   # or push directly
   pnpm drizzle-kit push
   ```
4. **Verify `pgvector` extension in your Postgres database**:
   ```sql
   SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
   ```

_Note: Migrations in `./migrations` include:_

1. `0000_cuddly_tenebrous.sql`: Enables `CREATE EXTENSION IF NOT EXISTS vector;`
2. `0001_amazing_korath.sql`: Creates `documents` table and HNSW cosine index.

#### B. Note on Embedding Dimensionality (`1536`)

Google Gemini's `gemini-embedding-2` model supports customizable output dimensionality. When generating embeddings in `src/lib/embeddings.ts`, `outputDimensionality: 1536` is configured in `providerOptions`:

```typescript
providerOptions: {
  google: {
    outputDimensionality: 1536, // Match the Postgres vector schema
  },
},
```

> **Why 1536?**
> Neon DB and PostgreSQL `pgvector` schemas in this project (`src/lib/db-schema.ts`) define `vector("embedding", { dimensions: 1536 })` with an HNSW index (`vector_cosine_ops`). Setting `outputDimensionality: 1536` ensures the embedding vectors directly match the Postgres vector schema definition and Neon DB vector constraints.

### 5. Run the Application

> **Recommended input format:** Use text-rich PDFs or plain text documents for the most effective chunking. Very large or highly formatted files may reduce chunk quality and slow vector generation, so keeping uploads under roughly 2MB is recommended.

Start the local Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:

- **Landing Page**: `http://localhost:3000`
- **PDF Upload (Admin)**: `http://localhost:3000/upload`
- **RAG Chat Interface**: `http://localhost:3000/chat`

---

## 📄 Testing with Sample PDF (`earth.pdf`)

A sample document is included in the repository at `sample-pdf/earth.pdf` (covering Earth's astronomical data, physical characteristics, orbital parameters, and atmosphere) to help you test the end-to-end RAG pipeline immediately:

1. **Upload the Sample PDF**:
   - Sign in to the application as an admin user.
   - Navigate to `/upload`.
   - Select and upload `sample-pdf/earth.pdf`.
   - Wait for the server action to parse text, generate Gemini vector embeddings, and store document chunks in Postgres.
2. **Chat with the Knowledge Base**:
   - Navigate to `/chat`.
   - Ask questions grounded in the sample document, for example:
     - _"What is the orbital period and average orbital speed of Earth?"_
     - _"What are the alternative names for Earth listed in the document?"_
     - _"What was the significance of the Apollo 17 mission mentioned in the document?"_
3. **Observe Autonomous RAG in Action**:
   - Watch Gemini dynamically invoke the `searchKnowledgeBase` tool with semantic search queries, fetch relevant vector matches, and stream back grounded responses.

---

## 📁 Project Structure

```text
nextjs-pdf-rag/
├── migrations/                  # Drizzle ORM SQL migration files
│   ├── 0000_cuddly_tenebrous.sql # Enables pgvector extension
│   └── 0001_amazing_korath.sql   # Creates documents table & HNSW index
├── sample-pdf/                  # Sample test documents
│   └── earth.pdf                # Sample PDF about Earth for testing RAG ingestion & retrieval
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts     # Streaming chat route with Gemini & RAG tool calling
│   │   ├── chat/
│   │   │   └── page.tsx         # RAG Chat interface with AI elements
│   │   ├── upload/
│   │   │   ├── actions.ts       # Server action for PDF extraction, chunking & embedding
│   │   │   ├── PDFUploadForm.tsx# Client form component for PDF uploads
│   │   │   └── page.tsx         # Role-protected upload page
│   │   ├── globals.css          # Global Tailwind styles
│   │   ├── layout.tsx           # Root layout with ClerkProvider
│   │   └── page.tsx             # Landing / marketing page
│   ├── components/
│   │   ├── ai-elements/         # UI elements for conversation, message & prompt input
│   │   └── ui/                  # Reusable UI primitives (buttons, cards, inputs, alerts)
│   ├── lib/
│   │   ├── chunking.ts          # LangChain recursive text splitter configuration
│   │   ├── db-config.ts         # Neon HTTP client & Drizzle database instance
│   │   ├── db-schema.ts         # Drizzle schema (documents table & vector index)
│   │   ├── embeddings.ts        # Google Gemini gemini-embedding-2 integration
│   │   ├── search.ts            # Cosine similarity vector search query
│   │   └── utils.ts             # Utility helpers (clsx, tailwind-merge)
│   └── proxy.ts                 # Clerk authentication route middleware
├── drizzle.config.ts            # Drizzle Kit configuration
├── env.example                  # Environment variables template
├── package.json                 # Project dependencies & scripts
└── tsconfig.json                # TypeScript configuration
```

---

## 📜 Available Scripts

| Script  | Command      | Description                                                      |
| :------ | :----------- | :--------------------------------------------------------------- |
| `dev`   | `pnpm dev`   | Starts the Next.js development server at `http://localhost:3000` |
| `build` | `pnpm build` | Builds the production application bundle                         |
| `start` | `pnpm start` | Runs the built production server                                 |
| `lint`  | `pnpm lint`  | Runs ESLint checks                                               |

---

## 🛡️ License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
