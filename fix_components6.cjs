const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Oscilloscope
content = content.replace(
  /case "oscilloscope":[\s\S]*?<mesh castShadow receiveShadow position=\{\[-20, -10, 31\]\} rotation=\{\[Math\.PI \/ 2, 0, 0\]\}>[\s\S]*?<\/group>\s*\);/g,
  `case "oscilloscope":
        return (
          <group position={[0, 20, 10]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[80, 40, 40]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.8} clearcoat={0.1} />
            </mesh>
            {/* Rubber protective bumpers */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[82, 42, 38]} />
              <meshPhysicalMaterial color="#1e293b" roughness={0.9} transparent opacity={0.3} />
            </mesh>
            {/* Screen bezel */}
            <mesh castShadow receiveShadow position={[-15, 0, -21]}>
              <boxGeometry args={[44, 30, 2]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            {/* Screen */}
            <mesh castShadow receiveShadow position={[-15, 0, -22.1]}>
              <planeGeometry args={[40, 26]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {/* Waveform active */}
            {isActive && (
              <>
                <mesh castShadow receiveShadow position={[-15, 0, -22.2]}>
                  <planeGeometry args={[30, 14]} />
                  <meshPhysicalMaterial
                    color="#22c55e"
                    emissive="#22c55e"
                    emissiveIntensity={2}
                    wireframe
                    transparent
                    opacity={0.1}
                  />
                </mesh>
                <group position={[0, 0, 10]}>
                  <OscilloscopeScreen3D id={id} isActive={isActive} customProps={customProps} />
                </group>
              </>
            )}
            {/* Knobs */}
            <mesh castShadow receiveShadow position={[18, 5, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#94a3b8" />
            </mesh>
            <mesh castShadow receiveShadow position={[30, 5, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#94a3b8" />
            </mesh>
            <mesh castShadow receiveShadow position={[18, -8, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 3]} />
              <meshPhysicalMaterial color="#cbd5e1" />
            </mesh>

            {/* Probes/Pins mapping to pinmap (Z=40 relative to origin -> Z=30 relative to this group since group is at Z=10) */}
            {/* Left Channel (CH1) */}
            <mesh castShadow receiveShadow position={[-20, -10, 25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[-20, -10, 28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial
                color="silver"
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
            {/* Right Channel (CH2) */}
            <mesh castShadow receiveShadow position={[20, -10, 25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[20, -10, 28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial
                color="silver"
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
          </group>
        );`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
