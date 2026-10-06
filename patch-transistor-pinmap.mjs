import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const regex = /export const pcbPinMap: Record<string, Point\[\]> = \{/;
const newCode = `export const pcbPinMap: Record<string, Point[]> = {
  transistor: [{x: -5, y: 0}, {x: 0, y: 0}, {x: 5, y: 0}],
  transistor_pnp: [{x: -5, y: 0}, {x: 0, y: 0}, {x: 5, y: 0}],`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);
console.log("Patched transistor in pcbPinMap");
