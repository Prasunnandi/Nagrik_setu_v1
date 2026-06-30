// app/api/telegram/route.ts — Telegram Bot webhook
// Setup: 1) Create bot via @BotFather → get token
//        2) Set webhook: POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=<YOUR_DOMAIN>/api/telegram
//        3) Add TELEGRAM_BOT_TOKEN to .env.local

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFallbackReply } from '@/lib/gemini';
import { saveComplaint, syncFallbackComplaintToDb, syncGeminiReplyToDb } from '@/lib/firebase';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// ── In-memory conversation history (resets on server restart — fine for demo) ─
const chatHistories = new Map<number, Array<{ role: 'user' | 'model'; parts: [{ text: string }] }>>();
const MAX_HISTORY = 20;

const SYSTEM_PROMPT = `You are Nagrik Setu, India's civic AI agent on Telegram.
Help citizens file municipal complaints and track civic issues.

LANGUAGE RULE (most important):
- ALWAYS reply in the SAME language the user wrote in.
- If the user writes in English → reply fully in English.
- If the user writes in Hindi → reply in Hindi.
- If the user writes in Hinglish → reply in Hinglish.
- Support: English, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Punjabi.
- Default to English if the language is unclear.

MEMORY RULE (very important):
- You have access to the full conversation history with this citizen.
- If the user asks about "my complaint", "status", "what did I file", "my issue" → scan the chat history for any NS-XXX complaint IDs mentioned earlier in this conversation and report their details back.
- Always remember the citizen's name, city, and any complaints filed earlier in this chat.

Other rules:
- Keep replies under 300 words (Telegram-friendly).
- When a user describes a civic issue, generate a complaint ID: NS-XXX-YYYYMMDD-XXXX
  City codes: KOL=Kolkata, MUM=Mumbai, DEL=Delhi, BLR=Bengaluru, CHN=Chennai, HYD=Hyderabad, PUN=Pune, AMD=Ahmedabad, JAI=Jaipur, LKW=Lucknow
- For every complaint always include: 📍 Location, 🏛️ Department, ⏰ SLA deadline, 🆔 Complaint ID
- Issues handled: potholes, garbage, water supply, sewage, street lights, encroachment, stray dogs, fallen trees, open manholes, drainage, noise, air pollution, broken footpath, fallen wire.
- Use Telegram markdown: *bold* _italic_ \`code\`
- End every complaint confirmation with: "🌐 Track: nagrik-setu.vercel.app"`;

const MENU_TEXT =
  `📋 *Nagrik Setu — Main Menu*\n\n` +
  `*File a complaint:*\n` +
  `• Type your issue in any language\n` +
  `• Or 📸 *send a photo* of the problem\n\n` +
  `*Resolve a complaint:*\n` +
  `• 📸 Send a photo with caption _"resolved"_ or _"proof"_\n\n` +
  `*Check your complaints:*\n` +
  `• Ask _"what complaints did I file?"_\n` +
  `• Ask _"status of my complaint"_\n\n` +
  `*Other actions:*\n` +
  `• _"Draft RTI for my complaint"_\n` +
  `• _"Escalate my complaint"_\n` +
  `• _"Which officer is responsible?"_\n\n` +
  `*Commands:*\n` +
  `/start · /help · /menu · /status\n\n` +
  `*Languages:* English · हिंदी · বাংলা · தமிழ் · తెలుగు · ಕನ್ನಡ · മലയാളം · ગુજરાતી · मराठी · ਪੰਜਾਬੀ\n\n` +
  `🌐 nagrik-setu.vercel.app`;

// Random issue types for demo photo complaint
const DEMO_ISSUE_TYPES = [
  { issue: 'Road Damage / Pothole', dept: 'Municipal Roads Department', sla: '3 days' },
  { issue: 'Garbage Accumulation', dept: 'Solid Waste Management', sla: '24 hours' },
  { issue: 'Street Light Outage', dept: 'Electrical Department', sla: '2 days' },
  { issue: 'Open Manhole / Drainage Issue', dept: 'Water & Sewerage Board', sla: '48 hours' },
  { issue: 'Waterlogging / Sewage Overflow', dept: 'Drainage Department', sla: '24 hours' },
  { issue: 'Illegal Encroachment', dept: 'Town Planning Department', sla: '7 days' },
  { issue: 'Broken Footpath', dept: 'Public Works Department', sla: '5 days' },
];

function randomIssue() {
  return DEMO_ISSUE_TYPES[Math.floor(Math.random() * DEMO_ISSUE_TYPES.length)];
}

function generateComplaintId(caption: string) {
  // Try to extract city from caption
  const cityMap: Record<string, string> = {
    kolkata: 'KOL', mumbai: 'MUM', bombay: 'MUM', delhi: 'DEL',
    bengaluru: 'BLR', bangalore: 'BLR', chennai: 'CHN', hyderabad: 'HYD',
    pune: 'PUN', ahmedabad: 'AMD', jaipur: 'JAI', lucknow: 'LKW',
  };
  const lower = caption.toLowerCase();
  let code = 'DEL';
  for (const [key, val] of Object.entries(cityMap)) {
    if (lower.includes(key)) { code = val; break; }
  }
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NS-${code}-${date}-${rand}`;
}

// ── GET: health check ─────────────────────────────────────────────────────────
export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json({ status: 'Telegram bot token not configured' });
  }
  try {
    const res  = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json({ status: 'ok', webhook: data.result });
  } catch {
    return NextResponse.json({ status: 'error fetching webhook info' }, { status: 500 });
  }
}

// ── POST: incoming Telegram update ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    const message = update.message || update.edited_message;
    if (!message?.chat?.id) return NextResponse.json({ ok: true });

    const chatId   = message.chat.id as number;
    const userText = (message.text || message.caption || '').trim();
    const userName = message.from?.first_name || 'Citizen';

    // Extract dynamic host
    const host = req.headers.get('host') || 'nagrik-setu.vercel.app';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const activeDomain = isLocal ? 'nagrik-setu.vercel.app' : host;
    const sub = (txt: string) => txt.replace(/nagrik-setu\.vercel\.app/g, activeDomain);

    // ── /start ─────────────────────────────────────────────────────────────────
    if (userText === '/start') {
      chatHistories.delete(chatId); // fresh session
      await sendTelegram(chatId, sub(
        `🇮🇳 *Nagrik Setu — नागरिक सेतु*\n\n` +
        `Hello ${userName}! I am your *Civic AI Agent* for India.\n` +
        `नमस्ते ${userName}! मैं आपका नागरिक AI 😊 एजेंट हूँ।\n\n` +
        `*What I can do:*\n` +
        `📋 File a complaint in 60 seconds\n` +
        `📸 Send a photo to auto-file the issue\n` +
        `✅ Resolve a complaint with a proof photo\n` +
        `🔍 Check status of past complaints (in this chat)\n` +
        `📄 Draft RTI applications\n` +
        `⚡ Auto-escalate to higher authorities\n\n` +
        `Type *menu* anytime to see all options.\n\n` +
        `🌐 nagrik-setu.vercel.app`
      ));
      return NextResponse.json({ ok: true });
    }

    // ── /menu or "menu" ────────────────────────────────────────────────────────
    if (userText === '/menu' || /^menu$/i.test(userText)) {
      await sendTelegram(chatId, sub(MENU_TEXT));
      return NextResponse.json({ ok: true });
    }

    // ── /help ──────────────────────────────────────────────────────────────────
    if (userText === '/help') {
      await sendTelegram(chatId, sub(
        `*Nagrik Setu — Help*\n\n` +
        `*File by text:*\n` +
        `• _"Garbage not collected for 5 days in Andheri"_\n` +
        `• _"Street light broken on Park Street Kolkata"_\n\n` +
        `*📸 File by photo:*\n` +
        `Send any photo of the civic issue.\n` +
        `Add a location caption for best results.\n\n` +
        `*✅ Resolve by photo:*\n` +
        `Send a proof photo with caption containing *"resolved"*.\n` +
        `_Example: "resolved NS-DEL-20260627-1234"_\n\n` +
        `*Check past complaints:*\n` +
        `Ask _"what complaints did I file?"_ or _"status of my complaint"_\n\n` +
        `Type *menu* to see all options.\n\n` +
        `🌐 nagrik-setu.vercel.app`
      ));
      return NextResponse.json({ ok: true });
    }

    // ── Photo handling (demo: no Gemini vision) ────────────────────────────────
    const hasPhoto = (message.photo as unknown[])?.length > 0 ||
      (message.document as { mime_type?: string })?.mime_type?.startsWith('image/');

    if (hasPhoto) {
      const caption   = userText;
      const isResolve = /resolv|proof|fixed|done|completed|ठीक|हल|सुधार/i.test(caption);

      if (isResolve) {
        // Demo: accept any image as proof, confirm resolution
        const idMatch = caption.match(/NS-[A-Z]{3}-\d{8}-\d{4}/i);
        const idNote  = idMatch ? ` for complaint *${idMatch[0].toUpperCase()}*` : '';
        const reply = sub(
          `✅ *Resolution proof received${idNote}*\n\n` +
          `📸 Your photo has been recorded as resolution evidence.\n` +
          `🕐 Status updated to: *Under Verification*\n\n` +
          `Our system will verify this within 24 hours and mark the complaint as *Genuinely Resolved* if the evidence is valid.\n\n` +
          `If the issue reappears, send a new complaint anytime.\n` +
          `🌐 nagrik-setu.vercel.app`
        );

        const historyEntry = `[${userName} sent a proof photo${idNote ? ' for ' + (idMatch?.[0] ?? '') : ''}. Marked as resolution proof.]`;
        appendHistory(chatId, 'user', historyEntry);
        appendHistory(chatId, 'model', reply);
        await sendTelegram(chatId, reply);
      } else {
        const { issue, dept, sla } = randomIssue();
        const complaintId = generateComplaintId(caption);
        const location    = caption || 'Location not specified';
        const deadline    = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        // Save complaint to Firestore
        await saveComplaint({
          id: complaintId,
          issueType: (issue.toLowerCase().includes('pothole') ? 'POTHOLE' : 'SOLID_WASTE') as any,
          issueDescription: `Filed via Telegram Photo. Caption: ${caption || 'none'}`,
          severity: 'HIGH',
          priority: 'P2',
          status: 'FILED',
          location: {
            lat: 22.5726,
            lng: 88.3639,
            address: location,
            ward: 'Ward 57',
            area: 'Ward 57',
            city: 'KOLKATA',
            wardNumber: 57
          },
          department: dept,
          municipalBody: 'Kolkata Municipal Corporation',
          filedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          userId: `telegram-${chatId}`,
          userName: userName,
          slaHours: 24,
          slaDeadline: new Date(Date.now() + 24 * 3600000).toISOString(),
          portalHelpline: '1916',
          escalations: []
        });

        const reply = sub(
          `✅ *Complaint Filed via Photo*\n\n` +
          `🆔 *${complaintId}*\n` +
          `📋 Issue: ${issue}\n` +
          `📍 Location: ${location}\n` +
          `🏛️ Department: ${dept}\n` +
          `⏰ SLA Deadline: ${sla} (by ${deadline})\n` +
          `📸 Photo evidence: *Recorded*\n\n` +
          `Your complaint has been registered with photo proof. The concerned department will be notified.\n\n` +
          `💡 _Ask "status of my complaint" anytime to check progress._\n` +
          `🌐 Track: nagrik-setu.vercel.app`
        );

        const historyEntry = `[${userName} sent a photo of: ${issue}. Location: ${location}. Complaint ID: ${complaintId} filed.]`;
        appendHistory(chatId, 'user', historyEntry);
        appendHistory(chatId, 'model', reply);
        await sendTelegram(chatId, reply);
      }
      return NextResponse.json({ ok: true });
    }

    // ── Text message → Gemini with history ────────────────────────────────────
    if (!userText) {
      await sendTelegram(chatId,
        `Hello ${userName}! Send me a text message describing your civic issue, or send a photo. Type *menu* for all options.`
      );
      return NextResponse.json({ ok: true });
    }

    // Write fallback demo complaints to Firestore if keywords match
    await syncFallbackComplaintToDb(userText, userName, `telegram-${chatId}`);

    appendHistory(chatId, 'user', userText);
    const reply = await callGeminiWithHistory(chatId, userName, activeDomain);
    await syncGeminiReplyToDb(reply, userText, userName, `telegram-${chatId}`, chatHistories.get(chatId));
    appendHistory(chatId, 'model', reply);
    await sendTelegram(chatId, reply);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('[Telegram webhook]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// ── Conversation history helpers ──────────────────────────────────────────────
function appendHistory(chatId: number, role: 'user' | 'model', text: string) {
  if (!chatHistories.has(chatId)) chatHistories.set(chatId, []);
  const history = chatHistories.get(chatId)!;
  history.push({ role, parts: [{ text }] });
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
}

// ── Gemini text chat with full conversation history ───────────────────────────
async function callGeminiWithHistory(chatId: number, userName: string, domain: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const history = chatHistories.get(chatId) || [];
  const lastMsg = history[history.length - 1]?.parts[0]?.text || '';
  const fallback = getFallbackReply(lastMsg, userName, domain);

  if (!geminiKey || geminiKey === 'your_gemini_api_key_here') return fallback;

  try {
    const chatHistory = history.slice(0, -1);
    const ai    = new GoogleGenerativeAI(geminiKey);
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const systemPromptWithDate = `${SYSTEM_PROMPT}\n\nCURRENT DATE CONTEXT: Today's date is ${todayLabel} (formatted as ${todayStr} for complaint IDs). Ensure any new complaint ID generated uses exactly ${todayStr} as the date part (e.g. NS-KOL-${todayStr}-XXXX).`;
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: systemPromptWithDate.replace(/nagrik-setu\.vercel\.app/g, domain) });
    const chat  = model.startChat({ history: chatHistory });
    
    // Add strict 4.5 second timeout to prevent webhook 408 timeout
    const geminiPromise = chat.sendMessage(lastMsg);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Gemini API call timed out")), 4500)
    );
    
    const result = await Promise.race([geminiPromise, timeoutPromise]);
    return (result as any).response.text()
      .replace(/\*\*/g, '*')
      .slice(0, 4096);
  } catch (err) {
    console.error('[Telegram] Gemini error, using fallback:', err);
    return fallback;
  }
}

// ── Helper: send Telegram message ────────────────────────────────────────────
async function sendTelegram(chatId: number, text: string): Promise<void> {
  if (!BOT_TOKEN) {
    console.log(`[TG dev] Would send to ${chatId}:\n${text}`);
    return;
  }
  let res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown', disable_web_page_preview: true }),
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    console.error(`[Telegram] send failed with code ${res.status}:`, errJson);
    
    // If it is a Markdown entity parsing error, fall back to sending plain text
    if (errJson.description && errJson.description.includes("can't parse entities")) {
      console.log("[Telegram] Markdown entity parsing failed. Retrying delivery in plain text...");
      const plainText = text.replace(/\*/g, '');
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: chatId, text: plainText, disable_web_page_preview: true }),
      });
      if (!res.ok) {
        const finalErr = await res.text();
        console.error(`[Telegram] send fallback failed ${res.status}:`, finalErr);
      }
    }
  }
}
