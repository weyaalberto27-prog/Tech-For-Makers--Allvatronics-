const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('comp.componentType === "battery" || comp.componentType === "cr2032" ||'));
let match = lines.findIndex((l, i) => i > start && l.includes('comp.componentType === "battery" || comp.componentType === "cr2032" ||'));
console.log(lines.slice(match, match + 20).join('\n'));
