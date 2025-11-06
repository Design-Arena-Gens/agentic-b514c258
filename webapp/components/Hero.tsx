'use client';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-16 shadow-xl shadow-slate-900/10 md:px-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.1),_transparent_60%)]" />
      <div className="max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-medium text-sky-700">
          <span>Nova Agent Mesh</span>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span>Doctor scheduling reimagined</span>
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          AI agents that triage, match, and book doctor appointments end-to-end.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Give Nova the signal and it orchestrates every step: eligibility, best-fit providers, and instant
          confirmations. Build on a platform designed for healthcare operations and deploy to patients in days.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Launch demo environment
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700">
            Integrate with Epic
          </button>
        </div>
        <div className="grid gap-4 text-xs text-slate-500 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="font-semibold text-slate-700">Structured intake</p>
            <p className="mt-1 text-slate-500">Free-form chat becomes structured booking data automatically.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="font-semibold text-slate-700">Agent-to-agent handoffs</p>
            <p className="mt-1 text-slate-500">
              Scheduling agent collaborates with billing, reminders, and documentation agents.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="font-semibold text-slate-700">Compliance ready</p>
            <p className="mt-1 text-slate-500">HIPAA controls, audit logs, and consent baked in.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
