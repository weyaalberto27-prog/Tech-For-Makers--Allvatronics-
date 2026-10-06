const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex2 = /const bodyWidth = isPCB \? 20 : width;/;
content = content.replace(regex2, 'const bodyWidth = isPCB ? (type === "smd" ? 14 : 20) : width;');

const regex3 = /const pinGap = isPCB \? 5 : \(length \/ \(pins \/ 2 \+ 1\)\);/;
content = content.replace(regex3, 'const pinGap = isPCB ? (type === "smd" ? 3 : 5) : (length / (pins / 2 + 1));');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("SMD bodyWidth and pinGap fixed in SOP_IC3D");
