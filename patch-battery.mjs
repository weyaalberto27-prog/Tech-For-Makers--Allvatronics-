import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

content = content.replace(/comp\.componentType === "battery" \|\| comp\.componentType === "cr2032" \|\|/g, 'comp.componentType === "battery" || comp.componentType === "battery_9v" || comp.componentType === "cr2032" ||');
content = content.replace(/comp\.componentType === "battery"\s+\?\s+"9"/g, 'comp.componentType === "battery" || comp.componentType === "battery_9v" ? "9"');
content = content.replace(/if \(comp\.componentType === "battery"\) \{/g, 'if (comp.componentType === "battery" || comp.componentType === "battery_9v") {');

fs.writeFileSync('src/lib/simulator.ts', content);
