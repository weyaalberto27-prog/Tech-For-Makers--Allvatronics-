const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

code = code.replace(/\{mode === "pcb" && compType !== "pad" && compType !== "via" && pins.map/g, "{compType !== \"pad\" && compType !== \"via\" && pins.map");

fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
