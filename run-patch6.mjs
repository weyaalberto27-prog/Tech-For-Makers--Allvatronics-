import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf8');

content = content.replace(/const pointId = \(x: number, y: number\) => \`\$\{Math\.round\(x \/ 5\) \* 5\},\$\{Math\.round\(y \/ 5\) \* 5\}\`;/g, 'const pointId = (x: number, y: number) => `${Math.round(x / 5) * 5},${Math.round(y / 5) * 5}`;');

fs.writeFileSync('src/lib/simulator.ts', content, 'utf8');
console.log("Successfully replaced pointId.");
