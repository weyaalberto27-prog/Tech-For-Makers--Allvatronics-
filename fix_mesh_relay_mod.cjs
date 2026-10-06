const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t2 = `      case "relay_module":
        return (
          <group position={[15, 10, 0]}>
            {/* PCB Base */}
            <mesh castShadow receiveShadow position={[0, -5, 0]}>
              <boxGeometry args={[42, 1, 26]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.8} />
            </mesh>
            {/* Relay Block */}
            <mesh castShadow receiveShadow position={[-2, 0, 0]}>
              <boxGeometry args={[19, 15, 15]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} />
            </mesh>
            {/* Terminal Block (Output) */}
            <mesh castShadow receiveShadow position={[-16, -2, 0]}>
              <boxGeometry args={[8, 7, 22]} />
              <meshPhysicalMaterial color="#22c55e" roughness={0.6} />
            </mesh>
            {/* Pins Header (Input) */}
            <mesh castShadow receiveShadow position={[18, -4, 0]}>
              <boxGeometry args={[2, 2, 10]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            {[-3, 0, 3].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[18, 0, z]}>
                <cylinderGeometry args={[0.3, 0.3, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Component highlights (LED, transistor) */}
            <mesh castShadow receiveShadow position={[11, -4, -8]}>
              <boxGeometry args={[2, 1, 4]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[14, -4, 8]}>
              <cylinderGeometry args={[1, 1, 2]} />
              <meshPhysicalMaterial color={isActive ? "#ef4444" : "#450a0a"} emissive={isActive ? "#ef4444" : "#000"} />
            </mesh>
          </group>
        );`;

const r2 = `      case "relay_module":
        return (
          <group position={[0, 0.5, 0]}>
            {/* PCB Base */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[42, 1, 26]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.8} />
            </mesh>
            {/* Relay Block */}
            <mesh castShadow receiveShadow position={[-2, 8, 0]}>
              <boxGeometry args={[19, 15, 15]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} />
            </mesh>
            {/* Terminal Block (Output) */}
            <mesh castShadow receiveShadow position={[-16, 4, 0]}>
              <boxGeometry args={[8, 7, 22]} />
              <meshPhysicalMaterial color="#22c55e" roughness={0.6} />
            </mesh>
            {/* Pins Header (Input) */}
            <mesh castShadow receiveShadow position={[18, 1.5, 0]}>
              <boxGeometry args={[2, 2, 10]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            {[-3, 0, 3].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[18, 2.5, z]}>
                <cylinderGeometry args={[0.3, 0.3, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Terminal Block Pins (going down) */}
            {[-7.5, 0, 7.5].map((z, i) => (
              <mesh castShadow receiveShadow key={'term_'+i} position={[-16, -1.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Input Header Pins (going down) */}
            {[-3, 0, 3].map((z, i) => (
              <mesh castShadow receiveShadow key={'in_'+i} position={[18, -1.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
            {/* Component highlights (LED, transistor) */}
            <mesh castShadow receiveShadow position={[11, 1, -8]}>
              <boxGeometry args={[2, 1, 4]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[14, 1, 8]}>
              <cylinderGeometry args={[1, 1, 2]} />
              <meshPhysicalMaterial color={isActive ? "#ef4444" : "#450a0a"} emissive={isActive ? "#ef4444" : "#000"} />
            </mesh>
          </group>
        );`;

code = code.replace(t2, r2);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
