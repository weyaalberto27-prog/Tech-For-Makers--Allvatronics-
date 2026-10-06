const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(535, 545).join('\n'));
