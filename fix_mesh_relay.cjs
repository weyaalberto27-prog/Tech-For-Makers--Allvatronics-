const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t1 = `      case "relay":
        return (
          <group position={[15, 10, 0]}>
            {/* Realistic Songle Type Relay Box */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[19, 15, 15]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} clearcoat={0.3} />
            </mesh>
            {/* Coil & COM pins */}
            {[-7, 0, 7].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[-6, -9, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
            {/* NO / NC pins */}
            {[-7, 7].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[6, -9, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
          </group>
        );`;

const r1 = `      case "relay":
        return (
          <group position={[0, 7.5, 0]}>
            {/* Realistic Songle Type Relay Box */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[19, 15, 15]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} clearcoat={0.3} />
            </mesh>
            {/* Coil & COM pins */}
            {[-6, 0, 6].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[-6, -8.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
            {/* NO / NC pins */}
            {[-6, 6].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[6, -8.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
          </group>
        );`;

code = code.replace(t1, r1);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
