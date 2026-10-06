const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regexD = /case "diode":[\s\S]*?case "zener":/;
const newDiode = `case "diode":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            {/* Diode Body (1N4007 style) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[4.5, 4.5, 14]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[4.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[4.51, 4.51, 2]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
        );
      case "zener":`;
code = code.replace(regexD, newDiode);

const regexZ = /case "zener":[\s\S]*?case "led":/;
const newZener = `case "zener":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            {/* Zener Body (Glass style) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.5, 3.5, 12]} />
              <meshPhysicalMaterial color="#ef4444" roughness={0.2} clearcoat={1} metalness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.55, 3.55, 1.5]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          </group>
        );
      case "led":`;
code = code.replace(regexZ, newZener);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
