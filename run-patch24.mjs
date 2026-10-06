import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const targetLogoPl = `                     <Logo3D position={[lx, 1.7, lz]} scale={0.7} />`;
const replaceLogoPl = `                     <Logo3D position={[lx, 0.8, lz]} scale={0.7} />`;

content = content.replace(targetLogoPl, replaceLogoPl);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content, 'utf8');
console.log("Patched Logo3D placement");
