'use client';

// components/AnalyticsDashboard.tsx — Civic intelligence data viz (Dossier-styled)

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { Complaint, ComplaintStatus, IssueCategory } from '@/lib/types';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const COLORS = {
  sf:  '#E0600A',
  gr:  '#175E35',
  re:  '#BF1B0E',
  am:  '#B87A0A',
  ink: '#1B1108',
  ink3:'#8C7A62',
  p2:  '#EEE8DB',
};

const ISSUE_COLORS: Record<string, string> = {
  GARBAGE:            '#6D4C41',
  POTHOLE:            '#B87A0A',
  STREET_LIGHT:       '#E0600A',
  WATER_SUPPLY:       '#1565C0',
  SEWAGE:             '#4E342E',
  DRAINAGE:           '#00838F',
  ENCROACHMENT:       '#BF1B0E',
  ILLEGAL_CONSTRUCTION:'#880E4F',
  DEAD_ANIMAL:        '#546E7A',
  STRAY_DOG:          '#78909C',
  TREE_FALLEN:        '#2E7D32',
  BURNING_WASTE:      '#E65100',
  NOISE_POLLUTION:    '#7B1FA2',
  AIR_POLLUTION:      '#37474F',
  WATER_POLLUTION:    '#01579B',
  BROKEN_FOOTPATH:    '#4E342E',
  MANHOLE:            '#263238',
  FALLEN_WIRE:        '#F57F17',
  OTHER:              '#607D8B',
};

const STATUS_COLORS: Record<string, string> = {
  FILED:                  '#1565C0',
  ASSIGNED:               '#B87A0A',
  IN_PROGRESS:            '#E0600A',
  RESOLVED_CLAIMED:       '#175E35',
  FAKE_CLOSURE_DETECTED:  '#BF1B0E',
  ESCALATED:              '#880E4F',
  RTI_FILED:              '#4A148C',
  GENUINELY_RESOLVED:     '#1B5E20',
  CONSUMER_FORUM:         '#BF360C',
  CLOSED:                 '#546E7A',
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#BF1B0E',
  HIGH:     '#B87A0A',
  MEDIUM:   '#E0600A',
  LOW:      '#175E35',
};

function StatCard({ label, value, sub, color, Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; Icon: React.ElementType;
}) {
  return (
    <div style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: COLORS.ink, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.ink3, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 9, color: COLORS.ink3, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.ink,
    letterSpacing: '0.3px',
    borderBottom: `1px solid var(--ns-bd)`,
    paddingBottom: 6,
    marginBottom: 12,
    marginTop: 4,
  }}>{children}</h3>
);

// Custom tooltip for Recharts
const DossierTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.ink, color: '#F7F2E8', padding: '8px 12px', borderRadius: 6, fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || '#F7F2E8' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

function downloadCSV(complaints: Complaint[]) {
  const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const headers = ['ID','Issue Type','Status','Severity','City','Ward','Area','Address','Filed At','SLA Deadline','Resolved At','Assigned Officer','SLA Breached','Fake Closure %'];
  const rows = complaints.map(c => [
    c.id, c.issueType, c.status, c.severity,
    c.location.city, c.location.ward, c.location.area, c.location.address,
    new Date(c.filedAt).toLocaleString('en-IN'),
    new Date(c.slaDeadline).toLocaleString('en-IN'),
    c.resolvedAt ? new Date(c.resolvedAt).toLocaleString('en-IN') : '',
    c.assignedOfficer?.name || '',
    new Date(c.slaDeadline).getTime() < Date.now() && c.status !== 'GENUINELY_RESOLVED' ? 'YES' : 'NO',
    c.fakeClosureAnalysis ? String(c.fakeClosureAnalysis.probability) : '',
  ].map(esc).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nagrik-setu-complaints-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsDashboard({ complaints, onLoadDemo }: { complaints: Complaint[]; onLoadDemo?: () => void }) {
  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'GENUINELY_RESOLVED' || c.status === 'CLOSED').length;
    const escalated = complaints.filter(c => c.status === 'ESCALATED' || c.status === 'FAKE_CLOSURE_DETECTED').length;
    const pending = complaints.filter(c => ['FILED', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;

    // By issue type
    const byType: Record<string, number> = {};
    complaints.forEach(c => { byType[c.issueType] = (byType[c.issueType] || 0) + 1; });
    const typeData = Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name: name.replace(/_/g, ' '), count, fill: ISSUE_COLORS[name] || COLORS.sf }));

    // By status
    const byStatus: Record<string, number> = {};
    complaints.forEach(c => { byStatus[c.status] = (byStatus[c.status] || 0) + 1; });
    const statusData = Object.entries(byStatus)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value, fill: STATUS_COLORS[name] || COLORS.am }));

    // By severity
    const bySeverity: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    complaints.forEach(c => { bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1; });
    const severityData = Object.entries(bySeverity).map(([name, count]) => ({ name, count, fill: SEVERITY_COLORS[name] }));

    // By city
    const byCity: Record<string, number> = {};
    complaints.forEach(c => { byCity[c.location.city] = (byCity[c.location.city] || 0) + 1; });
    const cityData = Object.entries(byCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Timeline (last 14 days)
    const now = new Date();
    const days: { date: string; filed: number; resolved: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const dayStr = d.toISOString().slice(0, 10);
      days.push({
        date: label,
        filed: complaints.filter(c => c.filedAt?.slice(0, 10) === dayStr).length,
        resolved: complaints.filter(c => c.resolvedAt?.slice(0, 10) === dayStr).length,
      });
    }

    // SLA compliance
    const withSla = complaints.filter(c => c.slaDeadline);
    const overdue = withSla.filter(c =>
      new Date(c.slaDeadline) < now && !['GENUINELY_RESOLVED', 'CLOSED'].includes(c.status)
    ).length;
    const slaRate = withSla.length > 0 ? Math.round(((withSla.length - overdue) / withSla.length) * 100) : 100;

    return { total, resolved, escalated, pending, typeData, statusData, severityData, cityData, days, slaRate, overdue };
  }, [complaints]);

  return (
    <div data-demo="analytics-content" style={{ height: '100%', overflowY: 'auto', background: 'var(--ns-paper)', padding: '16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.ink, margin: 0 }}>
              Civic Intelligence Dashboard
            </h2>
            <p style={{ fontSize: 11, color: COLORS.ink3, marginTop: 4, fontFamily: "'Space Mono', monospace" }}>
              {stats.total} complaints · Real-time analytics
            </p>
          </div>
          {onLoadDemo && stats.total < 10 && (
            <button
              onClick={onLoadDemo}
              data-demo="load-demo-btn"
              style={{
                fontFamily: "'Figtree', sans-serif", fontSize: 11, fontWeight: 600,
                background: COLORS.sf, color: '#fff', border: 'none',
                padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              🗂️ Load Demo Dataset
            </button>
          )}
          {onLoadDemo && stats.total >= 10 && (
            <span style={{ fontSize: 10, color: COLORS.ink3, fontFamily: "'Space Mono', monospace", padding: '7px 0' }}>
              {stats.total} complaints loaded
            </span>
          )}
          <button
            data-demo="csv-export-btn"
            onClick={() => downloadCSV(complaints)}
            style={{
              fontFamily: "'Figtree', sans-serif", fontSize: 11, fontWeight: 600,
              background: 'var(--ns-paper-2)', color: COLORS.ink3,
              border: '1px solid var(--ns-bd)', padding: '7px 12px',
              borderRadius: 8, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
            }}
            title="Download all complaints as CSV"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
          <StatCard label="Total Filed" value={stats.total} color={COLORS.sf} Icon={TrendingUp} />
          <StatCard label="Pending" value={stats.pending} sub="Filed + Assigned + In Progress" color={COLORS.am} Icon={Clock} />
          <StatCard label="Resolved" value={stats.resolved} sub="Genuine resolutions" color={COLORS.gr} Icon={CheckCircle} />
          <StatCard label="Escalated / Alert" value={stats.escalated} sub="Fake closure or escalated" color={COLORS.re} Icon={AlertTriangle} />
          <StatCard label="SLA Compliance" value={`${stats.slaRate}%`} sub={`${stats.overdue} overdue`} color={stats.slaRate > 70 ? COLORS.gr : COLORS.re} Icon={Clock} />
        </div>

        {/* Issue Types bar */}
        {stats.typeData.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
            <SectionTitle>Complaints by Issue Type</SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.typeData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,17,8,.08)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: COLORS.ink3, fontFamily: "'Space Mono', monospace" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fill: COLORS.ink3, fontFamily: "'Space Mono', monospace" }} width={110} />
                <Tooltip content={<DossierTooltip />} />
                <Bar dataKey="count" name="Complaints" radius={[0, 4, 4, 0]}>
                  {stats.typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Status pie */}
          {stats.statusData.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px' }}>
              <SectionTitle>Status Breakdown</SectionTitle>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={2}>
                    {stats.statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<DossierTooltip />} />
                  <Legend
                    iconSize={8}
                    wrapperStyle={{ fontSize: 8, fontFamily: "'Space Mono', monospace", lineHeight: '18px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Severity bar */}
          <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px' }}>
            <SectionTitle>Severity Distribution</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.severityData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,17,8,.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: COLORS.ink3, fontFamily: "'Space Mono', monospace" }} />
                <YAxis tick={{ fontSize: 9, fill: COLORS.ink3 }} />
                <Tooltip content={<DossierTooltip />} />
                <Bar dataKey="count" name="Complaints" radius={[4, 4, 0, 0]}>
                  {stats.severityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
          <SectionTitle>Filing & Resolution Timeline (Last 14 Days)</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={stats.days} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,17,8,.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 8, fill: COLORS.ink3, fontFamily: "'Space Mono', monospace" }} />
              <YAxis tick={{ fontSize: 8, fill: COLORS.ink3 }} allowDecimals={false} />
              <Tooltip content={<DossierTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 9, fontFamily: "'Space Mono', monospace" }} />
              <Line type="monotone" dataKey="filed" name="Filed" stroke={COLORS.sf} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke={COLORS.gr} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* City distribution */}
        {stats.cityData.length > 1 && (
          <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
            <SectionTitle>Complaints by City</SectionTitle>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={stats.cityData} margin={{ top: 0, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,17,8,.08)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: COLORS.ink3, fontFamily: "'Space Mono', monospace" }} />
                <YAxis tick={{ fontSize: 8, fill: COLORS.ink3 }} allowDecimals={false} />
                <Tooltip content={<DossierTooltip />} />
                <Bar dataKey="count" name="Complaints" fill={COLORS.sf} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* SLA meter */}
        <div style={{ background: '#fff', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
          <SectionTitle>SLA Compliance Meter</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 14, background: 'var(--ns-paper-2)', borderRadius: 7, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${stats.slaRate}%`,
                background: stats.slaRate > 70 ? COLORS.gr : stats.slaRate > 40 ? COLORS.am : COLORS.re,
                borderRadius: 7,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: COLORS.ink, minWidth: 48 }}>
              {stats.slaRate}%
            </span>
          </div>
          <p style={{ fontSize: 10, color: COLORS.ink3, marginTop: 8, fontFamily: "'Figtree', sans-serif" }}>
            {stats.overdue} complaint{stats.overdue !== 1 ? 's' : ''} breached SLA · {stats.slaRate}% within mandated resolution window
          </p>
        </div>

        {/* Bhashini status */}
        <div style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.ink3, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
            Multilingual Support · Bhashini (India Govt)
          </div>
          <p style={{ fontSize: 11, color: COLORS.ink, fontFamily: "'Figtree', sans-serif", margin: 0 }}>
            Hindi · Bengali · Tamil · Telugu · Marathi · Gujarati · Kannada · Malayalam
            <br />
            <span style={{ color: COLORS.am, fontSize: 10 }}>
              Register at bhashini.gov.in/ulca to activate free translation + TTS for all Indian languages.
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
