const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const newBluePill = `
function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const pinGap = isPCB ? 8 : 4;
  const pinDist = isPCB ? 20 : 10;
  const length = 20 * pinGap;
  const width = pinDist * 2;

  return (
    <group position={[0, 1.5, 0]}>
      {/* Blue PCB */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, 1.5, length + 4]} />
        <meshPhysicalMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      
      {/* STM32 Microcontroller chip */}
      <mesh castShadow receiveShadow position={[0, 1.0, 0]} rotation={[0, Math.PI/4, 0]}>
        <boxGeometry args={[width * 0.45, 0.8, width * 0.45]} />
        <meshPhysicalMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      {/* Circle indent on chip */}
      <mesh castShadow receiveShadow position={[-2, 1.4, -2]} rotation={[0, Math.PI/4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* Micro USB Connector */}
      <mesh castShadow receiveShadow position={[0, 2, -length/2 + 2]}>
        <boxGeometry args={[width * 0.4, 2.5, 6]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Crystal Oscillator */}
      <mesh castShadow receiveShadow position={[4, 1.5, 10]}>
        <cylinderGeometry args={[1.5, 1.5, 4]} rotation={[Math.PI/2, 0, 0]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.8} />
      </mesh>

      {/* Yellow Headers */}
      <group position={[-pinDist + 2, 2.5, -length/2 + 8]}>
        <boxGeometry args={[4, 4, 12]} />
        <meshPhysicalMaterial color="#fbbf24" roughness={0.4} />
      </group>
      
      {/* Header Pins */}
      {Array.from({ length: 20 }).map((_, i) => {
        const pzScaled = - (19 * pinGap) / 2 + i * pinGap;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-pinDist, -2, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, -2, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Black Plastic Headers */}
            <mesh castShadow receiveShadow position={[-pinDist, 1, pzScaled]}>
               <boxGeometry args={[2.5, 2.5, pinGap-0.5]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, 1, pzScaled]}>
               <boxGeometry args={[2.5, 2.5, pinGap-0.5]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}`;

content = content.replace(/function STM32BluePill3D\(\{ isPCB \}: \{ isPCB\?: boolean \}\) \{[\s\S]*?<\group>\s*\);\s*\}/, newBluePill);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
