import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

content = content.replace(
  /let yOffset = trace\.layer === "bottom" \? -1\.95 : -0\.05;/,
  `let yOffset = trace.layer === "bottom" ? -1.62 : 0.02;`
);

// Also fix components at bottom layer to be at -1.6, not -1.95
content = content.replace(
  /position=\{\[cx, \(el as any\)\.layer === "bottom" \? -1\.95 : 0, cz\]\}/,
  `position={[cx, (el as any).layer === "bottom" ? -1.6 : 0, cz]}`
);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Patched PCB traces and components Z-height");
