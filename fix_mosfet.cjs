const fs = require('fs');
let code = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

code = code.replace(/  mosfet: \[\{x:-10, y:0\}, \{x:0, y:0\}, \{x:10, y:0\}\],\n/g, "");
code = code.replace(/  mosfet_p: \[\{x:-10, y:0\}, \{x:0, y:0\}, \{x:10, y:0\}\],\n/g, "");

fs.writeFileSync('src/lib/pinmap.ts', code);
