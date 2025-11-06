'use client';

const metrics = [
  {
    label: "Schedule conversion",
    value: "92%",
    description: "Patients who complete booking on first agent interaction.",
  },
  {
    label: "Staff time saved",
    value: "18 hrs",
    description: "Weekly admin hours reallocated from scheduling queues.",
  },
  {
    label: "Queue deflection",
    value: "4.6x",
    description: "More visits handled with the same coordination team.",
  },
];

export default function MetricsPanel() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-10 shadow-xl shadow-slate-900/10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">Impact metrics</p>
        <h2 className="text-3xl font-semibold text-slate-900">Operating at agent velocity</h2>
        <p className="max-w-2xl text-sm text-slate-600">
          Clinics stay focused on care delivery while Nova keeps the pipeline moving and patient ready.
        </p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm shadow-slate-900/5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-xs text-slate-500">{metric.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
