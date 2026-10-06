const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Separate Inductor from Diode
content = content.replace(
  /case "inductor":\s*case "diode":/g,
  `case "inductor":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Inductor Body (Ferrite bead style, Green/Cyan) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[2.5, 2.5, 12, 32]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[-6, 0, 0]}>
              <sphereGeometry args={[2.5, 32, 16]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[6, 0, 0]}>
              <sphereGeometry args={[2.5, 32, 16]} />
              <meshPhysicalMaterial color="#10b981" roughness={0.6} />
            </mesh>
          </group>
        );
      case "diode":`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
