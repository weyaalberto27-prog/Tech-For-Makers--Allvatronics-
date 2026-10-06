const fs = require('fs');
let code = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

code = code.replace(/  sot23: \[\{x:-10, y:-10\}, \{x:-10, y:10\}, \{x:10, y:0\}\],\n  sot23: \[\{x:-10, y:-10\}, \{x:-10, y:10\}, \{x:10, y:0\}\],/g, "  sot23: [{x:-10, y:-10}, {x:-10, y:10}, {x:10, y:0}],");
fs.writeFileSync('src/lib/pinmap.ts', code);
