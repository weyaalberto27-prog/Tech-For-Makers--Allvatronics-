import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const oldCode = `    switch (type) {
      case "ic":
      case "timer555":`;

const newCode = `    switch (type) {
      case "dip8":
        return (
          <group position={[0, 4, 0]}>
            {/* DIP-8 Body - Realistic Epoxy */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[10, 4, 8]} />
              <meshPhysicalMaterial 
                color="#111111" 
                roughness={0.7} 
                metalness={0.2} 
                clearcoat={0.1}
                clearcoatRoughness={0.8}
              />
            </mesh>
            {/* Indentation/Notch for Pin 1 indicator */}
            <mesh position={[-4, 1.5, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 1.5, 16]} />
              <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>
            {/* Pin 1 Dot */}
            <mesh position={[-3, 2, 2.5]}>
              <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
              <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>
            {/* Pins */}
            {Array.from({ length: 4 }).map((_, i) => (
              <group key={\`pin-top-\${i}\`}>
                <mesh position={[-3 + i * 2, -2, -4.5]} castShadow>
                  <boxGeometry args={[0.8, 4, 1]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[-3 + i * 2, -2, 4.5]} castShadow>
                  <boxGeometry args={[0.8, 4, 1]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "sop":
      case "soic":
        return (
          <group position={[0, 1.5, 0]}>
            {/* SOP/SOIC Body - Realistic Epoxy */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[6, 2, 4]} />
              <meshPhysicalMaterial 
                color="#111111" 
                roughness={0.6} 
                metalness={0.3} 
                clearcoat={0.2}
                clearcoatRoughness={0.6}
              />
            </mesh>
            {/* Beveled edge (simplified with a smaller box on top) */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[5.6, 1.2, 3.6]} />
              <meshPhysicalMaterial color="#111111" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Pin 1 Dot */}
            <mesh position={[-2, 1.1, 1.2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
              <meshPhysicalMaterial color="#050505" roughness={0.9} />
            </mesh>
            {/* Gull-wing Pins */}
            {Array.from({ length: 4 }).map((_, i) => (
              <group key={\`pin-gull-\${i}\`}>
                {/* Top side pins */}
                <mesh position={[-1.8 + i * 1.2, -0.5, -2.5]} castShadow rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[0.4, 0.2, 1.5]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[-1.8 + i * 1.2, -1, -3]} castShadow>
                  <boxGeometry args={[0.4, 0.2, 1]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Bottom side pins */}
                <mesh position={[-1.8 + i * 1.2, -0.5, 2.5]} castShadow rotation={[-0.2, 0, 0]}>
                  <boxGeometry args={[0.4, 0.2, 1.5]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh position={[-1.8 + i * 1.2, -1, 3]} castShadow>
                  <boxGeometry args={[0.4, 0.2, 1]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "ic":
      case "timer555":`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
