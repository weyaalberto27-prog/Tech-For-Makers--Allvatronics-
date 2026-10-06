const fs = require('fs');
const code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = code.split('\n');
let inUltra = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('case "ultrasonic":')) inUltra = true;
  if (inUltra && lines[i].includes('case "')) {
    if (i !== lines.findIndex(l => l.includes('case "ultrasonic":'))) break;
  }
  if (inUltra && lines[i].includes('Pins')) {
    console.log(lines.slice(i, i + 15).join('\n'));
    break;
  }
}
