import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /x: pcbX,\s*y: pcbY,\s*rotation: 0,\s*name: comp\.name,/g;
const newCode = `x: pcbX,
            y: pcbY,
            rotation: comp.rotation || 0,
            name: comp.name,`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched export to PCB main component rotation");
