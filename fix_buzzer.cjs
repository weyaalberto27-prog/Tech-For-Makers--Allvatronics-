const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regexBz = /case "buzzer":[\s\S]*?case "transistor_npn":/;
const newBz = `case "buzzer":
        return (
          <group position={[0, 10, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[18, 18, 20]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 10.1, 0]}>
              <cylinderGeometry args={[2, 2, 0.1]} />
              <meshPhysicalMaterial color="#222" />
            </mesh>
            <mesh castShadow receiveShadow position={[-5, -12, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -12, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
          </group>
        );
      case "transistor_npn":`;

code = code.replace(regexBz, newBz);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
