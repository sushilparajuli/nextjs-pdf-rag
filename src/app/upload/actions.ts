"use server";
import { PDFParse } from "pdf-parse";

import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";

import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";
import { auth } from "@clerk/nextjs/server";

/**
 * Server Action: processPdfFile
 * 
 * Handles end-to-end PDF processing and vector database ingestion:
 * 1. Authentication check: Protects action execution via Clerk auth.
 * 2. Database validation: Verifies connection to PostgreSQL / Neon.
 * 3. File extraction: Retrieves binary PDF file from FormData and converts to Buffer.
 * 4. Text extraction: Parses textual content from the PDF using `pdf-parse`.
 * 5. Validation: Verifies extracted text is non-empty.
 * 6. Semantic chunking: Recursively splits text into overlapping chunks via LangChain.
 * 7. Vector embedding: Generates 1536-dimensional embeddings with Google Gemini.
 * 8. Database insertion: Stores text chunks and vector embeddings into the `documents` table via Drizzle ORM.
 * 
 * @param formData - FormData payload containing the uploaded "pdf" file
 * @returns Result object with success status, message, or error explanation
 */
export async function processPdfFile(formData: FormData) {
  // Step 1: Ensure user is authenticated before processing the document
  await auth.protect();

  // Step 2: Validate that database connection URL is configured in environment variables
  if (!db) {
    return {
      success: false,
      error:
        "Database is not configured. Set DATABASE_URL or NEON_DATABASE_URL in your environment.",
    };
  }

  try {
    // Step 3: Extract uploaded PDF file from FormData and convert to a Node Buffer
    const file = formData.get("pdf") as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 4: Extract text content from the PDF buffer using pdf-parse
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

    // Step 5: Validate that the PDF contains extractable text
    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: "No text found in pdf",
      };
    }

    // Step 6: Chunk extracted text into semantic segments (150 chars with 20 overlap)
    const chunks = await chunkContent(data.text);

    // Step 7: Generate 1536-dimensional vector embeddings for each chunk via Gemini
    const embeddings = await generateEmbeddings(chunks);

    // Step 8: Map chunks and their corresponding embeddings into database document records
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    // Step 9: Insert batch records into PostgreSQL `documents` table via Drizzle ORM
    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chhunks`,
    };
  } catch (err) {
    // Step 10: Log any errors during processing and return user-friendly failure message
    console.error("PDF processing error", err);
    return {
      success: false,
      error: "Failed to process pdf",
    };
  }
}
