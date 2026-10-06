import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf8');
content = content.replace(
  `} else if (comp.componentType === "lamp") {
            // Lamp only works with AC
            if (hasACConnected && Math.abs(vDiff) >= 1.0) {
              active.add(comp.id);
            }
          }`,
  `} else if (comp.componentType === "lamp") {
            const nominalV = parseValue(comp.value, 12);
            if (Math.abs(vDiff) > nominalV * 1.5) {
              readings[comp.id] = "BROKEN!";
            } else if (Math.abs(vDiff) >= nominalV * 0.2) {
              active.add(comp.id);
            }
          }`
);
fs.writeFileSync('src/lib/simulator.ts', content, 'utf8');
