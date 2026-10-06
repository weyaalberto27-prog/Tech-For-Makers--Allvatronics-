const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex((l, i) => i > 390 && l.includes('el.type === "wire"'));
console.log(lines.slice(start, start + 70).join('\n'));
