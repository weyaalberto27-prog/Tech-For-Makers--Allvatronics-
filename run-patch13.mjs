import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const target1 = `                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                          const newPts = [...trace.points];
                          newPts[i] = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                          updateElement(el.id, { points: newPts });
                        }}`;

const replacement1 = `                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                          const newPts = [...trace.points];
                          const targetPt = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                          if (i === 0) {
                             if (newPts.length > 1) {
                                const pts = get45DegreePoints(targetPt, newPts[1]);
                                newPts.splice(0, 2, ...pts);
                             } else {
                                newPts[0] = targetPt;
                             }
                          } else if (i === trace.points.length - 1) {
                             const pts = get45DegreePoints(newPts[i-1], targetPt);
                             newPts.splice(i-1, 2, ...pts);
                          } else {
                             const pts1 = get45DegreePoints(newPts[i-1], targetPt);
                             const pts2 = get45DegreePoints(targetPt, newPts[i+1]);
                             newPts.splice(i-1, 3, ...pts1, ...pts2.slice(1));
                          }
                          updateElement(el.id, { points: newPts });
                        }}`;

const target2 = `                           onDragEnd={(e) => {
                             e.cancelBubble = true;
                             const newPts = [...trace.points];
                             newPts.splice(i + 1, 0, { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) });
                             updateElement(el.id, { points: newPts });
                           }}`;

const replacement2 = `                           onDragEnd={(e) => {
                             e.cancelBubble = true;
                             const newPts = [...trace.points];
                             const targetPt = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                             const pts1 = get45DegreePoints(newPts[i], targetPt);
                             const pts2 = get45DegreePoints(targetPt, newPts[i+1]);
                             newPts.splice(i, 2, ...pts1, ...pts2.slice(1));
                             updateElement(el.id, { points: newPts });
                           }}`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);
fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched trace handles to use 45-degree points");
