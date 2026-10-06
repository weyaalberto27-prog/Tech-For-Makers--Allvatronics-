import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const target = `                    {/* Auto Pads for PCB */}
                    {(pcbPinMap[comp.componentType] || []).map((p, idx) => {
                      // Apply component rotation to pad position
                      const rad = (comp.rotation * Math.PI) / 180;
                      const rotatedX = p.x * Math.cos(rad) - p.y * Math.sin(rad);
                      const rotatedY = p.x * Math.sin(rad) + p.y * Math.cos(rad);
                      return (
                        <Circle
                          key={\`pad-\${idx}\`}
                          x={rotatedX}
                          y={rotatedY}
                          radius={3}
                          fill={isSelected ? "#a78bfa" : "#e2e8f0"}
                          stroke={isSelected ? "#8b5cf6" : "#94a3b8"}
                          strokeWidth={1.5}
                        />
                      );
                    })}`;

const replacement = `                    {/* Auto Pads for PCB */}
                    {(pcbPinMap[comp.componentType] || []).map((p, idx) => (
                      <Circle
                        key={\`pad-\${idx}\`}
                        x={p.x}
                        y={p.y}
                        radius={2.5}
                        fill={isSelected ? "#a78bfa" : "#94a3b8"}
                        stroke="#1e293b"
                        strokeWidth={1.5}
                      />
                    ))}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/CanvasEditor.tsx', content, 'utf8');
console.log("Patched Auto Pads in PCB");
