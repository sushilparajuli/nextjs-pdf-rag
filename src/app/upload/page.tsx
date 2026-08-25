import { auth } from "@clerk/nextjs/server";

import { PDFUploadForm } from "./PDFUploadForm";

export default async function UploadPage() {
  const { sessionClaims } = await auth();
  console.log(sessionClaims);

  const isAdmin =
    (sessionClaims as { metadata?: { role?: string } } | undefined)?.metadata
      ?.role === "admin";
  console.log(isAdmin);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Knowledge Base
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Upload PDF to train the assistant
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Add a PDF to the knowledge base. The app extracts the text, chunks
              it into searchable parts, generates embeddings, and makes it
              available for AI answers in the chatbot.
            </p>
          </div>
          {/* 
          {isAdmin && (
            <a
              href="#upload-knowledge-base"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Upload Knowledge Base PDF
            </a>
          )} */}
        </header>

        {isAdmin ? (
          <PDFUploadForm />
        ) : (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm ring-1 ring-amber-100">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Access required
              </p>
              <h2 className="mt-3 text-3xl font-bold text-amber-900">
                You don’t have permission to upload
              </h2>
              <p className="mt-4 text-base leading-7 text-amber-800">
                Please contact{" "}
                <a
                  href="mailto:sushilparajuli2010@gmail.com?subject=Knowledge%20Base%20Access"
                  className="font-semibold text-amber-900 underline underline-offset-4"
                >
                  sushilparajuli2010@gmail.com
                </a>{" "}
                to get access.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
