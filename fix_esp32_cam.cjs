const fs = require('fs');
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');

pinmap = pinmap.replace(/esp32_cam: \[\.\.\.Array\.from\(\{length: 8\}\)\.map\(\(_, i\) => \(\{x: -76\.8, y: \(-29 \+ i \* 9\.5\) \* 1\.6\}\)\), \.\.\.Array\.from\(\{length: 8\}\)\.map\(\(_, i\) => \(\{x: 76\.8, y: \(-29 \+ i \* 9\.5\) \* 1\.6\}\)\)\],/, 
  'esp32_cam: [...Array.from({length: 8}).map((_, i) => ({x: -19.4, y: (-29 + i * 9.5) * 1.6})), ...Array.from({length: 8}).map((_, i) => ({x: 19.4, y: (-29 + i * 9.5) * 1.6}))],');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
