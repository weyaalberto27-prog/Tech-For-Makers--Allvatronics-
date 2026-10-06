import fs from 'fs';
let content = fs.readFileSync('src/components/PropertiesPanel.tsx', 'utf-8');

const transformHelper = `  const isPcbComponent = selectedElement.type === "pcb_component";
  
  const handleTransformChange = (comp, updates) => {
    if (mode === "pcb" && comp.type === "pcb_component" && comp.componentType !== "pad") {
       const updatesArray = [{ id: comp.id, updates }];
       const newX = updates.x !== undefined ? updates.x : comp.x;
       const newY = updates.y !== undefined ? updates.y : comp.y;
       const newRot = updates.rotation !== undefined ? updates.rotation : comp.rotation;
       
       const oldX = comp.x;
       const oldY = comp.y;
       const oldRot = comp.rotation || 0;
       
       const deltaRot = newRot - oldRot;
       const rad = deltaRot * (Math.PI / 180);
       const cos = Math.cos(rad);
       const sin = Math.sin(rad);

       pcbElements.forEach(p => {
          if (p.type === "pcb_component" && p.customProps?.parentId === comp.id) {
             const px = p.x - oldX;
             const py = p.y - oldY;
             const rotatedPx = px * cos - py * sin;
             const rotatedPy = px * sin + py * cos;
             
             const dx = newX - oldX;
             const dy = newY - oldY;
             
             updatesArray.push({ id: p.id, updates: { x: oldX + rotatedPx + dx, y: oldY + rotatedPy + dy } });
          }
       });
       updateElements(updatesArray);
    } else {
       updateElement(comp.id, updates);
    }
  };`;

content = content.replace(/const isPcbComponent = selectedElement\.type === "pcb_component";/, transformHelper);

fs.writeFileSync('src/components/PropertiesPanel.tsx', content);
console.log("Fixed handleTransformChange");
