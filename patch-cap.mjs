import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const capRegex = /case "capacitor_elec":[\s\S]*?\{(\/\* Negative Stripe Marker \*\/[\s\S]*?<\/mesh>)\s*\}\s*<\/group>\s*\);/m;

const newCap = `case "capacitor_elec":
        return (
          <group position={[0, 4, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-5, -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Rubber Seal Base (THT electrolytics) */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[5.8, 5.8, 1, 32]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            
            {/* Aluminum Can (Inner) */}
            <mesh castShadow receiveShadow position={[0, 7.5, 0]}>
              <cylinderGeometry args={[5.9, 5.9, 13.5, 32]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={1} />
            </mesh>

            {/* Colored Sleeve (Outer) */}
            <mesh castShadow receiveShadow position={[0, 7.2, 0]}>
              <cylinderGeometry args={[6, 6, 12.8, 32]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.4} clearcoat={0.5} clearcoatRoughness={0.2} metalness={0.1} />
            </mesh>
            
            {/* Vent/Cross Indent on Top */}
            <group position={[0, 14.25, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[7, 0.1, 0.6]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.6, 0.1, 7]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>
            
            {/* Negative Stripe Marker */}
            <mesh castShadow receiveShadow position={[0, 7.2, 0]}>
              <cylinderGeometry args={[6.05, 6.05, 12.8, 16, 1, false, Math.PI - 0.4, 0.8]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.2} />
            </mesh>

            {/* Minus Sign on the Stripe */}
            <mesh castShadow receiveShadow position={[-6.1, 7.5, 0]} rotation={[0, 0, Math.PI/2]}>
              <boxGeometry args={[3, 0.1, 0.8]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.5} />
            </mesh>
          </group>
        );`;

content = content.replace(capRegex, newCap);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched capacitor_elec");
