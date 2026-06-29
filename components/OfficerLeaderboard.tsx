'use client';

// components/OfficerLeaderboard.tsx

import { useState, useMemo } from 'react';
import { Complaint } from '@/lib/types';

interface Props {
  complaints: Complaint[];
  onSelectOfficer?: (officer: OfficerStats) => void;
}

export interface OfficerStats {
  name: string;
  designation: string;
  totalComplaints: number;
  resolvedCount: number;
  fakeCount: number;
  avgDaysToResolve: number;
  slaBreaches: number;
  performanceScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  phone?: string;
  email?: string;
}

function computeGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--ns-gr)';
  if (score >= 40) return 'var(--ns-am)';
  return 'var(--ns-re)';
}

function scoreBg(score: number): string {
  if (score >= 70) return 'rgba(23,94,53,0.10)';
  if (score >= 40) return 'rgba(184,122,10,0.10)';
  return 'rgba(191,27,14,0.10)';
}

export function buildOfficerStats(complaints: Complaint[]): OfficerStats[] {
  const byOfficer = new Map<string, Complaint[]>();

  for (const c of complaints) {
    if (!c.assignedOfficer?.name) continue;
    const key = c.assignedOfficer.name;
    if (!byOfficer.has(key)) byOfficer.set(key, []);
    byOfficer.get(key)!.push(c);
  }

  const stats: OfficerStats[] = [];

  byOfficer.forEach((cs, name) => {
    const officer = cs[0].assignedOfficer!;
    const total = cs.length;
    const resolvedCount = cs.filter(c => c.status === 'GENUINELY_RESOLVED').length;
    const fakeCount = cs.filter(c => c.status === 'FAKE_CLOSURE_DETECTED').length;

    const resolvedCs = cs.filter(c => c.status === 'GENUINELY_RESOLVED');
    const totalDays = resolvedCs.reduce((sum, c) => {
      const filed = new Date(c.filedAt).getTime();
      const updated = new Date(c.lastUpdatedAt).getTime();
      const days = Math.max(0, (updated - filed) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const avgDaysToResolve = resolvedCs.length > 0 ? Math.round((totalDays / resolvedCs.length) * 10) / 10 : 0;

    const slaBreaches = cs.filter(c => {
      if (c.status === 'GENUINELY_RESOLVED') return false;
      const deadline = new Date(c.slaDeadline).getTime();
      const updated = new Date(c.lastUpdatedAt).getTime();
      return deadline < updated;
    }).length;

    const rawScore =
      (resolvedCount / total) * 50
      - (fakeCount / total) * 30
      - (slaBreaches / total) * 20;

    const performanceScore = Math.min(100, Math.max(0, Math.round(rawScore)));
    const grade = computeGrade(performanceScore);

    stats.push({
      name,
      designation: officer.designation,
      totalComplaints: total,
      resolvedCount,
      fakeCount,
      avgDaysToResolve,
      slaBreaches,
      performanceScore,
      grade,
      phone: officer.phone,
      email: officer.email,
    });
  });

  return stats.sort((a, b) => b.performanceScore - a.performanceScore);
}

type FilterType = 'all' | 'top' | 'problematic';

function StatChip({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: '10px 18px',
        background: '#fff',
        border: '1px solid var(--ns-bd)',
        borderRadius: 10,
        minWidth: 90,
        flex: 1,
      }}
    >
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 18,
          fontWeight: 700,
          color: color || 'var(--ns-ink)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          color: 'var(--ns-ink-4)',
          fontFamily: "'Space Mono', monospace",
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          textAlign: 'center',
          marginTop: 3,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function OfficerCard({ officer, onClick }: { officer: OfficerStats; onClick?: () => void }) {
  const color = scoreColor(officer.performanceScore);
  const bg = scoreBg(officer.performanceScore);

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--ns-bd)',
        borderRadius: 12,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: onClick ? 'pointer' : 'default',
      }}
      className="transition-transform hover:scale-[1.01] hover:shadow-sm"
    >
      {/* Top row: score badge + name + grade */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Score badge */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: bg,
            border: `2px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {officer.performanceScore}
          </span>
        </div>

        {/* Name + designation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: 'var(--ns-ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {officer.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--ns-ink-3)',
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {officer.designation}
          </div>
        </div>

        {/* Grade letter */}
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: bg,
            border: `1.5px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 15,
              color,
              lineHeight: 1,
            }}
          >
            {officer.grade}
          </span>
        </div>
      </div>

      {/* Mini stat row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: 'var(--ns-ink-3)',
        }}
      >
        <span style={{ color: 'var(--ns-gr)', fontWeight: 700 }}>
          {officer.resolvedCount} resolved
        </span>
        <span style={{ color: 'var(--ns-ink-4)' }}>/</span>
        <span>{officer.totalComplaints} total</span>
        {officer.slaBreaches > 0 && (
          <>
            <span style={{ color: 'var(--ns-ink-4)' }}>·</span>
            <span style={{ color: 'var(--ns-am)' }}>
              {officer.slaBreaches} SLA {officer.slaBreaches === 1 ? 'breach' : 'breaches'}
            </span>
          </>
        )}
        {officer.fakeCount > 0 && (
          <>
            <span style={{ color: 'var(--ns-ink-4)' }}>·</span>
            <span style={{ color: 'var(--ns-re)', fontWeight: 700 }}>
              {officer.fakeCount} fake {officer.fakeCount === 1 ? 'closure' : 'closures'}
            </span>
          </>
        )}
        {officer.avgDaysToResolve > 0 && (
          <>
            <span style={{ color: 'var(--ns-ink-4)' }}>·</span>
            <span>{officer.avgDaysToResolve}d avg</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          borderRadius: 4,
          background: 'var(--ns-paper-3)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 4,
            width: `${officer.performanceScore}%`,
            background: color,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function OfficerLeaderboard({ complaints, onSelectOfficer }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');

  const allOfficers = useMemo(() => buildOfficerStats(complaints), [complaints]);

  const filteredOfficers = useMemo(() => {
    if (filter === 'top') return allOfficers.filter(o => o.performanceScore >= 70);
    if (filter === 'problematic') return allOfficers.filter(o => o.performanceScore < 40 || o.fakeCount > 0);
    return allOfficers;
  }, [allOfficers, filter]);

  const avgResolution = allOfficers.length > 0
    ? Math.round(allOfficers.reduce((s, o) => s + (o.totalComplaints > 0 ? (o.resolvedCount / o.totalComplaints) * 100 : 0), 0) / allOfficers.length)
    : 0;

  const totalFake = allOfficers.reduce((s, o) => s + o.fakeCount, 0);
  const totalComplaints = allOfficers.reduce((s, o) => s + o.totalComplaints, 0);
  const fakeCatchRate = totalComplaints > 0 ? Math.round((totalFake / totalComplaints) * 100) : 0;

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'top', label: 'Top Officers' },
    { key: 'problematic', label: 'Problematic' },
  ];

  // No officers assigned at all
  if (allOfficers.length === 0) {
    return (
      <div
        style={{
          padding: '32px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: 'var(--ns-paper)',
          borderRadius: 14,
          border: '1px dashed var(--ns-bd)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, lineHeight: 1 }}>📋</div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ns-ink)',
          }}
        >
          No officers assigned yet
        </div>
        <div style={{ fontSize: 12, color: 'var(--ns-ink-3)', maxWidth: 260 }}>
          Load the demo dataset to see officer accountability scores, resolution rates, and fake closure detection.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--ns-paper)', padding: '0 0 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--ns-ink)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Ward Officer Accountability
        </h2>
        <p style={{ fontSize: 11, color: 'var(--ns-ink-3)', margin: '4px 0 0', lineHeight: 1.4 }}>
          Resolution rates, SLA compliance &amp; fake closure detection
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <StatChip label="Officers" value={allOfficers.length} />
        <StatChip
          label="Avg resolution"
          value={`${avgResolution}%`}
          color={avgResolution >= 60 ? 'var(--ns-gr)' : avgResolution >= 35 ? 'var(--ns-am)' : 'var(--ns-re)'}
        />
        <StatChip
          label="Fake caught"
          value={`${fakeCatchRate}%`}
          color={fakeCatchRate > 15 ? 'var(--ns-re)' : fakeCatchRate > 5 ? 'var(--ns-am)' : 'var(--ns-gr)'}
        />
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {filterButtons.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '5px 12px',
                fontSize: 11,
                fontFamily: "'Space Mono', monospace",
                fontWeight: active ? 700 : 400,
                border: `1px solid ${active ? 'var(--ns-sf)' : 'var(--ns-bd)'}`,
                borderRadius: 6,
                background: active ? 'rgba(224,96,10,0.08)' : '#fff',
                color: active ? 'var(--ns-sf)' : 'var(--ns-ink-3)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}
            >
              {label}
              {key === 'top' && (
                <span
                  style={{
                    marginLeft: 5,
                    fontSize: 10,
                    background: 'rgba(23,94,53,0.12)',
                    color: 'var(--ns-gr)',
                    borderRadius: 4,
                    padding: '1px 5px',
                    fontWeight: 700,
                  }}
                >
                  {allOfficers.filter(o => o.performanceScore >= 70).length}
                </span>
              )}
              {key === 'problematic' && (
                <span
                  style={{
                    marginLeft: 5,
                    fontSize: 10,
                    background: 'rgba(191,27,14,0.10)',
                    color: 'var(--ns-re)',
                    borderRadius: 4,
                    padding: '1px 5px',
                    fontWeight: 700,
                  }}
                >
                  {allOfficers.filter(o => o.performanceScore < 40 || o.fakeCount > 0).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Officer cards */}
      {filteredOfficers.length === 0 ? (
        <div
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            color: 'var(--ns-ink-4)',
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
            border: '1px dashed var(--ns-bd)',
            borderRadius: 10,
            background: 'var(--ns-paper-2)',
          }}
        >
          No officers match this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredOfficers.map((officer, i) => (
            <div key={officer.name} style={{ position: 'relative' }}>
              {/* Rank badge for top 3 */}
              {filter === 'all' && i < 3 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -7,
                    left: 10,
                    zIndex: 1,
                    background: i === 0 ? '#B87A0A' : i === 1 ? '#888' : '#9C6A2D',
                    color: '#fff',
                    fontSize: 9,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    borderRadius: 4,
                    padding: '1px 6px',
                    letterSpacing: '0.05em',
                  }}
                >
                  #{i + 1}
                </div>
              )}
              <OfficerCard officer={officer} onClick={() => onSelectOfficer && onSelectOfficer(officer)} />
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div
        style={{
          marginTop: 14,
          fontSize: 10,
          color: 'var(--ns-ink-4)',
          fontFamily: "'Space Mono', monospace",
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Score = (resolved/total)×50 − (fake/total)×30 − (SLA breaches/total)×20
      </div>
    </div>
  );
}
