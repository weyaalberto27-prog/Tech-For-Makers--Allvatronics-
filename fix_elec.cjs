const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /case "capacitor_elec":[\s\S]*?case "inductor":/;
const newElec = `case "capacitor_elec":
        return (
          <group position={[0, isPCB ? 4 : 4, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-5, isPCB ? -2 : -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, isPCB ? -2 : -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            
            {/* Plastic Base Plate */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[11, 11, 1, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.9} />
            </mesh>
            
            {/* Main Body */}
            <mesh castShadow receiveShadow position={[0, 16.5, 0]}>
              <cylinderGeometry args={[10, 10, 32, 32]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} metalness={0.1} />
            </mesh>
            
            {/* Metallic Top Cap */}
            <mesh castShadow receiveShadow position={[0, 32.5, 0]}>
              <cylinderGeometry args={[9.9, 9.9, 0.2, 32]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            
            {/* Vent/Cross Indent on Top */}
            <group position={[0, 32.6, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[10, 0.1, 1]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[1, 0.1, 10]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
            
            {/* Negative Stripe Marker */}
            <mesh castShadow receiveShadow position={[-7.4, 16.5, 0]}>
              <cylinderGeometry args={[10.1, 10.1, 32, 16, 1, false, Math.PI - 0.3, 0.6]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
            
            {/* Minus symbols on the stripe */}
            <mesh castShadow receiveShadow position={[-7.6, 23, 0]}>
              <boxGeometry args={[0.1, 1.2, 4]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[-7.6, 10, 0]}>
              <boxGeometry args={[0.1, 1.2, 4]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      case "inductor":`;

code = code.replace(regex, newElec);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
