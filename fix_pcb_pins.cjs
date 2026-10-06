const fs = require('fs');

// 1. Fix Seven Segment in Meshes3D.tsx
let meshes = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
meshes = meshes.replace(/\{\[-5, 5\]\.map\(x => \n\s*\[-8, -4, 0, 4, 8\]\.map\(z => \(/, 
`{[-15, 15].map(x => 
        [-10, -5, 0, 5, 10].map(z => (`);

// And the pin sizes for seven segment:
meshes = meshes.replace(/<cylinderGeometry args=\{\[0\.3, 0\.3, 8\]\} \/>/g, '<cylinderGeometry args={[0.4, 0.4, 8]} />');

fs.writeFileSync('src/components/Meshes3D.tsx', meshes);

// 2. Fix pcbPinMap in pinmap.ts
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

// replace pcbPinMap definition
const regexPcbMap = /export const pcbPinMap: Record<string, Point\[\]> = \{[\s\S]*?\};/;
const newPcbMap = `export const pcbPinMap: Record<string, Point[]> = {
  transistor: [{x: -10, y: 0}, {x: 0, y: 0}, {x: 10, y: 0}],
  transistor_pnp: [{x: -10, y: 0}, {x: 0, y: 0}, {x: 10, y: 0}],
  mosfet: [{x:-10,y:0}, {x:0,y:0}, {x:10,y:0}],
  mosfet_p: [{x:-10,y:0}, {x:0,y:0}, {x:10,y:0}],
  to220: [{x:-10,y:0}, {x:0,y:0}, {x:10,y:0}],
  potentiometer: [{x: -10, y: 12}, {x: 0, y: 12}, {x: 10, y: 12}],
  accelerometer_pcb: [{x: -5, y: -8}, {x: -2.5, y: -8}, {x: 0, y: -8}, {x: 2.5, y: -8}, {x: 5, y: -8}],
  sot23: [{x:-10, y:-10}, {x:-10, y:10}, {x:10, y:0}],
  sop: [
    {x:-15, y:-7.5}, {x:-15, y:-2.5}, {x:-15, y:2.5}, {x:-15, y:7.5},
    {x:15, y:7.5}, {x:15, y:2.5}, {x:15, y:-2.5}, {x:15, y:-7.5}
  ],
  qfp: [
    {x:-20, y:-15}, {x:-20, y:-5}, {x:-20, y:5}, {x:-20, y:15},
    {x:-15, y:20}, {x:-5, y:20}, {x:5, y:20}, {x:15, y:20},
    {x:20, y:15}, {x:20, y:5}, {x:20, y:-5}, {x:20, y:-15},
    {x:15, y:-20}, {x:5, y:-20}, {x:-5, y:-20}, {x:-15, y:-20}
  ],
  bga: [
    {x:-10, y:-10}, {x:-10, y:0}, {x:-10, y:10},
    {x:0, y:-10},   {x:0, y:0},   {x:0, y:10},
    {x:10, y:-10},  {x:10, y:0},  {x:10, y:10}
  ],
  pinheader: [{x:-15, y:0}, {x:-5, y:0}, {x:5, y:0}, {x:15, y:0}],
  cr2032: [{x:-10, y:0}, {x:10, y:0}],
  ldr_smd: [{x:-10, y:0}, {x:10, y:0}],
  ntc_smd: [{x:-10, y:0}, {x:10, y:0}],
  crystal: [{x:-10, y:0}, {x:10, y:0}],
  // Override generic components for PCB
  resistor: [{x:-15,y:0}, {x:15,y:0}],
  capacitor: [{x:-10,y:0}, {x:10,y:0}],
  capacitor_elec: [{x:-5,y:0}, {x:5,y:0}],
  led: [{x:-5,y:0}, {x:5,y:0}],
  diode: [{x:-15,y:0}, {x:15,y:0}],
  zener_diode: [{x:-15,y:0}, {x:15,y:0}],
  switch: [{x:-10, y:-7.5}, {x:10, y:-7.5}, {x:-10, y:7.5}, {x:10, y:7.5}],
  buzzer: [{x:-5,y:0}, {x:5,y:0}],
  seven_segment: [
    {x:-15,y:-10}, {x:-15,y:-5}, {x:-15,y:0}, {x:-15,y:5}, {x:-15,y:10},
    {x:15,y:10}, {x:15,y:5}, {x:15,y:0}, {x:15,y:-5}, {x:15,y:-10}
  ],
  ldr: [{x:-5, y:0}, {x:5, y:0}],
  ntc: [{x:-5, y:0}, {x:5, y:0}],
  thermistor: [{x:-5, y:0}, {x:5, y:0}],
  photoresistor: [{x:-5, y:0}, {x:5, y:0}],
};`;
pinmap = pinmap.replace(regexPcbMap, newPcbMap);

// 3. Fix getPcbComponentPins DIP pins
// The DIP pins were pushed at y: ±20. We want y: ±15 (0.3 inch spacing)
pinmap = pinmap.replace(/pins\.push\(\{ x: px, y: -20 \}\); \/\/ For dip8\/IC/g, 'pins.push({ x: px, y: -15 }); // For dip8/IC');
pinmap = pinmap.replace(/pins\.push\(\{ x: px, y: 20 \}\); \/\/ For dip8\/IC/g, 'pins.push({ x: px, y: 15 }); // For dip8/IC');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
