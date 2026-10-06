import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const regex = /case "capacitor_elec":[\s\S]*?case "inductor":/;

const newBlock = `case "capacitor_elec":
        return (
          <group position={[0, 6, 30]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-10, -5, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -5, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Body */}
            <mesh castShadow receiveShadow position={[0, 5, 0]}>
              <cylinderGeometry args={[12, 12, 20, 32]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.4} clearcoat={0.5} />
            </mesh>
            {/* Top Metal Cap */}
            <mesh castShadow receiveShadow position={[0, 15, 0]}>
              <cylinderGeometry args={[12, 12, 0.5, 32]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Top cross indent */}
            <mesh castShadow receiveShadow position={[0, 15.25, 0]}>
              <boxGeometry args={[18, 0.2, 1]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 15.25, 0]}>
              <boxGeometry args={[1, 0.2, 18]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Negative stripe */}
            <mesh castShadow receiveShadow position={[-11.7, 5, 0]}>
              <cylinderGeometry args={[12.1, 12.1, 20, 8, 1, false, Math.PI - 0.2, 0.4]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.4} />
            </mesh>
            {/* Minus sign on stripe */}
            <mesh castShadow receiveShadow position={[-12.3, 5, 0]}>
              <boxGeometry args={[0.2, 2, 6]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </group>
        );
      case "inductor":`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched capacitor_elec position");
