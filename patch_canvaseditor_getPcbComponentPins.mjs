import fs from 'fs';

let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

// import getPcbComponentPins
content = content.replace(
  /import \{ pinMap, getComponentPins, pcbPinMap \} from "\.\.\/lib\/pinmap";/,
  'import { pinMap, getComponentPins, pcbPinMap, getPcbComponentPins } from "../lib/pinmap";'
);

// Replace mapping logic in handleExportToPcb
// I will just let getPcbComponentPins handle it
// Also need to pass comp to getPcbComponentPins in CanvasEditor
const regexToReplace = /let pins = pcbPinMap\[pcbType\] \|\| \[\];[\s\S]*?(?=          pins\.forEach\()/;
content = content.replace(regexToReplace, 'const pins = getPcbComponentPins({ componentType: pcbType, name: comp.name, customProps: comp.customProps });\n');

// Replace pcbPinMap usage in trace rendering
content = content.replace(
  /const localPins = pcbPinMap\[pcbType\];/g,
  'const localPins = getPcbComponentPins(pcbComp);'
);

// Replace auto pads rendering
content = content.replace(
  /\{\(pcbPinMap\[comp\.componentType\] \|\| \[\]\)\.map/g,
  '{(getPcbComponentPins(comp)).map'
);

// Replace pin map logic for snapping:
content = content.replace(
  /const targetPinMap = activeTool === "trace" \? pcbPinMap : pinMap;/g,
  'const targetPinMap = activeTool === "trace" ? pcbPinMap : pinMap;\n      const getPins = (el) => activeTool === "trace" ? getPcbComponentPins(el) : getComponentPins(el);'
);

content = content.replace(
  /const targetPinMap = isPcb \? pcbPinMap : pinMap;/g,
  'const targetPinMap = isPcb ? pcbPinMap : pinMap;\n      const getPins = (el) => isPcb ? getPcbComponentPins(el) : getComponentPins(el);'
);

// The original map usages:
content = content.replace(
  /const pins = targetPinMap\[comp\.componentType\] \|\| \[\];/g,
  'const pins = getPins(comp);'
);

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched!");
