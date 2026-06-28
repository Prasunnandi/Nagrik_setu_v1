// app/api/sheets/route.ts — Export ward scorecard to Google Sheets

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { SheetsExportRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SheetsExportRequest = await request.json();
    const { wardData, complaints } = body;

    const accessToken = request.headers.get('x-sheets-token');
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        mode: 'csv',
        csvData: generateCSV(wardData, complaints),
        message: 'Connect Google Sheets to export directly. CSV available for download.',
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    oauth2Client.setCredentials({ access_token: accessToken });
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Create new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: `Nagrik Setu — Ward ${wardData.wardNumber} ${wardData.city} Accountability Report` },
        sheets: [
          { properties: { title: 'Ward Scorecard' } },
          { properties: { title: 'Complaints' } },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId!;

    // Populate Ward Scorecard sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Ward Scorecard!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['Nagrik Setu — Ward Accountability Report'],
          ['Generated', new Date().toLocaleString('en-IN')],
          [],
          ['WARD DETAILS', ''],
          ['Ward Number', wardData.wardNumber],
          ['Ward Name', wardData.wardName],
          ['City', wardData.city],
          ['Councillor', wardData.councillorName],
          ['Party', wardData.councillorParty],
          [],
          ['ACCOUNTABILITY SCORES', ''],
          ['Overall Score', `${wardData.overallScore}/100`],
          ['Grade', wardData.grade],
          ['Genuine Resolution Rate', `${wardData.genuineResolutionRate}%`],
          ['Average Resolution Time', `${wardData.avgResolutionDays} days`],
          ['SLA Compliance Rate', `${wardData.slaComplianceRate}%`],
          ['Fake Closure Rate', `${wardData.fakeClosureRate}%`],
          ['Escalation Rate', `${wardData.escalationRate}%`],
          ['Monthly Complaint Volume', wardData.complaintVolume],
          [],
          ['COMPARISON', ''],
          ['City Average Score', wardData.cityAvgScore],
          ['Ward Rank', `${wardData.wardRank} of ${wardData.totalWards}`],
          [],
          ['TOP UNRESOLVED ISSUES', ''],
          ...wardData.topIssues.map((issue, i) => [`${i + 1}. ${issue.type}`, `${issue.count} open complaints`]),
          [],
          ['Powered by Nagrik Setu | nagrik-setu.vercel.app', ''],
        ],
      },
    });

    // Populate Complaints sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Complaints!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['Complaint ID', 'Issue Type', 'Description', 'Location', 'Status', 'Filed At', 'SLA Deadline', 'Department', 'Officer', 'Escalation Level'],
          ...complaints.map(c => [
            c.id, c.issueType, c.issueDescription,
            `${c.location.ward}, ${c.location.area}`,
            c.status, new Date(c.filedAt).toLocaleString('en-IN'),
            new Date(c.slaDeadline).toLocaleString('en-IN'),
            c.department, c.assignedOfficer?.name || 'Unassigned',
            c.escalations.length > 0 ? c.escalations[c.escalations.length - 1].level : 'FIELD_DEPT',
          ]),
        ],
      },
    });

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
    return NextResponse.json({ success: true, url: sheetUrl, spreadsheetId });

  } catch (error: unknown) {
    console.error('Sheets API error:', error);
    return NextResponse.json({ success: false, error: 'Could not export to Sheets.' }, { status: 500 });
  }
}

function generateCSV(wardData: SheetsExportRequest['wardData'], complaints: SheetsExportRequest['complaints']): string {
  const rows = [
    ['Nagrik Setu — Ward Accountability Report'],
    ['Ward', wardData.wardNumber, wardData.wardName, wardData.city],
    ['Score', `${wardData.overallScore}/100`, `Grade ${wardData.grade}`],
    ['Resolution Rate', `${wardData.genuineResolutionRate}%`],
    ['Fake Closure Rate', `${wardData.fakeClosureRate}%`],
    [],
    ['ID', 'Issue', 'Status', 'Filed', 'SLA Deadline'],
    ...complaints.map(c => [c.id, c.issueType, c.status, c.filedAt, c.slaDeadline]),
  ];
  return rows.map(r => r.join(',')).join('\n');
}
