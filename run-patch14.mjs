import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const simplifyTracePathFn = `function simplifyTracePath(path: Point[]): Point[] {
   if (path.length <= 2) return path;
   let simplified = [path[0]];
   for (let i = 1; i < path.length - 1; i++) {
      let prev = path[i-1];
      let curr = path[i];
      let next = path[i+1];
      let dx1 = curr.x - prev.x;
      let dy1 = curr.y - prev.y;
      let dx2 = next.x - curr.x;
      let dy2 = next.y - curr.y;
      if (dx1 * dy2 !== dx2 * dy1) {
         simplified.push(curr);
      }
   }
   simplified.push(path[path.length-1]);
   return simplified;
}

export const calculateNets`;

content = content.replace('export const calculateNets', simplifyTracePathFn);

content = content.replace('updateElement(el.id, { points: newPts });', 'updateElement(el.id, { points: simplifyTracePath(newPts) });');
content = content.replace('updateElement(el.id, { points: newPts });', 'updateElement(el.id, { points: simplifyTracePath(newPts) });');

fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched trace handles with simplifyTracePath");
