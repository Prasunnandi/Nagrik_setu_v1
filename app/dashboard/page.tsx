'use client';

// app/page.tsx — Nagrik Setu main application

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import CivicMap from '@/components/CivicMap';
import ActiveComplaints from '@/components/ActiveComplaints';
import WardScorecard from '@/components/WardScorecard';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { ChatMessage, Complaint, WardScorecard as WardScorecardType, ComplaintStatus } from '@/lib/types';
import { MOCK_COMPLAINTS, MOCK_WARD_SCORES } from '@/lib/mockData';
import { DEMO_COMPLAINTS } from '@/lib/demoData';
import { searchWards, getWardById, Ward } from '@/lib/allWardsData';
import { loadComplaints, upsertComplaint } from '@/lib/persistence';
import { subscribeComplaints, saveComplaint, updateComplaintStatus } from '@/lib/firebase';
import { Map as MapIcon, MessageSquare, BarChart3, Users, Search, X, PieChart, Clock, RotateCcw, Play, Trophy } from 'lucide-react';
import DemoTour from '@/components/DemoTour';
import OfficerLeaderboard, { OfficerStats } from '@/components/OfficerLeaderboard';

// ── Simulated Clock Bar ─────────────────────────────────────────────────────
function SimClockBar({ offsetMs, onAdvance, onReset, onStartTour }: {
  offsetMs: number;
  onAdvance: (ms: number) => void;
  onReset: () => void;
  onStartTour?: () => void;
}) {
  const simNow = new Date(Date.now() + offsetMs);
  const label = simNow.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const H = 3_600_000, D = 86_400_000;

  return (
    <div
      data-demo="sim-clock"
      className="flex items-center gap-1.5 px-3 flex-shrink-0 overflow-x-auto"
      style={{
        background: 'var(--ns-amp)', borderBottom: '1px solid rgba(184,122,10,.25)',
        height: 32, minHeight: 32,
        scrollbarWidth: 'none',
      }}
    >
      <div
        className="flex items-center gap-1 rounded-full px-2 py-0.5 flex-shrink-0"
        style={{ background: 'rgba(184,122,10,.15)', border: '1px solid rgba(184,122,10,.3)' }}
      >
        <Clock size={9} style={{ color: 'var(--ns-am)' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, color: 'var(--ns-am)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          DEMO
        </span>
      </div>

      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--ns-ink)', flexShrink: 0 }}>
        {label}
      </span>

      {offsetMs > 0 && (
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'var(--ns-am)', flexShrink: 0 }}>
          +{offsetMs >= D ? `${Math.round(offsetMs/D)}d` : `${Math.round(offsetMs/H)}h`}
        </span>
      )}

      {onStartTour && (
        <button
          onClick={onStartTour}
          className="flex items-center gap-1 font-bold rounded-full flex-shrink-0"
          style={{ background: 'var(--ns-sf)', color: '#fff', fontFamily: "'Figtree', sans-serif", fontSize: 10, padding: '2px 10px', boxShadow: '0 2px 6px rgba(224,96,10,.35)' }}
          title="Start guided demo tour"
        >
          <Play size={9} /> Demo
        </button>
      )}

      <div className="flex items-center gap-1 ml-auto flex-shrink-0">
        {[
          { label: '+12h', ms: 12 * H },
          { label: '+1d',  ms: D },
          { label: '+3d',  ms: 3 * D },
          { label: '+7d',  ms: 7 * D },
        ].map(({ label: lbl, ms }) => (
          <button
            key={lbl}
            data-demo={lbl === '+1d' ? 'clock-1d' : undefined}
            onClick={() => onAdvance(ms)}
            className="font-semibold rounded transition-colors flex-shrink-0"
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9,
              background: 'rgba(184,122,10,.18)', color: 'var(--ns-am)',
              border: '1px solid rgba(184,122,10,.3)', padding: '1px 6px',
            }}
          >
            {lbl}
          </button>
        ))}
        <button
          onClick={onReset}
          className="p-0.5 rounded transition-opacity flex-shrink-0"
          style={{ opacity: offsetMs > 0 ? 1 : 0.3, cursor: offsetMs > 0 ? 'pointer' : 'default' }}
          title="Reset to real time"
          disabled={offsetMs === 0}
        >
          <RotateCcw size={11} style={{ color: 'var(--ns-am)' }} />
        </button>
      </div>
    </div>
  );
}

// ── Auto-simulate complaint stages based on elapsed simulated time ──────────
function simulateStage(c: Complaint, simNow: number): Complaint {
  const filed  = new Date(c.filedAt).getTime();
  const slaDue = new Date(c.slaDeadline).getTime();
  const elapsed = simNow - filed;
  const H = 3_600_000;

  // Dont override statuses that are already at terminal/complex states
  if (['GENUINELY_RESOLVED', 'CONSUMER_FORUM', 'CLOSED', 'RTI_FILED'].includes(c.status)) return c;

  let status: ComplaintStatus = c.status;

  if (elapsed < 3 * H)                      status = 'FILED';
  else if (elapsed < 8 * H)                 status = 'ASSIGNED';
  else if (simNow < slaDue)                 status = 'IN_PROGRESS';
  else if (simNow < slaDue + H)             status = 'RESOLVED_CLAIMED';   // fake closure window
  else if (simNow < slaDue + 3 * H)        status = 'FAKE_CLOSURE_DETECTED';
  else if (simNow < slaDue + 48 * H)       status = 'ESCALATED';
  else                                       status = 'RTI_FILED';

  // Add fake closure analysis when detected
  const fakeClosureAnalysis =
    status === 'FAKE_CLOSURE_DETECTED'
      ? c.fakeClosureAnalysis ?? {
          probability: 87,
          isSuspicious: true,
          flags: [
            { flag: 'SPEED', points: 30, detail: 'Closed in <25% of SLA time' },
            { flag: 'NO_PHOTO', points: 25, detail: 'No field worker evidence photo' },
            { flag: 'PATTERN', points: 32, detail: 'Officer 93% same-day closures this week' },
          ],
          recommendation: 'DISPUTE' as const,
        }
      : c.fakeClosureAnalysis;

  return { ...c, status, fakeClosureAnalysis };
}

type DashboardTab = 'map' | 'complaints' | 'scorecard' | 'analytics' | 'community' | 'officers';

function wardFromAllData(wardId: string): WardScorecardType | null {
  const w = getWardById(wardId);
  if (!w) return null;
  return {
    wardNumber: w.wardNumber,
    wardName: w.wardName,
    city: w.city as WardScorecardType['city'],
    overallScore: w.overallScore,
    grade: w.grade,
    genuineResolutionRate: Math.round(40 + (w.overallScore * 0.45)),
    avgResolutionDays: Math.max(2, Math.round(30 - w.overallScore * 0.2)),
    slaComplianceRate: Math.round(30 + w.overallScore * 0.5),
    fakeClosureRate: Math.max(0, Math.round(25 - w.overallScore * 0.2)),
    escalationRate: Math.max(2, Math.round(35 - w.overallScore * 0.25)),
    complaintVolume: Math.round(80 + Math.random() * 120),
    topIssues: [
      { type: 'POTHOLE', count: Math.round(20 + Math.random() * 30) },
      { type: 'GARBAGE', count: Math.round(15 + Math.random() * 25) },
      { type: 'STREET_LIGHT', count: Math.round(8 + Math.random() * 15) },
    ],
    councillorName: w.councillorName,
    councillorParty: w.councillorParty,
    councillorRating: Math.round((w.overallScore / 10) * 10) / 10,
    councillorMeetingsAttended: Math.round(6 + Math.random() * 6),
    councillorTotalMeetings: 12,
    cityAvgScore: 54,
    wardRank: w.wardNumber,
    totalWards: 144,
  };
}

const nationalScorecard: WardScorecardType = {
  wardNumber: 0,
  wardName: 'All Wards (India)',
  city: 'NATIONAL',
  overallScore: 54,
  grade: 'C',
  genuineResolutionRate: 48,
  avgResolutionDays: 12,
  slaComplianceRate: 64,
  fakeClosureRate: 14,
  escalationRate: 18,
  complaintVolume: 12450,
  topIssues: [
    { type: 'POTHOLE', count: 4320 },
    { type: 'GARBAGE', count: 3850 },
    { type: 'STREET_LIGHT', count: 1840 },
  ],
  councillorName: 'Multiple representatives',
  councillorParty: 'Various',
  councillorRating: 5.2,
  councillorMeetingsAttended: 8,
  councillorTotalMeetings: 12,
  cityAvgScore: 54,
  wardRank: 1,
  totalWards: 2600,
};

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<DashboardTab>('map');
  const [simOffset, setSimOffset] = useState(0);
  const [tourActive, setTourActive] = useState(false);

  // Load persisted complaints and subscribe to Firestore realtime updates
  useEffect(() => {
    const local = loadComplaints();
    setComplaints(local);

    const unsubscribe = subscribeComplaints((dbComplaints) => {
      setComplaints((prev) => {
        const mergedMap = new Map<string, Complaint>();
        prev.forEach(c => mergedMap.set(c.id, c));
        dbComplaints.forEach(c => mergedMap.set(c.id, c));
        return Array.from(mergedMap.values());
      });
    });

    return () => unsubscribe();
  }, []);

  // Apply simulated time to complaints for live demo
  const simNow = Date.now() + simOffset;
  const displayComplaints = useMemo(
    () => simOffset > 0 ? complaints.map(c => simulateStage(c, simNow)) : complaints,
    [complaints, simOffset, simNow]
  );
  const [mobileView, setMobileView] = useState<'chat' | 'dashboard'>('chat');
  const [selectedWardId, setSelectedWardId] = useState('ALL');
  const [wardSearch, setWardSearch] = useState('');
  const [wardSearchResults, setWardSearchResults] = useState<Ward[]>([]);
  const [wardPickerOpen, setWardPickerOpen] = useState(false);
  const wardPickerRef = useRef<HTMLDivElement>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedOfficer, setSelectedOfficer] = useState<OfficerStats | null>(null);

  const wardData: WardScorecardType =
    selectedWardId === 'ALL'
      ? nationalScorecard
      : MOCK_WARD_SCORES[selectedWardId] ||
        wardFromAllData(selectedWardId) ||
        MOCK_WARD_SCORES['KOL-57'];

  const handleWardSearch = (q: string) => {
    setWardSearch(q);
    setWardSearchResults(q.length >= 2 ? searchWards(q) : []);
  };

  const selectWard = (id: string, label: string) => {
    setSelectedWardId(id);
    setWardSearch(label);
    setWardPickerOpen(false);
    setWardSearchResults([]);
  };

  const handleNewComplaint = useCallback((complaint: Complaint) => {
    setComplaints(prev => upsertComplaint(complaint, prev));
    saveComplaint(complaint);
  }, []);

  const handleComplaintUpdate = useCallback((updated: Complaint) => {
    setComplaints(prev => upsertComplaint(updated, prev));
    updateComplaintStatus(updated.id, updated);
  }, []);

  const handleLoadDemo = useCallback(() => {
    setComplaints(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const toAdd = DEMO_COMPLAINTS.filter(c => !existingIds.has(c.id));
      const merged = [...prev, ...toAdd];
      localStorage.setItem('ns:complaints:v2', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const resolvedCount   = displayComplaints.filter(c => c.status === 'GENUINELY_RESOLVED').length;
  const fakeCaughtCount = displayComplaints.filter(c => c.status === 'FAKE_CLOSURE_DETECTED').length;
  const escalatedCount  = displayComplaints.filter(c => ['ESCALATED', 'RTI_FILED'].includes(c.status)).length;

  const tabs: { id: DashboardTab; label: string; Icon: React.ElementType; badge?: number }[] = [
    { id: 'map', label: 'Live Map', Icon: MapIcon },
    { id: 'complaints', label: 'My Complaints', Icon: MessageSquare, badge: displayComplaints.filter(c => c.status === 'ESCALATED' || c.status === 'FAKE_CLOSURE_DETECTED').length || undefined },
    { id: 'scorecard', label: 'Ward Score', Icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', Icon: PieChart },
    { id: 'community', label: 'Community', Icon: Users },
    { id: 'officers',  label: 'Officers',  Icon: Trophy },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <Header
        mobileView={mobileView}
        onToggleMobileView={() => setMobileView(v => v === 'chat' ? 'dashboard' : 'chat')}
        complaintCount={complaints.filter(c => !['GENUINELY_RESOLVED', 'CLOSED'].includes(c.status)).length}
        onActiveClick={() => { setActiveTab('complaints'); setMobileView('dashboard'); }}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Chat Panel */}
        <div
          data-demo="chat-panel"
          className={`
          flex flex-col bg-white border-r border-gray-200
          ${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex
          w-full md:w-[360px] lg:w-[420px] xl:w-[460px] flex-shrink-0
        `}>


          <ChatInterface
            onNewComplaint={handleNewComplaint}
            onComplaintUpdate={handleComplaintUpdate}
            existingComplaints={complaints}
          />

          {/* Telegram CTA */}
          <a
            data-demo="telegram-cta"
            href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'NagrikSetuBot'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 flex-shrink-0 transition-all hover:brightness-110 active:scale-[0.99]"
            style={{
              background: '#229ED9',
              borderTop: '2px solid #1a8ab5',
              padding: '12px 16px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {/* Telegram logo */}
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div style={{
                color: 'white', fontSize: 14, fontWeight: 700,
                fontFamily: "'Figtree', sans-serif", lineHeight: 1.2,
              }}>
                Connect on Telegram
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.82)', fontSize: 11,
                fontFamily: "'Figtree', sans-serif", marginTop: 2,
              }}>
                File & track complaints · Photo uploads · 10 Indian languages
              </div>
            </div>

            {/* Arrow badge */}
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '4px 10px',
              color: 'white', fontSize: 12, fontWeight: 700,
              fontFamily: "'Figtree', sans-serif", flexShrink: 0,
            }}>
              Open →
            </div>
          </a>
        </div>

        {/* RIGHT — Dashboard Panel */}
        <div className={`
          flex flex-col flex-1 overflow-hidden
          ${mobileView === 'dashboard' ? 'flex' : 'hidden'} md:flex
        `}>
          {/* Simulated clock bar for demo */}
          <SimClockBar
            offsetMs={simOffset}
            onAdvance={ms => setSimOffset(prev => prev + ms)}
            onReset={() => setSimOffset(0)}
            onStartTour={() => setTourActive(true)}
          />

          {/* Success metrics bar */}
          {(resolvedCount > 0 || fakeCaughtCount > 0 || escalatedCount > 0) && (
            <div
              className="flex items-center gap-3 px-3 flex-shrink-0 overflow-x-auto"
              style={{ background: 'var(--ns-grp)', borderBottom: '1px solid rgba(23,94,53,.18)', whiteSpace: 'nowrap', height: 26, scrollbarWidth: 'none' }}
            >
              {resolvedCount > 0 && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'var(--ns-gr)', fontFamily: "'Space Mono', monospace" }}>
                  ✓ {resolvedCount} issue{resolvedCount !== 1 ? 's' : ''} genuinely resolved
                </span>
              )}
              {fakeCaughtCount > 0 && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'var(--ns-re)', fontFamily: "'Space Mono', monospace" }}>
                  🚨 {fakeCaughtCount} fake closure{fakeCaughtCount !== 1 ? 's' : ''} caught
                </span>
              )}
              {escalatedCount > 0 && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: 'var(--ns-am)', fontFamily: "'Space Mono', monospace" }}>
                  📢 {escalatedCount} escalated to higher authority
                </span>
              )}
            </div>
          )}

          {/* Dashboard tab bar */}
          <div
            className="flex items-center flex-shrink-0"
            style={{ background: 'var(--ns-paper)', borderBottom: '1px solid var(--ns-bdm)', minHeight: 38 }}
          >
            {/* Scrollable tabs */}
            <div className="flex items-center gap-0.5 px-2 overflow-x-auto flex-1 min-w-0" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(({ id, label, Icon, badge }) => (
                <button
                  key={id}
                  data-demo={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-1 px-2.5 py-2.5 text-xs font-medium border-b-2 transition-colors relative flex-shrink-0"
                  style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: 11,
                    borderBottomColor: activeTab === id ? 'var(--ns-sf)' : 'transparent',
                    color: activeTab === id ? 'var(--ns-sf)' : 'var(--ns-ink-3)',
                    marginBottom: '-1px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={13} />
                  <span className="hidden md:inline">{label}</span>
                  {badge && (
                    <span
                      className="absolute top-0.5 right-0 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--ns-re)', fontSize: '7px', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Ward search picker — compact */}
            <div className="relative flex-shrink-0 px-2" ref={wardPickerRef}>
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white" style={{ width: 160 }}>
                <Search size={11} className="text-gray-400 flex-shrink-0" />
                <input
                  value={wardSearch || `${wardData.wardName}`}
                  onFocus={() => { setWardPickerOpen(true); setWardSearch(''); }}
                  onChange={e => { handleWardSearch(e.target.value); setWardPickerOpen(true); }}
                  onBlur={() => setTimeout(() => setWardPickerOpen(false), 150)}
                  placeholder="Search ward…"
                  className="flex-1 focus:outline-none bg-transparent text-gray-700 min-w-0"
                  style={{ fontSize: 11 }}
                />
                {(wardSearch || selectedWardId !== 'ALL') && (
                  <button onMouseDown={() => { setSelectedWardId('ALL'); setWardSearch(''); setWardSearchResults([]); }}
                    className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X size={10} /></button>
                )}
              </div>
              {wardPickerOpen && (
                <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-y-auto max-h-72">
                  {wardSearchResults.length > 0 ? (
                    wardSearchResults.map(w => (
                      <button key={w.id} onMouseDown={() => selectWard(w.id, w.wardName)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{w.wardName}</div>
                        <div className="text-[10px] text-gray-500">{w.zone} · {w.city} · Grade {w.grade}</div>
                        <div className="text-[10px] text-blue-600">{w.councillorName}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 space-y-1">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Quick picks</div>
                      {['KOL-57','MUM-151','BLR-108','DEL-92','CHN-100','HYD-067'].map(id => {
                        const w = getWardById(id) || getWardById(id.replace(/^(\w{3}-)0+/,'$1'));
                        const ms = MOCK_WARD_SCORES[id];
                        const name = ms ? `${ms.wardName} (${ms.city})` : w ? `${w.wardName} (${w.city})` : id;
                        return (
                          <button key={id} onMouseDown={() => selectWard(id, name)}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-blue-50 text-xs text-gray-700 flex items-center gap-2">
                            <span className="font-mono text-blue-500 text-[10px]">{id}</span>
                            <span className="truncate">{name}</span>
                          </button>
                        );
                      })}
                      <div className="text-[10px] text-gray-400 pt-1 px-2">Search ~2600 wards across India</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'map' && (
              <CivicMap complaints={displayComplaints} ward={wardData} />
            )}
            {activeTab === 'complaints' && (
              <ActiveComplaints
                complaints={displayComplaints}
                onUpdate={handleComplaintUpdate}
                simNow={simNow}
                onSelectComplaint={setSelectedComplaint}
              />
            )}
            {activeTab === 'scorecard' && (
              <WardScorecard ward={wardData} complaints={displayComplaints} />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                complaints={displayComplaints}
                onLoadDemo={handleLoadDemo}
              />
            )}
            {activeTab === 'community' && (
              <CommunityView complaints={displayComplaints} />
            )}
            {activeTab === 'officers' && (
              <div className="h-full overflow-y-auto">
                <OfficerLeaderboard complaints={displayComplaints} onSelectOfficer={setSelectedOfficer} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guided demo tour overlay */}
      {tourActive && (
        <DemoTour
          onClose={() => setTourActive(false)}
          onSetTab={tab => setActiveTab(tab as DashboardTab)}
          onLoadDemo={handleLoadDemo}
          onAdvanceClock={ms => setSimOffset(prev => prev + ms)}
        />
      )}

      {/* Sidebar Details Drawer */}
      {(selectedComplaint || selectedOfficer) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => { setSelectedComplaint(null); setSelectedOfficer(null); }}
          />

          {/* Drawer Panel */}
          <div
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out"
            style={{ borderLeft: '1px solid var(--ns-bd)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="font-bold text-base text-gray-800">
                {selectedComplaint ? 'Complaint Details' : 'Officer Details'}
              </h3>
              <button
                onClick={() => { setSelectedComplaint(null); setSelectedOfficer(null); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {selectedComplaint && (
                <>
                  {/* Status & ID */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                      {selectedComplaint.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      selectedComplaint.status === 'GENUINELY_RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                      selectedComplaint.status === 'FAKE_CLOSURE_DETECTED' ? 'bg-rose-50 text-rose-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {selectedComplaint.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Issue Category & Description */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Issue Details</span>
                    <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                      <span className="text-xl">
                        {selectedComplaint.issueType === 'POTHOLE' ? '🕳️' :
                         selectedComplaint.issueType === 'GARBAGE' ? '🗑️' :
                         selectedComplaint.issueType === 'STREET_LIGHT' ? '💡' :
                         selectedComplaint.issueType === 'WATER_SUPPLY' ? '💧' :
                         selectedComplaint.issueType === 'SEWAGE' ? '🚽' :
                         selectedComplaint.issueType === 'DRAINAGE' ? '🌊' : '⚠️'}
                      </span>
                      <span>{selectedComplaint.issueType.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-auto bg-amber-100 text-amber-700">
                        {selectedComplaint.severity} Priority
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100 leading-relaxed">
                      {selectedComplaint.issueDescription}
                    </p>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Location Details</span>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-gray-700 space-y-1.5">
                      <div><strong className="text-gray-500">Address:</strong> {selectedComplaint.location.address}</div>
                      <div className="flex items-center gap-4">
                        <div><strong className="text-gray-500">Ward:</strong> {selectedComplaint.location.ward}</div>
                        <div><strong className="text-gray-500">Ward No:</strong> {selectedComplaint.location.wardNumber}</div>
                        <div><strong className="text-gray-500">City:</strong> {selectedComplaint.location.city}</div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Officer */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Assigned Officer</span>
                    {selectedComplaint.assignedOfficer ? (
                      <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 text-xs text-gray-700 space-y-1.5">
                        <div className="font-bold text-blue-900">{selectedComplaint.assignedOfficer.name}</div>
                        <div className="text-[10px] text-blue-700">{selectedComplaint.assignedOfficer.designation}</div>
                        <div className="pt-1.5 border-t border-blue-100/40 space-y-1">
                          <div><strong className="text-blue-900/60">Phone:</strong> {selectedComplaint.assignedOfficer.phone}</div>
                          <div><strong className="text-blue-900/60">Email:</strong> {selectedComplaint.assignedOfficer.email}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No officer assigned yet.</div>
                    )}
                  </div>

                  {/* SLA Timeline */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">SLA Timeline</span>
                    <div className="bg-orange-50/40 border border-orange-100/40 rounded-xl p-3 text-xs text-gray-700 space-y-1">
                      <div><strong className="text-orange-950/60">Deadline:</strong> {new Date(selectedComplaint.slaDeadline).toLocaleString('en-IN')}</div>
                      <div><strong className="text-orange-950/60">SLA Duration:</strong> {selectedComplaint.slaHours} hours</div>
                      <div><strong className="text-orange-950/60">Filed Date:</strong> {new Date(selectedComplaint.filedAt).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </>
              )}

              {selectedOfficer && (
                <>
                  {/* Officer Info Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{selectedOfficer.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{selectedOfficer.designation}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold font-serif text-lg bg-orange-100 border border-orange-200 text-orange-700">
                      {selectedOfficer.grade}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Contact Information</span>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <a href={`tel:${selectedOfficer.phone}`} className="font-mono text-blue-600 hover:underline font-semibold">
                          {selectedOfficer.phone || '+91-98300-12345'}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Email:</span>
                        <a href={`mailto:${selectedOfficer.email}`} className="font-mono text-blue-600 hover:underline font-semibold">
                          {selectedOfficer.email || 'officer@kmcgov.in'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Performance Scorecard</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <div className="text-lg font-mono font-bold text-gray-800">{selectedOfficer.performanceScore}</div>
                        <div className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">Accountability Score</div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <div className="text-lg font-mono font-bold text-emerald-600">{selectedOfficer.resolvedCount}</div>
                        <div className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">Resolved (Genuine)</div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <div className="text-lg font-mono font-bold text-rose-600">{selectedOfficer.fakeCount}</div>
                        <div className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">Fake Closures Flagged</div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                        <div className="text-lg font-mono font-bold text-amber-600">{selectedOfficer.slaBreaches}</div>
                        <div className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">SLA Violations</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Community View — inline component
// ─────────────────────────────────────────────
function CommunityView({ complaints }: { complaints: Complaint[] }) {
  const [petition, setPetition] = useState<{ issueType: string; ids: string[]; text: string } | null>(null);

  const generatePetition = (issueType: string, cls: Complaint[]) => {
    const city = cls[0]?.location.city || 'City';
    const ward = cls[0]?.location.ward || 'Ward';
    const area = cls[0]?.location.area || '';
    const ids = cls.map(c => c.id);
    const text = `COMMUNITY PETITION — ${ward}, ${area}, ${city}

We, the ${cls.length} undersigned residents of ${area}, ${ward}, jointly report:

Issue: ${issueType.replace(/_/g, ' ')}
Affected area: ${area}, ${ward}, ${city}
Duration unresolved: Multiple days
Number of affected residents: ${cls.length}+
Complaint IDs filed through Nagrik Setu:
${ids.map((id, i) => `  ${i + 1}. ${id}`).join('\n')}

This issue is causing serious inconvenience and health/safety risk to residents. We demand resolution within the prescribed SLA as per the ${city} Municipal Corporation Citizen Charter.

We hereby request the Ward Councillor, Ward Officer, and concerned Department Head to take immediate action.

Nagrik Setu Civic Platform | nagrik-setu.vercel.app`;
    setPetition({ issueType, ids, text });
  };

  const clusters = complaints.reduce((acc, c) => {
    const key = c.issueType;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {} as Record<string, Complaint[]>);

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center py-4">
          <h2 className="text-lg font-semibold text-gray-900">Community Alerts</h2>
          <p className="text-sm text-gray-500 mt-1">Complaints clustering in your ward</p>
        </div>

        {/* Petition modal */}
        {petition && (
          <div className="card border-green-200">
            <div className="card-header">
              <span className="font-semibold text-green-800 text-sm">📋 Community Petition — {petition.issueType.replace(/_/g, ' ')}</span>
              <button onClick={() => setPetition(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕ Close</button>
            </div>
            <div className="card-body">
              <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-60 overflow-y-auto">{petition.text}</pre>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigator.clipboard.writeText(petition.text)}
                  className="btn-secondary text-xs flex-1"
                >
                  📋 Copy Petition
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([petition.text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `community-petition-${petition.issueType}.txt`;
                    a.click();
                  }}
                  className="btn-primary text-xs flex-1"
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          </div>
        )}

        {Object.entries(clusters).map(([issueType, cls]) => (
          <div key={issueType} className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {issueType === 'GARBAGE' ? '🗑️' : issueType === 'POTHOLE' ? '🕳️' : issueType === 'STREET_LIGHT' ? '💡' : issueType === 'WATER_SUPPLY' ? '💧' : '⚠️'}
                </span>
                <span className="font-medium text-gray-900">{issueType.replace(/_/g, ' ')}</span>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cls.length} complaints
                </span>
              </div>
              {cls.length >= 3 && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Petition ready
                </span>
              )}
            </div>
            <div className="card-body space-y-2">
              {cls.map(c => (
                <div key={c.id} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-mono text-blue-600">{c.id}</span>
                  <span>•</span>
                  <span>{c.location.area}</span>
                  <span>•</span>
                  <span className={`font-medium ${c.status === 'ESCALATED' ? 'text-orange-600' : c.status === 'FAKE_CLOSURE_DETECTED' ? 'text-red-600' : 'text-gray-500'}`}>
                    {c.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
              {cls.length >= 3 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    {cls.length} complaints on same issue → 5× more pressure with a joint petition
                  </p>
                  <button
                    onClick={() => generatePetition(issueType, cls)}
                    className="btn-primary text-xs w-full"
                  >
                    Generate Community Petition →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {Object.keys(clusters).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="mx-auto mb-3" size={40} />
            <p>No community clusters yet</p>
            <p className="text-sm mt-1">File complaints to see community patterns</p>
          </div>
        )}
      </div>
    </div>
  );
}
