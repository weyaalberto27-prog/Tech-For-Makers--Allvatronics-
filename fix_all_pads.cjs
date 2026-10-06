const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/position=\{\[(-?15|0), -3\.15, (0|-?15|15)\]\}/g, "position={[$1, -1.45, $2]}");
code = code.replace(/position=\{\[(-?5), -3\.15, 0\]\}/g, "position={[$1, -1.45, 0]}");
code = code.replace(/position=\{\[(-?3), -3\.15, 0\]\}/g, "position={[$1, -1.45, 0]}");
code = code.replace(/position=\{\[(-?5), -1\.65, (-?5)\]\}/g, "position={[$1, 0.05, $2]}");
code = code.replace(/position=\{\[(-?10|0), -1\.65, 0\]\}/g, "position={[$1, 0.05, 0]}");
code = code.replace(/position=\{\[xPos, -1\.65, -15\]\}/g, "position={[xPos, 0.05, -15]}");
code = code.replace(/position=\{\[xPos, -1\.65, 15\]\}/g, "position={[xPos, 0.05, 15]}");
code = code.replace(/position=\{\[xPos, -1\.65, 0\]\}/g, "position={[xPos, 0.05, 0]}");
code = code.replace(/position=\{\[0, -1\.65, 0\]\}/g, "position={[0, 0.05, 0]}");
code = code.replace(/position=\{\[0, -1\.65, 1\]\}/g, "position={[0, 0.05, 1]}");

fs.writeFileSync('src/components/Meshes3D.tsx', code);
