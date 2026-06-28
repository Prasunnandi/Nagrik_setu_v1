// app/api/bhashini/route.ts — Bhashini (India Govt free NLP) proxy
// Docs: https://bhashini.gov.in/ulca/docs
// Register: https://bhashini.gov.in/ulca/user-profile (free, government portal)
// Keys go in .env.local: BHASHINI_USER_ID, BHASHINI_API_KEY

import { NextRequest, NextResponse } from 'next/server';

const BHASHINI_ENDPOINT = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

const LANG_CODES: Record<string, string> = {
  hindi:      'hi',
  bengali:    'bn',
  tamil:      'ta',
  telugu:     'te',
  marathi:    'mr',
  gujarati:   'gu',
  kannada:    'kn',
  malayalam:  'ml',
  punjabi:    'pa',
  odia:       'or',
  english:    'en',
  hinglish:   'hi',
};

export interface BhashiniRequest {
  text: string;
  sourceLang: string;   // e.g. 'english', 'hindi'
  targetLang: string;   // e.g. 'hindi', 'english'
  pipelineId?: string;  // Bhashini pipeline ID (from user dashboard)
}

export async function POST(req: NextRequest) {
  const userId  = process.env.BHASHINI_USER_ID;
  const apiKey  = process.env.BHASHINI_API_KEY;

  if (!userId || !apiKey) {
    // Graceful degradation: return original text if keys not set
    const body: BhashiniRequest = await req.json();
    return NextResponse.json({
      translated: body.text,
      notice: 'Bhashini not configured. Set BHASHINI_USER_ID and BHASHINI_API_KEY in .env.local',
    });
  }

  try {
    const body: BhashiniRequest = await req.json();
    const srcCode = LANG_CODES[body.sourceLang] || body.sourceLang;
    const tgtCode = LANG_CODES[body.targetLang] || body.targetLang;

    const payload = {
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: { sourceLanguage: srcCode, targetLanguage: tgtCode },
          },
        },
      ],
      inputData: {
        input: [{ source: body.text }],
        audio: [],
      },
    };

    const res = await fetch(BHASHINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        userID:           userId,
        ulcaApiKey:       apiKey,
        ...(body.pipelineId ? { pipelineId: body.pipelineId } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Bhashini]', res.status, errText);
      return NextResponse.json({ translated: body.text, error: 'Translation failed' }, { status: 200 });
    }

    const data = await res.json();
    const translated = data?.pipelineResponse?.[0]?.output?.[0]?.target || body.text;

    return NextResponse.json({ translated, sourceLang: srcCode, targetLang: tgtCode });
  } catch (err) {
    console.error('[Bhashini error]', err);
    return NextResponse.json({ error: 'Bhashini proxy error' }, { status: 500 });
  }
}

// GET: check Bhashini config status
export async function GET() {
  return NextResponse.json({
    configured: !!(process.env.BHASHINI_USER_ID && process.env.BHASHINI_API_KEY),
    registrationUrl: 'https://bhashini.gov.in/ulca/user-profile',
    supportedLanguages: Object.keys(LANG_CODES),
  });
}
