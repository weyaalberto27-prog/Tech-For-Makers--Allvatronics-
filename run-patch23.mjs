import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const targetTraces = `                  const traceColor = traceType === "silver" ? "#e5e7eb" : traceType === "gold" ? "#fbbf24" : "#b45309"; // Copper or solder color

                  // Offset Y precisely to avoid z-fighting with the board or other traces
                  const safeId = el.id || "";
                  const stableRandom =
                    ((safeId.charCodeAt(0) || 0) +
                      (safeId.charCodeAt(safeId.length - 1) || 0)) /
                    1000;
                  const yOffset = isTop
                    ? -1.18 + stableRandom
                    : -2.82 - stableRandom;

                  // Better material properties for professional PCB traces (shiny copper/gold or tin)
                  const materialProps = {
                    color: traceColor,
                    metalness: 0.9,
                    roughness: 0.2,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2,
                  };

                  return (
                    <group key={el.id} position={[0, 0, 0]}>
                      {(pts || []).map((p, i) => {
                        const width = Number(el.width) || 4;
                        const cx = (Number(p.x) || 0) - boardShape.center.x;
                        const cz = (Number(p.y) || 0) - boardShape.center.y;

                        let lineMesh = null;
                        if (i > 0) {
                          const prev = pts[i - 1];
                          const px = Number(p.x) || 0;
                          const py = Number(p.y) || 0;
                          const prevX = Number(prev.x) || 0;
                          const prevY = Number(prev.y) || 0;
                          const dx = px - prevX;
                          const dz = py - prevY;
                          const dist = Math.sqrt(dx * dx + dz * dz) || 0.1;
                          const angle = Math.atan2(dz, dx);
                          const midX = prevX + dx / 2 - boardShape.center.x;
                          const midZ = prevY + dz / 2 - boardShape.center.y;

                          lineMesh = (
                            <mesh
                              position={[midX, yOffset, midZ]}
                              rotation={[0, -angle, 0]}
                            >
                              <boxGeometry args={[dist, 0.05, width]} />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          );
                        }

                        return (
                          <group key={i}>
                            {lineMesh}
                            <mesh position={[cx, yOffset, cz]}>
                              <cylinderGeometry
                                args={[width / 2, width / 2, 0.05, 12]}
                              />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          </group>
                        );
                      })}`;

const replacementTraces = `                  const traceColor = traceType === "silver" ? "#d1d5db" : traceType === "gold" ? "#fbbf24" : "#b45309"; // Copper or solder color

                  // Offset Y precisely to avoid z-fighting with the board or other traces
                  const safeId = el.id || "";
                  const stableRandom =
                    ((safeId.charCodeAt(0) || 0) +
                      (safeId.charCodeAt(safeId.length - 1) || 0)) /
                    10000; // Even smaller random to avoid visible height differences
                  
                  const traceHeight = 0.02; // Thinner, more realistic traces
                  const yOffset = isTop
                    ? -1.2 + (traceHeight/2) + stableRandom
                    : -2.8 - (traceHeight/2) - stableRandom;

                  // Better material properties for professional PCB traces (shiny copper/gold or tin)
                  const materialProps = {
                    color: traceColor,
                    metalness: traceType === "silver" ? 0.8 : 1.0,
                    roughness: traceType === "silver" ? 0.4 : 0.2,
                    clearcoat: 0.8, // Solder mask clear coat effect over traces
                    clearcoatRoughness: 0.1,
                  };

                  return (
                    <group key={el.id} position={[0, 0, 0]}>
                      {(pts || []).map((p, i) => {
                        const width = Number(el.width) || 4;
                        const cx = (Number(p.x) || 0) - boardShape.center.x;
                        const cz = (Number(p.y) || 0) - boardShape.center.y;

                        let lineMesh = null;
                        if (i > 0) {
                          const prev = pts[i - 1];
                          const px = Number(p.x) || 0;
                          const py = Number(p.y) || 0;
                          const prevX = Number(prev.x) || 0;
                          const prevY = Number(prev.y) || 0;
                          const dx = px - prevX;
                          const dz = py - prevY;
                          const dist = Math.sqrt(dx * dx + dz * dz) || 0.1;
                          const angle = Math.atan2(dz, dx);
                          const midX = prevX + dx / 2 - boardShape.center.x;
                          const midZ = prevY + dz / 2 - boardShape.center.y;

                          lineMesh = (
                            <mesh
                              position={[midX, yOffset, midZ]}
                              rotation={[0, -angle, 0]}
                            >
                              <boxGeometry args={[dist, traceHeight, width]} />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          );
                        }

                        return (
                          <group key={i}>
                            {lineMesh}
                            <mesh position={[cx, yOffset, cz]}>
                              <cylinderGeometry
                                args={[width / 2, width / 2, traceHeight, 16]}
                              />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          </group>
                        );
                      })}`;

content = content.replace(targetTraces, replacementTraces);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content, 'utf8');
console.log("Patched traces");
