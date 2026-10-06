const fs = require('fs');
const content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('case "lamp":'));
console.log(lines.slice(start, start + 25).join('\n'));
