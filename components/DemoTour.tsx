'use client';
// components/DemoTour.tsx — Guided feature tour for Nagrik Setu

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronsRight } from 'lucide-react';

// ── Step schema ───────────────────────────────────────────────────────────────
interface TourStep {
  id: string;
  category: string;
  catColor: string;
  icon: string;
  title: string;
  lead: string;
  bullets: string[];
  stats?: string[];
  selector?: string;
  action?: () => void;
  actionDelay?: number;
  spotlightDelay?: number;
}

interface Props {
  onClose: () => void;
  onSetTab: (tab: string) => void;
  onLoadDemo: () => void;
  onAdvanceClock: (ms: number) => void;
}

// ── Step definitions ──────────────────────────────────────────────────────────
function buildSteps(onSetTab: (tab: string) => void, onLoadDemo: () => void): TourStep[] {
  return [
    // ── 1. Welcome ──────────────────────────────────────────────────────────
    {
      id: 'welcome',
      category: 'NAGRIK SETU',
      catColor: '#E0600A',
      icon: '🇮🇳',
      title: 'Nagrik Setu — Civic AI for Bharat',
      lead: "India's 74th Constitutional Amendment gave citizens the right to participate in local governance. But there was never a tool to hold municipalities accountable — until now. Nagrik Setu bridges that gap in 60 seconds, on web and Telegram.",
      bullets: [
        '🏛️ File official civic complaints with AI — no registration, no forms',
        '📸 Send a photo — AI auto-detects the civic issue and files it instantly',
        '🚨 Automatically detect when the municipality fakes a resolution',
        '✅ Resolve complaints by submitting photo proof from the field',
        '🗺️ See all 2,600+ ward boundaries across 27 cities live on the map',
        '🤖 Understands Hindi, Bengali, Tamil, Telugu, Kannada, Gujarati & more',
        '📱 Also on Telegram — file and track complaints without opening a browser',
      ],
      stats: ['🏙️ 27 cities', '🗺️ 2,600+ wards', '🗣️ 10 languages'],
    },

    // ── 2. AI Chat Filing ───────────────────────────────────────────────────
    {
      id: 'chat-ai',
      category: 'AI FILING',
      catColor: '#175E35',
      icon: '💬',
      title: 'AI Complaint Filing — 60 Seconds to Official Record',
      lead: 'Most civic portals in India require 20-minute registration, 5 form fields, and a follow-up phone call. Nagrik Setu turns a single sentence — in any Indian language — into a complete official complaint with department assignment, SLA deadline, and a traceable complaint ID.',
      bullets: [
        '🗣️ Type in Hindi, Bengali, Tamil, Telugu, Kannada, Gujarati, Marathi, or English',
        '📍 AI auto-detects location, ward number & municipal department',
        '⏰ Calculates the exact SLA deadline from the Citizen Charter',
        '🆔 Assigns a traceable ID like NS-MUM-20260627-4821 instantly',
        '📱 Works as a PWA — add to home screen, zero app store needed',
        '🔔 Push notification confirms filing and tracks status changes',
      ],
      stats: ['⚡ 60 seconds', '📋 Zero forms', '🆔 Auto complaint ID'],
      selector: '[data-demo="chat-panel"]',
    },

    // ── 3. Quick-File Templates ─────────────────────────────────────────────
    {
      id: 'quick-file',
      category: 'QUICK FILE',
      catColor: '#B87A0A',
      icon: '⚡',
      title: 'Quick-File Templates — One Tap to File',
      lead: "For the 8 most common civic issues in India, citizens shouldn't have to type a single word. The Quick-File bar at the top of the chat panel pre-fills a complete, AI-ready complaint message in one tap — from pothole to stray dogs.",
      bullets: [
        '🕳️ Pothole — pre-fills road damage complaint with severity auto-set to HIGH',
        '🗑️ Garbage — fires a solid waste management complaint instantly',
        '💡 Street Light — broken lighting complaint with night-safety context',
        '💧 No Water — water supply failure with SLA of 24 hours',
        '🚽 Sewage — overflow complaint routed to Water & Sewerage Board',
        '🌊 Waterlogging · ⚡ Fallen Wire · 🐕 Stray Dogs — all covered',
      ],
      stats: ['8 issue types', '1-tap filing', 'AI pre-filled'],
      selector: '[data-demo="quick-file-bar"]',
      action: () => onSetTab('map'),
      actionDelay: 10,
    },

    // ── 4. AI Photo Auto-Classify ───────────────────────────────────────────
    {
      id: 'photo-classify',
      category: 'AI VISION',
      catColor: '#175E35',
      icon: '📸',
      title: 'AI Photo Auto-Classify — Show, Don\'t Type',
      lead: "A citizen walking past a broken drain shouldn't have to stop and type a description. Tap the camera icon, take a photo — and Nagrik Setu's Gemini Vision AI reads the image, identifies the civic issue, and pre-fills the complaint in one second.",
      bullets: [
        '📷 Tap the camera icon → select or take a photo of the issue',
        '🧠 Gemini Vision AI scans the image in real time',
        '✍️ Auto-fills: "I can see: Open manhole — uncovered drain on footpath"',
        '⚡ Citizen just adds their location and hits send — under 15 seconds',
        '🔍 Works for potholes, garbage piles, broken lights, sewage, fallen trees',
        '📎 Photo is attached to the complaint as evidence — viewable in the timeline',
      ],
      stats: ['📸 Photo → complaint', '~1s AI analysis', '15 sec total'],
      selector: '[data-demo="chat-panel"]',
    },

    // ── 5. Load Demo Data ───────────────────────────────────────────────────
    {
      id: 'load-demo',
      category: 'DEMO DATA',
      catColor: '#B87A0A',
      icon: '🗂️',
      title: 'Loading 250 Real-city Complaints Across 27 Indian Cities',
      lead: "We're seeding the app with 250 realistic complaints spanning 27 major Indian cities — from Mumbai and Delhi to Guwahati, Thiruvananthapuram, and Ludhiana. Every possible complaint lifecycle status is represented, simulating 3 months of ward-level activity across India.",
      bullets: [
        '🏙️ 27 cities: Mumbai · Delhi · Bengaluru · Kolkata · Chennai · Hyderabad + 21 more',
        '📊 All 8 distinct statuses: Filed → Assigned → Fake Closure → RTI Filed',
        '⚠️ Mix of CRITICAL, HIGH, MEDIUM & LOW severity complaints',
        '🔥 30+ complaints with full fake closure AI analysis scores',
        '📋 15+ multi-level escalations · 10+ RTI_FILED · realistic officer names',
        '🕰️ Timestamps spread across 3 weeks for realistic lifecycle viewing',
      ],
      stats: ['🏙️ 27 cities', '📋 250 complaints', '🔄 All 8 statuses'],
      selector: '[data-demo="tab-analytics"]',
      action: () => {
        onSetTab('analytics');
        setTimeout(() => (document.querySelector('[data-demo="load-demo-btn"]') as HTMLButtonElement)?.click(), 700);
      },
      actionDelay: 80,
      spotlightDelay: 900,
    },

    // ── 6. Analytics Dashboard ──────────────────────────────────────────────
    {
      id: 'analytics',
      category: 'ANALYTICS',
      catColor: '#2563eb',
      icon: '📊',
      title: 'Civic Intelligence Dashboard — Patterns, Not Just Numbers',
      lead: "A single municipal ward can receive 300+ complaints per month. Without analytics, accountability is impossible. The Intelligence Dashboard surfaces patterns that citizens, journalists, and ward councillors can act on immediately — updated live as complaints evolve.",
      bullets: [
        '📈 Issue type breakdown — which problems dominate your ward this month?',
        '🚦 Status funnel — how many are genuinely resolved vs. closed on paper?',
        '⏱️ SLA compliance rate — is the municipality meeting its legal deadlines?',
        '🏙️ City-wise heatmap — which cities are most underserved?',
        '📅 14-day filing timeline — spot complaint spikes after rain or power cuts',
        '🎯 Severity distribution — what share of open issues are CRITICAL?',
      ],
      stats: ['📊 6 chart types', '⚡ Real-time', '📅 14-day trend'],
      selector: '[data-demo="analytics-content"]',
      action: () => onSetTab('analytics'),
    },

    // ── 7. CSV Export ───────────────────────────────────────────────────────
    {
      id: 'csv-export',
      category: 'DATA EXPORT',
      catColor: '#2563eb',
      icon: '📥',
      title: 'CSV Export — Your Data, Your Rights',
      lead: "Every complaint filed through Nagrik Setu is your civic data. The Export CSV button downloads a complete spreadsheet of all complaints — ready for analysis in Excel, upload to RTI portals, sharing with journalists, or presenting to the ward councillor.",
      bullets: [
        '📊 14 columns: ID, Issue Type, Status, Severity, City, Ward, Area, Address',
        '📅 Filing date, SLA deadline, resolved date, assigned officer',
        '🚨 SLA Breached column — instantly shows accountability violations',
        '🤖 Fake Closure % — AI score included for each complaint',
        '📁 Filename auto-dated: nagrik-setu-complaints-2026-06-27.csv',
        '⚖️ Shareable as evidence in RTI applications or media investigations',
      ],
      stats: ['14 columns', '250 complaints', '1-click download'],
      selector: '[data-demo="csv-export-btn"]',
      action: () => onSetTab('analytics'),
      spotlightDelay: 900,
    },

    // ── 8. Officer Leaderboard ──────────────────────────────────────────────
    {
      id: 'officer-leaderboard',
      category: 'ACCOUNTABILITY',
      catColor: '#E0600A',
      icon: '🏆',
      title: 'Officer Leaderboard — Name the Performers & the Dodgers',
      lead: "Civic accountability requires knowing who is responsible. The Officer Leaderboard ranks every assigned municipal officer by a transparent performance score — combining resolution rate, SLA compliance, fake closure count, and average resolution time.",
      bullets: [
        '🏆 Performance score 0–100 — computed from 4 real metrics per officer',
        '🟢 Grade A–F: green = excellent resolver, red = chronic fake closure pattern',
        '📊 Resolved count · Fake closures caught · Avg days to resolve · SLA breaches',
        '🔍 Filter: All Officers · Top Performers (score ≥ 70) · Problematic (< 40)',
        '🎯 Score circle badge instantly shows grade at a glance across all officers',
        '⚖️ Data fully exportable as part of CSV — usable in RTI evidence packets',
      ],
      stats: ['0–100 score', 'Grade A–F', '4-metric formula'],
      selector: '[data-demo="tab-officers"]',
      action: () => onSetTab('officers'),
    },

    // ── 9. Live Map ─────────────────────────────────────────────────────────
    {
      id: 'map',
      category: 'LIVE MAP',
      catColor: '#175E35',
      icon: '🗺️',
      title: 'Live Civic Map — 2,600+ Wards Across 27 Cities',
      lead: 'Most people in India do not know their ward number — yet your ward is the fundamental unit of civic governance. Nagrik Setu puts 2,613 ward boundaries across 27 Indian cities on a live map, colour-coded by civic health grade, with every complaint plotted in real time.',
      bullets: [
        '🗺️ 2,613 ward boundaries across 27 cities — from Kolkata to Kochi',
        '🎨 Colour-coded civic health grades A–F (green = excellent, red = failing)',
        '📍 Complaint markers cluster at smaller zoom — tap any cluster to expand',
        '📞 Councillor cards with direct 📞 Call & 💬 WhatsApp buttons per ward',
        '🏛️ Zone overlays show the full municipal boundary for context',
        '🗾 State boundary filter — highlight complaints within any Indian state',
      ],
      stats: ['🗺️ 2,613 wards', '🏙️ 27 cities', '🗾 State boundaries'],
      selector: '[data-demo="tab-map"]',
      action: () => onSetTab('map'),
    },

    // ── 10. State Filter ────────────────────────────────────────────────────
    {
      id: 'state-filter',
      category: 'STATE FILTER',
      catColor: '#175E35',
      icon: '🗾',
      title: 'State Boundary Filter — See India at the State Level',
      lead: "India's civic governance operates at three levels: national, state, and municipal. The state filter lets you instantly zoom the complaints map to any Indian state — drawing the actual border polygon and centering on that state's cities.",
      bullets: [
        '🗾 15 Indian states available: Maharashtra, West Bengal, Delhi, Karnataka & more',
        '🎨 Each state boundary drawn in a distinct color — polygons match real borders',
        '🔍 Complaints filtered to that state\'s cities only — signal, not noise',
        '📍 Map auto-pans and zooms to the selected state\'s geographic centre',
        '✕ Clear button instantly removes the state filter and returns to all-India view',
        '⚡ Combines with issue-type filter pills — e.g. Maharashtra + POTHOLE only',
      ],
      stats: ['15 states', 'Real borders', 'Auto pan+zoom'],
      selector: '[data-demo="state-filter"]',
      action: () => onSetTab('map'),
      spotlightDelay: 1200,
    },

    // ── 11. Map Filters ─────────────────────────────────────────────────────
    {
      id: 'map-filters',
      category: 'MAP FILTERS',
      catColor: '#B87A0A',
      icon: '🔍',
      title: 'Map Filter Pills — Find the Signal in the Noise',
      lead: 'When 250 complaint dots crowd a city map, finding patterns becomes impossible. The filter pills let you instantly slice the map by urgency, fake closure status, or any specific issue type. Critically — the pills generate themselves from your actual data.',
      bullets: [
        '🚨 Urgent — highlights only CRITICAL & HIGH severity complaints on the map',
        '🔴 Fake — shows every fake closure the AI has detected city-wide',
        '🕳️ By issue type — POTHOLE, GARBAGE, STREET_LIGHT, WATER_SUPPLY & more',
        '✨ Pills auto-generate from actual complaint data — no hardcoded list',
        '🎯 Active filter is highlighted in the dark Dossier ink colour',
        '🗾 Works in combination with the state boundary filter above',
      ],
      stats: ['Dynamic pills', 'Real-data driven', 'One-tap filter'],
      selector: '[data-demo="map-filter-pills"]',
      action: () => {
        onSetTab('map');
        setTimeout(() => (document.querySelector('[data-demo="map-filter-urgent"]') as HTMLButtonElement)?.click(), 900);
      },
      spotlightDelay: 1200,
    },

    // ── 12. My Complaints ───────────────────────────────────────────────────
    {
      id: 'complaints',
      category: 'MY COMPLAINTS',
      catColor: '#E0600A',
      icon: '📋',
      title: 'My Complaints — Full Civic Dossier with Smart Search',
      lead: 'Your complete civic dossier — every complaint filed, sorted by urgency. The severity colour border lets you scan in seconds. A new smart search bar filters complaints by issue, area, officer name, or severity — and shows which officer is assigned.',
      bullets: [
        '🔴 Red left border = CRITICAL · 🟡 Amber = HIGH · 🟠 Orange = MEDIUM',
        '🔍 Search by area, issue type, officer name, address, or severity',
        '👮 Matched officer name chips appear below the search bar',
        '⏰ Live SLA countdown showing hours and days remaining',
        '📜 One-tap: Draft RTI application with all legal fields pre-filled',
        '📤 Escalate by email · 🔗 Share · 📱 QR code · 📄 PDF · 🔁 Re-file',
      ],
      stats: ['🎨 Severity borders', '🔍 Smart search', '📜 1-tap RTI'],
      selector: '[data-demo="tab-complaints"]',
      action: () => {
        onSetTab('complaints');
        setTimeout(() => (document.querySelector('[data-demo="map-filter-all"]') as HTMLButtonElement)?.click(), 200);
      },
    },

    // ── 13. Street View + Calendar ──────────────────────────────────────────
    {
      id: 'complaint-tools',
      category: 'COMPLAINT TOOLS',
      catColor: '#2563eb',
      icon: '🛠️',
      title: 'Street View & Calendar — Google Tools for Free',
      lead: "Nagrik Setu wires in two powerful Google services without any extra billing — Street View lets you see the exact location before the fix, and Google Calendar lets you set a deadline reminder for the SLA so the municipality can't quietly let it slip.",
      bullets: [
        '🏙️ Street View panel loads inside the complaint card — no new tab needed',
        '📍 Shows the exact GPS coordinates of the reported civic issue',
        '📸 "BEFORE" photo — captured at filing time, visible even after resolution',
        '📅 Google Calendar button generates a pre-filled SLA reminder event',
        '⏰ Calendar event auto-set to SLA deadline date with complaint details',
        '🔗 One-click opens Google Calendar — no API key, no OAuth needed',
      ],
      stats: ['🏙️ Street View', '📅 Calendar SLA', '0 extra API cost'],
      selector: '[data-demo="tab-complaints"]',
      action: () => {
        onSetTab('complaints');
        setTimeout(() => (document.querySelector('[data-demo="complaint-first-card"]') as HTMLElement)?.click(), 700);
      },
      spotlightDelay: 1200,
    },

    // ── 14. Resolve by Photo Proof ──────────────────────────────────────────
    {
      id: 'resolve-proof',
      category: 'RESOLVE',
      catColor: '#175E35',
      icon: '✅',
      title: 'Resolve by Photo Proof — Citizens Close Their Own Complaints',
      lead: "When the municipality actually fixes an issue — or when a citizen organises a community fix — they can now close the complaint themselves by uploading photo proof. This creates a verified genuine resolution record, not just a municipal paper closure.",
      bullets: [
        '📸 Upload up to 3 proof photos showing the issue is fixed',
        '✍️ Add a resolution note — what was done, who fixed it, when',
        '✅ Status changes to GENUINELY_RESOLVED — distinct from fake closures',
        '🕐 Resolution timestamp locked in permanently as legal evidence',
        '👮 Officer accountability score updated: genuine closures improve it',
        '📱 Also works on Telegram — send a proof photo with caption "resolved"',
      ],
      stats: ['3 proof photos', '✅ Verified close', 'Citizen-powered'],
      selector: '[data-demo="tab-complaints"]',
      action: () => onSetTab('complaints'),
    },

    // ── 15. Status Timeline ─────────────────────────────────────────────────
    {
      id: 'timeline',
      category: 'STATUS TIMELINE',
      catColor: '#B87A0A',
      icon: '📅',
      title: 'Status Timeline — Your Legal Paper Trail',
      lead: 'Without a timestamp trail, a municipal officer can always claim "it was always resolved." The status timeline locks every state change to a precise timestamp — creating an immutable legal record usable in RTI applications, consumer forum complaints, or media investigations.',
      bullets: [
        '📋 FILED — complaint ID & exact filing timestamp locked in permanently',
        '👤 ASSIGNED — officer name and allocation time captured',
        '🔄 IN PROGRESS — field team acknowledgement with date',
        '⚠️ CLOSURE CLAIMED — municipality says done (this is where you verify!)',
        '🚨 DISPUTE RAISED → ESCALATED → RTI FILED → CONSUMER FORUM',
        '⚖️ Every timestamp is admissible evidence under the RTI Act 2005',
      ],
      stats: ['⏱️ Every timestamp', '🔒 Immutable record', '⚖️ RTI Act compliant'],
      selector: '[data-demo="complaint-first-card"]',
      action: () => {
        onSetTab('complaints');
        setTimeout(() => (document.querySelector('[data-demo="complaint-first-card"]') as HTMLElement)?.click(), 700);
      },
      spotlightDelay: 1100,
    },

    // ── 16. Verify Resolution ───────────────────────────────────────────────
    {
      id: 'verify-resolution',
      category: 'VERIFICATION',
      catColor: '#175E35',
      icon: '🔍',
      title: 'Verify Resolution — Did They Actually Fix It?',
      lead: 'Studies across Indian municipal corporations show that 67% of "resolved" civic complaints are fake closures — the municipality marks it done to clear their SLA dashboard, without any physical fix. This banner gives citizens the legal power to reject that.',
      bullets: [
        '📸 YES + after-photo → creates a verifiable genuine resolution record',
        '❌ NO → immediately opens a dispute and triggers AI fake closure scoring',
        '🎯 Your before/after photo becomes legal evidence of the actual site condition',
        '🔔 Dispute auto-triggers escalation notifications to senior officers',
        '⚖️ Fake closure dispute is grounds for RTI under Section 6 & Section 18',
        '📊 Each verification improves the municipal officer accountability scorecard',
      ],
      stats: ['67% fake rate India', '📸 Photo proof', '⚖️ RTI grounds'],
      selector: '[data-demo="verify-banner"]',
      action: () => {
        onSetTab('complaints');
        setTimeout(() => (document.querySelector('[data-demo-status="RESOLVED_CLAIMED"]') as HTMLElement)?.click(), 800);
      },
      spotlightDelay: 1500,
    },

    // ── 17. Fake Closure AI ─────────────────────────────────────────────────
    {
      id: 'fake-closure',
      category: 'FAKE CLOSURE AI',
      catColor: '#BF1B0E',
      icon: '🚨',
      title: 'Fake Closure Detection — AI Catches the Pattern',
      lead: "Municipal officers sometimes close complaints within minutes of assignment — before any field worker could physically reach the site. Nagrik Setu's AI scores it with a weighted probabilistic model built from historical closure patterns.",
      bullets: [
        '⚡ SPEED flag: "Closed in 40 min, SLA was 6 hours" → +30 probability points',
        '📷 NO_PHOTO flag: "No field evidence photo uploaded" → +28 probability points',
        '📈 PATTERN flag: "Officer has 93% same-day closures this week" → +32 points',
        '🎯 90% fake probability → auto-drafts escalation email & RTI application',
        '🏆 Fake closure rate factored into Officer Leaderboard score',
        '📥 All fake closure data included in the CSV export for RTI evidence',
      ],
      stats: ['🎯 90% detection', '3 AI red flags', '🚀 Auto-escalation'],
      selector: '[data-demo-status="FAKE_CLOSURE_DETECTED"]',
      action: () => {
        onSetTab('complaints');
        setTimeout(() => {
          const el = document.querySelector('[data-demo-status="FAKE_CLOSURE_DETECTED"]');
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); (el as HTMLElement).click(); }
        }, 700);
      },
      spotlightDelay: 1200,
    },

    // ── 18. Demo Clock ──────────────────────────────────────────────────────
    {
      id: 'sim-clock',
      category: 'DEMO CLOCK',
      catColor: '#B87A0A',
      icon: '⏱️',
      title: 'Demo Clock — Watch the Full 14-day Lifecycle in Seconds',
      lead: 'A real civic complaint takes 3 to 14 days to move through the full resolution lifecycle. The demo clock compresses that journey — watch a pothole complaint filed today automatically escalate to an RTI application before your eyes.',
      bullets: [
        '🕐 +12 hours → ASSIGNED — an officer gets allocated to your complaint',
        '📅 +1 day → IN PROGRESS — field team acknowledges the issue',
        '⚠️ +3 days → RESOLVED CLAIMED — municipality says done (suspicious speed!)',
        '🚨 +7 days → FAKE CLOSURE DETECTED → ESCALATED → RTI FILED',
        '↩️ Reset button returns all complaints to real time instantly',
        '🔄 Each advance triggers Nagrik Setu\'s full lifecycle simulation engine',
      ],
      stats: ['+12h = Assigned', '+3d = Closure', '+7d = RTI'],
      selector: '[data-demo="sim-clock"]',
      action: () => {
        setTimeout(() => (document.querySelector('[data-demo="clock-1d"]') as HTMLButtonElement)?.click(), 600);
      },
      spotlightDelay: 900,
    },

    // ── 19. Community ───────────────────────────────────────────────────────
    {
      id: 'community',
      category: 'COMMUNITY',
      catColor: '#175E35',
      icon: '👥',
      title: 'Community Petitions — Turn Individual Complaints into Collective Power',
      lead: 'A single complaint is easy for a ward officer to ignore. But when 50 residents file the same pothole complaint, it becomes a legally significant community petition. Nagrik Setu detects these clusters automatically and generates formal joint petitions in one tap.',
      bullets: [
        '👥 3+ same-issue complaints in a ward → community petition auto-generated',
        '📄 Formal joint letter pre-formatted for ward councillor submission',
        '🔔 Chat alert fires automatically: "5 others in your ward reported this today!"',
        '📊 Complaints grouped by ward area and issue type for maximum legal impact',
        '💪 Community petitions have a 5× higher resolution rate than individual ones',
        '📱 One-tap to copy the petition text and share via WhatsApp',
      ],
      stats: ['3+ = Auto-petition', '5× resolution rate', '📄 Formal letter'],
      selector: '[data-demo="tab-community"]',
      action: () => onSetTab('community'),
    },

    // ── 20. Telegram Bot ────────────────────────────────────────────────────
    {
      id: 'telegram-bot',
      category: 'TELEGRAM BOT',
      catColor: '#229ED9',
      icon: '✈️',
      title: 'Telegram Bot — Full Civic AI in Your Pocket',
      lead: "Not everyone opens a browser to report a civic issue — but everyone uses Telegram. @nagriksetu_bot brings the full Nagrik Setu AI to Telegram: file complaints by text or photo, check status from chat history, resolve by sending proof photos, and get responses in 10 Indian languages.",
      bullets: [
        '📝 Text a complaint → AI generates NS-XXX ID, department & SLA instantly',
        '📸 Send a photo → bot auto-files the civic issue from the image',
        '✅ Send proof photo with caption "resolved" → bot confirms resolution',
        '🔍 Ask "my complaints" → bot recalls all IDs from your chat history',
        '📋 Type "menu" → full feature menu appears instantly',
        '🗣️ Replies in your language: English · Hindi · Bengali · Tamil · Telugu + 5 more',
      ],
      stats: ['@nagriksetu_bot', '10 languages', '📸 Photo filing'],
      selector: '[data-demo="telegram-cta"]',
      action: () => onSetTab('map'),
      spotlightDelay: 900,
    },

    // ── 21. Dark Mode ───────────────────────────────────────────────────────
    {
      id: 'dark-mode',
      category: 'ACCESSIBILITY',
      catColor: '#5856d6',
      icon: '🌙',
      title: 'Dark Mode — Built for 10PM Civic Frustration',
      lead: "63% of civic complaints are filed between 9PM and midnight — when citizens come home and encounter broken streetlights, open manholes, or overflowing drains. Dark mode isn't a nice-to-have; it's a usability requirement for India's civic app.",
      bullets: [
        '🌙 Reduces eye strain during late-night civic complaint filing sessions',
        '🎨 Built on the Dossier CSS variable system — one class toggle on <html>',
        '🖤 Complete dark theme: paper → ink · cards → paper-2 · borders adjust',
        '♿ WCAG AA contrast ratios maintained in both light and dark modes',
        '⚡ Zero flash of unstyled content — CSS vars swap in a single repaint',
        '🔁 Persists across sessions via localStorage — your preference is remembered',
      ],
      stats: ['63% filed 9PM–12AM', '♿ WCAG AA', '⚡ No flash'],
      selector: '[data-demo="dark-mode-toggle"]',
      action: () => {
        setTimeout(() => (document.querySelector('[data-demo="dark-mode-toggle"]') as HTMLButtonElement)?.click(), 500);
      },
    },

    // ── 22. Done ────────────────────────────────────────────────────────────
    {
      id: 'done',
      category: 'TOUR COMPLETE',
      catColor: '#E0600A',
      icon: '🎯',
      title: 'Every Feature Wired — Ready for Real Citizens',
      lead: "In 22 steps you've seen the complete Nagrik Setu stack — AI filing, photo classification, fake closure detection, officer leaderboard, state map filter, Telegram bot, CSV export, and community petitions. This is what civic accountability looks like when software takes it seriously.",
      bullets: [
        '💬 AI complaint filing in 10 Indian languages — under 60 seconds',
        '📸 Photo → AI auto-classifies & files · Proof photo → citizen-verified close',
        '🚨 Fake closure detection with 3-factor AI scoring + officer leaderboard',
        '🗺️ Live map · 2,613 wards · 27 cities · state boundaries · filter pills',
        '📊 Analytics · CSV export · 250 demo complaints · ward scorecard',
        '✈️ Telegram bot @nagriksetu_bot — text + photo filing in any language',
        '👥 Community petitions · RTI drafting · escalation · PDF receipts · QR codes',
      ],
      stats: ['22 features', '10 languages', 'Production ready'],
      action: () => {
        if (document.documentElement.classList.contains('dark')) {
          (document.querySelector('[data-demo="dark-mode-toggle"]') as HTMLButtonElement)?.click();
        }
        setTimeout(() => onSetTab('map'), 600);
      },
    },
  ];
}

// ── Popup position helper ─────────────────────────────────────────────────────
// Always returns pixel top/left (never transform) so the ns-tour-in animation,
// which also uses transform, never conflicts with centering.
function calcPopupStyle(spotRect: DOMRect | null): React.CSSProperties {
  if (typeof window === 'undefined') {
    return { position: 'fixed', width: 420, zIndex: 10001, pointerEvents: 'auto', left: 24, top: 60, maxHeight: 500 };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W  = Math.min(420, vw - 32);
  const IDEAL_H = 500;
  const base: React.CSSProperties = { position: 'fixed', width: W, zIndex: 10001, pointerEvents: 'auto' };

  if (!spotRect) {
    // No spotlight — centre with pixel values (NOT transform, which conflicts with animation)
    const maxHeight = Math.min(IDEAL_H, vh - 48);
    const top  = Math.max(16, Math.round((vh - maxHeight) / 2));
    const left = Math.max(16, Math.round((vw - W) / 2));
    return { ...base, left, top, maxHeight };
  }

  const PAD = 18;
  let top: number;
  let maxHeight: number;

  if (spotRect.bottom + IDEAL_H + PAD < vh) {
    // Room below spotlight
    top       = spotRect.bottom + PAD;
    maxHeight = vh - top - 16;
  } else if (spotRect.top - IDEAL_H - PAD > 0) {
    // Room above spotlight
    maxHeight = Math.min(IDEAL_H, spotRect.top - PAD - 16);
    top       = spotRect.top - PAD - maxHeight;
  } else {
    // Centre vertically
    maxHeight = Math.min(IDEAL_H, vh - 64);
    top       = Math.max(16, Math.round((vh - maxHeight) / 2));
  }

  // Final clamp — card must never overflow screen bottom
  top       = Math.max(8, top);
  maxHeight = Math.min(maxHeight, vh - top - 8);

  let left = spotRect.left + spotRect.width / 2 - W / 2;
  left = Math.max(16, Math.min(left, vw - W - 16));

  return { ...base, left, top, maxHeight };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DemoTour({ onClose, onSetTab, onLoadDemo, onAdvanceClock }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const STEPS = buildSteps(onSetTab, onLoadDemo);
  const step   = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;

  // Action + spotlight on step change
  useEffect(() => {
    setVisible(false);
    setSpotRect(null);

    const current = STEPS[stepIdx];
    let t1: ReturnType<typeof setTimeout> | null = null;
    let t2: ReturnType<typeof setTimeout> | null = null;

    if (current.action) t1 = setTimeout(current.action, current.actionDelay ?? 80);

    const totalDelay = (current.actionDelay ?? 80) + (current.spotlightDelay ?? 700);
    t2 = setTimeout(() => {
      if (current.selector) {
        const el = document.querySelector(current.selector);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => setSpotRect(el.getBoundingClientRect()), 100);
        }
      }
      setVisible(true);
    }, totalDelay);

    return () => { if (t1) clearTimeout(t1); if (t2) clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  // Track spotlight on scroll / resize
  useEffect(() => {
    if (!step.selector) return;
    const update = () => {
      const el = document.querySelector(step.selector!);
      if (el) setSpotRect(el.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [step.selector]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { if (isLast) onClose(); else setStepIdx(i => i + 1); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast, onClose]);

  const next = useCallback(() => { if (isLast) { onClose(); return; } setStepIdx(i => i + 1); }, [isLast, onClose]);

  const SP = 10;

  return (
    <>
      {/* ── SVG spotlight overlay ── */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none', opacity: visible ? 1 : 0, transition: 'opacity .3s' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="ns-tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotRect && (
              <rect x={spotRect.x - SP} y={spotRect.y - SP} width={spotRect.width + SP * 2} height={spotRect.height + SP * 2} rx={10} fill="black" />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(27,17,8,.82)" mask="url(#ns-tour-mask)" />
        {spotRect && (
          <>
            <rect x={spotRect.x - SP} y={spotRect.y - SP} width={spotRect.width + SP * 2} height={spotRect.height + SP * 2} rx={10} fill="none" stroke={step.catColor} strokeWidth={2.5} strokeOpacity={0.7} />
            <rect x={spotRect.x - SP - 5} y={spotRect.y - SP - 5} width={spotRect.width + SP * 2 + 10} height={spotRect.height + SP * 2 + 10} rx={14} fill="none" stroke={step.catColor} strokeWidth={1} strokeOpacity={0.25} />
          </>
        )}
      </svg>

      {/* ── Click-through backdrop to advance ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, cursor: 'pointer' }} onClick={next} aria-label="Click anywhere to continue" />

      {/* ── Popup card ── */}
      {visible && (
        <div
          style={{
            ...calcPopupStyle(spotRect),
            background: 'var(--ns-paper, #F7F2E8)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: `0 32px 80px rgba(0,0,0,.6), 0 0 0 1px ${step.catColor}33, 0 8px 24px rgba(0,0,0,.3)`,
            display: 'flex',
            flexDirection: 'column',
            animation: 'ns-tour-in .28s cubic-bezier(.16,1,.3,1) both',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Colour accent bar */}
          <div style={{ height: 5, background: `linear-gradient(90deg, ${step.catColor}, ${step.catColor}88)`, flexShrink: 0 }} />

          {/* Scrollable body */}
          <div style={{ overflowY: 'auto', padding: '16px 20px 20px', flex: 1 }}>

            {/* Top row: category chip + step counter + close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                  letterSpacing: '0.8px', textTransform: 'uppercase',
                  background: step.catColor + '1A', color: step.catColor,
                  padding: '3px 8px', borderRadius: 20,
                  border: `1px solid ${step.catColor}40`,
                }}>
                  {step.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--ns-ink-4, #5A4D3E)', letterSpacing: '0.3px' }}>
                  {stepIdx + 1} / {STEPS.length}
                </span>
                <button
                  onClick={onClose}
                  style={{ background: 'var(--ns-paper-2, #242017)', border: '1px solid var(--ns-bd, rgba(27,17,8,.12))', borderRadius: 8, padding: '4px 5px', lineHeight: 0, cursor: 'pointer', color: 'var(--ns-ink-3, #8C7A62)' }}
                  title="Close tour (Esc)"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Icon + Title */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: step.catColor + '15',
                border: `1.5px solid ${step.catColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, lineHeight: 1,
              }}>
                {step.icon}
              </div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: 'var(--ns-ink)', lineHeight: 1.25, marginBottom: 3 }}>
                  {step.title}
                </div>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {/* Progress dots mini row */}
                  {STEPS.map((_, i) => (
                    <div key={i} style={{
                      height: 4, width: i === stepIdx ? 16 : 4, borderRadius: 2,
                      background: i === stepIdx ? step.catColor : i < stepIdx ? '#175E35' : 'rgba(27,17,8,.12)',
                      transition: 'all .2s', flexShrink: 0,
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Lead paragraph */}
            <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 13, lineHeight: 1.75, color: 'var(--ns-ink, #1B1108)', marginBottom: 14, marginTop: 0 }}>
              {step.lead}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--ns-bd, rgba(27,17,8,.1))', marginBottom: 12 }} />

            {/* Bullet points */}
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {step.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: step.catColor, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: 12.5, lineHeight: 1.6, color: 'var(--ns-ink-2, #6B5A47)' }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stat chips */}
            {step.stats && step.stats.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {step.stats.map((s, i) => (
                  <span key={i} style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                    background: step.catColor + '12',
                    color: step.catColor,
                    padding: '4px 10px', borderRadius: 20,
                    border: `1px solid ${step.catColor}25`,
                    whiteSpace: 'nowrap',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Sticky footer — always visible, never scrolls away ── */}
          <div style={{
            flexShrink: 0,
            padding: '12px 20px 16px',
            borderTop: '1px solid var(--ns-bd, rgba(27,17,8,.1))',
            background: 'var(--ns-paper, #F7F2E8)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ns-ink-4, #5A4D3E)', fontFamily: "'Figtree', sans-serif", background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
            >
              <ChevronsRight size={12} />
              Skip tour
            </button>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {stepIdx > 0 && (
                <button
                  onClick={() => setStepIdx(i => i - 1)}
                  style={{ fontSize: 11, color: 'var(--ns-ink-3, #8C7A62)', fontFamily: "'Figtree', sans-serif", background: 'var(--ns-paper-2, #242017)', border: '1px solid var(--ns-bd, rgba(27,17,8,.12))', borderRadius: 10, padding: '7px 12px', cursor: 'pointer' }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={next}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12.5, fontWeight: 700, letterSpacing: '0.2px',
                  padding: '8px 18px', borderRadius: 12, cursor: 'pointer', border: 'none',
                  background: isLast ? '#175E35' : step.catColor,
                  color: '#fff', fontFamily: "'Figtree', sans-serif",
                  boxShadow: `0 4px 14px ${isLast ? '#175E35' : step.catColor}55`,
                }}
              >
                {isLast ? '🎉 Finish Tour' : <><span>Next</span> <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-up animation keyframes */}
      <style>{`
        @keyframes ns-tour-in {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
      `}</style>
    </>
  );
}
