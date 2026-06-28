'use client';

// components/WardScorecard.tsx

import { useState } from 'react';
import { WardScorecard as WardScorecardType, Complaint } from '@/lib/types';
import { Download, Share2, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  ward: WardScorecardType;
  complaints: Complaint[];
}

const GRADE_SF: Record<string, string> = {
  A: 'var(--ns-gr)', B: '#2563eb', C: 'var(--ns-am)', D: 'var(--ns-sf)', F: 'var(--ns-re)',
};
const GRADE_LABEL: Record<string, string> = {
  A: 'Excellent', B: 'Good', C: 'Average', D: 'Poor', F: 'Critical Failure',
};
const ISSUE_ICONS: Record<string, string> = {
  GARBAGE: '🗑️', POTHOLE: '🕳️', STREET_LIGHT: '💡', WATER_SUPPLY: '💧',
  SEWAGE: '🚽', DRAINAGE: '🌊', ENCROACHMENT: '🚧', DEAD_ANIMAL: '🐾',
  STRAY_DOG: '🐕', TREE_FALLEN: '🌳', BURNING_WASTE: '🔥', NOISE_POLLUTION: '🔊',
};

function IssueBars({ ward }: { ward: WardScorecardType }) {
  const max = ward.topIssues[0]?.count || 1;
  return (
    <div className="space-y-2.5">
      {ward.topIssues.map((issue, i) => (
        <div key={issue.type} className="flex items-center gap-2.5">
          <span className="text-base w-5 flex-shrink-0 text-center">{ISSUE_ICONS[issue.type] || '⚠️'}</span>
          <span
            className="text-xs w-24 flex-shrink-0 truncate"
            style={{ color: 'var(--ns-ink-2)' }}
          >
            {issue.type.replace(/_/g, ' ')}
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--ns-paper-3)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(issue.count / max) * 100}%`,
                background: i === 0 ? 'var(--ns-re)' : i === 1 ? 'var(--ns-am)' : 'var(--ns-sf)',
              }}
            />
          </div>
          <span
            className="text-xs w-6 text-right flex-shrink-0"
            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-3)' }}
          >
            {issue.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function MetricRow({
  label, value, pct, color, note,
}: {
  label: React.ReactNode;
  value: string;
  pct: number;
  color: string;
  note?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--ns-ink-3)' }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--ns-ink)', fontFamily: "'Space Mono', monospace" }}>
          {value}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--ns-paper-3)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      {note && (
        <p className="text-[10px] leading-snug" style={{ color: 'var(--ns-ink-4)' }}>{note}</p>
      )}
    </div>
  );
}

export default function WardScorecard({ ward, complaints }: Props) {
  const [exporting, setExporting] = useState(false);
  const gradeColor = GRADE_SF[ward.grade] || 'var(--ns-re)';
  const delta      = ward.overallScore - ward.cityAvgScore;

  const exportToSheets = async () => {
    setExporting(true);
    try {
      const res  = await fetch('/api/sheets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wardData: ward, complaints }) });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else if (data.csvData) {
        const blob = new Blob([data.csvData], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ward-${ward.wardNumber}-scorecard.csv`; a.click();
      }
    } finally { setExporting(false); }
  };

  const shareScorecard = () => {
    const text = `Ward ${ward.wardNumber} ${ward.wardName} Civic Score: ${ward.overallScore}/100 (Grade ${ward.grade})\nResolution: ${ward.genuineResolutionRate}% | Fake Closures: ${ward.fakeClosureRate}%\nCouncillor: ${ward.councillorName}\nSource: Nagrik Setu`;
    if (navigator.share) navigator.share({ title: 'Ward Accountability Score', text });
    else navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: 'var(--ns-paper)' }}>
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── Grade card ── */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
        >
          <div className="flex items-start gap-4">
            {/* Grade circle */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-full"
              style={{
                width: 80, height: 80,
                border: `3px solid ${gradeColor}`,
              }}
            >
              <span
                className="font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: gradeColor }}
              >
                {ward.grade}
              </span>
              <span
                className="text-xs mt-0.5"
                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
              >
                {ward.overallScore}/100
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="text-[10px] font-semibold tracking-widest mb-0.5"
                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
              >
                WARD {ward.wardNumber} · {ward.city}
              </div>
              <h2
                className="text-lg font-bold mb-0.5"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ns-ink)' }}
              >
                {ward.wardName}
              </h2>
              <div className="text-xs mb-2.5" style={{ color: 'var(--ns-ink-3)' }}>
                {GRADE_LABEL[ward.grade]} · Rank {ward.wardRank} of {ward.totalWards}
              </div>

              {/* Councillor chip */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: 'var(--ns-sfp)', border: '1px solid rgba(224,96,10,.2)', color: 'var(--ns-sfd)' }}
              >
                {ward.councillorName} · {ward.councillorParty}
              </span>
            </div>

            {/* vs City avg */}
            <div
              className="flex-shrink-0 text-center rounded-lg px-3 py-2"
              style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
            >
              <div className="text-[9.5px] mb-1" style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}>VS CITY</div>
              <div
                className="text-base font-bold flex items-center gap-1"
                style={{ color: delta >= 0 ? 'var(--ns-gr)' : 'var(--ns-re)', fontFamily: "'Space Mono', monospace" }}
              >
                {delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(delta)}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: 'var(--ns-ink-4)' }}>pts</div>
            </div>
          </div>

          {/* 4-stat grid */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Resolution', value: `${ward.genuineResolutionRate}%`, color: 'var(--ns-gr)' },
              { label: 'Avg Resolve', value: `${ward.avgResolutionDays}d`,    color: ward.avgResolutionDays > 7 ? 'var(--ns-re)' : 'var(--ns-am)' },
              { label: 'Fake Closure', value: `${ward.fakeClosureRate}%`,     color: ward.fakeClosureRate > 25 ? 'var(--ns-re)' : 'var(--ns-am)' },
              { label: 'Monthly',     value: `${ward.complaintVolume}`,       color: 'var(--ns-sf)' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-lg p-2.5 text-center"
                style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
              >
                <div
                  className="text-lg font-bold leading-none mb-1"
                  style={{ fontFamily: "'Space Mono', monospace", color }}
                >
                  {value}
                </div>
                <div className="text-[9.5px] uppercase tracking-wide" style={{ color: 'var(--ns-ink-3)' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Metrics ── */}
        <div
          className="rounded-xl p-4 space-y-4"
          style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
        >
          <div
            className="text-[9.5px] font-bold tracking-widest"
            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
          >
            PERFORMANCE METRICS
          </div>

          <MetricRow
            label={<><CheckCircle size={11} style={{ color: 'var(--ns-gr)' }} /> Genuine Resolution Rate</>}
            value={`${ward.genuineResolutionRate}%`}
            pct={ward.genuineResolutionRate}
            color="var(--ns-gr)"
            note={`City avg: ${ward.cityAvgScore}% · ${ward.genuineResolutionRate < 50 ? 'Below acceptable threshold' : 'Needs improvement'}`}
          />
          <MetricRow
            label="Avg Resolution Time"
            value={`${ward.avgResolutionDays} days`}
            pct={Math.max(0, 10 - ward.avgResolutionDays) * 10}
            color={ward.avgResolutionDays > 7 ? 'var(--ns-re)' : ward.avgResolutionDays > 3 ? 'var(--ns-am)' : 'var(--ns-gr)'}
            note="Charter SLA: 1 day garbage · 2 days potholes"
          />
          <MetricRow
            label={<><AlertTriangle size={11} style={{ color: 'var(--ns-re)' }} /> Fake Closure Rate</>}
            value={`${ward.fakeClosureRate}%${ward.fakeClosureRate > 25 ? ' 🚨' : ''}`}
            pct={100 - ward.fakeClosureRate}
            color={ward.fakeClosureRate > 25 ? 'var(--ns-re)' : 'var(--ns-am)'}
            note="Complaints marked resolved without actual work"
          />
          <MetricRow
            label="SLA Compliance Rate"
            value={`${ward.slaComplianceRate}%`}
            pct={ward.slaComplianceRate}
            color={ward.slaComplianceRate > 60 ? 'var(--ns-gr)' : ward.slaComplianceRate > 30 ? 'var(--ns-am)' : 'var(--ns-re)'}
          />
          <MetricRow
            label="Escalation Rate"
            value={`${ward.escalationRate}%`}
            pct={100 - ward.escalationRate}
            color={ward.escalationRate > 50 ? 'var(--ns-re)' : 'var(--ns-am)'}
            note="Higher = first-level response failing citizens"
          />
        </div>

        {/* ── Top issues ── */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-[9.5px] font-bold tracking-widest"
              style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
            >
              TOP ISSUES BY VOLUME
            </div>
            <span
              className="text-xs"
              style={{ color: 'var(--ns-ink-3)', fontFamily: "'Space Mono', monospace" }}
            >
              {ward.complaintVolume}/mo
            </span>
          </div>
          <IssueBars ward={ward} />
        </div>

        {/* ── AI Insight ── */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--ns-sfp)', border: '1px solid rgba(224,96,10,.18)' }}
        >
          <div
            className="text-[9.5px] font-bold tracking-widest mb-2"
            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-sfd)' }}
          >
            AI INSIGHT
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--ns-ink-2)' }}>
            {ward.fakeClosureRate > 25
              ? `Ward ${ward.wardNumber} has a critically high fake closure rate of ${ward.fakeClosureRate}%. AI has detected suspicious closure patterns — filing RTI may compel transparency and trigger a departmental audit. Consider escalating directly to the MLA.`
              : ward.overallScore < ward.cityAvgScore
                ? `Ward ${ward.wardNumber} is ${Math.abs(delta)} points below city average. Key areas for improvement: resolution time (${ward.avgResolutionDays}d vs 2d SLA) and SLA compliance (${ward.slaComplianceRate}%).`
                : `Ward ${ward.wardNumber} is performing above city average. ${ward.genuineResolutionRate}% genuine resolution rate is commendable. Continue filing and tracking to maintain accountability pressure.`
            }
          </p>
        </div>

        {/* ── Councillor card ── */}
        <div
          className="rounded-xl p-4"
          style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
        >
          <div
            className="text-[9.5px] font-bold tracking-widest mb-3"
            style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
          >
            ELECTED REPRESENTATIVE
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--ns-ink)' }}>{ward.councillorName}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ns-ink-3)' }}>Ward Councillor · {ward.councillorParty}</div>
              <div className="text-xs mt-2 flex items-center gap-1" style={{ color: 'var(--ns-ink-3)' }}>
                Meetings attended:
                <span
                  className="font-semibold"
                  style={{ color: ward.councillorMeetingsAttended < ward.councillorTotalMeetings / 2 ? 'var(--ns-re)' : 'var(--ns-gr)' }}
                >
                  {ward.councillorMeetingsAttended}/{ward.councillorTotalMeetings}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', serif", color: ward.councillorRating < 3 ? 'var(--ns-re)' : ward.councillorRating < 6 ? 'var(--ns-am)' : 'var(--ns-gr)' }}
              >
                {ward.councillorRating}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--ns-ink-4)' }}>/10</div>
            </div>
          </div>
          <p
            className="text-xs mt-3 pt-3 leading-snug"
            style={{ color: 'var(--ns-ink-3)', borderTop: '1px solid var(--ns-bd)' }}
          >
            {ward.councillorRating < 3
              ? `⚠️ ${ward.councillorName} has one of the lowest accountability ratings. Consider raising issues directly at ward committee meetings.`
              : `${ward.councillorName} is moderately responsive. File complaints through official channels first.`
            }
          </p>
        </div>

        {/* ── Export ── */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={exportToSheets}
            disabled={exporting}
            className="ns-btn flex-1 justify-center py-2.5"
          >
            <Download size={14} />
            {exporting ? 'Exporting…' : 'Export to Sheets'}
          </button>
          <button
            onClick={shareScorecard}
            className="ns-btn ns-btn-pr flex-1 justify-center py-2.5"
          >
            <Share2 size={14} />
            Share Score
          </button>
        </div>

      </div>
    </div>
  );
}
