const fs = require('fs');
const content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = content.split('\n');
const startU = lines.findIndex(l => l.includes('case "ultrasonic":'));
console.log("ULTRASONIC:");
console.log(lines.slice(startU, startU + 30).join('\n'));

const startG = lines.findIndex(l => l.includes('case "gas_sensor":'));
console.log("\nGAS SENSOR:");
console.log(lines.slice(startG, startG + 30).join('\n'));
