import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const regex = /case "capacitor_elec":\s*case "inductor":\s*case "diode":/;

const newBlock = `case "capacitor_elec":
        return (
          <group position={[25, 6, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-2, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[2, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[4, 4, 10, 32]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.4} clearcoat={0.5} />
            </mesh>
            {/* Top Metal Cap */}
            <mesh castShadow receiveShadow position={[0, 5, 0]}>
              <cylinderGeometry args={[4, 4, 0.2, 32]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Top cross indent */}
            <mesh castShadow receiveShadow position={[0, 5.1, 0]}>
              <boxGeometry args={[6, 0.1, 0.5]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 5.1, 0]}>
              <boxGeometry args={[0.5, 0.1, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Negative stripe */}
            <mesh castShadow receiveShadow position={[-3.9, 0, 0]}>
              <cylinderGeometry args={[4.05, 4.05, 10, 8, 1, false, Math.PI - 0.2, 0.4]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.4} />
            </mesh>
            {/* Minus sign on stripe */}
            <mesh castShadow receiveShadow position={[-4.1, 0, 0]}>
              <boxGeometry args={[0.1, 0.5, 2]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </group>
        );
      case "inductor":
      case "diode":`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched capacitor_elec 3D model");
