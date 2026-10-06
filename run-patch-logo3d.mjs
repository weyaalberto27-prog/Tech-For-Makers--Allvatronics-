import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const targetLogo = `function Logo3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const line1Len = Math.sqrt(25 * 25 + 45 * 45);
  const line1Ang = -Math.atan2(45, 25);
  
  const line2Len = Math.sqrt(37.5 * 37.5 + 22.5 * 22.5);
  const line2Ang = -Math.atan2(22.5, 37.5);
  
  const silkMat = <meshStandardMaterial color="#ffffff" metalness={0.0} roughness={1.0} />;
  const silkThickness = 0.04;

  return (
    <group position={position} scale={scale * 0.18}>
      {/* SVG Icon recreated in 3D */}
      <group position={[0, silkThickness/2, 0]}>
          <mesh position={[0, 0, -25]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[25, 0, 20]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-25, 0, 20]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-12.5, 0, -2.5]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[7, 7, silkThickness, 24]} />
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
         position={[0, silkThickness/2, 45]} 
         rotation={[-Math.PI/2, 0, 0]} 
         fontSize={20} 
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
}`;

const replacementLogo = `function Logo3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const line1Len = Math.sqrt(25 * 25 + 45 * 45);
  const line1Ang = -Math.atan2(45, 25);
  
  const line2Len = Math.sqrt(37.5 * 37.5 + 22.5 * 22.5);
  const line2Ang = -Math.atan2(22.5, 37.5);
  
  const silkMat = <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} />;
  const boxMat = <meshStandardMaterial color="#0d9488" metalness={0.2} roughness={0.8} />;
  const silkThickness = 0.1;

  return (
    <group position={position} scale={scale * 0.18}>
      {/* Teal rounded box background */}
      <RoundedBox args={[90, silkThickness, 90]} radius={16} smoothness={4} position={[0, silkThickness/2, -2.5]}>
         {boxMat}
      </RoundedBox>

      {/* SVG Icon recreated in 3D (White) */}
      <group position={[0, silkThickness, 0]}>
          <mesh position={[0, 0, -25]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[25, 0, 20]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-25, 0, 20]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[12, 12, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-12.5, 0, -2.5]} rotation={[Math.PI/2, 0, 0]}>
             <cylinderGeometry args={[6, 6, silkThickness, 24]} />
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
         position={[0, silkThickness/2, 65]} 
         rotation={[-Math.PI/2, 0, 0]} 
         fontSize={22} 
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
}`;

content = content.replace(targetLogo, replacementLogo);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content, 'utf8');
console.log("Patched Logo3D to match login area");
