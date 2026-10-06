const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const t = `             ) : compType === 'ultrasonic' ? (
                <>
                   <mesh position={[0, 0, 0]}><boxGeometry args={[62, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0.1, 0]}><boxGeometry args={[60, 0.2, 30]}/><meshPhysicalMaterial color="#1a1a1a" roughness={0.9} /></mesh>
                </>
             ) : (`;

const r = `             ) : compType === 'ultrasonic' ? (
                <group position={[0, 0, -15]}>
                   <mesh position={[0, 0, 16]}><boxGeometry args={[62, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -16]}><boxGeometry args={[62, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[31, 0, 0]}><boxGeometry args={[1.0, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-31, 0, 0]}><boxGeometry args={[1.0, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>
             ) : (`;

code = code.replace(t, r);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
