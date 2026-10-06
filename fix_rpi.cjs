const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const rpiCode = `function RaspberryPi3D({ isPCB }: { isPCB?: boolean }) {
  const w = 85 * 1.6;
  const l = 56 * 1.6;
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 1.5, l]} />
        <meshPhysicalMaterial color="#166534" roughness={0.9} />
      </mesh>
      {/* CPU */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[14, 1.5, 14]} />
        <meshPhysicalMaterial color="#111827" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <boxGeometry args={[12, 0.5, 12]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>
      {/* USB/Ethernet ports */}
      <group position={[w/2 - 10, 5, l/2 - 10]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[15, 10, 15]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      <group position={[w/2 - 10, 5, l/2 - 30]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[15, 10, 15]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      {/* 40 pin header */}
      {Array.from({length: 20}).map((_, i) => {
        const x = -w/2 + 5 + i * 5;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[x, isPCB ? -1.5 : -6, -l/2 + 5]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[x, isPCB ? -1.5 : -6, -l/2 + 10]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

`;

if (!code.includes('function RaspberryPi3D')) {
  code = code.replace(/function ESP32_3D/, rpiCode + 'function ESP32_3D');
}

fs.writeFileSync('src/components/Meshes3D.tsx', code);

// Fix RPI pinmap to match 40 pin header: -w/2 + 5 + i*5.
// w = 85 * 1.6 = 136. w/2 = 68. 
// -68 + 5 = -63. So x = -63 + i * 5.
// y = -l/2 + 5. l = 56 * 1.6 = 89.6. l/2 = 44.8. -44.8 + 5 = -39.8
// y2 = -44.8 + 10 = -34.8. Let's say y: -40 and y: -35.
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/raspberry_pi: \[\.\.\.Array\.from\(\{length: 20\}\)\.map\(\(_, i\) => \(\{x: \(-52\.5 \+ i \* 5\) \* 1\.8, y: -99\}\)\), \.\.\.Array\.from\(\{length: 20\}\)\.map\(\(_, i\) => \(\{x: \(-52\.5 \+ i \* 5\) \* 1\.8, y: -39\.6\}\)\)\]/, 
  'raspberry_pi: [...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -40})), ...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -35}))]');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
