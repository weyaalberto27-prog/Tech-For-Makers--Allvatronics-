import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /x: pcbX,\s*y: pcbY,\s*rotation: 0,\s*name: "",/g;
const newCode = `x: pcbX,
            y: pcbY,
            rotation: comp.rotation || 0,
            name: comp.name || "",`;

content = content.replace(regex, newCode);

const padRegex = /x: pcbX \+ pin\.x,\s*y: pcbY \+ pin\.y,\s*rotation: 0,/g;
const newPadCode = `x: pcbX + pin.x * Math.cos((comp.rotation || 0) * Math.PI / 180) - pin.y * Math.sin((comp.rotation || 0) * Math.PI / 180),
              y: pcbY + pin.x * Math.sin((comp.rotation || 0) * Math.PI / 180) + pin.y * Math.cos((comp.rotation || 0) * Math.PI / 180),
              rotation: comp.rotation || 0,`;

content = content.replace(padRegex, newPadCode);

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched export to PCB to preserve rotation and name");
