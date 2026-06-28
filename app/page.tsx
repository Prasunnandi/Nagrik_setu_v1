'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Map, 
  Send, 
  FileText, 
  ShieldAlert, 
  BarChart3, 
  Smartphone, 
  Play, 
  Database,
  Building,
  UserCheck,
  Linkedin,
  Github,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. File Complaint",
      desc: "Snapping a photo of a pothole or pile of garbage on WhatsApp, Telegram, or Web Chat immediately registers the complaint.",
      badge: "Citizen Action",
      color: "var(--ns-sf)"
    },
    {
      title: "2. Autonomous Routing",
      desc: "Nagrik Setu AI analyzes the image, identifies the ward boundary (e.g. Ward 57 Kolkata), and logs it into the municipal database.",
      badge: "AI Classification",
      color: "#2563eb"
    },
    {
      title: "3. Fake Closure Dispute",
      desc: "If an officer closes the complaint without uploading valid resolution photo proof, the AI automatically flags it as a Fake Closure.",
      badge: "Fraud Detection",
      color: "#ea4335"
    },
    {
      title: "4. Auto-Drafted RTI",
      desc: "If repairs are delayed beyond the SLA, the AI automatically drafts a legally compliant RTI petition to demand accountability.",
      badge: "Legal Escalation",
      color: "#ca8a04"
    },
    {
      title: "5. Ward Grade Impact",
      desc: "Resolutions, delays, and councillor direct actions directly impact the ward's public performance scorecard.",
      badge: "Accountability",
      color: "#16a34a"
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col selection:bg-orange-200 selection:text-orange-950"
      style={{ background: 'var(--ns-bg)', color: 'var(--ns-ink)' }}
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F2E8]/80 border-b border-[#E3DDD0] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#1B1108] text-[#F7F2E8] text-sm font-black p-2 rounded-lg leading-none" style={{ fontFamily: "'Space Mono', monospace" }}>
            न स
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              नागरिक सेतु <span className="text-xs text-orange-600 font-semibold ml-1">NAGRIK SETU</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">Civic Accountability AI</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Firestore Online
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Telegram Live
          </div>
        </div>

        <div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white shadow-md transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--ns-ink)' }}
          >
            Launch Portal
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative px-4 lg:px-8 pt-16 pb-20 max-w-6xl mx-auto w-full text-center space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E3DDD0] bg-white/50 text-xs font-medium" style={{ fontFamily: "'Space Mono', monospace" }}>
            <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-bold">2222 ✓</span>
            <span>India&apos;s First Autonomous Civic AI Agent</span>
          </div>
          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-orange-950 animate-float" style={{ fontFamily: "'Space Mono', monospace" }}>
            <div className="absolute inset-0 rounded-full animate-glow-border opacity-20 -z-10" />
            <div className="absolute inset-[1px] rounded-full bg-orange-50/90 -z-10" />
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">VIBE2SHIP</span>
            <span>Google for Developers x Coding Ninjas Hackathon</span>
          </div>
        </div>

        <h2 
          className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] animate-fade-in-up delay-200"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Empowering Citizens. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-700">
            Automating Accountability.
          </span>
        </h2>

        <p className="text-sm md:text-lg max-w-2xl mx-auto leading-relaxed text-gray-600 animate-fade-in-up delay-300">
          Nagrik Setu is an autonomous agent that files complaints, detects fake officer resolutions, and automatically drafts RTI petitions. Connected directly to WhatsApp and Telegram in realtime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up delay-400">
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold px-7 py-3.5 rounded-xl text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--ns-ink)' }}
          >
            Launch Citizen Portal
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://t.me/nagriksetu_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-bold px-7 py-3.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={15} className="text-blue-500" />
            Message Bot on Telegram
          </a>
        </div>

        {/* Live System Preview Frame */}
        <div className="relative border border-[#E3DDD0] rounded-2xl shadow-2xl overflow-hidden bg-white/50 backdrop-blur-sm max-w-4xl mx-auto mt-12 transition-all hover:shadow-orange-100 hover:scale-[1.01] duration-300 animate-fade-in-up delay-500">
          <div className="bg-[#1B1108]/5 border-b border-[#E3DDD0] px-4 py-2.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
              Live Civic Dashboard
            </div>
            <div className="w-6" />
          </div>
          <div className="p-4 md:p-8 flex flex-col md:flex-row gap-6 items-center text-left">
            <div className="flex-1 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
                  <span>🆕 NEW REPORT FROM TELEGRAM</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-200 rounded">REALTIME</span>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  &ldquo;Gorabazar near Dum Dum has a major road pothole disrupting traffic.&rdquo;
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span>ID: NG-KOL-20260628-9812</span>
                  <span>FILED IN WARD 57</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <Database size={14} className="text-orange-600" />
                <span>Automatically saved to Firestore collection &amp; synced to live map.</span>
              </div>
            </div>
            <div className="w-full md:w-72 bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
                LIVE STATISTICS
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="text-xl font-extrabold text-[#1B1108]">92%</div>
                  <div className="text-[9px] text-gray-400 font-semibold uppercase">Resolutions</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="text-xl font-extrabold text-[#ea4335]">27</div>
                  <div className="text-[9px] text-gray-400 font-semibold uppercase">Fake Closures Flagged</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="text-xl font-extrabold text-[#ca8a04]">18</div>
                  <div className="text-[9px] text-gray-400 font-semibold uppercase">RTI Drafts Generated</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <div className="text-xl font-extrabold text-green-600">144</div>
                  <div className="text-[9px] text-gray-400 font-semibold uppercase">Wards Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-Step Accountablity Journey ── */}
      <section className="px-4 lg:px-8 py-16 border-t border-[#E3DDD0] bg-white/40">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>
              The 5-Step Civic Accountability Journey
            </h3>
            <p className="text-xs md:text-sm text-gray-500 max-w-xl mx-auto">
              How Nagrik Setu bypasses bureaucratic delay and forces direct administrative response.
            </p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 flex flex-col gap-2">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-4 rounded-xl transition-all border ${
                    activeStep === idx 
                      ? 'bg-white shadow-md border-orange-200' 
                      : 'border-transparent hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.title}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{s.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{s.desc}</p>
                </button>
              ))}
            </div>

            <div key={activeStep} className="md:col-span-7 bg-[#1B1108] text-[#F7F2E8] p-6 rounded-2xl shadow-xl min-h-[220px] flex flex-col justify-between relative overflow-hidden animate-scale-in-up">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -z-10" />
              <div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Active Stage {activeStep + 1}
                </span>
                <h4 className="text-xl font-bold mt-2 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {steps[activeStep].title.substring(3)}
                </h4>
                <p className="text-xs md:text-sm leading-relaxed text-gray-300">
                  {steps[activeStep].desc}
                </p>
              </div>
              <div className="border-t border-white/10 mt-6 pt-4 flex justify-between items-center text-xs">
                <span className="text-gray-400">Status: Automated</span>
                <Link href="/dashboard" className="text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-1">
                  Interact in Dashboard
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Technology Columns ── */}
      <section className="px-4 lg:px-8 py-20 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Built for Real-World Implementation
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Engineered with a robust stack to support GCP Cloud Run and high scaling.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E3DDD0] space-y-4 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Map size={20} />
            </div>
            <h4 className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Realtime Geographic Visuals</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Google Maps integration plotting active municipal ward polygons, severity colors, and clusters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3DDD0] space-y-4 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Smartphone size={20} />
            </div>
            <h4 className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Omni-Channel Messengers</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Full webhook processing endpoints for Telegram and WhatsApp with conversational status tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3DDD0] space-y-4 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <ShieldAlert size={20} />
            </div>
            <h4 className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Fake Closure Protection</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Maintains accountability using computer vision verification on official resolution photos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3DDD0] space-y-4 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <FileText size={20} />
            </div>
            <h4 className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Auto-Compiled RTIs</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Automated PDF compiler that generates legally compliant right-to-information (RTI) petitions.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-4 lg:px-8 pb-20 max-w-5xl mx-auto w-full">
        <div className="bg-[#1B1108] text-[#F7F2E8] p-8 md:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,96,10,0.15),transparent)] pointer-events-none" />
          <h3 className="text-2xl md:text-4xl font-extrabold max-w-xl mx-auto leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to experience the future of citizen governance?
          </h3>
          <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto">
            Interact with the dashboard, view active ward scores, and test the Telegram-linked chatbot live.
          </p>
          <div className="pt-2">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold px-8 py-4 rounded-xl text-white shadow-lg transition-all hover:scale-105"
              style={{ background: 'var(--ns-sf)' }}
            >
              Enter Dashboard Portal
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-[#E3DDD0] bg-[#FAF8F5] px-4 lg:px-8 py-12 text-gray-600">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#1B1108] text-white flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-white select-none">
              PN
            </div>
            <h4 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prasun Nandi
            </h4>
            <p className="text-xs text-orange-600 font-bold tracking-wider uppercase">
              VIBE2SHIP Hackathon Developer
            </p>
          </div>

          {/* Bio/Intro */}
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            I am an aspiring Software and AI Engineer currently pursuing my B.Tech in Computer Science & Business Systems at Techno India University (2022–2026). With hands-on experience as an AI-ML Intern with Google for Developers & EduSkills, I specialize in building autonomous agents, cloud integrations, and data pipelines. I am passionate about leveraging cutting-edge AI to build products that solve real-world civic and enterprise challenges.
          </p>

          {/* Social Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a 
              href="mailto:prasunnandi18@gmail.com" 
              className="inline-flex items-center gap-2 text-xs bg-white border border-[#E3DDD0] px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-0.5 text-gray-700 font-semibold"
            >
              <Mail size={14} className="text-orange-600" />
              <span>prasunnandi18@gmail.com</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/prasunnandi-16-/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs bg-white border border-[#E3DDD0] px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-0.5 text-gray-700 font-semibold"
            >
              <Linkedin size={14} className="text-blue-600" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://github.com/Prasunnandi/Nagrik_setu_v1.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs bg-white border border-[#E3DDD0] px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-0.5 text-gray-700 font-semibold"
            >
              <Github size={14} className="text-gray-900" />
              <span>GitHub Repo</span>
            </a>
          </div>

          {/* Project Navigation Links */}
          <div className="flex items-center justify-center gap-4 text-xs pt-2">
            <a href="https://t.me/nagriksetu_bot" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400 font-medium">Telegram Bot</a>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard" className="hover:underline text-gray-400 font-medium">Citizen Dashboard</Link>
          </div>

          <div className="border-t border-[#E3DDD0]/60 pt-6 mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
              <p className="font-mono text-[10px] tracking-wide text-gray-500 bg-gray-100 border border-gray-200/60 px-3 py-1 rounded-full">
                nagrik-setu v1.0.0 .VIBE2SHIP | Google for Developers x Coding Ninjas Hackathon
              </p>
              <p>© 2026 nagrik-setu. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
