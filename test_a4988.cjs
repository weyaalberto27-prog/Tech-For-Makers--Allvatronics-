const fs = require('fs');
const code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('case "a4988":')) console.log(i + ': a4988');
  if (l.includes('case "motor_driver":')) console.log(i + ': motor_driver');
});
