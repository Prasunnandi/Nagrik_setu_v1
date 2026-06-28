// lib/firebase.ts — Firebase v10 modular SDK initialization

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { Complaint } from './types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) db = getFirestore(getFirebaseApp());
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) storage = getStorage(getFirebaseApp());
  return storage;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

export const googleProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────
// Firestore helpers
// ─────────────────────────────────────────────
export async function saveComplaint(complaint: Complaint): Promise<string> {
  try {
    const db = getDb();
    const docRef = await addDoc(collection(db, 'complaints'), {
      ...complaint,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Firebase save error:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('nagrik_complaints') || '[]');
      existing.push(complaint);
      localStorage.setItem('nagrik_complaints', JSON.stringify(existing));
    }
    return complaint.id;
  }
}

export async function getComplaints(userId?: string): Promise<Complaint[]> {
  try {
    const db = getDb();
    const q = userId
      ? query(collection(db, 'complaints'), where('userId', '==', userId), orderBy('filedAt', 'desc'), limit(50))
      : query(collection(db, 'complaints'), orderBy('filedAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Complaint);
  } catch (error) {
    console.error('Firebase get error:', error);
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('nagrik_complaints') || '[]');
    }
    return [];
  }
}

export async function updateComplaintStatus(complaintId: string, updates: Partial<Complaint>): Promise<void> {
  try {
    const db = getDb();
    const q = query(collection(db, 'complaints'), where('id', '==', complaintId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(doc(db, 'complaints', snapshot.docs[0].id), {
        ...updates,
        lastUpdatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Firebase update error:', error);
    if (typeof window !== 'undefined') {
      const complaints: Complaint[] = JSON.parse(localStorage.getItem('nagrik_complaints') || '[]');
      const idx = complaints.findIndex(c => c.id === complaintId);
      if (idx !== -1) {
        complaints[idx] = { ...complaints[idx], ...updates, lastUpdatedAt: new Date().toISOString() };
        localStorage.setItem('nagrik_complaints', JSON.stringify(complaints));
      }
    }
  }
}

export function subscribeComplaints(callback: (complaints: Complaint[]) => void): () => void {
  try {
    const db = getDb();
    const q = query(collection(db, 'complaints'), orderBy('filedAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => d.data() as Complaint);
      callback(list);
    });
  } catch (error) {
    console.error('Firebase subscribe error:', error);
    // Fallback: trigger callback with localStorage data once
    if (typeof window !== 'undefined') {
      callback(JSON.parse(localStorage.getItem('nagrik_complaints') || '[]'));
    }
    return () => {};
  }
}

export async function syncFallbackComplaintToDb(message: string, userName: string, userId: string): Promise<void> {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes('demo') || msg.includes('show me') || msg.includes('hackathon')) {
    await saveComplaint({
      id: 'NS-KOL-20260629-3847',
      issueType: 'SOLID_WASTE',
      severity: 'HIGH',
      status: 'FILED',
      location: {
        lat: 22.5786,
        lng: 88.3786,
        address: 'Ward 57, Kolkata (KMC)',
        ward: 'Ward 57',
        city: 'KOLKATA',
        wardNumber: 57
      },
      department: 'Solid Waste Management',
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      userId: userId,
      userName: userName,
      description: 'Garbage accumulation near Ward 57'
    });
  } else if (msg.includes('pothole') || msg.includes('road') || msg.includes('dumdum') || msg.includes('gorabazar') || msg.includes('bada pothole')) {
    await saveComplaint({
      id: 'NG-KOL-20260628-9812',
      issueType: 'POTHOLE',
      severity: 'HIGH',
      status: 'FILED',
      location: {
        lat: 22.6120,
        lng: 88.4230,
        address: 'Gorabazar, Dum Dum Cantonment (North 24 Parganas, 700028)',
        ward: 'Dum Dum',
        city: 'KOLKATA',
        wardNumber: 57
      },
      department: 'Roads & Engineering',
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      userId: userId,
      userName: userName,
      description: 'Road mein bada pothole hai — vehicle damage ho raha hai'
    });
  } else if (msg.includes('light') || msg.includes('electricity') || msg.includes('dark')) {
    await saveComplaint({
      id: 'NG-KOL-20260628-5511',
      issueType: 'STREET_LIGHT',
      severity: 'MEDIUM',
      status: 'FILED',
      location: {
        lat: 22.5802,
        lng: 88.3755,
        address: 'Ward 57, Ultadanga, Kolkata',
        ward: 'Ward 57',
        city: 'KOLKATA',
        wardNumber: 57
      },
      department: 'Lighting & Electricity',
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      userId: userId,
      userName: userName,
      description: 'Street lights not working'
    });
  } else if (msg.includes('garbage') || msg.includes('kachra') || msg.includes('dustbin') || msg.includes('clean')) {
    await saveComplaint({
      id: 'NG-KOL-20260628-3847',
      issueType: 'SOLID_WASTE',
      severity: 'HIGH',
      status: 'FILED',
      location: {
        lat: 22.5786,
        lng: 88.3786,
        address: 'Ward 57, Ultadanga, Kolkata',
        ward: 'Ward 57',
        city: 'KOLKATA',
        wardNumber: 57
      },
      department: 'Solid Waste Management',
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      userId: userId,
      userName: userName,
      description: 'Kachra/Garbage accumulation'
    });
  }
}

export async function syncGeminiReplyToDb(reply: string, userText: string, userName: string, userId: string): Promise<void> {
  try {
    const idMatch = reply.match(/(?:ID|Complaint ID)[:\s*]*([NS|NG]{2}-[A-Z]{3}-\d{8}-\d{4})/i);
    if (!idMatch) return;
    const complaintId = idMatch[1].toUpperCase();

    const locMatch = reply.match(/(?:Location|📍)[:\s*]*([^\n\r]+)/i);
    const address = locMatch ? locMatch[1].replace(/^(?:Location|📍)[:\s]*/i, '').trim().replace(/[*\-\s]+$/, '') : 'Location not specified';

    const deptMatch = reply.match(/(?:Department|🏛️)[:\s*]*([^\n\r|]+)/i);
    const department = deptMatch ? deptMatch[1].replace(/^(?:Department|🏛️)[:\s]*/i, '').trim().replace(/[*\-\s]+$/, '') : 'Municipal Services';

    const lowerReply = reply.toLowerCase();
    const lowerUserText = (userText || '').toLowerCase();
    let issueType: 'POTHOLE' | 'GARBAGE' | 'STREET_LIGHT' | 'WATER_SUPPLY' | 'SEWAGE' | 'DRAINAGE' | 'OTHER' = 'GARBAGE';

    if (lowerReply.includes('pothole') || lowerReply.includes('road') || lowerUserText.includes('pothole') || lowerUserText.includes('road')) {
      issueType = 'POTHOLE';
    } else if (lowerReply.includes('light') || lowerReply.includes('electricity') || lowerUserText.includes('light') || lowerUserText.includes('electricity')) {
      issueType = 'STREET_LIGHT';
    } else if (lowerReply.includes('water') || lowerReply.includes('supply') || lowerReply.includes('paani') || lowerReply.includes('pani') || lowerUserText.includes('water') || lowerUserText.includes('supply') || lowerUserText.includes('paani') || lowerUserText.includes('pani')) {
      issueType = 'WATER_SUPPLY';
    } else if (lowerReply.includes('sewage') || lowerReply.includes('sewer') || lowerUserText.includes('sewage') || lowerUserText.includes('sewer')) {
      issueType = 'SEWAGE';
    } else if (lowerReply.includes('drain') || lowerReply.includes('flooding') || lowerUserText.includes('drain') || lowerUserText.includes('flooding')) {
      issueType = 'DRAINAGE';
    } else if (lowerReply.includes('garbage') || lowerReply.includes('waste') || lowerReply.includes('trash') || lowerUserText.includes('garbage') || lowerUserText.includes('waste') || lowerUserText.includes('trash')) {
      issueType = 'GARBAGE';
    } else {
      issueType = 'OTHER';
    }

    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
    if (lowerReply.includes('critical') || lowerUserText.includes('critical')) severity = 'CRITICAL';
    else if (lowerReply.includes('medium') || lowerUserText.includes('medium')) severity = 'MEDIUM';
    else if (lowerReply.includes('low') || lowerUserText.includes('low')) severity = 'LOW';

    let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P2';
    if (severity === 'CRITICAL') priority = 'P1';
    else if (severity === 'HIGH') priority = 'P2';
    else if (severity === 'MEDIUM') priority = 'P3';
    else if (severity === 'LOW') priority = 'P4';

    let slaHours = 24;
    if (issueType === 'POTHOLE' && severity === 'CRITICAL') slaHours = 6;
    else if (issueType === 'WATER_SUPPLY' && severity === 'CRITICAL') slaHours = 6;
    else if (severity === 'CRITICAL') slaHours = 12;
    else if (severity === 'HIGH') slaHours = 24;
    else if (severity === 'MEDIUM') slaHours = 48;
    else slaHours = 72;

    const slaDeadline = new Date(Date.now() + slaHours * 3600000).toISOString();

    let lat = 22.5726;
    let lng = 88.3639;
    let ward = 'Ward 57';
    let area = 'Gorabazar';
    
    if (lowerReply.includes('dumdum') || lowerReply.includes('dum dum') || address.toLowerCase().includes('dum dum') || address.toLowerCase().includes('dumdum')) {
      lat = 22.6200;
      lng = 88.4200;
      ward = 'Ward 57';
      area = 'Dum Dum';
    }

    const assignedOfficer = {
      name: 'Amit Sen',
      designation: 'Ward Executive Engineer (Ward 57)',
      phone: '+91-98300-12345',
      email: 'asen.kmc@gmail.com'
    };

    await saveComplaint({
      id: complaintId,
      issueType,
      issueDescription: userText || `Civic issue reported via chatbot: ${issueType.replace(/_/g, ' ')}`,
      severity,
      priority,
      status: 'FILED',
      location: {
        lat,
        lng,
        address,
        ward,
        area,
        city: 'KOLKATA',
        wardNumber: 57
      },
      assignedOfficer,
      slaHours,
      slaDeadline,
      department,
      municipalBody: 'Kolkata Municipal Corporation',
      filedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      userId,
      userName,
      portalHelpline: '1916',
      escalations: []
    });
    console.log(`[Firebase] Successfully auto-synced simulated complaint ${complaintId} to Firestore.`);
  } catch (err) {
    console.error('[Firebase] Failed to sync simulated complaint:', err);
  }
}
