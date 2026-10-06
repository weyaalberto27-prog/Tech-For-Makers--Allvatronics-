const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/    <\/group>\n  \);function SOP_IC3D/g, '    </group>\n  );\n}\nfunction SOP_IC3D');
fs.writeFileSync('src/components/Meshes3D.tsx', code);
