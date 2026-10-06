import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const oldLogic = `                {(() => {
                   let lx = boardShape.width / 2 - 35;
                   let lz = boardShape.height / 2 - 35;
                   const st = boardEl?.boardShape || "rect";
                   if (st === "circle") {
                     lx = (boardShape.width / 2 - 45) * Math.cos(Math.PI/4);
                     lz = (boardShape.height / 2 - 45) * Math.sin(Math.PI/4);
                   } else if (st === "triangle") {
                     lx = boardShape.width / 2 - 50;
                     lz = boardShape.height / 2 - 35;
                   }
                   return boardShape.width > 30 && boardShape.height > 30 ? (
                     <Logo3D position={[lx, 0.81, lz]} scale={0.5} />
                   ) : null;
                })()}`;

const newLogic = `                {(() => {
                   let lx = boardShape.width / 2 - 55;
                   let lz = boardShape.height / 2 - 55;
                   const st = boardEl?.boardShape || "rect";
                   if (st === "circle") {
                     lx = (boardShape.width / 2 - 55) * Math.cos(Math.PI/4);
                     lz = (boardShape.height / 2 - 55) * Math.sin(Math.PI/4);
                   } else if (st === "triangle") {
                     lx = boardShape.width / 2 - 60;
                     lz = boardShape.height / 2 - 45;
                   }
                   return boardShape.width > 30 && boardShape.height > 30 ? (
                     <Logo3D position={[lx, 0.81, lz]} scale={0.6} />
                   ) : null;
                })()}`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
