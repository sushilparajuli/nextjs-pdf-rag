# Next.js PDF RAG Chat

A small Next.js app for a chat-style AI interface powered by Google Gemini via the AI SDK.

## Features

- Next.js App Router
- AI SDK chat transport with streaming responses
- Gemini model integration via `@ai-sdk/google`
- Chat UI built with custom AI elements and Tailwind styling
- Ready for future PDF / retrieval integrations

## Stack

- Next.js 16
- React 19
- TypeScript
- AI SDK
- Google Gemini

## Prerequisites

- Node.js 18+
- pnpm
- A Google API key for Gemini

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a local environment file:

```bash
cp env.example .env.local
```

3. Add your Gemini key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

You can also use `GEMINI_API_KEY` in code explicitly, but the default SDK provider looks for `GOOGLE_GENERATIVE_AI_API_KEY`.

## Run locally

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000/chat
```

## Project structure

```text
src/
  app/
    api/chat/route.ts
    chat/page.tsx
  components/
    ai-elements/
    ui/
```

## Important API note

The chat route expects the AI SDK UI message payload shape, not a raw `{ prompt }` body. The client uses `useChat()` from `@ai-sdk/react`, so the server route should read `body.messages` and convert them with `convertToModelMessages()` before calling `streamText()`.

## Useful commands

```bash
pnpm dev
pnpm build
pnpm lint
```

## Notes

- This project currently contains unrelated TypeScript issues in some component files outside the chat route.
- The chat route itself is validated separately before use.
- If you want to add PDF ingestion or RAG retrieval later, the route is the correct extension point.
