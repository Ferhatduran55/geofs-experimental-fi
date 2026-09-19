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
  lengthFeet?: number;
  widthFeet?: number;
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
  if (ap.lengthFeet) {
    subDetail = subDetail ? `${subDetail} • Rwy: ${ap.lengthFeet.toLocaleString()} ft` : `Rwy: ${ap.lengthFeet.toLocaleString()} ft`;
  }

  return { mainTitle, subDetail: subDetail || "Runway Airfield" };
}

/**
 * Fetch all available runways directly and comprehensively from GeoFS engine
 */
export function getGeoFSRunways(): AirportInfo[] {
  const geofs = (typeof unsafeWindow !== "undefined" ? (unsafeWindow as any) : (globalThis as any))?.geofs;
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
    const lengthFeet = rw.lengthFeet !== undefined ? Math.round(Number(rw.lengthFeet)) : (rw.length ? Math.round(Number(rw.length) * 3.28084) : undefined);
    const widthFeet = rw.widthFeet !== undefined ? Math.round(Number(rw.widthFeet)) : (rw.width ? Math.round(Number(rw.width) * 3.28084) : undefined);

    results.push({
      icao: icao || "RWY",
      name,
      lat,
      lon,
      elevationFt: Math.round(elevationFt),
      heading,
      runwayHeading,
      lengthFeet,
      widthFeet,
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

  // 5. Check geofs.majorRunwayGrid (GeoFS global major runway database)
  if (geofs.majorRunwayGrid && typeof geofs.majorRunwayGrid === "object") {
    try {
      const grid = geofs.majorRunwayGrid;
      for (const lonKey of Object.keys(grid)) {
        const latCol = grid[lonKey];
        if (latCol && typeof latCol === "object") {
          for (const latKey of Object.keys(latCol)) {
            const arr = latCol[latKey];
            if (Array.isArray(arr)) {
              for (let i = 0; i < arr.length; i++) {
                const r = arr[i];
                if (Array.isArray(r) && r.length >= 6) {
                  // r[0]: icao, r[1]: lengthFeet, r[2]: widthFeet, r[3]: heading, r[4]: lat, r[5]: lon
                  processRunwayObj({
                    icao: r[0],
                    location: [r[4], r[5], 0],
                    heading: r[3],
                    lengthFeet: r[1],
                    widthFeet: r[2],
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      log.debug("Failed reading majorRunwayGrid:", e);
    }
  }

  return results;
}

/**
 * Fast spatial search for GeoFS runways around a specific coordinate.
 * Instead of traversing the entire planet, this queries only the 3-9 grid cells
 * in geofs.majorRunwayGrid[lonIndex][latIndex] within radiusNm, plus geofs.runways.nearRunways.
 */
export function getNearGeoFSRunways(centerLat: number, centerLon: number, radiusNm: number): AirportInfo[] {
  const geofs = (typeof unsafeWindow !== "undefined" ? (unsafeWindow as any) : (globalThis as any))?.geofs;
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
    const lengthFeet = rw.lengthFeet !== undefined ? Math.round(Number(rw.lengthFeet)) : (rw.length ? Math.round(Number(rw.length) * 3.28084) : undefined);
    const widthFeet = rw.widthFeet !== undefined ? Math.round(Number(rw.widthFeet)) : (rw.width ? Math.round(Number(rw.width) * 3.28084) : undefined);

    results.push({
      icao: icao || "RWY",
      name,
      lat,
      lon,
      elevationFt: Math.round(elevationFt),
      heading,
      runwayHeading,
      lengthFeet,
      widthFeet,
      country,
      city,
    });
  };

  // 1. Check nearRunways (already local to player)
  if (geofs.runways?.nearRunways) {
    const nr = geofs.runways.nearRunways;
    if (typeof nr === "object") {
      for (const k of Object.keys(nr)) processRunwayObj(nr[k]);
    }
  }

  // 2. Fast spatial 1x1 degree grid lookup around center coordinates
  // 1 degree latitude is ~60 NM.
  if (geofs.majorRunwayGrid && typeof geofs.majorRunwayGrid === "object") {
    const grid = geofs.majorRunwayGrid;
    const degRadius = Math.ceil(radiusNm / 60) + 1;
    const latInt = Math.floor(centerLat);
    const lonInt = Math.floor(centerLon);

    for (let dLon = -degRadius; dLon <= degRadius; dLon++) {
      const lonKey = lonInt + dLon;
      const latCol = grid[lonKey];
      if (!latCol || typeof latCol !== "object") continue;

      for (let dLat = -degRadius; dLat <= degRadius; dLat++) {
        const latKey = latInt + dLat;
        const cellRunways = latCol[latKey];
        if (!Array.isArray(cellRunways)) continue;

        for (let i = 0; i < cellRunways.length; i++) {
          const r = cellRunways[i];
          if (Array.isArray(r) && r.length >= 6) {
            processRunwayObj({
              icao: r[0],
              location: [r[4], r[5], 0],
              heading: r[3],
              lengthFeet: r[1],
              widthFeet: r[2],
            });
          }
        }
      }
    }
  }

  return results;
}

/**
 * Helper to validate genuine ICAO code (e.g. LTFM, KJFK, not '35L', '05', 'RWY')
 */
export function isValidIcaoCode(code?: string): boolean {
  if (!code) return false;
  const clean = String(code).trim().toUpperCase();
  if (clean.length < 3 || clean.length > 5) return false;
  if (/^\d{1,2}[LRC]?$/.test(clean)) return false;
  if (clean.startsWith("RWY") || clean.startsWith("RUNWAY")) return false;
  if (!/[A-Z]/.test(clean)) return false;
  return true;
}

/**
 * Find the nearest airport/runway using GeoFS's native engine
 */
export function findNearestAirport(lat: number, lon: number): AirportInfo {
  const geofs = (typeof unsafeWindow !== "undefined" ? (unsafeWindow as any) : (globalThis as any))?.geofs;

  // 1. Try native geofs.runways.getNearestRunway
  if (typeof geofs?.runways?.getNearestRunway === "function") {
    try {
      const nativeRw = geofs.runways.getNearestRunway([lat, lon, 0]);
      if (nativeRw) {
        const loc = nativeRw.threshold || nativeRw.location || nativeRw.lla || [lat, lon, 0];
        let icao = [nativeRw.icao, nativeRw.airport, nativeRw.airportIcao, nativeRw.id, nativeRw.name]
          .map((c) => (c ? String(c).trim().toUpperCase() : ""))
          .find((c) => isValidIcaoCode(c));

        const heading = typeof nativeRw.heading === "number" ? Math.round(nativeRw.heading) : undefined;
        const runwayHeading = heading !== undefined ? `RWY ${heading.toString().padStart(3, "0")}°` : (nativeRw.name || undefined);

        // If nativeRw didn't give a valid ICAO code, search allRunways within 5 NM for true airport ICAO
        if (!icao) {
          const allRunways = getGeoFSRunways();
          let bestDist = Infinity;
          let bestIcao = "";
          for (const rw of allRunways) {
            if (isValidIcaoCode(rw.icao)) {
              const d = calculateDistanceNm(loc[0], loc[1], rw.lat, rw.lon);
              if (d < bestDist && d <= 5.0) {
                bestDist = d;
                bestIcao = rw.icao;
              }
            }
          }
          icao = bestIcao || "ORIG";
        }

        return {
          icao: icao || "ORIG",
          name: nativeRw.name && nativeRw.name !== icao ? nativeRw.name : undefined,
          lat: loc[0],
          lon: loc[1],
          elevationFt: Math.round((nativeRw.elevation || loc[2] || 0) * 3.28084),
          heading,
          runwayHeading,
          lengthFeet: nativeRw.lengthFeet !== undefined ? Math.round(Number(nativeRw.lengthFeet)) : (nativeRw.length ? Math.round(Number(nativeRw.length) * 3.28084) : undefined),
          widthFeet: nativeRw.widthFeet !== undefined ? Math.round(Number(nativeRw.widthFeet)) : (nativeRw.width ? Math.round(Number(nativeRw.width) * 3.28084) : undefined),
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
