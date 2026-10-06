const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Also remove `length = length * 1.3; width = width * 1.3;` from IC_SMD and SOP_IC3D
code = code.replace(/length = length \* 1\.3;\s*width = width \* 1\.3;/g, '');

fs.writeFileSync('src/components/Meshes3D.tsx', code);
