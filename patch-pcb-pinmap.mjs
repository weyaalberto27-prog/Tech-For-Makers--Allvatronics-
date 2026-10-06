import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const regex = /export const pcbPinMap: Record<string, Point\[\]> = \{/;
const newCode = `export const pcbPinMap: Record<string, Point[]> = {
  resistor: [{x: -15, y: 0}, {x: 15, y: 0}],
  capacitor: [{x: -10, y: 0}, {x: 10, y: 0}],
  capacitor_elec: [{x: -5, y: 0}, {x: 5, y: 0}],
  inductor: [{x: -15, y: 0}, {x: 15, y: 0}],
  diode: [{x: -15, y: 0}, {x: 15, y: 0}],
  zener_diode: [{x: -15, y: 0}, {x: 15, y: 0}],`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);
console.log("Patched pcbPinMap");
