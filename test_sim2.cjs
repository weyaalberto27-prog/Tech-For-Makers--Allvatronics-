const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('const vsIdx = vSources.findIndex((vs) => vs.compId === comp.id);'));
console.log(lines.slice(start - 10, start + 20).join('\n'));
