import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

content = content.replace(
  'else if (comp.componentType === "battery" || comp.componentType === "cr2032") pcbType = "cr2032";',
  'else if (comp.componentType === "battery") pcbType = "battery_9v";\n          else if (comp.componentType === "cr2032") pcbType = "cr2032";'
);

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
