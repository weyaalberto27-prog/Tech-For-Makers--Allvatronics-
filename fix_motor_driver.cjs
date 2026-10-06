const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// remove old motor_driver
code = code.replace(/case "motor_driver": return \(\<group[\s\S]*?<\/group>\n        \);/, '');

// rename a4988 to motor_driver and fix the scale
const regexA = /case "a4988":[\s\S]*?default:/;
const newA = `case "motor_driver":
      case "a4988":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            {/* PCB */}
            <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
              <boxGeometry args={[30, 3, 80]} />
              <meshPhysicalMaterial color="#dc2626" roughness={0.8} />
            </mesh>
            {/* Main IC */}
            <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
              <boxGeometry args={[12, 3, 12]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {/* Heat sink */}
            <mesh castShadow receiveShadow position={[0, 7.5, 0]}>
              <boxGeometry args={[10, 3, 10]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 9.5, 0]}>
              <boxGeometry args={[10, 1, 2]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Trimpot */}
            <mesh castShadow receiveShadow position={[0, 4.5, -20]}>
              <cylinderGeometry args={[4, 4, 3, 16]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {/* Pins */}
            {[-35, -25, -15, -5, 5, 15, 25, 35].map((z, i) => (
              <group key={i}>
                <mesh castShadow receiveShadow position={[-15, isPCB ? -2 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[15, isPCB ? -2 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        );
      default:`;

code = code.replace(regexA, newA);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
