const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

content = content.replace(/<mesh\s+castShadow\s+receiveShadowPhysicalMaterial/g, '<meshPhysicalMaterial');
content = content.replace(/<mesh\s+castShadow\s+receiveShadowBasicMaterial/g, '<meshBasicMaterial');
content = content.replace(/<mesh\s+receiveShadowPhysicalMaterial/g, '<meshPhysicalMaterial');
content = content.replace(/<mesh\s+receiveShadowBasicMaterial/g, '<meshBasicMaterial');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Materials patched!");
