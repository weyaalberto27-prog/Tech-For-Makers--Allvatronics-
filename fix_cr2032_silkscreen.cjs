const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const t = `) : compType === 'cr2032' ? (
                <mesh position={[0, 0, 20]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[20, 21, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>`;

const r = `) : compType === 'cr2032' ? (
                <group position={[0, 0, -20]}>
                   <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                      <ringGeometry args={[11, 12, 32]} />
                      <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                   </mesh>
                </group>`;

code = code.replace(t, r);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
