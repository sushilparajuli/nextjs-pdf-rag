# Repository guide for AI coding agents

## Project overview

This repo is a Next.js app for a chat interface powered by Google Gemini. The app uses the AI SDK and the App Router.

## Important constraints

- Prefer the actual project files and the installed library docs over generic Next.js assumptions.
- This repo uses Next.js 16 with React 19 and TypeScript.
- The chat UI is in `src/app/chat/page.tsx`.
- The API route is in `src/app/api/chat/route.ts`.
- The underlying AI model provider is `@ai-sdk/google`.

## Environment

Use a local `.env.local` file with:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

The Google provider typically reads `GOOGLE_GENERATIVE_AI_API_KEY` automatically. If you use a custom variable like `GEMINI_API_KEY`, pass it explicitly when creating the Google provider in code.

## Chat flow contract

The frontend uses `useChat()` from `@ai-sdk/react`, which sends a UI message payload with a `messages` array. The route must read `body.messages` and convert them with `convertToModelMessages()` before calling `streamText()`.

Do not assume a raw `{ prompt }` request body. That will cause `AI_InvalidPromptError`.

## Current app routes

- `/` : app landing page
- `/chat` : chat interface
- `/api/chat` : streaming response route

## Run commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## Standard workflow for changes

1. Inspect the relevant route or page first.
2. Keep the chat payload contract aligned with `useChat()`.
3. Prefer streaming responses via `result.toUIMessageStreamResponse()` or `createUIMessageStreamResponse()`.
4. Validate the affected file with a focused lint/type check before finishing.

## Notes for AI agents

- Do not rewrite the project into a generic starter template.
- Do not assume any direct environment variable names beyond the actual configured Google provider behavior.
- Keep the app’s UI and API aligned with the AI SDK patterns used here.
- If you update the chat flow, also ensure the backend route matches the frontend payload format.

## Next.js note

This repo contains the standard Next.js agent banner in AGENTS.md; the rest of this guide is the project-specific instructions that matter for coding work here.
