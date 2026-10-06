const fs = require('fs');
const code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const lines = code.split('\n');
let open = 0;
for (let i = 0; i < 1042; i++) {
  const line = lines[i];
  // Simple heuristic: count { and } outside of strings
  // Just literal count of { and }
  const opens = (line.match(/\{/g) || []).length;
  const closes = (line.match(/\}/g) || []).length;
  open += (opens - closes);
  if (open > 0 && i % 100 === 0) {
     console.log(`Line ${i}: open=${open}`);
  }
}
console.log(`Open at 1042: ${open}`);
