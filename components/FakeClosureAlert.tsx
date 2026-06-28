'use client';

// components/FakeClosureAlert.tsx — Standalone fake closure alert component

import { AlertTriangle, ChevronRight } from 'lucide-react';
import { FakeClosureAnalysis } from '@/lib/types';

interface Props {
  complaintId: string;
  analysis: FakeClosureAnalysis;
  onAction: (choice: 1 | 2 | 3 | 4 | 5) => void;
}

const ACTION_LABELS: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: 'Escalate to Ward Officer (with evidence)', icon: '📢', color: 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100' },
  2: { label: 'Draft email to Deputy Commissioner', icon: '📧', color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100' },
  3: { label: 'Draft RTI application (strongest legal tool)', icon: '📄', color: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100' },
  4: { label: 'File complaint against officer (false reporting)', icon: '⚖️', color: 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100' },
  5: { label: "I'll verify myself (send new photo)", icon: '📸', color: 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100' },
};

export default function FakeClosureAlert({ complaintId, analysis, onAction }: Props) {
  const probColor = analysis.probability >= 75 ? 'text-red-700' : analysis.probability >= 50 ? 'text-orange-700' : 'text-yellow-700';
  const probBg = analysis.probability >= 75 ? 'bg-red-50 border-red-200' : analysis.probability >= 50 ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200';

  return (
    <div className={`rounded-xl border-2 border-red-300 bg-red-50/80 p-4 w-full`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-red-600" />
        </div>
        <div>
          <div className="font-bold text-red-900 text-sm">⚠️ Suspicious Closure Detected</div>
          <div className="font-mono text-xs text-red-600">{complaintId}</div>
        </div>
        <div className={`ml-auto text-xs font-bold px-2 py-1 rounded-lg border ${probBg} ${probColor}`}>
          {analysis.probability}% fake probability
        </div>
      </div>

      {/* Red flags */}
      <div className="bg-white/70 rounded-lg p-3 mb-3 space-y-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">🔍 What I found:</div>
        {analysis.flags.map((flag, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-red-800">
            <span className="mt-0.5 flex-shrink-0">❌</span>
            <div>
              <span className="font-medium">{flag.flag}</span>
              {flag.detail && <span className="text-red-600"> — {flag.detail}</span>}
            </div>
          </div>
        ))}
        {analysis.officerClosureRate !== undefined && (
          <div className="flex items-start gap-2 text-xs text-red-800">
            <span className="mt-0.5 flex-shrink-0">📊</span>
            <span>Officer same-day closure rate this week: <strong>{analysis.officerClosureRate}%</strong> — statistically impossible for real repairs</span>
          </div>
        )}
      </div>

      {/* Action choices */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-red-900 mb-2">What should I do?</div>
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const action = ACTION_LABELS[n];
          return (
            <button
              key={n}
              onClick={() => onAction(n)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${action.color}`}
            >
              <span>{action.icon}</span>
              <span className="flex-1 text-left">{n}️⃣ {action.label}</span>
              <ChevronRight size={12} className="flex-shrink-0 opacity-60" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
