// lib/persistence.ts — localStorage persistence layer (Firebase-ready structure)

import { Complaint } from './types';
import { MOCK_COMPLAINTS } from './mockData';

const KEY = 'ns:complaints:v2';
const CHAT_KEY = 'ns:chat:v1';

// ── Complaints ────────────────────────────────────────────────────────────────

export function saveComplaints(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Only persist user-filed complaints, not mock seed data
    const userFiled = complaints.filter(c => !MOCK_COMPLAINTS.find(m => m.id === c.id));
    localStorage.setItem(KEY, JSON.stringify(userFiled));
  } catch {}
}

export function loadComplaints(): Complaint[] {
  if (typeof window === 'undefined') return MOCK_COMPLAINTS;
  try {
    const raw = localStorage.getItem(KEY);
    const userFiled: Complaint[] = raw ? JSON.parse(raw) : [];
    // Merge user-filed (newest first) + mock seed data
    const userIds = new Set(userFiled.map(c => c.id));
    const mocks = MOCK_COMPLAINTS.filter(c => !userIds.has(c.id));
    return [...userFiled, ...mocks];
  } catch {
    return MOCK_COMPLAINTS;
  }
}

export function upsertComplaint(complaint: Complaint, current: Complaint[]): Complaint[] {
  const exists = current.find(c => c.id === complaint.id);
  const next = exists
    ? current.map(c => c.id === complaint.id ? complaint : c)
    : [complaint, ...current];
  saveComplaints(next);
  return next;
}

export function getComplaintShareUrl(complaintId: string): string {
  if (typeof window === 'undefined') return `/dashboard?complaint=${complaintId}`;
  return `${window.location.origin}/dashboard?complaint=${complaintId}`;
}

export function buildWhatsAppShareText(complaint: Complaint): string {
  const statusLabel: Record<string, string> = {
    FILED: 'Filed', ASSIGNED: 'Assigned', IN_PROGRESS: 'In Progress',
    FAKE_CLOSURE_DETECTED: '⚠️ Fake Closure Detected', ESCALATED: 'Escalated',
    GENUINELY_RESOLVED: '✅ Resolved', RTI_FILED: 'RTI Filed',
  };
  return (
    `🇮🇳 *Nagrik Setu — Civic Complaint*\n\n` +
    `*ID:* ${complaint.id}\n` +
    `*Issue:* ${complaint.issueType.replace(/_/g, ' ')}\n` +
    `*Location:* ${complaint.location.address}, ${complaint.location.ward}\n` +
    `*Status:* ${statusLabel[complaint.status] || complaint.status}\n` +
    `*Severity:* ${complaint.severity}\n` +
    `*Dept:* ${complaint.department} — ${complaint.municipalBody}\n` +
    `*Filed:* ${new Date(complaint.filedAt).toLocaleDateString('en-IN')}\n\n` +
    `Track this complaint: ${getComplaintShareUrl(complaint.id)}\n` +
    `_Powered by Nagrik Setu — India's Civic AI Agent_`
  );
}

// ── Chat history ──────────────────────────────────────────────────────────────

export function saveChatHistory(history: { role: 'user' | 'model'; parts: { text: string }[] }[]): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(CHAT_KEY, JSON.stringify(history.slice(-20))); } catch {}
}

export function loadChatHistory(): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
