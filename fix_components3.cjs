const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// MOSFET / TO-220
content = content.replace(
  /case "mosfet":[\s\S]*?case "mosfet_p":[\s\S]*?case "to220":[\s\S]*?return \([\s\S]*?<group position=\{\[0, 0, 0\]\}>[\s\S]*?<\/group>\s*\);/g,
  `case "mosfet":
      case "mosfet_p":
      case "to220":
        return (
          <group position={[0, 0, 0]}>
            {/* Metallic Heatsink Tab */}
            <mesh castShadow receiveShadow position={[0, 15, -2]}>
              <boxGeometry args={[16, 14, 1.5]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.95} roughness={0.3} />
            </mesh>
            {/* Hole in Heatsink */}
            <mesh castShadow receiveShadow position={[0, 19, -2.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.5, 2.5, 1.6, 16]} />
              <meshPhysicalMaterial color="#050505" />
            </mesh>
            {/* Top chamfer of plastic body */}
            <mesh castShadow receiveShadow position={[0, 12, 0.5]}>
              <boxGeometry args={[16, 2, 3.5]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            {/* Main Plastic Body */}
            <mesh castShadow receiveShadow position={[0, 6, 0.5]}>
              <boxGeometry args={[16, 10, 4.5]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            
            {/* Laser-etched Text */}
            <Text
              position={[0, 6, 2.8]}
              fontSize={2.5}
              color="#a1a1aa"
              anchorX="center"
              anchorY="middle"
            >
              {value || (type === "mosfet" ? "IRFZ44N" : "IRF4905")}
            </Text>

            {/* Pins */}
            {[-5, 0, 5].map((pinX) => (
              <group key={pinX} position={[pinX * 2, 0, isPCB ? 0 : 1]}>
                 <mesh castShadow receiveShadow position={[0, 4, 0]}>
                   <boxGeometry args={[1.5, 4, 1.0]} />
                   <meshPhysicalMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[0, 1, 0]}>
                   <boxGeometry args={[1.0, 2.0, 1.0]} />
                   <meshPhysicalMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
                 </mesh>
                 {isPCB && (
                   <>
                     <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
                       <boxGeometry args={[3, 0.1, 3]} />
                       <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                     </mesh>
                     <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
                       <cylinderGeometry args={[0.8, 0.8, 0.12, 16]} />
                       <meshPhysicalMaterial color="#0f0f13" />
                     </mesh>
                     <mesh castShadow receiveShadow position={[0, -0.8, 0]}>
                       <boxGeometry args={[1.0, 1.6, 1.0]} />
                       <meshPhysicalMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
                     </mesh>
                   </>
                 )}
              </group>
            ))}
          </group>
        );`
);

// Battery (9V)
content = content.replace(
  /case "battery":[\s\S]*?<group position=\{\[0, 12, 0\]\}>[\s\S]*?<\/group>\s*\);\s*case "powersupply":/g,
  `case "battery":
        return (
          <group position={[0, 12, 0]}>
             {/* Main Battery Body - Metal Shell with rounded edges approximated by a cylinder inside a box, or just nice materials */}
             <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[26, 26, 16]} />
               <meshPhysicalMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
             </mesh>
             {/* Yellow stripe / Label area */}
             <mesh castShadow receiveShadow position={[0, -4, 0]}>
               <boxGeometry args={[26.2, 8, 16.2]} />
               <meshPhysicalMaterial color="#eab308" roughness={0.8} />
             </mesh>
             <Text position={[0, -4, 8.2]} fontSize={5} color="#111827">9V HEAVY DUTY</Text>
             <Text position={[0, 5, 8.1]} fontSize={8} color="#eab308">9V</Text>
             {/* Terminals extending to z=-40 */}
             {/* Positive (Smaller Hex/Circular Snap) */}
             <mesh castShadow receiveShadow position={[-6, 0, -10]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 4, 16]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
             </mesh>
             <mesh castShadow receiveShadow position={[-6, 0, -20]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 40]} />
                <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
             </mesh>
             <Text position={[-6, 14, -8]} rotation={[0, 0, 0]} fontSize={5} color="#ef4444">+</Text>
             {/* Negative (Larger Crown Snap) */}
             <mesh castShadow receiveShadow position={[6, 0, -10]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[3.5, 3.5, 4, 6]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
             </mesh>
             <mesh castShadow receiveShadow position={[6, 0, -20]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 40]} />
                <meshPhysicalMaterial color="#111827" roughness={0.5} />
             </mesh>
             <Text position={[6, 14, -8]} rotation={[0, 0, 0]} fontSize={5} color="#cbd5e1">-</Text>
             
             {/* Terminals bridging to -10/10 layout to match pinmap */}
             <mesh castShadow receiveShadow position={[-8, 0, -40]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.5, 0.5, 4]} />
                <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
             </mesh>
             <mesh castShadow receiveShadow position={[8, 0, -40]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.5, 0.5, 4]} />
                <meshPhysicalMaterial color="#111827" roughness={0.5} />
             </mesh>

          </group>
        );
      case "powersupply":`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
