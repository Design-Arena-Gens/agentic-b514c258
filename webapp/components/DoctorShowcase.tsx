'use client';

import Image from "next/image";
import { doctors } from "@/lib/doctors";
import { humanReadableSlotRange } from "@/lib/agent";

export default function DoctorShowcase() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            Physician graph
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Top matches ready to book</h2>
          <p className="max-w-2xl text-sm text-slate-600">
            Verified providers surfaced by Nova&apos;s agent network. Each match combines specialty fit,
            bedside rating, and open inventory.
          </p>
        </div>
        <button className="inline-flex h-11 items-center rounded-full border border-slate-200 px-6 text-sm font-medium text-slate-800 transition hover:border-sky-300 hover:text-sky-700">
          View provider graph
        </button>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-sky-900/5"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white shadow ring-2 ring-sky-100">
                <Image
                  src={doctor.avatar}
                  alt={doctor.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
                <p className="text-sm text-slate-600">{doctor.specialty}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {doctor.yearsExperience} yrs experience - rating {doctor.rating.toFixed(1)}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600">{doctor.bio}</p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Focus areas</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.focus.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Earliest availability</h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                {doctor.availability.slice(0, 3).map((slot) => (
                  <li key={slot.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                    <span className="font-medium text-slate-900">{humanReadableSlotRange(slot.start, slot.end)}</span>
                    <span className="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-700">
                      {slot.type === "virtual" ? "Virtual" : "In-person"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-2 text-xs text-slate-500">
              <p>{doctor.location}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">{doctor.languages.join(", ")}</span>
                <button className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-sky-500">
                  Brief this agent
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
