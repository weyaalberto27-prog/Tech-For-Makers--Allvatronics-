const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/case "accelerometer":/g, "case \"accelerometer_pcb\":\n      case \"accelerometer\":");
code = code.replace(/case "gps":/g, "case \"gps_pcb\":\n      case \"gps\":");

fs.writeFileSync('src/components/Meshes3D.tsx', code);
