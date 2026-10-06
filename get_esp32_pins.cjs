const fs = require('fs');
const code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = code.split('\n');
let inUltra = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function ESP32_3D')) inUltra = true;
  if (inUltra && lines[i].includes('function ')) {
    if (i !== lines.findIndex(l => l.includes('function ESP32_3D'))) break;
  }
  if (inUltra && lines[i].includes('Pins')) {
    console.log(lines.slice(i, i + 15).join('\n'));
    break;
  }
}
