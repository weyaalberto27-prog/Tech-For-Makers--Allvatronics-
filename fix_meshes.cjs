const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const replacementDIP = `function DIP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  const pinGap = isPCB ? 5 : (length / (pins / 2 + 1));
  const calcLength = isPCB ? ((pins / 2) * pinGap + pinGap) : length;
  const pinDist = isPCB ? 12 : (width / 2 + 0.5);
  const bodyWidth = isPCB ? 18 : width;
  
  const displayText = value || (type ? type.toUpperCase() : "IC");
  return (
    <group position={[0, 0, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <boxGeometry args={[calcLength, 4, bodyWidth]} />
        <meshPhysicalMaterial color="#111111" roughness={0.8} metalness={0.1} clearcoat={0.1} clearcoatRoughness={0.8} />
      </mesh>
      
      {/* Notch */}
      <mesh castShadow receiveShadow position={[-calcLength / 2, 3.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-calcLength / 2 + 2, 4, bodyWidth/2 - 1.5]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Text on top */}
      <Text
        position={[0, 4.05, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(3, calcLength / 4)}
        color="#e5e5e5"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>

      {/* Pins and Pads */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = isPCB ? (-calcLength / 2 + pinGap * (i + 1)) : (-length / 2 + pinGap * (i + 1));
         return (
           <group key={"pin"+i}>
              <mesh castShadow receiveShadow position={[px, 1, -pinDist]}>
                <boxGeometry args={[0.8, 2, isPCB ? (pinDist*2 - bodyWidth) : 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 1, pinDist]}>
                <boxGeometry args={[0.8, 2, isPCB ? (pinDist*2 - bodyWidth) : 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, -1.0, -pinDist]}>
                <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, -1.0, pinDist]}>
                <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>

              {isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, 0.05, -pinDist]}>
                    <cylinderGeometry args={[2, 2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, pinDist]}>
                    <cylinderGeometry args={[2, 2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -pinDist]}>
                    <cylinderGeometry args={[2, 2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, pinDist]}>
                    <cylinderGeometry args={[2, 2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>

                  <mesh castShadow receiveShadow position={[px, 0.05, -pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                </>
              )}
           </group>
         );
      })}
    </group>
  );
}`;

content = content.replace(/function DIP_IC3D[\s\S]*?(?=function SOP_IC3D)/, replacementDIP + '\n\n');

// Also update SOP_IC3D
const replacementSOP = `function SOP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  const pinGap = isPCB ? 5 : (length / (pins / 2 + 1));
  const calcLength = isPCB ? ((pins / 2) * pinGap + pinGap) : length;
  const pinDist = isPCB ? 15 : (width / 2 + 1);
  const bodyWidth = isPCB ? 20 : width;
  
  const displayText = value || (type ? type.toUpperCase() : "IC");
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[calcLength, 2, bodyWidth]} />
        <meshPhysicalMaterial color="#111111" roughness={0.8} metalness={0.1} clearcoat={0.1} clearcoatRoughness={0.8} />
      </mesh>
      
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-calcLength / 2 + 1.5, 2.2, bodyWidth/2 - 1.5]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Text on top */}
      <Text
        position={[0, 2.25, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(2.5, calcLength / 4)}
        color="#555"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>

      {/* Pins and Pads */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = isPCB ? (-calcLength / 2 + pinGap * (i + 1)) : (-length / 2 + pinGap * (i + 1));
         return (
           <group key={"pin"+i}>
              <mesh castShadow receiveShadow position={[px, 0.5, -pinDist]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[1, 1, 2]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 0.5, pinDist]} rotation={[-0.5, 0, 0]}>
                <boxGeometry args={[1, 1, 2]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>

              {isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, 0.05, -pinDist]}>
                    <boxGeometry args={[2.5, 0.1, 5]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, pinDist]}>
                    <boxGeometry args={[2.5, 0.1, 5]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                </>
              )}
           </group>
         );
      })}
    </group>
  );
}`;

content = content.replace(/function SOP_IC3D[\s\S]*?(?=function Resistor_SMD)/, replacementSOP + '\n\n');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Replaced IC 3D Meshes.");
