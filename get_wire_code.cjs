const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('function CurvedWire'));
console.log(lines.slice(start, start + 30).join('\n'));
