const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const lines = code.split('\n');
lines.splice(367, 0, '}');
lines.splice(442, 0, '}');
fs.writeFileSync('src/components/Meshes3D.tsx', lines.join('\n'));
