import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

content = content.replace(
  'return astarRoute(p1, p2, obstacles, 10);',
  'return astarRoute(p1, p2, obstacles, 10, "orthogonal");'
);

content = content.replace(
  'const pts = astarRoute(p1, p2, obstacles, 5);',
  'const pts = astarRoute(p1, p2, obstacles, 5, "pcb");'
);

content = content.replace(
  'const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5) : get45DegreePoints(wiring.start, wiring.current, wireDirection);',
  'const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5, "pcb") : get45DegreePoints(wiring.start, wiring.current, wireDirection);'
);

content = content.replace(
  'const pts = mode === "pcb" ? (smartWiring ? astarRoute(wiring.start!, wiring.current!, obs as any, 5) : get45DegreePoints(wiring.start!, wiring.current!, wireDirection)) : getOrthogonalPoints(wiring.start!, wiring.current!, obs, wireDirection);',
  'const pts = mode === "pcb" ? (smartWiring ? astarRoute(wiring.start!, wiring.current!, obs as any, 5, "pcb") : get45DegreePoints(wiring.start!, wiring.current!, wireDirection)) : getOrthogonalPoints(wiring.start!, wiring.current!, obs, wireDirection);'
);

fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched CanvasEditor astarRoute calls");
