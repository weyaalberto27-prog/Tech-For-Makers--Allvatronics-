import fs from 'fs';

let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

// For schematic components
content = content.replace(
  /reading=\{circuitState\.readings\[el\.id\]\}\n\s*customProps=\{\(el as any\)\.customProps\}\n\s*value=\{\(el as any\)\.value\}\n\s*\/>/g,
  'reading={circuitState.readings[el.id]}\n                      customProps={(el as any).customProps}\n            value={(el as any).value}\n            isPCB={false}\n                    />'
);

// For PCB components
content = content.replace(
  /showBody=\{showPcbComponents\}\n\s*reading=\{reading\}\n\s*\/>/g,
  'showBody={showPcbComponents}\n            reading={reading}\n            isPCB={true}\n      />'
);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
