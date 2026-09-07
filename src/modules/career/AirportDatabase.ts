import Logger from "../../shared/Logger";

const log = Logger.create("AirportDatabase");

export interface AirportInfo {
  icao: string;
  name?: string;
  lat: number;
  lon: number;
  elevationFt: number;
  heading?: number;
  runwayHeading?: string;
  country?: string;
  city?: string;
}

/**
 * Calculate Great-Circle Haversine distance in Nautical Miles
 */
export function calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Earth radius in NM
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export const calculateGreatCircleNm = calculateDistanceNm;

/**
 * Calculate Initial Bearing / Heading (0 - 360°)
 */
export function calculateBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
}

export function formatBearingWithCompass(bearing: number): string {
  const cardinals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
  const compassIndex = Math.round(bearing / 45) % 8;
  return `${bearing.toString().padStart(3, "0")}° (${cardinals[compassIndex]})`;
}

/**
 * Cleanly format display label for an airport using ONLY what exists in GeoFS
 */
export function formatAirportDisplay(ap: AirportInfo): { mainTitle: string; subDetail: string } {
  const icao = ap.icao || "AIRPORT";
  const name = ap.name && ap.name !== icao ? ap.name : "";
  const locationParts = [ap.city, ap.country].filter(Boolean);
  const locationStr = locationParts.join(", ");

  const mainTitle = name ? `${icao} - ${name}` : icao;
  let subDetail = locationStr;
  if (ap.elevationFt !== undefined && ap.elevationFt !== 0) {
    subDetail = subDetail ? `${subDetail} • Elev: ${Math.round(ap.elevationFt)} ft` : `Elev: ${Math.round(ap.elevationFt)} ft`;
  }
  if (ap.runwayHeading) {
    subDetail = subDetail ? `${subDetail} • ${ap.runwayHeading}` : ap.runwayHeading;
  }

  return { mainTitle, subDetail: subDetail || "Runway Airfield" };
}

/**
 * Fetch all available runways directly and comprehensively from GeoFS engine
 */
export function getGeoFSRunways(): AirportInfo[] {
  const geofs = (unsafeWindow as any).geofs;
  if (!geofs) return [];

  const results: AirportInfo[] = [];
  const seenIcaos = new Set<string>();

  const processRunwayObj = (rw: any) => {
    if (!rw) return;
    const loc = rw.threshold || rw.location || rw.lla || (Array.isArray(rw) ? rw : null);
    if (!loc || !Array.isArray(loc) || loc.length < 2) return;

    const lat = Number(loc[0]);
    const lon = Number(loc[1]);
    if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) return;

    const icao = String(rw.icao || rw.id || rw.name || "").toUpperCase().trim();
    const key = icao || `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (seenIcaos.has(key)) return;
    seenIcaos.add(key);

    const elevationFt = Number(rw.elevation || (loc.length > 2 ? loc[2] : 0) || 0) * 3.28084;
    const name = rw.name && rw.name !== icao ? String(rw.name).trim() : rw.title;
    const city = rw.city || rw.locality || undefined;
    const country = rw.country || rw.c || undefined;
    const heading = typeof rw.heading === "number" ? Math.round(rw.heading) : undefined;
    const runwayHeading = heading !== undefined ? `RWY ${heading.toString().padStart(3, "0")}°` : undefined;

    results.push({
      icao: icao || "RWY",
      name,
      lat,
      lon,
      elevationFt: Math.round(elevationFt),
      heading,
      runwayHeading,
      country,
      city,
    });
  };

  // 1. Check geofs.runways.nearRunways
  if (geofs.runways?.nearRunways) {
    const nr = geofs.runways.nearRunways;
    if (typeof nr === "object") {
      for (const k of Object.keys(nr)) processRunwayObj(nr[k]);
    }
  }

  // 2. Check geofs.runways.tempRunways
  if (geofs.runways?.tempRunways) {
    const tr = geofs.runways.tempRunways;
    if (typeof tr === "object") {
      for (const k of Object.keys(tr)) processRunwayObj(tr[k]);
    }
  }

  // 3. Check geofs.runways.runways
  if (geofs.runways?.runways) {
    const rw = geofs.runways.runways;
    if (Array.isArray(rw)) {
      for (const r of rw) processRunwayObj(r);
    } else if (typeof rw === "object") {
      for (const k of Object.keys(rw)) processRunwayObj(rw[k]);
    }
  }

  // 4. Check geofs.initialRunways
  if (Array.isArray(geofs.initialRunways)) {
    for (const r of geofs.initialRunways) {
      if (Array.isArray(r) && r.length >= 2) {
        processRunwayObj({
          icao: `RWY-${Math.abs(Math.round(r[0] * 10)) % 1000}`,
          location: r,
          heading: r.length > 3 ? r[3] : undefined,
          elevation: r.length > 2 ? r[2] : 0,
        });
      }
    }
  }

  return results;
}

/**
 * Find the nearest airport/runway using GeoFS's native engine
 */
export function findNearestAirport(lat: number, lon: number): AirportInfo {
  const geofs = (unsafeWindow as any).geofs;

  // 1. Try native geofs.runways.getNearestRunway
  if (typeof geofs?.runways?.getNearestRunway === "function") {
    try {
      const nativeRw = geofs.runways.getNearestRunway([lat, lon, 0]);
      if (nativeRw) {
        const loc = nativeRw.threshold || nativeRw.location || nativeRw.lla || [lat, lon, 0];
        const icao = String(nativeRw.icao || nativeRw.id || nativeRw.name || "ORIG").toUpperCase().trim();
        const heading = typeof nativeRw.heading === "number" ? Math.round(nativeRw.heading) : undefined;

        return {
          icao: icao || "ORIG",
          name: nativeRw.name && nativeRw.name !== icao ? nativeRw.name : undefined,
          lat: loc[0],
          lon: loc[1],
          elevationFt: Math.round((nativeRw.elevation || loc[2] || 0) * 3.28084),
          heading,
          runwayHeading: heading !== undefined ? `RWY ${heading.toString().padStart(3, "0")}°` : undefined,
          city: nativeRw.city || nativeRw.locality || undefined,
          country: nativeRw.country || nativeRw.c || undefined,
        };
      }
    } catch (e) {
      log.debug("Native getNearestRunway lookup failed:", e);
    }
  }

  // 2. Search runways from GeoFS
  const allRunways = getGeoFSRunways();
  if (allRunways.length > 0) {
    let nearest = allRunways[0];
    let minDist = calculateDistanceNm(lat, lon, nearest.lat, nearest.lon);

    for (let i = 1; i < allRunways.length; i++) {
      const dist = calculateDistanceNm(lat, lon, allRunways[i].lat, allRunways[i].lon);
      if (dist < minDist) {
        minDist = dist;
        nearest = allRunways[i];
      }
    }
    return nearest;
  }

  return {
    icao: "ORIG",
    lat,
    lon,
    elevationFt: 0,
    heading: 270,
  };
}
