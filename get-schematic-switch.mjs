import fs from 'fs';
const content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');
const match = content.match(/switch \(comp\.componentType\) \{\s*case "resistor":[\s\S]*?default:\s*SymbolView = GroundSymbol;\s*\}/);
if (match) {
    fs.writeFileSync('schematic-switch.txt', match[0]);
    console.log("Found");
} else {
    console.log("Not found");
}
