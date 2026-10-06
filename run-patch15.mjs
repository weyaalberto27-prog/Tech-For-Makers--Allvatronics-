import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const target1 = `const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5) : get45DegreePoints(wiring.start, wiring.current, wireDirection);`;
const replacement1 = `const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5) : get45DegreePoints(wiring.start, wiring.current, wireDirection);`; // Actually it's already using 45DegreePoints when smartWiring is false.

fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("No extra patch needed");
