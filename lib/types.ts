// lib/types.ts — All TypeScript interfaces for Nagrik Setu

export type Language =
  | 'hindi' | 'bengali' | 'tamil' | 'telugu' | 'marathi'
  | 'kannada' | 'malayalam' | 'gujarati' | 'punjabi' | 'odia' | 'english' | 'hinglish';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type ComplaintStatus =
  | 'FILED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED_CLAIMED'
  | 'FAKE_CLOSURE_DETECTED' | 'ESCALATED' | 'RTI_FILED'
  | 'GENUINELY_RESOLVED' | 'CONSUMER_FORUM' | 'CLOSED';

export type IssueCategory =
  | 'GARBAGE' | 'POTHOLE' | 'STREET_LIGHT' | 'WATER_SUPPLY'
  | 'SEWAGE' | 'DRAINAGE' | 'ENCROACHMENT' | 'ILLEGAL_CONSTRUCTION'
  | 'DEAD_ANIMAL' | 'STRAY_DOG' | 'TREE_FALLEN' | 'BURNING_WASTE'
  | 'NOISE_POLLUTION' | 'AIR_POLLUTION' | 'WATER_POLLUTION'
  | 'BROKEN_FOOTPATH' | 'MANHOLE' | 'FALLEN_WIRE' | 'OTHER';

export type City =
  | 'MUMBAI' | 'DELHI' | 'BENGALURU' | 'KOLKATA' | 'CHENNAI'
  | 'HYDERABAD' | 'PUNE' | 'AHMEDABAD' | 'JAIPUR' | 'LUCKNOW'
  | 'PATNA' | 'BHOPAL' | 'NATIONAL';

export type EscalationLevel =
  | 'FIELD_DEPT' | 'WARD_OFFICER' | 'DEPUTY_COMMISSIONER'
  | 'MUNICIPAL_COMMISSIONER' | 'COUNCILLOR' | 'RTI' | 'MEDIA' | 'CONSUMER_FORUM';

export interface WardOfficer {
  name: string;
  designation: string;
  phone: string;
  email: string;
}

export interface ComplaintLocation {
  address: string;
  ward: string;
  wardNumber: number;
  area: string;
  city: City;
  pinCode?: string;
  lat?: number;
  lng?: number;
}

export interface EscalationEntry {
  level: EscalationLevel;
  date: string;
  to: string;
  email?: string;
  status: 'SENT' | 'PENDING' | 'RESPONDED';
  draftContent?: string;
}

export interface FakeClosureFlag {
  flag: string;
  points: number;
  detail: string;
}

export interface FakeClosureAnalysis {
  probability: number;          // 0–100
  isSuspicious: boolean;
  flags: FakeClosureFlag[];
  officerClosureRate?: number;  // % same-day closures this week
  recommendation: 'ACCEPT' | 'VERIFY' | 'DISPUTE' | 'RTI';
}

export interface Complaint {
  id: string;                    // NS-KOL-20260629-3847
  issueType: IssueCategory;
  issueDescription: string;
  severity: Severity;
  priority: Priority;
  location: ComplaintLocation;
  status: ComplaintStatus;
  assignedOfficer?: WardOfficer;
  slaDeadline: string;           // ISO date string
  slaHours: number;
  filedAt: string;               // ISO date string
  lastUpdatedAt: string;
  photo?: string;                // base64 or URL
  department: string;
  municipalBody: string;
  portalHelpline: string;
  escalations: EscalationEntry[];
  fakeClosureAnalysis?: FakeClosureAnalysis;
  rtiDraft?: string;
  communityClusterSize?: number;
  citizenVerified?: boolean;
  resolvedAt?: string;
  resolveProofPhotos?: string[];   // base64 proof photos submitted by citizen
  resolveNote?: string;            // citizen's note when submitting resolution proof
}

export interface WardScorecard {
  wardNumber: number;
  wardName: string;
  city: City;
  overallScore: number;          // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  genuineResolutionRate: number; // %
  avgResolutionDays: number;
  slaComplianceRate: number;     // %
  fakeClosureRate: number;       // %
  escalationRate: number;        // %
  complaintVolume: number;       // per month
  topIssues: { type: IssueCategory; count: number }[];
  councillorName: string;
  councillorParty: string;
  councillorRating: number;      // 0–10
  councillorMeetingsAttended: number;
  councillorTotalMeetings: number;
  cityAvgScore: number;
  wardRank: number;
  totalWards: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  photo?: string;                // base64 for display
  complaintId?: string;          // if message triggered a complaint
  messageType?:
    | 'text' | 'complaint_confirmation' | 'status_update'
    | 'fake_closure_alert' | 'rti_document' | 'scorecard'
    | 'escalation_draft' | 'community_alert' | 'error';
}

export interface CityConfig {
  code: string;
  name: string;
  body: string;                  // MCGM, KMC, BBMP, etc.
  helpline: string;
  portal: string;
  email: string;
  state: string;
}

export interface CommunityCluster {
  issueType: IssueCategory;
  wardNumber: number;
  city: City;
  count: number;
  complaintIds: string[];
  location: { lat: number; lng: number };
  petitionDraft?: string;
}

// API Request/Response types
export interface ChatRequest {
  message: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
  photo?: string;                // base64
  photoMimeType?: string;
}

export interface ChatResponse {
  content: string;
  complaintId?: string;
  messageType?: ChatMessage['messageType'];
}

export interface GmailSendRequest {
  to: string;
  subject: string;
  body: string;
  cc?: string[];
  complaintId: string;
}

export interface SheetsExportRequest {
  wardData: WardScorecard;
  complaints: Complaint[];
}
