const fs = require('fs');
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

const replacement = `  thermistor: [{x:-5, y:0}, {x:5, y:0}],
  photoresistor: [{x:-5, y:0}, {x:5, y:0}],
  relay: [{x: -6, y: -6}, {x: -6, y: 0}, {x: -6, y: 6}, {x: 6, y: -6}, {x: 6, y: 6}],
};`;

pinmap = pinmap.replace(/  thermistor: \[\{x:-5, y:0\}, \{x:5, y:0\}\],\n  photoresistor: \[\{x:-5, y:0\}, \{x:5, y:0\}\],\n\};/, replacement);

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
