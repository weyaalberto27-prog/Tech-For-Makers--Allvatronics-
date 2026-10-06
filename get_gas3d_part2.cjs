const fs = require('fs');
const content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('case "gas_sensor":'));
console.log(lines.slice(start + 30, start + 70).join('\n'));
