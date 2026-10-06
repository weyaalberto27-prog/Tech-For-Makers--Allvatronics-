import fs from 'fs';
let content = fs.readFileSync('src/lib/astar.ts', 'utf8');

content = content.replace(
  'gridSize: number = 5\n): Point[] {',
  'gridSize: number = 5,\n  routingMode: "orthogonal" | "pcb" = "pcb"\n): Point[] {'
);

fs.writeFileSync('src/lib/astar.ts', content, 'utf8');
console.log("Patched astar routing mode parameter");
