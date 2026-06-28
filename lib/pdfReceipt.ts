// lib/pdfReceipt.ts — Generate stamped complaint receipt PDF using jsPDF
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Complaint } from './types';

const SAFFRON = '#E0600A';
const INK     = '#1B1108';
const PAPER   = '#F7F2E8';
const GREEN   = '#175E35';
const RED     = '#BF1B0E';
const AMBER   = '#B87A0A';

function statusColor(s: string): string {
  if (s === 'GENUINELY_RESOLVED') return GREEN;
  if (s === 'FAKE_CLOSURE_DETECTED' || s === 'ESCALATED') return RED;
  if (s === 'IN_PROGRESS' || s === 'ASSIGNED') return AMBER;
  return SAFFRON;
}

function hex(c: string): [number, number, number] {
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);
  return [r, g, b];
}

export async function generateComplaintPDF(complaint: Complaint): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;

  // ── Background ──────────────────────────────────────────────────────────
  doc.setFillColor(...hex(PAPER));
  doc.rect(0, 0, W, H, 'F');

  // ── Saffron header band ─────────────────────────────────────────────────
  doc.setFillColor(...hex(SAFFRON));
  doc.rect(0, 0, W, 28, 'F');

  doc.setTextColor(247, 242, 232);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NAGRIK SETU', 14, 11);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CIVIC COMPLAINT RECEIPT', 14, 17);
  doc.text('नागरिक शिकायत रसीद', 14, 22);

  // Complaint ID top-right
  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.text(complaint.id, W - 14, 13, { align: 'right' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.text('COMPLAINT ID', W - 14, 20, { align: 'right' });

  // ── Divider ─────────────────────────────────────────────────────────────
  doc.setDrawColor(...hex(SAFFRON));
  doc.setLineWidth(0.5);
  doc.line(14, 32, W - 14, 32);

  // ── Status stamp ────────────────────────────────────────────────────────
  const sc = statusColor(complaint.status);
  doc.setTextColor(...hex(sc));
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const stamp = complaint.status.replace(/_/g, ' ');
  doc.text(stamp, W / 2, 45, { align: 'center' });
  doc.setDrawColor(...hex(sc));
  doc.setLineWidth(1.5);
  doc.roundedRect(W / 2 - 55, 36, 110, 14, 2, 2);

  // ── Issue type banner ────────────────────────────────────────────────────
  doc.setFillColor(...hex('#EEE8DB'));
  doc.rect(14, 55, W - 28, 12, 'F');
  doc.setTextColor(...hex(INK));
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(complaint.issueType.replace(/_/g, ' '), W / 2, 63, { align: 'center' });

  // ── Details grid ─────────────────────────────────────────────────────────
  let y = 76;
  const filedDate = complaint.filedAt ? new Date(complaint.filedAt) : new Date();
  const slaDeadlineDate = complaint.slaDeadline ? new Date(complaint.slaDeadline) : new Date(filedDate.getTime() + 24 * 3600000);
  
  const fields: [string, string][] = [
    ['Filed On',       filedDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' })],
    ['Location',       `${complaint.location.area || 'Dum Dum'}, ${complaint.location.ward || 'Ward 57'}, ${complaint.location.city || 'KOLKATA'}`],
    ['Address',        complaint.location.address || 'Address not specified'],
    ['Department',     complaint.department || 'Municipal Services'],
    ['Municipal Body', complaint.municipalBody || 'Kolkata Municipal Corporation'],
    ['Severity',       complaint.severity || 'HIGH'],
    ['Priority',       complaint.priority || 'P2'],
    ['SLA Deadline',   slaDeadlineDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' })],
    ['SLA Hours',      `${complaint.slaHours || 24} hours`],
    ['Helpline',       complaint.portalHelpline || '1916'],
  ];

  for (const [label, value] of fields) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex('#8C7A62'));
    doc.text(label.toUpperCase(), 14, y);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hex(INK));
    const lines = doc.splitTextToSize(value || '', W - 80);
    doc.text(lines, 70, y);

    doc.setDrawColor(200, 190, 175);
    doc.setLineWidth(0.2);
    doc.line(14, y + 3, W - 14, y + 3);
    y += Math.max(8, lines.length * 5);
    if (y > H - 50) break;
  }

  // ── Description ──────────────────────────────────────────────────────────
  if (y < H - 60) {
    y += 4;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex('#8C7A62'));
    doc.text('DESCRIPTION', 14, y);
    y += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hex(INK));
    const descText = complaint.issueDescription || (complaint as any).description || 'Civic complaint registered via chatbot.';
    const desc = doc.splitTextToSize(descText, W - 28);
    doc.text(desc.slice(0, 6), 14, y);
    y += desc.slice(0, 6).length * 5;
  }

  // ── Officer (if assigned) ─────────────────────────────────────────────────
  if (complaint.assignedOfficer && y < H - 45) {
    y += 6;
    doc.setFillColor(...hex('#EAF5EF'));
    doc.rect(14, y - 4, W - 28, 22, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex(GREEN));
    doc.text('ASSIGNED OFFICER', 16, y + 1);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hex(INK));
    doc.text(`${complaint.assignedOfficer.name || 'Assigned Officer'} — ${complaint.assignedOfficer.designation || 'Supervisor'}`, 16, y + 7);
    doc.text(`${complaint.assignedOfficer.phone || ''} · ${complaint.assignedOfficer.email || ''}`, 16, y + 13);
    y += 26;
  }

  // ── Escalations ───────────────────────────────────────────────────────────
  const escalations = complaint.escalations || [];
  if (escalations.length > 0 && y < H - 45) {
    y += 4;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex('#8C7A62'));
    doc.text('ESCALATION TRAIL', 14, y);
    y += 5;
    for (const esc of escalations.slice(0, 4)) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hex(INK));
      const escDate = esc.date ? new Date(esc.date).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
      const escLine = `${escDate} · ${(esc.level || '').replace(/_/g,' ')} → ${esc.to || 'Authority'} [${esc.status || 'SENT'}]`;
      doc.text(escLine, 16, y);
      y += 6;
      if (y > H - 40) break;
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFillColor(...hex(SAFFRON));
  doc.rect(0, H - 18, W, 18, 'F');
  doc.setTextColor(247, 242, 232);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated by Nagrik Setu · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, W / 2, H - 11, { align: 'center' });
  doc.text('नागरिक सेतु — जनता की आवाज़, AI की ताकत', W / 2, H - 5, { align: 'center' });

  // ── QR Code Verification (Real QRCode Generation) ─────────────────────────
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'nagrik-setu.vercel.app'}/dashboard?complaint=${complaint.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 100 });
    doc.addImage(qrDataUrl, 'PNG', 14, H - 40, 20, 20);
    
    doc.setTextColor(...hex('#8C7A62'));
    doc.setFontSize(6);
    doc.text('Scan code to verify and track online', 36, H - 30);
  } catch (err) {
    console.error('QR code generation failed:', err);
    doc.setTextColor(...hex('#8C7A62'));
    doc.setFontSize(6);
    doc.text(`Verify online: ${verifyUrl}`, 14, H - 22);
  }

  doc.save(`nagrik-setu-receipt-${complaint.id}.pdf`);
}
