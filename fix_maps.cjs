const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/          <\/group>\n      \}\)\}/g, '          </group>\n        );\n      })}');
code = code.replace(/        <\/group>\n      \}\)\}/g, '        </group>\n      );\n      })}');
code = code.replace(/           <\/group>\n      \}\)\}/g, '           </group>\n         );\n      })}');

fs.writeFileSync('src/components/Meshes3D.tsx', code);
console.log('Fixed maps');
