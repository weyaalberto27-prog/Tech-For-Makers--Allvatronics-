const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex((l, i) => i > 400 && l.includes('if (el.type === "component") {'));
console.log(lines.slice(start, start + 40).join('\n'));
