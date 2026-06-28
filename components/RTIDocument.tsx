'use client';

// components/RTIDocument.tsx — RTI application display and export component

import { useState } from 'react';
import { FileText, Copy, Download, CheckCircle } from 'lucide-react';

interface RTIData {
  complaintId: string;
  issueType: string;
  location: string;
  municipalBody: string;
  department: string;
  filedDate: string;
  citizenName?: string;
  citizenAddress?: string;
  cityState: string;
  pioAddress: string;
  rtiPortal: string;
  fee: string;
}

interface Props {
  data: RTIData;
  onClose?: () => void;
}

function buildRTIText(d: RTIData): string {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  return `TO: The Public Information Officer,
${d.department}, ${d.municipalBody}
${d.pioAddress}

Subject: Application under the Right to Information Act, 2005
        Complaint ID: ${d.complaintId} — ${d.issueType} at ${d.location}

Respected Sir/Madam,

I, ${d.citizenName || '[Citizen Name]'}, residing at ${d.citizenAddress || '[Your Address]'}, ${d.cityState}, hereby request the following information under Section 6(1) of the Right to Information Act, 2005:

1. CURRENT STATUS: The current status of civic complaint ID ${d.complaintId}, filed on ${d.filedDate} regarding ${d.issueType} at ${d.location}, including whether it has been genuinely resolved or is still pending.

2. OFFICER DETAILS: Name, designation, employee ID, and contact details of all officers who were assigned to, inspected, or took any action on complaint ID ${d.complaintId}.

3. ACTION LOG: A complete chronological log of all actions taken on complaint ID ${d.complaintId}, with dates, times, officer names, and nature of each action — including any field inspection reports or photographs submitted.

4. CLOSURE EVIDENCE (if closed): If the complaint has been marked as "Resolved" or "Closed," please provide:
   (a) Photographic evidence of the completed work, including GPS coordinates and timestamp of photographs
   (b) Name and designation of the inspecting officer who certified the repair
   (c) The statistical closure rate of the officer(s) who closed this complaint in the current calendar week (total complaints assigned vs. closed same-day)

5. REASON FOR DELAY (if unresolved): If the complaint has not been resolved, please provide the specific reason(s) for non-resolution and the committed timeline for resolution, as per the ${d.municipalBody} Citizen Charter.

6. SLA COMPLIANCE: The applicable resolution timeline (SLA) for this category of complaint under the ${d.municipalBody} Citizen Charter, and whether this SLA has been met for complaint ${d.complaintId}.

I am enclosing the required application fee of ${d.fee}/- (Ten Rupees only) by [Indian Postal Order / Demand Draft / Online transfer as applicable].

If the above information is not provided within 30 (thirty) days of receipt of this application, I shall file a First Appeal under Section 19(1) of the Right to Information Act, 2005 before the First Appellate Authority. I may also approach the Central/State Information Commission if required.

RTI Portal Reference: ${d.rtiPortal}

Thanking you,

Yours faithfully,

${d.citizenName || '[Citizen Name]'}
${d.citizenAddress || '[Address]'}
${d.cityState}
Phone: [Your Phone Number]
Email: [Your Email]

Date: ${today}

Enclosures:
1. RTI Application Fee: Rs. ${d.fee}/-
2. Screenshot of complaint ${d.complaintId} showing filing date and status
3. Screenshot of "Resolved" notification (if fake closure detected)`;
}

export default function RTIDocument({ data, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const rtiText = buildRTIText(data);

  const copyText = async () => {
    await navigator.clipboard.writeText(rtiText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([rtiText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RTI-${data.complaintId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-xl border border-purple-200 bg-purple-50/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-purple-100">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
          <FileText size={14} className="text-purple-600" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">RTI Application — Ready to File</div>
          <div className="text-xs text-gray-500">File at: {data.rtiPortal}</div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={copyText}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            {copied ? <CheckCircle size={12} className="text-green-600" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadTxt}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      {/* Document body */}
      <div className="p-4">
        <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-lg border border-purple-100 p-4 overflow-x-auto max-h-80 overflow-y-auto">
          {rtiText}
        </pre>
      </div>

      {/* Footer guidance */}
      <div className="px-4 pb-4 space-y-2">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="text-xs font-semibold text-blue-800 mb-1">📋 How to file this RTI:</div>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Go to <strong>{data.rtiPortal}</strong> or visit the {data.municipalBody} office</li>
            <li>Pay fee of Rs. {data.fee}/- (online, DD, or postal order)</li>
            <li>Response due within <strong>30 days</strong> under RTI Act, 2005</li>
            <li>If no response: File First Appeal under Section 19(1)</li>
          </ol>
        </div>
        <div className="text-[10px] text-gray-400 text-center">
          RTI Act 2005, Section 6(1) • Fee: Rs. {data.fee}/- • Response due: 30 days
        </div>
      </div>
    </div>
  );
}

export { buildRTIText };
export type { RTIData };
