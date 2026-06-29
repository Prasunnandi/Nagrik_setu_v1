'use client';

// components/CivicMap.tsx — Full civic map: zone polygons, ward boundaries, clusters

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { Complaint, WardScorecard } from '@/lib/types';
import { MapPin, Layers, ZoomIn, ZoomOut, Search, X, Phone, MessageCircle, Info } from 'lucide-react';
import { ZONE_POLYGONS } from '@/lib/zonePolygons';
import { ALL_WARDS, searchWards, getWardsByCity, Ward } from '@/lib/allWardsData';

interface Props {
  complaints: Complaint[];
  ward: WardScorecard;
}

type LayerKey = 'zones' | 'wards' | 'complaints';

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ea4335', HIGH: '#fbbc04', MEDIUM: '#34a853', LOW: '#9aa0a6',
};
const GRADE_COLORS: Record<string, string> = {
  A: '#16a34a', B: '#2563eb', C: '#ca8a04', D: '#ea580c', F: '#dc2626',
};
const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  KOLKATA:   { lat: 22.5726, lng: 88.3639, zoom: 12 },
  MUMBAI:    { lat: 19.0760, lng: 72.8777, zoom: 11 },
  BENGALURU: { lat: 12.9716, lng: 77.5946, zoom: 11 },
  DELHI:     { lat: 28.7041, lng: 77.1025, zoom: 11 },
  CHENNAI:   { lat: 13.0827, lng: 80.2707, zoom: 11 },
  HYDERABAD: { lat: 17.3850, lng: 78.4867, zoom: 11 },
  PUNE:      { lat: 18.5204, lng: 73.8567, zoom: 12 },
  AHMEDABAD: { lat: 23.0225, lng: 72.5714, zoom: 12 },
};
const STATUS_ICONS: Record<string, string> = {
  FILED: '📋', ASSIGNED: '👤', IN_PROGRESS: '🔄', RESOLVED_CLAIMED: '⚠️',
  FAKE_CLOSURE_DETECTED: '🚨', ESCALATED: '📢', RTI_FILED: '📄', GENUINELY_RESOLVED: '✅',
};

// ── Ward phone generator ──────────────────────────────────────────────────────
function wardPhone(wardId: string): string {
  let h = 0;
  for (const ch of wardId) h = ((h * 31) + ch.charCodeAt(0)) & 0xffffff;
  const prefixes = ['98300', '97300', '96300', '94300', '90300', '98700', '98360', '98367'];
  const prefix   = prefixes[Math.abs(h) % prefixes.length];
  const rest     = String(Math.abs((h * 7919 + 12345) % 100000)).padStart(5, '0');
  return prefix + rest;
}

function formatPhone(p: string): string {
  return `+91 ${p.slice(0,5)} ${p.slice(5)}`;
}

// ── Voronoi-based ward boundary polygon generator ─────────────────────────────
// Generates organic, irregular polygons from ward centroids that approximate
// actual ward boundaries by finding the nearest neighbour in each angular direction.
function genWardBoundary(w: Ward, cityWards: Ward[]): google.maps.LatLngLiteral[] {
  const lngScale = Math.cos((w.lat * Math.PI) / 180);
  const NUM_ANGLES = 16;
  const points: google.maps.LatLngLiteral[] = [];

  // Seeded PRNG for reproducible noise
  let seed = w.id.split('').reduce((h, c) => ((h * 31) + c.charCodeAt(0)) & 0xffffff, 0);
  const rand = () => {
    seed = ((seed * 1664525) + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 4294967296;
  };

  for (let i = 0; i < NUM_ANGLES; i++) {
    const angle = (i / NUM_ANGLES) * 2 * Math.PI;
    const sinA  = Math.sin(angle);
    const cosA  = Math.cos(angle);

    // Default max radius ~1.4km (degrees)
    let minR = 0.013;

    for (const n of cityWards) {
      if (n.id === w.id) continue;
      const dlat  = n.lat  - w.lat;
      const dlng  = (n.lng - w.lng) * lngScale;
      const dist2 = dlat * dlat + dlng * dlng;
      if (dist2 > 0.0018) continue; // skip wards > ~4.8km away

      const dist = Math.sqrt(dist2);
      // Angular similarity: how well does this neighbour align with our current angle?
      const dot = (dlat * sinA + dlng * cosA) / dist;
      if (dot < 0.2) continue; // must be within ~78° of current angle

      // Boundary ≈ midpoint to neighbour, weighted toward us for overlap aesthetics
      const halfDist = (dist / 2) * (0.80 + dot * 0.12);
      if (halfDist < minR) minR = halfDist;
    }

    // Apply seeded noise for organic boundary variation (±20%)
    const noise = 0.82 + rand() * 0.36;
    const r     = minR * noise;

    points.push({
      lat: w.lat + sinA * r,
      lng: w.lng + cosA * r / lngScale,
    });
  }

  return points;
}

// ── InfoWindow popup HTML ─────────────────────────────────────────────────────
function buildWardPopup(w: Ward): string {
  const gradeColor = ({ A: '#16a34a', B: '#2563eb', C: '#ca8a04', D: '#ea580c', F: '#dc2626' } as Record<string, string>)[w.grade] || '#6b7280';
  const phone      = wardPhone(w.id);
  const waMsg      = encodeURIComponent(`Namaste Councillor ${w.councillorName} ji, I want to report a civic issue in Ward ${w.wardNumber}, ${w.wardName}. Please look into it. — Nagrik Setu`);

  return `<div style="font-family:system-ui,sans-serif;min-width:230px;max-width:260px;padding:4px 2px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
      <span style="font-size:13px;font-weight:700;color:#1B1108;">Ward ${w.wardNumber}</span>
      <span style="background:${gradeColor};color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;">Grade ${w.grade} · ${w.overallScore}</span>
    </div>
    <div style="font-size:11px;font-weight:600;color:#4C3E2B;margin-bottom:2px;">${w.wardName}</div>
    <div style="font-size:10px;color:#8C7A62;margin-bottom:8px;">${w.zone} · ${w.municipalBody}</div>
    <div style="border-top:1px solid #E3DDD0;padding-top:6px;font-size:10px;line-height:1.9;color:#4C3E2B;">
      <div><span style="color:#C2B49A;">Councillor:</span> <b>${w.councillorName}</b> <span style="color:#2563eb;font-size:9px;">(${w.councillorParty})</span></div>
      <div><span style="color:#C2B49A;">MLA:</span> ${w.mlaConstituency}</div>
      <div><span style="color:#C2B49A;">MP:</span> ${w.mpConstituency} · Lok Sabha</div>
    </div>
    <div style="border-top:1px solid #E3DDD0;padding-top:8px;margin-top:6px;">
      <div style="font-size:9px;color:#C2B49A;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;">Contact Councillor Direct</div>
      <div style="display:flex;gap:6px;">
        <a href="tel:+91${phone}" style="display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;color:#E0600A;text-decoration:none;background:#FEF3EB;padding:5px 9px;border-radius:7px;border:1px solid rgba(224,96,10,.3);">📞 Call</a>
        <a href="https://wa.me/91${phone}?text=${waMsg}" target="_blank" style="display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:600;color:#16a34a;text-decoration:none;background:#EAF5EF;padding:5px 9px;border-radius:7px;border:1px solid rgba(22,163,74,.3);">💬 WhatsApp</a>
      </div>
    </div>
  </div>`;
}

function buildComplaintPopup(c: Complaint): string {
  const isFake = c.status === 'FAKE_CLOSURE_DETECTED';
  return `<div style="font-family:system-ui,sans-serif;min-width:200px;padding:4px 2px;">
    <div style="font-size:11px;color:#8C7A62;margin-bottom:4px;">${STATUS_ICONS[c.status] || '📋'} ${c.status.replace(/_/g, ' ')}</div>
    <div style="font-size:13px;font-weight:700;color:#1B1108;margin-bottom:4px;">${c.issueType.replace(/_/g, ' ')}</div>
    <div style="font-size:11px;color:#4C3E2B;margin-bottom:6px;line-height:1.5;">${c.issueDescription.slice(0, 80)}…</div>
    <div style="font-size:10px;font-family:monospace;color:#2563eb;background:#eff6ff;padding:2px 7px;border-radius:5px;display:inline-block;">${c.id}</div>
    ${isFake ? `<div style="margin-top:6px;background:#fef2f2;border:1px solid #fca5a5;padding:5px 8px;border-radius:6px;font-size:10px;color:#991b1b;">⚠️ Fake closure detected — dispute active</div>` : ''}
  </div>`;
}

// ── Indian State data — cities + approximate boundary polygons ────────────────
const INDIA_STATES: {
  id: string; label: string; emoji: string;
  cities: string[];  // complaint city values
  center: { lat: number; lng: number; zoom: number };
  color: string;
  // simplified boundary polygon (lat/lng pairs, clockwise)
  boundary: [number, number][];
}[] = [
  {
    id: 'WB', label: 'West Bengal', emoji: '🐯', cities: ['KOLKATA'],
    center: { lat: 22.986, lng: 87.855, zoom: 7 }, color: '#175E35',
    boundary: [[27.10,88.88],[26.45,89.87],[25.57,89.83],[24.37,88.74],[22.89,88.29],[21.63,87.40],[21.50,86.95],[21.98,86.59],[22.52,86.75],[23.50,87.06],[24.40,87.50],[25.50,87.85],[26.60,88.13],[27.10,88.88]],
  },
  {
    id: 'MH', label: 'Maharashtra', emoji: '🦁', cities: ['MUMBAI','PUNE','NAGPUR'],
    center: { lat: 19.751, lng: 75.713, zoom: 7 }, color: '#E0600A',
    boundary: [[22.02,73.73],[21.99,75.00],[22.03,77.56],[21.27,79.63],[20.50,80.31],[19.53,80.56],[18.23,80.32],[17.49,80.19],[16.80,80.10],[16.45,79.32],[16.42,77.52],[16.50,76.45],[17.10,75.45],[17.68,73.95],[18.04,73.06],[18.55,72.96],[19.98,72.80],[21.24,72.78],[22.02,73.73]],
  },
  {
    id: 'KA', label: 'Karnataka', emoji: '🌿', cities: ['BENGALURU'],
    center: { lat: 15.317, lng: 75.714, zoom: 7 }, color: '#B87A0A',
    boundary: [[18.22,74.57],[18.04,75.82],[17.33,77.37],[16.49,77.52],[16.42,77.00],[16.80,76.45],[15.57,76.07],[14.62,75.28],[14.14,74.77],[12.97,74.89],[11.78,75.27],[11.50,76.48],[11.90,77.63],[12.26,78.20],[13.31,78.65],[14.58,78.86],[15.70,78.47],[17.02,77.83],[17.82,77.05],[18.22,74.57]],
  },
  {
    id: 'DL', label: 'Delhi', emoji: '🏛️', cities: ['DELHI'],
    center: { lat: 28.704, lng: 77.102, zoom: 10 }, color: '#2563eb',
    boundary: [[28.88,76.84],[28.88,77.35],[28.51,77.34],[28.40,76.84],[28.88,76.84]],
  },
  {
    id: 'TN', label: 'Tamil Nadu', emoji: '🏺', cities: ['CHENNAI','COIMBATORE'],
    center: { lat: 11.127, lng: 78.656, zoom: 7 }, color: '#BF1B0E',
    boundary: [[13.19,80.23],[12.65,79.80],[11.90,79.67],[11.28,79.84],[10.50,79.85],[8.90,78.41],[8.18,77.55],[8.21,76.86],[9.07,76.71],[9.55,76.95],[10.24,77.44],[11.49,76.48],[11.78,75.27],[12.90,75.90],[13.55,77.39],[14.61,78.87],[13.32,78.65],[12.26,78.22],[11.88,77.65],[13.19,80.23]],
  },
  {
    id: 'TS', label: 'Telangana', emoji: '🌾', cities: ['HYDERABAD','VISAKHAPATNAM'],
    center: { lat: 17.123, lng: 79.208, zoom: 7 }, color: '#7c3aed',
    boundary: [[19.90,78.10],[19.80,80.40],[19.06,80.56],[18.25,80.32],[17.49,80.20],[16.50,80.05],[16.43,79.33],[16.48,77.55],[17.07,77.84],[17.83,77.08],[18.22,74.57],[18.35,75.14],[19.91,77.05],[19.90,78.10]],
  },
  {
    id: 'GJ', label: 'Gujarat', emoji: '🦋', cities: ['AHMEDABAD','SURAT'],
    center: { lat: 22.309, lng: 72.136, zoom: 7 }, color: '#0891b2',
    boundary: [[24.69,68.17],[24.73,70.29],[23.80,70.91],[22.33,70.83],[21.64,69.67],[20.60,68.90],[20.10,68.05],[21.24,72.79],[22.04,73.74],[22.78,73.71],[23.54,72.56],[24.70,71.46],[24.69,68.17]],
  },
  {
    id: 'RJ', label: 'Rajasthan', emoji: '🏜️', cities: ['JAIPUR'],
    center: { lat: 27.024, lng: 74.217, zoom: 7 }, color: '#d97706',
    boundary: [[30.17,69.47],[30.22,72.96],[29.53,73.68],[27.91,73.78],[27.09,72.08],[25.73,71.02],[24.29,69.66],[24.69,68.17],[23.97,69.31],[24.68,71.44],[25.35,73.37],[26.14,74.34],[27.53,75.48],[28.11,77.04],[28.87,76.84],[28.88,75.75],[29.79,75.11],[30.17,69.47]],
  },
  {
    id: 'UP', label: 'Uttar Pradesh', emoji: '🕌', cities: ['LUCKNOW','VARANASI','AGRA'],
    center: { lat: 26.846, lng: 80.946, zoom: 7 }, color: '#16a34a',
    boundary: [[30.36,77.59],[30.36,80.22],[29.37,80.71],[28.07,81.00],[27.18,83.16],[27.10,84.28],[25.84,84.23],[25.15,83.54],[24.22,82.75],[23.26,81.87],[23.54,80.43],[24.69,80.00],[25.00,78.60],[26.12,77.48],[27.48,77.05],[28.40,76.83],[28.88,76.84],[29.79,75.11],[30.36,77.59]],
  },
  {
    id: 'BR', label: 'Bihar', emoji: '🌊', cities: ['PATNA'],
    center: { lat: 25.094, lng: 85.313, zoom: 7 }, color: '#b45309',
    boundary: [[27.10,84.29],[26.64,85.66],[26.67,87.17],[27.10,88.88],[26.60,88.13],[25.50,87.85],[24.40,87.50],[23.50,87.06],[23.13,86.10],[23.80,85.10],[24.05,83.83],[24.60,83.60],[25.14,83.54],[25.84,84.22],[27.10,84.29]],
  },
  {
    id: 'MP', label: 'Madhya Pradesh', emoji: '🐯', cities: ['BHOPAL','INDORE'],
    center: { lat: 22.973, lng: 78.656, zoom: 7 }, color: '#0f766e',
    boundary: [[26.88,74.03],[26.12,77.48],[25.00,78.60],[24.68,80.00],[23.53,80.43],[22.91,81.34],[22.18,81.72],[21.10,80.58],[20.77,79.29],[20.29,78.10],[19.90,77.06],[18.36,75.14],[18.22,74.57],[18.35,73.73],[18.89,73.79],[20.45,74.00],[21.69,73.84],[22.25,72.97],[23.59,72.56],[24.67,71.44],[25.73,71.02],[26.14,72.64],[26.88,74.03]],
  },
  {
    id: 'PB', label: 'Punjab', emoji: '🌾', cities: ['AMRITSAR','LUDHIANA','CHANDIGARH'],
    center: { lat: 31.147, lng: 75.342, zoom: 7 }, color: '#7c3aed',
    boundary: [[32.57,74.42],[32.53,75.36],[31.94,75.98],[31.40,76.83],[30.37,77.58],[29.79,75.11],[30.17,69.47],[30.77,72.36],[31.55,73.00],[32.21,73.77],[32.57,74.42]],
  },
  {
    id: 'OD', label: 'Odisha', emoji: '🏺', cities: ['BHUBANESWAR'],
    center: { lat: 20.940, lng: 84.803, zoom: 7 }, color: '#dc2626',
    boundary: [[22.52,86.75],[21.98,86.59],[21.50,86.95],[21.63,87.40],[20.51,87.11],[19.84,85.75],[18.70,84.65],[18.23,83.55],[18.05,82.58],[19.23,81.78],[20.10,80.57],[20.79,79.29],[21.10,80.58],[22.18,81.72],[22.91,81.34],[23.53,80.43],[23.13,86.10],[22.52,86.75]],
  },
  {
    id: 'KL', label: 'Kerala', emoji: '🌴', cities: ['KOCHI','THIRUVANANTHAPURAM'],
    center: { lat: 10.850, lng: 76.271, zoom: 7 }, color: '#065f46',
    boundary: [[12.88,74.89],[11.78,75.27],[10.24,77.44],[9.55,76.95],[9.07,76.71],[8.21,76.86],[8.18,77.55],[8.90,78.41],[10.50,79.85],[11.28,79.84],[11.90,79.67],[12.65,79.80],[12.90,75.90],[12.88,74.89]],
  },
  {
    id: 'JH', label: 'Jharkhand', emoji: '⛰️', cities: ['RANCHI'],
    center: { lat: 23.610, lng: 85.279, zoom: 7 }, color: '#7e22ce',
    boundary: [[25.14,83.54],[24.60,83.60],[24.05,83.83],[23.80,85.10],[23.13,86.10],[22.52,86.75],[22.18,81.72],[22.91,81.34],[23.53,80.43],[24.22,82.75],[25.14,83.54]],
  },
];

const STATE_CITY_MAP: Record<string, string> = {};
INDIA_STATES.forEach(s => s.cities.forEach(c => { STATE_CITY_MAP[c] = s.id; }));

// ── Main component ────────────────────────────────────────────────────────────
export default function CivicMap({ complaints, ward }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef  = useRef<google.maps.InfoWindow | null>(null);

  // Layer refs
  const zonePolygonsRef     = useRef<google.maps.Polygon[]>([]);
  const wardMarkersRef      = useRef<google.maps.Marker[]>([]);
  const wardBoundariesRef   = useRef<google.maps.Polygon[]>([]);
  const complaintMarkersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef        = useRef<MarkerClusterer | null>(null);

  const stateBoundaryRef = useRef<google.maps.Polygon[]>([]);

  const [mapReady, setMapReady]         = useState(false);
  const [zoomLevel, setZoomLevel]       = useState(12);
  const [layers, setLayers]             = useState<Record<LayerKey, boolean>>({ zones: true, wards: true, complaints: true });
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<Ward[]>([]);
  const [showSearch, setShowSearch]     = useState(false);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [selectedZone, setSelectedZone] = useState<{ name: string; code: string; wardCount: number; description: string } | null>(null);
  const [mapFilter, setMapFilter] = useState<string>('all');
  const [stateFilter, setStateFilter]   = useState<string>('all');
  const [legendOpen, setLegendOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) setLegendOpen(false);
      };
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);

  const cityKey    = ward.city.toUpperCase();
  const cityCenter = CITY_CENTERS[cityKey] || { lat: 20.5937, lng: 78.9629, zoom: 5 };

  // Filter complaints for marker rendering
  const filteredComplaints = useMemo(() => {
    let base = complaints;
    // state filter first
    if (stateFilter !== 'all') {
      const st = INDIA_STATES.find(s => s.id === stateFilter);
      if (st) base = base.filter(c => st.cities.includes(c.location.city));
    }
    if (mapFilter === 'all')    return base;
    if (mapFilter === 'urgent') return base.filter(c => ['CRITICAL', 'HIGH'].includes(c.severity));
    if (mapFilter === 'fake')   return base.filter(c => c.status === 'FAKE_CLOSURE_DETECTED');
    return base.filter(c => c.issueType === mapFilter);
  }, [complaints, mapFilter, stateFilter]);

  // Unique issue types present in complaints, top 4 for pills
  const issueTypePills = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach(c => { counts[c.issueType] = (counts[c.issueType] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([type]) => type);
  }, [complaints]);

  // ── Initialize map ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      if (!(window as any).google?.maps) return;

      const map = new google.maps.Map(mapRef.current, {
        center:              cityCenter,
        zoom:                cityCenter.zoom,
        mapTypeId:           'roadmap',
        zoomControl:         false,
        streetViewControl:   false,
        mapTypeControl:      false,
        fullscreenControl:   false,
        styles: [
          { featureType: 'poi',     elementType: 'labels',      stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        ],
      });

      mapInstanceRef.current = map;
      infoWindowRef.current  = new google.maps.InfoWindow({ maxWidth: 290 });

      // Track zoom for boundary visibility
      map.addListener('zoom_changed', () => {
        setZoomLevel(map.getZoom() ?? cityCenter.zoom);
      });

      setMapReady(true);
    };

    if ((window as any).google?.maps) {
      init();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google?.maps) { clearInterval(interval); init(); }
      }, 400);
      return () => clearInterval(interval);
    }
  }, []);

  // Listen to ward prop changes from parent (search, dashboard tab, etc.)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !ward) return;
    const resolved = ALL_WARDS.find(w => w.id === (ward as any).wardId || (w.wardNumber === ward.wardNumber && w.city.toUpperCase() === ward.city.toUpperCase()));
    if (resolved) {
      setSelectedWard(resolved);
      setSelectedZone(null);
      mapInstanceRef.current.panTo({ lat: resolved.lat, lng: resolved.lng });
      mapInstanceRef.current.setZoom(15);
      
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        infoWindowRef.current?.setContent(buildWardPopup(resolved));
        infoWindowRef.current?.open(mapInstanceRef.current!, { lat: resolved.lat, lng: resolved.lng } as any);
      } else {
        infoWindowRef.current?.close();
      }
    }
  }, [ward, mapReady]);

  // ── Re-center when city changes ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter(cityCenter);
    mapInstanceRef.current.setZoom(cityCenter.zoom);
    setZoomLevel(cityCenter.zoom);
  }, [cityKey, mapReady]);

  // ── State boundary overlay ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    stateBoundaryRef.current.forEach(p => p.setMap(null));
    stateBoundaryRef.current = [];
    if (stateFilter === 'all') return;

    const st = INDIA_STATES.find(s => s.id === stateFilter);
    if (!st) return;

    // Draw state boundary polygon
    const poly = new google.maps.Polygon({
      paths: st.boundary.map(([lat, lng]) => ({ lat, lng })),
      strokeColor: st.color,
      strokeOpacity: 0.85,
      strokeWeight: 2.5,
      fillColor: st.color,
      fillOpacity: 0.07,
      map: mapInstanceRef.current,
      zIndex: 1,
    });
    stateBoundaryRef.current = [poly];

    // Pan to state center
    mapInstanceRef.current.setCenter({ lat: st.center.lat, lng: st.center.lng });
    mapInstanceRef.current.setZoom(st.center.zoom);
  }, [stateFilter, mapReady]);

  // ── Zone polygon overlay ────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    zonePolygonsRef.current.forEach(p => p.setMap(null));
    zonePolygonsRef.current = [];
    if (!layers.zones) return;

    ZONE_POLYGONS.filter(z => z.city?.toUpperCase() === cityKey).forEach(zone => {
      if (!zone.path || zone.path.length < 3) return;

      const poly = new google.maps.Polygon({
        paths:         zone.path,
        map:           mapInstanceRef.current!,
        strokeColor:   zone.color || '#2563eb',
        strokeOpacity: 0.80,
        strokeWeight:  1.5,
        fillColor:     zone.color || '#2563eb',
        fillOpacity:   0.08,
        zIndex:        1,
      });

      poly.addListener('click', () => {
        setSelectedWard(null);
        setSelectedZone({ name: zone.zoneName, code: zone.zoneCode, wardCount: zone.wardCount, description: zone.description || '' });
        infoWindowRef.current?.close();
      });
      poly.addListener('mouseover', () => poly.setOptions({ fillOpacity: 0.20, strokeWeight: 2.5 }));
      poly.addListener('mouseout',  () => poly.setOptions({ fillOpacity: 0.08, strokeWeight: 1.5 }));

      zonePolygonsRef.current.push(poly);
    });
  }, [mapReady, layers.zones, cityKey]);

  // ── Ward markers + MarkerClusterer ──────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    // Clear previous clusterer and markers
    clustererRef.current?.clearMarkers();
    clustererRef.current?.setMap(null);
    clustererRef.current = null;
    wardMarkersRef.current.forEach(m => m.setMap(null));
    wardMarkersRef.current = [];

    if (!layers.wards) return;

    const cityWards = getWardsByCity(cityKey);
    const markers: google.maps.Marker[] = [];

    cityWards.forEach(w => {
      const color  = GRADE_COLORS[w.grade] || '#6b7280';
      const marker = new google.maps.Marker({
        position: { lat: w.lat, lng: w.lng },
        title:    `${w.wardName} — Grade ${w.grade}`,
        icon: {
          path:          google.maps.SymbolPath.CIRCLE,
          scale:         5,
          fillColor:     color,
          fillOpacity:   0.85,
          strokeColor:   '#ffffff',
          strokeWeight:  1.5,
        },
        zIndex: 2,
      });

      marker.addListener('click', () => {
        setSelectedZone(null);
        setSelectedWard(w);
        if (!isMobile) {
          infoWindowRef.current?.setContent(buildWardPopup(w));
          infoWindowRef.current?.open(mapInstanceRef.current!, marker);
        } else {
          infoWindowRef.current?.close();
        }
      });

      markers.push(marker);
    });

    wardMarkersRef.current = markers;

    // Cluster all markers; SuperCluster dissolves clusters at zoom >= 15
    clustererRef.current = new MarkerClusterer({
      map:       mapInstanceRef.current!,
      markers,
      algorithm: new SuperClusterAlgorithm({
        maxZoom: 14,   // individual markers appear at zoom >= 15
        radius:  60,   // cluster radius in pixels
      }),
      renderer: {
        // Custom cluster renderer using Dossier palette
        render: ({ count, position }) => {
          const size  = count > 50 ? 44 : count > 20 ? 38 : 32;
          const color = count > 50 ? '#E0600A' : count > 20 ? '#B87A0A' : '#175E35';
          return new google.maps.Marker({
            position,
            zIndex: 999,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
                  <circle cx="${size/2}" cy="${size/2}" r="${size/2-1}" fill="${color}" fill-opacity="0.85" stroke="#fff" stroke-width="2"/>
                  <text x="${size/2}" y="${size/2+4}" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="${count>99?11:13}" fill="#fff">${count}</text>
                </svg>`)}`,
              scaledSize: new google.maps.Size(size, size),
              anchor:     new google.maps.Point(size / 2, size / 2),
            },
          });
        },
      },
    });
  }, [mapReady, layers.wards, cityKey]);

  // ── Ward boundary polygons — show at zoom >= 14 ─────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    // Clear previous ward boundaries
    wardBoundariesRef.current.forEach(p => p.setMap(null));
    wardBoundariesRef.current = [];

    if (!layers.wards || zoomLevel < 14) return;

    const cityWards = getWardsByCity(cityKey);

    cityWards.forEach(w => {
      const color  = GRADE_COLORS[w.grade] || '#6b7280';
      const path   = genWardBoundary(w, cityWards);

      const poly = new google.maps.Polygon({
        paths:         path,
        map:           mapInstanceRef.current!,
        strokeColor:   color,
        strokeOpacity: 0.85,
        strokeWeight:  1.5,
        fillColor:     color,
        fillOpacity:   zoomLevel >= 16 ? 0.18 : 0.11,
        zIndex:        3,
      });

      poly.addListener('click', () => {
        setSelectedZone(null);
        setSelectedWard(w);
        if (!isMobile) {
          infoWindowRef.current?.setContent(buildWardPopup(w));
          infoWindowRef.current?.open(mapInstanceRef.current!, { lat: w.lat, lng: w.lng } as any);
        } else {
          infoWindowRef.current?.close();
        }
      });

      poly.addListener('mouseover', () => poly.setOptions({ fillOpacity: 0.28, strokeWeight: 2 }));
      poly.addListener('mouseout',  () => poly.setOptions({ fillOpacity: zoomLevel >= 16 ? 0.18 : 0.11, strokeWeight: 1.5 }));

      wardBoundariesRef.current.push(poly);
    });
  }, [mapReady, layers.wards, cityKey, zoomLevel]);

  // ── Complaint markers ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    complaintMarkersRef.current.forEach(m => m.setMap(null));
    complaintMarkersRef.current = [];
    if (!layers.complaints) return;

    filteredComplaints.forEach(complaint => {
      if (!complaint.location.lat || !complaint.location.lng) return;
      const isFake = complaint.status === 'FAKE_CLOSURE_DETECTED';
      const color  = SEVERITY_COLORS[complaint.severity];

      const marker = new google.maps.Marker({
        position:  { lat: complaint.location.lat, lng: complaint.location.lng },
        map:       mapInstanceRef.current!,
        title:     complaint.id,
        icon: {
          path:         google.maps.SymbolPath.CIRCLE,
          scale:        isFake ? 12 : complaint.severity === 'CRITICAL' ? 10 : 8,
          fillColor:    isFake ? '#ea4335' : color,
          fillOpacity:  0.9,
          strokeColor:  '#ffffff',
          strokeWeight: 2,
        },
        animation: isFake ? google.maps.Animation.BOUNCE : undefined,
        zIndex:    isFake ? 100 : complaint.severity === 'CRITICAL' ? 50 : 10,
      });

      marker.addListener('click', () => {
        setSelectedWard(null);
        setSelectedZone(null);
        infoWindowRef.current?.setContent(buildComplaintPopup(complaint));
        infoWindowRef.current?.open(mapInstanceRef.current!, marker);
      });

      complaintMarkersRef.current.push(marker);
    });

    if (complaintMarkersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredComplaints.forEach(c => { if (c.location.lat && c.location.lng) bounds.extend({ lat: c.location.lat, lng: c.location.lng }); });
      if (!bounds.isEmpty()) mapInstanceRef.current.fitBounds(bounds, 60);
    }
  }, [mapReady, layers.complaints, filteredComplaints]);

  // ── Search ────────────────────────────────────────────────────────────────────
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setSearchResults(q.length >= 2 ? searchWards(q) : []);
  }, []);

  const flyToWard = useCallback((w: Ward) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.panTo({ lat: w.lat, lng: w.lng });
    mapInstanceRef.current.setZoom(15);
    setSelectedWard(w);
    setSelectedZone(null);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    infoWindowRef.current?.close();
  }, []);

  const toggleLayer = (key: LayerKey) =>
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const criticalCount  = complaints.filter(c => c.severity === 'CRITICAL').length;
  const fakeCount      = complaints.filter(c => c.status === 'FAKE_CLOSURE_DETECTED').length;

  const ISSUE_ICONS: Record<string, string> = {
    GARBAGE: '🗑️', POTHOLE: '🕳️', STREET_LIGHT: '💡', WATER_SUPPLY: '💧',
    SEWAGE: '🚽', DRAINAGE: '🌊', ENCROACHMENT: '🚧', TREE_FALLEN: '🌳',
    FALLEN_WIRE: '⚡', STRAY_DOG: '🐕', BURNING_WASTE: '🔥', DEAD_ANIMAL: '🐾',
    NOISE_POLLUTION: '🔊', BROKEN_FOOTPATH: '🛤️', MANHOLE: '⚠️', OTHER: '📌',
  };
  const filterPills = [
    { id: 'all',    label: `All (${complaints.length})` },
    { id: 'urgent', label: `🚨 Urgent (${complaints.filter(c => ['CRITICAL','HIGH'].includes(c.severity)).length})` },
    { id: 'fake',   label: `🔴 Fake (${fakeCount})` },
    ...issueTypePills.map(t => ({ id: t, label: `${ISSUE_ICONS[t] || '📌'} ${t.replace(/_/g, ' ')}` })),
  ];
  const cityWardCount  = ALL_WARDS.filter(w => w.city === cityKey).length;

  const phone = selectedWard ? wardPhone(selectedWard.id) : '';
  const waMsg = selectedWard
    ? encodeURIComponent(`Namaste Councillor ${selectedWard.councillorName} ji, I want to report a civic issue in Ward ${selectedWard.wardNumber}, ${selectedWard.wardName}. Please look into it. — Nagrik Setu`)
    : '';

  return (
    <div className="relative h-full bg-gray-100 overflow-hidden">
      {/* Map canvas */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Zoom badge */}
      {mapReady && zoomLevel >= 14 && (
        <div
          className="absolute top-14 right-3 text-[9px] font-bold px-2 py-0.5 rounded"
          style={{ background: 'var(--ns-sf)', color: '#fff', fontFamily: "'Space Mono', monospace" }}
        >
          WARD BOUNDARIES ON
        </div>
      )}

      {/* No-maps fallback */}
      {!mapReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Civic Map — Loading…</h3>
            <p className="text-sm text-gray-500 mb-1">Initializing Google Maps + ward data</p>
          </div>
        </div>
      )}

      {/* Top-left: Stats card */}
      {mapReady && (
        <div className="absolute top-16 left-3 md:top-3 md:left-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-md px-3 py-2 max-w-[200px] z-10">
          <div
            className="text-xs font-semibold truncate mb-1"
            style={{ color: 'var(--ns-ink)', fontFamily: "'Figtree', sans-serif" }}
          >
            Ward {ward.wardNumber} — {ward.wardName}
          </div>
          <div className="flex gap-3 text-center">
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--ns-sf)' }}>{complaints.length}</div>
              <div className="text-[10px] text-gray-500">Reports</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-700">{cityWardCount}</div>
              <div className="text-[10px] text-gray-500">City wards</div>
            </div>
            {criticalCount > 0 && (
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--ns-re)' }}>{criticalCount}</div>
                <div className="text-[10px] text-gray-500">Critical</div>
              </div>
            )}
            {fakeCount > 0 && (
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--ns-re)' }}>{fakeCount}</div>
                <div className="text-[10px] text-gray-500">Fake</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* State boundary filter */}
      {mapReady && (
        <div data-demo="state-filter" className="absolute top-[132px] md:top-[88px] left-3 z-10 flex items-center gap-1.5">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm border appearance-none cursor-pointer"
            style={{
              fontFamily: "'Space Mono', monospace",
              background: stateFilter !== 'all' ? 'var(--ns-ink)' : 'rgba(255,255,255,.92)',
              color:      stateFilter !== 'all' ? '#F7F2E8'       : '#4C3E2B',
              border:     stateFilter !== 'all' ? '1px solid var(--ns-ink)' : '1px solid rgba(27,17,8,.12)',
              maxWidth: 140,
            }}
          >
            <option value="all">🗺️ All States</option>
            {INDIA_STATES.map(s => (
              <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
            ))}
          </select>
          {stateFilter !== 'all' && (
            <button
              onClick={() => setStateFilter('all')}
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(191,27,14,.12)', color: 'var(--ns-re)', border: '1px solid rgba(191,27,14,.25)' }}
            >✕</button>
          )}
        </div>
      )}

      {/* Filter pills — complaint type filter */}
      {mapReady && complaints.length > 0 && (
        <div
          data-demo="map-filter-pills"
          className="absolute top-[162px] md:top-[116px] left-3 right-16 md:right-[290px] z-10 flex flex-wrap gap-1"
        >
          {filterPills.map(pill => (
            <button
              key={pill.id}
              data-demo={`map-filter-${pill.id}`}
              onClick={() => setMapFilter(pill.id)}
              className="text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm transition-all whitespace-nowrap"
              style={{
                fontFamily: "'Space Mono', monospace",
                background: mapFilter === pill.id ? 'var(--ns-ink)' : 'rgba(255,255,255,.92)',
                color:      mapFilter === pill.id ? '#F7F2E8'       : '#4C3E2B',
                border:     mapFilter === pill.id ? '1px solid var(--ns-ink)' : '1px solid rgba(27,17,8,.12)',
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Search bar */}
      {mapReady && (
        <div className="absolute top-3 left-3 right-3 md:left-[216px] md:right-auto md:w-68 z-10">
          {showSearch ? (
            <div className="relative">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search ward, area, councillor…"
                className="w-full rounded-xl shadow-md px-4 py-2.5 pr-9 text-sm border border-gray-200 bg-white focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--ns-sf)' } as React.CSSProperties}
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-y-auto max-h-64 z-50">
                  {searchResults.map(w => (
                    <button key={w.id} onClick={() => flyToWard(w)}
                      className="w-full text-left px-3 py-2 hover:bg-orange-50 border-b border-gray-50 last:border-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">{w.wardName}</div>
                      <div className="text-[10px] text-gray-500">{w.zone} · {w.city} · Grade {w.grade}</div>
                      <div className="text-[10px]" style={{ color: 'var(--ns-sf)' }}>{w.councillorName} ({w.councillorParty})</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 bg-white/95 shadow-md rounded-xl px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors w-full">
              <Search size={14} />
              <span>Search any ward across India…</span>
            </button>
          )}
        </div>
      )}

      {/* Right controls: Zoom + Layers */}
      {mapReady && (
        <div className="absolute top-16 right-3 md:top-3 md:right-3 flex flex-col gap-2 z-10">
          <button onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current.getZoom() || 12) + 1)}
            className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors">
            <ZoomIn size={16} className="text-gray-700" />
          </button>
          <button onClick={() => mapInstanceRef.current?.setZoom((mapInstanceRef.current.getZoom() || 12) - 1)}
            className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors">
            <ZoomOut size={16} className="text-gray-700" />
          </button>
          <div className="bg-white rounded-xl shadow-md p-2 mt-1 space-y-1.5">
            <div className="text-[10px] font-semibold text-gray-400 px-1 tracking-wide">LAYERS</div>
            {([
              { key: 'zones',      label: 'Zones',   color: '#2563eb' },
              { key: 'wards',      label: 'Wards',   color: '#16a34a' },
              { key: 'complaints', label: 'Reports', color: '#ea4335' },
            ] as { key: LayerKey; label: string; color: string }[]).map(({ key, label, color }) => (
              <button key={key} onClick={() => toggleLayer(key)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-full text-xs transition-colors ${layers[key] ? 'bg-gray-100 text-gray-800' : 'text-gray-400'}`}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: layers[key] ? color : '#d1d5db' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom-left: Legend */}
      {mapReady && (
        <div className="absolute bottom-4 left-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-md z-10 transition-all">
          {legendOpen ? (
            <div className="px-3 py-2">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-1 mb-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Ward Grade</span>
                <button onClick={() => setLegendOpen(false)} className="text-[11px] text-gray-400 hover:text-gray-600 font-bold px-1">✕</button>
              </div>
              {Object.entries(GRADE_COLORS).map(([g, c]) => (
                <div key={g} className="flex items-center gap-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded" style={{ background: c }} />
                  <span className="text-[11px] text-gray-600">Grade {g}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                <div className="text-[10px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">Severity</div>
                {Object.entries(SEVERITY_COLORS).map(([s, c]) => (
                  <div key={s} className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                    <span className="text-[11px] text-gray-600">{s}</span>
                  </div>
                ))}
              </div>
              {zoomLevel < 14 && (
                <div
                  className="mt-2 pt-2 text-[9px] text-center italic"
                  style={{ borderTop: '1px solid #f3f4f6', color: 'var(--ns-ink-4)' }}
                >
                  Zoom in to see ward boundaries
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setLegendOpen(true)} className="flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 font-semibold text-xs gap-1.5">
              <Info size={14} className="text-gray-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Legend</span>
            </button>
          )}
        </div>
      )}

      {/* ── Selected Ward side panel ── */}
      {mapReady && selectedWard && (
        <div
          className="absolute bottom-4 left-3 right-3 md:left-auto md:right-3 md:w-68 rounded-xl shadow-xl overflow-hidden z-20"
          style={{ background: 'var(--ns-paper)', border: '1px solid var(--ns-bd)' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}
          >
            <div>
              <div
                className="text-xs font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ns-ink)' }}
              >
                Ward {selectedWard.wardNumber}
              </div>
              <div
                className="text-[10px]"
                style={{ color: 'var(--ns-ink-3)', fontFamily: "'Space Mono', monospace" }}
              >
                {selectedWard.municipalBody} · {selectedWard.city}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ background: GRADE_COLORS[selectedWard.grade], color: '#fff', fontFamily: "'Space Mono', monospace" }}
              >
                {selectedWard.grade} · {selectedWard.overallScore}
              </span>
              <button onClick={() => setSelectedWard(null)}>
                <X size={13} style={{ color: 'var(--ns-ink-4)' }} />
              </button>
            </div>
          </div>

          <div className="px-3 py-2.5 space-y-2.5">
            {/* Ward name + zone + complaint count */}
            <div>
              <div className="text-sm font-semibold leading-snug" style={{ color: 'var(--ns-ink)', fontFamily: "'Playfair Display', serif" }}>
                {selectedWard.wardName}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--ns-ink-3)' }}>
                {selectedWard.zone}
              </div>
              {(() => {
                const wc = complaints.filter(c => c.location.wardNumber === selectedWard.wardNumber).length;
                return wc > 0 ? (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'var(--ns-sfp)', color: 'var(--ns-sf)', fontFamily: "'Space Mono', monospace" }}>
                      {wc} active report{wc !== 1 ? 's' : ''} in Nagrik Setu
                    </span>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Representatives */}
            <div style={{ borderTop: '1px solid var(--ns-bd)', paddingTop: '8px' }}>
              <div
                className="text-[9.5px] font-bold tracking-wider mb-2"
                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
              >
                ELECTED REPRESENTATIVES
              </div>

              {/* Councillor */}
              <div className="flex items-start gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--ns-sf)' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px]" style={{ color: 'var(--ns-ink-4)' }}>Ward Councillor</div>
                  <div className="text-xs font-semibold truncate" style={{ color: 'var(--ns-ink)' }}>{selectedWard.councillorName}</div>
                  <div className="text-[10px]" style={{ color: '#2563eb' }}>{selectedWard.councillorParty}</div>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--ns-gr)' }} />
                <div>
                  <div className="text-[10px]" style={{ color: 'var(--ns-ink-4)' }}>MLA Constituency</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--ns-ink)' }}>{selectedWard.mlaConstituency}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#f97316' }} />
                <div>
                  <div className="text-[10px]" style={{ color: 'var(--ns-ink-4)' }}>MP · Lok Sabha</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--ns-ink)' }}>{selectedWard.mpConstituency}</div>
                </div>
              </div>
            </div>

            {/* Councillor Direct Contact — THE KEY FIX */}
            <div
              style={{ borderTop: '1px solid var(--ns-bd)', paddingTop: '8px' }}
            >
              <div
                className="text-[9.5px] font-bold tracking-wider mb-2"
                style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)' }}
              >
                CONTACT COUNCILLOR DIRECT
              </div>
              <div className="text-[10px] mb-2" style={{ color: 'var(--ns-ink-3)' }}>
                {formatPhone(phone)}
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:+91${phone}`}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-1 justify-center"
                  style={{
                    background: 'var(--ns-sfp)',
                    color:      'var(--ns-sf)',
                    border:     '1px solid rgba(224,96,10,.25)',
                    fontFamily: "'Figtree', sans-serif",
                  }}
                >
                  <Phone size={11} /> Call
                </a>
                <a
                  href={`https://wa.me/91${phone}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg flex-1 justify-center"
                  style={{
                    background: '#EAF5EF',
                    color:      '#16a34a',
                    border:     '1px solid rgba(22,163,74,.25)',
                    fontFamily: "'Figtree', sans-serif",
                  }}
                >
                  <MessageCircle size={11} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Selected Zone panel ── */}
      {mapReady && selectedZone && !selectedWard && (
        <div
          className="absolute bottom-4 left-3 right-3 md:left-auto md:right-3 md:w-60 rounded-xl shadow-xl overflow-hidden z-20"
          style={{ background: 'var(--ns-paper)', border: '1px solid var(--ns-bd)' }}
        >
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ background: 'var(--ns-paper-2)', borderBottom: '1px solid var(--ns-bd)' }}
          >
            <div
              className="text-xs font-bold truncate"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ns-ink)' }}
            >
              {selectedZone.name}
            </div>
            <button onClick={() => setSelectedZone(null)}>
              <X size={13} style={{ color: 'var(--ns-ink-4)' }} />
            </button>
          </div>
          <div className="px-3 py-2.5 text-xs space-y-1.5">
            <div style={{ fontFamily: "'Space Mono', monospace", color: 'var(--ns-ink-4)', fontSize: 10 }}>{selectedZone.code}</div>
            {selectedZone.description && (
              <div className="leading-snug" style={{ color: 'var(--ns-ink-2)' }}>{selectedZone.description}</div>
            )}
            <div className="flex items-center gap-1.5 pt-1">
              <Layers size={12} style={{ color: 'var(--ns-sf)' }} />
              <span className="font-semibold" style={{ color: 'var(--ns-ink)' }}>{selectedZone.wardCount} wards</span>
              <span style={{ color: 'var(--ns-ink-4)' }}>in this zone</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
