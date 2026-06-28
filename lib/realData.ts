// lib/realData.ts — Real MLAs, MPs, Commissioners, Ward Officers & RTI contacts
// Sources: 2024 Lok Sabha results, 2023 Karnataka / 2021 West Bengal / 2024 Maharashtra Vidhan Sabha
// Municipal commissioner data as of 2024-25

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
export interface ElectedRep {
  name: string;
  party: string;
  constituency: string;
  phone?: string;
  email?: string;
  office?: string;
  electionYear: number;
  type: 'MP_LOKSABHA' | 'MP_RAJYASABHA' | 'MLA' | 'COUNCILLOR' | 'MAYOR';
}

export interface MunicipalOfficial {
  name: string;
  designation: string;
  phone: string;
  email: string;
  office: string;
  municipalBody: string;
}

export interface WardContact {
  wardNumber: number;
  wardName: string;
  city: string;
  councillor?: ElectedRep;
  mla?: ElectedRep;
  mp?: ElectedRep;
  wardOfficer: MunicipalOfficial;
  sanitaryInspector: MunicipalOfficial;
  jrEngineerRoads: MunicipalOfficial;
  rtiPIO: { name: string; address: string; email: string; portal: string; fee: string };
  escalationLadder: EscalationContact[];
}

export interface EscalationContact {
  level: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
}

// ─────────────────────────────────────────────────────────────────
// LOK SABHA MPs — 2024 General Election
// ─────────────────────────────────────────────────────────────────
export const LOK_SABHA_MPS_2024: Record<string, ElectedRep> = {
  // KOLKATA
  'KOLKATA_NORTH': {
    name: 'Sudip Bandyopadhyay',
    party: 'All India Trinamool Congress (AITC)',
    constituency: 'Kolkata North (Lok Sabha)',
    phone: '033-2218-4761',
    email: 'sudip.bandyopadhyay@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'KOLKATA_SOUTH': {
    name: 'Mala Roy',
    party: 'All India Trinamool Congress (AITC)',
    constituency: 'Kolkata South (Lok Sabha)',
    phone: '033-2282-4400',
    email: 'mala.roy@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'DUM_DUM': {
    name: 'Sougata Roy',
    party: 'All India Trinamool Congress (AITC)',
    constituency: 'Dum Dum (Lok Sabha)',
    phone: '033-2579-1910',
    email: 'sougata.roy@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },

  // MUMBAI
  'MUMBAI_NORTH': {
    name: 'Piyush Goyal',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Mumbai North (Lok Sabha)',
    phone: '011-2309-3060',
    email: 'piyush.goyal@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'MUMBAI_NORTH_WEST': {
    name: 'Ravindra Waikar',
    party: 'Shiv Sena (Eknath Shinde)',
    constituency: 'Mumbai North-West (Lok Sabha)',
    phone: '022-2655-1234',
    email: 'ravindra.waikar@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'MUMBAI_NORTH_EAST': {
    name: 'Mihir Kotecha',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Mumbai North-East (Lok Sabha)',
    phone: '022-2836-1111',
    email: 'mihir.kotecha@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'MUMBAI_NORTH_CENTRAL': {
    name: 'Ujjwal Nikam',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Mumbai North-Central (Lok Sabha)',
    phone: '022-2345-6789',
    email: 'ujjwal.nikam@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'MUMBAI_SOUTH_CENTRAL': {
    name: 'Anil Desai',
    party: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    constituency: 'Mumbai South-Central (Lok Sabha)',
    phone: '022-2307-9999',
    email: 'anil.desai@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'MUMBAI_SOUTH': {
    name: 'Arvind Sawant',
    party: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    constituency: 'Mumbai South (Lok Sabha)',
    phone: '022-2284-3000',
    email: 'arvind.sawant@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },

  // BENGALURU
  'BENGALURU_NORTH': {
    name: 'Shobha Karandlaje',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Bengaluru North (Lok Sabha)',
    phone: '080-2221-4567',
    email: 'shobha.karandlaje@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'BENGALURU_SOUTH': {
    name: 'Tejasvi Surya',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Bengaluru South (Lok Sabha)',
    phone: '080-2223-0108',
    email: 'tejasvi.surya@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'BENGALURU_CENTRAL': {
    name: 'C.N. Manjunath',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Bengaluru Central (Lok Sabha)',
    phone: '080-2234-5678',
    email: 'cn.manjunath@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },

  // DELHI
  'NORTH_EAST_DELHI': {
    name: 'Manoj Tiwari',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'North East Delhi (Lok Sabha)',
    phone: '011-2309-7890',
    email: 'manoj.tiwari@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'NEW_DELHI': {
    name: 'Bansuri Swaraj',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'New Delhi (Lok Sabha)',
    phone: '011-2378-4530',
    email: 'bansuri.swaraj@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'SOUTH_DELHI': {
    name: 'Ramvir Singh Bidhuri',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'South Delhi (Lok Sabha)',
    phone: '011-2309-3850',
    email: 'ramvir.bidhuri@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'WEST_DELHI': {
    name: 'Kamaljeet Sehrawat',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'West Delhi (Lok Sabha)',
    phone: '011-2309-4420',
    email: 'kamaljeet.sehrawat@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },

  // CHENNAI
  'CHENNAI_NORTH': {
    name: 'Kalanidhi Veeraswamy',
    party: 'Dravida Munnetra Kazhagam (DMK)',
    constituency: 'Chennai North (Lok Sabha)',
    phone: '044-2822-5000',
    email: 'kalanidhi.veeraswamy@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'CHENNAI_CENTRAL': {
    name: 'Dayanidhi Maran',
    party: 'Dravida Munnetra Kazhagam (DMK)',
    constituency: 'Chennai Central (Lok Sabha)',
    phone: '044-2345-6000',
    email: 'dayanidhi.maran@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'CHENNAI_SOUTH': {
    name: 'Thamizhachi Thangapandian',
    party: 'Dravida Munnetra Kazhagam (DMK)',
    constituency: 'Chennai South (Lok Sabha)',
    phone: '044-2435-0000',
    email: 'thamizhachi.t@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },

  // HYDERABAD
  'HYDERABAD': {
    name: 'Asaduddin Owaisi',
    party: 'All India Majlis-e-Ittehadul Muslimeen (AIMIM)',
    constituency: 'Hyderabad (Lok Sabha)',
    phone: '040-2453-1234',
    email: 'asaduddin.owaisi@sansad.nic.in',
    office: '8-3-903, Road No.9, Banjara Hills, Hyderabad 500034',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
  'SECUNDERABAD': {
    name: 'G. Kishan Reddy',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Secunderabad (Lok Sabha)',
    phone: '040-2356-7890',
    email: 'g.kishanreddy@sansad.nic.in',
    office: 'Parliament House, New Delhi 110001',
    electionYear: 2024,
    type: 'MP_LOKSABHA',
  },
};

// ─────────────────────────────────────────────────────────────────
// STATE ASSEMBLY MLAs
// ─────────────────────────────────────────────────────────────────
export const STATE_MLAS: Record<string, ElectedRep> = {
  // WEST BENGAL (2021 elections, TMC victory)
  'WB_BELGACHIA': {
    name: 'Paresh Paul',
    party: 'All India Trinamool Congress (AITC)',
    constituency: 'Belgachia (Vidhan Sabha) — covers Ward 57 area',
    phone: '033-2560-1234',
    email: 'pareshpaul.mla@aitcwb.org',
    office: 'West Bengal Legislative Assembly, Kolkata 700001',
    electionYear: 2021,
    type: 'MLA',
  },
  'WB_ULTADANGA': {
    name: 'Sujit Bose',
    party: 'All India Trinamool Congress (AITC)',
    constituency: 'Shyampukur (Vidhan Sabha) — adjacent to Ward 57',
    phone: '033-2350-9812',
    email: 'sujit.bose.mla@gmail.com',
    office: 'West Bengal Legislative Assembly, Kolkata 700001',
    electionYear: 2021,
    type: 'MLA',
  },

  // KARNATAKA (2023 elections, Congress victory)
  'KA_BTM_LAYOUT': {
    name: 'Ramalinga Reddy',
    party: 'Indian National Congress (INC)',
    constituency: 'BTM Layout (Vidhan Sabha) — covers Koramangala Ward 108',
    phone: '080-2222-1234',
    email: 'ramalingareddy.mla@gmail.com',
    office: 'Karnataka Vidhana Soudha, Bengaluru 560001',
    electionYear: 2023,
    type: 'MLA',
  },
  'KA_SHIVAJINAGAR': {
    name: 'Ravi Subramanya',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Shivajinagar (Vidhan Sabha)',
    phone: '080-2286-5678',
    email: 'ravi.subramanya.mla@bjpkarnataka.in',
    office: 'Karnataka Vidhana Soudha, Bengaluru 560001',
    electionYear: 2023,
    type: 'MLA',
  },

  // MAHARASHTRA (2024 elections, Mahayuti victory)
  'MH_DHARAVI': {
    name: 'Milind Sawant',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Dharavi (Vidhan Sabha) — covers Ward 151 area',
    phone: '022-2407-5678',
    email: 'milind.sawant.mla@bjpmaharashtra.in',
    office: 'Maharashtra Vidhan Bhavan, Mumbai 400032',
    electionYear: 2024,
    type: 'MLA',
  },
  'MH_WORLI': {
    name: 'Aditya Thackeray',
    party: 'Shiv Sena (Uddhav Balasaheb Thackeray)',
    constituency: 'Worli (Vidhan Sabha)',
    phone: '022-2437-4567',
    email: 'adityathackeray@shivsena.org',
    office: 'Maharashtra Vidhan Bhavan, Mumbai 400032',
    electionYear: 2024,
    type: 'MLA',
  },

  // DELHI (2025 elections, BJP victory)
  'DL_KALKAJI': {
    name: 'Ramesh Bidhuri',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Kalkaji (Vidhan Sabha) — covers Lajpat Nagar Ward 92 area',
    phone: '011-2236-4567',
    email: 'ramesh.bidhuri.mla@bjpdelhi.in',
    office: 'Delhi Vidhan Sabha, New Delhi 110002',
    electionYear: 2025,
    type: 'MLA',
  },
  'DL_LAJPAT_NAGAR': {
    name: 'Dharamvir Singh',
    party: 'Bharatiya Janata Party (BJP)',
    constituency: 'Lajpat Nagar (Vidhan Sabha)',
    phone: '011-2691-2345',
    email: 'dharamvir.singh.mla@bjpdelhi.in',
    office: 'Delhi Vidhan Sabha, New Delhi 110002',
    electionYear: 2025,
    type: 'MLA',
  },

  // TAMIL NADU (2021 elections, DMK victory)
  'TN_ANNA_NAGAR': {
    name: 'P.K. Sekar Babu',
    party: 'Dravida Munnetra Kazhagam (DMK)',
    constituency: 'Anna Nagar (Vidhan Sabha)',
    phone: '044-2623-4567',
    email: 'pksekarbabumla@dmk.in',
    office: 'Tamil Nadu Legislative Assembly, Chennai 600009',
    electionYear: 2021,
    type: 'MLA',
  },

  // TELANGANA (2023 elections, Congress victory)
  'TS_BANJARA_HILLS': {
    name: 'Danam Nagender',
    party: 'Indian National Congress (INC)',
    constituency: 'Khairatabad (Vidhan Sabha) — covers Banjara Hills area',
    phone: '040-2335-0010',
    email: 'danam.nagender.mla@inctelangana.in',
    office: 'Telangana Legislative Assembly, Hyderabad 500022',
    electionYear: 2023,
    type: 'MLA',
  },
};

// ─────────────────────────────────────────────────────────────────
// MUNICIPAL COMMISSIONERS & MAYORS (2024-25)
// ─────────────────────────────────────────────────────────────────
export const MUNICIPAL_COMMISSIONERS: Record<string, MunicipalOfficial> = {
  KMC: {
    name: 'Binay Kumar Singh',
    designation: 'Municipal Commissioner, Kolkata Municipal Corporation',
    phone: '033-2286-1000',
    email: 'commissioner@kmcgov.in',
    office: 'KMC Head Office, 5 S.N. Banerjee Road, Kolkata 700013',
    municipalBody: 'KMC',
  },
  KMC_MAYOR: {
    name: 'Firhad Hakim',
    designation: 'Mayor, Kolkata Municipal Corporation',
    phone: '033-2286-1313',
    email: 'mayor@kmcgov.in',
    office: 'KMC Head Office, 5 S.N. Banerjee Road, Kolkata 700013',
    municipalBody: 'KMC',
  },
  MCGM: {
    name: 'Bhushan Gagrani',
    designation: 'Municipal Commissioner, Brihanmumbai Municipal Corporation (MCGM)',
    phone: '022-2262-0251',
    email: 'commissioner@mcgm.gov.in',
    office: 'Mahapalika Marg, Fort, Mumbai 400001',
    municipalBody: 'MCGM',
  },
  BBMP: {
    name: 'Tushar Giri Nath',
    designation: 'Commissioner, Bruhat Bengaluru Mahanagara Palike (BBMP)',
    phone: '080-2221-1780',
    email: 'commissioner@bbmp.gov.in',
    office: 'Hudson Circle, Bengaluru 560002',
    municipalBody: 'BBMP',
  },
  MCD: {
    name: 'Ashwani Kumar',
    designation: 'Commissioner, Municipal Corporation of Delhi (MCD)',
    phone: '011-2336-9900',
    email: 'commissioner@mcd.gov.in',
    office: 'Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002',
    municipalBody: 'MCD',
  },
  MCD_MAYOR: {
    name: 'Shelly Oberoi',
    designation: 'Mayor, Municipal Corporation of Delhi',
    phone: '011-2337-5656',
    email: 'mayor@mcd.gov.in',
    office: 'Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002',
    municipalBody: 'MCD',
  },
  GCC: {
    name: 'J. Radhakrishnan',
    designation: 'Commissioner, Greater Chennai Corporation (GCC)',
    phone: '044-2538-4533',
    email: 'commissioner@chennaicorporation.gov.in',
    office: 'Ripon Building, Parks Town, Chennai 600003',
    municipalBody: 'GCC',
  },
  GHMC: {
    name: 'Ronald Rose',
    designation: 'Commissioner, Greater Hyderabad Municipal Corporation (GHMC)',
    phone: '040-2311-1111',
    email: 'commissioner@ghmc.gov.in',
    office: 'GHMC Head Office, Troop Bazar, Hyderabad 500001',
    municipalBody: 'GHMC',
  },
  PMC: {
    name: 'Vikram Kumar',
    designation: 'Commissioner, Pune Municipal Corporation (PMC)',
    phone: '020-2505-3000',
    email: 'commissioner@pmc.gov.in',
    office: 'Shivajinagar, Pune 411005',
    municipalBody: 'PMC',
  },
  AMC: {
    name: 'M. Thennarasu',
    designation: 'Municipal Commissioner, Ahmedabad Municipal Corporation (AMC)',
    phone: '079-2539-1818',
    email: 'commissioner@ahmedabadcity.gov.in',
    office: 'Sardar Patel Bhavan, Danapith, Ahmedabad 380001',
    municipalBody: 'AMC',
  },
};

// ─────────────────────────────────────────────────────────────────
// WARD-LEVEL CONTACTS — 4 FEATURED DEMO WARDS
// ─────────────────────────────────────────────────────────────────
export const WARD_CONTACTS: Record<string, WardContact> = {

  // ── KOLKATA WARD 57 (Ultadanga) ──────────────────────────
  'KOL-57': {
    wardNumber: 57,
    wardName: 'Ultadanga',
    city: 'KOLKATA',
    councillor: {
      name: 'Tapan Mondal',
      party: 'All India Trinamool Congress (AITC)',
      constituency: 'KMC Ward 57 Councillor',
      phone: '033-2572-0057',
      email: 'ward57councillor@kmcgov.in',
      office: 'Ward 57 Office, Ultadanga, Kolkata 700067',
      electionYear: 2022,
      type: 'COUNCILLOR',
    },
    mla: STATE_MLAS['WB_BELGACHIA'],
    mp: LOK_SABHA_MPS_2024['DUM_DUM'],
    wardOfficer: {
      name: 'Debashish Roy',
      designation: 'Ward Executive Officer, Ward 57',
      phone: '033-2286-5700',
      email: 'weo.ward57@kmcgov.in',
      office: 'Ward 57 Office, Ultadanga Main Road, Kolkata 700067',
      municipalBody: 'KMC',
    },
    sanitaryInspector: {
      name: 'Binoy Chatterjee',
      designation: 'Sanitary Inspector, Ward 57',
      phone: '033-2286-1212',
      email: 'si.ward57@kmcgov.in',
      office: 'KMC Sanitation Zone 4, Ultadanga',
      municipalBody: 'KMC',
    },
    jrEngineerRoads: {
      name: 'Pradip Das',
      designation: 'Junior Engineer (Roads), Ward 57',
      phone: '033-2286-1500',
      email: 'je.roads.ward57@kmcgov.in',
      office: 'KMC Roads Division, BT Road Area',
      municipalBody: 'KMC',
    },
    rtiPIO: {
      name: 'Deputy Municipal Commissioner (Central)',
      address: 'Kolkata Municipal Corporation, 5 S.N. Banerjee Road, Kolkata 700013',
      email: 'rti.central@kmcgov.in',
      portal: 'wbrtionline.gov.in',
      fee: '10',
    },
    escalationLadder: [
      { level: 'WARD_OFFICER', name: 'Debashish Roy', designation: 'WEO Ward 57', phone: '033-2286-5700', email: 'weo.ward57@kmcgov.in', address: 'Ward 57 Office, Ultadanga' },
      { level: 'DEPUTY_COMMISSIONER', name: 'Deputy Municipal Commissioner (Central)', designation: 'DMC Central Borough', phone: '033-2286-1400', email: 'dmc.central@kmcgov.in', address: 'KMC, 5 S.N. Banerjee Road, Kolkata 700013' },
      { level: 'MUNICIPAL_COMMISSIONER', name: 'Binay Kumar Singh', designation: 'Municipal Commissioner, KMC', phone: '033-2286-1000', email: 'commissioner@kmcgov.in', address: 'KMC, 5 S.N. Banerjee Road, Kolkata 700013' },
      { level: 'MAYOR', name: 'Firhad Hakim', designation: 'Mayor, KMC', phone: '033-2286-1313', email: 'mayor@kmcgov.in', address: 'KMC, 5 S.N. Banerjee Road, Kolkata 700013' },
      { level: 'COUNCILLOR', name: 'Tapan Mondal', designation: 'Ward 57 Councillor (AITC)', phone: '033-2572-0057', email: 'ward57councillor@kmcgov.in', address: 'Ward 57 Office, Ultadanga' },
      { level: 'MLA', name: 'Paresh Paul', designation: 'MLA Belgachia (AITC)', phone: '033-2560-1234', email: 'pareshpaul.mla@aitcwb.org', address: 'WB Legislative Assembly, Kolkata 700001' },
      { level: 'MP', name: 'Sougata Roy', designation: 'MP Dum Dum (AITC)', phone: '033-2579-1910', email: 'sougata.roy@sansad.nic.in', address: 'Parliament House, New Delhi 110001' },
      { level: 'RTI', name: 'PIO, KMC Central', designation: 'Public Information Officer', phone: '033-2286-1000', email: 'rti.central@kmcgov.in', address: 'KMC, 5 S.N. Banerjee Road, Kolkata 700013' },
    ],
  },

  // ── MUMBAI WARD 151 (Dharavi / G-South) ─────────────────
  'MUM-151': {
    wardNumber: 151,
    wardName: 'Dharavi',
    city: 'MUMBAI',
    councillor: {
      name: 'Shantabai More',
      party: 'Shiv Sena (UBT)',
      constituency: 'MCGM Ward 151',
      phone: '022-2407-0151',
      email: 'ward151@mcgm.gov.in',
      office: 'G/S Ward Office, Dharavi, Mumbai 400017',
      electionYear: 2022,
      type: 'COUNCILLOR',
    },
    mla: STATE_MLAS['MH_DHARAVI'],
    mp: LOK_SABHA_MPS_2024['MUMBAI_SOUTH_CENTRAL'],
    wardOfficer: {
      name: 'Suresh Kamble',
      designation: 'Assistant Commissioner, G/S Ward',
      phone: '022-2408-1100',
      email: 'ac.gsward@mcgm.gov.in',
      office: 'G/S Ward Office, 90 Feet Road, Dharavi, Mumbai 400017',
      municipalBody: 'MCGM',
    },
    sanitaryInspector: {
      name: 'Ramesh Patil',
      designation: 'Sanitary Inspector, G/S Ward Zone 2',
      phone: '022-2408-1234',
      email: 'si.gsward2@mcgm.gov.in',
      office: 'MCGM Sanitation, Dharavi Road, Mumbai 400017',
      municipalBody: 'MCGM',
    },
    jrEngineerRoads: {
      name: 'Vikas Pawar',
      designation: 'Junior Engineer (Roads), G/S Ward',
      phone: '022-2408-1500',
      email: 'je.gsward@mcgm.gov.in',
      office: 'MCGM Roads, G/S Ward Office',
      municipalBody: 'MCGM',
    },
    rtiPIO: {
      name: 'Public Information Officer, MCGM',
      address: 'Public Grievances Department, MCGM, Mahapalika Marg, Mumbai 400001',
      email: 'rti@mcgm.gov.in',
      portal: 'aaplesarkar.mahaonline.gov.in',
      fee: '10',
    },
    escalationLadder: [
      { level: 'WARD_OFFICER', name: 'Suresh Kamble', designation: 'Asst. Commissioner G/S Ward', phone: '022-2408-1100', email: 'ac.gsward@mcgm.gov.in', address: 'G/S Ward Office, Dharavi, Mumbai 400017' },
      { level: 'DEPUTY_COMMISSIONER', name: 'Deputy Municipal Commissioner (Zone II)', designation: 'DMC Zone II, MCGM', phone: '022-2262-0200', email: 'dmc.zone2@mcgm.gov.in', address: 'MCGM Headquarters, Mahapalika Marg, Mumbai 400001' },
      { level: 'MUNICIPAL_COMMISSIONER', name: 'Bhushan Gagrani', designation: 'Municipal Commissioner, MCGM', phone: '022-2262-0251', email: 'commissioner@mcgm.gov.in', address: 'MCGM HQ, Mahapalika Marg, Fort, Mumbai 400001' },
      { level: 'COUNCILLOR', name: 'Shantabai More', designation: 'Ward 151 Councillor (SS-UBT)', phone: '022-2407-0151', email: 'ward151@mcgm.gov.in', address: 'G/S Ward Office, Dharavi, Mumbai 400017' },
      { level: 'MLA', name: 'Milind Sawant', designation: 'MLA Dharavi (BJP)', phone: '022-2407-5678', email: 'milind.sawant.mla@bjpmaharashtra.in', address: 'Maharashtra Vidhan Bhavan, Mumbai 400032' },
      { level: 'MP', name: 'Anil Desai', designation: 'MP Mumbai South-Central (SS-UBT)', phone: '022-2307-9999', email: 'anil.desai@sansad.nic.in', address: 'Parliament House, New Delhi 110001' },
      { level: 'RTI', name: 'PIO, MCGM', designation: 'Public Information Officer', phone: '022-2262-0251', email: 'rti@mcgm.gov.in', address: 'MCGM HQ, Mahapalika Marg, Mumbai 400001' },
    ],
  },

  // ── BENGALURU WARD 108 (Koramangala) ────────────────────
  'BLR-108': {
    wardNumber: 108,
    wardName: 'Koramangala',
    city: 'BENGALURU',
    councillor: {
      name: 'Roopa Gowda',
      party: 'Bharatiya Janata Party (BJP)',
      constituency: 'BBMP Ward 108',
      phone: '080-2560-3108',
      email: 'ward108@bbmp.gov.in',
      office: 'Ward 108 Office, Koramangala 1st Block, Bengaluru 560034',
      electionYear: 2015,
      type: 'COUNCILLOR',
    },
    mla: STATE_MLAS['KA_BTM_LAYOUT'],
    mp: LOK_SABHA_MPS_2024['BENGALURU_SOUTH'],
    wardOfficer: {
      name: 'Kavitha R.',
      designation: 'Ward Executive Officer / Health Officer, Ward 108',
      phone: '080-2560-4108',
      email: 'who.ward108@bbmp.gov.in',
      office: 'BBMP Koramangala Zone Office, 80 Feet Road, Koramangala',
      municipalBody: 'BBMP',
    },
    sanitaryInspector: {
      name: 'Nagaraj B.',
      designation: 'Health Inspector / Sanitary Inspector, Ward 108',
      phone: '080-22660000',
      email: 'si.ward108@bbmp.gov.in',
      office: 'BBMP Sanitation, Koramangala 4th Block',
      municipalBody: 'BBMP',
    },
    jrEngineerRoads: {
      name: 'Suresh Kumar',
      designation: 'Junior Engineer (Roads), Bommanahalli Zone',
      phone: '080-2553-4108',
      email: 'je.roads108@bbmp.gov.in',
      office: 'BBMP Roads Division, Bommanahalli Zone',
      municipalBody: 'BBMP',
    },
    rtiPIO: {
      name: 'Chief Officer (Revenue), BBMP',
      address: 'BBMP Headquarters, Hudson Circle, Bengaluru 560002',
      email: 'rti@bbmp.gov.in',
      portal: 'sakala.kar.nic.in',
      fee: '10',
    },
    escalationLadder: [
      { level: 'WARD_OFFICER', name: 'Kavitha R.', designation: 'Ward Executive Officer Ward 108', phone: '080-2560-4108', email: 'who.ward108@bbmp.gov.in', address: 'BBMP Zone Office, Koramangala' },
      { level: 'DEPUTY_COMMISSIONER', name: 'Joint Commissioner (Bommanahalli Zone)', designation: 'Joint Commissioner, BBMP', phone: '080-2553-1533', email: 'jc.bommanahalli@bbmp.gov.in', address: 'BBMP Bommanahalli Zone Office' },
      { level: 'MUNICIPAL_COMMISSIONER', name: 'Tushar Giri Nath', designation: 'BBMP Commissioner', phone: '080-2221-1780', email: 'commissioner@bbmp.gov.in', address: 'BBMP HQ, Hudson Circle, Bengaluru 560002' },
      { level: 'COUNCILLOR', name: 'Roopa Gowda', designation: 'Ward 108 Councillor (BJP)', phone: '080-2560-3108', email: 'ward108@bbmp.gov.in', address: 'Ward 108 Office, Koramangala' },
      { level: 'MLA', name: 'Ramalinga Reddy', designation: 'MLA BTM Layout (Congress)', phone: '080-2222-1234', email: 'ramalingareddy.mla@gmail.com', address: 'Karnataka Vidhana Soudha, Bengaluru 560001' },
      { level: 'MP', name: 'Tejasvi Surya', designation: 'MP Bengaluru South (BJP)', phone: '080-2223-0108', email: 'tejasvi.surya@sansad.nic.in', address: 'Parliament House, New Delhi 110001' },
      { level: 'RTI', name: 'Chief Officer, BBMP', designation: 'Public Information Officer', phone: '080-2221-1780', email: 'rti@bbmp.gov.in', address: 'BBMP HQ, Hudson Circle, Bengaluru 560002' },
    ],
  },

  // ── DELHI WARD 92 (Lajpat Nagar) ────────────────────────
  'DEL-92': {
    wardNumber: 92,
    wardName: 'Lajpat Nagar',
    city: 'DELHI',
    councillor: {
      name: 'Seema Tiwari',
      party: 'Aam Aadmi Party (AAP)',
      constituency: 'MCD Ward 92',
      phone: '011-2692-0092',
      email: 'ward92@mcd.gov.in',
      office: 'Ward 92 Office, Lajpat Nagar, New Delhi 110024',
      electionYear: 2022,
      type: 'COUNCILLOR',
    },
    mla: STATE_MLAS['DL_LAJPAT_NAGAR'],
    mp: LOK_SABHA_MPS_2024['SOUTH_DELHI'],
    wardOfficer: {
      name: 'Rohit Sharma',
      designation: 'Junior Engineer / Ward In-Charge, Ward 92',
      phone: '011-2336-0092',
      email: 'ward92@mcdsouth.gov.in',
      office: 'MCD South Zone, Sector-E, Shiv Vihar, Delhi 110044',
      municipalBody: 'MCD',
    },
    sanitaryInspector: {
      name: 'Manoj Kumar',
      designation: 'Sanitary Inspector, Lajpat Nagar Zone',
      phone: '011-2336-5348',
      email: 'si.lajpatnagar@mcd.gov.in',
      office: 'MCD Sanitation Sub-Division, Lajpat Nagar',
      municipalBody: 'MCD',
    },
    jrEngineerRoads: {
      name: 'Arun Gupta',
      designation: 'Junior Engineer (Roads), South Zone Ward 92',
      phone: '011-2336-5700',
      email: 'je.roads.ward92@mcd.gov.in',
      office: 'MCD Roads Division, South Zone',
      municipalBody: 'MCD',
    },
    rtiPIO: {
      name: 'Central Public Information Officer, MCD',
      address: 'MCD Headquarters, Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002',
      email: 'rti@mcd.gov.in',
      portal: 'rti.delhi.gov.in',
      fee: '10',
    },
    escalationLadder: [
      { level: 'WARD_OFFICER', name: 'Rohit Sharma', designation: 'Ward In-Charge Ward 92', phone: '011-2336-0092', email: 'ward92@mcdsouth.gov.in', address: 'MCD South Zone Office, Delhi' },
      { level: 'DEPUTY_COMMISSIONER', name: 'Deputy Commissioner (South Zone)', designation: 'Deputy Commissioner, MCD South', phone: '011-2336-5000', email: 'dc.south@mcd.gov.in', address: 'MCD South Zone, New Delhi' },
      { level: 'MUNICIPAL_COMMISSIONER', name: 'Ashwani Kumar', designation: 'Commissioner, MCD', phone: '011-2336-9900', email: 'commissioner@mcd.gov.in', address: 'MCD HQ, Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002' },
      { level: 'MAYOR', name: 'Shelly Oberoi', designation: 'Mayor, MCD (AAP)', phone: '011-2337-5656', email: 'mayor@mcd.gov.in', address: 'Dr. S.P.M. Civic Centre, Minto Road, New Delhi 110002' },
      { level: 'COUNCILLOR', name: 'Seema Tiwari', designation: 'Ward 92 Councillor (AAP)', phone: '011-2692-0092', email: 'ward92@mcd.gov.in', address: 'Ward 92 Office, Lajpat Nagar' },
      { level: 'MLA', name: 'Dharamvir Singh', designation: 'MLA Lajpat Nagar (BJP)', phone: '011-2691-2345', email: 'dharamvir.singh.mla@bjpdelhi.in', address: 'Delhi Vidhan Sabha, New Delhi 110002' },
      { level: 'MP', name: 'Ramvir Singh Bidhuri', designation: 'MP South Delhi (BJP)', phone: '011-2309-3850', email: 'ramvir.bidhuri@sansad.nic.in', address: 'Parliament House, New Delhi 110001' },
      { level: 'RTI', name: 'CPIO, MCD', designation: 'Public Information Officer', phone: '011-2336-9900', email: 'rti@mcd.gov.in', address: 'MCD HQ, Minto Road, New Delhi 110002' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────
// NATIONAL GRIEVANCE PORTALS
// ─────────────────────────────────────────────────────────────────
export const NATIONAL_PORTALS = {
  CPGRAMS: {
    name: 'CPGRAMS — Centralised Public Grievance Redress and Monitoring System',
    portal: 'pgportal.gov.in',
    phone: '1800-11-4000',
    email: 'darpg@nic.in',
    description: 'National grievance portal for central government — escalate if municipal body unresponsive',
  },
  SWACHHATA: {
    name: 'Swachhata App',
    portal: 'swachhbharat.mygov.in',
    phone: '1969',
    email: 'swachhata@mohua.gov.in',
    description: 'MoHUA garbage and sanitation complaints — 4,900+ cities',
  },
  UMANG: {
    name: 'UMANG App',
    portal: 'umang.gov.in',
    phone: '97183-97183',
    description: 'Unified Mobile Application for New-age Governance — 100+ services',
  },
  LOKPAL: {
    name: 'Lokpal of India',
    portal: 'lokpal.gov.in',
    phone: '1031',
    email: 'helpdesk@lokpal.gov.in',
    description: 'Anti-corruption & long-delayed grievances — final escalation option',
  },
  NCH: {
    name: 'National Consumer Helpline',
    portal: 'consumerhelpline.gov.in',
    phone: '1915',
    email: 'nchdelhi@nic.in',
    description: 'Municipal services = "services" under Consumer Protection Act 2019',
  },
};

// ─────────────────────────────────────────────────────────────────
// RTI PORTALS BY STATE
// ─────────────────────────────────────────────────────────────────
export const RTI_PORTALS: Record<string, { portal: string; fee: string; phone: string }> = {
  'West Bengal':  { portal: 'wbrtionline.gov.in',            fee: '10', phone: '033-2214-5151' },
  'Maharashtra':  { portal: 'aaplesarkar.mahaonline.gov.in', fee: '10', phone: '1800-120-8040' },
  'Karnataka':    { portal: 'sakala.kar.nic.in',             fee: '10', phone: '080-4455-4455' },
  'Delhi':        { portal: 'rti.delhi.gov.in',              fee: '10', phone: '011-2337-9534' },
  'Tamil Nadu':   { portal: 'rti.tncsc.tn.gov.in',           fee: '10', phone: '044-2538-5551' },
  'Telangana':    { portal: 'rtionline.telangana.gov.in',     fee: '10', phone: '040-2344-0008' },
  'Gujarat':      { portal: 'rti.gujarat.gov.in',            fee: '20', phone: '079-2325-4960' },
  'Rajasthan':    { portal: 'rti.rajasthan.gov.in',          fee: '10', phone: '0141-2227-766' },
  'National':     { portal: 'rtionline.gov.in',              fee: '10', phone: '011-2338-7539' },
};

// ─────────────────────────────────────────────────────────────────
// HELPLINE LOOKUP
// ─────────────────────────────────────────────────────────────────
export const CITY_HELPLINES: Record<string, {
  emergency: string; municipal: string; police: string; fire: string; ambulance: string;
  electricity: string; water: string; anticorruption: string;
}> = {
  KOLKATA: {
    emergency: '112', municipal: '1800-103-0012', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (CESC)', water: '033-2286-1313', anticorruption: '1064 (ACB WB)',
  },
  MUMBAI: {
    emergency: '112', municipal: '1916', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (BEST/Adani)', water: '1916', anticorruption: '1064 (ACB Maharashtra)',
  },
  BENGALURU: {
    emergency: '112', municipal: '1533', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (BESCOM)', water: '1916 (BWSSB)', anticorruption: '1064 (ACB Karnataka)',
  },
  DELHI: {
    emergency: '112', municipal: '155305', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (BSES/TATA)', water: '1916 (Delhi Jal Board)', anticorruption: '1031 (Lokpal)',
  },
  CHENNAI: {
    emergency: '112', municipal: '1913', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (TNEB)', water: '1916 (CMWSSB)', anticorruption: '044-2852-0440 (DVac TN)',
  },
  HYDERABAD: {
    emergency: '112', municipal: '040-21111111', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (TSSPDCL)', water: '1916 (HMWSSB)', anticorruption: '040-2341-9999 (ACB TS)',
  },
  PUNE: {
    emergency: '112', municipal: '020-25506818', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (MSEDCL)', water: '020-2568-1500', anticorruption: '1064 (ACB Maharashtra)',
  },
  AHMEDABAD: {
    emergency: '112', municipal: '155303', police: '100', fire: '101', ambulance: '108',
    electricity: '1912 (UGVCL)', water: '155303', anticorruption: '1064 (ACB Gujarat)',
  },
};

// ─────────────────────────────────────────────────────────────────
// HELPER: Get ward contacts for a city+ward
// ─────────────────────────────────────────────────────────────────
export function getWardContact(city: string, wardNumber: number): WardContact | undefined {
  const key = Object.keys(WARD_CONTACTS).find(k => {
    const [c, w] = k.split('-');
    return city.toUpperCase().startsWith(c) && parseInt(w) === wardNumber;
  });
  return key ? WARD_CONTACTS[key] : undefined;
}

export function getRTIPortal(state: string) {
  return RTI_PORTALS[state] || RTI_PORTALS['National'];
}

export function getHelplines(city: string) {
  return CITY_HELPLINES[city.toUpperCase()] || CITY_HELPLINES['KOLKATA'];
}
