const features = [
  {
    title: "Instant knowledge retrieval",
    description:
      "Upload PDFs and turn them into searchable, AI-ready knowledge that your assistant can answer from instantly.",
  },
  {
    title: "Private business context",
    description:
      "Keep your internal documents, training material, and policy references in one secure, structured knowledge base.",
  },
  {
    title: "Chat with your files",
    description:
      "Ask natural-language questions and get grounded answers based on the content you’ve added to the system.",
  },
];

const stats = [
  { value: "1 click", label: "PDF ingestion" },
  { value: "AI", label: "knowledge layer" },
  { value: "24/7", label: "assistant access" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#020817_0%,#0f172a_100%)] dark:text-slate-100">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10 dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-slate-950/40">
          <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg shadow-slate-300/50 dark:bg-white dark:text-slate-900 dark:shadow-slate-950/40">
                  R
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    VerityAI
                  </p>
                </div>
              </div>

              <a
                href="/chat"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              >
                Open demo
              </a>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="mb-6 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                  AI knowledge workspace
                </div>

                <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                  Turn documents into an always-on AI assistant.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Upload PDFs, organize your knowledge base, and let your team
                  ask questions in plain English. Clean, context-aware answers
                  from the information that matters most to your business.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="/chat"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-slate-900/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Try VerityAI
                  </a>
                  <a
                    href="/upload"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                  >
                    Upload knowledge base PDF
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                  <span>PDF ingestion</span>
                  <span>Semantic search</span>
                  <span>Grounded answers</span>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.22)] dark:border-slate-700">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-300">
                      Live knowledge
                    </span>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm">
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-indigo-100">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-300">
                        User
                      </p>
                      <p className="mt-2 leading-6">
                        What are the key onboarding steps for new customers?
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-100">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                        Assistant
                      </p>
                      <p className="mt-2 leading-6">
                        Based on your onboarding guide, customers should
                        complete the discovery call, review the setup checklist,
                        and confirm their access configuration before launch.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-slate-950/30"
            >
              <div className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-400">
            Why teams use it
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Built for fast, reliable knowledge delivery
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-slate-950/30"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white dark:bg-white dark:text-slate-900">
                0{index + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
