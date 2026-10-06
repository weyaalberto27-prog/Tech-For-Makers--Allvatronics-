import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /if \(pins && pins\.length > 0\) \{[\s\S]*?w = \(maxX - minX\) \+ 20;/;

const newBlock = `if (pins && pins.length > 0) {
                              const xs = pins.map((p: any) => p.x);
                              const ys = pins.map((p: any) => p.y);
                              // Include origin to ensure the symbol's main body is also bounded
                              xs.push(0);
                              ys.push(0);
                              const minX = Math.min(...xs);
                              const maxX = Math.max(...xs);
                              const minY = Math.min(...ys);
                              const maxY = Math.max(...ys);
                              w = (maxX - minX) + 20;`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched PCB silkscreen bounds to include origin");
