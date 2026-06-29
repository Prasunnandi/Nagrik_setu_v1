// app/api/chat/route.ts — Gemini 2.0 Flash streaming with multimodal support

import { NextRequest } from 'next/server';
import { Part } from '@google/generative-ai';
import { getGeminiModel, getFallbackReply } from '@/lib/gemini';
import { ChatRequest } from '@/lib/types';
import { syncFallbackComplaintToDb, syncGeminiReplyToDb } from '@/lib/firebase';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history, photo, photoMimeType } = body;

    const host = request.headers.get('host') || 'nagrik-setu.vercel.app';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const activeDomain = isLocal ? 'nagrik-setu.vercel.app' : host;

    if (!message && !photo) {
      return new Response(JSON.stringify({ error: 'Message or photo required' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // Write fallback demo complaints to Firestore if keywords match
    if (message) {
      await syncFallbackComplaintToDb(message, 'Citizen', 'web-chat');
    }

    const model = getGeminiModel();
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: h.parts,
      })),
    });

    // Build message parts (text + optional image)
    const parts: Part[] = [];

    if (photo) {
      // Strip base64 prefix if present
      const base64Data = photo.includes(',') ? photo.split(',')[1] : photo;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: (photoMimeType || 'image/jpeg') as string,
        },
      });
    }

    if (message) {
      parts.push({ text: message });
    }

    // Stream response
    let stream;
    const encoder = new TextEncoder();

    try {
      const result = await chat.sendMessageStream(parts);
      stream = new ReadableStream({
        async start(controller) {
          try {
            let fullText = '';
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                fullText += text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
            if (fullText) {
              syncGeminiReplyToDb(fullText, message || '', 'Citizen', 'web-chat').catch(console.error);
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (err) {
            console.error('[Chat] Stream chunk error, falling back:', err);
            const fallbackText = getFallbackReply(message || '', 'Citizen', activeDomain);
            await syncGeminiReplyToDb(fallbackText, message || '', 'Citizen', 'web-chat').catch(console.error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackText })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        },
      });
    } catch (geminiError) {
      console.warn('[Chat] Gemini start error, falling back to ready-made:', geminiError);
      const fallbackText = getFallbackReply(message || '', 'Citizen', activeDomain);
      syncGeminiReplyToDb(fallbackText, message || '', 'Citizen', 'web-chat').catch(console.error);
      stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackText })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error('Chat API outer error:', error);
    const fallbackText = getFallbackReply('', 'Citizen', 'nagrik-setu.vercel.app');
    syncGeminiReplyToDb(fallbackText, '', 'Citizen', 'web-chat').catch(console.error);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackText })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
