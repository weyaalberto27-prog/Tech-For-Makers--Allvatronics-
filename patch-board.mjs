import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

content = content.replace(
  /<group position=\{\[0, -2, 0\]\}>[\s\S]*?\{boardGeom \? \(/m,
  `<group position={[0, 0, 0]}>
                
                {(() => {
                   let lx = boardShape.width / 2 - 55;
                   let lz = boardShape.height / 2 - 40;
                   const st = boardEl?.boardShape || "rect";
                   if (st === "circle") {
                     lx = (boardShape.width / 2 - 65) * Math.cos(Math.PI/4);
                     lz = (boardShape.height / 2 - 55) * Math.sin(Math.PI/4);
                   } else if (st === "triangle") {
                     lx = boardShape.width / 2 - 65;
                     lz = boardShape.height / 2 - 35;
                   }
                   return boardShape.width > 40 && boardShape.height > 40 ? (
                     <Logo3D position={[lx, 0.01, lz]} scale={0.5} />
                   ) : null;
                })()}
                
                {boardGeom ? (`
);

content = content.replace(
  /geometry=\{boardGeom\}\s*rotation=\{\[Math\.PI \/ 2, 0, 0\]\}\s*position=\{\[0, 0\.8, 0\]\}/,
  `geometry={boardGeom}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}`
);

content = content.replace(
  /<mesh receiveShadow castShadow>\s*<boxGeometry\s*args=\{\[boardShape\.width, 1\.6, boardShape\.height\]\}\s*\/>/m,
  `<mesh receiveShadow castShadow position={[0, -0.8, 0]}>
                    <boxGeometry
                      args={[boardShape.width, 1.6, boardShape.height]}
                    />`
);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Patched PCB board Z-height");
