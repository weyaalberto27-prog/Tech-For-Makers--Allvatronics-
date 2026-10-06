const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{isPCB && \(\s*<>\s*(?:<mesh[^>]*>[\s\S]*?<\/mesh>\s*)+<\/>\s*\)\}/g, "");
code = code.replace(/<mesh[^>]*>\s*<cylinderGeometry args=\{\[1\.2, 1\.2, 0\.12, 16\]\}\s*\/>[\s\S]*?<\/mesh>/g, "");
code = code.replace(/<mesh[^>]*>\s*<cylinderGeometry args=\{\[0\.5, 0\.5, 0\.12, 16\]\}\s*\/>[\s\S]*?<\/mesh>/g, "");

fs.writeFileSync('src/components/Meshes3D.tsx', code);
