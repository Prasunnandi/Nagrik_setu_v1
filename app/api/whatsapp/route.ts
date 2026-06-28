// app/api/whatsapp/route.ts — WhatsApp Cloud API webhook (Meta)
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackReply } from '@/lib/gemini';
import { syncFallbackComplaintToDb } from '@/lib/firebase';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'nagrik_setu_2026';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const PHONE_ID     = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

// System prompt for WhatsApp interactions (shorter, WhatsApp-friendly)
const WA_SYSTEM_PROMPT = `You are Nagrik Setu, India's civic AI agent for WhatsApp.
Help citizens file municipal complaints and track civic issues.
Rules:
- Reply in the SAME language the user writes in (Hindi, Bengali, Tamil, Telugu, or English)
- Keep replies under 250 words (WhatsApp-friendly)
- When a user describes a civic issue, generate a complaint ID in format: NS-XXX-YYYYMMDD-XXXX (e.g. NS-KOL-20260626-1234)
- Always acknowledge receipt and give next steps
- Issues you handle: potholes, garbage, water, sewage, street lights, encroachment, stray dogs, fallen trees
- For complaints, always include: Issue type, Location (ask if not given), Complaint ID, Department, SLA (24-72h)
- For status queries, explain that they can check on the web app`;

// ── GET: Meta webhook verification ──────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge || '', { status: 200 });
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// ── POST: incoming WhatsApp messages ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends a 200 check even before real messages
    if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
      return NextResponse.json({ status: 'ok' });
    }

    const message = body.entry[0].changes[0].value.messages[0];
    const from    = message.from as string;          // sender phone number (E.164 without +)
    const type    = message.type as string;

    // Only handle text messages for now
    if (type !== 'text') {
      await sendWhatsApp(from, 'नमस्ते! अभी हम text messages support करते हैं। Please type your civic complaint.');
      return NextResponse.json({ status: 'ok' });
    }

    const userText = (message.text?.body || '').trim();
    if (!userText) return NextResponse.json({ status: 'ok' });

    // Write fallback demo complaints to Firestore if keywords match
    await syncFallbackComplaintToDb(userText, 'Citizen', `whatsapp-${from}`);

    // Generate reply via Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    let reply = getFallbackReply(userText, 'citizen');

    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        const ai    = new GoogleGenerativeAI(geminiKey);
        const model = ai.getGenerativeModel({
          model:           'gemini-2.5-flash',
          systemInstruction: WA_SYSTEM_PROMPT,
        });
        const chat   = model.startChat();
        const result = await chat.sendMessage(userText);
        const raw    = result.response.text();
        // Strip markdown for WhatsApp (WA supports *bold* natively)
        reply = raw
          .replace(/\*\*/g, '*')  // ** → * (WA bold)
          .replace(/^#{1,3}\s/gm, '*')  // headings → bold
          .replace(/`{1,3}/g, '')  // remove code ticks
          .slice(0, 4096);        // WA max
      } catch (geminiErr) {
        console.error('[WA] Gemini error, using fallback:', geminiErr);
        // Keep the fallback reply already set from getFallbackReply
      }
    }

    await sendWhatsApp(from, reply);
    return NextResponse.json({ status: 'processed' });

  } catch (err) {
    console.error('[WhatsApp webhook]', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

// ── Helper: send WhatsApp message via Cloud API ──────────────────────────────
async function sendWhatsApp(to: string, body: string): Promise<void> {
  if (!ACCESS_TOKEN || !PHONE_ID) {
    // Credentials not configured — log and skip (dev mode)
    console.log(`[WA dev] Would send to ${to}:\n${body}`);
    return;
  }

  const res = await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type:    'individual',
      to,
      type: 'text',
      text: { body },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[WA] send failed ${res.status}: ${errBody}`);
  }
}
