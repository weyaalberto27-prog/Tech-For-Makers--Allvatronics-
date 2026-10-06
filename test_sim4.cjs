const fs = require('fs');
const content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
const lines = content.split('\n');
let found = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const vsIdx = vSources.findIndex((vs) => vs.compId === comp.id);')) {
    found++;
    if (found === 3) {
       console.log(lines.slice(i - 10, i + 20).join('\n'));
       break;
    }
  }
}
