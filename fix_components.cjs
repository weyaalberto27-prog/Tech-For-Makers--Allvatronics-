const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');
code = code.replace(/<meshPhysicalMaterial color="#94a3b8" \/>/g, '<meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />');
fs.writeFileSync('src/components/Meshes3D.tsx', code);
