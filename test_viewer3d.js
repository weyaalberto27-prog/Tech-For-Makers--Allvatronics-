const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(780, 800).join('\n'));
