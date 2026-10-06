const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

const oldCode = `
          if (wiring.start && wiring.current) {
            const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obs as any, 5) : get45DegreePoints(wiring.start, wiring.current);
`;

const newCode = `
          if (wiring.start && wiring.current) {
            const obstaclesList = (() => {
               const comps = pcbElements.filter(el => el.type === "pcb_component").map(c => ({
                  x: (c as any).x, y: (c as any).y, width: 20, height: 20
               }));
               const traceLines = [];
               pcbElements.filter(el => el.type === "trace" && (el as any).layer === activePcbLayer).forEach(t => {
                  const tracePts = (t as any).points;
                  if (tracePts && tracePts.length > 1) {
                     for (let i = 0; i < tracePts.length - 1; i++) {
                        traceLines.push({ p1: tracePts[i], p2: tracePts[i+1] });
                     }
                  }
               });
               (comps as any).traceLines = traceLines;
               return comps;
            })();
            const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5) : get45DegreePoints(wiring.start, wiring.current);
`;

content = content.replace(oldCode, newCode);
fs.writeFileSync("src/components/CanvasEditor.tsx", content);
