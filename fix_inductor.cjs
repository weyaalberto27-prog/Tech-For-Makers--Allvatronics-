const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /case "inductor":[\s\S]*?case "diode":/;
const newInductor = `case "inductor":
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
            
            {/* Inductor Body (Ferrite bead style, Green/Cyan) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[4, 4, 16, 32]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[-7, 0, 0]}>
              <sphereGeometry args={[4, 32, 16]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[7, 0, 0]}>
              <sphereGeometry args={[4, 32, 16]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
          </group>
        );
      case "diode":`;

code = code.replace(regex, newInductor);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
