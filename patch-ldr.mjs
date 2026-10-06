import fs from 'fs';

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

// Replace LDR pads and legs to match [-10, 15] and [10, 15]
const newLdr = `
      case "ldr":
        return (
          <group position={[0, 0, 0]}>
            {/* THT LDR Base / Head */}
            <mesh castShadow receiveShadow position={[0, 8, 15]}>
              <cylinderGeometry args={[5, 5, 2, 16]} />
              <meshPhysicalMaterial color="#f4f4f5" roughness={0.6} />
            </mesh>
            {/* LDR serpentine trace */}
            <group position={[0, 9.1, 15]}>
              <mesh castShadow receiveShadow position={[0, 0, -2]}>
                <boxGeometry args={[6, 0.1, 1]} />
                <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[6, 0.1, 1]} />
                <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 2]}>
                <boxGeometry args={[6, 0.1, 1]} />
                <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              {/* connections */}
              <mesh castShadow receiveShadow position={[-2.5, 0, -1]}>
                <boxGeometry args={[1, 0.1, 2]} />
                <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
              </mesh>
              <mesh castShadow receiveShadow position={[2.5, 0, 1]}>
                <boxGeometry args={[1, 0.1, 2]} />
                <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
              </mesh>
            </group>
            {/* Legs */}
            {/* Left leg: from head at (-2, 8, 15) down to (-10, 0, 15) */}
            <mesh castShadow receiveShadow position={[-2, 4, 15]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-6, 7.5, 15]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-10, 4, 15]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Right leg: from head at (2, 8, 15) down to (10, 0, 15) */}
            <mesh castShadow receiveShadow position={[2, 4, 15]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[6, 7.5, 15]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, 4, 15]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>

            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-10, -1.65, 15]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[10, -1.65, 15]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[-10, -1.65, 15]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
                <mesh castShadow receiveShadow position={[10, -1.65, 15]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
              </>
            )}
          </group>
        );
`;
const regex = /case "ldr":[\s\S]*?(?=case "ntc":)/;
content = content.replace(regex, newLdr);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
