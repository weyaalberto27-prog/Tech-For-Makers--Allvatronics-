import fs from 'fs';
const lines = fs.readFileSync('src/components/Symbols.tsx', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('export function BatterySymbol'));
console.log(lines.slice(idx, idx + 40).join('\n'));
