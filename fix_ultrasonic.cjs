const fs = require('fs');
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

pinmap = pinmap.replace(/ultrasonic: \[\{x:-10, y:20\}, \{x:-3\.3, y:20\}, \{x:3\.3, y:20\}, \{x:10, y:20\}\]/, 'ultrasonic: [{x:-15, y:20}, {x:-5, y:20}, {x:5, y:20}, {x:15, y:20}]');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
