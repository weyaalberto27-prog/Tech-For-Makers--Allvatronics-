import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const oldWheel = `             updateElements(updates);
          } else {
             updateElement(id, { rotation: rot });
          }`;

const newWheel = `             updateElements(updates);
             setTimeout(() => {
                 const currentPcbElements = pcbElements.map((p) => {
                     const u = updates.find((up) => up.id === p.id);
                     return u ? { ...p, ...u.updates } as any : p;
                 });
                 doAutoRoute(elements, currentPcbElements, setPcbElements, pinMap, astarRoute, uuidv4);
             }, 50);
          } else {
             updateElement(id, { rotation: rot });
          }`;

content = content.replace(oldWheel, newWheel);
fs.writeFileSync('src/components/CanvasEditor.tsx', content);
