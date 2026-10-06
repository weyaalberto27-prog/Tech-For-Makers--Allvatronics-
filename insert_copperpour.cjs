const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

const hook = `                           }[(board as any).boardColor as string] || (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)"))
                           : (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)")}
                        lineJoin="round"
                      />
                    )}`;

const replacement = hook + `
                    
                    {/* Render copper pours here */}
                    {mode === "pcb" && pcbElements.filter((p: any) => p.type === 'pcb_component' && p.componentType === 'copper_pour').map((cp: any) => (
                       <CopperPourGroup 
                           key={"cp_" + cp.id} 
                           board={board} 
                           pcbElements={pcbElements} 
                           activePcbLayer={activePcbLayer}
                           copperPourElement={cp}
                       />
                    ))}
`;

content = content.replace(hook, replacement);
fs.writeFileSync("src/components/CanvasEditor.tsx", content);
