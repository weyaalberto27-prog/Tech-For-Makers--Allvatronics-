function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const pins = 40;
  const pinGap = 2.54; // standard 2.54mm pitch
  const width = 15.24; // 600 mil width
  const length = 20 * pinGap; // about 50.8
  
  return (
    <group>
      {/* Blue PCB */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[width + 4, 1.5, length + 2]} />
        <meshPhysicalMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      
      {/* Microcontroller chip */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]} rotation={[0, Math.PI/4, 0]}>
        <boxGeometry args={[10, 0.5, 10]} />
        <meshPhysicalMaterial color="#141414" roughness={0.7} />
      </mesh>
      
      {/* USB Connector */}
      <mesh castShadow receiveShadow position={[0, 2.5, -length/2 + 2]}>
        <boxGeometry args={[7, 2, 6]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Header Pins */}
      {Array.from({ length: 20 }).map((_, i) => {
        const pz = -length / 2 + pinGap / 2 + i * pinGap;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-width/2, 1.5, pz]}>
               <cylinderGeometry args={[0.3, 0.3, 10]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[width/2, 1.5, pz]}>
               <cylinderGeometry args={[0.3, 0.3, 10]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
            </mesh>
            {isPCB && (
              <>
                  <mesh castShadow receiveShadow position={[-width/2, -1.65, pz]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[width/2, -1.65, pz]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[-width/2, -1.65, pz]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[width/2, -1.65, pz]}>
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
