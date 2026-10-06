import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const oldExtrude = `    const extrudeSettings = {
      depth: 1.6,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.2,
      bevelThickness: 0.2,
    };`;

const newExtrude = `    const extrudeSettings = {
      depth: 1.6,
      bevelEnabled: false
    };`;

content = content.replace(oldExtrude, newExtrude);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
