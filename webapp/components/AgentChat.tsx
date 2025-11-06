'use client';

import { FormEvent, useMemo, useRef, useState } from "react";
import { doctors, Doctor } from "@/lib/doctors";
import { humanReadableSlotRange, inferSpecialty } from "@/lib/agent";

type Message = {
  id: string;
  role: "agent" | "user";
  content: string;
};

type ConversationStage = "symptom" | "location" | "time" | "review" | "complete";

type Conversation = {
  reason?: string;
  specialty?: string;
  rationale?: string;
  city?: string;
  preferredType?: "virtual" | "in_person";
  preferredTimeOfDay?: "morning" | "afternoon" | "evening";
  doctorId?: string;
  slotId?: string;
  confirmed?: boolean;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "agent",
    content:
      "Hi, I'm Nova, your care coordination agent. Tell me what you'd like help with and I'll line up the right doctor and appointment window for you.",
  },
];

const yesKeywords = ["yes", "yep", "sure", "book", "confirm", "sounds good"];
const noKeywords = ["no", "not yet", "later", "different", "change"];

export default function AgentChat() {
  const [stage, setStage] = useState<ConversationStage>("symptom");
  const [conversation, setConversation] = useState<Conversation>({});
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const idCounterRef = useRef(0);

  const selectedDoctor = useMemo(() => {
    if (!conversation.doctorId) return undefined;
    return doctors.find((doc) => doc.id === conversation.doctorId);
  }, [conversation.doctorId]);

  const selectedSlot = useMemo(() => {
    if (!conversation.slotId || !selectedDoctor) return undefined;
    return selectedDoctor.availability.find((slot) => slot.id === conversation.slotId);
  }, [conversation.slotId, selectedDoctor]);

  function scrollToInput() {
    inputRef.current?.focus();
  }

  function appendMessages(newMessages: Message[]) {
    setMessages((prev) => [...prev, ...newMessages]);
    setTimeout(scrollToInput, 120);
  }

  function nextId(prefix: string) {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }

  function handleUserMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) return;

    const userMessage: Message = {
      id: nextId("user"),
      role: "user",
      content: trimmed,
    };

    setInputValue("");
    appendMessages([userMessage]);

    setTimeout(() => {
      runAgentStep(trimmed.toLowerCase());
    }, 250);
  }

  function runAgentStep(rawInput: string) {
    const responses: Message[] = [];

    if (stage === "symptom") {
      const { specialty, confidence, rationale } = inferSpecialty(rawInput);

      setConversation((prev) => ({
        ...prev,
        reason: rawInput,
        specialty,
        rationale,
      }));

      responses.push({
        id: nextId("agent"),
        role: "agent",
        content: `Thanks for sharing. Based on what you described, I recommend starting with **${specialty}** (confidence ${(confidence * 100).toFixed(
          0
        )}%). ${rationale} What city or neighborhood should I look near?`,
      });

      setStage("location");
    } else if (stage === "location") {
      setConversation((prev) => ({
        ...prev,
        city: rawInput,
      }));

      responses.push({
        id: nextId("agent"),
        role: "agent",
        content:
          "Great, noted. Do you have a preference for virtual or in-person care? Let me know any timing constraints (morning, afternoon, evening).",
      });

      setStage("time");
    } else if (stage === "time") {
      const typePreference = detectVisitType(rawInput);
      const timePreference = detectTimeOfDay(rawInput);

      setConversation((prev) => ({
        ...prev,
        preferredType: typePreference ?? prev.preferredType,
        preferredTimeOfDay: timePreference ?? prev.preferredTimeOfDay,
      }));

      const suggestion = generateAppointmentSuggestion({
        specialty: conversation.specialty,
        preferredType: typePreference ?? conversation.preferredType,
        preferredTimeOfDay: timePreference ?? conversation.preferredTimeOfDay,
      });

      if (!suggestion) {
        responses.push({
          id: nextId("agent"),
          role: "agent",
          content:
            "I couldn't find an exact match for that time frame, but I can widen the search. Could you share a different preference or a date range?",
        });
        appendMessages(responses);
        return;
      }

      setConversation((prev) => ({
        ...prev,
        doctorId: suggestion.doctor.id,
        slotId: suggestion.slot.id,
      }));

      responses.push({
        id: nextId("agent"),
        role: "agent",
        content: `Here's what I found:\n\n- **${suggestion.doctor.name}** (${suggestion.doctor.specialty})\n- ${suggestion.doctor.location}\n- ${humanReadableSlotRange(
          suggestion.slot.start,
          suggestion.slot.end
        )} (${suggestion.slot.type === "virtual" ? "Virtual" : "In-person"})\n\nShould I lock this in for you?`,
      });

      setStage("review");
    } else if (stage === "review") {
      if (yesKeywords.some((keyword) => rawInput.includes(keyword))) {
        responses.push({
          id: nextId("agent"),
          role: "agent",
          content:
            "Booked! I sent a confirmation email with check-in instructions, forms, and rescheduling links. Anything else you want me to take care of?",
        });
        setConversation((prev) => ({
          ...prev,
          confirmed: true,
        }));
        setStage("complete");
      } else if (noKeywords.some((keyword) => rawInput.includes(keyword))) {
        responses.push({
          id: nextId("agent"),
          role: "agent",
          content:
            "No worries. Tell me what you'd like to adjust (different doctor, location, or timing) and I'll keep searching.",
        });
        setStage("time");
      } else {
        responses.push({
          id: nextId("agent"),
          role: "agent",
          content:
            "Got it. Just let me know if that option works or what you'd tweak, and I'll update the booking plan.",
        });
      }
    } else if (stage === "complete") {
      responses.push({
        id: nextId("agent"),
        role: "agent",
        content:
          "I'm here for anything else - need lab work, medication refills, or a follow-up? Just say the word.",
      });
    }

    appendMessages(responses);
  }

  const summaryItems = useMemo(() => {
    const items = [
      conversation.reason
        ? {
            label: "Visit reason",
            value: sentenceCase(conversation.reason),
          }
        : null,
      conversation.specialty
        ? {
            label: "Suggested specialty",
            value: conversation.specialty,
          }
        : null,
      conversation.city
        ? {
            label: "Location focus",
            value: sentenceCase(conversation.city),
          }
        : null,
      conversation.preferredType
        ? {
            label: "Visit format",
            value: conversation.preferredType === "virtual" ? "Virtual" : "In-person",
          }
        : null,
      selectedDoctor && selectedSlot
        ? {
            label: "Current match",
            value: `${selectedDoctor.name} - ${humanReadableSlotRange(
              selectedSlot.start,
              selectedSlot.end
            )}`,
          }
        : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return items;
  }, [conversation, selectedDoctor, selectedSlot]);

  return (
    <section className="grid grid-cols-1 gap-6 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl shadow-sky-900/5 backdrop-blur md:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] md:p-10">
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">
            AI Care Coordination Agent
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Nova handles triage, scheduling, and follow-ups in seconds.
          </h2>
          <p className="max-w-xl text-sm text-slate-600">
            Share your concerns and Nova will map them to the right doctor, cross-check schedules,
            and book a slot while keeping you in the loop.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1 text-sm">
            {messages.map((message) => {
              const isAgent = message.role === "agent";
              return (
                <div key={message.id} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      isAgent ? "bg-white text-slate-800 ring-1 ring-slate-200" : "bg-sky-600 text-white"
                    }`}
                  >
                    <div
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3" onSubmit={handleUserMessage}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={
                stage === "symptom"
                  ? "Example: I've had a persistent cough with low fever for 3 days"
                  : stage === "location"
                    ? "Example: Brooklyn Heights or anywhere nearby"
                    : stage === "time"
                      ? "Example: Ideally a virtual visit mid-morning"
                      : "Let Nova know what to do next"
              }
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <aside className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-6">
        <h3 className="text-lg font-semibold text-sky-900">Live care plan</h3>
        <p className="text-sm text-sky-800/80">
          Nova continuously syncs provider availability, insurance rules, and patient preferences.
        </p>
        <dl className="mt-2 space-y-3 text-sm">
          {summaryItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-sky-200 bg-white/60 p-4 text-sky-700">
              Answer a few quick questions to unlock personalised doctor matches.
            </div>
          ) : (
            summaryItems.map((item) => (
              <div key={item.label} className="rounded-xl bg-white/70 px-4 py-3 shadow-sm shadow-sky-900/5">
                <dt className="text-xs uppercase tracking-wide text-sky-700">{item.label}</dt>
                <dd className="mt-1 text-sky-900">{item.value}</dd>
              </div>
            ))
          )}
        </dl>

        <div className="mt-auto rounded-xl bg-white/80 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Agent actions</p>
          <ul className="mt-2 space-y-1">
            <li>- Triage symptoms against care pathways</li>
            <li>- Score physician matches and availability</li>
            <li>- Pre-fill intake forms & insurance checks</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}

function detectVisitType(input: string): Conversation["preferredType"] {
  if (input.includes("virtual") || input.includes("online") || input.includes("tele") || input.includes("video")) {
    return "virtual";
  }
  if (input.includes("in-person") || input.includes("office") || input.includes("clinic")) {
    return "in_person";
  }
  return undefined;
}

function detectTimeOfDay(input: string): Conversation["preferredTimeOfDay"] {
  if (input.includes("morning")) return "morning";
  if (input.includes("afternoon")) return "afternoon";
  if (input.includes("evening") || input.includes("after work")) return "evening";
  return undefined;
}

function generateAppointmentSuggestion({
  specialty,
  preferredType,
  preferredTimeOfDay,
}: {
  specialty?: string;
  preferredType?: Conversation["preferredType"];
  preferredTimeOfDay?: Conversation["preferredTimeOfDay"];
}):
  | {
      doctor: Doctor;
      slot: Doctor["availability"][number];
    }
  | undefined {
  if (!specialty) return undefined;

  const matchingDoctors = doctors.filter((doctor) => doctor.specialty === specialty);

  const scoring = matchingDoctors
    .map((doctor) => {
      const slots = [...doctor.availability].sort(
        (first, second) => new Date(first.start).getTime() - new Date(second.start).getTime()
      );

      const scoredSlot = slots.find((slot) => {
        if (preferredType && slot.type !== preferredType) return false;

        if (preferredTimeOfDay) {
          const hour = new Date(slot.start).getHours();
          if (preferredTimeOfDay === "morning" && hour >= 12) return false;
          if (preferredTimeOfDay === "afternoon" && (hour < 12 || hour >= 17)) return false;
          if (preferredTimeOfDay === "evening" && hour < 17) return false;
        }

        return true;
      });

      return {
        doctor,
        slot: scoredSlot ?? slots[0],
      };
    })
    .filter((match) => Boolean(match.slot));

  return scoring[0];
}

function sentenceCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMarkdown(content: string) {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}
