const fs = require('fs');
let code = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

code = code.replace(/  accelerometer_pcb: \[\{x:-35,y:0\}, \{x:-25,y:0\}, \{x:-15,y:0\}, \{x:-5,y:0\}, \{x:5,y:0\}, \{x:15,y:0\}, \{x:25,y:0\}, \{x:35,y:0\}\],\n/g, "");

fs.writeFileSync('src/lib/pinmap.ts', code);
