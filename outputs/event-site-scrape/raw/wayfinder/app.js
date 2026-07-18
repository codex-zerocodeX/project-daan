/* Ateneo 3D Wayfinder — Build Week Manila @ Leong Hall
   All data embedded locally (window.CAMPUS_DATA) — works fully offline. */
(function () {
'use strict';
var D = window.CAMPUS_DATA;

/* ---------------- GeoJSON builders ---------------- */
function fc(feats) { return { type: 'FeatureCollection', features: feats }; }
function poly(coords, props) {
  return { type: 'Feature', properties: props || {}, geometry: { type: 'Polygon', coordinates: [coords] } };
}
function line(coords, props) {
  return { type: 'Feature', properties: props || {}, geometry: { type: 'LineString', coordinates: coords } };
}

var KATIPUNAN_EDGE = 121.07435; // west of this = across Katipunan (context buildings)
var bldCampus = [], bldOuter = [], bldLeong = null, landmarkFeats = [];
D.buildings.forEach(function (b) {
  var props = { h: b.h, n: b.n || '', lm: b.lm || '' };
  var maxLon = Math.max.apply(null, b.p.map(function (c) { return c[0]; }));
  var f = poly(b.p, props);
  if (b.lm === 'leong') { bldLeong = f; return; }
  if (b.lm) { landmarkFeats.push(f); return; }
  (maxLon < KATIPUNAN_EDGE ? bldOuter : bldCampus).push(f);
});

var greenFeats = D.greens.map(function (g) { return poly(g, {}); });
var parkFeats = D.parking.map(function (p) { return poly(p.p, { n: p.n }); });
var roadKat = D.roads.katipunan.map(function (r) { return line(r, {}); });
var roadStreet = D.roads.street.map(function (r) { return line(r, {}); });
var roadCampus = D.roads.campus.map(function (r) { return line(r, {}); });
var roadWalk = D.roads.walk.map(function (r) { return line(r, {}); });

/* ---------------- Gates & parking metadata ---------------- */
var GATES = [
  { id: 'gate3', num: '3', name: 'Gate 3', sub: 'Main gate · across from Regis Center', kind: 'both',
    lon: 121.07465, lat: 14.64053,
    types: ['c', 'w'],
    desc: 'The university\u2019s main gate, right across from Regis Center \u2014 the recommended entry for Build Week guests. Walking? This is the gate to use. Driving without an Ateneo sticker? Follow the guard\u2019s current entry instructions. Leong Hall is a short walk down University Rd.',
    steps: ['Enter through Gate 3 (the gate connected to Regis Center)',
            'Walk straight ahead onto University Rd, past Visitor\u2019s Lane',
            'Leong Hall rises on your left \u2014 you\u2019re there in ~2 minutes'] },
  { id: 'gate3_1', num: '3.1', name: 'Gate 3.1', sub: 'Stickered vehicles from the north (UP side)', kind: 'car',
    lon: 121.07466, lat: 14.64065, types: ['c'],
    desc: 'Entry-only lane for vehicles WITH an Ateneo gate-pass sticker, coming from the north (UP Town Center / Commonwealth side) \u2014 no U-turn needed. No sticker? Stay on Katipunan and use Gate 3 instead.',
    steps: ['Enter Gate 3.1 (right turn from Katipunan, coming from the UP side)',
            'Merge onto University Rd heading east',
            'Park at Northwest Car Park (behind Aret\u00e9) \u2014 see \u201cDriving? Park here\u201d below'] },
  { id: 'gate3_5', num: '3.5', name: 'Gate 3.5', sub: 'Pedestrian · beside Aret\u00e9 · open Sundays', kind: 'walk',
    lon: 121.07472, lat: 14.64148, types: ['w'],
    desc: 'Pedestrian gate just north of Gate 3, across from the Regis Center\u2019s north end and right beside Aret\u00e9. The closest walk-in gate to Leong Hall \u2014 and the only gate open on Sundays. Vehicles may only EXIT here (northbound).',
    steps: ['Enter Gate 3.5 (across Regis Center)',
            'Walk past Aret\u00e9 on your right, toward the Northwest Car Park walkway',
            'Angle right down to University Rd \u2014 Leong Hall is on your right, ~3 minutes'] },
  { id: 'gate3_2', num: '3.2', name: 'Gate 3.2', sub: 'Exit only (southbound)', kind: 'exit',
    lon: 121.07468, lat: 14.64077, types: ['x'], noRoute: true,
    desc: 'Exit-only gate for southbound traffic (toward Aurora Blvd / White Plains), fed by the Northwest Diversion Rd. You can\u2019t enter here \u2014 use Gate 3 or 3.1 beside it.', steps: [] }
];

var PARKS = [
  { id: 'nw', name: 'Northwest Car Park', sub: 'THE guest parking · behind Aret\u00e9', lon: 121.07675, lat: 14.64147, rec: true,
    desc: 'Guest parking is near Aret\u00e9. From Gate 3, take University Rd and bend slightly left toward the Northwest Car Park; Leong Hall is a short walk south. Ask the guard or event team for the current parking instructions.',
    steps: ['Enter Gate 3 (the only entry for non-sticker cars) onto University Rd',
            'Bend slightly left toward Aret\u00e9 / Northwest Car Park',
            'Park, then walk 2 min south to Leong Hall'] },
  { id: 'north', name: 'North Car Park', sub: 'Across Bellarmine Field', lon: 121.07794, lat: 14.64107,
    desc: 'Large lot across Bellarmine Field \u2014 enter Gate 3, take University Rd, right at Fr. Masterson Dr, entrance via Parade Loop. A flat 3-minute walk to Leong Hall.',
    steps: ['Enter Gate 3 onto University Rd',
            'Right at Fr. Masterson Dr toward Parade Loop',
            'Park, then walk 3 min west to Leong Hall'] },
  { id: 'rizal', name: 'Rizal Library Parking', sub: 'By the new Rizal Library', lon: 121.07579, lat: 14.63975,
    desc: 'Right by the new Rizal Library (First Pacific Hall): Gate 3 \u2192 University Rd \u2192 right turn toward the library. A 3-minute walk to Leong Hall past the SOM area.',
    steps: ['Enter Gate 3 onto University Rd',
            'Turn right toward the new Rizal Library',
            'Park, then walk 3 min north to Leong Hall'] },
  { id: 'pipac', name: 'PIPAC Parking', sub: 'Small lot on University Rd', lon: 121.07635, lat: 14.63900,
    desc: 'A small pocket lot on University Rd by PIPAC, just south of Leong Hall. Heads-up: the event\u2019s catering vehicles park right in front of Leong Hall, so this area may be busy \u2014 if full, loop back to Northwest Car Park.',
    steps: ['Enter Gate 3 onto University Rd',
            'Continue past the Leong Hall turn toward PIPAC',
            'Park, then walk ~6 min north to Leong Hall'] },
  { id: 'jsec', name: 'JSEC Parking', sub: 'Near JSEC Mall food strip', lon: 121.07624, lat: 14.63738,
    desc: 'Also open to guests without stickers \u2014 by the JSEC Mall student food strip. Walk ~6 minutes up to Leong Hall, or hop on the Line A e-jeep to Old Rizal Library.',
    steps: ['Enter Gate 3 onto University Rd',
            'Left at Fr. Masterson Dr toward Gonzaga / JSEC',
            'Park, then walk ~6 min north to Leong Hall'] }
];

var FOOD = [
  { id: 'caf', name: 'Gonzaga Cafeteria', tag: 'ON CAMPUS · OPENS 7:00', lon: 121.07800, lat: 14.63900, icon: '\ud83c\udf5a', rec: true,
    chip: ['7:00 AM', 'opens'],
    desc: 'The campus cafeteria \u2014 opens at 7:00 AM, the easiest breakfast on site. Silog plates and rice meals at student prices, a ~5-minute walk from Leong Hall.',
    steps: ['Head west past the North Car Park toward University Rd', 'Leong Hall is on your right \u2014 ~5 minutes'] },
  { id: 'kanto', name: 'Kanto Freestyle', tag: 'ACROSS GATE 3 · 24/7', lon: 121.07408, lat: 14.64061, icon: '\ud83c\udf73',
    chip: ['24/7', 'open'],
    desc: 'Open 24/7 \u2014 Filipino breakfast plates (silog, tapsilog) right across from the main gate.',
    steps: ['Eat, then cross Katipunan at Gate 3', 'Follow the gold line straight to Leong Hall'] },
  { id: 'cbtl', name: 'Coffee Bean & Tea Leaf', tag: 'ACROSS GATE 3', lon: 121.07432, lat: 14.64078, icon: '\u2615',
    chip: ['Regis strip', 'where'],
    desc: 'Coffee and breakfast on the Regis Center strip, steps from Gate 3 \u2014 the closest sit-down coffee to Leong Hall.',
    steps: ['Cross Katipunan at Gate 3', 'Follow the gold line straight to Leong Hall'] },
  { id: 'seven', name: '7-Eleven', tag: 'ACROSS GATE 3 · 24/7', lon: 121.07385, lat: 14.64045, icon: '\ud83c\udfea',
    chip: ['24/7', 'open'],
    desc: 'Grab-and-go rice meals, coffee and snacks \u2014 open 24/7, right across Gate 3.',
    steps: ['Cross Katipunan at Gate 3', 'Follow the gold line straight to Leong Hall'] },
  { id: 'sbux', name: 'Starbucks', tag: 'ACROSS GATE 3.5', lon: 121.07428, lat: 14.64206, icon: '\u2615',
    chip: ['Gate 3.5', 'where'],
    desc: 'Coffee and pastries across from Gate 3.5 \u2014 handy if you\u2019re coming from the north (UP side).',
    steps: ['Cross Katipunan at Gate 3.5', 'Walk past Aret\u00e9 down to Leong Hall'] },
  { id: 'mcdo', name: 'McDonald\u2019s', tag: 'SOUTH STRIP · 24/7', lon: 121.07404, lat: 14.63592, icon: '\ud83c\udf5f',
    chip: ['24/7', 'open'],
    desc: 'Open 24/7 with a full breakfast menu \u2014 on the south strip, across from the Gate 2 area.',
    steps: ['Walk north along Katipunan to Gate 3', 'Enter and follow University Rd to Leong Hall'] },
  { id: 'tapa', name: 'Tapa King', tag: 'SOUTH STRIP', lon: 121.07423, lat: 14.63919, icon: '\ud83c\udf5b',
    chip: ['south strip', 'where'],
    desc: 'All-day Filipino breakfast \u2014 tapsilog and rice meals on the south strip.',
    steps: ['Walk up Katipunan to Gate 3', 'Enter and follow University Rd to Leong Hall'] },
  { id: 'bean', name: 'Beanleaf Katipunan', tag: 'SOUTH STRIP · OPENS 7:00', lon: 121.07391, lat: 14.63706, icon: '\ud83e\uddcb',
    chip: ['7:00 AM', 'opens'],
    desc: 'Opens 7:00 AM (Mon\u2013Sat) \u2014 coffee, milk tea and light breakfast on the south strip.',
    steps: ['Walk up Katipunan to Gate 3', 'Enter and follow University Rd to Leong Hall'] },
  { id: 'dunk', name: 'Dunkin\u2019', tag: 'SOUTH STRIP', lon: 121.07426, lat: 14.63969, icon: '\ud83c\udf69',
    chip: ['south strip', 'where'],
    desc: 'Donuts and coffee for a fast sugar-and-caffeine fix on the south strip.',
    steps: ['Walk up Katipunan to Gate 3', 'Enter and follow University Rd to Leong Hall'] }
];

var LANDMARKS = [
  { name: 'Ricardo & Dr. Rosita Leong Hall', lon: 121.07633, lat: 14.64070, gold: true },
  { name: 'Aret\u00e9', lon: 121.07562, lat: 14.64141 },
  { name: 'Blue Eagle Gym', lon: 121.07547, lat: 14.63530 },
  { name: 'Church of the Ges\u00f9', lon: 121.08001, lat: 14.64014 },
  { name: 'Old Rizal Library (e-jeep stop)', lon: 121.07628, lat: 14.63963 },
  { name: 'Bellarmine Field', lon: 121.07901, lat: 14.64047 },
  { name: 'Regis Center (across Katipunan)', lon: 121.07415, lat: 14.64096 },
  { name: 'NBS / Jollibee (across Katipunan)', lon: 121.07385, lat: 14.63730 },
  { name: '\u25b2 to UP Town Ctr / Commonwealth', lon: 121.07445, lat: 14.64420, dir: true },
  { name: '\u25bc to Aurora Blvd / LRT-2 Katipunan', lon: 121.07415, lat: 14.63305, dir: true }
];

/* ---------------- Map init ---------------- */
var style = {
  version: 8,
  name: 'ateneo-night',
  sources: {
    greens: { type: 'geojson', data: fc(greenFeats) },
    parking: { type: 'geojson', data: fc(parkFeats) },
    roadStreet: { type: 'geojson', data: fc(roadStreet) },
    roadCampus: { type: 'geojson', data: fc(roadCampus) },
    roadWalk: { type: 'geojson', data: fc(roadWalk) },
    roadKat: { type: 'geojson', data: fc(roadKat) },
    bldOuter: { type: 'geojson', data: fc(bldOuter) },
    bldCampus: { type: 'geojson', data: fc(bldCampus) },
    bldLandmark: { type: 'geojson', data: fc(landmarkFeats) },
    bldLeong: { type: 'geojson', data: fc(bldLeong ? [bldLeong] : []) },
    routeDrive: { type: 'geojson', data: fc([]) },
    routeWalk: { type: 'geojson', data: fc([]) },
    routePulse: { type: 'geojson', data: fc([]) }
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#070d1f' } },
    { id: 'greens', type: 'fill', source: 'greens',
      paint: { 'fill-color': '#122e25', 'fill-opacity': 0.9 } },
    { id: 'parking-fill', type: 'fill', source: 'parking',
      paint: { 'fill-color': '#1c4a8f', 'fill-opacity': 0.45 } },
    { id: 'parking-line', type: 'line', source: 'parking',
      paint: { 'line-color': '#3b82f6', 'line-width': 1, 'line-opacity': 0.7 } },
    { id: 'roads-street', type: 'line', source: 'roadStreet',
      paint: { 'line-color': '#2a3554', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1.5, 17, 6] } },
    { id: 'roads-campus', type: 'line', source: 'roadCampus',
      paint: { 'line-color': '#4a5878', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1.5, 17, 7] } },
    { id: 'roads-walk', type: 'line', source: 'roadWalk',
      paint: { 'line-color': '#3a4664', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.7, 17, 2.5], 'line-dasharray': [2, 1.5] } },
    { id: 'roads-kat-casing', type: 'line', source: 'roadKat',
      paint: { 'line-color': '#111a33', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 6, 17, 22] } },
    { id: 'roads-kat', type: 'line', source: 'roadKat',
      paint: { 'line-color': '#5b6b93', 'line-width': ['interpolate', ['linear'], ['zoom'], 13, 4, 17, 16] } },
    { id: 'bld-outer', type: 'fill-extrusion', source: 'bldOuter',
      paint: { 'fill-extrusion-color': '#141d38', 'fill-extrusion-height': ['get', 'h'],
               'fill-extrusion-base': 0, 'fill-extrusion-opacity': 0.85 } },
    { id: 'bld-campus', type: 'fill-extrusion', source: 'bldCampus',
      paint: { 'fill-extrusion-color': '#2b3a63', 'fill-extrusion-height': ['get', 'h'],
               'fill-extrusion-base': 0, 'fill-extrusion-opacity': 0.95,
               'fill-extrusion-vertical-gradient': true } },
    { id: 'bld-landmark', type: 'fill-extrusion', source: 'bldLandmark',
      paint: { 'fill-extrusion-color': '#3d5aa6', 'fill-extrusion-height': ['get', 'h'],
               'fill-extrusion-base': 0, 'fill-extrusion-opacity': 1 } },
    { id: 'bld-leong', type: 'fill-extrusion', source: 'bldLeong',
      paint: { 'fill-extrusion-color': '#f5b71e', 'fill-extrusion-height': ['get', 'h'],
               'fill-extrusion-base': 0, 'fill-extrusion-opacity': 1 } },
    /* routes */
    { id: 'route-drive-glow', type: 'line', source: 'routeDrive',
      paint: { 'line-color': '#38bdf8', 'line-width': 14, 'line-blur': 12, 'line-opacity': 0.5 } },
    { id: 'route-drive-line', type: 'line', source: 'routeDrive',
      paint: { 'line-color': '#7dd3fc', 'line-width': 4, 'line-opacity': 0.95 } },
    { id: 'route-drive-dash', type: 'line', source: 'routeDrive',
      paint: { 'line-color': '#e0f2fe', 'line-width': 2.2, 'line-dasharray': [0, 4, 3] } },
    { id: 'route-walk-glow', type: 'line', source: 'routeWalk',
      paint: { 'line-color': '#ffc21c', 'line-width': 16, 'line-blur': 13, 'line-opacity': 0.55 } },
    { id: 'route-walk-line', type: 'line', source: 'routeWalk',
      paint: { 'line-color': '#ffd75e', 'line-width': 4.5, 'line-opacity': 0.95 } },
    { id: 'route-walk-dash', type: 'line', source: 'routeWalk',
      paint: { 'line-color': '#fff7dd', 'line-width': 2.4, 'line-dasharray': [0, 4, 3] } },
    { id: 'route-pulse-outer', type: 'circle', source: 'routePulse',
      paint: { 'circle-color': '#ffc21c', 'circle-radius': 12, 'circle-opacity': 0.3, 'circle-blur': 0.6 } },
    { id: 'route-pulse', type: 'circle', source: 'routePulse',
      paint: { 'circle-color': '#fff3cf', 'circle-radius': 5.5, 'circle-stroke-width': 2, 'circle-stroke-color': '#ffc21c' } }
  ]
};

var map = new maplibregl.Map({
  container: 'map',
  style: style,
  center: [121.07485, 14.64055],
  zoom: 16.15,
  pitch: 58,
  bearing: 84,
  minZoom: 13.5,
  maxZoom: 18.5,
  maxPitch: 70,
  attributionControl: { compact: true }
});
map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
map.addControl(new maplibregl.ScaleControl({ maxWidth: 90, unit: 'metric' }), 'bottom-left');
map.touchZoomRotate.enableRotation();
function updateZoomClass() { document.getElementById('map').classList.toggle('zoomed', map.getZoom() >= 16); }
map.on('zoom', updateZoomClass);

/* ---------------- helpers ---------------- */
function fmtDist(m) { return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(1) + ' km'; }
function fmtTime(m) { var t = Math.max(1, Math.round(m / 80)); return '~' + t + ' min'; }
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

/* ---------------- markers ---------------- */
var gateMarkers = {}, parkMarkers = {}, gateRoots = {}, parkRoots = {};

var MINOR_GATES = { gate3_1: 'minor', gate3_2: 'minor lbl-below' };
GATES.forEach(function (g) {
  var root = el('div');
  var mk = el('div', 'mk ' + g.kind + (g.closedWeekend ? ' closed' : '') + (MINOR_GATES[g.id] ? ' ' + MINOR_GATES[g.id] : ''));
  mk.appendChild(el('div', 'lbl', g.name));
  mk.appendChild(el('div', 'dot', '<span>' + g.num + '</span>'));
  mk.appendChild(el('div', 'stem'));
  root.appendChild(mk);
  root.addEventListener('click', function () { selectGate(g.id); });
  var marker = new maplibregl.Marker({ element: root, anchor: 'bottom' })
    .setLngLat([g.lon, g.lat]).addTo(map);
  gateMarkers[g.id] = mk;
  gateRoots[g.id] = root;
});

PARKS.forEach(function (p) {
  var root = el('div');
  var SHORT = { nw: 'Northwest CP', north: 'North CP', rizal: 'Rizal Lib', pipac: 'PIPAC', jsec: 'JSEC' };
  var mk = el('div', 'pmk');
  mk.appendChild(el('div', 'lbl', SHORT[p.id] || p.name));
  mk.appendChild(el('div', 'p', 'P'));
  mk.appendChild(el('div', 'stem'));
  root.appendChild(mk);
  root.addEventListener('click', function () { selectPark(p.id); });
  new maplibregl.Marker({ element: root, anchor: 'bottom' }).setLngLat([p.lon, p.lat]).addTo(map);
  parkMarkers[p.id] = mk;
  parkRoots[p.id] = root;
});

/* food markers */
var foodMarkers = {}, foodRoots = {};
FOOD.forEach(function (f) {
  var root = el('div');
  var mk = el('div', 'fmk');
  mk.appendChild(el('div', 'lbl', f.name));
  mk.appendChild(el('div', 'dot', f.icon));
  mk.appendChild(el('div', 'stem'));
  root.appendChild(mk);
  root.addEventListener('click', function () { selectFood(f.id); });
  new maplibregl.Marker({ element: root, anchor: 'bottom' }).setLngLat([f.lon, f.lat]).addTo(map);
  foodMarkers[f.id] = mk;
  foodRoots[f.id] = root;
});

/* landmark labels + Leong beacon */
LANDMARKS.forEach(function (l) {
  var e = el('div', 'bld-lbl' + (l.gold ? ' gold' : ''), l.name);
  if (l.dir) e.style.opacity = '.75';
  new maplibregl.Marker({ element: e, anchor: 'center' }).setLngLat([l.lon, l.lat]).addTo(map);
});
(function () {
  var root = el('div');
  root.style.pointerEvents = 'none';
  var b = el('div', 'pulse');
  root.appendChild(b);
  new maplibregl.Marker({ element: root, anchor: 'center' })
    .setLngLat([D.leong.lon, D.leong.lat]).addTo(map);
})();

/* ---------------- sidebar ---------------- */
var gatesBox = document.getElementById('gates');
var gateBtns = {};
GATES.forEach(function (g) {
  var dist = D.routes.walkDist[g.id];
  var btn = el('button', 'gate-btn' + (g.id === 'gate3' ? ' rec' : '') + (g.closedWeekend ? ' closed' : ''));
  var badges = '';
  if (g.types.indexOf('w') >= 0) badges += '<span class="bdg w">WALK IN</span>';
  if (g.types.indexOf('c') >= 0) badges += '<span class="bdg c">CARS ENTER</span>';
  if (g.types.indexOf('x') >= 0) badges += '<span class="bdg x">EXIT</span>';
  if (g.types.indexOf('closed') >= 0) badges += '<span class="bdg cl">CLOSED WEEKENDS</span>';
  btn.appendChild(el('div', 'gnum ' + (g.closedWeekend ? 'closed' : (g.kind === 'both' ? 'car' : g.kind)), g.num));
  var meta = el('div', 'gmeta');
  meta.appendChild(el('div', 'gname', g.name));
  meta.appendChild(el('div', 'gsub', g.sub));
  meta.appendChild(el('div', 'badges', badges));
  btn.appendChild(meta);
  var right = g.closedWeekend ? 'closed<span>Sat\u2013Sun</span>'
            : dist ? fmtDist(dist) + '<span>' + fmtTime(dist) + ' walk</span>'
                   : (g.noRoute ? 'exit<span>only</span>' : 'cars<span>enter</span>');
  btn.appendChild(el('div', 'gdist', right));
  btn.addEventListener('click', function () { selectGate(g.id); });
  gatesBox.appendChild(btn);
  gateBtns[g.id] = btn;
});

var parksBox = document.getElementById('parks');
var parkBtns = {};
PARKS.forEach(function (p) {
  var walk = D.routes.parkWalkDist[p.id];
  var btn = el('button', 'park-btn' + (p.rec ? ' rec' : ''));
  btn.appendChild(el('div', 'gnum car', 'P'));
  var meta = el('div', 'gmeta');
  meta.appendChild(el('div', 'gname', p.name));
  meta.appendChild(el('div', 'gsub', p.sub));
  btn.appendChild(meta);
  btn.appendChild(el('div', 'gdist', fmtDist(walk) + '<span>' + fmtTime(walk) + ' walk</span>'));
  btn.addEventListener('click', function () { selectPark(p.id); });
  parksBox.appendChild(btn);
  parkBtns[p.id] = btn;
});

var foodsBox = document.getElementById('foods');
var foodBtns = {};
FOOD.forEach(function (f) {
  var d = D.foodDist[f.id];
  var btn = el('button', 'park-btn food-btn' + (f.rec ? ' rec' : ''));
  btn.appendChild(el('div', 'gnum food', f.icon));
  var meta = el('div', 'gmeta');
  meta.appendChild(el('div', 'gname', f.name));
  meta.appendChild(el('div', 'gsub', f.tag));
  btn.appendChild(meta);
  btn.appendChild(el('div', 'gdist', fmtDist(d) + '<span>' + fmtTime(d) + '</span>'));
  btn.addEventListener('click', function () { selectFood(f.id); });
  foodsBox.appendChild(btn);
  foodBtns[f.id] = btn;
});

/* ---------------- mobile helpers ---------------- */
var panel = document.getElementById('panel');
function isMobile() { return window.innerWidth <= 760; }
document.getElementById('btn-tips').addEventListener('click', function (e) {
  e.stopPropagation();
  panel.classList.toggle('tips-open');
});

/* ---------------- info card ---------------- */
var ic = document.getElementById('infocard');

function showInfo(eyebrow, title, chips, desc, steps) {
  document.getElementById('ic-eyebrow').textContent = eyebrow;
  document.getElementById('ic-title').textContent = title;
  document.getElementById('ic-meta').innerHTML =
    chips.map(function (c) { return '<div class="rm"><b>' + c[0] + '</b><span>' + c[1] + '</span></div>'; }).join('');
  document.getElementById('ic-desc').textContent = desc;
  document.getElementById('ic-steps').innerHTML =
    (steps || []).map(function (s) { return '<li>' + s + '</li>'; }).join('');
  ic.classList.add('show');
}
document.getElementById('ic-close').addEventListener('click', function () {
  ic.classList.remove('show');
});

/* ---------------- route display ---------------- */
var currentCoords = [];   // for pulse + dash
var driveCoords = [];

function setRoutes(walkCoords, drive) {
  if (!map.getSource('routeWalk')) return;
  currentCoords = walkCoords || [];
  driveCoords = drive || [];
  map.getSource('routeWalk').setData(fc(currentCoords.length ? [line(currentCoords, {})] : []));
  map.getSource('routeDrive').setData(fc(driveCoords.length ? [line(driveCoords, {})] : []));
  pulseT = 0;
  updatePulseTrack();
}

function fitTo(coords, extra) {
  var b = coords.reduce(function (bb, c) { return bb.extend(c); }, new maplibregl.LngLatBounds(coords[0], coords[0]));
  if (extra) extra.forEach(function (c) { b.extend(c); });
  var pad;
  if (isMobile()) {
    var topPad = 130;
    if (ic.classList.contains('show')) topPad = Math.min(window.innerHeight * 0.55, ic.offsetHeight + 78);
    pad = { top: topPad, bottom: 215, left: 45, right: 45 };
  } else {
    pad = { top: 90, bottom: 90, left: 400, right: 90 };
  }
  map.fitBounds(b, { padding: pad, pitch: 58, bearing: map.getBearing(), duration: 1400, maxZoom: 16.6 });
}

function clearSel() {
  Object.keys(gateBtns).forEach(function (k) { gateBtns[k].classList.remove('active'); gateMarkers[k].classList.remove('sel'); gateRoots[k].style.zIndex = ''; });
  Object.keys(parkBtns).forEach(function (k) { parkBtns[k].classList.remove('active'); parkMarkers[k].classList.remove('sel'); parkRoots[k].style.zIndex = ''; });
  Object.keys(foodBtns).forEach(function (k) { foodBtns[k].classList.remove('active'); foodMarkers[k].classList.remove('sel'); foodRoots[k].style.zIndex = ''; });
}

function selectFood(id) {
  var f = FOOD.filter(function (x) { return x.id === id; })[0];
  clearSel();
  foodBtns[id].classList.add('active');
  foodMarkers[id].classList.add('sel');
  foodRoots[id].style.zIndex = '20';
  stopSpin();
  var r = D.foodRoutes[id], d = D.foodDist[id];
  setRoutes(r, []);
  showInfo('Breakfast stop', f.name + ' \u2192 Leong Hall',
    [[fmtDist(d), 'walk to Leong'], [fmtTime(d), 'on foot'], f.chip],
    f.desc, f.steps || []);
  fitTo(r, [[f.lon, f.lat], [D.leong.lon, D.leong.lat]]);
}

function selectGate(id) {
  var g = GATES.filter(function (x) { return x.id === id; })[0];
  clearSel();
  gateBtns[id].classList.add('active');
  gateMarkers[id].classList.add('sel');
  gateRoots[id].style.zIndex = '20';
  stopSpin();
  if (g.closedWeekend) {
    setRoutes([], []);
    map.easeTo({ center: [g.lon, g.lat], zoom: 16.2, pitch: 55, duration: 1200 });
    showInfo('Closed on weekends', g.name, [['\ud83d\udeab', 'closed Sat\u2013Sun'], ['Gate 3', 'use instead']],
      g.desc, []);
    return;
  }
  if (id === 'gate3_1') {
    // vehicle-only gate: show drive to Northwest Car Park + walk leg
    var drv = D.routes.drive.nw, wk = D.routes.parkWalk.nw;
    setRoutes(wk, drv);
    showInfo('Vehicle entrance', g.name,
      [[fmtDist(D.routes.driveDist.nw), 'drive to NW Car Park'], [fmtDist(D.routes.parkWalkDist.nw), 'then walk'], ['2\u20133 min', 'total on foot']],
      g.desc, g.steps);
    fitTo(drv.concat(wk), [[g.lon, g.lat], [D.leong.lon, D.leong.lat]]);
  } else if (g.noRoute) {
    setRoutes([], []);
    map.easeTo({ center: [g.lon, g.lat], zoom: 16.2, pitch: 55, duration: 1200 });
    showInfo('Exit only', g.name, [['\u26d4', 'no entry here']], g.desc, []);
  } else {
    var w = D.routes.walk[id];
    setRoutes(w, []);
    ic.classList.remove('show');
    fitTo(w, [[g.lon, g.lat], [D.leong.lon, D.leong.lat]]);
  }
}

function selectPark(id) {
  var p = PARKS.filter(function (x) { return x.id === id; })[0];
  clearSel();
  parkBtns[id].classList.add('active');
  parkMarkers[id].classList.add('sel');
  parkRoots[id].style.zIndex = '20';
  stopSpin();
  var drv = D.routes.drive[id], wk = D.routes.parkWalk[id];
  setRoutes(wk, drv);
  showInfo('Drive + park', 'Gate 3 / 3.1 \u2192 ' + p.name,
    [[fmtDist(D.routes.driveDist[id]), 'drive from gate'], [fmtDist(D.routes.parkWalkDist[id]), 'then walk'], [fmtTime(D.routes.parkWalkDist[id]), 'to Leong Hall']],
    p.desc, p.steps);
  fitTo(drv.concat(wk), [[p.lon, p.lat], [D.leong.lon, D.leong.lat]]);
}

/* ---------------- pulse dot ---------------- */
var pulseTrack = null, pulseT = 0;
function updatePulseTrack() {
  var coords = currentCoords.length ? currentCoords : driveCoords;
  if (!coords.length) { pulseTrack = null; map.getSource('routePulse').setData(fc([])); return; }
  var cum = [0];
  for (var i = 1; i < coords.length; i++) {
    var dx = (coords[i][0] - coords[i - 1][0]) * 111320 * Math.cos(coords[i][1] * Math.PI / 180);
    var dy = (coords[i][1] - coords[i - 1][1]) * 110540;
    cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  pulseTrack = { coords: coords, cum: cum, total: cum[cum.length - 1] };
}
function pointAt(d) {
  var t = pulseTrack, i = 1;
  while (i < t.cum.length - 1 && t.cum[i] < d) i++;
  var seg = t.cum[i] - t.cum[i - 1] || 1;
  var f = (d - t.cum[i - 1]) / seg;
  return [t.coords[i - 1][0] + (t.coords[i][0] - t.coords[i - 1][0]) * f,
          t.coords[i - 1][1] + (t.coords[i][1] - t.coords[i - 1][1]) * f];
}

/* ---------------- dash + pulse animation ---------------- */
var dashSteps = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0]];
var t0 = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  var t = (now - t0) / 1000;
  var idx = Math.floor(t * 8) % dashSteps.length;
  try {
    map.setPaintProperty('route-walk-dash', 'line-dasharray', dashSteps[idx]);
    map.setPaintProperty('route-drive-dash', 'line-dasharray', dashSteps[(idx + 3) % dashSteps.length]);
  } catch (e) {}
  if (pulseTrack) {
    pulseT = (pulseT + 16.7) % (pulseTrack.total * 6); // ~60 km/h feel
    var d = (pulseT / 6);
    map.getSource('routePulse').setData(fc([{ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: pointAt(d) } }]));
  }
  if (spinning) map.rotateTo(spinBase + (now - spinT0) / 120, { duration: 0 });
}

/* ---------------- camera buttons / spin ---------------- */
var HOME = { center: [121.07485, 14.64055], zoom: 16.15, pitch: 58, bearing: 84 };
document.getElementById('btn-reset').addEventListener('click', function () {
  stopSpin(); clearSel(); setRoutes([], []); ic.classList.remove('show');
  map.easeTo(Object.assign({}, HOME, { duration: 1500 }));
});
document.getElementById('btn-leong').addEventListener('click', function () {
  stopSpin();
  map.easeTo({ center: [D.leong.lon - 0.0004, D.leong.lat], zoom: 17.1, pitch: 62, bearing: 84, duration: 1600 });
});
var spinning = false, spinBase = -16, spinT0 = 0;
var spinBtn = document.getElementById('btn-spin');
var spinTx = spinBtn.querySelector('.tx');
function stopSpin() {
  if (!spinning) return;
  spinning = false;
  if (spinTx) spinTx.textContent = 'Auto-orbit: off'; else spinBtn.textContent = '\u27f3 Auto-orbit: off';
  spinBtn.classList.remove('on');
}
spinBtn.addEventListener('click', function () {
  if (spinning) { stopSpin(); return; }
  spinning = true;
  spinBase = map.getBearing();
  spinT0 = performance.now();
  if (spinTx) spinTx.textContent = 'Auto-orbit: on'; else spinBtn.textContent = '\u27f3 Auto-orbit: on';
  spinBtn.classList.add('on');
});
['mousedown', 'touchstart', 'wheel'].forEach(function (ev) {
  map.getCanvas().addEventListener(ev, stopSpin, { passive: true });
});

/* ---------------- boot ---------------- */
map.on('load', function () {
  requestAnimationFrame(animate);
  // cinematic settle-in, then spotlight the main gate
  map.easeTo({ zoom: 16.45, duration: 1800 });
  setTimeout(function () { selectGate('gate3'); }, 1900);
});
})();
