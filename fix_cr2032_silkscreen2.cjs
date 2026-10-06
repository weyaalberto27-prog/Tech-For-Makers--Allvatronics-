const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const t = `<ringGeometry args={[11, 12, 32]} />`;
const r = `<ringGeometry args={[24, 25, 32]} />`;

code = code.replace(t, r);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
