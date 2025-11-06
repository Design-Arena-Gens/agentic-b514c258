'use client';

export default function CallToAction() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-white shadow-xl shadow-slate-900/40">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">Launch in your clinic</p>
          <h2 className="text-3xl font-semibold">
            Bring autonomous scheduling to patients and care teams in less than 30 days.
          </h2>
          <p className="text-sm text-slate-200">
            Connect Nova to your practice management system, upload provider rosters, and our agents train on your
            pathways. No engineering backlog needed.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
            Book a strategy session
          </button>
          <button className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-sky-400 hover:text-sky-300">
            Download implementation playbook
          </button>
        </div>
      </div>
    </section>
  );
}
