// lib/mockData.ts — Realistic demo data for Nagrik Setu

import { Complaint, WardScorecard, CommunityCluster, IssueCategory, City } from './types';

export const MOCK_WARD_SCORES: Record<string, WardScorecard> = {
  // ── EXTRA WARDS (additional cities) ────────────────────
  'KOL-33': {
    wardNumber: 33, wardName: 'Beliaghata', city: 'KOLKATA',
    overallScore: 39, grade: 'F',
    genuineResolutionRate: 44, avgResolutionDays: 8.4,
    slaComplianceRate: 30, fakeClosureRate: 30, escalationRate: 47,
    complaintVolume: 512,
    topIssues: [
      { type: 'GARBAGE', count: 201 },
      { type: 'SEWAGE', count: 88 },
      { type: 'STREET_LIGHT', count: 61 },
    ],
    councillorName: 'Mithu Dey', councillorParty: 'AITC',
    councillorRating: 2.1, councillorMeetingsAttended: 4, councillorTotalMeetings: 12,
    cityAvgScore: 43, wardRank: 112, totalWards: 141,
  },
  'MUM-183': {
    wardNumber: 183, wardName: 'Kurla', city: 'MUMBAI',
    overallScore: 38, grade: 'F',
    genuineResolutionRate: 46, avgResolutionDays: 7.9,
    slaComplianceRate: 31, fakeClosureRate: 29, escalationRate: 49,
    complaintVolume: 791,
    topIssues: [
      { type: 'GARBAGE', count: 298 },
      { type: 'POTHOLE', count: 134 },
      { type: 'WATER_SUPPLY', count: 97 },
    ],
    councillorName: 'Mangesh Kudalkar', councillorParty: 'NCP (Ajit)',
    councillorRating: 2.4, councillorMeetingsAttended: 4, councillorTotalMeetings: 12,
    cityAvgScore: 47, wardRank: 204, totalWards: 227,
  },
  'BLR-67': {
    wardNumber: 67, wardName: 'Shivajinagar', city: 'BENGALURU',
    overallScore: 48, grade: 'D',
    genuineResolutionRate: 54, avgResolutionDays: 7.1,
    slaComplianceRate: 40, fakeClosureRate: 22, escalationRate: 40,
    complaintVolume: 489,
    topIssues: [
      { type: 'POTHOLE', count: 161 },
      { type: 'GARBAGE', count: 122 },
      { type: 'DRAINAGE', count: 78 },
    ],
    councillorName: 'Pradeep R.', councillorParty: 'INC',
    councillorRating: 3.4, councillorMeetingsAttended: 7, councillorTotalMeetings: 12,
    cityAvgScore: 48, wardRank: 108, totalWards: 198,
  },
  'DEL-14': {
    wardNumber: 14, wardName: 'Rohini', city: 'DELHI',
    overallScore: 51, grade: 'D',
    genuineResolutionRate: 58, avgResolutionDays: 6.8,
    slaComplianceRate: 43, fakeClosureRate: 18, escalationRate: 38,
    complaintVolume: 634,
    topIssues: [
      { type: 'GARBAGE', count: 198 },
      { type: 'STREET_LIGHT', count: 142 },
      { type: 'POTHOLE', count: 119 },
    ],
    councillorName: 'Vijay Sharma', councillorParty: 'BJP',
    councillorRating: 3.8, councillorMeetingsAttended: 8, councillorTotalMeetings: 12,
    cityAvgScore: 46, wardRank: 97, totalWards: 250,
  },
  'CHN-100': {
    wardNumber: 100, wardName: 'T Nagar', city: 'CHENNAI',
    overallScore: 55, grade: 'D',
    genuineResolutionRate: 62, avgResolutionDays: 5.9,
    slaComplianceRate: 47, fakeClosureRate: 15, escalationRate: 32,
    complaintVolume: 578,
    topIssues: [
      { type: 'GARBAGE', count: 189 },
      { type: 'DRAINAGE', count: 134 },
      { type: 'STREET_LIGHT', count: 88 },
    ],
    councillorName: 'Kavitha Suresh', councillorParty: 'DMK',
    councillorRating: 4.2, councillorMeetingsAttended: 9, councillorTotalMeetings: 12,
    cityAvgScore: 52, wardRank: 78, totalWards: 200,
  },
  'HYD-67': {
    wardNumber: 67, wardName: 'Banjara Hills', city: 'HYDERABAD',
    overallScore: 61, grade: 'C',
    genuineResolutionRate: 67, avgResolutionDays: 5.2,
    slaComplianceRate: 53, fakeClosureRate: 12, escalationRate: 28,
    complaintVolume: 443,
    topIssues: [
      { type: 'POTHOLE', count: 144 },
      { type: 'STREET_LIGHT', count: 99 },
      { type: 'GARBAGE', count: 78 },
    ],
    councillorName: 'Srinivas Reddy', councillorParty: 'INC',
    councillorRating: 4.9, councillorMeetingsAttended: 10, councillorTotalMeetings: 12,
    cityAvgScore: 54, wardRank: 44, totalWards: 150,
  },
  // ── PRIMARY DEMO WARDS ─────────────────────────────────
  'KOL-57': {
    wardNumber: 57, wardName: 'Ultadanga', city: 'KOLKATA',
    overallScore: 31, grade: 'F',
    genuineResolutionRate: 38, avgResolutionDays: 9.1,
    slaComplianceRate: 22, fakeClosureRate: 38, escalationRate: 55,
    complaintVolume: 623,
    topIssues: [
      { type: 'GARBAGE', count: 287 },
      { type: 'WATER_SUPPLY', count: 94 },
      { type: 'POTHOLE', count: 71 },
    ],
    councillorName: 'Tapan Mondal', councillorParty: 'AITC',
    councillorRating: 1.8, councillorMeetingsAttended: 2, councillorTotalMeetings: 12,
    cityAvgScore: 43, wardRank: 128, totalWards: 141,
  },
  'MUM-151': {
    wardNumber: 151, wardName: 'Dharavi', city: 'MUMBAI',
    overallScore: 34, grade: 'F',
    genuineResolutionRate: 41, avgResolutionDays: 8.3,
    slaComplianceRate: 28, fakeClosureRate: 34, escalationRate: 52,
    complaintVolume: 847,
    topIssues: [
      { type: 'GARBAGE', count: 312 },
      { type: 'WATER_SUPPLY', count: 89 },
      { type: 'POTHOLE', count: 67 },
    ],
    councillorName: 'Shantabai More', councillorParty: 'Shiv Sena (UBT)',
    councillorRating: 1.9, councillorMeetingsAttended: 3, councillorTotalMeetings: 12,
    cityAvgScore: 47, wardRank: 218, totalWards: 227,
  },
  'BLR-108': {
    wardNumber: 108, wardName: 'Koramangala', city: 'BENGALURU',
    overallScore: 52, grade: 'D',
    genuineResolutionRate: 58, avgResolutionDays: 6.2,
    slaComplianceRate: 44, fakeClosureRate: 19, escalationRate: 36,
    complaintVolume: 534,
    topIssues: [
      { type: 'POTHOLE', count: 178 },
      { type: 'STREET_LIGHT', count: 94 },
      { type: 'SEWAGE', count: 71 },
    ],
    councillorName: 'Roopa Gowda', councillorParty: 'BJP',
    councillorRating: 4.1, councillorMeetingsAttended: 8, councillorTotalMeetings: 12,
    cityAvgScore: 48, wardRank: 89, totalWards: 198,
  },
  'DEL-92': {
    wardNumber: 92, wardName: 'Lajpat Nagar', city: 'DELHI',
    overallScore: 44, grade: 'C',
    genuineResolutionRate: 51, avgResolutionDays: 7.8,
    slaComplianceRate: 36, fakeClosureRate: 22, escalationRate: 44,
    complaintVolume: 712,
    topIssues: [
      { type: 'GARBAGE', count: 224 },
      { type: 'POTHOLE', count: 156 },
      { type: 'STREET_LIGHT', count: 98 },
    ],
    councillorName: 'Seema Tiwari', councillorParty: 'AAP',
    councillorRating: 3.2, councillorMeetingsAttended: 6, councillorTotalMeetings: 12,
    cityAvgScore: 46, wardRank: 134, totalWards: 250,
  },
};

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'NS-KOL-20260627-1234',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage not collected for 3+ days near park gate, Ultadanga. Large pile creating health hazard.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near Ultadanga Park Gate, Rabindra Sarani', ward: 'Ward 57', wardNumber: 57, area: 'Ultadanga', city: 'KOLKATA', lat: 22.5744, lng: 88.3629 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Binoy Chatterjee', designation: 'Sanitary Inspector', phone: '033-2286-1212', email: 'bchatterjee@kmcgov.in' },
    slaDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    slaHours: 24, filedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    department: 'Solid Waste Management', municipalBody: 'KMC',
    portalHelpline: '1800-103-0012',
    escalations: [
      { level: 'WARD_OFFICER', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), to: 'Ward Officer Debashish Roy', email: 'droy@kmcgov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 78, isSuspicious: true, flags: [{ flag: 'Closed in 3 hours', points: 30, detail: 'Garbage pickup SLA is 24 hours' }, { flag: 'No evidence photo', points: 25, detail: 'Field worker submitted no photo' }, { flag: '96% same-day closure rate', points: 35, detail: '47 of 49 complaints closed same-day this week' }], officerClosureRate: 96, recommendation: 'RTI' },
    communityClusterSize: 8,
  },
  {
    id: 'NS-KOL-20260628-5678',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street light not working on main road near school, creating safety hazard at night.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'School Road, Near DAV School, Ward 57', ward: 'Ward 57', wardNumber: 57, area: 'Ultadanga', city: 'KOLKATA', lat: 22.5751, lng: 88.3641 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Subhash Ghosh', designation: 'Electrical Inspector', phone: '033-2286-1400', email: 'sghosh@kmcgov.in' },
    slaDeadline: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    slaHours: 48, filedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    department: 'Electrical Department', municipalBody: 'KMC (CESC for supply)',
    portalHelpline: '1912', escalations: [],
  },
  {
    id: 'NS-KOL-20260629-9012',
    issueType: 'POTHOLE',
    issueDescription: 'Large pothole approximately 4 feet wide and 6 inches deep on residential road, causing vehicle damage.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'BT Road connector, Ward 57', ward: 'Ward 57', wardNumber: 57, area: 'Ultadanga', city: 'KOLKATA', lat: 22.5738, lng: 88.3618 },
    status: 'FILED',
    assignedOfficer: { name: 'Pradip Das', designation: 'Junior Engineer (Roads)', phone: '033-2286-1500', email: 'pdas@kmcgov.in' },
    slaDeadline: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
    slaHours: 48, filedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    department: 'Roads Department', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [],
  },
];

export const MOCK_CLUSTERS: CommunityCluster[] = [
  {
    issueType: 'GARBAGE',
    wardNumber: 57, city: 'KOLKATA',
    count: 8,
    complaintIds: ['NS-KOL-20260622-1111', 'NS-KOL-20260623-2222', 'NS-KOL-20260624-3333', 'NS-KOL-20260625-4444', 'NS-KOL-20260626-5555', 'NS-KOL-20260627-1234', 'NS-KOL-20260628-7777', 'NS-KOL-20260629-8888'],
    location: { lat: 22.5744, lng: 88.3629 },
    petitionDraft: 'COMMUNITY PETITION — Ward 57, Kolkata\n\nWe, the 8 undersigned residents of Ultadanga, Ward 57, jointly report that garbage collection has been consistently absent for 3–5 days, creating a serious public health hazard...',
  },
];

export const CITY_CONFIGS = {
  MUMBAI: { code: 'MUM', name: 'Mumbai', body: 'MCGM', helpline: '1916', portal: 'mcgm.gov.in', email: 'complaints@mcgm.gov.in', state: 'Maharashtra' },
  DELHI: { code: 'DEL', name: 'Delhi', body: 'MCD', helpline: '155305', portal: 'mcdonline.nic.in', email: 'mcd@nic.in', state: 'Delhi' },
  BENGALURU: { code: 'BLR', name: 'Bengaluru', body: 'BBMP', helpline: '1533', portal: 'bbmpsahaaya.karnataka.gov.in', email: 'helpdesk@bbmp.gov.in', state: 'Karnataka' },
  KOLKATA: { code: 'KOL', name: 'Kolkata', body: 'KMC', helpline: '1800-103-0012', portal: 'kmcgov.in', email: 'mayor@kmcgov.in', state: 'West Bengal' },
  CHENNAI: { code: 'CHN', name: 'Chennai', body: 'GCC', helpline: '1913', portal: 'chennaicorporation.gov.in', email: 'mayor@chennaicorporation.gov.in', state: 'Tamil Nadu' },
  HYDERABAD: { code: 'HYD', name: 'Hyderabad', body: 'GHMC', helpline: '040-21111111', portal: 'ghmc.gov.in', email: 'ghmc@telangana.gov.in', state: 'Telangana' },
  PUNE: { code: 'PUN', name: 'Pune', body: 'PMC', helpline: '020-25506818', portal: 'pmc.gov.in', email: 'pmc@pmc.gov.in', state: 'Maharashtra' },
  AHMEDABAD: { code: 'AHM', name: 'Ahmedabad', body: 'AMC', helpline: '155303', portal: 'ahmedabadcity.gov.in', email: 'info@ahmedabadcity.gov.in', state: 'Gujarat' },
};

export function generateComplaintId(city: string): string {
  const cityCode = Object.values(CITY_CONFIGS).find(c => c.name.toUpperCase() === city.toUpperCase())?.code || 'NAT';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NS-${cityCode}-${date}-${rand}`;
}
