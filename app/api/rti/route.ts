// app/api/rti/route.ts — Generate complete RTI application

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Complaint } from '@/lib/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { complaint, citizenName, citizenAddress, citizenPhone }: {
      complaint: Complaint;
      citizenName: string;
      citizenAddress: string;
      citizenPhone: string;
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const stateRTIPortals: Record<string, string> = {
      KOLKATA: 'wbrtionline.gov.in | West Bengal Information Commission',
      MUMBAI: 'aaplesarkar.mahaonline.gov.in | Maharashtra Information Commission',
      DELHI: 'rti.delhi.gov.in | Delhi Chief Information Commission',
      BENGALURU: 'sakala.kar.nic.in | Karnataka Information Commission',
      CHENNAI: 'rti.tncsc.tn.gov.in | Tamil Nadu Information Commission',
      HYDERABAD: 'rtionline.telangana.gov.in | Telangana Information Commission',
      PUNE: 'aaplesarkar.mahaonline.gov.in | Maharashtra Information Commission',
      AHMEDABAD: 'rtionline.gujarat.gov.in | Gujarat Information Commission',
    };

    const statePortal = stateRTIPortals[complaint.location.city] || 'rtionline.gov.in | Central Information Commission';

    const prompt = `Generate a complete, legally precise RTI application for India for the following civic complaint.
Use ONLY the details provided. Do NOT add fictional information.

COMPLAINT DETAILS:
- Complaint ID: ${complaint.id}
- Issue: ${complaint.issueDescription}
- Location: ${complaint.location.address}, ${complaint.location.ward}, ${complaint.location.city}
- Filed on: ${new Date(complaint.filedAt).toLocaleDateString('en-IN')}
- SLA Deadline was: ${new Date(complaint.slaDeadline).toLocaleDateString('en-IN')}
- Current Status: ${complaint.status}
- Assigned Officer: ${complaint.assignedOfficer?.name || 'Not assigned'} (${complaint.assignedOfficer?.designation || ''})
- Department: ${complaint.department}
- Municipal Body: ${complaint.municipalBody}
${complaint.fakeClosureAnalysis ? `- Fake Closure Detected: YES (Probability: ${complaint.fakeClosureAnalysis.probability}%, Officer closure rate: ${complaint.fakeClosureAnalysis.officerClosureRate}%)` : ''}
${complaint.escalations.length > 0 ? `- Escalations sent: ${complaint.escalations.length} (to ${complaint.escalations.map(e => e.level).join(', ')})` : ''}

CITIZEN DETAILS:
- Name: ${citizenName || '[Applicant Name]'}
- Address: ${citizenAddress || '[Full Address]'}
- Phone: ${citizenPhone || '[Phone Number]'}

RTI PORTAL: ${statePortal}

Generate a COMPLETE RTI application with:
1. Proper header (TO: The Public Information Officer, [Department], [Municipal Body], [Address])
2. Subject line referencing the complaint ID
3. Introduction citing RTI Act 2005, Section 6(1)
4. Exactly 5 specific information requests (numbered)
5. Fee note (Rs 10/-)
6. Deadline reminder (30 days per Section 7(1))
7. First appeal mention (Section 19(1))
8. Proper sign-off
9. List of enclosures

Make the information requests SPECIFIC and STRATEGIC — especially if fake closure was detected, ask for the statistical closure data for that officer.`;

    const result = await model.generateContent(prompt);
    const rtiText = result.response.text();

    return NextResponse.json({ success: true, rtiDocument: rtiText, portal: statePortal });

  } catch (error: unknown) {
    console.error('RTI generation error:', error);
    return NextResponse.json({ success: false, error: 'Could not generate RTI.' }, { status: 500 });
  }
}
