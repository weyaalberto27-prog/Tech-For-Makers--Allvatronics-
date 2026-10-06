const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
const lines = code.split('\n');
for (let i = 430; i < 445; i++) {
  console.log(i + ": " + JSON.stringify(lines[i]));
}
