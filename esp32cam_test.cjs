const fs = require('fs');

const code = `
function ESP32_CAM3D({ isPCB }: { isPCB?: boolean }) {
  // Unscaled dimensions to match the 2.08 scale in CanvasViewer3D and pinmap
  const w = 80;
  const l = 120;
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB - Dark almost black */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[w, 1.5, l]} />
         <meshPhysicalMaterial color="#111827" roughness={0.8} />
      </mesh>
      
      {/* Metal Shield (ESP32-S) */}
      <group position={[0, 3, l/2 - 25]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[w - 25, 3, 30]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <Text position={[0, 1.6, 2]} rotation={[-Math.PI/2, 0, 0]} fontSize={4} color="#334155" anchorX="center" anchorY="middle">
           ESP32-S
        </Text>
        <Text position={[0, 1.6, -4]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#334155" anchorX="center" anchorY="middle">
           Ai-Thinker
        </Text>
        {/* Antenna Trace Area */}
        <mesh castShadow receiveShadow position={[0, -0.5, 20]}>
           <boxGeometry args={[w - 25, 1, 10]} />
           <meshPhysicalMaterial color="#020617" />
        </mesh>
        {/* Zig zag trace (Gold) */}
        <group position={[0, 0.01, 20]}>
          {[[-8,0], [-4,0], [0,0], [4,0], [8,0]].map((pos, i) => (
            <mesh key={i} castShadow receiveShadow position={[pos[0], 0, 0]}>
              <boxGeometry args={[1.5, 0.1, 7]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
          <mesh castShadow receiveShadow position={[-6, 0, 3.5]}>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[-2, 0, -3.5]}>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[2, 0, 3.5]}>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[6, 0, -3.5]}>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* OV2640 Camera Module */}
      <group position={[0, 3, -10]}>
        {/* Camera Base/Socket */}
        <mesh castShadow receiveShadow>
           <boxGeometry args={[30, 4, 30]} />
           <meshPhysicalMaterial color="#1f2937" />
        </mesh>
        {/* Camera Lens Barrel (Silver) */}
        <mesh castShadow receiveShadow position={[0, 4, 0]}>
           <cylinderGeometry args={[10, 10, 5, 32]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Lens Inner Ring (Black) */}
        <mesh castShadow receiveShadow position={[0, 6.6, 0]}>
           <cylinderGeometry args={[8, 8, 0.5, 32]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* Lens Glass (Reflective) */}
        <mesh castShadow receiveShadow position={[0, 6.7, 0]}>
           <cylinderGeometry args={[5, 5, 0.5, 32]} />
           <meshPhysicalMaterial color="#020617" roughness={0.1} clearcoat={1.0} />
        </mesh>
        {/* Orange FPC Ribbon */}
        <mesh castShadow receiveShadow position={[0, -1, 20]}>
           <boxGeometry args={[20, 0.5, 15]} />
           <meshPhysicalMaterial color="#d97706" roughness={0.5} />
        </mesh>
      </group>

      {/* Flash LED (High-power SMD LED) */}
      <group position={[0, 2, -45]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[14, 1, 14]} />
           <meshPhysicalMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
           <cylinderGeometry args={[5, 5, 0.5, 16]} />
           <meshPhysicalMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* MicroSD Card Slot */}
      <mesh castShadow receiveShadow position={[0, -1.5, 20]} rotation={[0, 0, Math.PI]}>
         <boxGeometry args={[45, 2.5, 50]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* MicroSD Card inserted */}
      <mesh castShadow receiveShadow position={[0, -1.5, 45]} rotation={[0, 0, Math.PI]}>
         <boxGeometry args={[35, 1, 15]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* Header Pins */}
      {/* 2 rows of 8 pins */}
      {Array.from({length: 8}).map((_, i) => {
        // According to pinmap: length is 106.4 / 2.08 = 51.15 total.
        // Center of pins is offset by 6.8 / 2.08 = 3.26.
        // Let's approximate: 
        const z = -22 + i * 7.3;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-36.9, 0, z]}>
               <cylinderGeometry args={[1, 1, 15]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[36.9, 0, z]}>
               <cylinderGeometry args={[1, 1, 15]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Black Plastic Header base */}
            <mesh castShadow receiveShadow position={[-36.9, 1.5, z]}>
               <boxGeometry args={[5, 3, 7]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[36.9, 1.5, z]}>
               <boxGeometry args={[5, 3, 7]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        )
      })}
    </group>
  );
}
`;
console.log("ok");
