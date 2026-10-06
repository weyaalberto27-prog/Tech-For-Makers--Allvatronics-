import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const target = `function get45DegreePoints(p1: Point, p2: Point, direction: "auto" | "h-first" | "v-first" = "auto"): Point[] {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  if (dx < 5 || dy < 5 || Math.abs(dx - dy) < 5) {
    return [p1, p2];
  }

  const signX = p2.x > p1.x ? 1 : -1;
  const signY = p2.y > p1.y ? 1 : -1;

  if (direction === "h-first") {
    return [p1, { x: p1.x + dy * signX, y: p2.y }, p2];
  } else if (direction === "v-first") {
    return [p1, { x: p2.x, y: p1.y + dx * signY }, p2];
  }

  if (dx > dy) {
    return [p1, { x: p1.x + dy * signX, y: p2.y }, p2];
  } else {
    return [p1, { x: p2.x, y: p1.y + dx * signY }, p2];
  }
}`;

const replacement = `function get45DegreePoints(p1: Point, p2: Point, direction: "auto" | "h-first" | "v-first" = "auto"): Point[] {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  if (dx < 5 || dy < 5 || Math.abs(dx - dy) < 5) {
    return [p1, p2];
  }

  const signX = p2.x > p1.x ? 1 : -1;
  const signY = p2.y > p1.y ? 1 : -1;

  // Option 1: 45 degree first, then orthogonal
  const opt1 = dx > dy ? { x: p1.x + dy * signX, y: p2.y } : { x: p2.x, y: p1.y + dx * signY };
  // Option 2: orthogonal first, then 45 degree
  const opt2 = dx > dy ? { x: p2.x - dy * signX, y: p1.y } : { x: p1.x, y: p2.y - dx * signY };

  if (direction === "h-first") {
    return [p1, opt1, p2];
  } else if (direction === "v-first") {
    return [p1, opt2, p2];
  }

  return [p1, opt1, p2];
}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched get45DegreePoints in CanvasEditor");
