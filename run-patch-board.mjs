import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const targetBoardMat1 = `                    <meshPhysicalMaterial 
                      color={
                        (boardEl?.boardColor || "green") === "green" ? "#061c0b" :
                        boardEl?.boardColor === "red" ? "#7f1d1d" :
                        boardEl?.boardColor === "blue" ? "#1e3a8a" :
                        boardEl?.boardColor === "black" ? "#171717" :
                        boardEl?.boardColor === "white" ? "#e5e5e5" :
                        boardEl?.boardColor === "purple" ? "#4c1d95" : "#061c0b"
                      }
                      roughness={0.7} 
                      metalness={0.1} 
                      clearcoat={0.3} 
                      clearcoatRoughness={0.6} 
                    />`;

const replaceBoardMat1 = `                    <meshPhysicalMaterial 
                      color={
                        (boardEl?.boardColor || "green") === "green" ? "#0f4225" :
                        boardEl?.boardColor === "red" ? "#611111" :
                        boardEl?.boardColor === "blue" ? "#0f235e" :
                        boardEl?.boardColor === "black" ? "#1a1a1a" :
                        boardEl?.boardColor === "white" ? "#d4d4d4" :
                        boardEl?.boardColor === "purple" ? "#331366" : "#0f4225"
                      }
                      roughness={0.4} 
                      metalness={0.2} 
                      clearcoat={0.8} 
                      clearcoatRoughness={0.2} 
                    />`;

content = content.replaceAll(targetBoardMat1, replaceBoardMat1);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content, 'utf8');
console.log("Patched board material");
