const fs = require('fs');
const content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('export const CR2032Symbol'));
console.log(lines.slice(start, start + 20).join('\n'));
