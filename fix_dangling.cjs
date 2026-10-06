const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const trailingRegex = /return \(\s*<group position=\{\[25, 4, 0\]\}>[\s\S]*?<\/group>\s*\);/g;

content = content.replace(trailingRegex, '');
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Dangling block fixed");
