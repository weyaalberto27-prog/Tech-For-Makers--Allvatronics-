const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /const pinDist = isPCB \? 15 : \(width \/ 2 \+ 1\);/;
content = content.replace(regex, 'const pinDist = isPCB ? (type === "smd" ? 12 : 15) : (width / 2 + 1);');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("SMD pinDist fixed in SOP_IC3D");
