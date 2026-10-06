import fs from 'fs';
let content = fs.readFileSync('src/lib/astar.ts', 'utf8');

content = content.replace(
  'return simplifyPath(fallbackOrthogonal(start, end));',
  'return simplifyPath(fallback45Degree(start, end));'
);

const newFallback = `function fallback45Degree(p1: Point, p2: Point): Point[] {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const signX = p2.x > p1.x ? 1 : -1;
  const signY = p2.y > p1.y ? 1 : -1;
  if (dx > dy) {
    return [p1, { x: p1.x + dy * signX, y: p2.y }, p2];
  } else {
    return [p1, { x: p2.x, y: p1.y + dx * signY }, p2];
  }
}
function fallbackOrthogonal(p1: Point, p2: Point): Point[] {`;

content = content.replace('function fallbackOrthogonal(p1: Point, p2: Point): Point[] {', newFallback);
fs.writeFileSync('src/lib/astar.ts', content, 'utf8');
console.log("Patched fallback");
