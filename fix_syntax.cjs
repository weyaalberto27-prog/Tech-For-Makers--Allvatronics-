const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// The error is around line 438:
//               </mesh>
//            </group>
//   );
//          );
//       })}

code = code.replace(/           <\/group>\n  \);\n         \);\n      \}\)\}\n    <\/group>\n  \);\n\}\)\}\n    <\/group>\n  \);\n\}/g, `           </group>\n         );\n      })}\n    </group>\n  );\n}`);

code = code.replace(/           <\/group>\n         \);\n      \}\)\}\n    <\/group>\n  \);\n\}\)\}\n    <\/group>\n  \);\n\}/g, `           </group>\n         );\n      })}\n    </group>\n  );\n}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
console.log('Fixed syntax');
