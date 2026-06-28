export interface ZonePolygon {
  city: string;
  zoneName: string;
  zoneCode: string;
  color: string;
  wardRange: string;
  wardCount: number;
  path: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  description: string;
}

export const ZONE_POLYGONS: ZonePolygon[] = [
  // ─── KOLKATA KMC 16 Boroughs ───────────────────────────────────────────────
  {
    city: 'KOLKATA', zoneName: 'Borough I', zoneCode: 'KOL-B01',
    color: '#E53935', wardRange: '1-10', wardCount: 10,
    center: { lat: 22.650, lng: 88.380 },
    path: [
      { lat: 22.658, lng: 88.370 }, { lat: 22.658, lng: 88.392 },
      { lat: 22.643, lng: 88.392 }, { lat: 22.643, lng: 88.370 },
    ],
    description: 'North Kolkata – Shyambazar, Hatibagan',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough II', zoneCode: 'KOL-B02',
    color: '#E91E63', wardRange: '11-21', wardCount: 11,
    center: { lat: 22.615, lng: 88.375 },
    path: [
      { lat: 22.624, lng: 88.365 }, { lat: 22.624, lng: 88.386 },
      { lat: 22.606, lng: 88.386 }, { lat: 22.606, lng: 88.365 },
    ],
    description: 'Shyambazar North – Jorabagan, Maniktala',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough III', zoneCode: 'KOL-B03',
    color: '#9C27B0', wardRange: '22-30', wardCount: 9,
    center: { lat: 22.592, lng: 88.372 },
    path: [
      { lat: 22.600, lng: 88.362 }, { lat: 22.600, lng: 88.383 },
      { lat: 22.583, lng: 88.383 }, { lat: 22.583, lng: 88.362 },
    ],
    description: 'Shyambazar South – Girish Park, Sovabazar',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough IV', zoneCode: 'KOL-B04',
    color: '#673AB7', wardRange: '31-38', wardCount: 8,
    center: { lat: 22.581, lng: 88.367 },
    path: [
      { lat: 22.590, lng: 88.357 }, { lat: 22.590, lng: 88.378 },
      { lat: 22.572, lng: 88.378 }, { lat: 22.572, lng: 88.357 },
    ],
    description: 'Belgachia, Ultadanga, Shobhabazar',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough V', zoneCode: 'KOL-B05',
    color: '#3F51B5', wardRange: '39-47', wardCount: 9,
    center: { lat: 22.575, lng: 88.360 },
    path: [
      { lat: 22.584, lng: 88.350 }, { lat: 22.584, lng: 88.371 },
      { lat: 22.566, lng: 88.371 }, { lat: 22.566, lng: 88.350 },
    ],
    description: 'Central North – Amherst Street, Shyambazar',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough VI', zoneCode: 'KOL-B06',
    color: '#2196F3', wardRange: '48-58', wardCount: 11,
    center: { lat: 22.568, lng: 88.354 },
    path: [
      { lat: 22.577, lng: 88.344 }, { lat: 22.577, lng: 88.365 },
      { lat: 22.559, lng: 88.365 }, { lat: 22.559, lng: 88.344 },
    ],
    description: 'Central Kolkata – Bow Bazar, Central Avenue',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough VII', zoneCode: 'KOL-B07',
    color: '#03A9F4', wardRange: '59-67', wardCount: 9,
    center: { lat: 22.562, lng: 88.344 },
    path: [
      { lat: 22.571, lng: 88.334 }, { lat: 22.571, lng: 88.355 },
      { lat: 22.553, lng: 88.355 }, { lat: 22.553, lng: 88.334 },
    ],
    description: 'Central West – Chandni Chowk, Mullick Bazar',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough VIII', zoneCode: 'KOL-B08',
    color: '#00BCD4', wardRange: '68-77', wardCount: 10,
    center: { lat: 22.553, lng: 88.348 },
    path: [
      { lat: 22.562, lng: 88.338 }, { lat: 22.562, lng: 88.359 },
      { lat: 22.544, lng: 88.359 }, { lat: 22.544, lng: 88.338 },
    ],
    description: 'Kalighat – Rashbehari, Hazra',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough IX', zoneCode: 'KOL-B09',
    color: '#009688', wardRange: '78-88', wardCount: 11,
    center: { lat: 22.540, lng: 88.345 },
    path: [
      { lat: 22.549, lng: 88.335 }, { lat: 22.549, lng: 88.356 },
      { lat: 22.531, lng: 88.356 }, { lat: 22.531, lng: 88.335 },
    ],
    description: 'Bhowanipore – Lansdowne, Chetla',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough X', zoneCode: 'KOL-B10',
    color: '#4CAF50', wardRange: '89-100', wardCount: 12,
    center: { lat: 22.523, lng: 88.339 },
    path: [
      { lat: 22.533, lng: 88.328 }, { lat: 22.533, lng: 88.351 },
      { lat: 22.513, lng: 88.351 }, { lat: 22.513, lng: 88.328 },
    ],
    description: 'Alipore, Tollygunge',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XI', zoneCode: 'KOL-B11',
    color: '#8BC34A', wardRange: '101-111', wardCount: 11,
    center: { lat: 22.519, lng: 88.315 },
    path: [
      { lat: 22.529, lng: 88.304 }, { lat: 22.529, lng: 88.327 },
      { lat: 22.509, lng: 88.327 }, { lat: 22.509, lng: 88.304 },
    ],
    description: 'Garden Reach – Metiabruz, Ekbalpore',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XII', zoneCode: 'KOL-B12',
    color: '#CDDC39', wardRange: '112-122', wardCount: 11,
    center: { lat: 22.499, lng: 88.363 },
    path: [
      { lat: 22.509, lng: 88.352 }, { lat: 22.509, lng: 88.375 },
      { lat: 22.489, lng: 88.375 }, { lat: 22.489, lng: 88.352 },
    ],
    description: 'Jadavpur – Regent Park, Selimpur',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XIII', zoneCode: 'KOL-B13',
    color: '#FFC107', wardRange: '123-133', wardCount: 11,
    center: { lat: 22.511, lng: 88.375 },
    path: [
      { lat: 22.521, lng: 88.364 }, { lat: 22.521, lng: 88.387 },
      { lat: 22.501, lng: 88.387 }, { lat: 22.501, lng: 88.364 },
    ],
    description: 'Kasba – Gariahat, Ballygunge',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XIV', zoneCode: 'KOL-B14',
    color: '#FF9800', wardRange: '134-141', wardCount: 8,
    center: { lat: 22.499, lng: 88.394 },
    path: [
      { lat: 22.509, lng: 88.383 }, { lat: 22.509, lng: 88.406 },
      { lat: 22.489, lng: 88.406 }, { lat: 22.489, lng: 88.383 },
    ],
    description: 'Anandapur – Mukundapur, E M Bypass',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XV', zoneCode: 'KOL-B15',
    color: '#FF5722', wardRange: '142-144', wardCount: 3,
    center: { lat: 22.507, lng: 88.326 },
    path: [
      { lat: 22.517, lng: 88.315 }, { lat: 22.517, lng: 88.338 },
      { lat: 22.497, lng: 88.338 }, { lat: 22.497, lng: 88.315 },
    ],
    description: 'New Alipore – Behala',
  },
  {
    city: 'KOLKATA', zoneName: 'Borough XVI', zoneCode: 'KOL-B16',
    color: '#795548', wardRange: '130-144', wardCount: 6,
    center: { lat: 22.488, lng: 88.340 },
    path: [
      { lat: 22.498, lng: 88.328 }, { lat: 22.498, lng: 88.352 },
      { lat: 22.478, lng: 88.352 }, { lat: 22.478, lng: 88.328 },
    ],
    description: 'Behala – Thakurpukur, Pailan',
  },

  // ─── MUMBAI MCGM ───────────────────────────────────────────────────────────
  {
    city: 'MUMBAI', zoneName: 'Island City – A Ward (Colaba)', zoneCode: 'MUM-A',
    color: '#B71C1C', wardRange: '1-8', wardCount: 8,
    center: { lat: 18.908, lng: 72.813 },
    path: [
      { lat: 18.930, lng: 72.800 }, { lat: 18.930, lng: 72.830 },
      { lat: 18.890, lng: 72.830 }, { lat: 18.890, lng: 72.800 },
    ],
    description: 'Colaba, Cuffe Parade, Nariman Point',
  },
  {
    city: 'MUMBAI', zoneName: 'Island City – B Ward (Mazgaon)', zoneCode: 'MUM-B',
    color: '#880E4F', wardRange: '9-18', wardCount: 10,
    center: { lat: 18.960, lng: 72.840 },
    path: [
      { lat: 18.975, lng: 72.828 }, { lat: 18.975, lng: 72.854 },
      { lat: 18.945, lng: 72.854 }, { lat: 18.945, lng: 72.828 },
    ],
    description: 'Mazgaon, Dongri, Mandvi',
  },
  {
    city: 'MUMBAI', zoneName: 'Island City – C Ward (Matunga)', zoneCode: 'MUM-C',
    color: '#4A148C', wardRange: '19-28', wardCount: 10,
    center: { lat: 19.024, lng: 72.843 },
    path: [
      { lat: 19.038, lng: 72.831 }, { lat: 19.038, lng: 72.857 },
      { lat: 19.010, lng: 72.857 }, { lat: 19.010, lng: 72.831 },
    ],
    description: 'Matunga, Dadar, Parel',
  },
  {
    city: 'MUMBAI', zoneName: 'Island City – D Ward (Worli)', zoneCode: 'MUM-D',
    color: '#1A237E', wardRange: '29-43', wardCount: 15,
    center: { lat: 19.011, lng: 72.818 },
    path: [
      { lat: 19.026, lng: 72.806 }, { lat: 19.026, lng: 72.832 },
      { lat: 18.996, lng: 72.832 }, { lat: 18.996, lng: 72.806 },
    ],
    description: 'Worli, Lower Parel, Sewri',
  },
  {
    city: 'MUMBAI', zoneName: 'Island City – E Ward (Byculla)', zoneCode: 'MUM-E',
    color: '#006064', wardRange: '44-56', wardCount: 13,
    center: { lat: 18.976, lng: 72.835 },
    path: [
      { lat: 18.992, lng: 72.822 }, { lat: 18.992, lng: 72.849 },
      { lat: 18.960, lng: 72.849 }, { lat: 18.960, lng: 72.822 },
    ],
    description: 'Byculla, Nagpada, Agripada',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – F/N Ward (Kurla)', zoneCode: 'MUM-FN',
    color: '#1B5E20', wardRange: '57-72', wardCount: 16,
    center: { lat: 19.065, lng: 72.879 },
    path: [
      { lat: 19.082, lng: 72.865 }, { lat: 19.082, lng: 72.895 },
      { lat: 19.048, lng: 72.895 }, { lat: 19.048, lng: 72.865 },
    ],
    description: 'Kurla, Nehru Nagar, Tilak Nagar',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – F/S Ward (Chembur)', zoneCode: 'MUM-FS',
    color: '#33691E', wardRange: '73-84', wardCount: 12,
    center: { lat: 19.061, lng: 72.899 },
    path: [
      { lat: 19.077, lng: 72.886 }, { lat: 19.077, lng: 72.914 },
      { lat: 19.045, lng: 72.914 }, { lat: 19.045, lng: 72.886 },
    ],
    description: 'Chembur, Govandi, Mankhurd',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – G/N Ward (Dharavi)', zoneCode: 'MUM-GN',
    color: '#F57F17', wardRange: '85-96', wardCount: 12,
    center: { lat: 19.040, lng: 72.851 },
    path: [
      { lat: 19.056, lng: 72.838 }, { lat: 19.056, lng: 72.865 },
      { lat: 19.024, lng: 72.865 }, { lat: 19.024, lng: 72.838 },
    ],
    description: 'Dharavi, Mahim, Sion',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – G/S Ward (Sion)', zoneCode: 'MUM-GS',
    color: '#E65100', wardRange: '97-107', wardCount: 11,
    center: { lat: 19.042, lng: 72.866 },
    path: [
      { lat: 19.058, lng: 72.853 }, { lat: 19.058, lng: 72.880 },
      { lat: 19.026, lng: 72.880 }, { lat: 19.026, lng: 72.853 },
    ],
    description: 'Sion, Antop Hill, Wadala',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – H/E Ward (Bandra East)', zoneCode: 'MUM-HE',
    color: '#BF360C', wardRange: '108-119', wardCount: 12,
    center: { lat: 19.054, lng: 72.855 },
    path: [
      { lat: 19.070, lng: 72.842 }, { lat: 19.070, lng: 72.870 },
      { lat: 19.038, lng: 72.870 }, { lat: 19.038, lng: 72.842 },
    ],
    description: 'Bandra East, Vakola, Santacruz East',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – H/W Ward (Bandra West)', zoneCode: 'MUM-HW',
    color: '#3E2723', wardRange: '120-130', wardCount: 11,
    center: { lat: 19.061, lng: 72.834 },
    path: [
      { lat: 19.077, lng: 72.821 }, { lat: 19.077, lng: 72.848 },
      { lat: 19.045, lng: 72.848 }, { lat: 19.045, lng: 72.821 },
    ],
    description: 'Bandra West, Khar, Carter Road',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – K/E Ward (Andheri East)', zoneCode: 'MUM-KE',
    color: '#212121', wardRange: '131-140', wardCount: 10,
    center: { lat: 19.114, lng: 72.877 },
    path: [
      { lat: 19.130, lng: 72.863 }, { lat: 19.130, lng: 72.892 },
      { lat: 19.098, lng: 72.892 }, { lat: 19.098, lng: 72.863 },
    ],
    description: 'Andheri East, MIDC, Chakala',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – K/W Ward (Andheri West)', zoneCode: 'MUM-KW',
    color: '#546E7A', wardRange: '141-150', wardCount: 10,
    center: { lat: 19.119, lng: 72.845 },
    path: [
      { lat: 19.135, lng: 72.831 }, { lat: 19.135, lng: 72.860 },
      { lat: 19.103, lng: 72.860 }, { lat: 19.103, lng: 72.831 },
    ],
    description: 'Andheri West, Versova, Lokhandwala',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – L Ward (Kurla East)', zoneCode: 'MUM-L',
    color: '#00695C', wardRange: '151-162', wardCount: 12,
    center: { lat: 19.075, lng: 72.883 },
    path: [
      { lat: 19.091, lng: 72.869 }, { lat: 19.091, lng: 72.898 },
      { lat: 19.059, lng: 72.898 }, { lat: 19.059, lng: 72.869 },
    ],
    description: 'Kurla East, Ghatkopar West',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – M/E Ward (Chembur East)', zoneCode: 'MUM-ME',
    color: '#2E7D32', wardRange: '163-173', wardCount: 11,
    center: { lat: 19.062, lng: 72.904 },
    path: [
      { lat: 19.078, lng: 72.890 }, { lat: 19.078, lng: 72.919 },
      { lat: 19.046, lng: 72.919 }, { lat: 19.046, lng: 72.890 },
    ],
    description: 'Chembur East, Tilak Nagar, Kurla',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – M/W Ward', zoneCode: 'MUM-MW',
    color: '#558B2F', wardRange: '174-183', wardCount: 10,
    center: { lat: 19.045, lng: 72.857 },
    path: [
      { lat: 19.061, lng: 72.843 }, { lat: 19.061, lng: 72.872 },
      { lat: 19.029, lng: 72.872 }, { lat: 19.029, lng: 72.843 },
    ],
    description: 'Dharavi South, Shivaji Nagar',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – N Ward (Ghatkopar)', zoneCode: 'MUM-N',
    color: '#827717', wardRange: '184-194', wardCount: 11,
    center: { lat: 19.089, lng: 72.909 },
    path: [
      { lat: 19.105, lng: 72.894 }, { lat: 19.105, lng: 72.925 },
      { lat: 19.073, lng: 72.925 }, { lat: 19.073, lng: 72.894 },
    ],
    description: 'Ghatkopar East & West',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – P/N Ward (Goregaon)', zoneCode: 'MUM-PN',
    color: '#F9A825', wardRange: '195-203', wardCount: 9,
    center: { lat: 19.161, lng: 72.848 },
    path: [
      { lat: 19.177, lng: 72.834 }, { lat: 19.177, lng: 72.863 },
      { lat: 19.145, lng: 72.863 }, { lat: 19.145, lng: 72.834 },
    ],
    description: 'Goregaon East & West',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – P/S Ward (Jogeshwari)', zoneCode: 'MUM-PS',
    color: '#FF6F00', wardRange: '204-211', wardCount: 8,
    center: { lat: 19.133, lng: 72.846 },
    path: [
      { lat: 19.149, lng: 72.832 }, { lat: 19.149, lng: 72.861 },
      { lat: 19.117, lng: 72.861 }, { lat: 19.117, lng: 72.832 },
    ],
    description: 'Jogeshwari East & West, Oshiwara',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – R/C Ward (Borivali Central)', zoneCode: 'MUM-RC',
    color: '#E65100', wardRange: '212-218', wardCount: 7,
    center: { lat: 19.234, lng: 72.855 },
    path: [
      { lat: 19.250, lng: 72.841 }, { lat: 19.250, lng: 72.870 },
      { lat: 19.218, lng: 72.870 }, { lat: 19.218, lng: 72.841 },
    ],
    description: 'Borivali Central, Eksar',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – R/N Ward (Dahisar)', zoneCode: 'MUM-RN',
    color: '#BF360C', wardRange: '219-221', wardCount: 3,
    center: { lat: 19.262, lng: 72.855 },
    path: [
      { lat: 19.278, lng: 72.841 }, { lat: 19.278, lng: 72.870 },
      { lat: 19.246, lng: 72.870 }, { lat: 19.246, lng: 72.841 },
    ],
    description: 'Dahisar East & West',
  },
  {
    city: 'MUMBAI', zoneName: 'Western Suburbs – R/S Ward (Kandivali)', zoneCode: 'MUM-RS',
    color: '#4E342E', wardRange: '222-224', wardCount: 3,
    center: { lat: 19.204, lng: 72.842 },
    path: [
      { lat: 19.220, lng: 72.828 }, { lat: 19.220, lng: 72.857 },
      { lat: 19.188, lng: 72.857 }, { lat: 19.188, lng: 72.828 },
    ],
    description: 'Kandivali East & West',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – S Ward (Mulund West)', zoneCode: 'MUM-S',
    color: '#37474F', wardRange: '225-226', wardCount: 2,
    center: { lat: 19.176, lng: 72.960 },
    path: [
      { lat: 19.192, lng: 72.945 }, { lat: 19.192, lng: 72.976 },
      { lat: 19.160, lng: 72.976 }, { lat: 19.160, lng: 72.945 },
    ],
    description: 'Mulund West',
  },
  {
    city: 'MUMBAI', zoneName: 'Eastern Suburbs – T Ward (Mulund East)', zoneCode: 'MUM-T',
    color: '#263238', wardRange: '227', wardCount: 1,
    center: { lat: 19.171, lng: 72.956 },
    path: [
      { lat: 19.187, lng: 72.942 }, { lat: 19.187, lng: 72.971 },
      { lat: 19.155, lng: 72.971 }, { lat: 19.155, lng: 72.942 },
    ],
    description: 'Mulund East',
  },

  // ─── BENGALURU BBMP 8 Zones ─────────────────────────────────────────────────
  {
    city: 'BENGALURU', zoneName: 'Yelahanka Zone', zoneCode: 'BLR-YEL',
    color: '#B71C1C', wardRange: '1-24', wardCount: 24,
    center: { lat: 13.100, lng: 77.596 },
    path: [
      { lat: 13.145, lng: 77.556 }, { lat: 13.145, lng: 77.636 },
      { lat: 13.055, lng: 77.636 }, { lat: 13.055, lng: 77.556 },
    ],
    description: 'Yelahanka, Hebbal, Jakkur, Thanisandra',
  },
  {
    city: 'BENGALURU', zoneName: 'South Zone', zoneCode: 'BLR-STH',
    color: '#1B5E20', wardRange: '25-52', wardCount: 28,
    center: { lat: 12.902, lng: 77.571 },
    path: [
      { lat: 12.945, lng: 77.531 }, { lat: 12.945, lng: 77.611 },
      { lat: 12.859, lng: 77.611 }, { lat: 12.859, lng: 77.531 },
    ],
    description: 'JP Nagar, Banashankari, BTM, Jayanagar',
  },
  {
    city: 'BENGALURU', zoneName: 'West Zone', zoneCode: 'BLR-WST',
    color: '#0D47A1', wardRange: '53-74', wardCount: 22,
    center: { lat: 12.973, lng: 77.558 },
    path: [
      { lat: 13.016, lng: 77.518 }, { lat: 13.016, lng: 77.598 },
      { lat: 12.930, lng: 77.598 }, { lat: 12.930, lng: 77.518 },
    ],
    description: 'Rajajinagar, Vijayanagar, Malleswaram, Nagarbhavi',
  },
  {
    city: 'BENGALURU', zoneName: 'East Zone', zoneCode: 'BLR-EST',
    color: '#E65100', wardRange: '75-111', wardCount: 37,
    center: { lat: 13.012, lng: 77.683 },
    path: [
      { lat: 13.055, lng: 77.643 }, { lat: 13.055, lng: 77.723 },
      { lat: 12.969, lng: 77.723 }, { lat: 12.969, lng: 77.643 },
    ],
    description: 'Banaswadi, Horamavu, Ramamurthy Nagar, Lingarajapuram',
  },
  {
    city: 'BENGALURU', zoneName: 'Mahadevapura Zone', zoneCode: 'BLR-MDP',
    color: '#4A148C', wardRange: '112-149', wardCount: 38,
    center: { lat: 12.984, lng: 77.735 },
    path: [
      { lat: 13.027, lng: 77.695 }, { lat: 13.027, lng: 77.775 },
      { lat: 12.941, lng: 77.775 }, { lat: 12.941, lng: 77.695 },
    ],
    description: 'Whitefield, ITPL, Marathahalli, Varthur, KR Puram',
  },
  {
    city: 'BENGALURU', zoneName: 'Bommanahalli Zone', zoneCode: 'BLR-BMH',
    color: '#827717', wardRange: '150-177', wardCount: 28,
    center: { lat: 12.903, lng: 77.646 },
    path: [
      { lat: 12.946, lng: 77.606 }, { lat: 12.946, lng: 77.686 },
      { lat: 12.860, lng: 77.686 }, { lat: 12.860, lng: 77.606 },
    ],
    description: 'Bommanahalli, HSR Layout, Bellandur, Electronic City',
  },
  {
    city: 'BENGALURU', zoneName: 'RR Nagar Zone', zoneCode: 'BLR-RRN',
    color: '#006064', wardRange: '178-198', wardCount: 21,
    center: { lat: 12.919, lng: 77.510 },
    path: [
      { lat: 12.962, lng: 77.470 }, { lat: 12.962, lng: 77.550 },
      { lat: 12.876, lng: 77.550 }, { lat: 12.876, lng: 77.470 },
    ],
    description: 'RR Nagar, Uttarahalli, Kengeri, Mysore Road',
  },
  {
    city: 'BENGALURU', zoneName: 'Dasarahalli Zone', zoneCode: 'BLR-DSH',
    color: '#BF360C', wardRange: '1-25', wardCount: 20,
    center: { lat: 13.033, lng: 77.534 },
    path: [
      { lat: 13.076, lng: 77.494 }, { lat: 13.076, lng: 77.574 },
      { lat: 12.990, lng: 77.574 }, { lat: 12.990, lng: 77.494 },
    ],
    description: 'Dasarahalli, Peenya, Yeshwanthpur, Jalahalli',
  },

  // ─── DELHI MCD 12 Zones ──────────────────────────────────────────────────────
  {
    city: 'DELHI', zoneName: 'City-SP Zone', zoneCode: 'DEL-CSP',
    color: '#B71C1C', wardRange: '1-18', wardCount: 18,
    center: { lat: 28.652, lng: 77.230 },
    path: [
      { lat: 28.670, lng: 77.210 }, { lat: 28.670, lng: 77.250 },
      { lat: 28.634, lng: 77.250 }, { lat: 28.634, lng: 77.210 },
    ],
    description: 'Old Delhi, Chandni Chowk, Sadar Bazar',
  },
  {
    city: 'DELHI', zoneName: 'Civil Lines Zone', zoneCode: 'DEL-CVL',
    color: '#880E4F', wardRange: '19-36', wardCount: 18,
    center: { lat: 28.700, lng: 77.218 },
    path: [
      { lat: 28.718, lng: 77.198 }, { lat: 28.718, lng: 77.238 },
      { lat: 28.682, lng: 77.238 }, { lat: 28.682, lng: 77.198 },
    ],
    description: 'Civil Lines, Model Town, Adarsh Nagar',
  },
  {
    city: 'DELHI', zoneName: 'Karol Bagh Zone', zoneCode: 'DEL-KBG',
    color: '#4A148C', wardRange: '37-54', wardCount: 18,
    center: { lat: 28.651, lng: 77.190 },
    path: [
      { lat: 28.669, lng: 77.170 }, { lat: 28.669, lng: 77.210 },
      { lat: 28.633, lng: 77.210 }, { lat: 28.633, lng: 77.170 },
    ],
    description: 'Karol Bagh, Patel Nagar, Rajendra Place',
  },
  {
    city: 'DELHI', zoneName: 'Keshavpuram Zone', zoneCode: 'DEL-KSP',
    color: '#1A237E', wardRange: '55-72', wardCount: 18,
    center: { lat: 28.690, lng: 77.165 },
    path: [
      { lat: 28.708, lng: 77.145 }, { lat: 28.708, lng: 77.185 },
      { lat: 28.672, lng: 77.185 }, { lat: 28.672, lng: 77.145 },
    ],
    description: 'Keshavpuram, Tri Nagar, Ashok Vihar',
  },
  {
    city: 'DELHI', zoneName: 'Najafgarh Zone', zoneCode: 'DEL-NJF',
    color: '#006064', wardRange: '73-90', wardCount: 18,
    center: { lat: 28.608, lng: 76.983 },
    path: [
      { lat: 28.650, lng: 76.943 }, { lat: 28.650, lng: 77.023 },
      { lat: 28.566, lng: 77.023 }, { lat: 28.566, lng: 76.943 },
    ],
    description: 'Najafgarh, Dwarka, Uttam Nagar',
  },
  {
    city: 'DELHI', zoneName: 'Narela Zone', zoneCode: 'DEL-NRL',
    color: '#1B5E20', wardRange: '91-108', wardCount: 18,
    center: { lat: 28.847, lng: 77.094 },
    path: [
      { lat: 28.895, lng: 77.054 }, { lat: 28.895, lng: 77.134 },
      { lat: 28.799, lng: 77.134 }, { lat: 28.799, lng: 77.054 },
    ],
    description: 'Narela, Bawana, Alipur, Holambi Kalan',
  },
  {
    city: 'DELHI', zoneName: 'Rohini Zone', zoneCode: 'DEL-RHN',
    color: '#F57F17', wardRange: '109-126', wardCount: 18,
    center: { lat: 28.742, lng: 77.068 },
    path: [
      { lat: 28.780, lng: 77.028 }, { lat: 28.780, lng: 77.108 },
      { lat: 28.704, lng: 77.108 }, { lat: 28.704, lng: 77.028 },
    ],
    description: 'Rohini, Prashant Vihar, Shalimar Bagh',
  },
  {
    city: 'DELHI', zoneName: 'Shahdara North Zone', zoneCode: 'DEL-SHN',
    color: '#E65100', wardRange: '127-144', wardCount: 18,
    center: { lat: 28.694, lng: 77.310 },
    path: [
      { lat: 28.732, lng: 77.270 }, { lat: 28.732, lng: 77.350 },
      { lat: 28.656, lng: 77.350 }, { lat: 28.656, lng: 77.270 },
    ],
    description: 'Shahdara, Vivek Vihar, Geeta Colony',
  },
  {
    city: 'DELHI', zoneName: 'Shahdara South Zone', zoneCode: 'DEL-SHS',
    color: '#BF360C', wardRange: '145-162', wardCount: 18,
    center: { lat: 28.643, lng: 77.305 },
    path: [
      { lat: 28.681, lng: 77.265 }, { lat: 28.681, lng: 77.345 },
      { lat: 28.605, lng: 77.345 }, { lat: 28.605, lng: 77.265 },
    ],
    description: 'Patparganj, Preet Vihar, Mayur Vihar',
  },
  {
    city: 'DELHI', zoneName: 'South Zone', zoneCode: 'DEL-STH',
    color: '#01579B', wardRange: '163-180', wardCount: 18,
    center: { lat: 28.550, lng: 77.247 },
    path: [
      { lat: 28.600, lng: 77.207 }, { lat: 28.600, lng: 77.287 },
      { lat: 28.500, lng: 77.287 }, { lat: 28.500, lng: 77.207 },
    ],
    description: 'Greater Kailash, Saket, Hauz Khas, Malviya Nagar',
  },
  {
    city: 'DELHI', zoneName: 'West Zone', zoneCode: 'DEL-WST',
    color: '#4E342E', wardRange: '181-198', wardCount: 18,
    center: { lat: 28.644, lng: 77.099 },
    path: [
      { lat: 28.682, lng: 77.059 }, { lat: 28.682, lng: 77.139 },
      { lat: 28.606, lng: 77.139 }, { lat: 28.606, lng: 77.059 },
    ],
    description: 'Janakpuri, Vikaspuri, Tilak Nagar',
  },
  {
    city: 'DELHI', zoneName: 'Central Zone', zoneCode: 'DEL-CNT',
    color: '#37474F', wardRange: '199-250', wardCount: 52,
    center: { lat: 28.632, lng: 77.225 },
    path: [
      { lat: 28.670, lng: 77.185 }, { lat: 28.670, lng: 77.265 },
      { lat: 28.594, lng: 77.265 }, { lat: 28.594, lng: 77.185 },
    ],
    description: 'Central Delhi, New Delhi, Lutyens Zone',
  },

  // ─── CHENNAI GCC Zones ───────────────────────────────────────────────────────
  {
    city: 'CHENNAI', zoneName: 'Zone I', zoneCode: 'CHN-Z01',
    color: '#B71C1C', wardRange: '1-14', wardCount: 14,
    center: { lat: 13.145, lng: 80.281 },
    path: [
      { lat: 13.165, lng: 80.260 }, { lat: 13.165, lng: 80.302 },
      { lat: 13.125, lng: 80.302 }, { lat: 13.125, lng: 80.260 },
    ],
    description: 'Thiruvottiyur, Manali',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone II', zoneCode: 'CHN-Z02',
    color: '#880E4F', wardRange: '15-28', wardCount: 14,
    center: { lat: 13.130, lng: 80.260 },
    path: [
      { lat: 13.150, lng: 80.239 }, { lat: 13.150, lng: 80.281 },
      { lat: 13.110, lng: 80.281 }, { lat: 13.110, lng: 80.239 },
    ],
    description: 'Madhavaram, Villivakkam',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone III', zoneCode: 'CHN-Z03',
    color: '#4A148C', wardRange: '29-42', wardCount: 14,
    center: { lat: 13.115, lng: 80.245 },
    path: [
      { lat: 13.135, lng: 80.224 }, { lat: 13.135, lng: 80.266 },
      { lat: 13.095, lng: 80.266 }, { lat: 13.095, lng: 80.224 },
    ],
    description: 'Ambattur, Pattabiram',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone IV', zoneCode: 'CHN-Z04',
    color: '#1A237E', wardRange: '43-54', wardCount: 12,
    center: { lat: 13.105, lng: 80.270 },
    path: [
      { lat: 13.125, lng: 80.249 }, { lat: 13.125, lng: 80.291 },
      { lat: 13.085, lng: 80.291 }, { lat: 13.085, lng: 80.249 },
    ],
    description: 'Tondiarpet, Royapuram',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone V', zoneCode: 'CHN-Z05',
    color: '#006064', wardRange: '55-67', wardCount: 13,
    center: { lat: 13.090, lng: 80.285 },
    path: [
      { lat: 13.110, lng: 80.264 }, { lat: 13.110, lng: 80.306 },
      { lat: 13.070, lng: 80.306 }, { lat: 13.070, lng: 80.264 },
    ],
    description: 'Perambur, Basin Bridge',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone VI', zoneCode: 'CHN-Z06',
    color: '#1B5E20', wardRange: '68-81', wardCount: 14,
    center: { lat: 13.080, lng: 80.272 },
    path: [
      { lat: 13.100, lng: 80.251 }, { lat: 13.100, lng: 80.293 },
      { lat: 13.060, lng: 80.293 }, { lat: 13.060, lng: 80.251 },
    ],
    description: 'Thiru Vi Ka Nagar, Pulianthope',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone VII', zoneCode: 'CHN-Z07',
    color: '#F57F17', wardRange: '82-95', wardCount: 14,
    center: { lat: 13.068, lng: 80.257 },
    path: [
      { lat: 13.088, lng: 80.236 }, { lat: 13.088, lng: 80.278 },
      { lat: 13.048, lng: 80.278 }, { lat: 13.048, lng: 80.236 },
    ],
    description: 'Anna Nagar, Kilpauk, Egmore',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone VIII', zoneCode: 'CHN-Z08',
    color: '#E65100', wardRange: '96-109', wardCount: 14,
    center: { lat: 13.055, lng: 80.263 },
    path: [
      { lat: 13.075, lng: 80.242 }, { lat: 13.075, lng: 80.284 },
      { lat: 13.035, lng: 80.284 }, { lat: 13.035, lng: 80.242 },
    ],
    description: 'Teynampet, Nungambakkam, Alwarpet',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone IX', zoneCode: 'CHN-Z09',
    color: '#BF360C', wardRange: '110-122', wardCount: 13,
    center: { lat: 13.042, lng: 80.252 },
    path: [
      { lat: 13.062, lng: 80.231 }, { lat: 13.062, lng: 80.273 },
      { lat: 13.022, lng: 80.273 }, { lat: 13.022, lng: 80.231 },
    ],
    description: 'Kodambakkam, Ashok Nagar, Vadapalani',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone X', zoneCode: 'CHN-Z10',
    color: '#01579B', wardRange: '123-133', wardCount: 11,
    center: { lat: 13.030, lng: 80.241 },
    path: [
      { lat: 13.050, lng: 80.220 }, { lat: 13.050, lng: 80.262 },
      { lat: 13.010, lng: 80.262 }, { lat: 13.010, lng: 80.220 },
    ],
    description: 'Virugambakkam, Saligramam',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone XI', zoneCode: 'CHN-Z11',
    color: '#0D47A1', wardRange: '134-147', wardCount: 14,
    center: { lat: 13.015, lng: 80.231 },
    path: [
      { lat: 13.035, lng: 80.210 }, { lat: 13.035, lng: 80.252 },
      { lat: 12.995, lng: 80.252 }, { lat: 12.995, lng: 80.210 },
    ],
    description: 'Valasaravakkam, Porur, Ramapuram',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone XII', zoneCode: 'CHN-Z12',
    color: '#1A237E', wardRange: '148-161', wardCount: 14,
    center: { lat: 13.003, lng: 80.220 },
    path: [
      { lat: 13.023, lng: 80.199 }, { lat: 13.023, lng: 80.241 },
      { lat: 12.983, lng: 80.241 }, { lat: 12.983, lng: 80.199 },
    ],
    description: 'Alandur, St. Thomas Mount, Guindy',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone XIII', zoneCode: 'CHN-Z13',
    color: '#4A148C', wardRange: '162-173', wardCount: 12,
    center: { lat: 12.990, lng: 80.234 },
    path: [
      { lat: 13.010, lng: 80.213 }, { lat: 13.010, lng: 80.255 },
      { lat: 12.970, lng: 80.255 }, { lat: 12.970, lng: 80.213 },
    ],
    description: 'Sholinganallur, Perungudi, Velachery',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone XIV', zoneCode: 'CHN-Z14',
    color: '#006064', wardRange: '174-187', wardCount: 14,
    center: { lat: 12.977, lng: 80.223 },
    path: [
      { lat: 12.997, lng: 80.202 }, { lat: 12.997, lng: 80.244 },
      { lat: 12.957, lng: 80.244 }, { lat: 12.957, lng: 80.202 },
    ],
    description: 'Adyar, Thiruvanmiyur, Besant Nagar',
  },
  {
    city: 'CHENNAI', zoneName: 'Zone XV', zoneCode: 'CHN-Z15',
    color: '#1B5E20', wardRange: '188-200', wardCount: 13,
    center: { lat: 12.964, lng: 80.212 },
    path: [
      { lat: 12.984, lng: 80.191 }, { lat: 12.984, lng: 80.233 },
      { lat: 12.944, lng: 80.233 }, { lat: 12.944, lng: 80.191 },
    ],
    description: 'Sholinganallur South, Perumbakkam, Medavakkam',
  },

  // ─── HYDERABAD GHMC 6 Circles ────────────────────────────────────────────────
  {
    city: 'HYDERABAD', zoneName: 'Central Zone', zoneCode: 'HYD-CNT',
    color: '#B71C1C', wardRange: '1-25', wardCount: 25,
    center: { lat: 17.385, lng: 78.474 },
    path: [
      { lat: 17.415, lng: 78.444 }, { lat: 17.415, lng: 78.504 },
      { lat: 17.355, lng: 78.504 }, { lat: 17.355, lng: 78.444 },
    ],
    description: 'Abids, Nampally, Koti, Himayatnagar',
  },
  {
    city: 'HYDERABAD', zoneName: 'Charminar Zone', zoneCode: 'HYD-CHM',
    color: '#880E4F', wardRange: '26-50', wardCount: 25,
    center: { lat: 17.361, lng: 78.474 },
    path: [
      { lat: 17.391, lng: 78.444 }, { lat: 17.391, lng: 78.504 },
      { lat: 17.331, lng: 78.504 }, { lat: 17.331, lng: 78.444 },
    ],
    description: 'Charminar, Falaknuma, Chandrayangutta, Karwan',
  },
  {
    city: 'HYDERABAD', zoneName: 'LB Nagar Zone', zoneCode: 'HYD-LBN',
    color: '#1B5E20', wardRange: '51-75', wardCount: 25,
    center: { lat: 17.339, lng: 78.544 },
    path: [
      { lat: 17.369, lng: 78.514 }, { lat: 17.369, lng: 78.574 },
      { lat: 17.309, lng: 78.574 }, { lat: 17.309, lng: 78.514 },
    ],
    description: 'LB Nagar, Saroornagar, Uppal, Hayathnagar',
  },
  {
    city: 'HYDERABAD', zoneName: 'Kukatpally Zone', zoneCode: 'HYD-KKP',
    color: '#0D47A1', wardRange: '76-100', wardCount: 25,
    center: { lat: 17.492, lng: 78.408 },
    path: [
      { lat: 17.522, lng: 78.378 }, { lat: 17.522, lng: 78.438 },
      { lat: 17.462, lng: 78.438 }, { lat: 17.462, lng: 78.378 },
    ],
    description: 'Kukatpally, KPHB, Miyapur, Madhapur',
  },
  {
    city: 'HYDERABAD', zoneName: 'Secunderabad Zone', zoneCode: 'HYD-SCB',
    color: '#E65100', wardRange: '101-125', wardCount: 25,
    center: { lat: 17.444, lng: 78.497 },
    path: [
      { lat: 17.474, lng: 78.467 }, { lat: 17.474, lng: 78.527 },
      { lat: 17.414, lng: 78.527 }, { lat: 17.414, lng: 78.467 },
    ],
    description: 'Secunderabad, Malkajgiri, Alwal, Trimulgherry',
  },
  {
    city: 'HYDERABAD', zoneName: 'Serilingampally Zone', zoneCode: 'HYD-SRL',
    color: '#4A148C', wardRange: '126-150', wardCount: 25,
    center: { lat: 17.457, lng: 78.383 },
    path: [
      { lat: 17.487, lng: 78.353 }, { lat: 17.487, lng: 78.413 },
      { lat: 17.427, lng: 78.413 }, { lat: 17.427, lng: 78.353 },
    ],
    description: 'Serilingampally, Gachibowli, Kondapur, Manikonda',
  },

  // ─── PUNE PMC 5 Regions ───────────────────────────────────────────────────────
  {
    city: 'PUNE', zoneName: 'Prabhag 1-3 (Core City)', zoneCode: 'PNE-CORE',
    color: '#B71C1C', wardRange: '1-30', wardCount: 30,
    center: { lat: 18.525, lng: 73.859 },
    path: [
      { lat: 18.555, lng: 73.829 }, { lat: 18.555, lng: 73.889 },
      { lat: 18.495, lng: 73.889 }, { lat: 18.495, lng: 73.829 },
    ],
    description: 'Shivajinagar, Deccan, Kasba Peth, Parvati',
  },
  {
    city: 'PUNE', zoneName: 'Prabhag 4-6 (East)', zoneCode: 'PNE-EST',
    color: '#1B5E20', wardRange: '31-60', wardCount: 30,
    center: { lat: 18.515, lng: 73.920 },
    path: [
      { lat: 18.545, lng: 73.890 }, { lat: 18.545, lng: 73.950 },
      { lat: 18.485, lng: 73.950 }, { lat: 18.485, lng: 73.890 },
    ],
    description: 'Hadapsar, Yerawada, Wanowrie, Kondhwa',
  },
  {
    city: 'PUNE', zoneName: 'Prabhag 7-9 (West)', zoneCode: 'PNE-WST',
    color: '#0D47A1', wardRange: '61-93', wardCount: 33,
    center: { lat: 18.528, lng: 73.820 },
    path: [
      { lat: 18.558, lng: 73.790 }, { lat: 18.558, lng: 73.850 },
      { lat: 18.498, lng: 73.850 }, { lat: 18.498, lng: 73.790 },
    ],
    description: 'Kothrud, Warje, Bibwewadi, Sinhagad Road',
  },
  {
    city: 'PUNE', zoneName: 'Prabhag 10-12 (North)', zoneCode: 'PNE-NTH',
    color: '#E65100', wardRange: '94-131', wardCount: 38,
    center: { lat: 18.565, lng: 73.856 },
    path: [
      { lat: 18.600, lng: 73.820 }, { lat: 18.600, lng: 73.892 },
      { lat: 18.530, lng: 73.892 }, { lat: 18.530, lng: 73.820 },
    ],
    description: 'Aundh, Baner, Khadki, Pimpri-adjacent',
  },
  {
    city: 'PUNE', zoneName: 'Prabhag 13-15 (Camp-Bhavani)', zoneCode: 'PNE-CAMP',
    color: '#4A148C', wardRange: '132-162', wardCount: 31,
    center: { lat: 18.500, lng: 73.888 },
    path: [
      { lat: 18.530, lng: 73.858 }, { lat: 18.530, lng: 73.918 },
      { lat: 18.470, lng: 73.918 }, { lat: 18.470, lng: 73.858 },
    ],
    description: 'Camp, Bhavani Peth, Ghorpadi, Mundhwa',
  },

  // ─── AHMEDABAD AMC 6 Zones ────────────────────────────────────────────────────
  {
    city: 'AHMEDABAD', zoneName: 'Central Zone', zoneCode: 'AMD-CNT',
    color: '#B71C1C', wardRange: '1-32', wardCount: 32,
    center: { lat: 23.026, lng: 72.585 },
    path: [
      { lat: 23.066, lng: 72.545 }, { lat: 23.066, lng: 72.625 },
      { lat: 22.986, lng: 72.625 }, { lat: 22.986, lng: 72.545 },
    ],
    description: 'Bhadra, Manek Chowk, Kalupur, Ellis Bridge',
  },
  {
    city: 'AHMEDABAD', zoneName: 'East Zone', zoneCode: 'AMD-EST',
    color: '#1B5E20', wardRange: '33-64', wardCount: 32,
    center: { lat: 22.998, lng: 72.645 },
    path: [
      { lat: 23.038, lng: 72.605 }, { lat: 23.038, lng: 72.685 },
      { lat: 22.958, lng: 72.685 }, { lat: 22.958, lng: 72.605 },
    ],
    description: 'Naroda, Odhav, Nikol, Vatwa',
  },
  {
    city: 'AHMEDABAD', zoneName: 'North Zone', zoneCode: 'AMD-NTH',
    color: '#0D47A1', wardRange: '65-96', wardCount: 32,
    center: { lat: 23.075, lng: 72.578 },
    path: [
      { lat: 23.115, lng: 72.538 }, { lat: 23.115, lng: 72.618 },
      { lat: 23.035, lng: 72.618 }, { lat: 23.035, lng: 72.538 },
    ],
    description: 'Chandkheda, Motera, Ranip, Sabarmati',
  },
  {
    city: 'AHMEDABAD', zoneName: 'South Zone', zoneCode: 'AMD-STH',
    color: '#E65100', wardRange: '97-128', wardCount: 32,
    center: { lat: 22.971, lng: 72.580 },
    path: [
      { lat: 23.011, lng: 72.540 }, { lat: 23.011, lng: 72.620 },
      { lat: 22.931, lng: 72.620 }, { lat: 22.931, lng: 72.540 },
    ],
    description: 'Maninagar, Isanpur, Khokhra, Ghodasar',
  },
  {
    city: 'AHMEDABAD', zoneName: 'West Zone', zoneCode: 'AMD-WST',
    color: '#4A148C', wardRange: '129-160', wardCount: 32,
    center: { lat: 23.035, lng: 72.533 },
    path: [
      { lat: 23.075, lng: 72.493 }, { lat: 23.075, lng: 72.573 },
      { lat: 22.995, lng: 72.573 }, { lat: 22.995, lng: 72.493 },
    ],
    description: 'Bodakdev, Vastrapur, Satellite, Prahlad Nagar',
  },
  {
    city: 'AHMEDABAD', zoneName: 'New West Zone', zoneCode: 'AMD-NWT',
    color: '#006064', wardRange: '161-192', wardCount: 32,
    center: { lat: 23.058, lng: 72.508 },
    path: [
      { lat: 23.098, lng: 72.468 }, { lat: 23.098, lng: 72.548 },
      { lat: 23.018, lng: 72.548 }, { lat: 23.018, lng: 72.468 },
    ],
    description: 'Bopal, Ghuma, Shilaj, Tragad, Thaltej',
  },
];

export function getZonesByCity(city: string): ZonePolygon[] {
  return ZONE_POLYGONS.filter(z => z.city === city);
}

export function getZoneByCode(code: string): ZonePolygon | undefined {
  return ZONE_POLYGONS.find(z => z.zoneCode === code);
}
