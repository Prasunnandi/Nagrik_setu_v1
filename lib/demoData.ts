// lib/demoData.ts — Realistic cross-city demo complaints for hackathon presentation

import { Complaint, City } from './types';

const D = 86_400_000;
const H = 3_600_000;

const ago   = (ms: number) => new Date(Date.now() - ms).toISOString();
const ahead = (ms: number) => new Date(Date.now() + ms).toISOString();

export const DEMO_COMPLAINTS: Complaint[] = [
  // 1. Mumbai — Pothole — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-MUM-20260620-3821',
    issueType: 'POTHOLE',
    issueDescription: 'Deep pothole (2ft wide) on S.V. Road near Andheri station causing accidents. Two-wheelers have fallen.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'S.V. Road, Near Andheri Station, Andheri West', ward: 'Ward 83', wardNumber: 83, area: 'Andheri West', city: 'MUMBAI', lat: 19.1193, lng: 72.8467 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Rajesh Patil', designation: 'Roads Supervisor', phone: '022-2659-7777', email: 'rpatil@mcgm.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 6,
    filedAt: ago(8 * D), lastUpdatedAt: ago(3 * D),
    department: 'Roads & Traffic', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [{ level: 'WARD_OFFICER', date: ago(3 * D), to: 'Ward Officer Meena Sawant', email: 'msawant@mcgm.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 93, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 35, detail: 'Marked resolved in 40 min — SLA is 6h' },
      { flag: 'NO_PHOTO', points: 28, detail: 'No field repair photo uploaded' },
      { flag: 'PATTERN',  points: 30, detail: 'Officer: 89% same-day closures this month' },
    ], recommendation: 'RTI' },
    communityClusterSize: 5,
  },

  // 2. Delhi — Water Supply — ESCALATED
  {
    id: 'NS-DEL-20260621-5092',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'No water supply for 5 consecutive days in Sector 7 Rohini. 120+ families buying tankers at ₹800/day.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sector 7, Rohini, New Delhi', ward: 'Ward 14', wardNumber: 14, area: 'Rohini', city: 'DELHI', lat: 28.7361, lng: 77.1167 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Arvind Kumar', designation: 'Water Works Engineer', phone: '011-2712-6543', email: 'akumar@delhijalboard.gov.in' },
    slaDeadline: ago(3 * D), slaHours: 24,
    filedAt: ago(6 * D), lastUpdatedAt: ago(2 * D),
    department: 'Water Supply & Sewerage', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [
      { level: 'WARD_OFFICER',       date: ago(3 * D), to: 'Ward Officer Sunita Negi',              email: 'snegi@mcd.gov.in',       status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(1 * D), to: 'Deputy Commissioner North Zone',        email: 'dc.north@mcd.gov.in',    status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 12,
  },

  // 3. Bengaluru — Sewage — IN_PROGRESS
  {
    id: 'NS-BLR-20260624-7731',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage overflow on 5th Cross, Koramangala. Raw sewage on road for 3 days — health emergency.',
    severity: 'HIGH', priority: 'P2',
    location: { address: '5th Cross, 6th Block, Koramangala', ward: 'Ward 108', wardNumber: 108, area: 'Koramangala', city: 'BENGALURU', lat: 12.9279, lng: 77.6271 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Gowda', designation: 'Sewerage Engineer', phone: '080-2297-8444', email: 'sgowda@bbmp.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 48,
    filedAt: ago(2 * D), lastUpdatedAt: ago(4 * H),
    department: 'Sewerage & Drainage', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 4. Chennai — Garbage — GENUINELY_RESOLVED
  {
    id: 'NS-CHN-20260615-2248',
    issueType: 'GARBAGE',
    issueDescription: 'Overflowing garbage bins near T Nagar bus stand. Not collected for 4 days during summer heat.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near T Nagar Bus Stand, Usman Road', ward: 'Ward 100', wardNumber: 100, area: 'T Nagar', city: 'CHENNAI', lat: 13.0418, lng: 80.2341 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Lakshmi Nair', designation: 'Conservancy Inspector', phone: '044-2538-8987', email: 'lnair@chennaicorporation.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 24,
    filedAt: ago(12 * D), lastUpdatedAt: ago(9 * D),
    department: 'Solid Waste Management', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 5. Hyderabad — Street Light — RESOLVED_CLAIMED (needs citizen verification!)
  {
    id: 'NS-HYD-20260623-6614',
    issueType: 'STREET_LIGHT',
    issueDescription: '6 consecutive street lights non-functional on Banjara Hills road. Area dark at night — robberies reported.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Road No. 12, Banjara Hills', ward: 'Ward 67', wardNumber: 67, area: 'Banjara Hills', city: 'HYDERABAD', lat: 17.4156, lng: 78.4347 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Ravi Shankar', designation: 'Electrical Engineer', phone: '040-2312-5555', email: 'rshankar@ghmc.gov.in' },
    slaDeadline: ago(2 * H), slaHours: 48,
    filedAt: ago(3 * D), lastUpdatedAt: ago(1 * H),
    department: 'Electrical Works', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 6. Kolkata — Tree Fallen — FILED
  {
    id: 'NS-KOL-20260626-9903',
    issueType: 'TREE_FALLEN',
    issueDescription: "Large tree fallen across road near Salt Lake Sector V after last night's storm. Blocking traffic completely.",
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sector V, Salt Lake City, Bidhan Nagar', ward: 'Ward 34', wardNumber: 34, area: 'Salt Lake', city: 'KOLKATA', lat: 22.5769, lng: 88.4348 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(3 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Parks & Environment', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 7. Mumbai — Garbage — RTI_FILED
  {
    id: 'NS-MUM-20260610-4419',
    issueType: 'GARBAGE',
    issueDescription: 'Illegal dumping ground behind Dharavi market. Burning garbage nightly — toxic smoke affecting 300+ families.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Behind Dharavi Market, 90 Feet Road, Dharavi', ward: 'Ward 151', wardNumber: 151, area: 'Dharavi', city: 'MUMBAI', lat: 19.0454, lng: 72.8513 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Prabhu Gupta', designation: 'Sanitary Inspector', phone: '022-2659-1234', email: 'pgupta@mcgm.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 24,
    filedAt: ago(17 * D), lastUpdatedAt: ago(2 * D),
    department: 'Solid Waste Management', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',          date: ago(12 * D), to: 'Ward Officer Dharmesh Vyas',     email: 'dvyas@mcgm.gov.in',       status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',   date: ago(8 * D),  to: 'DC M-East Ward',                email: 'dc.meast@mcgm.gov.in',    status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER',date: ago(3 * D),  to: "Commissioner's Office",          email: 'commissioner@mcgm.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 71, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 40, detail: 'Same location — 3rd complaint in 6 months' },
      { flag: 'DELAY',  points: 31, detail: '17 days with no resolution despite CRITICAL priority' },
    ], recommendation: 'RTI' },
    communityClusterSize: 21,
  },

  // 8. Delhi — Street Light — ASSIGNED
  {
    id: 'NS-DEL-20260625-8847',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Ring Road near Lajpat crossing out for 1 week. Women afraid to walk at night.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near Lajpat Nagar Metro Station, Ring Road', ward: 'Ward 92', wardNumber: 92, area: 'Lajpat Nagar', city: 'DELHI', lat: 28.5706, lng: 77.2372 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Mohit Chadha', designation: 'Electrical Supervisor', phone: '011-2694-5555', email: 'mchadha@mcd.gov.in' },
    slaDeadline: ahead(18 * H), slaHours: 48,
    filedAt: ago(30 * H), lastUpdatedAt: ago(6 * H),
    department: 'Electrical Works', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 9. Bengaluru — Pothole — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-BLR-20260618-3399',
    issueType: 'POTHOLE',
    issueDescription: 'Series of deep potholes on Hosur Road near Electronic City flyover. Multiple accidents this week.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Hosur Road, Near Electronic City Flyover Phase 1', ward: 'Ward 67', wardNumber: 67, area: 'Electronic City', city: 'BENGALURU', lat: 12.8456, lng: 77.6603 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Nagaraj Rao', designation: 'Roads Engineer', phone: '080-2297-1234', email: 'nrao@bbmp.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 6,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Roads & Infrastructure', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Priya Kumari', email: 'pkumari@bbmp.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 88, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 32, detail: 'Closed in 1.5h — CRITICAL pothole repair takes days' },
      { flag: 'REOPEN',   points: 28, detail: 'Same location filed twice before' },
      { flag: 'PATTERN',  points: 28, detail: 'Officer: 91% closure rate without photos' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 7,
  },

  // 10. Chennai — Drainage — IN_PROGRESS
  {
    id: 'NS-CHN-20260622-1177',
    issueType: 'DRAINAGE',
    issueDescription: 'Storm drain completely blocked on Anna Nagar 3rd Avenue. 2ft waterlogging after any rain.',
    severity: 'HIGH', priority: 'P2',
    location: { address: '3rd Avenue, Anna Nagar West', ward: 'Ward 72', wardNumber: 72, area: 'Anna Nagar', city: 'CHENNAI', lat: 13.0878, lng: 80.2147 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Vijayalakshmi S.', designation: 'Drainage Engineer', phone: '044-2621-0000', email: 'vjlakshmi@chennaicorporation.gov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(8 * H),
    department: 'Storm Water Drains', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 11. Hyderabad — Encroachment — ESCALATED
  {
    id: 'NS-HYD-20260617-8823',
    issueType: 'ENCROACHMENT',
    issueDescription: 'Vendor encroachment blocking 60% of Jubilee Hills footpath. Pedestrians forced onto road daily.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Road No. 36, Jubilee Hills Near Check Post', ward: 'Ward 45', wardNumber: 45, area: 'Jubilee Hills', city: 'HYDERABAD', lat: 17.4239, lng: 78.4071 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Ganesh Prasad', designation: 'Enforcement Officer', phone: '040-2312-9999', email: 'gprasad@ghmc.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 48,
    filedAt: ago(10 * D), lastUpdatedAt: ago(4 * D),
    department: 'Encroachment Removal', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [
      { level: 'WARD_OFFICER',      date: ago(5 * D), to: 'Ward Officer Padma Rao',              email: 'prao@ghmc.gov.in',     status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',date: ago(2 * D), to: 'Zonal Commissioner West Zone',        email: 'zc.west@ghmc.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 12. Kolkata — Water Supply — GENUINELY_RESOLVED
  {
    id: 'NS-KOL-20260612-5567',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply disrupted 8 days at Ultadanga residential colony. 200+ families affected.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'B Block, Ultadanga Main Road Residential Area', ward: 'Ward 57', wardNumber: 57, area: 'Ultadanga', city: 'KOLKATA', lat: 22.5750, lng: 88.3642 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Dipankar Bose', designation: 'Water Works Engineer', phone: '033-2286-4567', email: 'dbose@kmcgov.in' },
    slaDeadline: ago(12 * D), slaHours: 24,
    filedAt: ago(15 * D), lastUpdatedAt: ago(11 * D),
    department: 'Water Supply', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [{ level: 'WARD_OFFICER', date: ago(14 * D), to: 'Ward Officer Prashanta Das', email: 'pdas@kmcgov.in', status: 'RESPONDED' }],
    fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 13. Pune — Garbage — FILED
  {
    id: 'NS-PUN-20260626-2234',
    issueType: 'GARBAGE',
    issueDescription: 'PMC garbage van skipped Kothrud Sector 3 for 6 days. Rotting waste piling up in summer heat.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 3, Kothrud, Pune', ward: 'Ward 55', wardNumber: 55, area: 'Kothrud', city: 'PUNE' as City, lat: 18.5074, lng: 73.8077 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(16 * H), slaHours: 24,
    filedAt: ago(8 * H), lastUpdatedAt: ago(8 * H),
    department: 'Solid Waste Management', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 14. Mumbai — Fallen Wire — ASSIGNED (urgent!)
  {
    id: 'NS-MUM-20260626-3390',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'Live electrical wire fallen on LBS Marg near Kurla Station. Sparking visible — immediate danger.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'LBS Marg, Near Kurla Station, Kurla West', ward: 'Ward 183', wardNumber: 183, area: 'Kurla', city: 'MUMBAI', lat: 19.0728, lng: 72.8826 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Sunil Parab', designation: 'Electrical Emergency Officer', phone: '022-2659-0000', email: 'sparab@mcgm.gov.in' },
    slaDeadline: ahead(2 * H), slaHours: 6,
    filedAt: ago(4 * H), lastUpdatedAt: ago(1 * H),
    department: 'Electrical Works', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 15. Delhi — Pothole — GENUINELY_RESOLVED
  {
    id: 'NS-DEL-20260614-6621',
    issueType: 'POTHOLE',
    issueDescription: 'Large pothole near Rohini Sector 3 market. Vehicles damaged, elderly pedestrians falling.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 3 Market, Rohini, New Delhi', ward: 'Ward 14', wardNumber: 14, area: 'Rohini', city: 'DELHI', lat: 28.7333, lng: 77.1147 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Deepak Verma', designation: 'Roads Supervisor', phone: '011-2712-1234', email: 'dverma@mcd.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 48,
    filedAt: ago(13 * D), lastUpdatedAt: ago(9 * D),
    department: 'Roads & Traffic', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 16. Bengaluru — Burning Waste — ESCALATED
  {
    id: 'NS-BLR-20260619-7743',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Daily waste burning in HSR Layout open ground. Toxic smoke affecting 500m radius — children falling sick.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: '24th Main, HSR Layout Sector 2', ward: 'Ward 150', wardNumber: 150, area: 'HSR Layout', city: 'BENGALURU', lat: 12.9116, lng: 77.6473 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Kavitha Reddy', designation: 'Environment Officer', phone: '080-2297-5555', email: 'kreddy@bbmp.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 24,
    filedAt: ago(8 * D), lastUpdatedAt: ago(3 * D),
    department: 'Environment & Disaster Management', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [
      { level: 'WARD_OFFICER',      date: ago(5 * D), to: 'Ward Officer Basavraj Hiremath', email: 'bhiremath@bbmp.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',date: ago(2 * D), to: 'BBMP DC South Zone',            email: 'dc.south@bbmp.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 17. Chennai — Stray Dog — FILED
  {
    id: 'NS-CHN-20260626-4412',
    issueType: 'STRAY_DOG',
    issueDescription: 'Pack of aggressive stray dogs attacking pedestrians near Adyar bus stop. 2 children bitten this week.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Adyar Bus Stop, Gandhi Nagar, Adyar', ward: 'Ward 158', wardNumber: 158, area: 'Adyar', city: 'CHENNAI', lat: 13.0012, lng: 80.2565 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(22 * H), slaHours: 24,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Animal Welfare', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 18. Ahmedabad — Pothole — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-AMD-20260618-4401',
    issueType: 'POTHOLE',
    issueDescription: 'Massive pothole cluster on CG Road near Navrangpura crossing. 3 two-wheelers fell this week, one hospitalized.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'CG Road, Near Navrangpura Crossroads, Ahmedabad', ward: 'Ward 22', wardNumber: 22, area: 'Navrangpura', city: 'AHMEDABAD', lat: 23.0340, lng: 72.5644 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Bhavesh Patel', designation: 'Roads Supervisor', phone: '079-2324-1234', email: 'bpatel@amcgov.in' },
    slaDeadline: ago(5 * D), slaHours: 6,
    filedAt: ago(9 * D), lastUpdatedAt: ago(4 * D),
    department: 'Roads & Buildings', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Officer Jayshree Mehta', email: 'jmehta@amcgov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 91, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 36, detail: 'Closed in 55 min — CRITICAL pothole SLA is 6h' },
      { flag: 'NO_PHOTO', points: 27, detail: 'Zero field repair photographs uploaded' },
      { flag: 'PATTERN',  points: 28, detail: 'Officer: 87% same-day closures in May–June' },
    ], recommendation: 'RTI' },
    communityClusterSize: 8,
  },

  // 19. Jaipur — Garbage — ESCALATED
  {
    id: 'NS-JAI-20260619-7723',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage not collected for 8 days in Mansarovar Sector 3. Over 50 households dumping on roadside now.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 3, Mansarovar, Jaipur', ward: 'Ward 61', wardNumber: 61, area: 'Mansarovar', city: 'JAIPUR', lat: 26.8466, lng: 75.7520 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Ramchandra Sharma', designation: 'Sanitary Inspector', phone: '0141-2744-101', email: 'rsharma@jmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(3 * D),
    department: 'Solid Waste Management', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(6 * D), to: 'Ward Officer Sunita Gupta',         email: 'sgupta@jmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(2 * D), to: 'DC South Zone JMC',                 email: 'dc.south@jmc.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 20. Lucknow — Water Supply — IN_PROGRESS
  {
    id: 'NS-LKW-20260622-3318',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Burst pipeline in Gomti Nagar Extension causing 3-day water cut. 400+ flats without supply.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Vibhuti Khand, Gomti Nagar Extension, Lucknow', ward: 'Ward 110', wardNumber: 110, area: 'Gomti Nagar', city: 'LUCKNOW', lat: 26.8678, lng: 81.0112 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Ajay Srivastava', designation: 'Water Works Engineer', phone: '0522-2630-055', email: 'asrivastava@lmc.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 24,
    filedAt: ago(44 * H), lastUpdatedAt: ago(3 * H),
    department: 'Jal Sansthan', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 18,
  },

  // 21. Patna — Sewage — RTI_FILED
  {
    id: 'NS-PAT-20260609-5589',
    issueType: 'SEWAGE',
    issueDescription: 'Open sewage channel overflowing on Exhibition Road for 3 weeks. Black water entering shops and homes.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Exhibition Road, Near Gandhi Maidan, Patna', ward: 'Ward 45', wardNumber: 45, area: 'Gandhi Maidan', city: 'PATNA', lat: 25.6149, lng: 85.1376 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Ranjeet Kumar', designation: 'Drainage Engineer', phone: '0612-2688-101', email: 'rkumar@pmc.gov.in' },
    slaDeadline: ago(14 * D), slaHours: 48,
    filedAt: ago(18 * D), lastUpdatedAt: ago(3 * D),
    department: 'Sewerage & Sanitation', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(14 * D), to: 'Ward Officer Lalita Devi',             email: 'ldevi@pmc.gov.in',         status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(10 * D), to: 'Additional Commissioner PMC',          email: 'addl.comm@pmc.gov.in',     status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(5 * D),  to: "Municipal Commissioner's Office",      email: 'commissioner@pmc.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 78, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 42, detail: 'Same location — 4th complaint in 3 months' },
      { flag: 'DELAY',  points: 36, detail: '18 days CRITICAL issue unresolved' },
    ], recommendation: 'RTI' },
    communityClusterSize: 22,
  },

  // 22. Bhopal — Street Light — GENUINELY_RESOLVED
  {
    id: 'NS-BHO-20260614-8812',
    issueType: 'STREET_LIGHT',
    issueDescription: '12 street lights out on Hamidia Road near Sultania Hospital. Patients and visitors unsafe at night.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hamidia Road, Near Sultania Hospital, Bhopal', ward: 'Ward 38', wardNumber: 38, area: 'Hamidia Road', city: 'BHOPAL', lat: 23.2688, lng: 77.4009 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Suresh Tiwari', designation: 'Electrical Engineer', phone: '0755-2777-201', email: 'stiwari@bmcgov.in' },
    slaDeadline: ago(9 * D), slaHours: 48,
    filedAt: ago(12 * D), lastUpdatedAt: ago(8 * D),
    department: 'Electrical Works', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 23. Surat — Drainage — ASSIGNED
  {
    id: 'NS-SUR-20260624-6631',
    issueType: 'DRAINAGE',
    issueDescription: 'Storm drain choked on Athwa Gate main road. Area floods within 10 min of rain, vehicles stranded.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Athwa Gate Main Road, Near Railway Station, Surat', ward: 'Ward 17', wardNumber: 17, area: 'Athwa Gate', city: 'SURAT' as City, lat: 21.1702, lng: 72.8311 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Kiran Desai', designation: 'Drainage Supervisor', phone: '261-2420-101', email: 'kdesai@smcgov.in' },
    slaDeadline: ahead(20 * H), slaHours: 48,
    filedAt: ago(28 * H), lastUpdatedAt: ago(5 * H),
    department: 'Storm Water Drainage', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 24. Nagpur — Pothole — FILED
  {
    id: 'NS-NGP-20260626-2291',
    issueType: 'POTHOLE',
    issueDescription: 'Large pothole on Wardha Road near Ajni Square. Truck tyre burst incident yesterday, traffic chaos.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Wardha Road, Near Ajni Square, Nagpur', ward: 'Ward 72', wardNumber: 72, area: 'Ajni', city: 'NAGPUR' as City, lat: 21.1255, lng: 79.0844 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(30 * H), slaHours: 48,
    filedAt: ago(18 * H), lastUpdatedAt: ago(18 * H),
    department: 'Roads & Transport', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 25. Varanasi — Dead Animal — RESOLVED_CLAIMED
  {
    id: 'NS-VNS-20260623-5547',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead cow carcass lying near Assi Ghat approach road for 2 days. Stench unbearable — tourist area.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Assi Ghat Road, Near Tulsi Ghat, Varanasi', ward: 'Ward 82', wardNumber: 82, area: 'Assi', city: 'VARANASI' as City, lat: 25.2938, lng: 82.9988 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Ashok Yadav', designation: 'Sanitary Inspector', phone: '0542-2500-101', email: 'ayadav@vnn.gov.in' },
    slaDeadline: ago(1 * D), slaHours: 12,
    filedAt: ago(3 * D), lastUpdatedAt: ago(6 * H),
    department: 'Public Health & Sanitation', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 26. Kochi — Water Pollution — ESCALATED
  {
    id: 'NS-KOC-20260617-9934',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Industrial effluent discharge into Kannamaly canal making water black and foul-smelling. Fish dying.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kannamaly Canal, Near Edappally Junction, Kochi', ward: 'Ward 53', wardNumber: 53, area: 'Edappally', city: 'KOCHI' as City, lat: 10.0259, lng: 76.3088 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Thomas Mathew', designation: 'Environment Officer', phone: '0484-2335-201', email: 'tmathew@kochicorp.gov.in' },
    slaDeadline: ago(7 * D), slaHours: 24,
    filedAt: ago(10 * D), lastUpdatedAt: ago(4 * D),
    department: 'Environment & Pollution Control', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(7 * D), to: 'Ward Councillor Sherly Joseph',     email: 'sjoseph@kochicorp.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(3 * D), to: 'Deputy Mayor Office, Kochi',        email: 'deputymayor@kochicorp.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 11,
  },

  // 27. Coimbatore — Manhole — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-CBE-20260620-3367',
    issueType: 'MANHOLE',
    issueDescription: 'Open manhole on Avinashi Road near Gandhipuram bus stand. Cover missing since a week — near fall at night.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Avinashi Road, Near Gandhipuram Central Bus Stand, Coimbatore', ward: 'Ward 29', wardNumber: 29, area: 'Gandhipuram', city: 'COIMBATORE' as City, lat: 11.0168, lng: 76.9558 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Murugesan K.', designation: 'Underground Drainage Supervisor', phone: '0422-2394-201', email: 'murugesan@ccmc.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 6,
    filedAt: ago(7 * D), lastUpdatedAt: ago(3 * D),
    department: 'Underground Drainage', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [{ level: 'WARD_OFFICER', date: ago(3 * D), to: 'Ward Councillor Annamalai R.', email: 'rannamalai@ccmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 89, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 34, detail: 'Marked resolved in 30 min without cover replacement' },
      { flag: 'NO_PHOTO', points: 30, detail: 'No site photo after alleged repair' },
      { flag: 'REOPEN',   points: 25, detail: 'Same manhole reported open twice in 2 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 5,
  },

  // 28. Visakhapatnam — Air Pollution — IN_PROGRESS
  {
    id: 'NS-VIZ-20260621-7789',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Cement dust from construction site on Beach Road coating homes in 500m radius. Breathing issues reported.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Beach Road, Near Kailasagiri Ropeway, Visakhapatnam', ward: 'Ward 34', wardNumber: 34, area: 'Beach Road', city: 'VISAKHAPATNAM' as City, lat: 17.7303, lng: 83.3316 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Prasad Rao', designation: 'Environment Inspector', phone: '0891-2564-201', email: 'prasadrao@gvmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Environment & Pollution', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 29. Chandigarh — Broken Footpath — GENUINELY_RESOLVED
  {
    id: 'NS-CHD-20260611-4422',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath tiles completely broken and uplifted on Sector 17 shopping plaza. Senior citizens falling.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Sector 17 Plaza, Chandigarh', ward: 'Ward 17', wardNumber: 17, area: 'Sector 17', city: 'CHANDIGARH' as City, lat: 30.7411, lng: 76.7795 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Gurpreet Singh', designation: 'Civil Engineer', phone: '0172-2749-101', email: 'gsingh@mc-chd.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 72,
    filedAt: ago(15 * D), lastUpdatedAt: ago(9 * D),
    department: 'Roads & Buildings', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 30. Indore — Burning Waste — ESCALATED
  {
    id: 'NS-IDR-20260618-6643',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Dry leaves and plastic burning on Vijay Nagar main road every evening. Thick smoke for 2 hours daily.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'AB Road, Near Vijay Nagar Square, Indore', ward: 'Ward 46', wardNumber: 46, area: 'Vijay Nagar', city: 'INDORE' as City, lat: 22.7390, lng: 75.8872 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Hemlata Joshi', designation: 'Environment Officer', phone: '0731-2520-101', email: 'hjoshi@imcgov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Solid Waste', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(6 * D), to: 'Ward Officer Prakash Dubey',        email: 'pdubey@imcgov.in',     status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(3 * D), to: 'Additional Commissioner IMC',       email: 'addl.comm@imcgov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 31. Agra — Illegal Construction — FILED
  {
    id: 'NS-AGR-20260625-8801',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Multi-storey building being constructed without permits on Fatehabad Road near Taj Corridor. No safety hoarding.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Fatehabad Road, Near Shilpgram, Agra', ward: 'Ward 63', wardNumber: 63, area: 'Fatehabad Road', city: 'AGRA' as City, lat: 27.1591, lng: 78.0426 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Building Regulation', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 32. Mumbai — Noise Pollution — ASSIGNED
  {
    id: 'NS-MUM-20260624-9912',
    issueType: 'NOISE_POLLUTION',
    issueDescription: 'Nightclub in Bandra using loudspeakers past midnight every weekend. Residential area kept awake till 3 AM.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Waterfield Road, Bandra West, Mumbai', ward: 'Ward 69', wardNumber: 69, area: 'Bandra West', city: 'MUMBAI', lat: 19.0601, lng: 72.8367 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Santosh Mane', designation: 'Pollution Control Inspector', phone: '022-2659-8888', email: 'smane@mcgm.gov.in' },
    slaDeadline: ahead(24 * H), slaHours: 48,
    filedAt: ago(24 * H), lastUpdatedAt: ago(8 * H),
    department: 'Pollution Control', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 25,
  },

  // 33. Delhi — Encroachment — RTI_FILED
  {
    id: 'NS-DEL-20260608-3374',
    issueType: 'ENCROACHMENT',
    issueDescription: 'Street vendors encroaching entire pavement on Chandni Chowk. Wheelchair users have zero access.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Main Chandni Chowk Road, Near Fatehpuri Mosque, Delhi', ward: 'Ward 8', wardNumber: 8, area: 'Chandni Chowk', city: 'DELHI', lat: 28.6562, lng: 77.2300 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Vinod Kapoor', designation: 'Enforcement Officer', phone: '011-2694-2233', email: 'vkapoor@mcd.gov.in' },
    slaDeadline: ago(16 * D), slaHours: 48,
    filedAt: ago(19 * D), lastUpdatedAt: ago(2 * D),
    department: 'Enforcement & Encroachment', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(16 * D), to: 'Ward Officer Rekha Nair',              email: 'rnair@mcd.gov.in',         status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(11 * D), to: 'DC Central Zone MCD',                  email: 'dc.central@mcd.gov.in',    status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(6 * D),  to: "Commissioner MCD",                     email: 'commissioner@mcd.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 65, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 38, detail: 'Fifth complaint same stretch in 4 months' },
      { flag: 'DELAY',  points: 27, detail: '19 days elapsed, no enforcement action taken' },
    ], recommendation: 'RTI' },
    communityClusterSize: 19,
  },

  // 34. Bengaluru — Stray Dog — IN_PROGRESS
  {
    id: 'NS-BLR-20260622-5512',
    issueType: 'STRAY_DOG',
    issueDescription: 'Large pack of stray dogs in Whitefield ITPL main road area. 3 techies bitten while commuting on foot.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'ITPL Main Road, Near ITPL Gate 2, Whitefield, Bengaluru', ward: 'Ward 85', wardNumber: 85, area: 'Whitefield', city: 'BENGALURU', lat: 12.9818, lng: 77.7272 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Shylaja H.', designation: 'Animal Welfare Officer', phone: '080-2297-6789', email: 'shylaja@bbmp.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 24,
    filedAt: ago(40 * H), lastUpdatedAt: ago(5 * H),
    department: 'Animal Welfare', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 35. Kolkata — Pothole — ASSIGNED
  {
    id: 'NS-KOL-20260623-7791',
    issueType: 'POTHOLE',
    issueDescription: 'Dangerous pothole on EM Bypass near Ruby Crossing. Ambulance got stuck for 15 min — patient critical.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'EM Bypass, Near Ruby General Hospital, Kolkata', ward: 'Ward 108', wardNumber: 108, area: 'Ruby', city: 'KOLKATA', lat: 22.5177, lng: 88.3993 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Subrata Mondal', designation: 'Roads Engineer', phone: '033-2286-5555', email: 'smondal@kmcgov.in' },
    slaDeadline: ahead(5 * H), slaHours: 6,
    filedAt: ago(13 * H), lastUpdatedAt: ago(2 * H),
    department: 'Roads & Bridges', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 36. Hyderabad — Garbage — GENUINELY_RESOLVED
  {
    id: 'NS-HYD-20260613-4456',
    issueType: 'GARBAGE',
    issueDescription: 'Bulk garbage dumped by builder near Gachibowli stadium road. 3 trucks worth of construction debris.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Near Gachibowli Stadium, Financial District, Hyderabad', ward: 'Ward 121', wardNumber: 121, area: 'Gachibowli', city: 'HYDERABAD', lat: 17.4100, lng: 78.3479 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Padma Latha', designation: 'Conservancy Supervisor', phone: '040-2312-4444', email: 'platha@ghmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 48,
    filedAt: ago(14 * D), lastUpdatedAt: ago(8 * D),
    department: 'Solid Waste Management', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 37. Pune — Sewage — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-PUN-20260617-6628',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line burst on FC Road near Deccan Gymkhana. Foul water flowing into restaurant basements.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Fergusson College Road, Near Deccan Gymkhana, Pune', ward: 'Ward 24', wardNumber: 24, area: 'Deccan', city: 'PUNE' as City, lat: 18.5161, lng: 73.8402 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Milind Kulkarni', designation: 'Sewerage Engineer', phone: '020-2612-5555', email: 'mkulkarni@pmc.gov.in' },
    slaDeadline: ago(7 * D), slaHours: 24,
    filedAt: ago(10 * D), lastUpdatedAt: ago(6 * D),
    department: 'Sewerage & Sanitation', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [{ level: 'WARD_OFFICER', date: ago(6 * D), to: 'Ward Officer Sharda Pawar', email: 'spawar@pmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 85, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 33, detail: 'Closure recorded in 2h — burst pipe repair takes 12h+' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No post-repair site photo submitted' },
      { flag: 'PATTERN',  points: 26, detail: 'Engineer: 82% rapid closures this quarter' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 8,
  },

  // 38. Ahmedabad — Water Supply — FILED
  {
    id: 'NS-AMD-20260626-9901',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply timing reduced to 30 min per day in Narol GIDC area. 1500 workers in industry affected.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'GIDC Estate, Narol, Ahmedabad', ward: 'Ward 56', wardNumber: 56, area: 'Narol', city: 'AHMEDABAD', lat: 22.9669, lng: 72.6439 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Water Supply', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 39. Jaipur — Fallen Wire — ESCALATED
  {
    id: 'NS-JAI-20260623-3388',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'High-tension wire snapped and fallen near Pink City wall, Tripolia Bazaar. Area cordoned informally by locals.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Tripolia Bazaar, Near City Palace Gate, Jaipur', ward: 'Ward 5', wardNumber: 5, area: 'Tripolia Bazaar', city: 'JAIPUR', lat: 26.9249, lng: 75.8290 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Dinesh Mathur', designation: 'Electrical Emergency Officer', phone: '0141-2744-202', email: 'dmathur@jmc.gov.in' },
    slaDeadline: ago(2 * D), slaHours: 6,
    filedAt: ago(4 * D), lastUpdatedAt: ago(1 * D),
    department: 'Electrical Works', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(3 * D), to: 'Ward Councillor Meena Sharma',      email: 'msharma@jmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(1 * D), to: 'Chief Engineer Electrical JMC',     email: 'ce.elec@jmc.gov.in',   status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 17,
  },

  // 40. Lucknow — Pothole — RESOLVED_CLAIMED
  {
    id: 'NS-LKW-20260620-5571',
    issueType: 'POTHOLE',
    issueDescription: 'Series of potholes on Hazratganj main road damaging vehicles and causing traffic snarls near Janpath Market.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hazratganj Main Road, Near Janpath Market, Lucknow', ward: 'Ward 35', wardNumber: 35, area: 'Hazratganj', city: 'LUCKNOW', lat: 26.8467, lng: 80.9462 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Pradeep Mishra', designation: 'Roads Inspector', phone: '0522-2630-101', email: 'pmishra@lmc.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 48,
    filedAt: ago(7 * D), lastUpdatedAt: ago(1 * D),
    department: 'Roads & Bridges', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 41. Bhopal — Garbage — IN_PROGRESS
  {
    id: 'NS-BHO-20260623-7712',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage bins near New Market not emptied for 5 days. Overflow spilling onto road in prime commercial area.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'New Market, T.T. Nagar, Bhopal', ward: 'Ward 21', wardNumber: 21, area: 'New Market', city: 'BHOPAL', lat: 23.2299, lng: 77.4271 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Geeta Rao', designation: 'Conservancy Supervisor', phone: '0755-2777-301', email: 'grao@bmcgov.in' },
    slaDeadline: ahead(14 * H), slaHours: 24,
    filedAt: ago(34 * H), lastUpdatedAt: ago(4 * H),
    department: 'Solid Waste Management', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 42. Surat — Illegal Construction — ESCALATED
  {
    id: 'NS-SUR-20260616-8834',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Unauthorized floor added on commercial building in Rundh area. Structure visibly tilting — safety hazard.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Rundh, Near Kapodra Circle, Surat', ward: 'Ward 33', wardNumber: 33, area: 'Kapodra', city: 'SURAT' as City, lat: 21.2310, lng: 72.8492 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Jigar Shah', designation: 'Building Inspector', phone: '261-2420-201', email: 'jshah@smcgov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(11 * D), lastUpdatedAt: ago(3 * D),
    department: 'Town Development', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Officer Hina Gajjar',           email: 'hgajjar@smcgov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'DC Town Planning SMC',               email: 'dc.tp@smcgov.in',     status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 16,
  },

  // 43. Nagpur — Street Light — GENUINELY_RESOLVED
  {
    id: 'NS-NGP-20260612-2213',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Eight street lights out on Amravati Road near Ambedkar Chowk. Two mugging incidents in darkness.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Amravati Road, Near Ambedkar Square, Nagpur', ward: 'Ward 15', wardNumber: 15, area: 'Ambedkar Chowk', city: 'NAGPUR' as City, lat: 21.1541, lng: 79.0788 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Vikas Thakre', designation: 'Electrical Supervisor', phone: '0712-2560-101', email: 'vthakre@nmc.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 48,
    filedAt: ago(14 * D), lastUpdatedAt: ago(11 * D),
    department: 'Electrical Works', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 44. Varanasi — Sewage — FILED
  {
    id: 'NS-VNS-20260626-1123',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage drain overflowing onto Lanka BHU road. Students wading through sewage water to reach campus.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Lanka, Near BHU Gate, Varanasi', ward: 'Ward 90', wardNumber: 90, area: 'Lanka', city: 'VARANASI' as City, lat: 25.2677, lng: 82.9913 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(28 * H), slaHours: 48,
    filedAt: ago(20 * H), lastUpdatedAt: ago(20 * H),
    department: 'Sewerage & Sanitation', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 45. Kochi — Pothole — ASSIGNED
  {
    id: 'NS-KOC-20260624-5578',
    issueType: 'POTHOLE',
    issueDescription: 'Multiple potholes on MG Road near Lulu Mall junction causing evening traffic gridlock. Buses avoiding route.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'MG Road, Near Lulu Mall, Edappally, Kochi', ward: 'Ward 67', wardNumber: 67, area: 'Edappally', city: 'KOCHI' as City, lat: 10.0253, lng: 76.3083 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Reji Philip', designation: 'Roads Supervisor', phone: '0484-2335-301', email: 'rphilip@kochicorp.gov.in' },
    slaDeadline: ahead(22 * H), slaHours: 48,
    filedAt: ago(26 * H), lastUpdatedAt: ago(9 * H),
    department: 'Roads & Buildings', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 46. Coimbatore — Garbage — ESCALATED
  {
    id: 'NS-CBE-20260617-4489',
    issueType: 'GARBAGE',
    issueDescription: 'Commercial waste from textile factories being dumped on Peelamedu lake bund. Toxic discharge into water.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Peelamedu Lake Bund Road, Coimbatore', ward: 'Ward 51', wardNumber: 51, area: 'Peelamedu', city: 'COIMBATORE' as City, lat: 11.0199, lng: 77.0088 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Selvi R.', designation: 'Environment Inspector', phone: '0422-2394-301', email: 'rselvi@ccmc.gov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(10 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Sanitation', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Councillor Balamurugan S.',    email: 'bmurugan@ccmc.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'Commissioner Office CCMC',          email: 'commissioner@ccmc.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 47. Visakhapatnam — Fallen Wire — IN_PROGRESS
  {
    id: 'NS-VIZ-20260624-8856',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'Telephone cable fallen across road in Rushikonda beach area after cyclone preparedness drilling. Trip hazard.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Rushikonda Beach Road, Near GITAM University, Visakhapatnam', ward: 'Ward 56', wardNumber: 56, area: 'Rushikonda', city: 'VISAKHAPATNAM' as City, lat: 17.7814, lng: 83.3762 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Naresh Babu', designation: 'Infrastructure Supervisor', phone: '0891-2564-301', email: 'nbabu@gvmc.gov.in' },
    slaDeadline: ahead(16 * H), slaHours: 48,
    filedAt: ago(32 * H), lastUpdatedAt: ago(7 * H),
    department: 'Infrastructure Works', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 48. Chandigarh — Water Pollution — FILED
  {
    id: 'NS-CHD-20260626-3341',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Chemical smell from Sukhna Lake water near Rock Garden boat area. Algae bloom visible — tourism affected.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near Sukhna Lake Boat Club, Sector 1, Chandigarh', ward: 'Ward 1', wardNumber: 1, area: 'Sukhna Lake', city: 'CHANDIGARH' as City, lat: 30.7460, lng: 76.8183 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(18 * H), slaHours: 24,
    filedAt: ago(6 * H), lastUpdatedAt: ago(6 * H),
    department: 'Environment & Pollution Control', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 49. Indore — Pothole — GENUINELY_RESOLVED
  {
    id: 'NS-IDR-20260611-6611',
    issueType: 'POTHOLE',
    issueDescription: 'Two large potholes on Sapna-Sangeeta Road near Treasure Island Mall. School bus tyre blown — 30 children shaken.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sapna-Sangeeta Road, Near Treasure Island Mall, Indore', ward: 'Ward 68', wardNumber: 68, area: 'Sapna-Sangeeta', city: 'INDORE' as City, lat: 22.7271, lng: 75.8839 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Deepak Chouhan', designation: 'Roads Engineer', phone: '0731-2520-201', email: 'dchouhan@imcgov.in' },
    slaDeadline: ago(13 * D), slaHours: 6,
    filedAt: ago(15 * D), lastUpdatedAt: ago(12 * D),
    department: 'Roads & Bridges', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 50. Mumbai — OTHER — ESCALATED (boundary wall collapse warning)
  {
    id: 'NS-MUM-20260620-8874',
    issueType: 'OTHER',
    issueDescription: 'Old boundary wall of municipal school in Malad West showing cracks and leaning dangerously. Children play nearby.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Municipal School No. 4, Malad West, Near SV Road, Mumbai', ward: 'Ward 75', wardNumber: 75, area: 'Malad West', city: 'MUMBAI', lat: 19.1863, lng: 72.8484 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Hemant Jadhav', designation: 'Structural Engineer', phone: '022-2659-3322', email: 'hjadhav@mcgm.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 24,
    filedAt: ago(7 * D), lastUpdatedAt: ago(1 * D),
    department: 'Education & Buildings', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(5 * D), to: 'Ward Officer Lalita Gharat',         email: 'lgharat@mcgm.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(2 * D), to: 'DC P-North Ward MCGM',               email: 'dc.pnorth@mcgm.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 12,
  },

  // 51. Mumbai — DRAINAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-MUM-20260619-1051',
    issueType: 'DRAINAGE',
    issueDescription: 'Storm drain on Linking Road, Bandra clogged with plastic waste. Floods knee-deep after 20 min rain. Third complaint this monsoon.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Linking Road, Near Shoppers Stop, Bandra West, Mumbai', ward: 'Ward 69', wardNumber: 69, area: 'Bandra West', city: 'MUMBAI', lat: 19.0607, lng: 72.8362 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Prakash Kamble', designation: 'Drainage Supervisor', phone: '022-2659-4411', email: 'pkamble@mcgm.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 48,
    filedAt: ago(8 * D), lastUpdatedAt: ago(4 * D),
    department: 'Storm Water Drains', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Officer Varsha Kadam', email: 'vkadam@mcgm.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 87, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 33, detail: 'Closed in 45 min — drain desilting takes 4–6h' },
      { flag: 'REOPEN',   points: 28, detail: 'Same drain: third complaint this season' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No post-work photo or video uploaded' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 11,
  },

  // 52. Mumbai — MANHOLE — IN_PROGRESS
  {
    id: 'NS-MUM-20260624-1052',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover missing on Gokhale Road, Dadar. Narrow road, heavy pedestrian traffic — near-fall incidents reported daily.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Gokhale Road North, Near Dadar TT, Dadar West, Mumbai', ward: 'Ward 127', wardNumber: 127, area: 'Dadar West', city: 'MUMBAI', lat: 19.0183, lng: 72.8434 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Amol Desai', designation: 'Civil Works Supervisor', phone: '022-2659-5522', email: 'adesai@mcgm.gov.in' },
    slaDeadline: ahead(3 * H), slaHours: 6,
    filedAt: ago(3 * H), lastUpdatedAt: ago(1 * H),
    department: 'Roads & Traffic', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 53. Mumbai — WATER_SUPPLY — ESCALATED
  {
    id: 'NS-MUM-20260616-1053',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply contaminated with mud and brown sediment in Ghatkopar East sector B. 600+ flats drinking bottled water for 10 days.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sector B, Ghatkopar East, Near Vikrant Circle, Mumbai', ward: 'Ward 197', wardNumber: 197, area: 'Ghatkopar East', city: 'MUMBAI', lat: 19.0860, lng: 72.9081 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Vinayak Shinde', designation: 'Water Quality Engineer', phone: '022-2659-7711', email: 'vshinde@mcgm.gov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(11 * D), lastUpdatedAt: ago(2 * D),
    department: 'Water Supply & Sewerage', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Officer Anita More',         email: 'amore@mcgm.gov.in',      status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'DC L Ward MCGM',                  email: 'dc.lward@mcgm.gov.in',   status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 24,
  },

  // 54. Mumbai — ILLEGAL_CONSTRUCTION — FILED
  {
    id: 'NS-MUM-20260627-1054',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Unauthorized room addition on rooftop of G+3 building in Borivali East without structural check. Building already over-capacity.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Eksar Road, Borivali East, Mumbai', ward: 'Ward 76', wardNumber: 76, area: 'Borivali East', city: 'MUMBAI', lat: 19.2315, lng: 72.8578 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Building Proposals', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 55. Mumbai — GARBAGE — RTI_FILED
  {
    id: 'NS-MUM-20260607-1055',
    issueType: 'GARBAGE',
    issueDescription: 'Biomedical waste from clinic being mixed with municipal garbage in Chembur colony. Syringes found in bin bags.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Tilak Nagar, Near Chembur Station, Chembur, Mumbai', ward: 'Ward 155', wardNumber: 155, area: 'Chembur', city: 'MUMBAI', lat: 19.0621, lng: 72.8997 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Anand Kale', designation: 'Sanitary Inspector', phone: '022-2659-6633', email: 'akale@mcgm.gov.in' },
    slaDeadline: ago(17 * D), slaHours: 12,
    filedAt: ago(20 * D), lastUpdatedAt: ago(3 * D),
    department: 'Solid Waste Management', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(17 * D), to: 'Ward Officer Kaveri Sonar',           email: 'ksonar@mcgm.gov.in',      status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(11 * D), to: 'DC M-West Ward',                      email: 'dc.mwest@mcgm.gov.in',    status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(5 * D),  to: "Commissioner's Office MCGM",          email: 'commissioner@mcgm.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 72, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 38, detail: 'Same clinic reported four times in 2 months' },
      { flag: 'DELAY',  points: 34, detail: 'CRITICAL biomedical hazard — 20 days unresolved' },
    ], recommendation: 'RTI' },
    communityClusterSize: 18,
  },

  // 56. Delhi — GARBAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-DEL-20260619-1056',
    issueType: 'GARBAGE',
    issueDescription: 'Bulk garbage from illegal slaughter near Bhalswa dairy not cleared for 8 days. Vultures circling — public health alert.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Bhalswa Dairy Colony, Near Bhalswa Lake, North Delhi', ward: 'Ward 3', wardNumber: 3, area: 'Bhalswa', city: 'DELHI', lat: 28.7437, lng: 77.1568 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Sanjay Rawat', designation: 'Sanitary Inspector', phone: '011-2712-3344', email: 'srawat@mcd.gov.in' },
    slaDeadline: ago(7 * D), slaHours: 12,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Solid Waste Management', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Ritu Verma', email: 'rverma@mcd.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 92, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 35, detail: 'Marked resolved in 1h — bulk clearance impossible in that time' },
      { flag: 'PATTERN',  points: 30, detail: 'Inspector: 94% rapid closures this month' },
      { flag: 'NO_PHOTO', points: 27, detail: 'No clearance photo or vehicle log submitted' },
    ], recommendation: 'RTI' },
    communityClusterSize: 16,
  },

  // 57. Delhi — SEWAGE — IN_PROGRESS
  {
    id: 'NS-DEL-20260624-1057',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line choked near Sarojini Nagar market. Overflow entering shops on main market road. Traders threatening protest.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sarojini Nagar Main Market, South Delhi', ward: 'Ward 94', wardNumber: 94, area: 'Sarojini Nagar', city: 'DELHI', lat: 28.5760, lng: 77.1924 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Rajeev Tandon', designation: 'Sewerage Engineer', phone: '011-2694-7788', email: 'rtandon@mcd.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(5 * H),
    department: 'Water Supply & Sewerage', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 58. Delhi — POTHOLE — RTI_FILED
  {
    id: 'NS-DEL-20260605-1058',
    issueType: 'POTHOLE',
    issueDescription: 'NH-48 service road near Mahipalpur flyover riddled with potholes for 3 months. Airport-bound traffic severely affected. Six accidents recorded.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'NH-48 Service Road, Near Mahipalpur Flyover, South West Delhi', ward: 'Ward 177', wardNumber: 177, area: 'Mahipalpur', city: 'DELHI', lat: 28.5491, lng: 77.1180 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Harpal Singh', designation: 'Roads Engineer', phone: '011-2694-5566', email: 'hsingh@mcd.gov.in' },
    slaDeadline: ago(18 * D), slaHours: 6,
    filedAt: ago(22 * D), lastUpdatedAt: ago(4 * D),
    department: 'Roads & Traffic', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(18 * D), to: 'Ward Officer Kiran Negi',              email: 'knegi@mcd.gov.in',         status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(12 * D), to: 'DC South West Zone MCD',               email: 'dc.sw@mcd.gov.in',         status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(7 * D),  to: "Commissioner MCD",                     email: 'commissioner@mcd.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 80, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 40, detail: 'NH service road: seventh complaint in 3 months' },
      { flag: 'DELAY',  points: 40, detail: 'CRITICAL road unrepaired 22 days despite 6 accidents' },
    ], recommendation: 'RTI' },
    communityClusterSize: 27,
  },

  // 59. Delhi — NOISE_POLLUTION — ASSIGNED
  {
    id: 'NS-DEL-20260625-1059',
    issueType: 'NOISE_POLLUTION',
    issueDescription: 'Construction work with heavy machinery continuing beyond 10 PM in Vasant Kunj C3 block. Residents unable to sleep.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'C3 Block, Vasant Kunj, South Delhi', ward: 'Ward 180', wardNumber: 180, area: 'Vasant Kunj', city: 'DELHI', lat: 28.5250, lng: 77.1528 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Pooja Yadav', designation: 'Pollution Control Officer', phone: '011-2694-9900', email: 'pyadav@mcd.gov.in' },
    slaDeadline: ahead(20 * H), slaHours: 48,
    filedAt: ago(28 * H), lastUpdatedAt: ago(9 * H),
    department: 'Environment & Pollution Control', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 30,
  },

  // 60. Delhi — DEAD_ANIMAL — GENUINELY_RESOLVED
  {
    id: 'NS-DEL-20260614-1060',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead dog carcass near INA market main entrance. Stench affecting vendors and shoppers. Resolved after 3-day delay.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'INA Market, Africa Avenue, South Delhi', ward: 'Ward 97', wardNumber: 97, area: 'INA Colony', city: 'DELHI', lat: 28.5777, lng: 77.2064 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Manoj Saini', designation: 'Sanitary Worker Supervisor', phone: '011-2694-3322', email: 'msaini@mcd.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 12,
    filedAt: ago(13 * D), lastUpdatedAt: ago(10 * D),
    department: 'Public Health', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 61. Bengaluru — WATER_SUPPLY — RTI_FILED
  {
    id: 'NS-BLR-20260606-1061',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Cauvery water supply stopped entirely to Rajajinagar 4th block for 12 days. 800 residents buying tankers at ₹1200/load.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: '4th Block, Rajajinagar, Bengaluru', ward: 'Ward 24', wardNumber: 24, area: 'Rajajinagar', city: 'BENGALURU', lat: 12.9916, lng: 77.5507 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Prakash Babu', designation: 'Water Supply Engineer', phone: '080-2297-3311', email: 'pbabu@bbmp.gov.in' },
    slaDeadline: ago(16 * D), slaHours: 24,
    filedAt: ago(21 * D), lastUpdatedAt: ago(3 * D),
    department: 'Water Supply', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(16 * D), to: 'Ward Officer Nandini Rao',             email: 'nrao@bbmp.gov.in',         status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(10 * D), to: 'DC West Zone BBMP',                    email: 'dc.west@bbmp.gov.in',      status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(5 * D),  to: "Commissioner BBMP",                    email: 'commissioner@bbmp.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 75, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 38, detail: 'Same block: third RTI in 4 months' },
      { flag: 'DELAY',  points: 37, detail: 'CRITICAL supply cut unresolved 21 days' },
    ], recommendation: 'RTI' },
    communityClusterSize: 22,
  },

  // 62. Bengaluru — GARBAGE — ASSIGNED
  {
    id: 'NS-BLR-20260625-1062',
    issueType: 'GARBAGE',
    issueDescription: 'Pourakarmikas skipping Indiranagar 12th Main since 4 days. Garbage accumulating near commercial complex entrance.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: '12th Main, HAL 2nd Stage, Indiranagar, Bengaluru', ward: 'Ward 75', wardNumber: 75, area: 'Indiranagar', city: 'BENGALURU', lat: 12.9784, lng: 77.6408 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Ravi Kumar', designation: 'Conservancy Supervisor', phone: '080-2297-4422', email: 'rkumar@bbmp.gov.in' },
    slaDeadline: ahead(16 * H), slaHours: 24,
    filedAt: ago(32 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 63. Bengaluru — ILLEGAL_CONSTRUCTION — ESCALATED
  {
    id: 'NS-BLR-20260616-1063',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Commercial building being constructed on storm water drain bed in JP Nagar 7th Phase. BBMP plan sanctioned has residential use only.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: '7th Phase, JP Nagar, Near Sarakki Lake, Bengaluru', ward: 'Ward 175', wardNumber: 175, area: 'JP Nagar', city: 'BENGALURU', lat: 12.8897, lng: 77.5858 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Basavaraj Shetty', designation: 'Building Inspector', phone: '080-2297-7766', email: 'bshetty@bbmp.gov.in' },
    slaDeadline: ago(9 * D), slaHours: 24,
    filedAt: ago(11 * D), lastUpdatedAt: ago(2 * D),
    department: 'Town Planning', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(9 * D), to: 'Ward Officer Shantha Kumar',       email: 'skumar@bbmp.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'DC South Zone BBMP',               email: 'dc.south@bbmp.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 64. Bengaluru — NOISE_POLLUTION — RESOLVED_CLAIMED
  {
    id: 'NS-BLR-20260621-1064',
    issueType: 'NOISE_POLLUTION',
    issueDescription: "Pub on 100 Feet Road, Indiranagar playing music past 1 AM. Residential apartments above store can't sleep on weekends.",
    severity: 'MEDIUM', priority: 'P3',
    location: { address: '100 Feet Road, Near Old Madras Road Junction, Indiranagar, Bengaluru', ward: 'Ward 75', wardNumber: 75, area: 'Indiranagar', city: 'BENGALURU', lat: 12.9784, lng: 77.6408 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Anitha B.', designation: 'Environment Inspector', phone: '080-2297-5544', email: 'anithab@bbmp.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 48,
    filedAt: ago(6 * D), lastUpdatedAt: ago(1 * D),
    department: 'Environment & Pollution Control', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 65. Bengaluru — BROKEN_FOOTPATH — GENUINELY_RESOLVED
  {
    id: 'NS-BLR-20260610-1065',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on MG Road near Trinity Circle dug up by BWSSB and not restored for 6 weeks. Pedestrians walking on road.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'MG Road, Near Trinity Circle, Bengaluru', ward: 'Ward 72', wardNumber: 72, area: 'MG Road', city: 'BENGALURU', lat: 12.9760, lng: 77.6099 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Lokesh G.', designation: 'Roads Inspector', phone: '080-2297-2211', email: 'glokesh@bbmp.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 72,
    filedAt: ago(16 * D), lastUpdatedAt: ago(10 * D),
    department: 'Roads & Infrastructure', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 66. Kolkata — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-KOL-20260618-1066',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage overflow on Park Street near Oxford Book Store junction. Seeping into building basements and restaurants.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Park Street, Near Oxford Book Store, Kolkata', ward: 'Ward 62', wardNumber: 62, area: 'Park Street', city: 'KOLKATA', lat: 22.5547, lng: 88.3501 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Amitava Ghosh', designation: 'Sewerage Engineer', phone: '033-2286-7788', email: 'aghosh@kmcgov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Sewerage & Drainage', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Barnali Das', email: 'bdas@kmcgov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 86, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 32, detail: 'Marked resolved 55 min after filing — sewage repair needs hours' },
      { flag: 'PATTERN',  points: 29, detail: 'Engineer: 88% same-day closures last 30 days' },
      { flag: 'REOPEN',   points: 25, detail: 'Park Street drain: second report in 3 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 10,
  },

  // 67. Kolkata — STREET_LIGHT — FILED
  {
    id: 'NS-KOL-20260627-1067',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Entire stretch of AJC Bose Road near Minto Park dark for 3 nights. Snatch-and-run incidents reported.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'AJC Bose Road, Near Minto Park, Kolkata', ward: 'Ward 66', wardNumber: 66, area: 'Minto Park', city: 'KOLKATA', lat: 22.5430, lng: 88.3513 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(42 * H), slaHours: 48,
    filedAt: ago(6 * H), lastUpdatedAt: ago(6 * H),
    department: 'Electrical Works', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 68. Kolkata — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-KOL-20260616-1068',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Massive dust cloud from Ultadanga flyover construction without dust suppression. AQI spiking to 280+ every morning.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ultadanga Flyover Construction, VIP Road, Kolkata', ward: 'Ward 55', wardNumber: 55, area: 'Ultadanga', city: 'KOLKATA', lat: 22.5721, lng: 88.3937 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sourav Chatterjee', designation: 'Environment Officer', phone: '033-2286-9900', email: 'schatterjee@kmcgov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(11 * D), lastUpdatedAt: ago(3 * D),
    department: 'Environment & Pollution', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Officer Swapna Majumdar',    email: 'smajumdar@kmcgov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'DC North Zone KMC',               email: 'dc.north@kmcgov.in',   status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 19,
  },

  // 69. Kolkata — ENCROACHMENT — IN_PROGRESS
  {
    id: 'NS-KOL-20260622-1069',
    issueType: 'ENCROACHMENT',
    issueDescription: 'Hawkers on Gariahat road encroaching half the road width outside market hours. BRTS lane completely blocked.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Gariahat Road, Near Rashbehari Crossing, Kolkata', ward: 'Ward 85', wardNumber: 85, area: 'Gariahat', city: 'KOLKATA', lat: 22.5180, lng: 88.3629 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Tapas Roy', designation: 'Enforcement Inspector', phone: '033-2286-3311', email: 'troy@kmcgov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(8 * H),
    department: 'Enforcement & Encroachment', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 70. Chennai — POTHOLE — ESCALATED
  {
    id: 'NS-CHN-20260615-1070',
    issueType: 'POTHOLE',
    issueDescription: 'GST Road near Chromepet flyover has 15+ potholes in 500m stretch. 2 fatalities this month linked to this road.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'GST Road, Near Chromepet Flyover, Chennai', ward: 'Ward 185', wardNumber: 185, area: 'Chromepet', city: 'CHENNAI', lat: 12.9516, lng: 80.1435 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Subramaniam A.', designation: 'Roads Engineer', phone: '044-2538-1122', email: 'asubra@chennaicorporation.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 6,
    filedAt: ago(12 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Bridges', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Councillor Saravanan M.',    email: 'msaravanan@gcc.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'DC South Zone GCC',               email: 'dc.south@gcc.gov.in',    status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 28,
  },

  // 71. Chennai — WATER_SUPPLY — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-CHN-20260617-1071',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Metrowater supply absent in Velachery Lake View Road for 7 days. 350 families relying on paid tankers during summer.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Lake View Road, Velachery, Chennai', ward: 'Ward 173', wardNumber: 173, area: 'Velachery', city: 'CHENNAI', lat: 12.9802, lng: 80.2186 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Parveen Sultana', designation: 'Water Works Engineer', phone: '044-2538-3344', email: 'psultana@gcc.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 24,
    filedAt: ago(8 * D), lastUpdatedAt: ago(4 * D),
    department: 'Water Supply', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Councillor Kavitha Devi', email: 'kdevi@gcc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 90, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 35, detail: 'Closed 30 min after assignment — pipeline repair impossible in that time' },
      { flag: 'NO_PHOTO', points: 28, detail: 'No repair work order or field photo submitted' },
      { flag: 'PATTERN',  points: 27, detail: 'Engineer: 92% same-day closures in June' },
    ], recommendation: 'RTI' },
    communityClusterSize: 14,
  },

  // 72. Chennai — MANHOLE — IN_PROGRESS
  {
    id: 'NS-CHN-20260623-1072',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover dislodged on Anna Salai near Gemini flyover. Motorcycles swerving dangerously to avoid it.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Anna Salai, Near Gemini Flyover, Chennai', ward: 'Ward 107', wardNumber: 107, area: 'Gemini', city: 'CHENNAI', lat: 13.0574, lng: 80.2553 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Murugan P.', designation: 'Underground Drainage Engineer', phone: '044-2538-5566', email: 'pmurugan@gcc.gov.in' },
    slaDeadline: ahead(5 * H), slaHours: 6,
    filedAt: ago(1 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Underground Drainage', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 73. Chennai — ILLEGAL_CONSTRUCTION — FILED
  {
    id: 'NS-CHN-20260627-1073',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Basement parking converted to commercial space in Nungambakkam High Road apartment. Fire exit blocked illegally.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Nungambakkam High Road, Near Taj Connemara, Chennai', ward: 'Ward 112', wardNumber: 112, area: 'Nungambakkam', city: 'CHENNAI', lat: 13.0624, lng: 80.2466 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(40 * H), slaHours: 48,
    filedAt: ago(8 * H), lastUpdatedAt: ago(8 * H),
    department: 'Building Regulation', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 74. Hyderabad — POTHOLE — IN_PROGRESS
  {
    id: 'NS-HYD-20260623-1074',
    issueType: 'POTHOLE',
    issueDescription: 'Tank Bund road near NTR garden has series of potholes after recent rain. High-traffic tourist road in dismal condition.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Tank Bund Road, Near NTR Garden, Hyderabad', ward: 'Ward 47', wardNumber: 47, area: 'Tank Bund', city: 'HYDERABAD', lat: 17.4285, lng: 78.4685 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Srinivas Reddy', designation: 'Roads Engineer', phone: '040-2312-3311', email: 'sreddy@ghmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(7 * H),
    department: 'Roads & Bridges', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 75. Hyderabad — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-HYD-20260619-1075',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage overflowing near Secunderabad railway station goods yard for 5 days. Platform approach road flooded.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near Secunderabad Station Goods Yard, Secunderabad', ward: 'Ward 19', wardNumber: 19, area: 'Secunderabad', city: 'HYDERABAD', lat: 17.4410, lng: 78.5011 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Venkat Rao', designation: 'Sewerage Supervisor', phone: '040-2312-7788', email: 'vrao@ghmc.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 24,
    filedAt: ago(8 * D), lastUpdatedAt: ago(4 * D),
    department: 'Sewerage & Drainage', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Officer Premalatha T.', email: 'tpremalatha@ghmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 83, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 31, detail: 'Closed in 40 min — sewage pump repair takes 6h+' },
      { flag: 'REOPEN',   points: 27, detail: 'Station yard sewage: second complaint in 2 weeks' },
      { flag: 'NO_PHOTO', points: 25, detail: 'No clearance evidence uploaded' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 7,
  },

  // 76. Hyderabad — BURNING_WASTE — FILED
  {
    id: 'NS-HYD-20260627-1076',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Hospital waste being burnt in open area near Osmania Hospital compound wall. Toxic smoke entering ward windows.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Osmania Hospital Road, Afzalgunj, Hyderabad', ward: 'Ward 61', wardNumber: 61, area: 'Afzalgunj', city: 'HYDERABAD', lat: 17.3697, lng: 78.4788 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Environment & Pollution Control', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 77. Hyderabad — WATER_POLLUTION — ESCALATED
  {
    id: 'NS-HYD-20260614-1077',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Hussain Sagar lake receiving untreated sewage discharge from Begumpet drain. Lake water turning dark green — fish kill event.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Hussain Sagar Lake, Near NTR Marg, Hyderabad', ward: 'Ward 50', wardNumber: 50, area: 'Hussain Sagar', city: 'HYDERABAD', lat: 17.4288, lng: 78.4737 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Madhavi Latha', designation: 'Environment Officer', phone: '040-2312-6677', email: 'mlatha@ghmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 12,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Vijayalaxmi K.',     email: 'kvijayalaxmi@ghmc.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Zonal Commissioner Central Zone', email: 'zc.central@ghmc.gov.in',   status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 23,
  },

  // 78. Pune — POTHOLE — ESCALATED
  {
    id: 'NS-PUN-20260615-1078',
    issueType: 'POTHOLE',
    issueDescription: 'Karve Road near Karve statue has 8 deep potholes in 200m stretch. Auto-rickshaw overturned yesterday — driver hospitalised.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Karve Road, Near Karve Statue, Kothrud, Pune', ward: 'Ward 54', wardNumber: 54, area: 'Karve Road', city: 'PUNE' as City, lat: 18.5088, lng: 73.8217 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Amol Patil', designation: 'Roads Engineer', phone: '020-2612-3344', email: 'apatil@pmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 6,
    filedAt: ago(12 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Transport', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Archana Desai',      email: 'adesai@pmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner PMC',     email: 'addl.comm@pmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 17,
  },

  // 79. Pune — WATER_SUPPLY — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-PUN-20260620-1079',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'PMC water supply absent in Hadapsar Magarpatta area for 4 days. IT park workers buying drinking water from shops.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Magarpatta City Township, Hadapsar, Pune', ward: 'Ward 103', wardNumber: 103, area: 'Hadapsar', city: 'PUNE' as City, lat: 18.5112, lng: 73.9275 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Suhas Jagtap', designation: 'Water Works Engineer', phone: '020-2612-5566', email: 'sjagtap@pmc.gov.in' },
    slaDeadline: ago(3 * D), slaHours: 24,
    filedAt: ago(5 * D), lastUpdatedAt: ago(2 * D),
    department: 'Water Supply', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [{ level: 'WARD_OFFICER', date: ago(2 * D), to: 'Ward Officer Rekha Bhosale', email: 'rbhosale@pmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 84, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 32, detail: 'Resolved status within 50 min — pipeline burst repair takes 8h+' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No repair documentation uploaded to system' },
      { flag: 'REOPEN',   points: 26, detail: 'Hadapsar zone supply failure reported twice in 2 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 13,
  },

  // 80. Pune — DRAINAGE — IN_PROGRESS
  {
    id: 'NS-PUN-20260624-1080',
    issueType: 'DRAINAGE',
    issueDescription: 'Nulla near Sinhagad Road Wadgaon Sheri completely choked. Entire locality floods within 15 min of any rain.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sinhagad Road, Wadgaon Sheri, Pune', ward: 'Ward 62', wardNumber: 62, area: 'Wadgaon Sheri', city: 'PUNE' as City, lat: 18.4855, lng: 73.8467 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Kiran Deshpande', designation: 'Drainage Engineer', phone: '020-2612-7788', email: 'kdeshpande@pmc.gov.in' },
    slaDeadline: ahead(14 * H), slaHours: 48,
    filedAt: ago(34 * H), lastUpdatedAt: ago(6 * H),
    department: 'Storm Water Drainage', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 81. Ahmedabad — SEWAGE — ESCALATED
  {
    id: 'NS-AMD-20260616-1081',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line burst near Ashram Road Navjivan press. Raw sewage on road for 4 days — Gandhi Ashram area affected.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Ashram Road, Near Navjivan Press, Ahmedabad', ward: 'Ward 15', wardNumber: 15, area: 'Ashram Road', city: 'AHMEDABAD', lat: 23.0499, lng: 72.5659 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Jayant Shah', designation: 'Sewerage Engineer', phone: '079-2324-3322', email: 'jshah@amcgov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(10 * D), lastUpdatedAt: ago(2 * D),
    department: 'Water & Sewerage', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Officer Heena Patel',         email: 'hpatel@amcgov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'DC Central Zone AMC',              email: 'dc.central@amcgov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 82. Ahmedabad — BURNING_WASTE — FILED
  {
    id: 'NS-AMD-20260627-1082',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Scrap dealer burning plastic cables in Odhav GIDC industrial area. Black toxic smoke at 6 AM every morning.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Odhav GIDC, Near Odhav Crossroads, Ahmedabad', ward: 'Ward 48', wardNumber: 48, area: 'Odhav', city: 'AHMEDABAD', lat: 23.0101, lng: 72.6617 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Environment & Solid Waste', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 83. Ahmedabad — BROKEN_FOOTPATH — GENUINELY_RESOLVED
  {
    id: 'NS-AMD-20260611-1083',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Paldi AMTS bus terminus completely broken, bricks jutting out. Senior citizens attending morning walk suffering injuries.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Paldi Bus Terminus Road, Near Sardar Patel Stadium, Ahmedabad', ward: 'Ward 19', wardNumber: 19, area: 'Paldi', city: 'AHMEDABAD', lat: 23.0130, lng: 72.5722 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Rakesh Trivedi', designation: 'Civil Engineer', phone: '079-2324-5544', email: 'rtrivedi@amcgov.in' },
    slaDeadline: ago(12 * D), slaHours: 72,
    filedAt: ago(15 * D), lastUpdatedAt: ago(11 * D),
    department: 'Roads & Buildings', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 84. Ahmedabad — STRAY_DOG — IN_PROGRESS
  {
    id: 'NS-AMD-20260623-1084',
    issueType: 'STRAY_DOG',
    issueDescription: 'Stray dog menace at Satellite Road near Jodhpur crossroads. 4 people bitten in last 2 weeks including a 6-year-old.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Satellite Road, Near Jodhpur Crossroads, Ahmedabad', ward: 'Ward 30', wardNumber: 30, area: 'Satellite', city: 'AHMEDABAD', lat: 23.0278, lng: 72.5171 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Usha Patel', designation: 'Animal Welfare Officer', phone: '079-2324-7766', email: 'upatel@amcgov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Animal Welfare', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 85. Jaipur — POTHOLE — IN_PROGRESS
  {
    id: 'NS-JAI-20260624-1085',
    issueType: 'POTHOLE',
    issueDescription: 'Potholes on Ajmer Road near World Trade Park. Heavy vehicle traffic made them axle-deep.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ajmer Road, Near World Trade Park, Jaipur', ward: 'Ward 70', wardNumber: 70, area: 'Ajmer Road', city: 'JAIPUR', lat: 26.8915, lng: 75.7799 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Bhanu Pratap', designation: 'Roads Inspector', phone: '0141-2744-303', email: 'bpratap@jmc.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(5 * H),
    department: 'Roads & Bridges', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 86. Jaipur — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-JAI-20260617-1086',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage nullah overflowing at Vaishali Nagar C2 block. Children playing near open sewage — gastroenteritis cases rising.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'C2 Block, Vaishali Nagar, Jaipur', ward: 'Ward 43', wardNumber: 43, area: 'Vaishali Nagar', city: 'JAIPUR', lat: 26.9095, lng: 75.7389 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Mahesh Gupta', designation: 'Sewerage Engineer', phone: '0141-2744-404', email: 'mgupta@jmc.gov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(10 * D), lastUpdatedAt: ago(6 * D),
    department: 'Sewerage & Sanitation', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [{ level: 'WARD_OFFICER', date: ago(6 * D), to: 'Ward Officer Anita Sharma', email: 'asharma@jmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 88, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 34, detail: 'Closed in 1h — nullah desilting takes 1 full day' },
      { flag: 'PATTERN',  points: 28, detail: 'Engineer: 90% rapid closures June month' },
      { flag: 'REOPEN',   points: 26, detail: 'Vaishali Nagar sewage: third report this season' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 12,
  },

  // 87. Jaipur — STREET_LIGHT — ASSIGNED
  {
    id: 'NS-JAI-20260625-1087',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Seven street lights non-functional on Sikar Road near bus stand. Visibility near zero after 9 PM.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sikar Road, Near Sindhi Camp Bus Stand, Jaipur', ward: 'Ward 12', wardNumber: 12, area: 'Sikar Road', city: 'JAIPUR', lat: 26.9202, lng: 75.7928 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Govind Sharma', designation: 'Electrical Engineer', phone: '0141-2744-505', email: 'gsharma@jmc.gov.in' },
    slaDeadline: ahead(24 * H), slaHours: 48,
    filedAt: ago(24 * H), lastUpdatedAt: ago(10 * H),
    department: 'Electrical Works', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 88. Lucknow — GARBAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-LKW-20260618-1088',
    issueType: 'GARBAGE',
    issueDescription: 'Bulk waste dumped by construction company on Gomti Nagar Vistar main road. Blocking half road — residents furious.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Gomti Nagar Vistar, Sector 1 Main Road, Lucknow', ward: 'Ward 112', wardNumber: 112, area: 'Gomti Nagar Vistar', city: 'LUCKNOW', lat: 26.8740, lng: 81.0280 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Shyam Babu Tiwari', designation: 'Sanitary Inspector', phone: '0522-2630-202', email: 'sbtiwari@lmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Solid Waste Management', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Lalita Pandey', email: 'lpandey@lmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 81, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 30, detail: 'Closed in 40 min — construction debris clearance takes 3 trucks' },
      { flag: 'NO_PHOTO', points: 27, detail: 'No photo or vehicle movement log' },
      { flag: 'REOPEN',   points: 24, detail: 'Same stretch reported twice in 10 days' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 10,
  },

  // 89. Lucknow — STREET_LIGHT — ESCALATED
  {
    id: 'NS-LKW-20260614-1089',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights near Aminabad market non-functional for 12 days. Three robbery incidents in dark alley reported to police.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Aminabad Market Road, Near GPO, Lucknow', ward: 'Ward 40', wardNumber: 40, area: 'Aminabad', city: 'LUCKNOW', lat: 26.8466, lng: 80.9336 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Ramesh Tripathi', designation: 'Electrical Supervisor', phone: '0522-2630-303', email: 'rtripathi@lmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 48,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Electrical Works', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Sunita Singh',       email: 'ssingh@lmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner LMC',    email: 'addl.comm@lmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 16,
  },

  // 90. Lucknow — DRAINAGE — FILED
  {
    id: 'NS-LKW-20260627-1090',
    issueType: 'DRAINAGE',
    issueDescription: 'Rain water accumulating outside Lulu Mall Lucknow. Shoppers wading through knee-deep water in mall entrance area.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Lulu Mall, Shaheed Path, Amar Shaheed Path, Lucknow', ward: 'Ward 115', wardNumber: 115, area: 'Shaheed Path', city: 'LUCKNOW', lat: 26.8466, lng: 81.0006 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(30 * H), slaHours: 48,
    filedAt: ago(18 * H), lastUpdatedAt: ago(18 * H),
    department: 'Storm Water Drainage', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 91. Patna — POTHOLE — ESCALATED
  {
    id: 'NS-PAT-20260615-1091',
    issueType: 'POTHOLE',
    issueDescription: 'Bailey Road in Patna has 20+ potholes in 1 km stretch near Boring Road crossing. School buses refusing to ply.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Bailey Road, Near Boring Road Crossing, Patna', ward: 'Ward 48', wardNumber: 48, area: 'Bailey Road', city: 'PATNA', lat: 25.6135, lng: 85.0806 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sanjay Kumar', designation: 'Roads Engineer', phone: '0612-2688-201', email: 'skumar@pmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 6,
    filedAt: ago(12 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Bridges', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Meena Devi',         email: 'mdevi@pmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner PMC',     email: 'addl.comm@pmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 21,
  },

  // 92. Patna — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-PAT-20260623-1092',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Rajendra Nagar water supply cut for 4 days due to pipe burst. Tanker service irregular — supply only 1 hour in evening.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Rajendra Nagar Main Road, Near Post Office, Patna', ward: 'Ward 52', wardNumber: 52, area: 'Rajendra Nagar', city: 'PATNA', lat: 25.6073, lng: 85.1040 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Pramod Kumar', designation: 'Water Works Engineer', phone: '0612-2688-301', email: 'pkumar@pmc.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(3 * H),
    department: 'Water Supply', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 93. Patna — GARBAGE — FILED
  {
    id: 'NS-PAT-20260627-1093',
    issueType: 'GARBAGE',
    issueDescription: 'Patna City area near Sai temple — garbage not collected for 6 days. Pigs and stray dogs scattering waste on road.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Near Sai Temple, Patna City, Patna', ward: 'Ward 10', wardNumber: 10, area: 'Patna City', city: 'PATNA', lat: 25.5941, lng: 85.1962 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(18 * H), slaHours: 24,
    filedAt: ago(6 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 94. Bhopal — POTHOLE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-BHO-20260618-1094',
    issueType: 'POTHOLE',
    issueDescription: 'DB Mall to ISBT road has axle-busting potholes after monsoon. 3 delivery bikes met with accidents in one week.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'DB Mall Road to ISBT, Bhopal', ward: 'Ward 25', wardNumber: 25, area: 'DB City', city: 'BHOPAL', lat: 23.2320, lng: 77.4345 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Rajesh Soni', designation: 'Roads Supervisor', phone: '0755-2777-401', email: 'rsoni@bmcgov.in' },
    slaDeadline: ago(6 * D), slaHours: 48,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Roads & Bridges', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Savita Bhatnagar', email: 'sbhatnagar@bmcgov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 82, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 31, detail: 'Marked closed in 1h — HIGH severity pothole repair needs 6h+' },
      { flag: 'PATTERN',  points: 28, detail: 'Supervisor: 86% closures without photo in June' },
      { flag: 'REOPEN',   points: 23, detail: 'Same stretch reported twice in 10 days' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 9,
  },

  // 95. Bhopal — WATER_POLLUTION — ESCALATED
  {
    id: 'NS-BHO-20260613-1095',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Upper Lake (Bada Talab) receiving untreated drain discharge near Van Vihar. Water turns green, tourists complaining of smell.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Upper Lake Bund Road, Near Van Vihar National Park, Bhopal', ward: 'Ward 7', wardNumber: 7, area: 'Upper Lake', city: 'BHOPAL', lat: 23.2445, lng: 77.3780 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Vandana Mishra', designation: 'Environment Officer', phone: '0755-2777-501', email: 'vmishra@bmcgov.in' },
    slaDeadline: ago(11 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(3 * D),
    department: 'Environment & Pollution Control', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Asha Rathore',        email: 'arathore@bmcgov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner BMC',      email: 'addl.comm@bmcgov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 96. Surat — GARBAGE — GENUINELY_RESOLVED
  {
    id: 'NS-SUR-20260611-1096',
    issueType: 'GARBAGE',
    issueDescription: 'Heap of garbage near Rander road municipal school not cleared for 5 days. Students avoid school entrance — smell unbearable.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Rander Road Municipal School, Near Katargam, Surat', ward: 'Ward 21', wardNumber: 21, area: 'Katargam', city: 'SURAT' as City, lat: 21.2193, lng: 72.8422 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Nilesh Vaghela', designation: 'Conservancy Supervisor', phone: '261-2420-301', email: 'nvaghela@smcgov.in' },
    slaDeadline: ago(13 * D), slaHours: 24,
    filedAt: ago(15 * D), lastUpdatedAt: ago(12 * D),
    department: 'Solid Waste Management', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 97. Surat — POTHOLE — IN_PROGRESS
  {
    id: 'NS-SUR-20260622-1097',
    issueType: 'POTHOLE',
    issueDescription: 'Ring Road near Varachha area has deep potholes in both lanes. Textile trucks swerving dangerously near Diamond Naka.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ring Road, Near Diamond Naka, Varachha, Surat', ward: 'Ward 40', wardNumber: 40, area: 'Varachha', city: 'SURAT' as City, lat: 21.2202, lng: 72.8693 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Mehul Patel', designation: 'Roads Inspector', phone: '261-2420-401', email: 'mpatel@smcgov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(5 * H),
    department: 'Roads & Buildings', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 98. Nagpur — SEWAGE — ESCALATED
  {
    id: 'NS-NGP-20260616-1098',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage main burst on Sitabuldi main road near Empress Mall. Sewage water entered mall parking — business losses reported.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sitabuldi Main Road, Near Empress Mall, Nagpur', ward: 'Ward 35', wardNumber: 35, area: 'Sitabuldi', city: 'NAGPUR' as City, lat: 21.1458, lng: 79.0882 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Kiran Meshram', designation: 'Sewerage Engineer', phone: '0712-2560-201', email: 'kmeshram@nmc.gov.in' },
    slaDeadline: ago(9 * D), slaHours: 24,
    filedAt: ago(11 * D), lastUpdatedAt: ago(2 * D),
    department: 'Sewerage & Sanitation', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(9 * D), to: 'Ward Officer Surekha Ingle',       email: 'single@nmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'Additional Commissioner NMC',      email: 'addl.comm@nmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 17,
  },

  // 99. Nagpur — GARBAGE — IN_PROGRESS
  {
    id: 'NS-NGP-20260623-1099',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage not collected in Dharampeth area for 5 days. Upscale colony residents complaining — garbage spilling onto main road.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Dharampeth Layout, Near Dharampeth Police Station, Nagpur', ward: 'Ward 23', wardNumber: 23, area: 'Dharampeth', city: 'NAGPUR' as City, lat: 21.1397, lng: 79.0640 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Bonde', designation: 'Conservancy Supervisor', phone: '0712-2560-301', email: 'sbonde@nmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 24,
    filedAt: ago(38 * H), lastUpdatedAt: ago(4 * H),
    department: 'Solid Waste Management', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 100. Nagpur — DRAINAGE — FILED
  {
    id: 'NS-NGP-20260626-1100',
    issueType: 'DRAINAGE',
    issueDescription: 'Storm water drain at Butibori MIDC completely clogged. Factory compound flooded — 200 workers unable to enter plant.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Butibori MIDC, Plot C-12, Butibori, Nagpur', ward: 'Ward 72', wardNumber: 72, area: 'Butibori', city: 'NAGPUR' as City, lat: 20.9982, lng: 79.0008 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(24 * H), slaHours: 48,
    filedAt: ago(24 * H), lastUpdatedAt: ago(24 * H),
    department: 'Storm Water Drainage', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 101. Varanasi — POTHOLE — ESCALATED
  {
    id: 'NS-VNS-20260614-1101',
    issueType: 'POTHOLE',
    issueDescription: 'Rathyatra road near Dashashwamedh ghat has deep potholes damaging religious procession vehicles. High-footfall pilgrim route.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Dashashwamedh Road, Near Ganga Ghat, Varanasi', ward: 'Ward 85', wardNumber: 85, area: 'Dashashwamedh', city: 'VARANASI' as City, lat: 25.3067, lng: 83.0105 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Ramji Prasad', designation: 'Roads Inspector', phone: '0542-2500-201', email: 'rprasad@vnn.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 48,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Bridges', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Pushpa Yadav',        email: 'pyadav@vnn.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner VNN',      email: 'addl.comm@vnn.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 102. Varanasi — GARBAGE — IN_PROGRESS
  {
    id: 'NS-VNS-20260624-1102',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage heap outside Varanasi Cantt railway station not cleared for 4 days. Tourist gateway of city in shambles.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Varanasi Cantt Station Approach Road, Cantt, Varanasi', ward: 'Ward 70', wardNumber: 70, area: 'Cantt', city: 'VARANASI' as City, lat: 25.3208, lng: 82.9711 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Surendra Yadav', designation: 'Sanitary Inspector', phone: '0542-2500-301', email: 'syadav@vnn.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 24,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 103. Kochi — GARBAGE — FILED
  {
    id: 'NS-KOC-20260627-1103',
    issueType: 'GARBAGE',
    issueDescription: 'Waste from fish stalls at Ernakulam market not cleared for 3 days. Rotting fish smell permeating entire block in heat.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ernakulam Fish Market, MG Road Junction, Kochi', ward: 'Ward 39', wardNumber: 39, area: 'Ernakulam Market', city: 'KOCHI' as City, lat: 9.9816, lng: 76.2999 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Solid Waste Management', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 104. Kochi — SEWAGE — IN_PROGRESS
  {
    id: 'NS-KOC-20260622-1104',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line burst near Kaloor stadium road. Raw sewage flowing into drainage canal — backflow into homes during rain.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Kaloor Stadium Road, Near Kaloor Bus Stand, Kochi', ward: 'Ward 48', wardNumber: 48, area: 'Kaloor', city: 'KOCHI' as City, lat: 9.9986, lng: 76.2939 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Biju Mathews', designation: 'Sewerage Engineer', phone: '0484-2335-401', email: 'bmathews@kochicorp.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 48,
    filedAt: ago(44 * H), lastUpdatedAt: ago(3 * H),
    department: 'Sewerage & Drainage', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 105. Kochi — STREET_LIGHT — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-KOC-20260619-1105',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Five street lights non-functional near Marine Drive waterfront promenade. Tourism zone in darkness after 9 PM.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Marine Drive Promenade, Near Boat Jetty, Kochi', ward: 'Ward 25', wardNumber: 25, area: 'Marine Drive', city: 'KOCHI' as City, lat: 9.9640, lng: 76.2896 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Jose Kuriakose', designation: 'Electrical Engineer', phone: '0484-2335-501', email: 'jkuriakose@kochicorp.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 48,
    filedAt: ago(8 * D), lastUpdatedAt: ago(4 * D),
    department: 'Electrical Works', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Councillor Ancy James', email: 'ajames@kochicorp.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 80, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 29, detail: 'Closed in 1h 10 min — 5-light repair needs half a day' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No post-repair photo uploaded by field team' },
      { flag: 'REOPEN',   points: 25, detail: 'Marine Drive stretch: second report in 3 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 7,
  },

  // 106. Coimbatore — POTHOLE — IN_PROGRESS
  {
    id: 'NS-CBE-20260623-1106',
    issueType: 'POTHOLE',
    issueDescription: 'Race Course Road near Coimbatore Civil Aerodrome has multiple deep potholes. Airport taxi drivers threatening to go on strike.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Race Course Road, Near Civil Aerodrome, Coimbatore', ward: 'Ward 18', wardNumber: 18, area: 'Race Course', city: 'COIMBATORE' as City, lat: 11.0305, lng: 76.9559 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Palaniswami K.', designation: 'Roads Inspector', phone: '0422-2394-401', email: 'kpalani@ccmc.gov.in' },
    slaDeadline: ahead(14 * H), slaHours: 48,
    filedAt: ago(34 * H), lastUpdatedAt: ago(6 * H),
    department: 'Roads & Bridges', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 107. Coimbatore — WATER_SUPPLY — ESCALATED
  {
    id: 'NS-CBE-20260614-1107',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'TWAD water supply disrupted 8 days in RS Puram main road apartments. 500+ flats in distress; borewells also depleted.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'RS Puram Main Road, Near Crosscut Road Junction, Coimbatore', ward: 'Ward 12', wardNumber: 12, area: 'RS Puram', city: 'COIMBATORE' as City, lat: 11.0076, lng: 76.9517 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Thangavel R.', designation: 'Water Works Engineer', phone: '0422-2394-501', email: 'rthangavel@ccmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(14 * D), lastUpdatedAt: ago(3 * D),
    department: 'Water Supply', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Councillor Selvaraj M.',      email: 'mselvaraj@ccmc.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner CCMC',     email: 'addl.comm@ccmc.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 19,
  },

  // 108. Visakhapatnam — POTHOLE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-VIZ-20260618-1108',
    issueType: 'POTHOLE',
    issueDescription: 'Dwaraka Nagar main road riddled with potholes. Rainy season made 8 craters axle-deep — two scooty accidents this week.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Dwaraka Nagar Main Road, Near RTC Complex, Visakhapatnam', ward: 'Ward 22', wardNumber: 22, area: 'Dwaraka Nagar', city: 'VISAKHAPATNAM' as City, lat: 17.7263, lng: 83.3188 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Murali Krishna', designation: 'Roads Inspector', phone: '0891-2564-401', email: 'mkrishna@gvmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 48,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Roads & Bridges', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Councillor Satyanarayana B.', email: 'bsatya@gvmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 79, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 30, detail: 'Closed in 50 min — 8 pothole repairs cannot be done in that time' },
      { flag: 'REOPEN',   points: 25, detail: 'Same stretch reported last week — no repair observed' },
      { flag: 'NO_PHOTO', points: 24, detail: 'No field work documentation uploaded' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 8,
  },

  // 109. Visakhapatnam — GARBAGE — FILED
  {
    id: 'NS-VIZ-20260627-1109',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage collection skipped in MVP Colony Sector 9 for 5 days. Residents piling waste in street — monkey menace increasing.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'MVP Colony Sector 9, Near MVP Market, Visakhapatnam', ward: 'Ward 31', wardNumber: 31, area: 'MVP Colony', city: 'VISAKHAPATNAM' as City, lat: 17.7430, lng: 83.2984 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(18 * H), slaHours: 24,
    filedAt: ago(6 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 110. Visakhapatnam — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-VIZ-20260622-1110',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Bheemunipatnam municipal water supply contaminated with saltwater intrusion. Coastal area residents drinking salty water.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Main Road, Bheemunipatnam, Visakhapatnam', ward: 'Ward 68', wardNumber: 68, area: 'Bheemunipatnam', city: 'VISAKHAPATNAM' as City, lat: 17.8904, lng: 83.4517 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Babu', designation: 'Water Works Engineer', phone: '0891-2564-501', email: 'sbabu@gvmc.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(5 * H),
    department: 'Water Supply', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 11,
  },

  // 111. Chandigarh — GARBAGE — ESCALATED
  {
    id: 'NS-CHD-20260616-1111',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage collection van not coming to Sector 28 residential area for 6 days. Welfare association has given 48h ultimatum.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 28 B, Near Sector 28 Market, Chandigarh', ward: 'Ward 28', wardNumber: 28, area: 'Sector 28', city: 'CHANDIGARH' as City, lat: 30.7350, lng: 76.7881 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Balwinder Kaur', designation: 'Sanitary Inspector', phone: '0172-2749-201', email: 'bkaur@mc-chd.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 24,
    filedAt: ago(7 * D), lastUpdatedAt: ago(2 * D),
    department: 'Solid Waste Management', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(4 * D), to: 'Ward Councillor Harjinder Singh',  email: 'hsingh@mc-chd.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(1 * D), to: 'Commissioner MC Chandigarh',       email: 'commissioner@mc-chd.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 112. Chandigarh — POTHOLE — IN_PROGRESS
  {
    id: 'NS-CHD-20260623-1112',
    issueType: 'POTHOLE',
    issueDescription: 'Sector 22 B main road has multiple potholes after pipe-laying work. Trench not properly restored — vehicles damaged.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Sector 22 B, Near Sector 22 Market, Chandigarh', ward: 'Ward 22', wardNumber: 22, area: 'Sector 22', city: 'CHANDIGARH' as City, lat: 30.7405, lng: 76.7734 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Narinder Pal', designation: 'Roads Inspector', phone: '0172-2749-301', email: 'npal@mc-chd.gov.in' },
    slaDeadline: ahead(18 * H), slaHours: 72,
    filedAt: ago(54 * H), lastUpdatedAt: ago(9 * H),
    department: 'Roads & Buildings', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 113. Chandigarh — SEWAGE — GENUINELY_RESOLVED
  {
    id: 'NS-CHD-20260610-1113',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line backing up in Sector 44 residential houses during heavy rain. 12 households had sewage enter their bathrooms.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 44 C, Near Rose Garden, Chandigarh', ward: 'Ward 44', wardNumber: 44, area: 'Sector 44', city: 'CHANDIGARH' as City, lat: 30.7293, lng: 76.7785 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Sukhwinder Singh', designation: 'Sewerage Engineer', phone: '0172-2749-401', email: 'ssingh@mc-chd.gov.in' },
    slaDeadline: ago(14 * D), slaHours: 48,
    filedAt: ago(17 * D), lastUpdatedAt: ago(13 * D),
    department: 'Sewerage & Drainage', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 114. Indore — SEWAGE — ESCALATED
  {
    id: 'NS-IDR-20260615-1114',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage overflow at Rajwada area affecting the historic market. Tourist footfall halved — traders in financial distress.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Rajwada Chowk, Old Indore, Indore', ward: 'Ward 8', wardNumber: 8, area: 'Rajwada', city: 'INDORE' as City, lat: 22.7196, lng: 75.8577 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Bharat Malviya', designation: 'Sewerage Engineer', phone: '0731-2520-301', email: 'bmalviya@imcgov.in' },
    slaDeadline: ago(10 * D), slaHours: 24,
    filedAt: ago(12 * D), lastUpdatedAt: ago(2 * D),
    department: 'Sewerage & Sanitation', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Kavita Parihar',      email: 'kparihar@imcgov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner IMC',      email: 'addl.comm@imcgov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 22,
  },

  // 115. Indore — GARBAGE — FILED
  {
    id: 'NS-IDR-20260627-1115',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage vehicle skipped Scheme 54 colony for 5 days. Even in Indore — cleanest city — this sector is in mess.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Scheme 54, PU4 Area, Near Rajendra Nagar, Indore', ward: 'Ward 64', wardNumber: 64, area: 'Scheme 54', city: 'INDORE' as City, lat: 22.7380, lng: 75.8789 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(16 * H), slaHours: 24,
    filedAt: ago(8 * H), lastUpdatedAt: ago(8 * H),
    department: 'Solid Waste Management', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 116. Indore — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-IDR-20260623-1116',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Narmada pipeline damaged near MR-10 road. Supply cut to 4 wards of Indore for 3 days. 12,000 people affected.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'MR-10 Road, Near Nipania Bypass, Indore', ward: 'Ward 78', wardNumber: 78, area: 'Nipania', city: 'INDORE' as City, lat: 22.7676, lng: 75.9258 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Mahendra Yadav', designation: 'Water Works Engineer', phone: '0731-2520-401', email: 'myadav@imcgov.in' },
    slaDeadline: ahead(5 * H), slaHours: 24,
    filedAt: ago(43 * H), lastUpdatedAt: ago(3 * H),
    department: 'Water Supply', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 26,
  },

  // 117. Agra — POTHOLE — IN_PROGRESS
  {
    id: 'NS-AGR-20260623-1117',
    issueType: 'POTHOLE',
    issueDescription: 'Taj Mahal Eastern Gate approach road has severe potholes. Foreign tourists complaining loudly — national image damage.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Eastern Gate Approach Road, Taj Mahal, Agra', ward: 'Ward 80', wardNumber: 80, area: 'Taj East', city: 'AGRA' as City, lat: 27.1751, lng: 78.0421 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Arun Chauhan', designation: 'Roads Engineer', phone: '0562-2464-201', email: 'achauhan@amcagr.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Roads & Bridges', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 118. Agra — SEWAGE — ESCALATED
  {
    id: 'NS-AGR-20260613-1118',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage draining into Yamuna river at Agra Ghat openly. NGT order to stop discharge being flouted. River turning black.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Agra Ghat, Near Dussehra Ghat, Yamuna River Bank, Agra', ward: 'Ward 75', wardNumber: 75, area: 'Agra Ghat', city: 'AGRA' as City, lat: 27.1740, lng: 78.0215 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Dinesh Pratap', designation: 'Environment Officer', phone: '0562-2464-301', email: 'dpratap@amcagr.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 24,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Sewerage', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(12 * D), to: 'Ward Officer Santosh Saxena',         email: 'ssaxena@amcagr.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(7 * D),  to: 'Municipal Commissioner Agra',         email: 'commissioner@amcagr.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 70, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 35, detail: 'Yamuna discharge complaint: fifth time in 6 months' },
      { flag: 'DELAY',  points: 35, detail: 'NGT-notified discharge unaddressed 14 days' },
    ], recommendation: 'RTI' },
    communityClusterSize: 25,
  },

  // 119. Agra — STREET_LIGHT — GENUINELY_RESOLVED
  {
    id: 'NS-AGR-20260609-1119',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Sadar Bazar road not working for 9 days. Military cantonment area entrance is pitch dark.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sadar Bazar Road, Near Clarke Hotel, Agra Cantonment', ward: 'Ward 60', wardNumber: 60, area: 'Sadar Bazar', city: 'AGRA' as City, lat: 27.1979, lng: 78.0123 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Rajesh Kumar', designation: 'Electrical Supervisor', phone: '0562-2464-401', email: 'rkumar@amcagr.gov.in' },
    slaDeadline: ago(15 * D), slaHours: 48,
    filedAt: ago(17 * D), lastUpdatedAt: ago(14 * D),
    department: 'Electrical Works', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 120. Bhubaneswar — POTHOLE — FILED
  {
    id: 'NS-BHU-20260627-1120',
    issueType: 'POTHOLE',
    issueDescription: 'Jaydev Vihar main road has series of potholes near KIIT square. Software company employees reporting vehicle damage daily.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Jaydev Vihar Road, Near KIIT Square, Bhubaneswar', ward: 'Ward 46', wardNumber: 46, area: 'Jaydev Vihar', city: 'BHUBANESWAR' as City, lat: 20.3549, lng: 85.8189 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Roads & Bridges', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 121. Bhubaneswar — GARBAGE — ESCALATED
  {
    id: 'NS-BHU-20260615-1121',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage accumulated near Patia residential colony for 7 days. Bhitarkanika-style open dumping happening at city edge.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Patia Square, Near ITER College, Bhubaneswar', ward: 'Ward 54', wardNumber: 54, area: 'Patia', city: 'BHUBANESWAR' as City, lat: 20.3606, lng: 85.8304 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sarat Pradhan', designation: 'Sanitary Inspector', phone: '0674-2536-101', email: 'spradhan@bmc-bhu.gov.in' },
    slaDeadline: ago(8 * D), slaHours: 24,
    filedAt: ago(12 * D), lastUpdatedAt: ago(4 * D),
    department: 'Solid Waste Management', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(8 * D), to: 'Ward Officer Smruti Pattnaik',     email: 'spattnaik@bmc-bhu.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(3 * D), to: 'Additional Commissioner BMC',      email: 'addl.comm@bmc-bhu.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 12,
  },

  // 122. Bhubaneswar — SEWAGE — IN_PROGRESS
  {
    id: 'NS-BHU-20260622-1122',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage drain clogged near Unit-9 market in Bhubaneswar. Entire market area inundated with sewage water after rain.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Unit-9 Market Road, Bhubaneswar', ward: 'Ward 28', wardNumber: 28, area: 'Unit-9', city: 'BHUBANESWAR' as City, lat: 20.2788, lng: 85.8384 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Niranjan Sahoo', designation: 'Drainage Engineer', phone: '0674-2536-201', email: 'nsahoo@bmc-bhu.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Sewerage & Drainage', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 123. Bhubaneswar — WATER_SUPPLY — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-BHU-20260619-1123',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'PHEO water supply absent in Rasulgarh housing board colony for 5 days. 600 families dependent on groundwater which is contaminated.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Rasulgarh Housing Board Colony, Bhubaneswar', ward: 'Ward 17', wardNumber: 17, area: 'Rasulgarh', city: 'BHUBANESWAR' as City, lat: 20.2783, lng: 85.7998 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Bijaya Mishra', designation: 'Water Works Engineer', phone: '0674-2536-301', email: 'bmishra@bmc-bhu.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 24,
    filedAt: ago(6 * D), lastUpdatedAt: ago(3 * D),
    department: 'Water Supply', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [{ level: 'WARD_OFFICER', date: ago(3 * D), to: 'Ward Officer Pratima Nayak', email: 'pnayak@bmc-bhu.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 77, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 29, detail: 'Closed in 1h 20 min — pipeline repair needs half day minimum' },
      { flag: 'NO_PHOTO', points: 25, detail: 'No repair photo or work completion report' },
      { flag: 'REOPEN',   points: 23, detail: 'Rasulgarh colony supply failure: second complaint in 2 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 16,
  },

  // 124. Guwahati — POTHOLE — ESCALATED
  {
    id: 'NS-GWH-20260615-1124',
    issueType: 'POTHOLE',
    issueDescription: 'GS Road near Dispur Last Gate has 10+ potholes making it impassable for heavy vehicles. Government office traffic severely hit.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'GS Road, Dispur Last Gate, Near GMC Office, Guwahati', ward: 'Ward 22', wardNumber: 22, area: 'Dispur', city: 'GUWAHATI' as City, lat: 26.1445, lng: 91.7898 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Pranab Deka', designation: 'Roads Engineer', phone: '0361-2736-101', email: 'pdeka@gmc.gov.in' },
    slaDeadline: ago(9 * D), slaHours: 48,
    filedAt: ago(12 * D), lastUpdatedAt: ago(3 * D),
    department: 'Roads & Bridges', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(9 * D), to: 'Ward Commissioner Reena Borah',    email: 'rborah@gmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'Additional Commissioner GMC',      email: 'addl.comm@gmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 18,
  },

  // 125. Guwahati — FLOODING — DRAINAGE — FILED
  {
    id: 'NS-GWH-20260627-1125',
    issueType: 'DRAINAGE',
    issueDescription: 'Mora Bharalu river bank drain overflowing into Zoo Road residential area. Annual flooding complaint — no permanent fix in sight.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Zoo Road, Near Guwahati Zoo, Guwahati', ward: 'Ward 12', wardNumber: 12, area: 'Zoo Road', city: 'GUWAHATI' as City, lat: 26.1763, lng: 91.7630 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(30 * H), slaHours: 48,
    filedAt: ago(18 * H), lastUpdatedAt: ago(18 * H),
    department: 'Drainage & Flood Control', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 126. Guwahati — GARBAGE — IN_PROGRESS
  {
    id: 'NS-GWH-20260623-1126',
    issueType: 'GARBAGE',
    issueDescription: 'Waste from Fancy Bazar commercial market dumped near Bharalu riverbank. Evening tide floating garbage downstream.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Fancy Bazar, Near Bharalu River Bridge, Guwahati', ward: 'Ward 8', wardNumber: 8, area: 'Fancy Bazar', city: 'GUWAHATI' as City, lat: 26.1837, lng: 91.7574 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Hemanta Kalita', designation: 'Conservancy Inspector', phone: '0361-2736-201', email: 'hkalita@gmc.gov.in' },
    slaDeadline: ahead(12 * H), slaHours: 24,
    filedAt: ago(36 * H), lastUpdatedAt: ago(7 * H),
    department: 'Solid Waste Management', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 127. Guwahati — WATER_POLLUTION — ESCALATED
  {
    id: 'NS-GWH-20260613-1127',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Industrial effluents from Amingaon industrial area entering Brahmaputra tributary. Fishermen reporting massive fish kill.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Amingaon Industrial Area, NH-27, Near Brahmaputra Bridge, Guwahati', ward: 'Ward 3', wardNumber: 3, area: 'Amingaon', city: 'GUWAHATI' as City, lat: 26.1913, lng: 91.6524 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Dipak Sarma', designation: 'Environment Officer', phone: '0361-2736-301', email: 'dsarma@gmc.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Commissioner Gitika Das',      email: 'gdas@gmc.gov.in',     status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner GMC',       email: 'addl.comm@gmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 23,
  },

  // 128. Thiruvananthapuram — POTHOLE — FILED
  {
    id: 'NS-TRV-20260627-1128',
    issueType: 'POTHOLE',
    issueDescription: 'Pattom Palace Road near Secretariat back gate has potholes inconveniencing government employees. Even VVIP vehicles affected.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Pattom Palace Road, Near Secretariat Back Gate, Thiruvananthapuram', ward: 'Ward 28', wardNumber: 28, area: 'Pattom', city: 'THIRUVANANTHAPURAM' as City, lat: 8.5116, lng: 76.9518 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Roads & Bridges', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 129. Thiruvananthapuram — GARBAGE — ESCALATED
  {
    id: 'NS-TRV-20260614-1129',
    issueType: 'GARBAGE',
    issueDescription: 'Waste from Chalai market not cleared for 7 days. Heritage market area overflowing — stray animals scattering garbage across lanes.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Chalai Market, Near East Fort, Thiruvananthapuram', ward: 'Ward 15', wardNumber: 15, area: 'Chalai', city: 'THIRUVANANTHAPURAM' as City, lat: 8.4894, lng: 76.9526 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Shyam Lal', designation: 'Conservancy Supervisor', phone: '0471-2327-101', email: 'slal@tvmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Solid Waste Management', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Councillor Bindu Nair',        email: 'bnair@tvmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Corporation Secretary TVMC',        email: 'secretary@tvmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 17,
  },

  // 130. Thiruvananthapuram — SEWAGE — IN_PROGRESS
  {
    id: 'NS-TRV-20260622-1130',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage seeping into Kowdiar residential area from broken pipeline. Tree roots have cracked the old British-era pipes.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Kowdiar Junction, Near Kowdiar Palace, Thiruvananthapuram', ward: 'Ward 32', wardNumber: 32, area: 'Kowdiar', city: 'THIRUVANANTHAPURAM' as City, lat: 8.5126, lng: 76.9375 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Babu Krishnan', designation: 'Sewerage Engineer', phone: '0471-2327-201', email: 'bkrishnan@tvmc.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(6 * H),
    department: 'Sewerage & Drainage', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 131. Thiruvananthapuram — WATER_SUPPLY — GENUINELY_RESOLVED
  {
    id: 'NS-TRV-20260609-1131',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'KWA water supply absent in Vattiyoorkavu colony for 6 days due to main burst. Tankers deployed but supply irregular.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Vattiyoorkavu Road, Near Manacaud Junction, Thiruvananthapuram', ward: 'Ward 54', wardNumber: 54, area: 'Vattiyoorkavu', city: 'THIRUVANANTHAPURAM' as City, lat: 8.5441, lng: 76.9415 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Rajeev Nair', designation: 'Water Works Engineer', phone: '0471-2327-301', email: 'rnair@tvmc.gov.in' },
    slaDeadline: ago(14 * D), slaHours: 24,
    filedAt: ago(16 * D), lastUpdatedAt: ago(12 * D),
    department: 'Water Supply', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 11,
  },

  // 132. Ranchi — POTHOLE — FILED
  {
    id: 'NS-RNC-20260627-1132',
    issueType: 'POTHOLE',
    issueDescription: 'HB Road near Morabadi ground has severe potholes after JBVNL cable work. No road restoration done after trenching.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'HB Road, Near Morabadi Ground, Ranchi', ward: 'Ward 18', wardNumber: 18, area: 'Morabadi', city: 'RANCHI' as City, lat: 23.3580, lng: 85.3096 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(40 * H), slaHours: 48,
    filedAt: ago(8 * H), lastUpdatedAt: ago(8 * H),
    department: 'Roads & Bridges', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 133. Ranchi — GARBAGE — ESCALATED
  {
    id: 'NS-RNC-20260614-1133',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage burning in Argora Chowk slum area — daily occurrence for 3 weeks. Children developing respiratory issues.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Argora Chowk, Near Church Complex, Ranchi', ward: 'Ward 25', wardNumber: 25, area: 'Argora', city: 'RANCHI' as City, lat: 23.3505, lng: 85.2930 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Suresh Minz', designation: 'Sanitary Inspector', phone: '0651-2208-101', email: 'sminz@rmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(3 * D),
    department: 'Solid Waste Management', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Officer Anita Oraon',          email: 'aoraon@rmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D),  to: 'Additional Commissioner RMC',       email: 'addl.comm@rmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 134. Ranchi — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-RNC-20260622-1134',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'JUIDCO pipeline burst near Kanke Dam approach road. 3 wards without supply for 4 days — Jharkhand summer crisis.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kanke Road, Near Kanke Dam, Ranchi', ward: 'Ward 6', wardNumber: 6, area: 'Kanke', city: 'RANCHI' as City, lat: 23.4181, lng: 85.3147 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Ramesh Sahu', designation: 'Water Works Engineer', phone: '0651-2208-201', email: 'rsahu@rmc.gov.in' },
    slaDeadline: ahead(5 * H), slaHours: 24,
    filedAt: ago(43 * H), lastUpdatedAt: ago(3 * H),
    department: 'Water Supply', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 135. Amritsar — POTHOLE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-AMR-20260618-1135',
    issueType: 'POTHOLE',
    issueDescription: 'Lawrence Road near Hall Bazaar has potholes disrupting traffic to Golden Temple. Tourist buses struggling to navigate.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Lawrence Road, Near Hall Bazaar, Amritsar', ward: 'Ward 30', wardNumber: 30, area: 'Hall Bazaar', city: 'AMRITSAR' as City, lat: 31.6340, lng: 74.8723 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Gurmail Singh', designation: 'Roads Inspector', phone: '0183-2564-101', email: 'gsingh@amc-amr.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 48,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Roads & Bridges', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Councillor Manjit Kaur', email: 'mkaur@amc-amr.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 78, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 28, detail: 'Closed in 50 min — HIGH severity road repair takes all day' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No repair photo or tarmac work proof' },
      { flag: 'REOPEN',   points: 24, detail: 'Lawrence Road pothole: second complaint in 2 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 9,
  },

  // 136. Amritsar — GARBAGE — ESCALATED
  {
    id: 'NS-AMR-20260616-1136',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage not collected in Ranjit Avenue B block for 8 days. Upscale residential area stinking — multiple RWA letters ignored.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'B Block, Ranjit Avenue, Amritsar', ward: 'Ward 52', wardNumber: 52, area: 'Ranjit Avenue', city: 'AMRITSAR' as City, lat: 31.6518, lng: 74.8397 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Harpreet Kaur', designation: 'Sanitary Supervisor', phone: '0183-2564-201', email: 'hkaur@amc-amr.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(2 * D),
    department: 'Solid Waste Management', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(6 * D), to: 'Ward Councillor Paramjit Singh',    email: 'psingh@amc-amr.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(2 * D), to: 'Additional Commissioner AMC',       email: 'addl.comm@amc-amr.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 16,
  },

  // 137. Amritsar — SEWAGE — IN_PROGRESS
  {
    id: 'NS-AMR-20260624-1137',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage drain overflowing at Sultanwind Road near Guru Nanak Dev Hospital. Hospital visitors wading through sewage.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sultanwind Road, Near GNDH, Amritsar', ward: 'Ward 20', wardNumber: 20, area: 'Sultanwind', city: 'AMRITSAR' as City, lat: 31.6220, lng: 74.8810 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Davinder Singh', designation: 'Sewerage Engineer', phone: '0183-2564-301', email: 'dsingh@amc-amr.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Sewerage & Sanitation', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 138. Ludhiana — POTHOLE — ESCALATED
  {
    id: 'NS-LDH-20260614-1138',
    issueType: 'POTHOLE',
    issueDescription: 'Ferozepur Road near Samrala Chowk — industrial hub artery full of potholes. Goods vehicles causing accidents daily.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Ferozepur Road, Near Samrala Chowk, Ludhiana', ward: 'Ward 45', wardNumber: 45, area: 'Samrala Chowk', city: 'LUDHIANA' as City, lat: 30.8920, lng: 75.7969 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sukhbir Sandhu', designation: 'Roads Engineer', phone: '0161-2401-101', email: 'ssandhu@lmc-ldh.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 6,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Bridges', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Councillor Amarjit Gill',     email: 'agill@lmc-ldh.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner LMC',      email: 'addl.comm@lmc-ldh.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 24,
  },

  // 139. Ludhiana — GARBAGE — FILED
  {
    id: 'NS-LDH-20260627-1139',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage not collected in Sarabha Nagar for 5 days. Textile waste mixed with household garbage — fire hazard in summer.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sarabha Nagar Main Road, Near BRS Nagar, Ludhiana', ward: 'Ward 62', wardNumber: 62, area: 'Sarabha Nagar', city: 'LUDHIANA' as City, lat: 30.8830, lng: 75.8145 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(18 * H), slaHours: 24,
    filedAt: ago(6 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 140. Ludhiana — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-LDH-20260619-1140',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage mixing with Buddha Nullah near Model Town. Nullah already heavily polluted — additional discharge worsening crisis.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Buddha Nullah, Near Model Town Park, Ludhiana', ward: 'Ward 55', wardNumber: 55, area: 'Model Town', city: 'LUDHIANA' as City, lat: 30.9087, lng: 75.8192 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Jasvir Sidhu', designation: 'Environment Officer', phone: '0161-2401-201', email: 'jsidhu@lmc-ldh.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Sewerage & Environment', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Councillor Rupinder Kaur', email: 'rkaur@lmc-ldh.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 85, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 33, detail: 'Closed in 45 min — sewer tap-off requires excavation and 8h work' },
      { flag: 'PATTERN',  points: 28, detail: 'Officer: 87% rapid closures on Buddha Nullah complaints this year' },
      { flag: 'REOPEN',   points: 24, detail: 'Same discharge point reported 3 times in 2 months' },
    ], recommendation: 'RTI' },
    communityClusterSize: 21,
  },

  // 141. Mumbai — BROKEN_FOOTPATH — ASSIGNED
  {
    id: 'NS-MUM-20260625-1141',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on Carter Road Bandra dug up by BWSSB and left open for 3 weeks. Popular walking promenade unusable.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Carter Road Promenade, Bandra West, Mumbai', ward: 'Ward 69', wardNumber: 69, area: 'Bandra West', city: 'MUMBAI', lat: 19.0643, lng: 72.8224 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Dnyaneshwar Pawar', designation: 'Civil Works Inspector', phone: '022-2659-4422', email: 'dpawar@mcgm.gov.in' },
    slaDeadline: ahead(24 * H), slaHours: 72,
    filedAt: ago(48 * H), lastUpdatedAt: ago(10 * H),
    department: 'Roads & Traffic', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 142. Delhi — TREE_FALLEN — IN_PROGRESS
  {
    id: 'NS-DEL-20260626-1142',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Large neem tree uprooted on Lodhi Road after storm last night. Car crushed under branches — owner hospitalised.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Lodhi Road, Near India International Centre, New Delhi', ward: 'Ward 95', wardNumber: 95, area: 'Lodhi Colony', city: 'DELHI', lat: 28.5926, lng: 77.2195 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Narender Sharma', designation: 'Horticulture Supervisor', phone: '011-2694-7733', email: 'nsharma@mcd.gov.in' },
    slaDeadline: ahead(2 * H), slaHours: 6,
    filedAt: ago(4 * H), lastUpdatedAt: ago(1 * H),
    department: 'Parks & Horticulture', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 143. Bengaluru — WATER_POLLUTION — RTI_FILED
  {
    id: 'NS-BLR-20260604-1143',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Bellandur lake receiving raw sewage from multiple points. Lake fires have become frequent. NGT order unenforced for 6 months.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Bellandur Lake, HAL Airport Road, Bengaluru', ward: 'Ward 68', wardNumber: 68, area: 'Bellandur', city: 'BENGALURU', lat: 12.9248, lng: 77.6680 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Sudhir Rao', designation: 'Lake Protection Officer', phone: '080-2297-9988', email: 'srao@bbmp.gov.in' },
    slaDeadline: ago(20 * D), slaHours: 24,
    filedAt: ago(23 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Lakes', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(20 * D), to: 'Ward Officer Chandrakala B.',       email: 'bchandrakala@bbmp.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(14 * D), to: 'DC East Zone BBMP',                  email: 'dc.east@bbmp.gov.in',      status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(7 * D),  to: "Commissioner BBMP",                  email: 'commissioner@bbmp.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 82, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 42, detail: 'Bellandur lake: 12th RTI in one year' },
      { flag: 'DELAY',  points: 40, detail: 'NGT-ordered remediation unexecuted — 6 months' },
    ], recommendation: 'RTI' },
    communityClusterSize: 29,
  },

  // 144. Chennai — BURNING_WASTE — ESCALATED
  {
    id: 'NS-CHN-20260613-1144',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Waste burning near Pallikaranai marshland periphery. Protected wetland being encroached and ecosystem damaged by smoke.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Pallikaranai Marshland Periphery, Old Mahabalipuram Road, Chennai', ward: 'Ward 188', wardNumber: 188, area: 'Pallikaranai', city: 'CHENNAI', lat: 12.9387, lng: 80.2133 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Anandhi T.', designation: 'Environment Officer', phone: '044-2538-7766', email: 'tanandhi@gcc.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Councillor Selvi R.',           email: 'rselvi@gcc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Commissioner Office GCC',            email: 'commissioner@gcc.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 18,
  },

  // 145. Hyderabad — MANHOLE — GENUINELY_RESOLVED
  {
    id: 'NS-HYD-20260609-1145',
    issueType: 'MANHOLE',
    issueDescription: 'Open manhole on Nampally road near Hyderabad central station caused injury to tourist. Resolved after media coverage.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Nampally Station Road, Near Old MLA Quarters, Hyderabad', ward: 'Ward 58', wardNumber: 58, area: 'Nampally', city: 'HYDERABAD', lat: 17.3859, lng: 78.4659 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Koteswara Rao', designation: 'Underground Drainage Supervisor', phone: '040-2312-8877', email: 'krao@ghmc.gov.in' },
    slaDeadline: ago(15 * D), slaHours: 6,
    filedAt: ago(17 * D), lastUpdatedAt: ago(14 * D),
    department: 'Underground Drainage', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 146. Pune — STREET_LIGHT — IN_PROGRESS
  {
    id: 'NS-PUN-20260622-1146',
    issueType: 'STREET_LIGHT',
    issueDescription: '10 street lights non-functional on Baner main road. Night-time tech corridor commuters facing safety risk.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Baner Main Road, Near Balewadi High Street, Pune', ward: 'Ward 8', wardNumber: 8, area: 'Baner', city: 'PUNE' as City, lat: 18.5590, lng: 73.7868 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Pravin Kale', designation: 'Electrical Engineer', phone: '020-2612-9988', email: 'pkale@pmc.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 48,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Electrical Works', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 147. Ahmedabad — DRAINAGE — ESCALATED
  {
    id: 'NS-AMD-20260613-1147',
    issueType: 'DRAINAGE',
    issueDescription: 'Kankaria lake overflow drain blocked. Lake level rising dangerously — surrounding residential areas at flood risk.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kankaria Lake Road, Near Kankaria Zoo, Ahmedabad', ward: 'Ward 35', wardNumber: 35, area: 'Kankaria', city: 'AHMEDABAD', lat: 22.9944, lng: 72.5950 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Dilipbhai Chaudhari', designation: 'Drainage Engineer', phone: '079-2324-6655', email: 'dchaudhari@amcgov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Storm Water Drainage', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Varsha Amin',          email: 'vamin@amcgov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner AMC',       email: 'addl.comm@amcgov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 148. Jaipur — DEAD_ANIMAL — RESOLVED_CLAIMED
  {
    id: 'NS-JAI-20260621-1148',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead camel carcass near Chandpole Gate heritage road. Tourist heritage walk route blocked by stench and flies.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Chandpole Gate Road, Walled City, Jaipur', ward: 'Ward 2', wardNumber: 2, area: 'Chandpole', city: 'JAIPUR', lat: 26.9224, lng: 75.8186 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Bhajan Lal Saini', designation: 'Sanitary Inspector', phone: '0141-2744-606', email: 'blsaini@jmc.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 12,
    filedAt: ago(6 * D), lastUpdatedAt: ago(12 * H),
    department: 'Public Health & Sanitation', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 149. Lucknow — ILLEGAL_CONSTRUCTION — FILED
  {
    id: 'NS-LKW-20260627-1149',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Commercial complex being constructed on green belt land near Indira Canal in Lucknow without permission.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Indira Canal Road, Near Sector B Market, Lucknow', ward: 'Ward 108', wardNumber: 108, area: 'Sector B', city: 'LUCKNOW', lat: 26.8799, lng: 80.9734 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Town Planning', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 150. Patna — STREET_LIGHT — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-PAT-20260618-1150',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Frazer Road near Maurya Hotel non-functional for 10 days. Commercial district unsafe after 9 PM.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Frazer Road, Near Maurya Hotel, Patna', ward: 'Ward 42', wardNumber: 42, area: 'Frazer Road', city: 'PATNA', lat: 25.6122, lng: 85.1418 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Vijay Shankar', designation: 'Electrical Engineer', phone: '0612-2688-401', email: 'vshankar@pmc.gov.in' },
    slaDeadline: ago(7 * D), slaHours: 48,
    filedAt: ago(10 * D), lastUpdatedAt: ago(6 * D),
    department: 'Electrical Works', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [{ level: 'WARD_OFFICER', date: ago(6 * D), to: 'Ward Officer Sunita Devi', email: 'sdevi@pmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 76, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 28, detail: 'Closure logged in 35 min — 10-light repair needs full crew half-day' },
      { flag: 'PATTERN',  points: 26, detail: 'Engineer: 84% rapid closures on electrical complaints this month' },
      { flag: 'NO_PHOTO', points: 22, detail: 'No lamp replacement records or work order' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 10,
  },

  // 151. Bhopal — DRAINAGE — IN_PROGRESS
  {
    id: 'NS-BHO-20260622-1151',
    issueType: 'DRAINAGE',
    issueDescription: 'Nullah near Arera Colony E-7 completely blocked with plastic waste. Colony floods knee-deep after 30 min of rain.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'E-7 Arera Colony, Near Shahpura Lake, Bhopal', ward: 'Ward 32', wardNumber: 32, area: 'Arera Colony', city: 'BHOPAL', lat: 23.2109, lng: 77.4541 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Manoj Patel', designation: 'Drainage Engineer', phone: '0755-2777-601', email: 'mpatel@bmcgov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Storm Water Drainage', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 152. Surat — WATER_SUPPLY — ESCALATED
  {
    id: 'NS-SUR-20260613-1152',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply contaminated with rust and muddy water in Adajan Patiya area. 800 flats affected — kidney stone cases rising.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Adajan Patiya, Near Adajan Shivaji Statue, Surat', ward: 'Ward 8', wardNumber: 8, area: 'Adajan', city: 'SURAT' as City, lat: 21.1940, lng: 72.7920 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rajesh Nakrani', designation: 'Water Quality Engineer', phone: '261-2420-501', email: 'rnakrani@smcgov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(14 * D), lastUpdatedAt: ago(3 * D),
    department: 'Water Supply', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Hiral Shah',           email: 'hshah@smcgov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner SMC',       email: 'addl.comm@smcgov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 19,
  },

  // 153. Nagpur — WATER_SUPPLY — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-NGP-20260619-1153',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Orange City Water supply absent in CIDCO Layout Nagpur for 6 days. IT companies in area buying tanker water daily.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'CIDCO Layout, Near Wadi, Nagpur', ward: 'Ward 48', wardNumber: 48, area: 'CIDCO', city: 'NAGPUR' as City, lat: 21.1811, lng: 79.1296 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Anand Raut', designation: 'Water Works Engineer', phone: '0712-2560-401', email: 'araut@nmc.gov.in' },
    slaDeadline: ago(5 * D), slaHours: 24,
    filedAt: ago(7 * D), lastUpdatedAt: ago(4 * D),
    department: 'Water Supply', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Officer Rekha Bhoyar', email: 'rbhoyar@nmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 81, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 31, detail: 'Closed 45 min after assignment — 6-day outage needs pipeline inspection' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No repair work order or post-fix photo uploaded' },
      { flag: 'REOPEN',   points: 24, detail: 'CIDCO Layout supply failure: third complaint in one month' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 12,
  },

  // 154. Varanasi — DRAINAGE — ESCALATED
  {
    id: 'NS-VNS-20260614-1154',
    issueType: 'DRAINAGE',
    issueDescription: 'Open drain near Sigra colony completely choked. Waterlogging after any rain makes it impossible to access Varanasi Junction.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sigra Main Road, Near Sigra Police Station, Varanasi', ward: 'Ward 68', wardNumber: 68, area: 'Sigra', city: 'VARANASI' as City, lat: 25.3197, lng: 82.9836 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rajendra Gupta', designation: 'Drainage Inspector', phone: '0542-2500-401', email: 'rgupta@vnn.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 48,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Storm Water Drainage', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Geeta Devi',           email: 'gdevi@vnn.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner VNN',       email: 'addl.comm@vnn.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 155. Kochi — DRAINAGE — FILED
  {
    id: 'NS-KOC-20260627-1155',
    issueType: 'DRAINAGE',
    issueDescription: 'Storm drain at Vyttila Mobility Hub completely blocked. During rain, the entire junction floods — KSRTC buses cannot move.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Vyttila Mobility Hub, NH-66, Kochi', ward: 'Ward 72', wardNumber: 72, area: 'Vyttila', city: 'KOCHI' as City, lat: 9.9668, lng: 76.3123 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Storm Water Drainage', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 156. Coimbatore — SEWAGE — IN_PROGRESS
  {
    id: 'NS-CBE-20260622-1156',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage overflow near Singanallur pond affecting water body ecology. Residents of Singanallur South Street wading to work.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Singanallur South Street, Near Singanallur Pond, Coimbatore', ward: 'Ward 65', wardNumber: 65, area: 'Singanallur', city: 'COIMBATORE' as City, lat: 10.9971, lng: 77.0284 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Saravanan T.', designation: 'Sewerage Engineer', phone: '0422-2394-601', email: 'tsaravanan@ccmc.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(5 * H),
    department: 'Sewerage & Drainage', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 157. Visakhapatnam — SEWAGE — ESCALATED
  {
    id: 'NS-VIZ-20260615-1157',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage from Gajuwaka industrial township discharging into Sarada river tributary. Downstream villages using contaminated water.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Gajuwaka Industrial Area, Near Steel Plant Gate, Visakhapatnam', ward: 'Ward 60', wardNumber: 60, area: 'Gajuwaka', city: 'VISAKHAPATNAM' as City, lat: 17.6882, lng: 83.2082 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rambabu Rao', designation: 'Environment Engineer', phone: '0891-2564-601', email: 'rrao@gvmc.gov.in' },
    slaDeadline: ago(10 * D), slaHours: 12,
    filedAt: ago(12 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Sewerage', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(10 * D), to: 'Ward Councillor Satyam K.',         email: 'ksatyam@gvmc.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner GVMC',      email: 'addl.comm@gvmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 22,
  },

  // 158. Chandigarh — FALLEN_WIRE — IN_PROGRESS
  {
    id: 'NS-CHD-20260624-1158',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'Electric wire dangling low over road in Sector 38 near gurudwara. Trucks touching wire while passing — sparks visible.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sector 38 West, Near Gurdwara Sector 38, Chandigarh', ward: 'Ward 38', wardNumber: 38, area: 'Sector 38', city: 'CHANDIGARH' as City, lat: 30.7208, lng: 76.7618 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Jaswant Rana', designation: 'Electrical Emergency Officer', phone: '0172-2749-501', email: 'jrana@mc-chd.gov.in' },
    slaDeadline: ahead(3 * H), slaHours: 6,
    filedAt: ago(3 * H), lastUpdatedAt: ago(1 * H),
    department: 'Electrical Works', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 159. Indore — POTHOLE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-IDR-20260620-1159',
    issueType: 'POTHOLE',
    issueDescription: 'Palasia Square to Rajwada road has cluster of 6 potholes. High foot-traffic commercial area — pedestrian injuries reported.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Palasia Chowk to Rajwada Road, Old Indore', ward: 'Ward 10', wardNumber: 10, area: 'Palasia', city: 'INDORE' as City, lat: 22.7185, lng: 75.8732 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Santosh Pandey', designation: 'Roads Inspector', phone: '0731-2520-501', email: 'spandey@imcgov.in' },
    slaDeadline: ago(5 * D), slaHours: 48,
    filedAt: ago(8 * D), lastUpdatedAt: ago(4 * D),
    department: 'Roads & Bridges', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [{ level: 'WARD_OFFICER', date: ago(4 * D), to: 'Ward Officer Sunita Shukla', email: 'sshukla@imcgov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 79, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 30, detail: 'Closed in 55 min — 6 pothole patch job takes minimum 4h' },
      { flag: 'NO_PHOTO', points: 25, detail: 'No bitumen work photo or material issue slip' },
      { flag: 'REOPEN',   points: 24, detail: 'Palasia-Rajwada stretch: second complaint in 2 weeks' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 9,
  },

  // 160. Agra — GARBAGE — IN_PROGRESS
  {
    id: 'NS-AGR-20260623-1160',
    issueType: 'GARBAGE',
    issueDescription: 'Garbage heap near Agra Fort walls not cleared for 8 days. ASI has complained to AMC — UNESCO world heritage site affected.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Agra Fort Road, Near Amar Singh Gate, Agra', ward: 'Ward 72', wardNumber: 72, area: 'Agra Fort', city: 'AGRA' as City, lat: 27.1767, lng: 78.0218 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Kamlesh Arora', designation: 'Conservancy Supervisor', phone: '0562-2464-501', email: 'karora@amcagr.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 24,
    filedAt: ago(40 * H), lastUpdatedAt: ago(6 * H),
    department: 'Solid Waste Management', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 161. Bhubaneswar — STREET_LIGHT — ESCALATED
  {
    id: 'NS-BHU-20260614-1161',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Janpath Road near Kalpana Square non-functional for 9 days. Heart of Bhubaneswar city dark after 8 PM.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Janpath Road, Near Kalpana Square, Bhubaneswar', ward: 'Ward 20', wardNumber: 20, area: 'Kalpana Square', city: 'BHUBANESWAR' as City, lat: 20.2812, lng: 85.8412 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Bijay Kumar Dash', designation: 'Electrical Engineer', phone: '0674-2536-401', email: 'bkdash@bmc-bhu.gov.in' },
    slaDeadline: ago(7 * D), slaHours: 48,
    filedAt: ago(10 * D), lastUpdatedAt: ago(3 * D),
    department: 'Electrical Works', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(7 * D), to: 'Ward Officer Sasmita Jena',         email: 'sjena@bmc-bhu.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(3 * D), to: 'Additional Commissioner BMC',        email: 'addl.comm@bmc-bhu.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 162. Guwahati — STREET_LIGHT — FILED
  {
    id: 'NS-GWH-20260627-1162',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Kamakhya Temple approach road non-functional. Pilgrims and tourists visiting temple at night at risk.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Kamakhya Temple Road, Near Kamakhya Railway Station, Guwahati', ward: 'Ward 5', wardNumber: 5, area: 'Kamakhya', city: 'GUWAHATI' as City, lat: 26.1660, lng: 91.7054 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Electrical Works', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 163. Thiruvananthapuram — POTHOLE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-TRV-20260618-1163',
    issueType: 'POTHOLE',
    issueDescription: 'Medical College road Trivandrum has dangerous potholes near hospital emergency entrance. Ambulances delayed — lives at risk.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Medical College Road, Near Government Medical College, Thiruvananthapuram', ward: 'Ward 42', wardNumber: 42, area: 'Medical College', city: 'THIRUVANANTHAPURAM' as City, lat: 8.5139, lng: 76.9481 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Rajan Pillai', designation: 'Roads Inspector', phone: '0471-2327-401', email: 'rpillai@tvmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 6,
    filedAt: ago(9 * D), lastUpdatedAt: ago(5 * D),
    department: 'Roads & Bridges', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Councillor Lekha Menon', email: 'lmenon@tvmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 91, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 36, detail: 'CRITICAL pothole marked closed in 35 min — impossible for road repair' },
      { flag: 'PATTERN',  points: 29, detail: 'Inspector: 93% rapid closures on CRITICAL complaints' },
      { flag: 'NO_PHOTO', points: 26, detail: 'No pothole repair documentation submitted' },
    ], recommendation: 'RTI' },
    communityClusterSize: 7,
  },

  // 164. Ranchi — SEWAGE — FILED
  {
    id: 'NS-RNC-20260627-1164',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage line burst in Lalpur residential area near Birsa Chowk. Raw sewage flowing openly since yesterday — stench unbearable.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Lalpur Chowk, Near Birsa Chowk, Ranchi', ward: 'Ward 30', wardNumber: 30, area: 'Lalpur', city: 'RANCHI' as City, lat: 23.3460, lng: 85.3311 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(40 * H), slaHours: 48,
    filedAt: ago(8 * H), lastUpdatedAt: ago(8 * H),
    department: 'Sewerage & Sanitation', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 165. Amritsar — WATER_SUPPLY — GENUINELY_RESOLVED
  {
    id: 'NS-AMR-20260608-1165',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply absent in Majitha Road area for 5 days. Resolved after community protest blocked the main road.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Majitha Road, Near DAV College, Amritsar', ward: 'Ward 44', wardNumber: 44, area: 'Majitha Road', city: 'AMRITSAR' as City, lat: 31.6448, lng: 74.9122 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Kulwant Singh', designation: 'Water Works Engineer', phone: '0183-2564-401', email: 'ksingh@amc-amr.gov.in' },
    slaDeadline: ago(15 * D), slaHours: 24,
    filedAt: ago(18 * D), lastUpdatedAt: ago(13 * D),
    department: 'Water Supply', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 11,
  },

  // 166. Ludhiana — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-LDH-20260622-1166',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Balmiki Basti Ludhiana — no clean water supply for 7 days. 400 residents of marginalised colony buying water from vendors.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Balmiki Basti, Near Ghanta Ghar, Ludhiana', ward: 'Ward 11', wardNumber: 11, area: 'Ghanta Ghar', city: 'LUDHIANA' as City, lat: 30.9009, lng: 75.8573 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Rajinder Kaur', designation: 'Water Works Engineer', phone: '0161-2401-301', email: 'rkaur@lmc-ldh.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Water Supply', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 18,
  },

  // 167. Mumbai — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-MUM-20260613-1167',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Dust from Aarey Metro depot construction site blanketing Goregaon West 400m radius. AQI 320 on monitoring station.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Aarey Metro Depot Area, Western Express Highway, Goregaon East, Mumbai', ward: 'Ward 77', wardNumber: 77, area: 'Goregaon East', city: 'MUMBAI', lat: 19.1543, lng: 72.8686 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sushant Raje', designation: 'Environment Inspector', phone: '022-2659-9911', email: 'sraje@mcgm.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 24,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Smita Gaikwad',       email: 'sgaikwad@mcgm.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'DC R-Central Ward MCGM',           email: 'dc.rcentral@mcgm.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 168. Delhi — WATER_POLLUTION — RTI_FILED
  {
    id: 'NS-DEL-20260603-1168',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Yamuna river bank near Kalindi Kunj receiving direct drain discharge from Okhla drain. Black froth visible — NGT contempt possible.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kalindi Kunj, Near Okhla Drain Outfall, South Delhi', ward: 'Ward 204', wardNumber: 204, area: 'Kalindi Kunj', city: 'DELHI', lat: 28.5299, lng: 77.2978 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Ashwini Kumar', designation: 'Environment Officer', phone: '011-2694-6677', email: 'akumar@mcd.gov.in' },
    slaDeadline: ago(22 * D), slaHours: 12,
    filedAt: ago(24 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(22 * D), to: 'Ward Officer Neeraj Tyagi',            email: 'ntyagi@mcd.gov.in',        status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(16 * D), to: 'DC South Zone MCD',                    email: 'dc.south@mcd.gov.in',      status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(9 * D),  to: "Commissioner MCD",                     email: 'commissioner@mcd.gov.in',  status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 77, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 40, detail: 'Okhla drain discharge: eighth complaint this year' },
      { flag: 'DELAY',  points: 37, detail: 'Active NGT order flouted — 24 days no action' },
    ], recommendation: 'RTI' },
    communityClusterSize: 27,
  },

  // 169. Bengaluru — MANHOLE — FILED
  {
    id: 'NS-BLR-20260627-1169',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover missing on Sarjapur Road near Iblur junction. Busy IT corridor — bikes swerving into oncoming lane.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sarjapur Road, Near Iblur Village Junction, Bengaluru', ward: 'Ward 69', wardNumber: 69, area: 'Iblur', city: 'BENGALURU', lat: 12.9232, lng: 77.6724 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Roads & Infrastructure', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 170. Kolkata — DRAINAGE — GENUINELY_RESOLVED
  {
    id: 'NS-KOL-20260607-1170',
    issueType: 'DRAINAGE',
    issueDescription: 'Ballygunge Circular Road drain blocked causing flooding outside New Ballygunge apartments. Resolved after KMC emergency team deployed.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ballygunge Circular Road, Near Deshapriya Park, Kolkata', ward: 'Ward 78', wardNumber: 78, area: 'Ballygunge', city: 'KOLKATA', lat: 22.5215, lng: 88.3673 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Sujit Biswas', designation: 'Drainage Engineer', phone: '033-2286-4411', email: 'sbiswas@kmcgov.in' },
    slaDeadline: ago(17 * D), slaHours: 48,
    filedAt: ago(20 * D), lastUpdatedAt: ago(16 * D),
    department: 'Sewerage & Drainage', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 171. Chennai — BROKEN_FOOTPATH — IN_PROGRESS
  {
    id: 'NS-CHN-20260622-1171',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath outside IIT Madras gate on Sardar Patel Road crumbling. Students and faculty slipping on broken tiles.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Sardar Patel Road, Near IIT Madras Main Gate, Chennai', ward: 'Ward 175', wardNumber: 175, area: 'Adyar', city: 'CHENNAI', lat: 12.9915, lng: 80.2337 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Krishnamurthy S.', designation: 'Civil Engineer', phone: '044-2538-9988', email: 'skrishnamurthy@gcc.gov.in' },
    slaDeadline: ahead(20 * H), slaHours: 72,
    filedAt: ago(52 * H), lastUpdatedAt: ago(8 * H),
    department: 'Roads & Bridges', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 172. Hyderabad — ILLEGAL_CONSTRUCTION — RTI_FILED
  {
    id: 'NS-HYD-20260603-1172',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Lake bed encroachment by builder near Durgam Cheruvu. Construction of villas on lake boundary — HMDA plan violated.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Durgam Cheruvu Lake Road, Near Cyber Towers, Hitech City, Hyderabad', ward: 'Ward 125', wardNumber: 125, area: 'Hitech City', city: 'HYDERABAD', lat: 17.4473, lng: 78.3734 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Sarada Devi', designation: 'Town Planning Officer', phone: '040-2312-5566', email: 'sdevi@ghmc.gov.in' },
    slaDeadline: ago(21 * D), slaHours: 24,
    filedAt: ago(24 * D), lastUpdatedAt: ago(2 * D),
    department: 'Town Planning', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(21 * D), to: 'Ward Officer Lalitha Kumari',          email: 'lkumari@ghmc.gov.in',      status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(14 * D), to: 'Zonal Commissioner West Zone GHMC',    email: 'zc.west@ghmc.gov.in',      status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(7 * D),  to: "Commissioner GHMC",                    email: 'commissioner@ghmc.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 68, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 36, detail: 'Durgam Cheruvu encroachment: fifth RTI in 8 months' },
      { flag: 'DELAY',  points: 32, detail: 'HMDA violation ongoing — 24 days no demolition action' },
    ], recommendation: 'RTI' },
    communityClusterSize: 25,
  },

  // 173. Pune — FALLEN_WIRE — FILED
  {
    id: 'NS-PUN-20260627-1173',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'Cable wire fallen across Aundh main road near ITI. Vehicles passing under — risk of electrocution if live.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Aundh Road, Near ITI Aundh, Pune', ward: 'Ward 7', wardNumber: 7, area: 'Aundh', city: 'PUNE' as City, lat: 18.5590, lng: 73.8072 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(1 * H), lastUpdatedAt: ago(1 * H),
    department: 'Electrical Works', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 174. Ahmedabad — MANHOLE — IN_PROGRESS
  {
    id: 'NS-AMD-20260622-1174',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover missing on Science City Road near Gujarat University. Open pit 3 feet deep — incident reported at night.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Science City Road, Near Gujarat University Gate, Ahmedabad', ward: 'Ward 27', wardNumber: 27, area: 'Science City', city: 'AHMEDABAD', lat: 23.0408, lng: 72.5281 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Haresh Barot', designation: 'Civil Works Supervisor', phone: '079-2324-8877', email: 'hbarot@amcgov.in' },
    slaDeadline: ahead(2 * H), slaHours: 6,
    filedAt: ago(4 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Roads & Buildings', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 175. Jaipur — BURNING_WASTE — IN_PROGRESS
  {
    id: 'NS-JAI-20260622-1175',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Industrial waste burning near Malviya Nagar industrial area. Smoke enveloping nearby residential colony daily at dusk.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Malviya Nagar Industrial Area, Tonk Road, Jaipur', ward: 'Ward 78', wardNumber: 78, area: 'Malviya Nagar', city: 'JAIPUR', lat: 26.8488, lng: 75.8050 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Rajesh Saini', designation: 'Environment Inspector', phone: '0141-2744-707', email: 'rsaini@jmc.gov.in' },
    slaDeadline: ahead(14 * H), slaHours: 24,
    filedAt: ago(34 * H), lastUpdatedAt: ago(7 * H),
    department: 'Environment & Pollution Control', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 176. Lucknow — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-LKW-20260619-1176',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage drain blocked near Alambagh bus stand. Buses reversing into overflowing sewer — commuters stranded in filth.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Alambagh Bus Stand Road, Lucknow', ward: 'Ward 60', wardNumber: 60, area: 'Alambagh', city: 'LUCKNOW', lat: 26.8067, lng: 80.9020 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Deepak Awasthi', designation: 'Sewerage Supervisor', phone: '0522-2630-404', email: 'dawasthi@lmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 48,
    filedAt: ago(8 * D), lastUpdatedAt: ago(5 * D),
    department: 'Jal Sansthan', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Rekha Pandey', email: 'rpandey@lmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 83, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 31, detail: 'Marked resolved 40 min after filing — desilting needs hours' },
      { flag: 'PATTERN',  points: 27, detail: 'Supervisor: 86% rapid closures on drainage this month' },
      { flag: 'REOPEN',   points: 25, detail: 'Alambagh drain: second complaint in 10 days' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 11,
  },

  // 177. Patna — ILLEGAL_CONSTRUCTION — ESCALATED
  {
    id: 'NS-PAT-20260614-1177',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Multi-storey hotel being built without fire NOC on Boring Road. Adjacent school and hospital at risk in emergency.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Boring Road, Near Mahavir Cancer Institute, Patna', ward: 'Ward 47', wardNumber: 47, area: 'Boring Road', city: 'PATNA', lat: 25.6079, lng: 85.0965 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Abhay Kumar', designation: 'Building Inspector', phone: '0612-2688-501', email: 'akumar@pmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Building Regulation', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Asha Devi',             email: 'adevi@pmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner PMC',        email: 'addl.comm@pmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 16,
  },

  // 178. Bhopal — ILLEGAL_CONSTRUCTION — FILED
  {
    id: 'NS-BHO-20260627-1178',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Encroachment on government land near MP Nagar Zone-I — illegal shops built on BRTS corridor strip.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'MP Nagar Zone-I, Near DB Mall Signal, Bhopal', ward: 'Ward 18', wardNumber: 18, area: 'MP Nagar', city: 'BHOPAL', lat: 23.2329, lng: 77.4333 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(36 * H), slaHours: 48,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Town Planning & Development', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 179. Surat — STREET_LIGHT — ESCALATED
  {
    id: 'NS-SUR-20260615-1179',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Hazira road near ONGC campus non-functional for 11 days. Industrial highway workers doing night shifts at risk.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hazira Road, Near ONGC Township, Hazira, Surat', ward: 'Ward 55', wardNumber: 55, area: 'Hazira', city: 'SURAT' as City, lat: 21.1085, lng: 72.6508 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Manish Prajapati', designation: 'Electrical Supervisor', phone: '261-2420-601', email: 'mprajapati@smcgov.in' },
    slaDeadline: ago(9 * D), slaHours: 48,
    filedAt: ago(12 * D), lastUpdatedAt: ago(3 * D),
    department: 'Electrical Works', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(9 * D), to: 'Ward Officer Bina Chaudhary',        email: 'bchaudhary@smcgov.in',status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'Additional Commissioner SMC',        email: 'addl.comm@smcgov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 180. Nagpur — BROKEN_FOOTPATH — GENUINELY_RESOLVED
  {
    id: 'NS-NGP-20260608-1180',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Nagpur high court complex broken and uplifted. Lawyers and visitors with formal footwear slipping on broken tiles.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'High Court Road, Near Nagpur High Court, Nagpur', ward: 'Ward 18', wardNumber: 18, area: 'Civil Lines', city: 'NAGPUR' as City, lat: 21.1447, lng: 79.0781 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Preeti Gajbhiye', designation: 'Civil Engineer', phone: '0712-2560-501', email: 'pgajbhiye@nmc.gov.in' },
    slaDeadline: ago(15 * D), slaHours: 72,
    filedAt: ago(18 * D), lastUpdatedAt: ago(14 * D),
    department: 'Roads & Buildings', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 181. Varanasi — BURNING_WASTE — ESCALATED
  {
    id: 'NS-VNS-20260613-1181',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Medical waste being incinerated in open area near Kabir Chaura hospital. Dioxin-laced smoke entering ICU ward.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kabir Chaura, Near District Hospital, Varanasi', ward: 'Ward 60', wardNumber: 60, area: 'Kabir Chaura', city: 'VARANASI' as City, lat: 25.3188, lng: 83.0041 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Mithilesh Pandey', designation: 'Environment Officer', phone: '0542-2500-501', email: 'mpandey@vnn.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Saroj Devi',           email: 'sdevi@vnn.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner VNN',       email: 'addl.comm@vnn.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 19,
  },

  // 182. Kochi — BROKEN_FOOTPATH — IN_PROGRESS
  {
    id: 'NS-KOC-20260620-1182',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on MG Road near Ernakulam Junction railway station dug up for KMRL work — not restored in 3 weeks.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'MG Road, Near Ernakulam Junction Railway Station, Kochi', ward: 'Ward 35', wardNumber: 35, area: 'Ernakulam Junction', city: 'KOCHI' as City, lat: 9.9831, lng: 76.2909 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Mathew George', designation: 'Roads Inspector', phone: '0484-2335-601', email: 'mgeorge@kochicorp.gov.in' },
    slaDeadline: ahead(24 * H), slaHours: 72,
    filedAt: ago(48 * H), lastUpdatedAt: ago(10 * H),
    department: 'Roads & Buildings', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 183. Coimbatore — DEAD_ANIMAL — RESOLVED_CLAIMED
  {
    id: 'NS-CBE-20260621-1183',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead cow carcass on Trichy Road near Koundampalayam. Putrefaction in summer heat — shops closed due to stench.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Trichy Road, Near Koundampalayam Bus Stop, Coimbatore', ward: 'Ward 71', wardNumber: 71, area: 'Koundampalayam', city: 'COIMBATORE' as City, lat: 10.9626, lng: 76.9889 },
    status: 'RESOLVED_CLAIMED',
    assignedOfficer: { name: 'Arumugam V.', designation: 'Sanitary Inspector', phone: '0422-2394-701', email: 'varumugam@ccmc.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 12,
    filedAt: ago(6 * D), lastUpdatedAt: ago(12 * H),
    department: 'Public Health & Sanitation', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 184. Visakhapatnam — STREET_LIGHT — IN_PROGRESS
  {
    id: 'NS-VIZ-20260622-1184',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights along Lawsons Bay Colony beach road non-functional for 8 days. Evening walkers and joggers complaining.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Lawsons Bay Colony Beach Road, Visakhapatnam', ward: 'Ward 48', wardNumber: 48, area: 'Lawsons Bay', city: 'VISAKHAPATNAM' as City, lat: 17.7421, lng: 83.3602 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Bhaskara Rao', designation: 'Electrical Supervisor', phone: '0891-2564-701', email: 'brao@gvmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Electrical Works', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 185. Chandigarh — STRAY_DOG — FILED
  {
    id: 'NS-CHD-20260627-1185',
    issueType: 'STRAY_DOG',
    issueDescription: 'Pack of stray dogs at Sector 26 grain market attacking morning vendors. Three bite incidents this week before sunrise.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 26 Grain Market, Chandigarh', ward: 'Ward 26', wardNumber: 26, area: 'Sector 26', city: 'CHANDIGARH' as City, lat: 30.7370, lng: 76.7961 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Animal Welfare', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 186. Indore — MANHOLE — ASSIGNED
  {
    id: 'NS-IDR-20260625-1186',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover stolen on Geeta Bhavan main road near flyover. Open hole covered with broken bricks by locals — dangerous.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Geeta Bhavan Main Road, Near Overbridge, Indore', ward: 'Ward 52', wardNumber: 52, area: 'Geeta Bhavan', city: 'INDORE' as City, lat: 22.7298, lng: 75.8702 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Gopal Yadav', designation: 'Underground Drainage Supervisor', phone: '0731-2520-601', email: 'gyadav@imcgov.in' },
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Sewerage & Underground Drainage', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 187. Agra — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-AGR-20260623-1187',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Jal Nigam water supply absent in Shahganj locality for 5 days. 2000+ residents of dense locality buying water from vendors.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Shahganj Main Road, Near Shahganj Crossing, Agra', ward: 'Ward 55', wardNumber: 55, area: 'Shahganj', city: 'AGRA' as City, lat: 27.1869, lng: 78.0184 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Agarwal', designation: 'Water Works Engineer', phone: '0562-2464-601', email: 'sagarwal@amcagr.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Water Supply', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 21,
  },

  // 188. Bhubaneswar — BURNING_WASTE — FILED
  {
    id: 'NS-BHU-20260627-1188',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Plastic waste burning near Nandankanan Road. Smoke entering Bhubaneswar Zoo — concern for animals in captivity.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Nandankanan Road, Near Zoo Entrance, Bhubaneswar', ward: 'Ward 58', wardNumber: 58, area: 'Nandankanan', city: 'BHUBANESWAR' as City, lat: 20.4003, lng: 85.8282 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Environment & Solid Waste', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 189. Guwahati — SEWAGE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-GWH-20260619-1189',
    issueType: 'SEWAGE',
    issueDescription: 'Sewage from Ulubari colony draining into Bharalu without treatment. Nullah completely black — residents reporting skin disease.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Ulubari Colony, Near Ulubari Chariali, Guwahati', ward: 'Ward 14', wardNumber: 14, area: 'Ulubari', city: 'GUWAHATI' as City, lat: 26.1676, lng: 91.7567 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Bhupen Nath', designation: 'Sewerage Engineer', phone: '0361-2736-401', email: 'bnath@gmc.gov.in' },
    slaDeadline: ago(6 * D), slaHours: 24,
    filedAt: ago(8 * D), lastUpdatedAt: ago(5 * D),
    department: 'Sewerage & Drainage', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Commissioner Minakhi Bora', email: 'mbora@gmc.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 84, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 32, detail: 'Closed in 1h — sewage treatment plant repair takes days' },
      { flag: 'PATTERN',  points: 28, detail: 'Engineer: 89% rapid closures on Bharalu-related complaints' },
      { flag: 'REOPEN',   points: 24, detail: 'Ulubari sewage discharge: fourth complaint this year' },
    ], recommendation: 'RTI' },
    communityClusterSize: 17,
  },

  // 190. Thiruvananthapuram — MANHOLE — GENUINELY_RESOLVED
  {
    id: 'NS-TRV-20260608-1190',
    issueType: 'MANHOLE',
    issueDescription: 'Open manhole on MG Road near Palayam bus stand. Tourist fell in — minor injury. Resolved after incident went viral on social media.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'MG Road, Near Palayam Bus Stand, Thiruvananthapuram', ward: 'Ward 20', wardNumber: 20, area: 'Palayam', city: 'THIRUVANANTHAPURAM' as City, lat: 8.4924, lng: 76.9523 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Sreekumar Nair', designation: 'Infrastructure Supervisor', phone: '0471-2327-501', email: 'snair@tvmc.gov.in' },
    slaDeadline: ago(16 * D), slaHours: 6,
    filedAt: ago(18 * D), lastUpdatedAt: ago(15 * D),
    department: 'Roads & Drainage', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 191. Ranchi — DRAINAGE — ESCALATED
  {
    id: 'NS-RNC-20260614-1191',
    issueType: 'DRAINAGE',
    issueDescription: 'Hindpiri nullah choked with solid waste — overflows every rain, turning main road impassable for 3h.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hindpiri Main Road, Near Hindu Club, Ranchi', ward: 'Ward 35', wardNumber: 35, area: 'Hindpiri', city: 'RANCHI' as City, lat: 23.3553, lng: 85.3242 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Deepak Lakra', designation: 'Drainage Engineer', phone: '0651-2208-301', email: 'dlakra@rmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 48,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Drainage & Flood Control', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Sunita Mahto',         email: 'smahto@rmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner RMC',       email: 'addl.comm@rmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 192. Amritsar — POTHOLE — IN_PROGRESS
  {
    id: 'NS-AMR-20260623-1192',
    issueType: 'POTHOLE',
    issueDescription: 'G.T. Road near Chheharta has axle-breaking potholes affecting national highway traffic approaching Amritsar.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'G.T. Road, Near Chheharta Bus Stand, Amritsar', ward: 'Ward 15', wardNumber: 15, area: 'Chheharta', city: 'AMRITSAR' as City, lat: 31.6614, lng: 74.8019 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Surinder Kumar', designation: 'Roads Engineer', phone: '0183-2564-501', email: 'skumar@amc-amr.gov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(7 * H),
    department: 'Roads & Bridges', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 193. Ludhiana — BROKEN_FOOTPATH — GENUINELY_RESOLVED
  {
    id: 'NS-LDH-20260607-1193',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Ludhiana railway station completely broken — luggage-carrying passengers falling. Resolved after TV channel coverage.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Railway Station Road, Near Ludhiana Junction, Ludhiana', ward: 'Ward 21', wardNumber: 21, area: 'Railway Station', city: 'LUDHIANA' as City, lat: 30.9010, lng: 75.8574 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Amardeep Gill', designation: 'Civil Engineer', phone: '0161-2401-401', email: 'agill@lmc-ldh.gov.in' },
    slaDeadline: ago(17 * D), slaHours: 72,
    filedAt: ago(20 * D), lastUpdatedAt: ago(16 * D),
    department: 'Roads & Buildings', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 194. Mumbai — TREE_FALLEN — IN_PROGRESS
  {
    id: 'NS-MUM-20260626-1194',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Large tree fallen on power lines on Andheri-Kurla Road near MIDC. Both road and power disrupted for 200 households.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Andheri-Kurla Road, Near MIDC, Andheri East, Mumbai', ward: 'Ward 84', wardNumber: 84, area: 'Andheri East', city: 'MUMBAI', lat: 19.1136, lng: 72.8697 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Pravin Lonkar', designation: 'Horticulture Emergency Officer', phone: '022-2659-2211', email: 'plonkar@mcgm.gov.in' },
    slaDeadline: ahead(1 * H), slaHours: 6,
    filedAt: ago(5 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Parks & Horticulture', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 195. Delhi — BURNING_WASTE — ESCALATED
  {
    id: 'NS-DEL-20260613-1195',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Stubble and waste burning in Narela industrial area — AQI 350 in nearby Rohini residential zones. Schools issued health alerts.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Narela Industrial Area, Phase II, North Delhi', ward: 'Ward 6', wardNumber: 6, area: 'Narela', city: 'DELHI', lat: 28.8559, lng: 77.0908 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Amita Pal', designation: 'Environment Officer', phone: '011-2694-4455', email: 'apal@mcd.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Geeta Rawat',          email: 'grawat@mcd.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'DC North Zone MCD',                 email: 'dc.north@mcd.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 23,
  },

  // 196. Bengaluru — DEAD_ANIMAL — FILED
  {
    id: 'NS-BLR-20260627-1196',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead horse carcass near Tumkur Road industrial estate gate. Feral dogs scavenging — workers refusing to enter workplace.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Tumkur Road, Near Peenya Industrial Estate Gate 2, Bengaluru', ward: 'Ward 12', wardNumber: 12, area: 'Peenya', city: 'BENGALURU', lat: 13.0287, lng: 77.5201 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(10 * H), slaHours: 12,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Public Health & Sanitation', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 197. Kolkata — DEAD_ANIMAL — IN_PROGRESS
  {
    id: 'NS-KOL-20260625-1197',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead dog carcass near New Market main entrance for 2 days. Popular commercial area — health risk to food vendors.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hogg Market, New Market, Esplanade, Kolkata', ward: 'Ward 45', wardNumber: 45, area: 'New Market', city: 'KOLKATA', lat: 22.5606, lng: 88.3514 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Palash Roy', designation: 'Sanitary Inspector', phone: '033-2286-2233', email: 'proy@kmcgov.in' },
    slaDeadline: ahead(6 * H), slaHours: 12,
    filedAt: ago(6 * H), lastUpdatedAt: ago(1 * H),
    department: 'Public Health', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 198. Chennai — STRAY_DOG — ESCALATED
  {
    id: 'NS-CHN-20260614-1198',
    issueType: 'STRAY_DOG',
    issueDescription: 'Stray dog menace near Tambaram railway station area — 6 people bitten in one week. ABC programme not implemented.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Tambaram East Station Road, Tambaram, Chennai', ward: 'Ward 200', wardNumber: 200, area: 'Tambaram', city: 'CHENNAI', lat: 12.9249, lng: 80.1000 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Senthil Kumar M.', designation: 'Animal Welfare Inspector', phone: '044-2538-6655', email: 'msenthil@gcc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Animal Welfare', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Councillor Nithya Devi',       email: 'ndevi@gcc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner GCC',       email: 'addl.comm@gcc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 199. Hyderabad — TREE_FALLEN — FILED
  {
    id: 'NS-HYD-20260627-1199',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Huge banyan tree uprooted in Sanjeevaiah Park during last night storm. Park entry blocked — morning walkers stranded.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sanjeevaiah Park, Near Hussain Sagar, Hyderabad', ward: 'Ward 51', wardNumber: 51, area: 'Sanjeevaiah Park', city: 'HYDERABAD', lat: 17.4344, lng: 78.4716 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(3 * H), lastUpdatedAt: ago(3 * H),
    department: 'Parks & Horticulture', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 200. Pune — NOISE_POLLUTION — ESCALATED
  {
    id: 'NS-PUN-20260613-1200',
    issueType: 'NOISE_POLLUTION',
    issueDescription: 'Cement batching plant near Wakad operating 24/7 with diesel generators causing constant noise — residents unable to sleep for 3 weeks.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Wakad Phata, Near Hinjewadi Road, Pune', ward: 'Ward 3', wardNumber: 3, area: 'Wakad', city: 'PUNE' as City, lat: 18.5972, lng: 73.7637 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Ashok Bhosle', designation: 'Pollution Control Inspector', phone: '020-2612-7711', email: 'abhosle@pmc.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 48,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Savita Mane',          email: 'smane@pmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner PMC',       email: 'addl.comm@pmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 18,
  },

  // 201. Ahmedabad — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-AMD-20260614-1201',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Cement dust from Vastral flyover construction blankets Vastral residential sector — windows black within hours of cleaning.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Vastral Gam Road, Near Vastral Circle, Ahmedabad', ward: 'Ward 50', wardNumber: 50, area: 'Vastral', city: 'AHMEDABAD', lat: 23.0348, lng: 72.6644 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Nilam Desai', designation: 'Environment Officer', phone: '079-2324-9988', email: 'ndesai@amcgov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Jignesh Patel',        email: 'jpatel@amcgov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner AMC',       email: 'addl.comm@amcgov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 16,
  },

  // 202. Jaipur — WATER_POLLUTION — FILED
  {
    id: 'NS-JAI-20260627-1202',
    issueType: 'WATER_POLLUTION',
    issueDescription: 'Effluent from gem-polishing units near Sitapura RIICO discharged into Dravyavati river. River turning red — aquatic life dying.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Sitapura RIICO Industrial Area, Near Dravyavati River, Jaipur', ward: 'Ward 89', wardNumber: 89, area: 'Sitapura', city: 'JAIPUR', lat: 26.7817, lng: 75.8467 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(10 * H), slaHours: 12,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Environment & Pollution Control', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 203. Lucknow — TREE_FALLEN — IN_PROGRESS
  {
    id: 'NS-LKW-20260626-1203',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Old mango tree collapsed on Hazratganj footpath during storm. Branches blocking entire pavement — pedestrians on road.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hazratganj, Near GPO, Lucknow', ward: 'Ward 35', wardNumber: 35, area: 'Hazratganj', city: 'LUCKNOW', lat: 26.8463, lng: 80.9422 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Dinesh Chandra', designation: 'Horticulture Supervisor', phone: '0522-2630-505', email: 'dchandra@lmc.gov.in' },
    slaDeadline: ahead(3 * H), slaHours: 6,
    filedAt: ago(3 * H), lastUpdatedAt: ago(1 * H),
    department: 'Parks & Horticulture', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 204. Patna — DRAINAGE — GENUINELY_RESOLVED
  {
    id: 'NS-PAT-20260607-1204',
    issueType: 'DRAINAGE',
    issueDescription: 'Buddha Marg drain blocked for 7 days causing flooding outside AIIMS Patna entrance. Resolved after hospital director wrote to DM.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Buddha Marg, Near AIIMS Patna, Patna', ward: 'Ward 38', wardNumber: 38, area: 'Buddha Marg', city: 'PATNA', lat: 25.6095, lng: 85.0674 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Shashi Bhushan', designation: 'Drainage Engineer', phone: '0612-2688-601', email: 'sbhushan@pmc.gov.in' },
    slaDeadline: ago(17 * D), slaHours: 12,
    filedAt: ago(20 * D), lastUpdatedAt: ago(16 * D),
    department: 'Storm Water Drainage', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 205. Bhopal — STRAY_DOG — IN_PROGRESS
  {
    id: 'NS-BHO-20260622-1205',
    issueType: 'STRAY_DOG',
    issueDescription: 'Aggressive stray dog pack near Bhopal railway station. 4 railway passengers bitten while walking to platform 1.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Bhopal Railway Station, Hamidia Road, Bhopal', ward: 'Ward 40', wardNumber: 40, area: 'Railway Colony', city: 'BHOPAL', lat: 23.2691, lng: 77.4046 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Radha Bai', designation: 'Animal Welfare Officer', phone: '0755-2777-701', email: 'rbai@bmcgov.in' },
    slaDeadline: ahead(8 * H), slaHours: 24,
    filedAt: ago(40 * H), lastUpdatedAt: ago(6 * H),
    department: 'Animal Welfare', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 206. Surat — BURNING_WASTE — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-SUR-20260619-1206',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Textile chemical waste burning near Pandesara GIDC. Toxic black smoke visible for 5 km — workers wearing makeshift masks.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Pandesara GIDC, Phase II, Surat', ward: 'Ward 50', wardNumber: 50, area: 'Pandesara', city: 'SURAT' as City, lat: 21.1540, lng: 72.8736 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Viral Patel', designation: 'Environment Inspector', phone: '261-2420-701', email: 'vpatel@smcgov.in' },
    slaDeadline: ago(6 * D), slaHours: 12,
    filedAt: ago(8 * D), lastUpdatedAt: ago(5 * D),
    department: 'Environment & Solid Waste', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [{ level: 'WARD_OFFICER', date: ago(5 * D), to: 'Ward Officer Nilofar Shaikh', email: 'nshaikh@smcgov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 88, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 34, detail: 'CRITICAL burning closed in 30 min — no enforcement possible so fast' },
      { flag: 'PATTERN',  points: 28, detail: 'Inspector: 91% rapid closures on GIDC burning complaints' },
      { flag: 'REOPEN',   points: 26, detail: 'Pandesara GIDC burning: third complaint in 3 weeks' },
    ], recommendation: 'RTI' },
    communityClusterSize: 14,
  },

  // 207. Nagpur — MANHOLE — ESCALATED
  {
    id: 'NS-NGP-20260614-1207',
    issueType: 'MANHOLE',
    issueDescription: 'Three manholes without covers on Kamptee Road near Kasturchand Park. Open pits 4 feet deep — night accident waiting to happen.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Kamptee Road, Near Kasturchand Park, Nagpur', ward: 'Ward 30', wardNumber: 30, area: 'Kasturchand Park', city: 'NAGPUR' as City, lat: 21.1509, lng: 79.0889 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Milind Wankhede', designation: 'Underground Drainage Supervisor', phone: '0712-2560-601', email: 'mwankhede@nmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 6,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Underground Drainage', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Pratibha Kapse',       email: 'pkapse@nmc.gov.in',   status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner NMC',       email: 'addl.comm@nmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 12,
  },

  // 208. Varanasi — STREET_LIGHT — IN_PROGRESS
  {
    id: 'NS-VNS-20260622-1208',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights along Ghats approach path near Manikarnika Ghat non-functional. Night-time pilgrims stumbling in darkness.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Manikarnika Ghat Approach Road, Varanasi', ward: 'Ward 80', wardNumber: 80, area: 'Manikarnika', city: 'VARANASI' as City, lat: 25.3099, lng: 83.0108 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Pandey', designation: 'Electrical Engineer', phone: '0542-2500-601', email: 'spandey@vnn.gov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(7 * H),
    department: 'Electrical Works', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 209. Kochi — MANHOLE — ASSIGNED
  {
    id: 'NS-KOC-20260625-1209',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover dislodged near Kakkanad InfoPark main gate. IT employees on two-wheelers at high risk during peak hours.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'InfoPark Road, Near Kakkanad, Kochi', ward: 'Ward 80', wardNumber: 80, area: 'Kakkanad', city: 'KOCHI' as City, lat: 10.0275, lng: 76.3410 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Soji Thomas', designation: 'Civil Works Inspector', phone: '0484-2335-701', email: 'sthomas@kochicorp.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Roads & Drainage', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 210. Coimbatore — BROKEN_FOOTPATH — FILED
  {
    id: 'NS-CBE-20260627-1210',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Coimbatore Junction railway station front gate totally broken. Station approaches dangerous for luggage-carrying travellers.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Railway Station Road, Near Coimbatore Junction, Coimbatore', ward: 'Ward 5', wardNumber: 5, area: 'RS Puram', city: 'COIMBATORE' as City, lat: 11.0037, lng: 76.9657 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(60 * H), slaHours: 72,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Roads & Bridges', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 211. Visakhapatnam — MANHOLE — IN_PROGRESS
  {
    id: 'NS-VIZ-20260624-1211',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole without cover on Siripuram Junction — high-speed road. Motorcyclist sustained serious injuries after hitting open hole last evening.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Siripuram Junction, Near Novotel Hotel, Visakhapatnam', ward: 'Ward 33', wardNumber: 33, area: 'Siripuram', city: 'VISAKHAPATNAM' as City, lat: 17.7325, lng: 83.3139 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Jagadish Rao', designation: 'Underground Drainage Supervisor', phone: '0891-2564-801', email: 'jrao@gvmc.gov.in' },
    slaDeadline: ahead(2 * H), slaHours: 6,
    filedAt: ago(4 * H), lastUpdatedAt: ago(1 * H),
    department: 'Underground Drainage', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 212. Chandigarh — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-CHD-20260613-1212',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Diesel generator smoke from temporary fair at Parade Ground running 16h/day for Chandigarh Foundation Day. Sector 17 residents impacted.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Parade Ground, Sector 17, Chandigarh', ward: 'Ward 17', wardNumber: 17, area: 'Sector 17', city: 'CHANDIGARH' as City, lat: 30.7410, lng: 76.7813 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rajvir Kaur', designation: 'Environment Officer', phone: '0172-2749-601', email: 'rkaur@mc-chd.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 24,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Councillor Paramjit Kaur',     email: 'pkaur@mc-chd.gov.in',status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Commissioner MC Chandigarh',        email: 'commissioner@mc-chd.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 213. Indore — DEAD_ANIMAL — FILED
  {
    id: 'NS-IDR-20260627-1213',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead bull on MG Road near Indore Rajwada heritage zone. Tourist season peak — smell and sight deeply embarrassing.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'MG Road, Near Rajwada Palace, Indore', ward: 'Ward 6', wardNumber: 6, area: 'Rajwada', city: 'INDORE' as City, lat: 22.7196, lng: 75.8582 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(10 * H), slaHours: 12,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Public Health & Sanitation', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 214. Agra — STRAY_DOG — ESCALATED
  {
    id: 'NS-AGR-20260614-1214',
    issueType: 'STRAY_DOG',
    issueDescription: 'Stray dog attack near Agra Fort bus stand. Six tourists bitten in morning — Uttar Pradesh Tourism has complained formally.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Agra Fort Bus Stand Road, Near Agra Fort Gate, Agra', ward: 'Ward 71', wardNumber: 71, area: 'Agra Fort', city: 'AGRA' as City, lat: 27.1789, lng: 78.0204 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rakesh Sharma', designation: 'Animal Welfare Inspector', phone: '0562-2464-701', email: 'rsharma@amcagr.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Animal Welfare', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Rekha Agarwal',        email: 'ragarwal@amcagr.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner Agra',      email: 'addl.comm@amcagr.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 15,
  },

  // 215. Bhubaneswar — DRAINAGE — ESCALATED
  {
    id: 'NS-BHU-20260614-1215',
    issueType: 'DRAINAGE',
    issueDescription: 'Kuakhai river overflow drain blocked near Khandagiri area. 50 houses flooded during last rain event — paddy crop also destroyed.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Khandagiri Bazar, Near Khandagiri Hill, Bhubaneswar', ward: 'Ward 62', wardNumber: 62, area: 'Khandagiri', city: 'BHUBANESWAR' as City, lat: 20.2636, lng: 85.7682 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Santosh Behera', designation: 'Drainage Engineer', phone: '0674-2536-501', email: 'sbehera@bmc-bhu.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Drainage & Flood Control', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Sarojini Pati',        email: 'spati@bmc-bhu.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner BMC',       email: 'addl.comm@bmc-bhu.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 20,
  },

  // 216. Guwahati — ILLEGAL_CONSTRUCTION — FILED
  {
    id: 'NS-GWH-20260627-1216',
    issueType: 'ILLEGAL_CONSTRUCTION',
    issueDescription: 'Commercial building under construction on wetland near Deepor Beel bird sanctuary boundary. Ramsar site protection being flouted.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Deepor Beel Periphery Road, Near Azara, Guwahati', ward: 'Ward 4', wardNumber: 4, area: 'Azara', city: 'GUWAHATI' as City, lat: 26.1283, lng: 91.6901 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Town Planning & Environment', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 217. Thiruvananthapuram — BROKEN_FOOTPATH — ESCALATED
  {
    id: 'NS-TRV-20260613-1217',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on Statue Road near Secretariat completely broken after KSEB cable laying. No restoration for 5 weeks — bureaucrats wading through mess.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Statue Road, Near Secretariat Main Gate, Thiruvananthapuram', ward: 'Ward 22', wardNumber: 22, area: 'Statue Junction', city: 'THIRUVANANTHAPURAM' as City, lat: 8.4897, lng: 76.9495 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Vinodkumar N.', designation: 'Roads Inspector', phone: '0471-2327-601', email: 'nvinodkumar@tvmc.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 72,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Buildings', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Councillor Shyama Rajan',      email: 'srajan@tvmc.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Corporation Secretary TVMC',        email: 'secretary@tvmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 218. Ranchi — STREET_LIGHT — IN_PROGRESS
  {
    id: 'NS-RNC-20260622-1218',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights at Doranda market area non-functional for 7 days. Largest market in Ranchi unsafe after sunset.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Doranda Market Road, Near Doranda Police Station, Ranchi', ward: 'Ward 22', wardNumber: 22, area: 'Doranda', city: 'RANCHI' as City, lat: 23.3239, lng: 85.3094 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Mukesh Pandey', designation: 'Electrical Supervisor', phone: '0651-2208-401', email: 'mpandey@rmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Electrical Works', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 219. Amritsar — DEAD_ANIMAL — IN_PROGRESS
  {
    id: 'NS-AMR-20260624-1219',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead buffalo carcass on Bypass Road near Amritsar airport approach. International visitors arriving from airport shocked at sight.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Airport Bypass Road, Near Raja Sansi Airport, Amritsar', ward: 'Ward 58', wardNumber: 58, area: 'Airport Road', city: 'AMRITSAR' as City, lat: 31.7061, lng: 74.7973 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Sukhpal Brar', designation: 'Sanitary Supervisor', phone: '0183-2564-601', email: 'sbrar@amc-amr.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 12,
    filedAt: ago(8 * H), lastUpdatedAt: ago(2 * H),
    department: 'Public Health & Sanitation', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 220. Ludhiana — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-LDH-20260613-1220',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Dyeing unit in Focal Point Ludhiana releasing untreated chemical fumes. Textile workers protesting — three hospitalised this week.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Focal Point Industrial Area Phase 8, Ludhiana', ward: 'Ward 68', wardNumber: 68, area: 'Focal Point', city: 'LUDHIANA' as City, lat: 30.8750, lng: 75.7601 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Parminder Singh', designation: 'Environment Officer', phone: '0161-2401-501', email: 'psingh@lmc-ldh.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Councillor Harjeet Kaur',      email: 'hjkaur@lmc-ldh.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner LMC',       email: 'addl.comm@lmc-ldh.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 22,
  },

  // 221. Mumbai — ENCROACHMENT — IN_PROGRESS
  {
    id: 'NS-MUM-20260620-1221',
    issueType: 'ENCROACHMENT',
    issueDescription: 'Hawkers blocking full width of Hill Road Bandra outside Elco market. Emergency vehicle access completely blocked.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Hill Road, Near Elco Arcade, Bandra West, Mumbai', ward: 'Ward 69', wardNumber: 69, area: 'Bandra West', city: 'MUMBAI', lat: 19.0561, lng: 72.8366 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Kishor Chavan', designation: 'Enforcement Inspector', phone: '022-2659-3344', email: 'kchavan@mcgm.gov.in' },
    slaDeadline: ahead(16 * H), slaHours: 48,
    filedAt: ago(32 * H), lastUpdatedAt: ago(8 * H),
    department: 'Encroachment Removal', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 222. Delhi — BROKEN_FOOTPATH — IN_PROGRESS
  {
    id: 'NS-DEL-20260621-1222',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on Parliament Street dug up for pipeline work — not restored for 4 weeks. Diplomatic area appearance very poor.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Parliament Street, Near Jantar Mantar, New Delhi', ward: 'Ward 53', wardNumber: 53, area: 'Parliament Street', city: 'DELHI', lat: 28.6241, lng: 77.2159 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Ankit Rana', designation: 'Civil Engineer', phone: '011-2694-8899', email: 'arana@mcd.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 72,
    filedAt: ago(64 * H), lastUpdatedAt: ago(8 * H),
    department: 'Roads & Traffic', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 223. Bengaluru — AIR_POLLUTION — IN_PROGRESS
  {
    id: 'NS-BLR-20260620-1223',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Construction dust from Namma Metro Phase 3 work enveloping Silk Board junction. Commuters in standstill traffic breathing heavy dust.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Silk Board Junction, BTM Layout, Bengaluru', ward: 'Ward 151', wardNumber: 151, area: 'Silk Board', city: 'BENGALURU', lat: 12.9173, lng: 77.6228 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Jayalaxmi B.', designation: 'Environment Inspector', phone: '080-2297-3322', email: 'bjayalaxmi@bbmp.gov.in' },
    slaDeadline: ahead(12 * H), slaHours: 48,
    filedAt: ago(36 * H), lastUpdatedAt: ago(7 * H),
    department: 'Environment & Pollution Control', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 12,
  },

  // 224. Kolkata — BROKEN_FOOTPATH — FILED
  {
    id: 'NS-KOL-20260627-1224',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Kalighat Temple completely broken and sunken. Temple pilgrims, many elderly, twisting ankles on uneven surface.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Kalighat Temple Road, Near Kalighat Station, Kolkata', ward: 'Ward 82', wardNumber: 82, area: 'Kalighat', city: 'KOLKATA', lat: 22.5233, lng: 88.3430 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(60 * H), slaHours: 72,
    filedAt: ago(12 * H), lastUpdatedAt: ago(12 * H),
    department: 'Roads & Bridges', municipalBody: 'KMC', portalHelpline: '1800-103-0012',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 225. Chennai — TREE_FALLEN — FILED
  {
    id: 'NS-CHN-20260627-1225',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Large rain tree fell across Anna Salai after morning storm. 4 lanes blocked — Chennai city traffic in complete gridlock.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Anna Salai, Near LIC Building, Chennai', ward: 'Ward 105', wardNumber: 105, area: 'Teynampet', city: 'CHENNAI', lat: 13.0518, lng: 80.2492 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(3 * H), slaHours: 6,
    filedAt: ago(1 * H), lastUpdatedAt: ago(1 * H),
    department: 'Parks & Horticulture', municipalBody: 'GCC', portalHelpline: '1913',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 226. Hyderabad — BROKEN_FOOTPATH — IN_PROGRESS
  {
    id: 'NS-HYD-20260620-1226',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath on Abids Road dug up for GHMC UGD project — unrestored for 6 weeks. Heritage book shops customers complaining.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Abids Road, Near Central Bank, Abids, Hyderabad', ward: 'Ward 63', wardNumber: 63, area: 'Abids', city: 'HYDERABAD', lat: 17.3921, lng: 78.4780 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Nayak', designation: 'Civil Engineer', phone: '040-2312-9988', email: 'snayak@ghmc.gov.in' },
    slaDeadline: ahead(20 * H), slaHours: 72,
    filedAt: ago(52 * H), lastUpdatedAt: ago(9 * H),
    department: 'Roads & Bridges', municipalBody: 'GHMC', portalHelpline: '1800-425-0777',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 227. Pune — TREE_FALLEN — ASSIGNED
  {
    id: 'NS-PUN-20260626-1227',
    issueType: 'TREE_FALLEN',
    issueDescription: 'Eucalyptus tree fell on parked cars outside Jehangir Hospital during yesterday rain. Patients families distressed — debris on hospital approach.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sassoon Road, Near Jehangir Hospital, Pune', ward: 'Ward 28', wardNumber: 28, area: 'Sassoon Road', city: 'PUNE' as City, lat: 18.5155, lng: 73.8721 },
    status: 'ASSIGNED',
    assignedOfficer: { name: 'Sunil Waghmare', designation: 'Horticulture Supervisor', phone: '020-2612-1122', email: 'swaghmare@pmc.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Parks & Horticulture', municipalBody: 'PMC', portalHelpline: '1800-233-4411',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 228. Ahmedabad — NOISE_POLLUTION — FILED
  {
    id: 'NS-AMD-20260627-1228',
    issueType: 'NOISE_POLLUTION',
    issueDescription: 'Wedding tent-house near Sarkhej canal using high-decibel speakers past midnight. Three nights in a row — students with board exams affected.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Sarkhej Road, Near Sarkhej Canal, Ahmedabad', ward: 'Ward 39', wardNumber: 39, area: 'Sarkhej', city: 'AHMEDABAD', lat: 23.0015, lng: 72.5200 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Pollution Control', municipalBody: 'AMC', portalHelpline: '1800-233-2262',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 229. Jaipur — WATER_SUPPLY — GENUINELY_RESOLVED
  {
    id: 'NS-JAI-20260608-1229',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'PHED water supply absent in Durgapura for 6 days. Resolved after RWA president met Mayor directly — model for citizen escalation.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Durgapura, Near C-Scheme Flyover, Jaipur', ward: 'Ward 82', wardNumber: 82, area: 'Durgapura', city: 'JAIPUR', lat: 26.8690, lng: 75.7921 },
    status: 'GENUINELY_RESOLVED',
    assignedOfficer: { name: 'Mohan Lal Yadav', designation: 'Water Works Engineer', phone: '0141-2744-808', email: 'mlyadav@jmc.gov.in' },
    slaDeadline: ago(15 * D), slaHours: 24,
    filedAt: ago(18 * D), lastUpdatedAt: ago(12 * D),
    department: 'Water Supply', municipalBody: 'JMC', portalHelpline: '0141-2744-999',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 230. Lucknow — BURNING_WASTE — IN_PROGRESS
  {
    id: 'NS-LKW-20260620-1230',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Waste burning near Bara Imambara heritage precinct. Archaeological Survey has raised alarm — heritage structures at smoke damage risk.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Husainabad Road, Near Bara Imambara, Lucknow', ward: 'Ward 28', wardNumber: 28, area: 'Husainabad', city: 'LUCKNOW', lat: 26.8690, lng: 80.9115 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Rajiv Verma', designation: 'Environment Inspector', phone: '0522-2630-606', email: 'rverma@lmc.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 24,
    filedAt: ago(40 * H), lastUpdatedAt: ago(6 * H),
    department: 'Environment & Pollution Control', municipalBody: 'LMC', portalHelpline: '1800-180-5125',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 7,
  },

  // 231. Patna — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-PAT-20260614-1231',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Brick kiln near Danapur cantonment operating without pollution control. AQI in residential area touching 400 — asthma cases tripling.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Danapur Cantonment Road, Near Danapur Station, Patna', ward: 'Ward 7', wardNumber: 7, area: 'Danapur', city: 'PATNA', lat: 25.6263, lng: 85.0409 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Prakash Ranjan', designation: 'Environment Officer', phone: '0612-2688-701', email: 'pranjan@pmc.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 12,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'PMC', portalHelpline: '0612-2688-500',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Officer Malti Devi',            email: 'mdevi@pmc.gov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner PMC',        email: 'addl.comm@pmc.gov.in',status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 24,
  },

  // 232. Bhopal — FALLEN_WIRE — IN_PROGRESS
  {
    id: 'NS-BHO-20260626-1232',
    issueType: 'FALLEN_WIRE',
    issueDescription: 'Overhead electric wire snapped near Shyamla Hills water tank. Wire dangling across footpath — area roped off by locals with sarees.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Shyamla Hills Road, Near Water Tank, Bhopal', ward: 'Ward 5', wardNumber: 5, area: 'Shyamla Hills', city: 'BHOPAL', lat: 23.2521, lng: 77.4005 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Ashok Malhotra', designation: 'Electrical Emergency Officer', phone: '0755-2777-801', email: 'amalhotra@bmcgov.in' },
    slaDeadline: ahead(1 * H), slaHours: 6,
    filedAt: ago(5 * H), lastUpdatedAt: ago(1 * H),
    department: 'Electrical Works', municipalBody: 'BMC', portalHelpline: '0755-2777-744',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 4,
  },

  // 233. Surat — DEAD_ANIMAL — FILED
  {
    id: 'NS-SUR-20260627-1233',
    issueType: 'DEAD_ANIMAL',
    issueDescription: 'Dead cow on Ring Road near Bhestan. Busy commercial road with heavy truck traffic — carcass creating serious safety hazard.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ring Road, Near Bhestan, Surat', ward: 'Ward 60', wardNumber: 60, area: 'Bhestan', city: 'SURAT' as City, lat: 21.2412, lng: 72.8604 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(10 * H), slaHours: 12,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Public Health & Sanitation', municipalBody: 'SMC', portalHelpline: '261-2420-077',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 234. Nagpur — STRAY_DOG — IN_PROGRESS
  {
    id: 'NS-NGP-20260622-1234',
    issueType: 'STRAY_DOG',
    issueDescription: 'Aggressive stray dogs near Deekshabhoomi — Buddhist pilgrimage site. Foreign pilgrims attacked near Ambedkar Memorial.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Deekshabhoomi Road, Near Ambedkar Memorial, Nagpur', ward: 'Ward 25', wardNumber: 25, area: 'Deekshabhoomi', city: 'NAGPUR' as City, lat: 21.1256, lng: 79.0572 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Pallavi Ramteke', designation: 'Animal Welfare Officer', phone: '0712-2560-701', email: 'pramteke@nmc.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 24,
    filedAt: ago(42 * H), lastUpdatedAt: ago(4 * H),
    department: 'Animal Welfare', municipalBody: 'NMC', portalHelpline: '1800-233-0808',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 9,
  },

  // 235. Varanasi — WATER_SUPPLY — FAKE_CLOSURE_DETECTED
  {
    id: 'NS-VNS-20260619-1235',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Jal Nigam water supply absent in Nadesar area for 5 days. Varanasi airport zone — hotel guests forced to buy water.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Nadesar, Near Lal Bahadur Shastri Airport Road, Varanasi', ward: 'Ward 58', wardNumber: 58, area: 'Nadesar', city: 'VARANASI' as City, lat: 25.3401, lng: 82.9610 },
    status: 'FAKE_CLOSURE_DETECTED',
    assignedOfficer: { name: 'Virendra Mishra', designation: 'Water Works Engineer', phone: '0542-2500-701', email: 'vmishra@vnn.gov.in' },
    slaDeadline: ago(4 * D), slaHours: 24,
    filedAt: ago(6 * D), lastUpdatedAt: ago(3 * D),
    department: 'Water Supply', municipalBody: 'VNN', portalHelpline: '0542-2500-065',
    escalations: [{ level: 'WARD_OFFICER', date: ago(3 * D), to: 'Ward Officer Rekha Singh', email: 'rsingh@vnn.gov.in', status: 'SENT' }],
    fakeClosureAnalysis: { probability: 77, isSuspicious: true, flags: [
      { flag: 'SPEED',    points: 29, detail: 'Closed 50 min after assignment — 5-day outage needs system check' },
      { flag: 'NO_PHOTO', points: 25, detail: 'No repair completion photo or pipeline work record' },
      { flag: 'REOPEN',   points: 23, detail: 'Nadesar supply failure: second complaint this month' },
    ], recommendation: 'DISPUTE' },
    communityClusterSize: 11,
  },

  // 236. Kochi — AIR_POLLUTION — ESCALATED
  {
    id: 'NS-KOC-20260613-1236',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Smoke from Kochi Refineries BPCL venting units affecting Ambalamugal residential area. Sulphur smell causing headaches and nausea.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Ambalamugal, Near BPCL Refinery Gate, Kochi', ward: 'Ward 92', wardNumber: 92, area: 'Ambalamugal', city: 'KOCHI' as City, lat: 9.9598, lng: 76.3491 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Sunil Varghese', designation: 'Environment Officer', phone: '0484-2335-801', email: 'svarghese@kochicorp.gov.in' },
    slaDeadline: ago(12 * D), slaHours: 12,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Environment & Pollution Control', municipalBody: 'KOCHI-CORP', portalHelpline: '0484-2335-522',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Councillor Roshan Jose',       email: 'rjose@kochicorp.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Deputy Mayor Office Kochi',         email: 'deputymayor@kochicorp.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 21,
  },

  // 237. Coimbatore — AIR_POLLUTION — IN_PROGRESS
  {
    id: 'NS-CBE-20260621-1237',
    issueType: 'AIR_POLLUTION',
    issueDescription: 'Foundry units near Ganapathy industrial area emitting thick black smoke without scrubbers. Workers in adjacent factory shifting to masks.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Ganapathy Industrial Estate, Coimbatore', ward: 'Ward 35', wardNumber: 35, area: 'Ganapathy', city: 'COIMBATORE' as City, lat: 11.0388, lng: 76.9866 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Balasubramanian N.', designation: 'Environment Inspector', phone: '0422-2394-801', email: 'nbala@ccmc.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 24,
    filedAt: ago(38 * H), lastUpdatedAt: ago(7 * H),
    department: 'Environment & Pollution Control', municipalBody: 'CCMC', portalHelpline: '0422-2394-399',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 13,
  },

  // 238. Visakhapatnam — BURNING_WASTE — FILED
  {
    id: 'NS-VIZ-20260627-1238',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Fishing net waste being burned on Fishermen Colony beach, Visakhapatnam. Highly toxic PVC smoke wafting into beach resort area.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Fishermen Colony, Near Tenneti Park, Visakhapatnam', ward: 'Ward 38', wardNumber: 38, area: 'Fishermen Colony', city: 'VISAKHAPATNAM' as City, lat: 17.7430, lng: 83.3600 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Environment & Pollution Control', municipalBody: 'GVMC', portalHelpline: '0891-2564-422',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 239. Chandigarh — WATER_SUPPLY — IN_PROGRESS
  {
    id: 'NS-CHD-20260622-1239',
    issueType: 'WATER_SUPPLY',
    issueDescription: 'Water supply reduced to 45 min per day in Sector 40 D. Pipeline laid 40 years ago — bore holes leaking pressure. Old town area crisis.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Sector 40 D, Near Sector 40 Market, Chandigarh', ward: 'Ward 40', wardNumber: 40, area: 'Sector 40', city: 'CHANDIGARH' as City, lat: 30.7222, lng: 76.7646 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Bikramjit Singh', designation: 'Water Works Engineer', phone: '0172-2749-701', email: 'bsingh@mc-chd.gov.in' },
    slaDeadline: ahead(10 * H), slaHours: 48,
    filedAt: ago(38 * H), lastUpdatedAt: ago(6 * H),
    department: 'Water Supply', municipalBody: 'MC-CHD', portalHelpline: '0172-2749-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 10,
  },

  // 240. Indore — STREET_LIGHT — ESCALATED
  {
    id: 'NS-IDR-20260614-1240',
    issueType: 'STREET_LIGHT',
    issueDescription: 'Street lights on Super Corridor — Indore IT hub road — non-functional for 14 days. Night shifts at Infosys and TCS campus unsafe.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Super Corridor, Near Infosys Campus, Indore', ward: 'Ward 82', wardNumber: 82, area: 'Super Corridor', city: 'INDORE' as City, lat: 22.7969, lng: 75.9076 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Rajkumar Patel', designation: 'Electrical Engineer', phone: '0731-2520-701', email: 'rkpatel@imcgov.in' },
    slaDeadline: ago(12 * D), slaHours: 48,
    filedAt: ago(14 * D), lastUpdatedAt: ago(2 * D),
    department: 'Electrical Works', municipalBody: 'IMC', portalHelpline: '0731-2520-222',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(12 * D), to: 'Ward Officer Meera Yadav',          email: 'myadav@imcgov.in',    status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(6 * D),  to: 'Additional Commissioner IMC',       email: 'addl.comm@imcgov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 17,
  },

  // 241. Agra — DRAINAGE — IN_PROGRESS
  {
    id: 'NS-AGR-20260622-1241',
    issueType: 'DRAINAGE',
    issueDescription: 'Drain near Taj View Hotel blocked — flooding on tourist approach road. FCI hotel guests wading through water to reach Taj Mahal.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Taj East Gate Road, Near Taj View Hotel, Agra', ward: 'Ward 81', wardNumber: 81, area: 'Taj East', city: 'AGRA' as City, lat: 27.1726, lng: 78.0463 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Deepak Sharma', designation: 'Drainage Inspector', phone: '0562-2464-801', email: 'dsharma@amcagr.gov.in' },
    slaDeadline: ahead(8 * H), slaHours: 48,
    filedAt: ago(40 * H), lastUpdatedAt: ago(6 * H),
    department: 'Storm Water Drainage', municipalBody: 'AMC-AGR', portalHelpline: '0562-2464-500',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 8,
  },

  // 242. Bhubaneswar — STRAY_DOG — ESCALATED
  {
    id: 'NS-BHU-20260614-1242',
    issueType: 'STRAY_DOG',
    issueDescription: 'Stray dogs near AIIMS Bhubaneswar biting patients\' attendants at night. 5 attack incidents this week near emergency gate.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'AIIMS Bhubaneswar, Sijua, Bhubaneswar', ward: 'Ward 66', wardNumber: 66, area: 'Sijua', city: 'BHUBANESWAR' as City, lat: 20.2396, lng: 85.8136 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Pratap Sahu', designation: 'Animal Welfare Officer', phone: '0674-2536-601', email: 'psahu@bmc-bhu.gov.in' },
    slaDeadline: ago(9 * D), slaHours: 24,
    filedAt: ago(13 * D), lastUpdatedAt: ago(4 * D),
    department: 'Animal Welfare', municipalBody: 'BMC-BHU', portalHelpline: '0674-2536-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(9 * D), to: 'Ward Officer Manorama Das',          email: 'mdas@bmc-bhu.gov.in',  status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(4 * D), to: 'Additional Commissioner BMC',        email: 'addl.comm@bmc-bhu.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 14,
  },

  // 243. Guwahati — BROKEN_FOOTPATH — IN_PROGRESS
  {
    id: 'NS-GWH-20260621-1243',
    issueType: 'BROKEN_FOOTPATH',
    issueDescription: 'Footpath near Guwahati High Court completely broken — advocates in court dress tripping on debris. Dignity of court premises affected.',
    severity: 'MEDIUM', priority: 'P3',
    location: { address: 'Guwahati High Court Road, Fancy Bazar, Guwahati', ward: 'Ward 9', wardNumber: 9, area: 'Fancy Bazar', city: 'GUWAHATI' as City, lat: 26.1866, lng: 91.7523 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Mitu Barua', designation: 'Civil Engineer', phone: '0361-2736-501', email: 'mbarua@gmc.gov.in' },
    slaDeadline: ahead(20 * H), slaHours: 72,
    filedAt: ago(52 * H), lastUpdatedAt: ago(8 * H),
    department: 'Roads & Buildings', municipalBody: 'GMC', portalHelpline: '0361-2736-200',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 6,
  },

  // 244. Thiruvananthapuram — BURNING_WASTE — IN_PROGRESS
  {
    id: 'NS-TRV-20260621-1244',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Biomedical waste from private clinic being burned behind Pettah market. Ash particles landing on vegetable sellers\' produce.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Pettah Market Road, Near Pettah Junction, Thiruvananthapuram', ward: 'Ward 8', wardNumber: 8, area: 'Pettah', city: 'THIRUVANANTHAPURAM' as City, lat: 8.5091, lng: 76.9430 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Suresh Kumar P.', designation: 'Environment Inspector', phone: '0471-2327-701', email: 'pksuresh@tvmc.gov.in' },
    slaDeadline: ahead(6 * H), slaHours: 12,
    filedAt: ago(6 * H), lastUpdatedAt: ago(1 * H),
    department: 'Environment & Pollution Control', municipalBody: 'TVMC', portalHelpline: '0471-2327-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 5,
  },

  // 245. Ranchi — BURNING_WASTE — FILED
  {
    id: 'NS-RNC-20260627-1245',
    issueType: 'BURNING_WASTE',
    issueDescription: 'Jharkhand High Court compound boundary — forest land adjoining court being cleared by fire. Court registry complained to administration.',
    severity: 'HIGH', priority: 'P2',
    location: { address: 'Jharkhand High Court Road, Near High Court Building, Ranchi', ward: 'Ward 15', wardNumber: 15, area: 'High Court', city: 'RANCHI' as City, lat: 23.3504, lng: 85.3350 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(20 * H), slaHours: 24,
    filedAt: ago(4 * H), lastUpdatedAt: ago(4 * H),
    department: 'Environment & Solid Waste', municipalBody: 'RMC', portalHelpline: '0651-2208-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 2,
  },

  // 246. Amritsar — DRAINAGE — IN_PROGRESS
  {
    id: 'NS-AMR-20260620-1246',
    issueType: 'DRAINAGE',
    issueDescription: "Main drain near Golden Temple parking blocked causing flooding on mela season. Pilgrims' cars and buses stranded in 1ft water.",
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Golden Temple Parking, Near Langar Hall, Amritsar', ward: 'Ward 25', wardNumber: 25, area: 'Golden Temple', city: 'AMRITSAR' as City, lat: 31.6200, lng: 74.8765 },
    status: 'IN_PROGRESS',
    assignedOfficer: { name: 'Balwant Kaur', designation: 'Drainage Engineer', phone: '0183-2564-701', email: 'bkaur@amc-amr.gov.in' },
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(30 * 60 * 1000),
    department: 'Storm Water Drainage', municipalBody: 'AMC-AMR', portalHelpline: '0183-2564-000',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 3,
  },

  // 247. Ludhiana — DRAINAGE — ESCALATED
  {
    id: 'NS-LDH-20260614-1247',
    issueType: 'DRAINAGE',
    issueDescription: 'Sidhwan Canal storm outfall blocked at Dugri Phase 1 — residential colony floods to 2ft depth every rain. 800 houses affected.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Dugri Phase 1, Near Sidhwan Canal, Ludhiana', ward: 'Ward 72', wardNumber: 72, area: 'Dugri', city: 'LUDHIANA' as City, lat: 30.8651, lng: 75.8272 },
    status: 'ESCALATED',
    assignedOfficer: { name: 'Gurdeep Dhaliwal', designation: 'Drainage Engineer', phone: '0161-2401-601', email: 'gdhaliwal@lmc-ldh.gov.in' },
    slaDeadline: ago(11 * D), slaHours: 12,
    filedAt: ago(13 * D), lastUpdatedAt: ago(2 * D),
    department: 'Drainage & Flood Control', municipalBody: 'LMC-LDH', portalHelpline: '0161-2401-000',
    escalations: [
      { level: 'WARD_OFFICER',        date: ago(11 * D), to: 'Ward Councillor Manjit Dhaliwal',   email: 'mdhaliwal@lmc-ldh.gov.in', status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER', date: ago(5 * D),  to: 'Additional Commissioner LMC',       email: 'addl.comm@lmc-ldh.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: undefined, communityClusterSize: 26,
  },

  // 248. Mumbai — STRAY_DOG — RTI_FILED
  {
    id: 'NS-MUM-20260603-1248',
    issueType: 'STRAY_DOG',
    issueDescription: 'Repeated dog bites in Dharavi — 22 residents bitten over 3 months. MCGM Animal Birth Control programme has zero coverage in this ward.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: '90 Feet Road, Near Dharavi Compound, Dharavi, Mumbai', ward: 'Ward 151', wardNumber: 151, area: 'Dharavi', city: 'MUMBAI', lat: 19.0459, lng: 72.8556 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Varsha Holkar', designation: 'Animal Welfare Officer', phone: '022-2659-1177', email: 'vholkar@mcgm.gov.in' },
    slaDeadline: ago(22 * D), slaHours: 24,
    filedAt: ago(24 * D), lastUpdatedAt: ago(2 * D),
    department: 'Animal Welfare', municipalBody: 'MCGM', portalHelpline: '1916',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(22 * D), to: 'Ward Officer Meenakshi Kadam',        email: 'mkadam@mcgm.gov.in',       status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(16 * D), to: 'DC M-East Ward MCGM',                 email: 'dc.meast@mcgm.gov.in',     status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(9 * D),  to: "Commissioner MCGM",                   email: 'commissioner@mcgm.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 65, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 35, detail: '22 bite incidents — ABC programme absent 6+ months' },
      { flag: 'DELAY',  points: 30, detail: 'CRITICAL public safety issue — 24 days unresolved' },
    ], recommendation: 'RTI' },
    communityClusterSize: 22,
  },

  // 249. Delhi — MANHOLE — FILED
  {
    id: 'NS-DEL-20260627-1249',
    issueType: 'MANHOLE',
    issueDescription: 'Manhole cover missing on Outer Ring Road near Mukherjee Nagar flyover. High-speed road — life-threatening hazard in dark hours.',
    severity: 'CRITICAL', priority: 'P1',
    location: { address: 'Outer Ring Road, Near Mukherjee Nagar Flyover, Delhi', ward: 'Ward 20', wardNumber: 20, area: 'Mukherjee Nagar', city: 'DELHI', lat: 28.7074, lng: 77.2094 },
    status: 'FILED',
    assignedOfficer: undefined,
    slaDeadline: ahead(4 * H), slaHours: 6,
    filedAt: ago(2 * H), lastUpdatedAt: ago(2 * H),
    department: 'Roads & Traffic', municipalBody: 'MCD', portalHelpline: '1800-11-0097',
    escalations: [], fakeClosureAnalysis: undefined, communityClusterSize: 1,
  },

  // 250. Bengaluru — OTHER — RTI_FILED
  {
    id: 'NS-BLR-20260602-1250',
    issueType: 'OTHER',
    issueDescription: 'BBMP road cutting permissions given to 4 agencies simultaneously on the same road in Koramangala — uncoordinated trenching destroying road for 2 months.',
    severity: 'HIGH', priority: 'P2',
    location: { address: '80 Feet Road, 4th Block, Koramangala, Bengaluru', ward: 'Ward 108', wardNumber: 108, area: 'Koramangala', city: 'BENGALURU', lat: 12.9343, lng: 77.6235 },
    status: 'RTI_FILED',
    assignedOfficer: { name: 'Venkatesh Murthy', designation: 'Roads Coordinator', phone: '080-2297-1111', email: 'vmurthy@bbmp.gov.in' },
    slaDeadline: ago(23 * D), slaHours: 72,
    filedAt: ago(25 * D), lastUpdatedAt: ago(2 * D),
    department: 'Roads & Infrastructure', municipalBody: 'BBMP', portalHelpline: '1533',
    escalations: [
      { level: 'WARD_OFFICER',           date: ago(23 * D), to: 'Ward Officer Roopa Bhat',             email: 'rbhat@bbmp.gov.in',        status: 'RESPONDED' },
      { level: 'DEPUTY_COMMISSIONER',    date: ago(16 * D), to: 'DC South East Zone BBMP',             email: 'dc.se@bbmp.gov.in',        status: 'RESPONDED' },
      { level: 'MUNICIPAL_COMMISSIONER', date: ago(8 * D),  to: "Commissioner BBMP",                   email: 'commissioner@bbmp.gov.in', status: 'SENT' },
    ],
    fakeClosureAnalysis: { probability: 62, isSuspicious: true, flags: [
      { flag: 'REPEAT', points: 32, detail: 'Koramangala 80ft road: sixth complaint from same stretch' },
      { flag: 'DELAY',  points: 30, detail: 'Uncoordinated road cutting permits — systemic failure 2 months' },
    ], recommendation: 'RTI' },
    communityClusterSize: 28,
  },
];
