const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.split('    </group>\n  );\n').join('    </group>\n');
fs.writeFileSync('src/components/Meshes3D.tsx', code);
console.log('Fixed groups');
