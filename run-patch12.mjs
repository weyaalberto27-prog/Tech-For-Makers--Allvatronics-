import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');
content = content.replace(
  'const pts = mode === "pcb" ? astarRoute(wiring.start!, wiring.current!, obs as any, 5) : getOrthogonalPoints(wiring.start!, wiring.current!, obs, wireDirection);',
  'const pts = mode === "pcb" ? (smartWiring ? astarRoute(wiring.start!, wiring.current!, obs as any, 5) : get45DegreePoints(wiring.start!, wiring.current!, wireDirection)) : getOrthogonalPoints(wiring.start!, wiring.current!, obs, wireDirection);'
);
fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched preview trace rendering");
