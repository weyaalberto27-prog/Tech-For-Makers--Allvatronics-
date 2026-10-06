const fs = require('fs');

let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

// We need to inject a dynamic pin generator in handleExportToPcb
// In handleExportToPcb:
// const pins = pcbPinMap[pcbType] || [];
const regex = /const pins = pcbPinMap\[pcbType\] \|\| \[\];/;

const replacement = `let pins = pcbPinMap[pcbType] || [];
          
          if (pcbType === "dip8" || pcbType === "sop" || pcbType === "smd") {
            const numPins = comp.customProps?.pins ? parseInt(comp.customProps.pins) : (pcbType === "dip8" && comp.componentType === "ic" ? 14 : 8);
            
            // Re-create the same math as Symbols.tsx
            const isSOP = pcbType === "sop";
            const isSMD = pcbType === "smd" && numPins > 2; // if it's a generic SMD IC
            
            if (numPins > 2 && (pcbType === "dip8" || isSOP || isSMD)) {
                let pinGap = 5;
                if (isSMD) pinGap = 3;
                
                const length = (numPins / 2) * pinGap + pinGap;
                const halfLength = length / 2;
                
                pins = [];
                for (let i = 0; i < numPins / 2; i++) {
                    const px = -halfLength + pinGap * (i + 1);
                    if (isSOP) {
                        pins.push({ x: -15, y: px });
                    } else if (isSMD) {
                        pins.push({ x: px, y: -12 });
                    } else {
                        // dip8
                        pins.push({ x: px, y: -12 });
                    }
                }
                for (let i = 0; i < numPins / 2; i++) {
                    const px = -halfLength + pinGap * (i + 1);
                    if (isSOP) {
                        pins.push({ x: 15, y: px });
                    } else if (isSMD) {
                        pins.push({ x: px, y: 12 });
                    } else {
                        // dip8
                        pins.push({ x: px, y: 12 });
                    }
                }
            }
          }`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("CanvasEditor patched!");
