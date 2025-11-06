'use client';

const steps = [
  {
    id: 1,
    title: "Intake orchestration",
    description:
      "Nova captures symptoms, insurance, and constraints in natural language and structures it into the scheduling graph.",
    metrics: ["Triaged in <20s", "Eligibility synced", "Risk flags surfaced"],
  },
  {
    id: 2,
    title: "Agent matchmaking",
    description:
      "The coordination layer ranks physicians by specialty strength, bedside ratings, and real-time inventory pulled from EHR feeds.",
    metrics: ["Physician fit scoring", "Dynamic waitlist swaps", "Outcome predictions"],
  },
  {
    id: 3,
    title: "Autonomous booking",
    description:
      "Once approved, Nova books instantly, pre-fills intake packets, and triggers reminders across SMS, email, and in-app.",
    metrics: ["Zero-click confirmations", "Auto follow-ups", "Patient NPS +42"],
  },
];

export default function Workflow() {
  return (
    <section className="rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl shadow-slate-900/40">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-200">Operating system</p>
        <h2 className="text-3xl font-semibold">How the booking agents collaborate</h2>
        <p className="max-w-2xl text-sm text-slate-200/80">
          A multi-agent mesh handles everything from intake to confirmation, reducing manual work for care teams.
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-inner shadow-sky-900/30"
          >
            <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-sky-200">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-100">
                0{step.id}
              </span>
              <p>{step.title}</p>
            </div>
            <p className="text-sm text-slate-100/90">{step.description}</p>
            <ul className="mt-auto space-y-2 text-xs text-slate-100/80">
              {step.metrics.map((metric) => (
                <li key={metric} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2">
                  {metric}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
