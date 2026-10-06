import fs from 'fs';

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const stm32Component = `
function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const pinGap = isPCB ? 8 : 4;
  const pinDist = isPCB ? 20 : 10;
  const length = 20 * pinGap;
  const width = pinDist * 2;

  return (
    <group>
      {/* Blue PCB */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[width, 1.5, length + 4]} />
        <meshPhysicalMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      
      {/* Microcontroller chip */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]} rotation={[0, Math.PI/4, 0]}>
        <boxGeometry args={[width * 0.4, 0.5, width * 0.4]} />
        <meshPhysicalMaterial color="#141414" roughness={0.7} />
      </mesh>
      
      {/* USB Connector */}
      <mesh castShadow receiveShadow position={[0, 2.5, -length/2 + 4]}>
        <boxGeometry args={[width * 0.3, 2, 6]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Buttons / small components */}
      <mesh castShadow receiveShadow position={[0, 2.5, length/2 - 10]}>
        <boxGeometry args={[4, 1, 4]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
      
      {/* Header Pins */}
      {Array.from({ length: 20 }).map((_, i) => {
        const pzScaled = - (19 * pinGap) / 2 + i * pinGap;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-pinDist, 1.5, pzScaled]}>
               <cylinderGeometry args={[isPCB ? 1.0 : 0.5, isPCB ? 1.0 : 0.5, 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, 1.5, pzScaled]}>
               <cylinderGeometry args={[isPCB ? 1.0 : 0.5, isPCB ? 1.0 : 0.5, 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            {isPCB && (
              <>
                  <mesh castShadow receiveShadow position={[-pinDist, -1.65, pzScaled]}>
                    <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[pinDist, -1.65, pzScaled]}>
                    <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[-pinDist, -1.65, pzScaled]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[pinDist, -1.65, pzScaled]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
              </>
            )}
          </group>
        )
      })}
    </group>
  );
}
`;

// Insert STM32BluePill3D before HighQualityMesh
content = content.replace('export function HighQualityMesh', stm32Component + '\nexport function HighQualityMesh');

// Update the switch statement inside HighQualityMesh
content = content.replace(/case "stm32_bluepill": \{[\s\S]*?\}/, 'case "stm32_bluepill":\n        return <STM32BluePill3D isPCB={isPCB} />;');

fs.writeFileSync('src/components/Meshes3D.tsx', content);

