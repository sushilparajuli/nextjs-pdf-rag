import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string) {
  const input = text.replace(/\n/g, " ").trim();

  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-2"),
    value: input,
    providerOptions: {
      google: {
        outputDimensionality: 1536, // Match the Postgres vector schema
      },
    },
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => text.replace(/\n/g, " ").trim());

  const { embeddings } = await embedMany({
    model: google.embeddingModel("gemini-embedding-2"),
    values: inputs,
    providerOptions: {
      google: {
        outputDimensionality: 1536, // Match the Postgres vector schema
      },
    },
  });

  return embeddings;
}
