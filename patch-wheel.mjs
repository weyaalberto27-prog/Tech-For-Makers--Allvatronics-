import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const oldWheel = `        if (el && "rotation" in el) {
          let rot = ((el as any).rotation || 0) + (e.evt.deltaY > 0 ? 15 : -15);
          if (!e.evt.shiftKey) rot = Math.round(rot / 90) * 90;
          updateElement(id, { rotation: rot });
        }`;

const newWheel = `        if (el && "rotation" in el) {
          let rot = ((el as any).rotation || 0) + (e.evt.deltaY > 0 ? 15 : -15);
          if (!e.evt.shiftKey) rot = Math.round(rot / 90) * 90;
          
          if (mode === "pcb") {
             const cx = (el as any).x;
             const cy = (el as any).y;
             const deltaRot = rot - ((el as any).rotation || 0);
             const rad = deltaRot * (Math.PI / 180);
             const cos = Math.cos(rad);
             const sin = Math.sin(rad);
             
             const updates: any[] = [{ id, updates: { rotation: rot } }];
             pcbElements.forEach((p) => {
                 if (p.type === "pcb_component" && (p as any).customProps?.parentId === id) {
                     const px = (p as any).x - cx;
                     const py = (p as any).y - cy;
                     const newX = cx + px * cos - py * sin;
                     const newY = cy + px * sin + py * cos;
                     updates.push({ id: p.id, updates: { x: newX, y: newY } });
                 }
             });
             updateElements(updates);
          } else {
             updateElement(id, { rotation: rot });
          }
        }`;

content = content.replace(oldWheel, newWheel);
fs.writeFileSync('src/components/CanvasEditor.tsx', content);
