#!/usr/bin/env node
/**
 * GeoFS Version Fetcher
 * Fetches the current GeoFS simulation version from geo-fs.com
 * 
 * Usage:
 *   node scripts/fetch-geofs-version.js
 *   node scripts/fetch-geofs-version.js --output geofs-latest.js
 *   node scripts/fetch-geofs-version.js --check-only
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL without version parameter - we want to discover the current version
const GEOFS_BASE_URL = 'https://www.geo-fs.com/geofs.php';
const GEOFS_HOME_URL = 'https://www.geo-fs.com/';

// Patterns to find version information
const VERSION_PATTERNS = {
  urlParam: /geofs\.php\?v=([\d.]+)/i,
  scriptVersion: /geofs\.js\?(?:kc|v)=(\d+)/i,
  appVersion: /version\s*[=:]\s*["']?([\d.]+)["']?/i,
  metaVersion: /<meta[^>]+version[^>]+content=["']?([\d.]+)["']?/i,
};

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log();
  log(`━━━ ${title} ━━━`, 'cyan');
}

/**
 * Fetch content from URL
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ data, statusCode: res.statusCode }));
    }).on('error', reject);
  });
}

/**
 * Extract script URLs from HTML
 */
function extractScriptUrls(html) {
  const scriptPattern = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const scripts = [];
  let match;
  
  while ((match = scriptPattern.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  
  return scripts;
}

/**
 * Get GeoFS version from main page
 */
async function getGeoFSVersion() {
  logSection('Fetching GeoFS Home Page');
  log(`URL: ${GEOFS_HOME_URL}`, 'blue');
  
  // First, fetch the home page to find the current version redirect
  const { data: homeHtml, statusCode: homeStatus } = await fetchUrl(GEOFS_HOME_URL);
  
  if (homeStatus !== 200) {
    throw new Error(`Failed to fetch GeoFS home page: HTTP ${homeStatus}`);
  }
  
  log(`✓ Home page fetched (${homeHtml.length} bytes)`, 'green');
  
  // Try to find version from home page links
  let geofsVersion = null;
  const versionFromUrl = homeHtml.match(VERSION_PATTERNS.urlParam);
  if (versionFromUrl) {
    geofsVersion = versionFromUrl[1];
    log(`✓ Found version from URL: ${geofsVersion}`, 'green');
  }
  
  // Now fetch the actual geofs page (with or without version)
  const geofsUrl = geofsVersion 
    ? `${GEOFS_BASE_URL}?v=${geofsVersion}` 
    : GEOFS_BASE_URL;
  
  logSection('Fetching GeoFS Simulator Page');
  log(`URL: ${geofsUrl}`, 'blue');
  
  const { data: html, statusCode } = await fetchUrl(geofsUrl);
  
  if (statusCode !== 200) {
    throw new Error(`Failed to fetch GeoFS page: HTTP ${statusCode}`);
  }
  
  log(`✓ Page fetched successfully (${html.length} bytes)`, 'green');
  
  // Extract versions from various sources
  const versions = {
    urlVersion: geofsVersion,
    scriptVersion: null,
    buildVersion: null
  };
  
  // Try to find script version (kc parameter)
  const scriptVersionMatch = html.match(VERSION_PATTERNS.scriptVersion);
  if (scriptVersionMatch) {
    versions.scriptVersion = scriptVersionMatch[1];
    log(`✓ Found script version (build): ${versions.scriptVersion}`, 'green');
  }
  
  // Try to find app version in script content
  const appVersionMatch = html.match(VERSION_PATTERNS.appVersion);
  if (appVersionMatch) {
    versions.buildVersion = appVersionMatch[1];
  }
  
  // Extract all script URLs
  const scripts = extractScriptUrls(html);
  
  // Find main geofs script
  const geofsScript = scripts.find(s => s.includes('geofs.js'));
  
  return {
    version: geofsVersion || 'unknown',
    scriptBuild: versions.scriptVersion || 'unknown',
    scripts,
    geofsScript,
    html,
    geofsUrl
  };
}

/**
 * Fetch GeoFS main script
 */
async function fetchGeoFSScript(scriptPath) {
  const scriptUrl = scriptPath.startsWith('http') 
    ? scriptPath 
    : new URL(scriptPath, GEOFS_HOME_URL).href;
  
  logSection('Fetching GeoFS Script');
  log(`URL: ${scriptUrl}`, 'blue');
  
  const { data, statusCode } = await fetchUrl(scriptUrl);
  
  if (statusCode !== 200) {
    throw new Error(`Failed to fetch script: HTTP ${statusCode}`);
  }
  
  log(`✓ Script fetched successfully (${data.length} bytes)`, 'green');
  
  return data;
}

/**
 * Extract useful information from GeoFS script
 */
function analyzeGeoFSScript(script) {
  const info = {
    aircraftIds: [],
    apiEndpoints: [],
    mapProviders: [],
    features: []
  };
  
  // Extract aircraft list references
  const aircraftPattern = /aircraftList\s*[=:]\s*\[([^\]]+)\]/g;
  let match;
  while ((match = aircraftPattern.exec(script)) !== null) {
    const ids = match[1].match(/["'](\d+)["']/g);
    if (ids) {
      info.aircraftIds.push(...ids.map(id => id.replace(/["']/g, '')));
    }
  }
  
  // Extract API endpoints
  const apiPattern = /["']((?:https?:)?\/\/[^"']+(?:api|geofs|geo-fs)[^"']*)["']/gi;
  while ((match = apiPattern.exec(script)) !== null) {
    if (!info.apiEndpoints.includes(match[1])) {
      info.apiEndpoints.push(match[1]);
    }
  }
  
  // Check for features
  const features = [
    { name: 'multiplayer', pattern: /multiplayer/i },
    { name: 'weather', pattern: /weather|metar/i },
    { name: 'autopilot', pattern: /autopilot/i },
    { name: 'instruments', pattern: /instruments/i },
    { name: 'terrain', pattern: /terrain|elevation/i },
  ];
  
  features.forEach(f => {
    if (f.pattern.test(script)) {
      info.features.push(f.name);
    }
  });
  
  return info;
}

/**
 * Save script to file
 */
function saveScript(script, outputPath, version) {
  const header = `/**
 * GeoFS Script - Version ${version}
 * Fetched: ${new Date().toISOString()}
 * Source: ${GEOFS_URL}
 * 
 * WARNING: This file is for analysis purposes only.
 * Do not distribute or use for commercial purposes.
 */

`;
  
  fs.writeFileSync(outputPath, header + script);
  log(`✓ Script saved to: ${outputPath}`, 'green');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check-only');
  const outputIndex = args.indexOf('--output');
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;
  
  console.log();
  log('╔════════════════════════════════════════╗', 'cyan');
  log('║     GeoFS Version Fetcher v1.1.0       ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  
  try {
    // Get version info
    const { version, scriptBuild, scripts, geofsScript, geofsUrl } = await getGeoFSVersion();
    
    logSection('Version Information');
    log(`GeoFS App Version: ${version}`, 'bright');
    log(`Script Build: ${scriptBuild}`, 'bright');
    log(`Simulator URL: ${geofsUrl}`, 'yellow');
    log(`Scripts found: ${scripts.length}`, 'yellow');
    
    if (geofsScript) {
      log(`Main script: ${geofsScript}`, 'yellow');
    }
    
    // List all scripts
    logSection('Script Files');
    scripts.forEach((script, i) => {
      const isMain = script.includes('geofs.js');
      log(`  ${i + 1}. ${script}${isMain ? ' ← Main' : ''}`, isMain ? 'green' : 'reset');
    });
    
    if (checkOnly) {
      logSection('Check Complete');
      log('Use without --check-only to download the script', 'yellow');
      return;
    }
    
    // Fetch main script
    if (geofsScript) {
      const script = await fetchGeoFSScript(geofsScript);
      
      // Analyze script
      logSection('Script Analysis');
      const analysis = analyzeGeoFSScript(script);
      log(`API Endpoints: ${analysis.apiEndpoints.length}`, 'yellow');
      log(`Features detected: ${analysis.features.join(', ')}`, 'yellow');
      
      // Create version string for filename
      const versionStr = version !== 'unknown' ? version : scriptBuild;
      
      // Save if output specified
      if (outputFile) {
        const outputPath = path.resolve(process.cwd(), outputFile);
        saveScript(script, outputPath, versionStr);
      } else {
        // Default output
        const defaultOutput = path.join(__dirname, '..', `geofs-v${versionStr}.js`);
        saveScript(script, defaultOutput, versionStr);
      }
      
      // Save analysis
      const analysisPath = path.join(__dirname, '..', `geofs-v${versionStr}-analysis.json`);
      fs.writeFileSync(analysisPath, JSON.stringify({
        appVersion: version,
        scriptBuild: scriptBuild,
        simulatorUrl: geofsUrl,
        fetchedAt: new Date().toISOString(),
        scripts,
        analysis
      }, null, 2));
      log(`✓ Analysis saved to: ${analysisPath}`, 'green');
    }
    
    logSection('Complete');
    log('GeoFS version fetch completed successfully!', 'green');
    
  } catch (error) {
    logSection('Error');
    log(`✗ ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
