// app/api/nominatim/route.ts — OpenStreetMap Nominatim reverse geocoding proxy
// Free, no API key needed. Rate limit: 1 req/sec per policy.
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const q   = searchParams.get('q');   // forward geocoding

  if (!lat && !lng && !q) {
    return NextResponse.json({ error: 'Provide lat+lng or q' }, { status: 400 });
  }

  let url: string;
  if (q) {
    // Forward geocoding: address → coordinates
    url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5&countrycodes=in`;
  } else {
    // Reverse geocoding: coordinates → address
    url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=16`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'NagrikSetu/1.0 (civic complaint platform India; prasunnandi118@gmail.com)',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 }, // cache 1 hour — same coords, same result
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Nominatim error' }, { status: res.status });
    }

    const data = await res.json();

    // Parse reverse geocoding into Nagrik Setu-friendly format
    if (!q && data.address) {
      const a = data.address;
      return NextResponse.json({
        raw: data,
        parsed: {
          area:        a.suburb || a.neighbourhood || a.quarter || a.village || a.town || '',
          city:        a.city || a.district || a.state_district || '',
          state:       a.state || '',
          pinCode:     a.postcode || '',
          displayName: data.display_name || '',
          lat:         parseFloat(data.lat),
          lng:         parseFloat(data.lon),
        },
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[Nominatim]', err);
    return NextResponse.json({ error: 'Failed to fetch location data' }, { status: 500 });
  }
}
