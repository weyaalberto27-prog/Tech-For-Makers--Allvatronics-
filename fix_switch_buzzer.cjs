const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regexSB = /case "switch":[\s\S]*?case "buzzer":/;
const newSB = `case "switch":
        return (
          <group position={[0, 3, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[24, 6, 24]} />
               <meshPhysicalMaterial color="#1a1a1a" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, isClosed ? 2 : 4, 0]}>
               <cylinderGeometry args={[6, 6, 4]} />
               <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            {/* Pins for typical 6x6 tactile button (often spaced ~5mm x ~6.5mm). We'll assume typical breadboard insertion points. */}
            <mesh castShadow receiveShadow position={[-10, -3, -7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -3, -7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-10, -3, 7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -3, 7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
          </group>
        );
      case "buzzer":`;
code = code.replace(regexSB, newSB);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
