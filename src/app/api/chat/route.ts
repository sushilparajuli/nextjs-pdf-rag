import { auth } from "@clerk/nextjs/server";
import { streamText, convertToModelMessages } from "ai";
import { createGoogle } from "@ai-sdk/google";

export async function POST(req: Request) {
  await auth.protect();
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (!messages.length) {
      return new Response("No chat messages provided.", { status: 400 });
    }

    const google = createGoogle({
      apiKey:
        process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const result = streamText({
      model: google("gemini-3.6-flash"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error chat api", err);
    return new Response("Failed to stream", { status: 500 });
  }
}
