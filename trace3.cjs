const fs = require('fs');
const code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const lines = code.split('\n');
let open = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const opens = (line.match(/\{/g) || []).length;
  const closes = (line.match(/\}/g) || []).length;
  open += (opens - closes);
}
console.log(`Open at end: ${open}`);
