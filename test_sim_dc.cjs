const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('export function simulateDC('));
console.log(lines.slice(start, start + 25).join('\n'));
