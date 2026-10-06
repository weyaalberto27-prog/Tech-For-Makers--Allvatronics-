const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const t = `{compType === 'capacitor_elec' || compType === 'led' ? (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[6.5, 7.5, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : (`;

const r = `{compType === 'capacitor_elec' || compType === 'led' ? (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[6.5, 7.5, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : compType === 'cr2032' ? (
                <mesh position={[0, 0, 20]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[20, 21, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : compType === 'ultrasonic' ? (
                <>
                   <mesh position={[0, 0, 0]}><boxGeometry args={[62, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0.1, 0]}><boxGeometry args={[60, 0.2, 30]}/><meshPhysicalMaterial color="#1a1a1a" roughness={0.9} /></mesh>
                </>
             ) : (`;

code = code.replace(t, r);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
