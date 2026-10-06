import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

content = content.replace(
  '<Logo3D position={[0, 0.81, 0]} scale={0.7} />',
  '<Logo3D position={[lx, 0.81, lz]} scale={0.7} />'
);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
