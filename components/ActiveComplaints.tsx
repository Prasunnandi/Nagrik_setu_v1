'use client';

// components/ActiveComplaints.tsx

import { useState } from 'react';
import { Complaint } from '@/lib/types';
import { Clock, Mail, FileText, Phone, X, AlertTriangle, Search, Copy, Check, MessageCircle, Download, QrCode, FilePlus, CheckCircle2, XCircle } from 'lucide-react';
import RTIDocument from './RTIDocument';
import { getComplaintShareUrl, buildWhatsAppShareText } from '@/lib/persistence';
import { generateComplaintPDF } from '@/lib/pdfReceipt';

const ISSUE_ICONS: Record<string, string> = {
  GARBAGE: '🗑️', POTHOLE: '🕳️', STREET_LIGHT: '💡', WATER_SUPPLY: '💧',
  SEWAGE: '🚽', DRAINAGE: '🌊', ENCROACHMENT: '🚧', DEAD_ANIMAL: '🐾',
  STRAY_DOG: '🐕', TREE_FALLEN: '🌳', BURNING_WASTE: '🔥', NOISE_POLLUTION: '🔊',
  FALLEN_WIRE: '⚡', BROKEN_FOOTPATH: '🛤️', MANHOLE: '⚠️', OTHER: '📌',
};

const STATUS_LABELS: Record<string, string> = {
  FILED: 'Filed', ASSIGNED: 'Assigned', IN_PROGRESS: 'In Progress',
  RESOLVED_CLAIMED: 'Closure Claimed', FAKE_CLOSURE_DETECTED: 'Fake Closure',
  ESCALATED: 'Escalated', RTI_FILED: 'RTI Filed', GENUINELY_RESOLVED: 'Resolved',
  CONSUMER_FORUM: 'Consumer Forum', CLOSED: 'Closed',
};

// Maps status → 0-4 step index
function progressStep(status: string): number {
  const m: Record<string, number> = {
    FILED: 0, ASSIGNED: 1, IN_PROGRESS: 2, ESCALATED: 2,
    RESOLVED_CLAIMED: 3, FAKE_CLOSURE_DETECTED: 3, RTI_FILED: 3,
    GENUINELY_RESOLVED: 4, CLOSED: 4,
  };
  return m[status] ?? 0;
}

const STEP_LABELS = ['FILED', 'ASSIGNED', 'IN PROGRESS', 'VERIFY', 'CLOSED'];

const CITY_STATE: Record<string, string> = {
  KOLKATA: 'West Bengal', MUMBAI: 'Maharashtra', BENGALURU: 'Karnataka',
  DELHI: 'Delhi', CHENNAI: 'Tamil Nadu', HYDERABAD: 'Telangana',
  PUNE: 'Maharashtra', AHMEDABAD: 'Gujarat',
};
const RTI_PORTALS: Record<string, string> = {
  'West Bengal': 'wbrtionline.gov.in', 'Maharashtra': 'aaplesarkar.mahaonline.gov.in',
  'Karnataka': 'sakala.kar.nic.in', 'Delhi': 'rti.delhi.gov.in',
  'Tamil Nadu': 'rti.tncsc.tn.gov.in', 'Telangana': 'rtionline.telangana.gov.in',
};
const BODY_PIO: Record<string, { address: string; email: string }> = {
  KMC:  { address: 'Kolkata Municipal Corporation, 5 S.N. Banerjee Road, Kolkata 700013', email: 'rti.central@kmcgov.in' },
  MCGM: { address: 'MCGM, Mahapalika Marg, Fort, Mumbai 400001', email: 'rti@mcgm.gov.in' },
  BBMP: { address: 'BBMP, Hudson Circle, Bengaluru 560002', email: 'rti@bbmp.gov.in' },
  MCD:  { address: 'MCD, Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002', email: 'rti@mcd.gov.in' },
  GCC:  { address: 'Greater Chennai Corporation, Ripon Building, Chennai 600003', email: 'rti@chennaicorporation.gov.in' },
  GHMC: { address: 'GHMC, Troop Bazar, Hyderabad 500001', email: 'rti@ghmc.gov.in' },
};

function SLACountdown({ deadline, status, now = Date.now() }: { deadline: string; status: string; now?: number }) {
  if (status === 'GENUINELY_RESOLVED') return (
    <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--ns-gr)' }}>✓ Resolved</span>
  );
  const diffMs = new Date(deadline).getTime() - now;
  const diffH  = diffMs / 3_600_000;
  if (diffMs < 0) {
    const over = Math.abs(Math.floor(diffH));
    return (
      <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--ns-re)', fontFamily: "'Space Mono', monospace" }}>
        <Clock size={9} />
        {over >= 24 ? `${Math.floor(over/24)}d overdue` : `${over}h overdue`}
      </span>
    );
  }
  const h = Math.floor(diffH);
  const colorStyle = diffH < 2 ? 'var(--ns-re)' : diffH < 6 ? 'var(--ns-am)' : 'var(--ns-gr)';
  return (
    <span className="text-xs font-medium flex items-center gap-1" style={{ color: colorStyle, fontFamily: "'Space Mono', monospace" }}>
      <Clock size={9} />
      {h >= 24 ? `${Math.floor(h/24)}d ${h%24}h` : `${h}h`} left
    </span>
  );
}

export default function ActiveComplaints({ complaints, onUpdate, simNow = Date.now(), onSelectComplaint }: {
  complaints: Complaint[];
  onUpdate: (c: Complaint) => void;
  simNow?: number;
  onSelectComplaint?: (c: Complaint) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'urgent' | 'fake' | 'resolved'>('all');
  const [rtiComplaint, setRtiComplaint] = useState<Complaint | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);

  const filtered = complaints.filter(c => {
    const filterOk =
      filter === 'active'   ? !['GENUINELY_RESOLVED', 'CLOSED'].includes(c.status) :
      filter === 'urgent'   ? ['CRITICAL', 'HIGH'].includes(c.severity) && c.status !== 'GENUINELY_RESOLVED' :
      filter === 'fake'     ? c.status === 'FAKE_CLOSURE_DETECTED' :
      filter === 'resolved' ? ['GENUINELY_RESOLVED', 'CLOSED'].includes(c.status) :
      true;
    if (!filterOk) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.id || '').toLowerCase().includes(q) ||
      (c.issueType || '').toLowerCase().includes(q) ||
      (c.issueDescription || (c as any).description || '').toLowerCase().includes(q) ||
      (c.location?.ward || '').toLowerCase().includes(q) ||
      (c.location?.area || '').toLowerCase().includes(q) ||
      (c.location?.city || '').toLowerCase().includes(q) ||
      (c.status || '').toLowerCase().includes(q) ||
      (c.department || '').toLowerCase().includes(q) ||
      ((c.assignedOfficer?.name) || '').toLowerCase().includes(q) ||
      ((c.assignedOfficer?.designation) || '').toLowerCase().includes(q) ||
      (c.severity || '').toLowerCase().includes(q) ||
      (c.location?.address || '').toLowerCase().includes(q) ||
      (c.municipalBody || '').toLowerCase().includes(q) ||
      (c.issueType || '').replace(/_/g,' ').toLowerCase().includes(q)
    );
  });

  // Officers matching search (for the search hint panel)
  const matchedOfficers = search.trim().length >= 2
    ? Array.from(new Set(
        complaints
          .filter(c => c.assignedOfficer && (
            c.assignedOfficer.name.toLowerCase().includes(search.toLowerCase()) ||
            c.assignedOfficer.designation.toLowerCase().includes(search.toLowerCase())
          ))
          .map(c => c.assignedOfficer!.name)
      ))
    : [];

  const copyLink = (complaintId: string) => {
    navigator.clipboard.writeText(getComplaintShareUrl(complaintId)).then(() => {
      setCopied(complaintId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const shareWhatsApp = (complaint: Complaint) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildWhatsAppShareText(complaint))}`, '_blank');
  };

  const fakeFlagCount = complaints.filter(c => c.status === 'FAKE_CLOSURE_DETECTED').length;

  const sendEscalationEmail = async (complaint: Complaint) => {
    const subject = `URGENT: SLA Violated — Complaint ${complaint.id} — Requires Immediate Action`;
    const body = `Dear Ward Officer,\n\nThis is a formal escalation regarding Complaint ID ${complaint.id} filed on ${new Date(complaint.filedAt).toLocaleDateString('en-IN')}.\n\nIssue: ${complaint.issueDescription}\nLocation: ${complaint.location.address}, ${complaint.location.ward}\nSLA Deadline: ${new Date(complaint.slaDeadline).toLocaleDateString('en-IN')} — BREACHED\n\nAs per the ${complaint.municipalBody} Citizen Charter, resolution was due within ${complaint.slaHours} hours.\n\nNagrik Setu Reference: ${complaint.id}`;
    await fetch('/api/gmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: complaint.assignedOfficer?.email || `complaints@${complaint.municipalBody.toLowerCase()}.gov.in`, subject, body, complaintId: complaint.id }),
    });
    alert(`Escalation email drafted for ${complaint.id}.`);
  };

  const resolvedCount = complaints.filter(c => c.status === 'GENUINELY_RESOLVED').length;
  const filterTabs = [
    { id: 'all',      label: `All (${complaints.length})` },
    { id: 'active',   label: `Active (${complaints.filter(c => !['GENUINELY_RESOLVED','CLOSED'].includes(c.status)).length})` },
    { id: 'urgent',   label: `Urgent (${complaints.filter(c => ['CRITICAL','HIGH'].includes(c.severity)).length})` },
    { id: 'fake',     label: `Fake (${fakeFlagCount})`, alert: fakeFlagCount > 0 },
    { id: 'resolved', label: `✓ Resolved (${resolvedCount})` },
  ] as { id: string; label: string; alert?: boolean }[];

  return (
    <div className="h-full flex flex-col relative" style={{ background: 'var(--ns-paper)' }}>

      {/* RTI modal */}
      {rtiComplaint && (() => {
        const city  = rtiComplaint.location.city as string;
        const state = CITY_STATE[city] || 'National';
        const pio   = BODY_PIO[rtiComplaint.municipalBody] || { address: `${rtiComplaint.municipalBody} Head Office`, email: `complaints@${rtiComplaint.municipalBody.toLowerCase()}.gov.in` };
        return (
          <div className="absolute inset-0 z-50 overflow-y-auto p-4" style={{ background: 'var(--ns-paper)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ns-ink)' }}>
                  RTI Application
                </h3>
                <div className="text-xs mt-0.5" style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-sf)' }}>
                  {rtiComplaint.id}
                </div>
              </div>
              <button onClick={() => setRtiComplaint(null)}
                className="p-1.5 rounded-lg"
                style={{ background: 'var(--ns-paper-2)' }}
              >
                <X size={16} style={{ color: 'var(--ns-ink-3)' }} />
              </button>
            </div>
            <RTIDocument
              data={{
                complaintId: rtiComplaint.id,
                issueType: rtiComplaint.issueType.replace(/_/g, ' '),
                location: `${rtiComplaint.location.address}, ${rtiComplaint.location.ward}`,
                municipalBody: rtiComplaint.municipalBody,
                department: rtiComplaint.department,
                filedDate: new Date(rtiComplaint.filedAt).toLocaleDateString('en-IN'),
                cityState: `${city}, ${state}`,
                pioAddress: pio.address,
                rtiPortal: RTI_PORTALS[state] || 'rtionline.gov.in',
                fee: '10',
              }}
              onClose={() => setRtiComplaint(null)}
            />
          </div>
        );
      })()}

      {/* Search bar */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}
      >
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
        >
          <Search size={12} style={{ color: 'var(--ns-ink-4)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, issue type, location…"
            className="flex-1 bg-transparent text-xs focus:outline-none"
            style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X size={11} style={{ color: 'var(--ns-ink-4)' }} />
            </button>
          )}
        </div>
        {/* Officer matches hint */}
        {matchedOfficers.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            <span style={{ fontSize: 9, color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}>OFFICERS:</span>
            {matchedOfficers.map(name => (
              <span key={name} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(23,94,53,.1)', color: 'var(--ns-gr)', fontWeight: 600 }}>
                👤 {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 px-4 py-2.5 flex-shrink-0"
        style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}
      >
        {filterTabs.map(({ id, label, alert }) => (
          <button
            key={id}
            onClick={() => setFilter(id as typeof filter)}
            className="relative text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{
              fontFamily: "'Figtree', sans-serif",
              background: filter === id ? 'var(--ns-ink)' : 'var(--ns-paper-2)',
              color:      filter === id ? '#F7F2E8'       : 'var(--ns-ink-3)',
            }}
          >
            {label}
            {alert && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: 'var(--ns-re)' }} />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--ns-ink-4)' }}>
            <div className="text-4xl mb-3">{search ? '🔍' : '📋'}</div>
            <p className="text-sm">{search ? `No complaints match "${search}"` : 'No complaints in this view'}</p>
            <p className="text-xs mt-1">{search ? 'Try complaint ID, issue type, or area name' : 'File a complaint via the chat →'}</p>
          </div>
        ) : (
          filtered.map((complaint, idx) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              demoId={idx === 0 ? 'complaint-first-card' : undefined}
              isExpanded={expanded === complaint.id}
              onToggle={() => {
                setExpanded(e => e === complaint.id ? null : complaint.id);
                if (onSelectComplaint) onSelectComplaint(complaint);
              }}
              onEscalate={() => sendEscalationEmail(complaint)}
              onDraftRTI={() => setRtiComplaint(complaint)}
              onCopyLink={() => copyLink(complaint.id)}
              onShareWhatsApp={() => shareWhatsApp(complaint)}
              onDownloadPDF={async () => await generateComplaintPDF(complaint)}
              onToggleQR={() => setShowQR(q => q === complaint.id ? null : complaint.id)}
              showQR={showQR === complaint.id}
              isCopied={copied === complaint.id}
              simNow={simNow}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Severity badge ────────────────────────────────────────────────────────────
function SevBadge({ severity }: { severity: string }) {
  const cls: Record<string, string> = {
    CRITICAL: 'ns-svc', HIGH: 'ns-svh', MEDIUM: 'ns-svm', LOW: 'ns-svl',
  };
  return <span className={cls[severity] || 'ns-svl'}>{severity}</span>;
}

// ── Progress track ────────────────────────────────────────────────────────────
function ProgressTrack({ status }: { status: string }) {
  const current = progressStep(status);
  const isFake  = status === 'FAKE_CLOSURE_DETECTED';

  return (
    <div className="mb-1">
      <div className="flex items-center">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: i < current
                  ? 'var(--ns-gr)'
                  : i === current
                    ? isFake ? 'var(--ns-re)' : 'var(--ns-sf)'
                    : 'var(--ns-paper-3)',
                boxShadow: i === current && !isFake ? '0 0 0 3px rgba(224,96,10,.15)' : undefined,
              }}
            />
            {i < STEP_LABELS.length - 1 && (
              <div
                className="flex-1 h-px mx-0.5"
                style={{ background: i < current ? 'var(--ns-gr)' : 'var(--ns-paper-3)' }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {STEP_LABELS.map((lbl, i) => (
          <span
            key={i}
            className="text-[8.5px] tracking-tight"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: i === current
                ? isFake ? 'var(--ns-re)' : 'var(--ns-sf)'
                : 'var(--ns-ink-4)',
              fontWeight: i === current ? 700 : 400,
            }}
          >
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Stamp overlay ─────────────────────────────────────────────────────────────
function Stamp({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string; rot: string }> = {
    FAKE_CLOSURE_DETECTED: { label: 'DISPUTED',    cls: 'ns-stamp-red',   rot: '-15deg' },
    ESCALATED:             { label: 'ESCALATED',   cls: 'ns-stamp-amber', rot: '-12deg' },
    GENUINELY_RESOLVED:    { label: 'RESOLVED',    cls: 'ns-stamp-green', rot: '-8deg'  },
    RTI_FILED:             { label: 'RTI FILED',   cls: 'ns-stamp-amber', rot: '-10deg' },
  };
  const c = cfg[status];
  if (!c) return null;
  return (
    <div
      className={`ns-stamp ${c.cls}`}
      style={{ top: '50%', right: '14px', transform: `translateY(-50%) rotate(${c.rot})` }}
    >
      {c.label}
    </div>
  );
}

// ── Status Timeline ───────────────────────────────────────────────────────────
function StatusTimeline({ complaint }: { complaint: Complaint }) {
  const filed   = new Date(complaint.filedAt).getTime();
  const sla     = new Date(complaint.slaDeadline).getTime();
  const updated = new Date(complaint.lastUpdatedAt).getTime();
  const H = 3_600_000;
  const step = progressStep(complaint.status);

  type TEvent = { label: string; ts: number; color?: string };
  const events: TEvent[] = [
    { label: 'Complaint Filed', ts: filed, color: 'var(--ns-sf)' },
  ];
  if (step >= 1)
    events.push({ label: 'Assigned to Officer', ts: filed + 4 * H });
  if (step >= 2)
    events.push({ label: 'Work In Progress', ts: filed + 8 * H });
  if (['RESOLVED_CLAIMED', 'FAKE_CLOSURE_DETECTED', 'GENUINELY_RESOLVED', 'RTI_FILED'].includes(complaint.status))
    events.push({ label: 'Closure Claimed by Municipality', ts: Math.max(filed + 12 * H, sla - H) });
  if (complaint.status === 'FAKE_CLOSURE_DETECTED')
    events.push({ label: 'Dispute Raised by Citizen', ts: sla, color: 'var(--ns-re)' });
  if (complaint.status === 'ESCALATED' || complaint.status === 'RTI_FILED') {
    const escTs = complaint.escalations[0]?.date
      ? new Date(complaint.escalations[0].date).getTime()
      : sla + 3 * H;
    const escTarget = complaint.escalations[0]?.to || 'Higher Authority';
    events.push({ label: `Escalated — ${escTarget}`, ts: escTs, color: 'var(--ns-am)' });
  }
  if (complaint.status === 'RTI_FILED')
    events.push({ label: 'RTI Application Filed', ts: updated, color: 'var(--ns-am)' });
  if (complaint.status === 'GENUINELY_RESOLVED')
    events.push({ label: 'Verified Resolved by Citizen ✓', ts: updated, color: 'var(--ns-gr)' });

  return (
    <div
      className="mt-3 rounded-lg overflow-hidden"
      style={{ background: 'var(--ns-paper)', border: '1px solid var(--ns-bd)' }}
    >
      <div
        className="px-3 py-1.5 text-[9.5px] font-bold tracking-wider"
        style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-3)', borderBottom: '1px solid var(--ns-bd)' }}
      >
        STATUS TIMELINE
      </div>
      <div className="px-3 pt-2.5 pb-1">
        {events.map((ev, i) => (
          <div key={i} className="flex items-start gap-2.5 relative">
            {i < events.length - 1 && (
              <div
                className="absolute"
                style={{ left: 5, top: 13, bottom: -3, width: 1, background: 'var(--ns-bd)' }}
              />
            )}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
              style={{
                background: ev.color || 'var(--ns-ink-4)',
                border: '2px solid var(--ns-paper)',
                boxShadow: `0 0 0 1px ${ev.color || 'var(--ns-bd)'}`,
              }}
            />
            <div className="flex-1 pb-3">
              <div className="text-xs font-medium" style={{ color: 'var(--ns-ink-2)' }}>{ev.label}</div>
              <div
                className="text-[9.5px] mt-0.5"
                style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}
              >
                {new Date(ev.ts).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Verify Resolution Banner ───────────────────────────────────────────────────
function VerifyBanner({ complaint, onUpdate }: { complaint: Complaint; onUpdate: (c: Complaint) => void }) {
  const [step, setStep] = useState<'ask' | 'afterPhoto' | 'disputing' | 'done'>('ask');
  const [hasAfterPhoto, setHasAfterPhoto] = useState(false);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string | null>(null);
  const [hasDisputePhoto, setHasDisputePhoto] = useState(false);

  const finalizeResolved = () => {
    setStep('done');
    onUpdate({ ...complaint, status: 'GENUINELY_RESOLVED', lastUpdatedAt: new Date().toISOString() });
  };

  const submitDispute = () => {
    setStep('done');
    onUpdate({
      ...complaint,
      status: 'FAKE_CLOSURE_DETECTED',
      lastUpdatedAt: new Date().toISOString(),
      fakeClosureAnalysis: complaint.fakeClosureAnalysis ?? {
        probability: 78,
        isSuspicious: true,
        flags: [
          { flag: 'CITIZEN_VERIFIED', points: 40, detail: 'Citizen visited site and confirmed issue not resolved' },
          { flag: hasDisputePhoto ? 'PHOTO_EVIDENCE' : 'VISUAL_CHECK', points: 38, detail: hasDisputePhoto ? 'Photo evidence submitted by citizen' : 'Citizen documented ongoing problem after municipality claimed closure' },
        ],
        recommendation: 'DISPUTE' as const,
      },
    });
  };

  const handleAfterPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHasAfterPhoto(true);
    const reader = new FileReader();
    reader.onload = ev => setAfterPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (step === 'done') return null;

  return (
    <div data-demo="verify-banner" className="mt-3 rounded-xl p-3" style={{ background: 'rgba(184,122,10,.08)', border: '2px solid rgba(184,122,10,.35)' }}>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-lg leading-none mt-0.5">🏛️</span>
        <div>
          <div className="text-xs font-bold" style={{ color: 'var(--ns-am)' }}>Municipality Claims: RESOLVED</div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--ns-ink-3)' }}>Is this actually fixed? Your verification creates accountability.</div>
        </div>
      </div>

      {step === 'ask' && (
        <div className="flex gap-2">
          <button onClick={() => setStep('afterPhoto')} className="flex-1 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90" style={{ background: 'var(--ns-gr)', color: '#fff' }}>
            <CheckCircle2 size={12} /> Yes, it's fixed
          </button>
          <button onClick={() => setStep('disputing')} className="flex-1 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90" style={{ background: 'var(--ns-re)', color: '#fff' }}>
            <XCircle size={12} /> No, still broken
          </button>
        </div>
      )}

      {step === 'afterPhoto' && (
        <div className="space-y-2.5">
          <div className="text-xs font-semibold" style={{ color: 'var(--ns-gr)' }}>📸 Add "After" photo proof (optional)</div>
          <div className="text-[10px]" style={{ color: 'var(--ns-ink-3)' }}>A photo of the fixed issue strengthens the resolution record and prevents re-filing.</div>
          {afterPhotoPreview && (
            <img src={afterPhotoPreview} alt="After" className="w-full h-24 object-cover rounded-lg" style={{ border: '2px solid var(--ns-gr)' }} />
          )}
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer px-3 py-2 rounded-lg" style={{ background: 'var(--ns-grp)', color: 'var(--ns-gr)', border: '1px solid rgba(23,94,53,.25)' }}>
            <span>📷</span>
            <span>{hasAfterPhoto ? '✓ Photo selected' : 'Take / upload after-photo'}</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleAfterPhoto} className="hidden" />
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={finalizeResolved} className="flex-1 text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-90" style={{ background: 'var(--ns-gr)', color: '#fff' }}>
              ✓ {hasAfterPhoto ? 'Submit with proof' : 'Mark Resolved'}
            </button>
          </div>
        </div>
      )}

      {step === 'disputing' && (
        <div className="space-y-2">
          <div className="text-xs font-semibold" style={{ color: 'var(--ns-re)' }}>📸 Add evidence photo (optional but powerful)</div>
          <input type="file" accept="image/*" capture="environment" onChange={e => setHasDisputePhoto(!!(e.target.files?.length))} className="text-[10px] w-full" style={{ color: 'var(--ns-ink-3)' }} />
          <div className="flex gap-2 mt-2">
            <button onClick={submitDispute} className="flex-1 text-xs font-semibold py-2 rounded-lg transition-opacity hover:opacity-90" style={{ background: 'var(--ns-re)', color: '#fff' }}>
              🚨 Submit Dispute
            </button>
            <button onClick={() => setStep('ask')} className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--ns-paper-2)', color: 'var(--ns-ink-3)' }}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Google Calendar URL builder (no API key needed) ───────────────────────────
function buildCalendarUrl(complaint: Complaint): string {
  let sla = new Date(complaint.slaDeadline);
  if (isNaN(sla.getTime())) {
    const base = complaint.filedAt ? new Date(complaint.filedAt) : new Date();
    sla = new Date(base.getTime() + 3 * 24 * 60 * 60 * 1000);
  }
  const end = new Date(sla.getTime() + 30 * 60_000);
  const fmt = (d: Date) => {
    try {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    } catch {
      return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    }
  };
  const title = encodeURIComponent(`⏰ SLA Deadline — ${complaint.id} (${complaint.issueType.replace(/_/g,' ')})`);
  const details = encodeURIComponent(
    `Nagrik Setu complaint SLA deadline.\nIssue: ${complaint.issueDescription}\nLocation: ${complaint.location.address}\nStatus: ${complaint.status}\nComplaint ID: ${complaint.id}`
  );
  const loc = encodeURIComponent(complaint.location.address + ', ' + complaint.location.city);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(sla)}/${fmt(end)}&details=${details}&location=${loc}`;
}

// ── Street View Panel ─────────────────────────────────────────────────────────
function StreetViewPanel({ lat, lng, apiKey }: { lat: number; lng: number; apiKey: string }) {
  const [errored, setErrored] = useState(false);
  if (!apiKey || errored) return null;
  const src = `https://maps.googleapis.com/maps/api/streetview?size=400x160&location=${lat},${lng}&fov=90&pitch=0&key=${apiKey}&return_error_code=true`;
  return (
    <div data-demo="street-view-panel" className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid var(--ns-bd)' }}>
      <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}>
        <span className="text-[9.5px] font-bold tracking-wider" style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-3)' }}>🏙️ STREET VIEW — BEFORE</span>
      </div>
      <img
        src={src}
        alt="Street view of complaint location"
        className="w-full object-cover"
        style={{ height: 160, display: 'block' }}
        onError={() => setErrored(true)}
      />
    </div>
  );
}

// ── Citizen Resolve Panel ─────────────────────────────────────────────────────
const ACTIVE_STATUSES = new Set(['FILED', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RTI_FILED']);

function CitizenResolvePanel({ complaint, onUpdate, onClose }: {
  complaint: Complaint;
  onUpdate: (c: Complaint) => void;
  onClose: () => void;
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [note, setNote]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (photos.length >= 3) return;
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotos(prev => prev.length < 3 ? [...prev, ev.target?.result as string] : prev);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (idx: number) => setPhotos(prev => prev.filter((_, i) => i !== idx));

  const submit = () => {
    if (photos.length === 0) return;
    setSubmitted(true);
    onUpdate({
      ...complaint,
      status: 'GENUINELY_RESOLVED',
      citizenVerified: true,
      resolvedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      resolveProofPhotos: photos,
      resolveNote: note.trim() || undefined,
    });
    setTimeout(onClose, 1800);
  };

  if (submitted) {
    return (
      <div className="mt-3 rounded-xl p-4 text-center" style={{ background: 'rgba(23,94,53,.08)', border: '2px solid var(--ns-gr)' }}>
        <div className="text-2xl mb-1">✅</div>
        <div className="text-sm font-bold" style={{ color: 'var(--ns-gr)' }}>Resolution proof submitted!</div>
        <div className="text-xs mt-1" style={{ color: 'var(--ns-ink-3)' }}>Complaint marked as Genuinely Resolved.</div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '2px solid var(--ns-gr)', background: 'rgba(23,94,53,.05)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'var(--ns-gr)' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">📸</span>
          <span className="text-xs font-bold tracking-wide" style={{ color: '#fff', fontFamily: "'Space Mono', monospace" }}>SUBMIT RESOLUTION PROOF</span>
        </div>
        <button onClick={onClose} style={{ color: 'rgba(255,255,255,.7)' }}>
          <X size={14} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div className="text-xs" style={{ color: 'var(--ns-ink-3)' }}>
          Upload up to <b>3 photos</b> showing the issue is fixed. Your proof is saved with the complaint record and builds civic accountability.
        </div>

        {/* Photo slots */}
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden aspect-square" style={{ border: '2px solid var(--ns-gr)' }}>
              <img src={src} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,.6)' }}
              >
                <X size={9} color="#fff" />
              </button>
              <div className="absolute bottom-1 left-1 text-[9px] font-bold px-1 rounded" style={{ background: 'var(--ns-gr)', color: '#fff' }}>
                {i + 1}
              </div>
            </div>
          ))}

          {photos.length < 3 && (
            <label
              className="rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer aspect-square transition-opacity hover:opacity-80"
              style={{ background: 'rgba(23,94,53,.1)', border: '2px dashed rgba(23,94,53,.4)' }}
            >
              <span className="text-xl">📷</span>
              <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: 'var(--ns-gr)' }}>
                {photos.length === 0 ? 'Add photo' : 'Add more'}
              </span>
              <input type="file" accept="image/*" capture="environment" multiple onChange={addPhoto} className="hidden" />
            </label>
          )}

          {/* Empty placeholder slots */}
          {Array.from({ length: Math.max(0, 2 - photos.length) }).map((_, i) => (
            <div key={`ph-${i}`} className="rounded-lg aspect-square" style={{ background: 'rgba(23,94,53,.04)', border: '2px dashed rgba(23,94,53,.15)' }} />
          ))}
        </div>

        {photos.length > 0 && (
          <div className="text-[10px] font-medium" style={{ color: 'var(--ns-gr)' }}>
            ✓ {photos.length} photo{photos.length > 1 ? 's' : ''} selected
          </div>
        )}

        {/* Note field */}
        <div>
          <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--ns-ink-3)' }}>Add a note (optional)</div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Pothole filled and road resurfaced on 27 Jun 2026…"
            rows={2}
            maxLength={200}
            className="w-full text-xs rounded-lg px-3 py-2 resize-none focus:outline-none"
            style={{
              background: 'var(--ns-paper)',
              border: '1px solid var(--ns-bd)',
              color: 'var(--ns-ink)',
              fontFamily: "'Figtree', sans-serif",
            }}
          />
          <div className="text-right text-[9px] mt-0.5" style={{ color: 'var(--ns-ink-4)' }}>{note.length}/200</div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            onClick={submit}
            disabled={photos.length === 0}
            className="flex-1 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-opacity"
            style={{
              background: photos.length > 0 ? 'var(--ns-gr)' : 'var(--ns-paper-3)',
              color: photos.length > 0 ? '#fff' : 'var(--ns-ink-4)',
              cursor: photos.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <CheckCircle2 size={13} />
            {photos.length === 0 ? 'Add at least 1 photo' : `Submit ${photos.length} proof photo${photos.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ComplaintCard ─────────────────────────────────────────────────────────────
function ComplaintCard({
  complaint, isExpanded, onToggle, onEscalate, onDraftRTI, onCopyLink, onShareWhatsApp, onDownloadPDF, onToggleQR, showQR, isCopied, simNow, onUpdate, demoId,
}: {
  complaint: Complaint;
  isExpanded: boolean;
  demoId?: string;
  onToggle: () => void;
  onEscalate: () => void;
  onDraftRTI: () => void;
  onCopyLink: () => void;
  onShareWhatsApp: () => void;
  onDownloadPDF: () => void;
  onToggleQR: () => void;
  showQR: boolean;
  isCopied: boolean;
  simNow: number;
  onUpdate: (c: Complaint) => void;
}) {
  const [showResolvePanel, setShowResolvePanel] = useState(false);
  const isFake    = complaint.status === 'FAKE_CLOSURE_DETECTED';
  const isOverdue = new Date(complaint.slaDeadline).getTime() < simNow && complaint.status !== 'GENUINELY_RESOLVED';
  const canSubmitProof = ACTIVE_STATUSES.has(complaint.status);

  return (
    <div
      data-demo={demoId}
      data-demo-status={complaint.status}
      className="relative rounded-xl overflow-hidden transition-shadow hover:shadow-md"
      style={{
        background: 'var(--ns-paper-2)',
        borderLeft: `3px solid ${
          isFake                           ? 'var(--ns-re)' :
          complaint.severity === 'CRITICAL'? 'var(--ns-re)' :
          complaint.severity === 'HIGH'    ? 'var(--ns-am)' :
          complaint.severity === 'MEDIUM'  ? 'var(--ns-sf)' :
          'var(--ns-paper-3)'
        }`,
        border: isFake
          ? '1px solid rgba(191,27,14,.28)'
          : isOverdue
            ? '1px solid rgba(184,122,10,.25)'
            : '1px solid var(--ns-bd)',
      }}
    >
      {/* Fake closure alert bar */}
      {isFake && (
        <div
          data-demo="fake-closure-bar"
          className="flex items-center justify-between px-3 py-1.5"
          style={{ background: 'var(--ns-re)' }}
        >
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} color="#fff" />
            <span className="text-xs font-bold tracking-wide" style={{ color: '#fff', fontFamily: "'Space Mono', monospace" }}>
              FAKE CLOSURE DETECTED
            </span>
          </div>
          {complaint.fakeClosureAnalysis && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,.18)', color: '#fff', fontFamily: "'Space Mono', monospace" }}
            >
              {complaint.fakeClosureAnalysis.probability}%
            </span>
          )}
        </div>
      )}

      {/* Card header row */}
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
        style={{ borderBottom: '1px solid var(--ns-bd)' }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{ISSUE_ICONS[complaint.issueType] || '⚠️'}</span>
          <span
            className="font-semibold uppercase tracking-wider text-xs truncate"
            style={{ color: 'var(--ns-ink)' }}
          >
            {complaint.issueType.replace(/_/g, ' ')}
          </span>
          <SevBadge severity={complaint.severity} />
        </div>
        <span
          className="text-xs flex-shrink-0 ml-2"
          style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)', fontSize: '9.5px' }}
        >
          {complaint.id}
        </span>
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5">
        {/* Location */}
        <div
          className="text-xs font-semibold mb-0.5"
          style={{ color: 'var(--ns-ink)' }}
        >
          {complaint.location.ward}, {complaint.location.area}
        </div>
        <div className="text-xs mb-2.5" style={{ color: 'var(--ns-ink-3)' }}>
          {complaint.location.address}
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
            style={{ background: 'var(--ns-paper-2)', color: 'var(--ns-ink-3)' }}
          >
            <Clock size={9} /> {new Date(complaint.filedAt).toLocaleDateString('en-IN')}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
            style={{ background: 'var(--ns-paper-2)', color: 'var(--ns-ink-3)' }}
          >
            {complaint.department}
          </span>
          {complaint.assignedOfficer && (
            <span
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
              style={{ background: 'var(--ns-paper-2)', color: 'var(--ns-ink-3)' }}
            >
              {complaint.assignedOfficer.name}
            </span>
          )}
          <SLACountdown deadline={complaint.slaDeadline} status={complaint.status} now={simNow} />
        </div>

        {/* Progress track */}
        <ProgressTrack status={complaint.status} />

        {/* Actions row */}
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          <button className="ns-btn" onClick={onDraftRTI}>
            <FileText size={11} /> Draft RTI
          </button>
          <button className="ns-btn ns-btn-pr" onClick={onEscalate}>
            <Mail size={11} /> Escalate
          </button>
          {complaint.assignedOfficer?.phone && (
            <a href={`tel:${complaint.assignedOfficer.phone}`} className="ns-btn">
              <Phone size={11} /> Call Officer
            </a>
          )}
          <button className="ns-btn" onClick={onCopyLink} title="Copy shareable link">
            {isCopied ? <Check size={11} style={{ color: 'var(--ns-gr)' }} /> : <Copy size={11} />}
            {isCopied ? 'Copied!' : 'Share Link'}
          </button>
          <button
            className="ns-btn"
            onClick={onShareWhatsApp}
            title="Share on WhatsApp"
            style={{ color: '#16a34a' }}
          >
            <MessageCircle size={11} /> WhatsApp
          </button>
          <button className="ns-btn" onClick={onDownloadPDF} title="Download PDF receipt">
            <Download size={11} /> Receipt
          </button>
          <button
            className="ns-btn"
            onClick={onToggleQR}
            title="Show QR code"
            style={showQR ? { background: 'var(--ns-sf)', color: '#fff', borderColor: 'var(--ns-sfd)' } : {}}
          >
            <QrCode size={11} /> QR
          </button>
          <button
            className="ns-btn"
            title="File the same issue again"
            onClick={() => window.dispatchEvent(new CustomEvent('ns-file-again', {
              detail: { issueType: complaint.issueType, area: complaint.location.area, ward: complaint.location.ward },
            }))}
          >
            <FilePlus size={11} /> Re-file
          </button>
          {canSubmitProof && (
            <button
              data-demo="resolve-proof-btn"
              className="ns-btn"
              title="Submit proof photos to resolve this complaint"
              onClick={() => setShowResolvePanel(p => !p)}
              style={showResolvePanel ? { background: 'var(--ns-gr)', color: '#fff', borderColor: 'var(--ns-gr)' } : { color: 'var(--ns-gr)', borderColor: 'rgba(23,94,53,.4)' }}
            >
              <CheckCircle2 size={11} /> Submit Proof
            </button>
          )}
          {complaint.status !== 'GENUINELY_RESOLVED' && complaint.status !== 'CLOSED' && (
            <a
              data-demo="calendar-btn"
              href={buildCalendarUrl(complaint)}
              target="_blank"
              rel="noopener noreferrer"
              className="ns-btn"
              title="Add SLA deadline to Google Calendar"
              style={{ color: '#1a73e8', borderColor: 'rgba(26,115,232,.35)' }}
            >
              📅 Calendar
            </a>
          )}
        </div>

        {/* QR code panel */}
        {showQR && (
          <div
            className="mt-3 rounded-xl p-3 flex items-center gap-4"
            style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                typeof window !== 'undefined' ? `${window.location.origin}/dashboard?complaint=${complaint.id}` : complaint.id
              )}&bgcolor=F7F2E8&color=1B1108&margin=4`}
              alt={`QR for ${complaint.id}`}
              width={80}
              height={80}
              style={{ borderRadius: 6, border: '1px solid var(--ns-bd)', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--ns-ink)', marginBottom: 3 }}>
                {complaint.id}
              </div>
              <div style={{ fontSize: 9, color: 'var(--ns-ink-3)', lineHeight: 1.5 }}>
                Scan to open complaint<br/>on any device
              </div>
            </div>
          </div>
        )}

        {/* Citizen resolve proof panel */}
        {showResolvePanel && canSubmitProof && (
          <CitizenResolvePanel
            complaint={complaint}
            onUpdate={c => { onUpdate(c); setShowResolvePanel(false); }}
            onClose={() => setShowResolvePanel(false)}
          />
        )}

        {/* Proof photos display (after submission) */}
        {complaint.resolveProofPhotos && complaint.resolveProofPhotos.length > 0 && (
          <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(23,94,53,.25)', background: 'rgba(23,94,53,.05)' }}>
            <div className="px-3 py-2 text-[9.5px] font-bold tracking-wider" style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-gr)', borderBottom: '1px solid rgba(23,94,53,.15)' }}>
              ✅ CITIZEN RESOLUTION PROOF
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {complaint.resolveProofPhotos.map((src, i) => (
                  <img key={i} src={src} alt={`Proof ${i+1}`} className="w-full rounded-lg object-cover" style={{ aspectRatio: '1', border: '1px solid rgba(23,94,53,.25)' }} />
                ))}
              </div>
              {complaint.resolveNote && (
                <div className="text-xs italic" style={{ color: 'var(--ns-ink-3)' }}>"{complaint.resolveNote}"</div>
              )}
            </div>
          </div>
        )}

        {/* Expanded: Street View */}
        {isExpanded && complaint.location.lat && complaint.location.lng && (
          <StreetViewPanel
            lat={complaint.location.lat}
            lng={complaint.location.lng}
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          />
        )}

        {/* Expanded: status timeline */}
        {isExpanded && <StatusTimeline complaint={complaint} />}

        {/* Expanded: verify resolution banner */}
        {isExpanded && complaint.status === 'RESOLVED_CLAIMED' && (
          <VerifyBanner complaint={complaint} onUpdate={onUpdate} />
        )}

        {/* Expanded: fake closure flags */}
        {isExpanded && isFake && complaint.fakeClosureAnalysis && (
          <div
            className="mt-3 rounded-lg p-3"
            style={{ background: 'var(--ns-rep)', border: '1px solid rgba(191,27,14,.18)' }}
          >
            <div
              className="text-xs font-bold mb-2 tracking-wider"
              style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-re)' }}
            >
              RED FLAGS DETECTED
            </div>
            <div className="space-y-1.5">
              {complaint.fakeClosureAnalysis.flags.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="text-[9px] font-bold px-1 py-0.5 rounded flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(191,27,14,.14)', color: 'var(--ns-re)', fontFamily: "'Space Mono', monospace" }}
                  >
                    +{f.points}
                  </span>
                  <span className="text-xs leading-snug" style={{ color: 'var(--ns-re)' }}>
                    {f.flag}: {f.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expanded: escalation history */}
        {isExpanded && complaint.escalations.length > 0 && (
          <div
            className="mt-3 rounded-lg overflow-hidden"
            style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
          >
            <div
              className="px-3 py-1.5 text-[9.5px] font-bold tracking-wider"
              style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-3)', borderBottom: '1px solid var(--ns-bd)' }}
            >
              ESCALATION CHAIN
            </div>
            {complaint.escalations.map((e, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 text-xs"
                style={{ borderBottom: i < complaint.escalations.length - 1 ? '1px solid var(--ns-bd)' : undefined }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: e.status === 'RESPONDED' ? 'var(--ns-gr)' : e.status === 'SENT' ? 'var(--ns-sf)' : 'var(--ns-paper-3)' }}
                />
                <span style={{ color: 'var(--ns-ink-2)' }}>{e.level.replace(/_/g, ' ')} → {e.to}</span>
                <span className="ml-auto text-[10px]" style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}>
                  {new Date(e.date).toLocaleDateString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Expanded: officer contact */}
        {isExpanded && complaint.assignedOfficer && (
          <div
            className="mt-3 rounded-lg p-3"
            style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
          >
            <div
              className="text-[9.5px] font-bold tracking-wider mb-2"
              style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-3)' }}
            >
              ASSIGNED OFFICER
            </div>
            <div className="text-xs font-semibold" style={{ color: 'var(--ns-ink)' }}>
              {complaint.assignedOfficer.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--ns-ink-3)' }}>
              {complaint.assignedOfficer.designation}
            </div>
            <div className="flex gap-3 mt-2">
              <a href={`tel:${complaint.assignedOfficer.phone}`} className="flex items-center gap-1 text-xs" style={{ color: 'var(--ns-sf)' }}>
                <Phone size={10} /> {complaint.assignedOfficer.phone}
              </a>
              <a href={`mailto:${complaint.assignedOfficer.email}`} className="flex items-center gap-1 text-xs" style={{ color: 'var(--ns-sf)' }}>
                <Mail size={10} /> Email
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Rubber stamp overlay */}
      <Stamp status={complaint.status} />
    </div>
  );
}
