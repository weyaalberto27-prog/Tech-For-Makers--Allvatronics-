const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /case "capacitor":[\s\S]*?case "capacitor_elec":/;
const newCap = `case "capacitor":
        return (
          <group position={[0, isPCB ? 6 : 6, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-10, isPCB ? -3 : -6, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 7 : 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, isPCB ? -3 : -6, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 7 : 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            {/* Ceramic Body - Yellow/Orange */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <sphereGeometry args={[9, 16, 16]} />
              <meshPhysicalMaterial color="#eab308" roughness={0.4} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[9, 9, 4, 16]} />
              <meshPhysicalMaterial color="#eab308" roughness={0.4} clearcoat={0.5} />
            </mesh>
          </group>
        );
      case "capacitor_elec":`;

code = code.replace(regex, newCap);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
