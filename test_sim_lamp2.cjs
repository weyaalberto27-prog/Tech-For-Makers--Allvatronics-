const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
let start = lines.findIndex(l => l.includes('} else if (comp.componentType === "lamp") {'));
start = lines.findIndex((l, i) => i > start && l.includes('} else if (comp.componentType === "lamp") {'));
console.log(lines.slice(start, start + 25).join('\n'));
