import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const targetRegex = /function Logo3D\([\s\S]*?\}\s*export function CanvasViewer3D/m;

const replacementLogo = `function Logo3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const line1Len = Math.sqrt(25 * 25 + 45 * 45);
  const line1Ang = -Math.atan2(45, 25);
  
  const line2Len = Math.sqrt(37.5 * 37.5 + 22.5 * 22.5);
  const line2Ang = -Math.atan2(22.5, 37.5);
  
  const silkMat = <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} emissive="#ffffff" emissiveIntensity={0.2} />;
  const silkThickness = 2; // Making it very thick to ensure it shows up

  return (
    <group position={position} scale={scale * 0.35}>
      {/* SVG Icon recreated in 3D (White, no background) */}
      <group position={[0, silkThickness/2, 0]}>
          <mesh position={[0, 0, -25]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[25, 0, 20]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-25, 0, 20]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-12.5, 0, -2.5]}>
             <cylinderGeometry args={[8, 8, silkThickness, 24]} />
             {silkMat}
          </mesh>
          <mesh position={[12.5, 0, -2.5]} rotation={[0, line1Ang, 0]}>
             <boxGeometry args={[line1Len, silkThickness, 8]} />
             {silkMat}
          </mesh>
          <mesh position={[6.25, 0, 8.75]} rotation={[0, line2Ang, 0]}>
             <boxGeometry args={[line2Len, silkThickness, 8]} />
             {silkMat}
          </mesh>
      </group>
      
      {/* Brand Name exactly as requested */}
      <Text 
         position={[0, silkThickness, 50]} 
         rotation={[-Math.PI/2, 0, 0]} 
         fontSize={24} 
         color="#ffffff" 
         fontWeight="bold" 
         letterSpacing={0.1}
         anchorX="center"
         anchorY="middle"
      >
        ALLVATRONICS
      </Text>
    </group>
  );
}

export function CanvasViewer3D`;

content = content.replace(targetRegex, replacementLogo);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
