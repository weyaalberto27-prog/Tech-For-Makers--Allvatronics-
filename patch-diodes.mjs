import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const diodeRegex = /case "inductor":\s*case "diode":\s*return \(\s*<group position=\{\[25, 2, 0\]\}>[\s\S]*?<\/group>\s*\);/;

const newDiode = `case "inductor":
      case "diode":
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.5, 1.5, 12]} />
              <meshPhysicalMaterial color="#111" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.51, 1.51, 1.5]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        );`;

content = content.replace(diodeRegex, newDiode);

const zenerRegex = /case "zener_diode":\s*return \(\s*<group position=\{\[25, 2, 0\]\}>[\s\S]*?<\/group>\s*\);/;

const newZener = `case "zener_diode":
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.2, 1.2, 12]} />
              <meshPhysicalMaterial color="#eab308" transmission={0.5} opacity={1} transparent roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.21, 1.21, 1]} />
              <meshPhysicalMaterial color="#111" roughness={0.8} />
            </mesh>
          </group>
        );`;

content = content.replace(zenerRegex, newZener);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched diodes position");
