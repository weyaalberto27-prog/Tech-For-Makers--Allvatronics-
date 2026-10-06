import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const regex = /to220: \[\{x:-10, y:15\}, \{x:0, y:15\}, \{x:10, y:15\}\],/;
const newCode = `to220: [{x:-5, y:0}, {x:0, y:0}, {x:5, y:0}],
  mosfet: [{x:-5, y:0}, {x:0, y:0}, {x:5, y:0}],
  mosfet_p: [{x:-5, y:0}, {x:0, y:0}, {x:5, y:0}],`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);
console.log("Patched mosfet and to220 in pcbPinMap");
