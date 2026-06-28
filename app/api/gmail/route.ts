// app/api/gmail/route.ts — Send escalation emails via Gmail API

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GmailSendRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: GmailSendRequest = await request.json();
    const { to, subject, body: emailBody, cc, complaintId } = body;

    // OAuth2 client — user must have authorized Gmail scope
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    // In production: get tokens from session/Firebase
    const accessToken = request.headers.get('x-gmail-token');
    if (!accessToken) {
      // Return draft for user to send manually if not authenticated
      return NextResponse.json({
        success: false,
        mode: 'draft',
        draft: { to, subject, body: emailBody, cc },
        message: 'Connect Gmail to send automatically. Draft ready to copy.',
      });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Build RFC 2822 email
    const ccLine = cc && cc.length > 0 ? `Cc: ${cc.join(', ')}\r\n` : '';
    const emailContent = [
      `To: ${to}`,
      `${ccLine}Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      emailBody,
      '',
      '---',
      `Sent via Nagrik Setu Civic Platform | Complaint ID: ${complaintId}`,
      'https://nagrik-setu.vercel.app',
    ].join('\r\n');

    const encodedEmail = Buffer.from(emailContent).toString('base64url');

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedEmail },
    });

    return NextResponse.json({
      success: true,
      messageId: result.data.id,
      message: `Escalation email sent to ${to} successfully.`,
    });

  } catch (error: unknown) {
    console.error('Gmail API error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Could not send email automatically.', detail: msg, mode: 'manual' },
      { status: 500 }
    );
  }
}

// GET — Initiate Gmail OAuth flow
export async function GET(request: NextRequest) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.send'],
    prompt: 'consent',
  });

  return NextResponse.json({ authUrl });
}
