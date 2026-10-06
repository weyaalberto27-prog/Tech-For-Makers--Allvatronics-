import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

// Resistor
content = content.replace(
  /<mesh castShadow receiveShadow position=\{\[-15, -2, 0\]\} rotation=\{\[0, 0, Math.PI \/ 2\]\}>[\s\S]*?<mesh castShadow receiveShadow\s*position=\{\[0, -2, 0\]\}/m,
  `<mesh castShadow receiveShadow position={[-10, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow
              position={[0, -2, 0]}`
);

// Capacitor
content = content.replace(
  /case "capacitor":[\s\S]*?\{\/\* Ceramic Body/m,
  `case "capacitor":
        return (
          <group position={[0, 5, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-10, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Ceramic Body`
);

// Capacitor Elec
content = content.replace(
  /case "capacitor_elec":[\s\S]*?case "inductor":/m,
  `case "capacitor_elec":
        return (
          <group position={[0, 4, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-5, -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Plastic Base Plate (Common in SMD/THT electrolytics for stability) */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[6.5, 6.5, 1, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.9} />
            </mesh>
            
            {/* Main Body */}
            <mesh castShadow receiveShadow position={[0, 7.5, 0]}>
              <cylinderGeometry args={[6, 6, 13, 32]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} metalness={0.1} />
            </mesh>
            
            {/* Metallic Top Cap */}
            <mesh castShadow receiveShadow position={[0, 14, 0]}>
              <cylinderGeometry args={[5.9, 5.9, 0.2, 32]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            
            {/* Vent/Cross Indent on Top */}
            <group position={[0, 14.1, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[8, 0.1, 0.8]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.8, 0.1, 8]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
            
            {/* Negative Stripe Marker */}
            <mesh castShadow receiveShadow position={[-5.8, 7.5, 0]}>
              <cylinderGeometry args={[6.05, 6.05, 13, 16, 1, false, Math.PI - 0.3, 0.6]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
            
            {/* Minus symbols on the stripe */}
            <mesh castShadow receiveShadow position={[-6.1, 10, 0]}>
              <boxGeometry args={[0.1, 0.8, 2.5]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[-6.1, 5, 0]}>
              <boxGeometry args={[0.1, 0.8, 2.5]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      case "inductor":`
);

// Diode and Inductor
content = content.replace(
  /case "inductor":\s*case "diode":\s*return \(\s*<group position=\{\[0, 2, 0\]\}>[\s\S]*?<\/group>\s*\);/m,
  `case "inductor":
      case "diode":
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.5, 1.5, 12]} />
              <meshPhysicalMaterial color="#111" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.51, 1.51, 1.5]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        );`
);

// Zener Diode
content = content.replace(
  /case "zener_diode":\s*return \(\s*<group position=\{\[0, 2, 0\]\}>[\s\S]*?<\/group>\s*\);/m,
  `case "zener_diode":
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.2, 1.2, 12]} />
              <meshPhysicalMaterial color="#eab308" transmission={0.5} opacity={1} transparent roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.21, 1.21, 1]} />
              <meshPhysicalMaterial color="#111" roughness={0.8} />
            </mesh>
          </group>
        );`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched 3D meshes");
