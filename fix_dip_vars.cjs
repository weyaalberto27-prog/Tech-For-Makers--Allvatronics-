const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/const pinDist = isVertical \? 15 : 20;/, 'const pinDist = isVertical ? 15 : 15; // 0.3 inch spacing');
code = code.replace(/const bodyWidth = isVertical \? 20 : 28;/, 'const bodyWidth = 26; // 6.6mm width for 0.3" DIP');

fs.writeFileSync('src/components/Meshes3D.tsx', code);
