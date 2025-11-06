import Hero from "@/components/Hero";
import AgentChat from "@/components/AgentChat";
import DoctorShowcase from "@/components/DoctorShowcase";
import Workflow from "@/components/Workflow";
import MetricsPanel from "@/components/MetricsPanel";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 sm:py-16">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <Hero />
        <MetricsPanel />
        <AgentChat />
        <DoctorShowcase />
        <Workflow />
        <CallToAction />
      </main>
      <footer className="mx-auto mt-16 flex w-full max-w-6xl items-center justify-between px-4 pb-8 text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>Nova Health Agents</p>
        <p>HIPAA-ready - SOC2 Type II - Vercel deploy</p>
      </footer>
    </div>
  );
}
