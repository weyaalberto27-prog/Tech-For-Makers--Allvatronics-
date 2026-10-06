import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');
content = content.replace(
  'return boardShape.width > 30 && boardShape.height > 30 ? (\\n                     <Logo3D position={[lx, 0.8, lz]} scale={0.7} />\\n                   ) : null;',
  'return <Logo3D position={[0, 0.85, 0]} scale={1} />;'
);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
