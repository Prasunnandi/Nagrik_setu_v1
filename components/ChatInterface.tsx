'use client';

// components/ChatInterface.tsx — Dossier design + photo upload + WhatsApp

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send, Mic, X, Camera, AlertTriangle,
  FileText, RotateCcw, Copy, Check, MessageCircle, Share2, MapPin, Loader2, Bell, BellOff,
} from 'lucide-react';
import { ChatMessage, Complaint, IssueCategory, Severity, Priority, City } from '@/lib/types';
import { generateComplaintId, MOCK_WARD_SCORES } from '@/lib/mockData';
import { buildWhatsAppShareText, getComplaintShareUrl } from '@/lib/persistence';

interface Props {
  onNewComplaint: (c: Complaint) => void;
  onComplaintUpdate: (c: Complaint) => void;
  existingComplaints: Complaint[];
}

function getOriginalIssueMessage(userText: string, messages: ChatMessage[]): string {
  const cleanText = userText.toLowerCase().trim();
  const genericConfirmations = ['yes', 'confirm', 'ok', 'correct', 'fine', 'yes it is', 'yeah', 'yep', 'haan', 'haji', 'sahi hai', 'agree', 'proceed'];
  
  if (genericConfirmations.includes(cleanText) || cleanText.length <= 4) {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'user') {
        const clean = msg.content.toLowerCase().trim();
        if (!genericConfirmations.includes(clean) && clean.length > 4) {
          return msg.content;
        }
      }
    }
  }
  return userText;
}

// ── Parse a real Complaint from the AI's confirmation text ────────────────────
function parseComplaintFromResponse(content: string, userMsg: string, complaintId: string): Complaint {
  const combined = userMsg + ' ' + content;

  // ── City from complaint ID (most reliable) ──
  const CITY_MAP: Record<string, City> = {
    KOL: 'KOLKATA', MUM: 'MUMBAI', BLR: 'BENGALURU', DEL: 'DELHI',
    CHN: 'CHENNAI', HYD: 'HYDERABAD', PUN: 'PUNE', AHM: 'AHMEDABAD', NAT: 'NATIONAL',
  };
  const idCode = complaintId.match(/NS-([A-Z]{2,4})-/)?.[1] || 'KOL';
  const city: City = CITY_MAP[idCode] || 'KOLKATA';

  // ── Issue type — check department in AI text first, then keywords ──
  let issueType: IssueCategory = 'OTHER';
  if (/roads|pwdi?|pothole|gaddha/i.test(combined))             issueType = 'POTHOLE';
  else if (/solid waste|sanitation|garbage|kachra/i.test(combined))  issueType = 'GARBAGE';
  else if (/water supply|paani|pani|no water/i.test(combined))       issueType = 'WATER_SUPPLY';
  else if (/electrical|street.?light|batti|lamp/i.test(combined))    issueType = 'STREET_LIGHT';
  else if (/sewage|sewer/i.test(combined))                           issueType = 'SEWAGE';
  else if (/drain|waterlog/i.test(combined))                         issueType = 'DRAINAGE';
  else if (/manhole/i.test(combined))                                issueType = 'MANHOLE';
  else if (/tree.{0,10}fall|fallen.{0,10}tree/i.test(combined))     issueType = 'TREE_FALLEN';
  else if (/stray.{0,10}dog|dog.{0,10}menac/i.test(combined))       issueType = 'STRAY_DOG';
  else if (/fallen.{0,10}wire|wire.{0,10}fall|bijli.{0,10}gir/i.test(combined)) issueType = 'FALLEN_WIRE';
  else if (/encroach/i.test(combined))                               issueType = 'ENCROACHMENT';
  else if (/noise|shor/i.test(combined))                             issueType = 'NOISE_POLLUTION';
  else if (/footpath|pavement/i.test(combined))                      issueType = 'BROKEN_FOOTPATH';
  else if (/burning.{0,10}waste|waste.{0,10}burn/i.test(combined))  issueType = 'BURNING_WASTE';
  else if (/dead.{0,10}animal|animal.{0,10}dead/i.test(combined))   issueType = 'DEAD_ANIMAL';

  // ── Severity + priority ──
  const sevMatch = content.match(/🚨\s*Priority:\s*(CRITICAL|HIGH|MEDIUM|LOW)/i);
  const severity: Severity = (sevMatch?.[1]?.toUpperCase() as Severity) || 'HIGH';
  const priMap: Record<string, Priority> = { CRITICAL: 'P1', HIGH: 'P2', MEDIUM: 'P3', LOW: 'P4' };
  const priority: Priority = priMap[severity] || 'P2';
  const slaHours = severity === 'CRITICAL' ? 6 : severity === 'HIGH' ? 24 : 48;

  // ── Department + municipal body ──
  const deptLine = content.match(/🏛️\s*([^\n]+)/)?.[1] || '';
  const deptParts = deptLine.split(/\s*[—–-]\s*/);
  const department = deptParts[0]?.trim() || 'Municipal Department';

  const BODY_MAP: Record<string, string> = {
    KMC: 'KMC', MCGM: 'MCGM', BBMP: 'BBMP', MCD: 'MCD',
    GCC: 'GCC', GHMC: 'GHMC', PMC: 'PMC', AMC: 'AMC',
  };
  const CITY_BODY: Record<City, string> = {
    KOLKATA: 'KMC', MUMBAI: 'MCGM', BENGALURU: 'BBMP', DELHI: 'MCD',
    CHENNAI: 'GCC', HYDERABAD: 'GHMC', PUNE: 'PMC', AHMEDABAD: 'AMC',
    JAIPUR: 'JMC', LUCKNOW: 'LMC', PATNA: 'PMC', BHOPAL: 'BMC', NATIONAL: 'CPGRAMS',
  };
  let municipalBody = CITY_BODY[city] || 'KMC';
  for (const [code] of Object.entries(BODY_MAP)) {
    if (content.includes(code)) { municipalBody = code; break; }
  }

  // ── Officer ──
  const officerMatch = content.match(/👤\s*([^(|]+?)\s*\(([^)]+)\)[^📞]*📞\s*([\d\s\-+()]+)/);
  const assignedOfficer = officerMatch ? {
    name: officerMatch[1].trim(),
    designation: officerMatch[2].trim(),
    phone: officerMatch[3].trim(),
    email: `officer@${municipalBody.toLowerCase()}.gov.in`,
  } : undefined;

  // ── Location ──
  // 1. AI response location line: "📍 Ward 17, Gorabazar, Dum Dum Municipality..."
  const aiLocLine = content.match(/📍\s*([^\n🏛️⏰🚨━👤📞]+)/)?.[1]?.trim() || '';

  // 2. Nominatim location appended to user message: "— Location: area, city, pin"
  const userLocMatch = userMsg.match(/(?:—\s*)?Location:\s*([^\n]+)/i);
  const userLoc = userLocMatch?.[1]?.trim() || '';

  // Prefer user location (Nominatim-geocoded, more accurate), fall back to AI location
  const bestLoc = userLoc || aiLocLine;
  const locParts = bestLoc.split(',').map(s => s.trim()).filter(Boolean);

  // Extract area (first meaningful token from location)
  const area = locParts[0] || 'Unknown Area';

  // Extract ward number
  const wardMatch = (aiLocLine + ' ' + content).match(/Ward\s+(\d+)/i);
  const wardNumber = wardMatch ? parseInt(wardMatch[1]) : 57;

  // Extract pincode
  const pinMatch = (bestLoc + ' ' + content).match(/\b(\d{6})\b/);
  const pinCode = pinMatch?.[1];

  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    KOLKATA: { lat: 22.5744, lng: 88.3629 }, MUMBAI: { lat: 19.0760, lng: 72.8777 },
    BENGALURU: { lat: 12.9716, lng: 77.5946 }, DELHI: { lat: 28.6139, lng: 77.2090 },
    CHENNAI: { lat: 13.0827, lng: 80.2707 }, HYDERABAD: { lat: 17.3850, lng: 78.4867 },
    PUNE: { lat: 18.5204, lng: 73.8567 }, AHMEDABAD: { lat: 23.0225, lng: 72.5714 },
  };
  const coords = CITY_COORDS[city] || CITY_COORDS.KOLKATA;

  const HELPLINE: Record<string, string> = {
    KMC: '1800-103-0012', MCGM: '1916', BBMP: '1533', MCD: '155305',
    GCC: '1913', GHMC: '040-21111111', PMC: '020-25506818',
  };

  // Clean user description (strip location suffix added by Nominatim button)
  const issueDescription = userMsg.replace(/\s*—\s*Location:.*$/i, '').trim()
    || 'Civic issue reported via Nagrik Setu';

  return {
    id: complaintId,
    issueType,
    issueDescription,
    severity,
    priority,
    location: {
      address: bestLoc || aiLocLine || `Ward ${wardNumber}, ${area}`,
      ward: `Ward ${wardNumber}`,
      wardNumber,
      area,
      city,
      pinCode,
      lat: coords.lat,
      lng: coords.lng,
    },
    status: 'FILED',
    assignedOfficer,
    slaDeadline: new Date(Date.now() + slaHours * 3_600_000).toISOString(),
    slaHours,
    filedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    department,
    municipalBody,
    portalHelpline: HELPLINE[municipalBody] || '1800-103-0012',
    escalations: [],
  };
}

// ── WhatsApp "File via WA" modal ──────────────────────────────────────────────
const WA_DEMO_NUMBER = '+91 98765 43210'; // Demo — set real number via env
const WA_BOT_LINK    = `https://wa.me/919876543210?text=${encodeURIComponent('Namaste Nagrik Setu! I want to file a civic complaint.')}`;

function WhatsAppModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(27,17,8,.65)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl p-5 relative"
        style={{ background: 'var(--ns-paper)', border: '1px solid var(--ns-bd)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg"
          style={{ background: 'var(--ns-paper-2)' }}
        >
          <X size={14} style={{ color: 'var(--ns-ink-3)' }} />
        </button>
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#25D366' }}>
            <MessageCircle size={24} color="#fff" />
          </div>
          <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ns-ink)' }}>
            File via WhatsApp
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--ns-ink-3)' }}>
            Complaint करें WhatsApp पर — Hindi, Bengali, Tamil, English
          </div>
        </div>
        <div
          className="rounded-xl p-3 mb-4 text-center"
          style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
        >
          <div className="text-[10px] mb-1" style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}>NAGRIK SETU BOT</div>
          <div className="font-bold" style={{ color: 'var(--ns-sf)', fontFamily: "'Space Mono', monospace" }}>{WA_DEMO_NUMBER}</div>
        </div>
        <a
          href={WA_BOT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ background: '#25D366' }}
        >
          <MessageCircle size={16} />
          Open WhatsApp Chat
        </a>
        <p className="text-center text-[9px] mt-3" style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}>
          POWERED BY WHATSAPP CLOUD API
        </p>
      </div>
    </div>
  );
}

export default function ChatInterface({ onNewComplaint, onComplaintUpdate, existingComplaints }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `**नमस्ते! मैं नागरिक सेतु हूँ 🇮🇳**

आपका civic AI agent — जो सिर्फ complaint log नहीं करता, बल्कि **genuinely resolve** करवाता है।

मैं कर सकता हूँ:
• 📋 Complaint file करना (60 seconds में)
• 🔍 Fake "Resolved" closures पकड़ना
• ⚡ Auto-escalation Ward Officer से Municipal Commissioner तक
• 📄 RTI application draft करना
• 📊 Ward Accountability Score दिखाना

**बताइए — आपके area में क्या समस्या है?**
*(Photo भी भेज सकते हैं — main khud classify kar lunga)*

या type करें **"demo"** — judge demo देखने के लिए`,
      timestamp: new Date().toISOString(),
      messageType: 'text',
    },
  ]);

  const [input, setInput]               = useState('');
  const [isStreaming, setIsStreaming]    = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64]   = useState<string | null>(null);
  const [photoMime, setPhotoMime]       = useState<string>('image/jpeg');
  const [isListening, setIsListening]   = useState(false);
  const [showWaModal, setShowWaModal]   = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const historyRef = useRef<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // "Re-file" button in complaint cards dispatches this event to pre-fill the chat
  useEffect(() => {
    const handler = (e: Event) => {
      const { issueType, area, ward } = (e as CustomEvent).detail as { issueType: string; area: string; ward: string };
      const readable = issueType.replace(/_/g, ' ').toLowerCase();
      setInput(`${readable} issue reported again in ${area}, ${ward}`);
      inputRef.current?.focus();
    };
    window.addEventListener('ns-file-again', handler);
    return () => window.removeEventListener('ns-file-again', handler);
  }, []);

  // Quick-file template bar dispatches this event to pre-fill the chat
  useEffect(() => {
    const handler = (e: Event) => {
      const { message } = (e as CustomEvent).detail as { message: string };
      setInput(message);
      inputRef.current?.focus();
    };
    window.addEventListener('ns-quick-file', handler);
    return () => window.removeEventListener('ns-quick-file', handler);
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}` };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const detectMessageType = (content: string): ChatMessage['messageType'] => {
    if (content.includes('⚠️ ALERT: Suspicious Closure') || content.includes('Fake Closure Detected')) return 'fake_closure_alert';
    if (content.includes('✅ Complaint Filed')) return 'complaint_confirmation';
    if (content.includes('RTI Application') || content.includes('Public Information Officer')) return 'rti_document';
    if (content.includes('Civic Accountability Score') || content.includes('/100\nGrade:') || content.includes('Overall Score:')) return 'scorecard';
    if (content.includes('🔔 Community Alert')) return 'community_alert';
    if (content.includes('Status Update') && content.includes('NS-')) return 'status_update';
    return 'text';
  };

  const extractComplaintId = (content: string): string | undefined => {
    const match = content.match(/NS-[A-Z]{2,4}-\d{8}-\d{4}/);
    return match?.[0];
  };

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text && !photoBase64) return;
    if (isStreaming) return;

    addMessage({
      role: 'user',
      content: text || '📸 [Photo uploaded]',
      timestamp: new Date().toISOString(),
      photo: photoPreview || undefined,
      messageType: 'text',
    });

    if (text) historyRef.current.push({ role: 'user', parts: [{ text }] });

    setInput('');
    setPhotoPreview(null);
    setPhotoBase64(null);
    setIsStreaming(true);

    const streamId = `stream-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: streamId, role: 'assistant', content: '',
      timestamp: new Date().toISOString(), messageType: 'text',
    }]);

    try {
      const response = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          message:      text || 'Please analyze this photo and help me file a civic complaint.',
          history:      historyRef.current.slice(0, -1),
          photo:        photoBase64 || undefined,
          photoMimeType: photoMime,
        }),
      });

      if (!response.ok || !response.body) throw new Error('Stream failed');

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages(prev => prev.map(m =>
                  m.id === streamId ? { ...m, content: fullContent } : m
                ));
              }
            } catch { /* ignore */ }
          }
        }
      }

      const msgType    = detectMessageType(fullContent);
      const complaintId = extractComplaintId(fullContent);

      setMessages(prev => prev.map(m =>
        m.id === streamId ? { ...m, content: fullContent, messageType: msgType, complaintId } : m
      ));

      historyRef.current.push({ role: 'model', parts: [{ text: fullContent }] });

      if (msgType === 'complaint_confirmation' && complaintId) {
        const originalUserText = getOriginalIssueMessage(text || '', messages);
        const newComplaint = parseComplaintFromResponse(fullContent, originalUserText, complaintId);
        onNewComplaint(newComplaint);

        // Browser push notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(`Complaint Filed — Nagrik Setu`, {
            body: `${newComplaint.issueType.replace(/_/g, ' ')} · ${newComplaint.location.area} · ${newComplaint.id}`,
            icon: '/icons/icon-192.svg',
            tag: newComplaint.id,
          });
        }

        // Community cluster check — same issueType in existing complaints
        const sameType = existingComplaints.filter(c =>
          c.issueType === newComplaint.issueType && c.id !== newComplaint.id
        );
        if (sameType.length >= 2) {
          const sameWard = sameType.filter(c => c.location.ward === newComplaint.location.ward);
          const clusterSize = sameType.length + 1;
          const scope = sameWard.length >= 1 ? `your ward (${newComplaint.location.ward})` : 'your city';
          setTimeout(() => {
            addMessage({
              role: 'assistant',
              content: `🔔 **Community Alert** — You're the **${clusterSize}${clusterSize === 2 ? 'nd' : clusterSize === 3 ? 'rd' : 'th'}** person to report **${newComplaint.issueType.replace(/_/g, ' ')}** in ${scope}.\n\nA **joint petition** from ${clusterSize} residents carries 5× more pressure with the municipality. Want me to generate one?\n\n→ Open the **Community tab** to see the cluster and generate a group petition for your ward councillor.`,
              timestamp: new Date().toISOString(),
              messageType: 'community_alert',
            });
          }, 1200);
        }
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === streamId ? {
          ...m,
          content: '🔄 Temporary delay — your message was received. Please try again in a moment.',
          messageType: 'error' as ChatMessage['messageType'],
        } : m
      ));
    } finally {
      setIsStreaming(false);
    }
  }, [input, photoBase64, photoPreview, photoMime, isStreaming, addMessage, onNewComplaint]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mime = file.type || 'image/jpeg';
    setPhotoMime(mime);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      const b64 = result.split(',')[1];
      setPhotoBase64(b64);
      // AI auto-classify: ask Gemini to identify the civic issue in the photo
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Look at this photo and in ONE short sentence identify the civic issue (pothole, garbage, street light, water, sewage, drainage, fallen wire, encroachment, etc). Reply ONLY with: "I can see: [issue type] — [1-line description]". Nothing else.',
            history: [],
            photo: b64,
            photoMimeType: mime,
          }),
        });
        if (res.ok) {
          const reader2 = res.body?.getReader();
          const dec = new TextDecoder();
          let text = '';
          if (reader2) {
            while (true) {
              const { done, value } = await reader2.read();
              if (done) break;
              text += dec.decode(value);
            }
          }
          const clean = text.replace(/^data:.*\n/gm, '').trim();
          if (clean.toLowerCase().startsWith('i can see:')) {
            setInput(prev => prev || clean.replace(/^I can see:\s*/i, ''));
          }
        }
      } catch {
        // silent — photo still attached, user can type manually
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported. Please type your complaint.');
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart  = () => setIsListening(true);
    recognition.onend    = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.start();
  };

  const [locating, setLocating] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setInput(prev => prev + ' (location not supported on this device)');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords;
          const res = await fetch(`/api/nominatim?lat=${lat}&lng=${lng}`);
          const data = await res.json();
          if (data.parsed) {
            const { area, city, pinCode } = data.parsed;
            const loc = [area, city, pinCode].filter(Boolean).join(', ');
            setInput(prev => {
              const base = prev.trim();
              return base ? `${base} — Location: ${loc}` : `My location is ${loc}. `;
            });
            inputRef.current?.focus();
          }
        } catch {
          setInput(prev => prev + ' (location fetch failed)');
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setInput(prev => prev + ' (location denied — please type your area)');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const quickActions = [
    { label: '🗑️ Garbage',    msg: 'Mere area mein kachra 3 din se nahi utha hai' },
    { label: '🕳️ Pothole',    msg: 'Road mein bada pothole hai — vehicle damage ho raha hai' },
    { label: '💧 No Water',   msg: 'Paani 2 din se nahi aa raha — kya karein?' },
    { label: '📊 Ward Score', msg: 'Mere ward ka civic accountability score kya hai?' },
    { label: '🚀 Demo',       msg: 'demo' },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative" style={{ background: 'var(--ns-paper)' }}>

      {/* WhatsApp modal overlay */}
      {showWaModal && <WhatsAppModal onClose={() => setShowWaModal(false)} />}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg.id === messages[messages.length - 1]?.id}
            existingComplaints={existingComplaints}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions — only on welcome screen */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {quickActions.map(({ label, msg }) => (
            <button
              key={label}
              onClick={() => { setInput(msg); inputRef.current?.focus(); }}
              className="text-xs px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: 'var(--ns-paper-2)',
                color: 'var(--ns-ink-2)',
                border: '1px solid var(--ns-bd)',
                fontFamily: "'Figtree', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Photo preview */}
      {photoPreview && (
        <div className="px-4 pb-2">
          <div
            className="inline-flex items-center gap-2 rounded-xl p-2 relative"
            style={{ background: 'var(--ns-paper-2)', border: '1px solid var(--ns-bd)' }}
          >
            <img
              src={photoPreview}
              alt="Evidence preview"
              className="h-14 w-14 object-cover rounded-lg"
              style={{ border: '2px solid var(--ns-sf)' }}
            />
            <div>
              <div className="text-xs font-semibold" style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}>
                Photo evidence ready
              </div>
              <div className="text-[10px]" style={{ color: 'var(--ns-ink-3)', fontFamily: "'Space Mono', monospace" }}>
                Will be analyzed by AI
              </div>
            </div>
            <button
              onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ns-re)', border: '1.5px solid #fff' }}
            >
              <X size={10} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* Input area — dark ink background */}
      <div
        className="flex-shrink-0 p-3"
        style={{ background: 'var(--ns-ink)', borderTop: '1px solid rgba(247,242,232,.08)' }}
      >
        {/* Textarea row */}
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2 mb-2"
          style={{ background: 'rgba(247,242,232,.09)', border: '1px solid rgba(247,242,232,.14)' }}
        >
          {/* Location detect */}
          <button
            onClick={detectLocation}
            disabled={locating}
            className="flex-shrink-0 mb-0.5 p-1 rounded-lg transition-colors"
            style={{ color: locating ? 'var(--ns-sf)' : 'rgba(247,242,232,.45)' }}
            title="Auto-detect my location (Nominatim)"
          >
            {locating ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
          </button>

          {/* Camera / photo upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 mb-0.5 p-1 rounded-lg transition-colors"
            style={{ color: photoPreview ? 'var(--ns-sf)' : 'rgba(247,242,232,.45)' }}
            title="Attach photo evidence"
          >
            <Camera size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="hidden"
          />

          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Apni problem batayein… (Hindi, Bengali, Tamil, English)"
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none min-h-[24px] max-h-[120px] py-0.5"
            style={{
              color: '#F7F2E8',
              fontFamily: "'Figtree', sans-serif",
              lineHeight: '1.5',
              caretColor: 'var(--ns-sf)',
            }}
          />

          {/* Voice input */}
          <button
            onClick={startVoice}
            className="flex-shrink-0 mb-0.5 p-1 rounded-lg transition-colors"
            style={{ color: isListening ? 'var(--ns-re)' : 'rgba(247,242,232,.45)' }}
            title="Voice input (Hindi/English)"
          >
            <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
          </button>

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && !photoBase64) || isStreaming}
            className="flex-shrink-0 mb-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: (input.trim() || photoBase64) && !isStreaming ? 'var(--ns-sf)' : 'rgba(247,242,232,.12)',
            }}
          >
            {isStreaming
              ? <RotateCcw size={15} color="rgba(247,242,232,.55)" className="animate-spin" />
              : <Send size={15} color={(input.trim() || photoBase64) ? '#fff' : 'rgba(247,242,232,.3)'} />
            }
          </button>
        </div>

        {/* Bottom row: language hint + WhatsApp button */}
        <div className="flex items-center justify-between px-1">
          <p
            className="text-[10px]"
            style={{ color: 'rgba(247,242,232,.35)', fontFamily: "'Space Mono', monospace" }}
          >
            HI · BN · TA · TE · EN + MORE
          </p>
          <div className="flex items-center gap-1.5">
            {notifPermission !== 'granted' && notifPermission !== 'denied' && (
              <button
                onClick={requestNotifications}
                className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{ background: 'rgba(247,242,232,.08)', color: 'rgba(247,242,232,.5)', border: '1px solid rgba(247,242,232,.14)', fontFamily: "'Figtree', sans-serif" }}
                title="Enable browser notifications"
              >
                <Bell size={10} /> Alerts
              </button>
            )}
            {notifPermission === 'granted' && (
              <span className="flex items-center gap-1 text-[9px]" style={{ color: 'rgba(247,242,232,.3)', fontFamily: "'Space Mono', monospace" }}>
                <Bell size={9} /> ON
              </span>
            )}
            <button
              onClick={() => setShowWaModal(true)}
              className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
              style={{ background: 'rgba(37,211,102,.15)', color: '#4ADE80', border: '1px solid rgba(37,211,102,.25)', fontFamily: "'Figtree', sans-serif" }}
            >
              <MessageCircle size={10} />
              File via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Individual Message Bubble
// ─────────────────────────────────────────────
function MessageBubble({
  message, isStreaming, existingComplaints,
}: {
  message: ChatMessage;
  isStreaming: boolean;
  existingComplaints: Complaint[];
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {/* Agent avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto"
          style={{ background: 'var(--ns-sf)' }}
        >
          <span
            className="text-white text-xs font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            नस
          </span>
        </div>
      )}

      <div className={`${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1 max-w-[85%]`}>
        {/* Photo attachment */}
        {message.photo && (
          <div
            className="rounded-2xl overflow-hidden p-1"
            style={{
              background: isUser ? 'var(--ns-ink)' : '#fff',
              border: '1px solid var(--ns-bd)',
            }}
          >
            <img
              src={message.photo}
              alt="Evidence"
              className="max-h-48 rounded-xl object-cover"
            />
          </div>
        )}

        {/* Message content */}
        {message.content && (
          message.messageType === 'fake_closure_alert' ? (
            <FakeClosureAlertBubble content={message.content} />
          ) : message.messageType === 'rti_document' ? (
            <RTIDocumentBubble content={message.content} complaintId={message.complaintId} />
          ) : message.messageType === 'scorecard' ? (
            <ScorecardBubble content={message.content} />
          ) : message.messageType === 'complaint_confirmation' ? (
            <ComplaintConfirmationBubble
              content={message.content}
              complaintId={message.complaintId}
              existingComplaints={existingComplaints}
            />
          ) : (
            <div
              className="px-4 py-3 text-sm leading-relaxed"
              style={{
                background:   isUser ? 'var(--ns-ink)' : '#fff',
                color:        isUser ? '#F7F2E8'       : 'var(--ns-ink)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                border:       isUser ? 'none' : '1px solid var(--ns-bd)',
                fontFamily:   "'Figtree', sans-serif",
              }}
            >
              {isUser ? (
                <p>{message.content}</p>
              ) : (
                <div className="agent-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content || (isStreaming ? '▋' : '')}
                  </ReactMarkdown>
                  {isStreaming && !message.content && (
                    <span
                      className="inline-block w-2 h-4 rounded animate-pulse"
                      style={{ background: 'var(--ns-ink-4)' }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        )}

        {/* Timestamp */}
        <span
          className="text-[10px] px-1"
          style={{ color: 'var(--ns-ink-4)', fontFamily: "'Space Mono', monospace" }}
        >
          {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Complaint Confirmation Bubble — with share buttons
// ─────────────────────────────────────────────
function ComplaintConfirmationBubble({
  content, complaintId, existingComplaints,
}: {
  content: string;
  complaintId?: string;
  existingComplaints: Complaint[];
}) {
  const [copied, setCopied] = useState(false);

  const complaint = complaintId ? existingComplaints.find(c => c.id === complaintId) : undefined;

  const copyLink = () => {
    if (!complaintId) return;
    navigator.clipboard.writeText(getComplaintShareUrl(complaintId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareWhatsApp = () => {
    if (!complaintId) return;
    const msg = complaint
      ? buildWhatsAppShareText(complaint)
      : `🇮🇳 *Nagrik Setu* — Complaint filed!\n\nID: ${complaintId}\nTrack: ${getComplaintShareUrl(complaintId)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      className="rounded-2xl overflow-hidden max-w-full w-full"
      style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
    >
      {/* Confirmation header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'var(--ns-grp)', borderBottom: '1px solid rgba(23,94,53,.12)' }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--ns-gr)' }}
        />
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color: 'var(--ns-gr)', fontFamily: "'Space Mono', monospace" }}
        >
          COMPLAINT FILED
        </span>
        {complaintId && (
          <span
            className="ml-auto text-[10px]"
            style={{ color: 'var(--ns-gr)', fontFamily: "'Space Mono', monospace", opacity: 0.7 }}
          >
            {complaintId}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <div className="agent-markdown text-sm" style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* Share actions */}
        {complaintId && (
          <div
            className="flex gap-2 mt-3 pt-3"
            style={{ borderTop: '1px solid var(--ns-bd)' }}
          >
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: copied ? 'var(--ns-grp)' : 'var(--ns-paper-2)',
                color:      copied ? 'var(--ns-gr)' : 'var(--ns-ink-2)',
                border:     '1px solid var(--ns-bd)',
                fontFamily: "'Figtree', sans-serif",
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(37,211,102,.12)',
                color:      '#16a34a',
                border:     '1px solid rgba(37,211,102,.22)',
                fontFamily: "'Figtree', sans-serif",
              }}
            >
              <MessageCircle size={11} />
              Share on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Specialized message renderers
// ─────────────────────────────────────────────
function FakeClosureAlertBubble({ content }: { content: string }) {
  return (
    <div
      className="rounded-2xl overflow-hidden max-w-full w-full"
      style={{ background: 'var(--ns-rep)', border: '1px solid rgba(191,27,14,.25)' }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'var(--ns-re)', borderBottom: '1px solid rgba(191,27,14,.25)' }}
      >
        <AlertTriangle size={14} color="#fff" />
        <span className="text-xs font-bold tracking-wide text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
          FAKE CLOSURE DETECTED
        </span>
        <span
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,.18)', color: '#fff', fontFamily: "'Space Mono', monospace" }}
        >
          ALERT
        </span>
      </div>
      <div className="px-4 py-3 agent-markdown" style={{ color: 'var(--ns-re)', fontFamily: "'Figtree', sans-serif" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function RTIDocumentBubble({ content, complaintId }: { content: string; complaintId?: string }) {
  const copyToClipboard = () => navigator.clipboard.writeText(content);
  return (
    <div
      className="rounded-2xl overflow-hidden max-w-full w-full"
      style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}
      >
        <FileText size={14} style={{ color: 'var(--ns-ink-3)' }} />
        <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--ns-ink)', fontFamily: "'Space Mono', monospace" }}>
          RTI APPLICATION READY
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="agent-markdown text-sm" style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--ns-bd)' }}>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--ns-paper-2)', color: 'var(--ns-ink-2)', border: '1px solid var(--ns-bd)', fontFamily: "'Figtree', sans-serif" }}
          >
            <Copy size={11} /> Copy RTI
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--ns-ink)', color: '#F7F2E8', fontFamily: "'Figtree', sans-serif" }}
          >
            <FileText size={11} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function ScorecardBubble({ content }: { content: string }) {
  return (
    <div
      className="rounded-2xl overflow-hidden max-w-full w-full"
      style={{ background: '#fff', border: '1px solid var(--ns-bd)' }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'var(--ns-sfp)', borderBottom: '1px solid rgba(224,96,10,.15)' }}
      >
        <span style={{ color: 'var(--ns-sf)', fontSize: 14 }}>📊</span>
        <span className="text-xs font-bold tracking-wide" style={{ color: 'var(--ns-sfd)', fontFamily: "'Space Mono', monospace" }}>
          WARD ACCOUNTABILITY SCORE
        </span>
      </div>
      <div className="px-4 py-3 agent-markdown text-sm" style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
