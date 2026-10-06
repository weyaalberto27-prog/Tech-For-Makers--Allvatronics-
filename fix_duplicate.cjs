const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regexToRemove = /case "qfp":\s*case "bga":\s*const size = type === "qfp" \? 40 : 30;[\s\S]*?(?=case "battery_9v":)/;

content = content.replace(regexToRemove, '');
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Duplicate qfp/bga removed!");
