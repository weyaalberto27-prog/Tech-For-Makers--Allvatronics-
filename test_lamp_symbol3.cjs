const fs = require('fs');
const content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('export function LampSymbol'));
console.log(lines.slice(start + 70, start + 100).join('\n'));
