// lib/allWardsData.ts — All ~2633 wards across 18 Indian cities
// Generated from real zone/borough structures + approximate coordinates

export interface Ward {
  id: string;
  wardNumber: number;
  wardName: string;
  city: 'KOLKATA' | 'MUMBAI' | 'BENGALURU' | 'DELHI' | 'CHENNAI' | 'HYDERABAD' | 'PUNE' | 'AHMEDABAD' | 'JAIPUR' | 'LUCKNOW' | 'NAGPUR' | 'BHOPAL' | 'SURAT' | 'INDORE' | 'PATNA' | 'VISAKHAPATNAM' | 'CHANDIGARH' | 'KOCHI';
  municipalBody: string;
  zone: string;
  zoneCode: string;
  lat: number;
  lng: number;
  councillorName: string;
  councillorParty: string;
  mlaConstituency: string;
  mpConstituency: string;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

// ─── Name pools ────────────────────────────────────────────────────────────
const BENGALI_FIRST = ['Tapan','Subir','Prasanta','Debashish','Sumit','Ranjit','Mita','Kakali','Sunita','Priya','Sudip','Jayanta','Bimal','Asim','Goutam','Rekha','Sangita','Mithu','Paramita','Supriya'];
const BENGALI_LAST  = ['Mondal','Roy','Das','Chatterjee','Mukherjee','Banerjee','Ghosh','Bose','Sen','Dey','Chakraborty','Paul','Kundu','Dutta','Sarkar','Biswas','Mitra','Pal','Saha','Haldar'];

const MARATHI_FIRST = ['Ramesh','Suresh','Priya','Savita','Vijay','Sanjay','Rekha','Sunanda','Mahesh','Nilesh','Anil','Sunil','Kavita','Manisha','Ashok','Rajendra','Santosh','Rohini','Hemant','Pushpa'];
const MARATHI_LAST  = ['Patil','Desai','Kadam','Shinde','More','Jadhav','Sawant','Gaikwad','Naik','Pawar','Kulkarni','Deshpande','Joshi','Bhosale','Chavan','Mane','Kale','Salunkhe','Thorat','Nimbalkar'];

const KANNADA_FIRST = ['Nagaraj','Rajesh','Kavitha','Sunitha','Manjunath','Raghavendra','Shobha','Pushpa','Girish','Suresh','Pradeep','Anitha','Venkatesh','Divya','Lokesh','Roopa','Srinivas','Bharathi','Ramesh','Usha'];
const KANNADA_LAST  = ['Gowda','Reddy','Kumar','Naidu','Murthy','Rao','Swamy','Raju','Nair','Sharma','Hegde','Shetty','Bhat','Pai','Kulkarni','Iyengar','Iyer','Garg','Sethi','Malhotra'];

const HINDI_FIRST   = ['Rajesh','Sunita','Manoj','Priya','Vikram','Rekha','Amit','Kavita','Suresh','Anita','Vinod','Meena','Ashok','Poonam','Ramesh','Usha','Sanjay','Geeta','Rohit','Nirmala'];
const HINDI_LAST    = ['Sharma','Gupta','Singh','Kumar','Verma','Mishra','Tiwari','Yadav','Arora','Mehta','Agarwal','Jain','Saxena','Srivastava','Pandey','Dubey','Shukla','Pathak','Chauhan','Rastogi'];

const TAMIL_FIRST   = ['Murugan','Selvam','Kannan','Pandian','Rajendran','Veluchamy','Thangam','Meenakshi','Ponni','Geetha','Arumugam','Annamalai','Karthik','Senthil','Marimuthu','Soundarya','Kavitha','Lakshmi','Jayanthi','Chellammal'];
const TAMIL_LAST    = ['Krishnan','Rajan','Suresh','Natarajan','Venkataraman','Balasubramanian','Annamalai','Ramasamy','Srinivasan','Sundaram','Pillai','Nadar','Gounder','Mudaliar','Thevar','Naicker','Udayar','Chettiar','Vanniyar','Vellalar'];

const TELUGU_FIRST  = ['Venkatesh','Srinivas','Prasad','Ramesh','Suresh','Kavitha','Padmavathi','Lakshmi','Vijaya','Sarada','Ravi','Nagarjuna','Sridhar','Santhosh','Nageswara','Radha','Bhavani','Madhuri','Rekha','Sunitha'];
const TELUGU_LAST   = ['Reddy','Naidu','Rao','Sharma','Goud','Varma','Nayak','Raju','Prasad','Kumar','Chowdary','Murthy','Babu','Swamy','Yadav','Khan','Begum','Qureshi','Hussain','Ali'];

const GUJARATI_FIRST = ['Mahesh','Nilesh','Priya','Seema','Bharat','Rakesh','Asha','Usha','Dinesh','Suresh','Haresh','Ramesh','Jayesh','Yogesh','Hitesh','Bindu','Hansa','Kokila','Manjula','Sarla'];
const GUJARATI_LAST  = ['Patel','Shah','Mehta','Desai','Modi','Joshi','Pandya','Trivedi','Parikh','Thaker','Dave','Sheth','Bhatt','Amin','Kapadia','Gandhi','Dalal','Vora','Mody','Nanavati'];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}
function jitter(base: number, seed: number, range: number): number {
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  return base + ((s - Math.floor(s)) - 0.5) * range;
}
function score(seed: number): { score: number; grade: 'A'|'B'|'C'|'D'|'F' } {
  const s = Math.sin(seed * 127 + 311) * 233280;
  const raw = Math.floor(((s - Math.floor(s))) * 75) + 18; // 18-93
  const grade = raw >= 75 ? 'A' : raw >= 60 ? 'B' : raw >= 45 ? 'C' : raw >= 30 ? 'D' : 'F';
  return { score: raw, grade };
}

// ─── KOLKATA KMC — 144 wards, 16 Boroughs ─────────────────────────────────
const KOL_ZONES: { name: string; code: string; wards: number[]; lat: number; lng: number; desc: string; mla: string; mp: string }[] = [
  { name:'Borough I',   code:'KOL-B01', wards:range(1,10),   lat:22.650, lng:88.380, desc:'North Kolkata – Shyambazar, Hatibagan',     mla:'Shyambazar',    mp:'Kolkata North' },
  { name:'Borough II',  code:'KOL-B02', wards:range(11,21),  lat:22.615, lng:88.375, desc:'Jorabagan, Maniktala',                       mla:'Maniktala',     mp:'Kolkata North' },
  { name:'Borough III', code:'KOL-B03', wards:range(22,30),  lat:22.592, lng:88.372, desc:'Shyambazar South – Girish Park, Sovabazar',  mla:'Belgachia',     mp:'Kolkata North' },
  { name:'Borough IV',  code:'KOL-B04', wards:range(31,38),  lat:22.581, lng:88.367, desc:'Belgachia, Ultadanga',                       mla:'Belgachia',     mp:'Dum Dum' },
  { name:'Borough V',   code:'KOL-B05', wards:range(39,47),  lat:22.575, lng:88.360, desc:'Entally, Beniapukur',                        mla:'Entally',       mp:'Kolkata North' },
  { name:'Borough VI',  code:'KOL-B06', wards:range(48,58),  lat:22.568, lng:88.354, desc:'Central Kolkata – Park Street, AJC Bose Rd', mla:'Rashbehari',    mp:'Kolkata South' },
  { name:'Borough VII', code:'KOL-B07', wards:range(59,67),  lat:22.562, lng:88.344, desc:'Ballygunj, Lake Gardens',                    mla:'Rashbehari',    mp:'Kolkata South' },
  { name:'Borough VIII',code:'KOL-B08', wards:range(68,77),  lat:22.553, lng:88.348, desc:'Kalighat, Bhowanipore',                      mla:'Bhowanipore',   mp:'Kolkata South' },
  { name:'Borough IX',  code:'KOL-B09', wards:range(78,88),  lat:22.540, lng:88.345, desc:'Chetla, Tollygunge North',                   mla:'Tollygunge',    mp:'Kolkata South' },
  { name:'Borough X',   code:'KOL-B10', wards:range(89,100), lat:22.523, lng:88.339, desc:'Alipore, New Alipore',                       mla:'Alipore',       mp:'Kolkata South' },
  { name:'Borough XI',  code:'KOL-B11', wards:range(101,111),lat:22.519, lng:88.315, desc:'Garden Reach, Metiabruz',                    mla:'Garden Reach',  mp:'Kolkata South' },
  { name:'Borough XII', code:'KOL-B12', wards:range(112,122),lat:22.499, lng:88.363, desc:'Jadavpur, Tollygunge South',                 mla:'Jadavpur',      mp:'Jadavpur' },
  { name:'Borough XIII',code:'KOL-B13', wards:range(123,133),lat:22.511, lng:88.375, desc:'Kasba, Regent Park',                         mla:'Kasba',         mp:'Jadavpur' },
  { name:'Borough XIV', code:'KOL-B14', wards:range(134,141),lat:22.499, lng:88.394, desc:'Anandapur, Bijoygarh',                       mla:'Kasba',         mp:'Jadavpur' },
  { name:'Borough XV',  code:'KOL-B15', wards:range(142,144),lat:22.507, lng:88.326, desc:'New Alipore South',                          mla:'Alipore',       mp:'Kolkata South' },
];
const KOL_PARTIES = ['AITC','AITC','AITC','AITC','AITC','AITC','AITC','BJP','BJP','AITC','AITC','INC','CPIM','AITC','AITC'];
const KOL_NAMES_W = ['Ultadanga','Shyambazar','Maniktala','Belgachia','Hatibagan','Jorabagan','Sovabazar','Girish Park','Entally','Beniapukur','Park Street','AJC Bose Road','Kalighat','Bhowanipore','Chetla','Alipore','Garden Reach','Metiabruz','Jadavpur','Kasba','Regent Park','Anandapur','Tollygunge','Ballygunj','Lake Gardens','New Market','Hedua','College Street','Rabindra Sarani','Bowbazar','Taltala','Tiljala','Topsia','Bansdroni','Naktala','Dhakuria','Garia','Santoshpur','Haltu'];

// ─── MUMBAI MCGM — 227 wards, 24 Admin Wards ──────────────────────────────
const MUM_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'A Ward – Colaba',           code:'MUM-A',  wards:range(1,8),    lat:18.908, lng:72.813, mla:'Colaba',      mp:'Mumbai South' },
  { name:'B Ward – Mazgaon',          code:'MUM-B',  wards:range(9,18),   lat:18.960, lng:72.840, mla:'Byculla',     mp:'Mumbai South' },
  { name:'C Ward – Matunga',          code:'MUM-C',  wards:range(19,28),  lat:19.024, lng:72.843, mla:'Mahim',       mp:'Mumbai South' },
  { name:'D Ward – Worli',            code:'MUM-D',  wards:range(29,43),  lat:19.011, lng:72.818, mla:'Worli',       mp:'Mumbai South' },
  { name:'E Ward – Byculla',          code:'MUM-E',  wards:range(44,56),  lat:18.976, lng:72.835, mla:'Byculla',     mp:'Mumbai South' },
  { name:'F/N Ward – Sion/Kurla',     code:'MUM-FN', wards:range(57,72),  lat:19.065, lng:72.879, mla:'Kurla',       mp:'Mumbai South Central' },
  { name:'F/S Ward – Chembur',        code:'MUM-FS', wards:range(73,84),  lat:19.061, lng:72.899, mla:'Chembur',     mp:'Mumbai South Central' },
  { name:'G/N Ward – Dharavi',        code:'MUM-GN', wards:range(85,96),  lat:19.040, lng:72.851, mla:'Dharavi',     mp:'Mumbai South Central' },
  { name:'G/S Ward – Sion',           code:'MUM-GS', wards:range(97,107), lat:19.042, lng:72.866, mla:'Sion Koliwada',mp:'Mumbai South Central' },
  { name:'H/E Ward – Bandra East',    code:'MUM-HE', wards:range(108,119),lat:19.054, lng:72.855, mla:'Bandra East', mp:'Mumbai North Central' },
  { name:'H/W Ward – Bandra West',    code:'MUM-HW', wards:range(120,130),lat:19.061, lng:72.834, mla:'Vandre West',  mp:'Mumbai North Central' },
  { name:'K/E Ward – Andheri East',   code:'MUM-KE', wards:range(131,140),lat:19.114, lng:72.877, mla:'Andheri East', mp:'Mumbai North East' },
  { name:'K/W Ward – Andheri West',   code:'MUM-KW', wards:range(141,150),lat:19.119, lng:72.845, mla:'Andheri West', mp:'Mumbai North West' },
  { name:'L Ward – Kurla',            code:'MUM-L',  wards:range(151,162),lat:19.075, lng:72.883, mla:'Kurla',        mp:'Mumbai South Central' },
  { name:'M/E Ward – Chembur East',   code:'MUM-ME', wards:range(163,173),lat:19.062, lng:72.904, mla:'Chembur',      mp:'Mumbai South Central' },
  { name:'M/W Ward – Dharavi South',  code:'MUM-MW', wards:range(174,183),lat:19.045, lng:72.857, mla:'Dharavi',      mp:'Mumbai South Central' },
  { name:'N Ward – Ghatkopar',        code:'MUM-N',  wards:range(184,194),lat:19.089, lng:72.909, mla:'Ghatkopar East',mp:'Mumbai North East' },
  { name:'P/N Ward – Goregaon',       code:'MUM-PN', wards:range(195,203),lat:19.161, lng:72.848, mla:'Goregaon',     mp:'Mumbai North West' },
  { name:'P/S Ward – Jogeshwari',     code:'MUM-PS', wards:range(204,211),lat:19.133, lng:72.846, mla:'Jogeshwari East',mp:'Mumbai North West' },
  { name:'R/C Ward – Borivali Central',code:'MUM-RC',wards:range(212,218),lat:19.234, lng:72.855, mla:'Borivali',     mp:'Mumbai North' },
  { name:'R/N Ward – Dahisar',        code:'MUM-RN', wards:range(219,221),lat:19.262, lng:72.855, mla:'Dahisar',      mp:'Mumbai North' },
  { name:'R/S Ward – Kandivali',      code:'MUM-RS', wards:range(222,224),lat:19.204, lng:72.842, mla:'Kandivali East',mp:'Mumbai North' },
  { name:'S Ward – Mulund',           code:'MUM-S',  wards:range(225,226),lat:19.176, lng:72.960, mla:'Mulund',       mp:'Mumbai North East' },
  { name:'T Ward – Mulund East',      code:'MUM-T',  wards:range(227,227),lat:19.171, lng:72.956, mla:'Mulund',       mp:'Mumbai North East' },
];
const MUM_PARTIES_W = ['Shiv Sena (Shinde)','BJP','NCP (Ajit)','Shiv Sena (UBT)','Congress','BJP','Shiv Sena (Shinde)','NCP (Ajit)','Shiv Sena (UBT)','Congress','BJP','Shiv Sena (Shinde)','NCP (Ajit)','BJP'];

// ─── BENGALURU BBMP — 198 wards, 8 Zones ──────────────────────────────────
const BLR_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Yelahanka Zone',     code:'BLR-YEL', wards:range(1,24),    lat:13.100, lng:77.596, mla:'Yelahanka',      mp:'Bengaluru North' },
  { name:'Dasarahalli Zone',   code:'BLR-DAS', wards:range(25,50),   lat:13.033, lng:77.534, mla:'Dasarahalli',    mp:'Bengaluru North' },
  { name:'West Zone',          code:'BLR-WST', wards:range(51,74),   lat:12.973, lng:77.558, mla:'Rajajinagar',    mp:'Bengaluru Central' },
  { name:'South Zone',         code:'BLR-STH', wards:range(75,100),  lat:12.902, lng:77.571, mla:'Jayanagar',      mp:'Bengaluru South' },
  { name:'East Zone',          code:'BLR-EST', wards:range(101,125), lat:13.012, lng:77.683, mla:'K R Puram',      mp:'Bengaluru North' },
  { name:'Mahadevapura Zone',  code:'BLR-MHD', wards:range(126,150), lat:12.984, lng:77.735, mla:'Mahadevapura',   mp:'Bengaluru North' },
  { name:'Bommanahalli Zone',  code:'BLR-BMH', wards:range(151,177), lat:12.903, lng:77.646, mla:'BTM Layout',     mp:'Bengaluru South' },
  { name:'RR Nagar Zone',      code:'BLR-RRN', wards:range(178,198), lat:12.919, lng:77.510, mla:'Rajarajeshwari Nagar', mp:'Bengaluru South' },
];
const BLR_PARTIES_W = ['Congress','Congress','Congress','BJP','Congress','BJP','JD(S)','Congress','BJP','Congress','JD(S)','Congress'];

// ─── DELHI MCD — 250 wards, 12 Zones ──────────────────────────────────────
const DEL_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'City SP Zone',         code:'DEL-CSP', wards:range(1,18),   lat:28.652, lng:77.230, mla:'Ballimaran',   mp:'Chandni Chowk' },
  { name:'Civil Lines Zone',     code:'DEL-CIV', wards:range(19,36),  lat:28.700, lng:77.218, mla:'Civil Lines',  mp:'North West Delhi' },
  { name:'Karol Bagh Zone',      code:'DEL-KAR', wards:range(37,54),  lat:28.651, lng:77.190, mla:'Patel Nagar',  mp:'West Delhi' },
  { name:'Keshavpuram Zone',     code:'DEL-KES', wards:range(55,72),  lat:28.690, lng:77.165, mla:'Wazirpur',     mp:'North West Delhi' },
  { name:'Najafgarh Zone',       code:'DEL-NAJ', wards:range(73,90),  lat:28.608, lng:76.983, mla:'Bijwasan',     mp:'West Delhi' },
  { name:'Narela Zone',          code:'DEL-NAR', wards:range(91,108), lat:28.847, lng:77.094, mla:'Narela',       mp:'North West Delhi' },
  { name:'Rohini Zone',          code:'DEL-ROH', wards:range(109,126),lat:28.742, lng:77.068, mla:'Rohini',       mp:'North West Delhi' },
  { name:'Shahdara North Zone',  code:'DEL-SHN', wards:range(127,144),lat:28.694, lng:77.310, mla:'Mustafabad',   mp:'North East Delhi' },
  { name:'Shahdara South Zone',  code:'DEL-SHS', wards:range(145,162),lat:28.643, lng:77.305, mla:'Gandhi Nagar', mp:'East Delhi' },
  { name:'South Zone',           code:'DEL-STH', wards:range(163,198),lat:28.550, lng:77.247, mla:'Mehrauli',     mp:'South Delhi' },
  { name:'West Zone',            code:'DEL-WST', wards:range(199,222),lat:28.644, lng:77.099, mla:'Dwarka',       mp:'West Delhi' },
  { name:'Central Zone',         code:'DEL-CEN', wards:range(223,250),lat:28.632, lng:77.225, mla:'New Delhi',    mp:'New Delhi' },
];
const DEL_PARTIES_W = ['BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','AAP','AAP','AAP','BJP','AAP','BJP'];

// ─── CHENNAI GCC — 200 wards, 15 Zones ────────────────────────────────────
const CHN_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Zone I – Thiruvottiyur',  code:'CHN-Z01', wards:range(1,13),    lat:13.159, lng:80.309, mla:'Thiruvottiyur', mp:'Chennai North' },
  { name:'Zone II – Manali',        code:'CHN-Z02', wards:range(14,26),   lat:13.167, lng:80.269, mla:'Kolathur',      mp:'Chennai North' },
  { name:'Zone III – Madhavaram',   code:'CHN-Z03', wards:range(27,39),   lat:13.148, lng:80.237, mla:'Madhavaram',    mp:'Chennai North' },
  { name:'Zone IV – Tondiarpet',    code:'CHN-Z04', wards:range(40,52),   lat:13.121, lng:80.296, mla:'Harbour',       mp:'Chennai North' },
  { name:'Zone V – Royapuram',      code:'CHN-Z05', wards:range(53,65),   lat:13.113, lng:80.283, mla:'Royapuram',     mp:'Chennai North' },
  { name:'Zone VI – Anna Nagar',    code:'CHN-Z06', wards:range(66,78),   lat:13.086, lng:80.214, mla:'Anna Nagar',    mp:'Chennai Central' },
  { name:'Zone VII – Ambattur',     code:'CHN-Z07', wards:range(79,91),   lat:13.098, lng:80.172, mla:'Ambattur',      mp:'Chennai Central' },
  { name:'Zone VIII – Valasaravakkam',code:'CHN-Z08',wards:range(92,104), lat:13.044, lng:80.178, mla:'Valasaravakkam',mp:'Chennai Central' },
  { name:'Zone IX – Teynampet',     code:'CHN-Z09', wards:range(105,117), lat:13.048, lng:80.251, mla:'Thousand Lights',mp:'Chennai Central' },
  { name:'Zone X – Kodambakkam',    code:'CHN-Z10', wards:range(118,130), lat:13.049, lng:80.222, mla:'Kodambakkam',   mp:'Chennai Central' },
  { name:'Zone XI – Alandur',       code:'CHN-Z11', wards:range(131,143), lat:12.997, lng:80.209, mla:'Alandur',       mp:'Chennai South' },
  { name:'Zone XII – Adyar',        code:'CHN-Z12', wards:range(144,156), lat:13.000, lng:80.256, mla:'Mylapore',      mp:'Chennai South' },
  { name:'Zone XIII – Perungudi',   code:'CHN-Z13', wards:range(157,169), lat:12.966, lng:80.248, mla:'Sholinganallur', mp:'Chennai South' },
  { name:'Zone XIV – Sholinganallur',code:'CHN-Z14',wards:range(170,182), lat:12.901, lng:80.228, mla:'Sholinganallur', mp:'Chennai South' },
  { name:'Zone XV – Perambur',      code:'CHN-Z15', wards:range(183,200), lat:13.120, lng:80.243, mla:'Perambur',      mp:'Chennai North' },
];
const CHN_PARTIES_W = ['DMK','DMK','DMK','DMK','DMK','AIADMK','DMK','Congress','DMK','DMK','AIADMK','DMK','Congress','DMK','AIADMK'];

// ─── HYDERABAD GHMC — 150 wards, 6 Circles ────────────────────────────────
const HYD_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Charminar Circle',       code:'HYD-CHM', wards:range(1,25),   lat:17.361, lng:80.474, mla:'Charminar',     mp:'Hyderabad' },
  { name:'LB Nagar Circle',        code:'HYD-LBN', wards:range(26,50),  lat:17.339, lng:78.544, mla:'LB Nagar',      mp:'Hyderabad' },
  { name:'Khairatabad Circle',     code:'HYD-KHR', wards:range(51,75),  lat:17.418, lng:78.459, mla:'Khairatabad',   mp:'Secunderabad' },
  { name:'Secunderabad Circle',    code:'HYD-SEC', wards:range(76,100), lat:17.444, lng:78.497, mla:'Secunderabad',  mp:'Secunderabad' },
  { name:'Serilingampally Circle', code:'HYD-SER', wards:range(101,125),lat:17.457, lng:78.383, mla:'Serilingampally',mp:'Secunderabad' },
  { name:'Kukatpally Circle',      code:'HYD-KUK', wards:range(126,150),lat:17.492, lng:78.408, mla:'Kukatpally',    mp:'Secunderabad' },
];
const HYD_PARTIES_W = ['AIMIM','AIMIM','BRS','BJP','Congress','BRS','BJP','AIMIM','BRS','Congress','BJP','BRS'];

// ─── PUNE PMC — 162 wards, 15 Prabhags ────────────────────────────────────
const PUN_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Prabhag 1 – Kasba',       code:'PUN-P01', wards:range(1,11),   lat:18.521, lng:73.856, mla:'Kasba',       mp:'Pune' },
  { name:'Prabhag 2 – Shivajinagar',code:'PUN-P02', wards:range(12,22),  lat:18.530, lng:73.844, mla:'Shivajinagar',mp:'Pune' },
  { name:'Prabhag 3 – Deccan',      code:'PUN-P03', wards:range(23,33),  lat:18.516, lng:73.837, mla:'Kothrud',     mp:'Pune' },
  { name:'Prabhag 4 – Kothrud',     code:'PUN-P04', wards:range(34,44),  lat:18.506, lng:73.816, mla:'Kothrud',     mp:'Pune' },
  { name:'Prabhag 5 – Sinhagad Rd', code:'PUN-P05', wards:range(45,55),  lat:18.477, lng:73.820, mla:'Parvati',     mp:'Pune' },
  { name:'Prabhag 6 – Aundh',       code:'PUN-P06', wards:range(56,66),  lat:18.557, lng:73.809, mla:'Shivajinagar',mp:'Pune' },
  { name:'Prabhag 7 – Bibwewadi',   code:'PUN-P07', wards:range(67,77),  lat:18.471, lng:73.852, mla:'Parvati',     mp:'Pune' },
  { name:'Prabhag 8 – Wanowrie',    code:'PUN-P08', wards:range(78,88),  lat:18.494, lng:73.889, mla:'Hadapsar',    mp:'Pune' },
  { name:'Prabhag 9 – Hadapsar',    code:'PUN-P09', wards:range(89,99),  lat:18.507, lng:73.936, mla:'Hadapsar',    mp:'Baramati' },
  { name:'Prabhag 10 – Yerawada',   code:'PUN-P10', wards:range(100,110),lat:18.543, lng:73.894, mla:'Yerawada',    mp:'Pune' },
  { name:'Prabhag 11 – Vishrantwadi',code:'PUN-P11',wards:range(111,121),lat:18.579, lng:73.889, mla:'Yerawada',    mp:'Shirur' },
  { name:'Prabhag 12 – Kondhwa',    code:'PUN-P12', wards:range(122,132),lat:18.466, lng:73.875, mla:'Hadapsar',    mp:'Baramati' },
  { name:'Prabhag 13 – Warje',      code:'PUN-P13', wards:range(133,143),lat:18.482, lng:73.804, mla:'Khadakwasla', mp:'Pune' },
  { name:'Prabhag 14 – Bhavani Peth',code:'PUN-P14',wards:range(144,154),lat:18.508, lng:73.869, mla:'Bhavani Peth',mp:'Pune' },
  { name:'Prabhag 15 – Camp',       code:'PUN-P15', wards:range(155,162),lat:18.518, lng:73.878, mla:'Cantonment',  mp:'Pune' },
];
const PUN_PARTIES_W = ['BJP','BJP','BJP','BJP','Congress','BJP','Congress','BJP','NCP (Ajit)','BJP','Congress','BJP','BJP','Congress','BJP'];

// ─── AHMEDABAD AMC — 192 wards, 6 Zones ───────────────────────────────────
const AHM_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Central Zone',  code:'AHM-CEN', wards:range(1,32),    lat:23.026, lng:72.585, mla:'Dariyapur',   mp:'Ahmedabad East' },
  { name:'East Zone',     code:'AHM-EST', wards:range(33,64),   lat:22.998, lng:72.645, mla:'Amraiwadi',   mp:'Ahmedabad East' },
  { name:'North Zone',    code:'AHM-NTH', wards:range(65,96),   lat:23.075, lng:72.578, mla:'Chandlodia',  mp:'Gandhinagar' },
  { name:'South Zone',    code:'AHM-STH', wards:range(97,128),  lat:22.971, lng:72.580, mla:'Vatva',       mp:'Ahmedabad South' },
  { name:'West Zone',     code:'AHM-WST', wards:range(129,160), lat:23.035, lng:72.533, mla:'Bopal',       mp:'Ahmedabad West' },
  { name:'New West Zone', code:'AHM-NWS', wards:range(161,192), lat:23.058, lng:72.508, mla:'Ghatlodia',   mp:'Gandhinagar' },
];
const AHM_PARTIES_W = ['BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','BJP','Congress','BJP'];

// ─── JAIPUR JMC — 250 wards, 6 Zones ─────────────────────────────────────
const JAI_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Walled City Zone',  code:'JAI-WCZ', wards:range(1,40),    lat:26.924, lng:75.827, mla:'Hawa Mahal',        mp:'Jaipur' },
  { name:'Civil Lines Zone',  code:'JAI-CLZ', wards:range(41,80),   lat:26.905, lng:75.798, mla:'Civil Lines',       mp:'Jaipur' },
  { name:'Mansarovar Zone',   code:'JAI-MSZ', wards:range(81,120),  lat:26.856, lng:75.769, mla:'Sindhi Camp',       mp:'Jaipur Rural' },
  { name:'Sanganer Zone',     code:'JAI-SGZ', wards:range(121,160), lat:26.823, lng:75.827, mla:'Sanganer',          mp:'Jaipur Rural' },
  { name:'Vaishali Zone',     code:'JAI-VNZ', wards:range(161,200), lat:26.932, lng:75.785, mla:'Vidhyadhar Nagar',  mp:'Jaipur' },
  { name:'Sirsi Zone',        code:'JAI-SRZ', wards:range(201,250), lat:26.859, lng:75.766, mla:'Adarsh Nagar',      mp:'Jaipur Rural' },
];
const JAI_PARTIES_W = ['BJP','BJP','BJP','BJP','BJP','Congress','IND','BJP','Congress','BJP','BJP','IND'];

// ─── LUCKNOW LMC — 110 wards, 5 Zones ────────────────────────────────────
const LKW_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Central Zone', code:'LKW-CEN', wards:range(1,22),   lat:26.857, lng:80.950, mla:'Lucknow Central', mp:'Lucknow' },
  { name:'East Zone',    code:'LKW-EST', wards:range(23,44),  lat:26.851, lng:80.994, mla:'Lucknow East',    mp:'Lucknow' },
  { name:'West Zone',    code:'LKW-WST', wards:range(45,66),  lat:26.840, lng:80.904, mla:'Lucknow West',    mp:'Lucknow' },
  { name:'North Zone',   code:'LKW-NTH', wards:range(67,88),  lat:26.892, lng:80.944, mla:'Lucknow North',   mp:'Lucknow' },
  { name:'South Zone',   code:'LKW-STH', wards:range(89,110), lat:26.817, lng:80.941, mla:'Lucknow South',   mp:'Lucknow' },
];
const LKW_PARTIES_W = ['SP','BJP','BSP','Congress','SP','BJP','BSP','SP','BJP','Congress','SP','BJP'];

// ─── NAGPUR NMC — 151 wards, 10 Zones ────────────────────────────────────
const NGP_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Dhantoli Zone',       code:'NGP-DHN', wards:range(1,15),    lat:21.140, lng:79.088, mla:'Nagpur South',   mp:'Nagpur' },
  { name:'Gandhibagh Zone',     code:'NGP-GBG', wards:range(16,30),   lat:21.154, lng:79.081, mla:'Nagpur West',    mp:'Nagpur' },
  { name:'Hanuman Nagar Zone',  code:'NGP-HNN', wards:range(31,45),   lat:21.139, lng:79.108, mla:'Nagpur East',    mp:'Nagpur' },
  { name:'Lakadganj Zone',      code:'NGP-LKD', wards:range(46,60),   lat:21.158, lng:79.101, mla:'Nagpur Central', mp:'Nagpur' },
  { name:'Mangalwari Zone',     code:'NGP-MNG', wards:range(61,75),   lat:21.148, lng:79.068, mla:'Nagpur South',   mp:'Nagpur' },
  { name:'Nehru Nagar Zone',    code:'NGP-NHN', wards:range(76,90),   lat:21.129, lng:79.098, mla:'Nagpur East',    mp:'Nagpur' },
  { name:'Sadar Zone',          code:'NGP-SAD', wards:range(91,105),  lat:21.133, lng:79.073, mla:'Nagpur West',    mp:'Nagpur' },
  { name:'Sataranjipura Zone',  code:'NGP-STR', wards:range(106,120), lat:21.172, lng:79.098, mla:'Nagpur North',   mp:'Nagpur' },
  { name:'Surendragarh Zone',   code:'NGP-SRG', wards:range(121,135), lat:21.125, lng:79.057, mla:'Ramtek',         mp:'Nagpur' },
  { name:'Ashi Nagar Zone',     code:'NGP-ASH', wards:range(136,151), lat:21.116, lng:79.074, mla:'Nagpur North',   mp:'Nagpur' },
];
const NGP_PARTIES_W = ['BJP','Congress','BJP','BJP','Shiv Sena','Congress','BJP','Shiv Sena','Congress','BJP','BJP','Congress'];

// ─── BHOPAL BMC — 85 wards, 6 Zones ──────────────────────────────────────
const BHO_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Old Bhopal Zone',  code:'BHO-OLD', wards:range(1,14),   lat:23.270, lng:77.411, mla:'Huzur',         mp:'Bhopal' },
  { name:'New Bhopal Zone',  code:'BHO-NEW', wards:range(15,28),  lat:23.208, lng:77.437, mla:'Narottam Das',  mp:'Bhopal' },
  { name:'Kolar Zone',       code:'BHO-KOL', wards:range(29,42),  lat:23.178, lng:77.440, mla:'Huzur',         mp:'Bhopal' },
  { name:'Shahpura Zone',    code:'BHO-SHP', wards:range(43,56),  lat:23.195, lng:77.467, mla:'Govindpura',    mp:'Bhopal' },
  { name:'Berasia Zone',     code:'BHO-BER', wards:range(57,70),  lat:23.247, lng:77.455, mla:'Berasia',       mp:'Bhopal' },
  { name:'TT Nagar Zone',    code:'BHO-TTN', wards:range(71,85),  lat:23.229, lng:77.397, mla:'Narottam Das',  mp:'Bhopal' },
];
const BHO_PARTIES_W = ['BJP','BJP','BJP','BJP','Congress','BJP','BJP','Congress','BJP','BJP','BJP','Congress'];

// ─── SURAT SMC — 120 wards, 7 Zones ──────────────────────────────────────
const SUR_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Central Zone',   code:'SUR-CEN', wards:range(1,17),    lat:21.195, lng:72.831, mla:'Surat South',      mp:'Surat' },
  { name:'East Zone',      code:'SUR-EST', wards:range(18,34),   lat:21.190, lng:72.870, mla:'Varachha Road',    mp:'Surat' },
  { name:'West Zone',      code:'SUR-WST', wards:range(35,51),   lat:21.183, lng:72.798, mla:'Surat West',       mp:'Surat' },
  { name:'South Zone',     code:'SUR-STH', wards:range(52,68),   lat:21.161, lng:72.831, mla:'Surat South',      mp:'Surat' },
  { name:'North Zone',     code:'SUR-NTH', wards:range(69,85),   lat:21.221, lng:72.847, mla:'Surat North',      mp:'Surat' },
  { name:'Katargam Zone',  code:'SUR-KAT', wards:range(86,102),  lat:21.226, lng:72.812, mla:'Katargam',         mp:'Surat' },
  { name:'Olpad Zone',     code:'SUR-OLP', wards:range(103,120), lat:21.239, lng:72.752, mla:'Majura',           mp:'Surat' },
];
const SUR_PARTIES_W = ['BJP','BJP','BJP','BJP','Congress','BJP','AAP','BJP','BJP','Congress','BJP','BJP'];

// ─── INDORE IMC — 85 wards, 5 Zones ──────────────────────────────────────
const IND_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Rajwada Zone',          code:'IMC-RAJ', wards:range(1,17),   lat:22.718, lng:75.857, mla:'Indore-1',   mp:'Indore' },
  { name:'Sapna-Sangeeta Zone',   code:'IMC-SNS', wards:range(18,34),  lat:22.734, lng:75.883, mla:'Indore-2',   mp:'Indore' },
  { name:'Vijay Nagar Zone',      code:'IMC-VJN', wards:range(35,51),  lat:22.753, lng:75.892, mla:'Indore-3',   mp:'Indore' },
  { name:'Lasudia Zone',          code:'IMC-LSD', wards:range(52,68),  lat:22.739, lng:75.927, mla:'Indore-4',   mp:'Indore' },
  { name:'Aerodrome Zone',        code:'IMC-AER', wards:range(69,85),  lat:22.700, lng:75.859, mla:'Depalpur',   mp:'Indore' },
];
const IND_PARTIES_W = ['BJP','BJP','BJP','BJP','Congress','BJP','BJP','Congress','BJP','BJP','BJP','BJP'];

// ─── PATNA PMC — 75 wards, 5 Zones ───────────────────────────────────────
const PAT_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Patna City Zone',   code:'PMC-PCT', wards:range(1,15),   lat:25.614, lng:85.182, mla:'Patna Sahib',  mp:'Patna Sahib' },
  { name:'Patna Sahib Zone',  code:'PMC-PSH', wards:range(16,30),  lat:25.608, lng:85.196, mla:'Bankipore',    mp:'Patna Sahib' },
  { name:'Bankipore Zone',    code:'PMC-BNK', wards:range(31,45),  lat:25.598, lng:85.125, mla:'Kumhrar',      mp:'Pataliputra' },
  { name:'Danapur Zone',      code:'PMC-DAN', wards:range(46,60),  lat:25.619, lng:85.067, mla:'Digha',        mp:'Pataliputra' },
  { name:'Phulwari Zone',     code:'PMC-PHU', wards:range(61,75),  lat:25.564, lng:85.130, mla:'Phulwari',     mp:'Pataliputra' },
];
const PAT_PARTIES_W = ['BJP','JDU','RJD','Congress','BJP','JDU','RJD','BJP','JDU','Congress','BJP','RJD'];

// ─── VISAKHAPATNAM GVMC — 98 wards, 6 Zones ──────────────────────────────
const VIZ_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Greater Visakha Zone', code:'GVM-GVZ', wards:range(1,16),   lat:17.720, lng:83.318, mla:'Visakhapatnam West',  mp:'Visakhapatnam' },
  { name:'Gajuwaka Zone',        code:'GVM-GJW', wards:range(17,32),  lat:17.670, lng:83.233, mla:'Gajuwaka',            mp:'Visakhapatnam' },
  { name:'Bheemunipatnam Zone',  code:'GVM-BHP', wards:range(33,48),  lat:17.892, lng:83.455, mla:'Bheemunipatnam',      mp:'Visakhapatnam' },
  { name:'Bheemili Zone',        code:'GVM-BHM', wards:range(49,64),  lat:17.878, lng:83.448, mla:'Bheemunipatnam',      mp:'Visakhapatnam' },
  { name:'Vizag Port Zone',      code:'GVM-VPZ', wards:range(65,80),  lat:17.704, lng:83.301, mla:'Visakhapatnam East',  mp:'Visakhapatnam' },
  { name:'MVP Colony Zone',      code:'GVM-MVP', wards:range(81,98),  lat:17.748, lng:83.338, mla:'Visakhapatnam North', mp:'Visakhapatnam' },
];
const VIZ_PARTIES_W = ['YSR Congress','TDP','Jana Sena','YSR Congress','TDP','Jana Sena','YSR Congress','TDP','Jana Sena','YSR Congress','TDP','Jana Sena'];

// ─── CHANDIGARH MC-CHD — 35 wards, 3 Zones ───────────────────────────────
const CHD_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Sector Zone-A',          code:'CHD-SZA', wards:range(1,11),   lat:30.746, lng:76.779, mla:'Chandigarh', mp:'Chandigarh' },
  { name:'Sector Zone-B',          code:'CHD-SZB', wards:range(12,22),  lat:30.720, lng:76.796, mla:'Chandigarh', mp:'Chandigarh' },
  { name:'Industrial/Village Zone', code:'CHD-IVZ', wards:range(23,35),  lat:30.720, lng:76.820, mla:'Chandigarh', mp:'Chandigarh' },
];
const CHD_PARTIES_W = ['BJP','Congress','AAP','BJP','Congress','AAP','BJP','Congress','AAP','BJP','BJP','AAP'];

// ─── KOCHI KOCHI-CORP — 74 wards, 5 Zones ────────────────────────────────
const KOC_ZONES: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[] = [
  { name:'Ernakulam Zone',    code:'KOC-ERN', wards:range(1,14),   lat:9.982,  lng:76.291, mla:'Ernakulam',    mp:'Ernakulam' },
  { name:'Mattancherry Zone', code:'KOC-MTN', wards:range(15,28),  lat:9.958,  lng:76.266, mla:'Paravur',      mp:'Ernakulam' },
  { name:'Fort Kochi Zone',   code:'KOC-FKZ', wards:range(29,42),  lat:9.963,  lng:76.241, mla:'Thrikkakara',  mp:'Ernakulam' },
  { name:'Palluruthy Zone',   code:'KOC-PLR', wards:range(43,56),  lat:9.935,  lng:76.280, mla:'Thiruvankulam',mp:'Ernakulam' },
  { name:'Edapally Zone',     code:'KOC-EDP', wards:range(57,74),  lat:10.024, lng:76.299, mla:'Kalamassery',  mp:'Ernakulam' },
];
const KOC_PARTIES_W = ['UDF','LDF','BJP','UDF','LDF','UDF','LDF','BJP','UDF','LDF','UDF','LDF'];

// ─── Additional name pools ────────────────────────────────────────────────
const MALAYALAM_FIRST = ['Rajan','Suresh','Priya','Bindu','Sreekanth','Anitha','Vinod','Shobha','Rajesh','Suma','Jayesh','Rekha','Anil','Meena','Sunil','Sindhu','Manoj','Latha','Sreekumar','Vijaya'];
const MALAYALAM_LAST  = ['Nair','Pillai','Menon','Kurup','Varma','Namboothiri','Thampi','Panicker','Rao','Krishnan','Mohan','Kumar','Thomas','George','Mathew','Philip','Antony','Joseph','Chacko','Varghese'];

const PUNJABI_FIRST = ['Harpreet','Gurpreet','Manpreet','Jaspreet','Kulwinder','Parminder','Baljinder','Satinder','Navdeep','Simran','Ravinder','Sukhvinder','Amritpal','Lakhvir','Tejinder','Gurinder','Harpinder','Navjot','Daljit','Bikram'];
const PUNJABI_LAST  = ['Singh','Kaur','Sharma','Verma','Arora','Chopra','Malhotra','Bhatia','Kapoor','Dhawan','Grewal','Sandhu','Gill','Sidhu','Dhaliwal','Brar','Mann','Sekhon','Virk','Randhawa'];

// ─── Helper ─────────────────────────────────────────────────────────────────
function range(a: number, b: number): number[] {
  const r = [];
  for (let i = a; i <= b; i++) r.push(i);
  return r;
}

// ─── Ward name pools per city ────────────────────────────────────────────────
const AREA_NAMES: Record<string, string[]> = {
  KOLKATA: KOL_NAMES_W,
  MUMBAI: ['Colaba','Mazgaon','Matunga','Worli','Byculla','Kurla','Chembur','Dharavi','Sion','Bandra','Andheri','Ghatkopar','Goregaon','Borivali','Mulund','Kandivali','Jogeshwari','Dahisar','Wadala','Sewri','Mahim','Parel','Dadar','Girgaon','Kalbadevi','Malabar Hill','Pedder Road','Tardeo','Lalbaug','Prabhadevi'],
  BENGALURU: ['Yelahanka','Koramangala','Jayanagar','BTM Layout','Rajajinagar','Shivajinagar','Malleswaram','Basavanagudi','Whitefield','Electronic City','Marathahalli','Hebbal','Hennur','Kalyan Nagar','Indiranagar','Sadashivanagar','Vijayanagar','Banashankari','JP Nagar','Bommanahalli','Bellandur','Sarjapur','Varthur','HSR Layout','Wilson Garden','Richmond Town'],
  DELHI: ['Rohini','Dwarka','Janakpuri','Pitampura','Saket','Lajpat Nagar','Greater Kailash','Vasant Kunj','Nehru Place','Connaught Place','Chandni Chowk','Karol Bagh','Rajouri Garden','Uttam Nagar','Vikaspuri','Tilak Nagar','Palam','Narela','Bawana','Alipur','Mustafabad','Seelampur','Shahdara','Vivek Vihar','Preet Vihar','Mayur Vihar','Laxmi Nagar'],
  CHENNAI: ['T Nagar','Adyar','Anna Nagar','Mylapore','Velachery','Tambaram','Chromepet','Perambur','Royapuram','Kodambakkam','Nungambakkam','Egmore','Chetpet','Pattalam','Saidapet','Guindy','Alandur','Pallavaram','Porur','Virugambakkam','Valasaravakkam','Nesapakkam','KK Nagar','Arumbakkam','Mogappair'],
  HYDERABAD: ['Banjara Hills','Jubilee Hills','Begumpet','Secunderabad','Kukatpally','Hitech City','Gachibowli','Kondapur','Manikonda','Mehdipatnam','Tolichowki','Ameerpet','SR Nagar','Malakpet','Charminar','Chandrayangutta','Falaknuma','Musheerabad','Barkatpura','Domalguda'],
  PUNE: ['Shivajinagar','Kothrud','Hadapsar','Aundh','Deccan','Sinhagad Road','Bibwewadi','Wanowrie','Yerawada','Vishrantwadi','Kondhwa','Warje','Bhavani Peth','Camp','Kasba','Parvati','Dhanori','Lohegaon','Baner','Balewadi','Wakad','Pimple Saudagar','Kharadi','Wadgaon'],
  AHMEDABAD: ['Navrangpura','Satellite','Bopal','Ghatlodia','Chandlodia','Nikol','Vatva','Naroda','Odhav','Juhapura','Vejalpur','Isanpur','Rakhial','Asarwa','Dariyapur','Maninagar','Naranpura','Vastral','Bapunagar','Gomtipur'],
  JAIPUR: ['Chandpole','Tripolia','Johri Bazar','Kishanpole','Ramganj','Badi Chaupar','Manak Chowk','Chand Pole','Subhash Chowk','Topkhana','Sindhi Camp','MI Road','Sansar Chandra Marg','Civil Lines','Bani Park','Adarsh Nagar','Vaishali Nagar','Mansarovar','Pratap Nagar','Sanganer','Murlipura','Vidyadhar Nagar','Sikar Road','Agra Road','Tonk Road','Ajmer Road','Malviya Nagar','Jagatpura','Sitapura','Bagru'],
  LUCKNOW: ['Hazratganj','Gomti Nagar','Aminabad','Chowk','Aliganj','Indira Nagar','Vibhuti Khand','Mahanagar','Alambagh','Rajajipuram','Husainabad','Thakurganj','Naka','Ghazipur','Chinhat','Faizabad Road','Kanpur Road','Sitapur Road','Sultanpur Road','Raibareli Road'],
  NAGPUR: ['Dharampeth','Sadar','Sitabuldi','Itwari','Gandhibagh','Mahal','Dharampeth','Abhyankar Nagar','Sakkardara','Ajni','Manewada','Baidyanath Nagar','Kamptee Road','Hingna Road','Wardha Road','Amravati Road','Nagpur Central','Nandanvan','Pratap Nagar','Wathoda'],
  BHOPAL: ['MP Nagar','Arera Colony','Shahpura','Kolar','TT Nagar','Shivaji Nagar','Govindpura','Bairagarh','Bhopal Old City','Berasia Road','Ayodhya Nagar','Misrod','Mandideep Road','Hoshangabad Road','Raisen Road'],
  SURAT: ['Nanpura','Rander','Althan','Adajan','Vesu','Katargam','Varachha','Udhna','Limbayat','Piplod','Pal','Dindoli','Pandesara','Kadodara','Sachin','Bhestan','Godadara','Utran','Kim'],
  INDORE: ['Rajwada','Sarafa','Chhawni','Vijay Nagar','Palasia','Scheme 54','Scheme 78','Bhawarkuan','Pardesipura','Kanadiya','Banganga','Bhanwarkuan','Lasudia','Mhow Road','Rau','Sanwer Road'],
  PATNA: ['Boring Road','Kankarbagh','Rajendra Nagar','Gandhi Maidan','Dak Bungalow','Ashok Rajpath','Exhibition Road','Fraser Road','Bailey Road','Danapur','Phulwari Sharif','Khagaul','Patna City','Agamkuan','Gardanibagh'],
  VISAKHAPATNAM: ['Beach Road','MVP Colony','Dwaraka Nagar','Akkayyapalem','Jagadamba','Gajuwaka','Bheemunipatnam','Kommadi','Madhurawada','Rushikonda','Seethammadhara','Lawson Bay','NAD Junction','Steel Plant','Pendurthi'],
  CHANDIGARH: ['Sector 1','Sector 2','Sector 3','Sector 4','Sector 7','Sector 8','Sector 9','Sector 10','Sector 11','Sector 15','Sector 17','Sector 18','Sector 20','Sector 21','Sector 22','Sector 23','Sector 26','Sector 28','Sector 32','Sector 35','Sector 38','Sector 40','Sector 43','Sector 44','Sector 45','Manimajra','Dhanas','Maloya','Hallomajra','Burail'],
  KOCHI: ['Marine Drive','Mattancherry','Fort Kochi','Edapally','Kalamassery','Thrikkakara','Kakkanad','Palluruthy','Vypeen','Cheranallur','Aluva Road','Maradu','Tripunithura','Vyttila','Palarivattom','Kaloor','Elamakkara','Panampilly Nagar','Kadavanthra','Girinagar'],
};

// ─── Main generator ──────────────────────────────────────────────────────────
function generateAllWards(): Ward[] {
  const wards: Ward[] = [];

  function addCity(
    city: Ward['city'],
    body: string,
    zones: { name:string; code:string; wards:number[]; lat:number; lng:number; mla:string; mp:string }[],
    partyPool: string[],
    firstNames: string[],
    lastNames: string[],
    idPrefix?: string,
  ) {
    const names = AREA_NAMES[city] || [];
    zones.forEach((zone, zi) => {
      zone.wards.forEach((wardNum, wi) => {
        const seed = wardNum * 31 + zi * 7 + city.charCodeAt(0);
        const lat = jitter(zone.lat, seed, 0.018);
        const lng = jitter(zone.lng, seed + 100, 0.018);
        const councillorFirst = pick(firstNames, seed + 3);
        const councillorLast  = pick(lastNames,  seed + 17);
        const party = pick(partyPool, seed + 5);
        const areaName = names.length > 0 ? pick(names, seed + 9) : zone.name.split('–')[0].trim();
        const wardName = `${areaName} – Ward ${wardNum}`;
        const { score: sc, grade } = score(seed);
        const cityCode = idPrefix ?? city.slice(0,3);

        wards.push({
          id: `${cityCode}-${String(wardNum).padStart(3,'0')}`,
          wardNumber: wardNum,
          wardName,
          city,
          municipalBody: body,
          zone: zone.name,
          zoneCode: zone.code,
          lat, lng,
          councillorName: `${councillorFirst} ${councillorLast}`,
          councillorParty: party,
          mlaConstituency: zone.mla,
          mpConstituency: zone.mp,
          overallScore: sc,
          grade,
        });
      });
    });
  }

  addCity('KOLKATA',   'KMC',  KOL_ZONES, KOL_PARTIES, BENGALI_FIRST, BENGALI_LAST);
  addCity('MUMBAI',    'MCGM', MUM_ZONES, MUM_PARTIES_W, MARATHI_FIRST, MARATHI_LAST);
  addCity('BENGALURU', 'BBMP', BLR_ZONES, BLR_PARTIES_W, KANNADA_FIRST, KANNADA_LAST);
  addCity('DELHI',     'MCD',  DEL_ZONES, DEL_PARTIES_W, HINDI_FIRST, HINDI_LAST);
  addCity('CHENNAI',   'GCC',  CHN_ZONES, CHN_PARTIES_W, TAMIL_FIRST, TAMIL_LAST);
  addCity('HYDERABAD', 'GHMC', HYD_ZONES, HYD_PARTIES_W, TELUGU_FIRST, TELUGU_LAST);
  addCity('PUNE',      'PMC',  PUN_ZONES, PUN_PARTIES_W, MARATHI_FIRST, MARATHI_LAST);
  addCity('AHMEDABAD',      'AMC',       AHM_ZONES, AHM_PARTIES_W, GUJARATI_FIRST,  GUJARATI_LAST);
  addCity('JAIPUR',         'JMC',       JAI_ZONES, JAI_PARTIES_W, HINDI_FIRST,     HINDI_LAST,     'JAI');
  addCity('LUCKNOW',        'LMC',       LKW_ZONES, LKW_PARTIES_W, HINDI_FIRST,     HINDI_LAST,     'LKW');
  addCity('NAGPUR',         'NMC',       NGP_ZONES, NGP_PARTIES_W, MARATHI_FIRST,   MARATHI_LAST,   'NGP');
  addCity('BHOPAL',         'BMC',       BHO_ZONES, BHO_PARTIES_W, HINDI_FIRST,     HINDI_LAST,     'BHO');
  addCity('SURAT',          'SMC',       SUR_ZONES, SUR_PARTIES_W, GUJARATI_FIRST,  GUJARATI_LAST,  'SUR');
  addCity('INDORE',         'IMC',       IND_ZONES, IND_PARTIES_W, HINDI_FIRST,     HINDI_LAST,     'IMC');
  addCity('PATNA',          'PMC',       PAT_ZONES, PAT_PARTIES_W, HINDI_FIRST,     HINDI_LAST,     'PAT');
  addCity('VISAKHAPATNAM',  'GVMC',      VIZ_ZONES, VIZ_PARTIES_W, TELUGU_FIRST,    TELUGU_LAST,    'VIZ');
  addCity('CHANDIGARH',     'MC-CHD',    CHD_ZONES, CHD_PARTIES_W, PUNJABI_FIRST,   PUNJABI_LAST,   'CHD');
  addCity('KOCHI',          'KOCHI-CORP',KOC_ZONES, KOC_PARTIES_W, MALAYALAM_FIRST, MALAYALAM_LAST, 'KOC');

  return wards;
}

export const ALL_WARDS: Ward[] = generateAllWards();

// ─── Query helpers ──────────────────────────────────────────────────────────
const FALLBACK_CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  GUWAHATI: { lat: 26.1445, lng: 91.7898 },
  THIRUVANANTHAPURAM: { lat: 8.5241, lng: 76.9366 },
  LUDHIANA: { lat: 30.9010, lng: 75.8573 },
  COIMBATORE: { lat: 11.0168, lng: 76.9558 },
  AGRA: { lat: 27.1767, lng: 78.0081 },
  VARANASI: { lat: 25.3176, lng: 82.9739 },
  AMRITSAR: { lat: 31.6340, lng: 74.8723 },
  NAGERBAZZAR: { lat: 22.6247, lng: 88.4194 },
  JAIPUR: { lat: 26.9124, lng: 75.7873 },
  LUCKNOW: { lat: 26.8467, lng: 80.9462 },
  NAGPUR: { lat: 21.1458, lng: 79.0882 },
  BHOPAL: { lat: 23.2599, lng: 77.4126 },
  SURAT: { lat: 21.1702, lng: 72.8311 },
  INDORE: { lat: 22.7196, lng: 75.8577 },
  PATNA: { lat: 25.5941, lng: 85.1376 },
  VISAKHAPATNAM: { lat: 17.6868, lng: 83.2185 },
  CHANDIGARH: { lat: 30.7333, lng: 76.7794 },
  KOCHI: { lat: 9.9312, lng: 76.2673 },
};

export function getWardsByCity(city: string): Ward[] {
  const upper = city.toUpperCase();
  const list = ALL_WARDS.filter(w => w.city === upper);
  if (list.length > 0) return list;

  const center = FALLBACK_CITY_CENTERS[upper] || { lat: 20.5937, lng: 78.9629 };
  const virtualWards: Ward[] = [];
  const body = `${upper.slice(0, 3)}MC`;
  const zoneNames = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'];

  for (let wardNum = 1; wardNum <= 15; wardNum++) {
    const seed = wardNum * 17 + upper.charCodeAt(0);
    const lat = jitter(center.lat, seed, 0.022);
    const lng = jitter(center.lng, seed + 100, 0.022);
    
    const zoneIndex = Math.abs(seed) % zoneNames.length;
    const zoneName = zoneNames[zoneIndex];
    const zoneCode = `${upper.slice(0, 3)}-Z0${zoneIndex + 1}`;

    const score = Math.floor(Math.sin(seed) * 35) + 55; // 20-90
    const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F';

    virtualWards.push({
      id: `${upper.slice(0, 3)}-${String(wardNum).padStart(3, '0')}`,
      wardNumber: wardNum,
      wardName: `${upper.charAt(0) + upper.slice(1).toLowerCase()} Ward ${wardNum}`,
      city: upper as any,
      municipalBody: body,
      zone: zoneName,
      zoneCode: zoneCode,
      lat,
      lng,
      councillorName: `Hon. Representative ${wardNum}`,
      councillorParty: Math.sin(seed + 1) > 0 ? 'BJP' : 'INC',
      mlaConstituency: `${upper} Constituency`,
      mpConstituency: `${upper} Lok Sabha`,
      overallScore: score,
      grade,
    });
  }
  return virtualWards;
}

export function getWardsByZone(city: string, zoneCode: string): Ward[] {
  return ALL_WARDS.filter(w => w.city === city.toUpperCase() && w.zoneCode === zoneCode);
}

export function getWardById(id: string): Ward | undefined {
  return ALL_WARDS.find(w => w.id === id);
}

export function searchWards(query: string): Ward[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_WARDS.filter(w =>
    w.wardName.toLowerCase().includes(q) ||
    w.zone.toLowerCase().includes(q) ||
    w.city.toLowerCase().includes(q) ||
    w.councillorName.toLowerCase().includes(q) ||
    w.mlaConstituency.toLowerCase().includes(q) ||
    w.mpConstituency.toLowerCase().includes(q) ||
    String(w.wardNumber) === q
  ).slice(0, 30);
}

export function getWardStats() {
  const cities = [...new Set(ALL_WARDS.map(w => w.city))];
  return cities.map(city => {
    const cw = ALL_WARDS.filter(w => w.city === city);
    const avg = Math.round(cw.reduce((a, w) => a + w.overallScore, 0) / cw.length);
    return { city, wardCount: cw.length, avgScore: avg };
  });
}
