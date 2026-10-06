const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('comp.componentType === "ac_source" ||'));
console.log(lines.slice(start - 5, start + 30).join('\n'));
