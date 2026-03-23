const fs = require('fs');
const path = require('path');

// Read the GeoJSON file
const geojsonPath = path.join(__dirname, 'src/constants/india_state.geojson');
const geojsonContent = fs.readFileSync(geojsonPath, 'utf-8');
const geojson = JSON.parse(geojsonContent);

console.log('Features count:', geojson.features?.length);
if (geojson.features && geojson.features.length > 0) {
  console.log('First feature properties:', Object.keys(geojson.features[0].properties || {}));
  console.log('First feature sample:', geojson.features[0].properties);
}

// Function to convert coordinates to SVG path
function coordinatesToSvgPath(geometry) {
  if (!geometry || !geometry.coordinates) return '';

  const coords = geometry.coordinates;
  let pathData = '';

  // Handle different geometry types
  if (geometry.type === 'Polygon') {
    return polygonToPath(coords[0]); // Use outer ring
  } else if (geometry.type === 'MultiPolygon') {
    // For MultiPolygon, use the largest polygon (usually the main territory)
    let largestPoly = coords[0];
    let largestArea = calculateArea(coords[0]);

    for (let i = 1; i < coords.length; i++) {
      const area = calculateArea(coords[i]);
      if (area > largestArea) {
        largestPoly = coords[i];
        largestArea = area;
      }
    }
    return polygonToPath(largestPoly[0]);
  }

  return '';
}

function polygonToPath(ring) {
  if (!ring || ring.length === 0) return '';

  // Normalize coordinates to a reasonable scale (longitude: 68-97, latitude: 8-35)
  const minLon = 68;
  const maxLon = 97;
  const minLat = 8;
  const maxLat = 35;

  const width = 350;
  const height = 500;

  let pathData = '';

  ring.forEach((coord, index) => {
    const lon = coord[0];
    const lat = coord[1];

    // Scale coordinates to SVG viewBox
    const x = ((lon - minLon) / (maxLon - minLon)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height;

    if (index === 0) {
      pathData += `M ${x.toFixed(2)},${y.toFixed(2)}`;
    } else {
      pathData += ` L ${x.toFixed(2)},${y.toFixed(2)}`;
    }
  });

  pathData += ' Z'; // Close path
  return pathData;
}

function calculateArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    area += (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
  }
  return Math.abs(area);
}

// State ID mappings
const stateIds = {
  'Andaman and Nicobar': 'AN',
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  'Assam': 'AS',
  'Bihar': 'BR',
  'Chhattisgarh': 'CT',
  'Chandigarh': 'CH',
  'Dadra and Nagar Haveli and Daman and Diu': 'DD',
  'Delhi': 'DL',
  'Goa': 'GA',
  'Gujarat': 'GJ',
  'Haryana': 'HR',
  'Himachal Pradesh': 'HP',
  'Jharkhand': 'JH',
  'Jammu and Kashmir': 'JK',
  'Karnataka': 'KA',
  'Kerala': 'KL',
  'Ladakh': 'LD',
  'Lakshadweep': 'LS',
  'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH',
  'Manipur': 'MN',
  'Meghalaya': 'ML',
  'Mizoram': 'MZ',
  'Nagaland': 'NL',
  'Odisha': 'OR',
  'Puducherry': 'PY',
  'Punjab': 'PB',
  'Rajasthan': 'RJ',
  'Sikkim': 'SK',
  'Tamil Nadu': 'TN',
  'Telangana': 'TG',
  'Tripura': 'TR',
  'Uttar Pradesh': 'UP',
  'Uttarakhand': 'UT',
  'West Bengal': 'WB'
};

const paths = geojson.features
  .filter(feature => feature.properties && (feature.properties.NAME_1 || feature.properties.name || feature.properties.st_nm || feature.properties.NAME))
  .map((feature, index) => {
    const props = feature.properties;
    const name = props.NAME_1 || props.name || props.st_nm || props.NAME || 'Unknown';
    const id = stateIds[name] ? `IN-${stateIds[name]}` : `IN-${name.substring(0, 2).toUpperCase()}`;
    const d = coordinatesToSvgPath(feature.geometry);

    if (index === 0) {
      console.log(`Sample - Name: ${name}, Geometry type: ${feature.geometry?.type}, Has coords: ${!!feature.geometry?.coordinates}, Path length: ${d.length}`);
    }

    return { id, name, d };
  })
  .filter(p => p.d && p.d.length > 10); // Only include if we have valid path data

console.log(`Found ${paths.length} states with valid geometries`);
if (paths.length > 0) {
  console.log('First state:', paths[0].id, paths[0].name, 'path length:', paths[0].d.length);
}

// Generate TypeScript code
let typeScriptCode = `// Generated from india_state.geojson
// Automatically converted from GeoJSON to SVG paths

export interface StatePath {
  id: string;
  name: string;
  d: string;
}

export const indiaStatePaths: StatePath[] = [
`;

paths.forEach(p => {
  // Escape quotes in the d attribute
  const escapedD = p.d.replace(/"/g, '\\"');
  typeScriptCode += `  { id: "${p.id}", name: "${p.name}", d: "${escapedD}" },\n`;
});

typeScriptCode += `];
`;

// Write output
const outputPath = path.join(__dirname, 'src/constants/indiaMapPaths.ts');
fs.writeFileSync(outputPath, typeScriptCode, 'utf-8');

console.log(`✓ Generated ${paths.length} state paths`);
console.log(`✓ Saved to ${outputPath}`);
