const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Fix TO-92 (Transistors)
const regexT = /case "transistor":[\s\S]*?case "mosfet":/;
const newT = `case "transistor":
      case "transistor_pnp": return (<group position={[0, 0, 0]}>
            {/* TO-92 D-shape plastic body using extrudeGeometry */}
            <mesh castShadow receiveShadow position={[0, 16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <extrudeGeometry args={[to92Shape, { depth: 16, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 3 }]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} clearcoat={0.2} />
            </mesh>
            {/* Laser-etched metallic text on the flat face */}
            <Text position={[0, 12, 3.1]} fontSize={2.5} color="#e2e8f0" rotation={[0, 0, 0]}>
              {value || (type === "transistor_pnp" ? "BC558" : "BC548")}
            </Text>
            <Text position={[0, 8.5, 3.1]} fontSize={1.6} color="#cbd5e1" rotation={[0, 0, 0]}>
              {type === "transistor_pnp" ? "PNP" : "NPN"}
            </Text>
            {/* Long realistic pins bent to 0.1" pitch (-10, 0, 10) */}
            {[-10, 0, 10].map((pinX) => (
              <group key={pinX} position={[pinX, -2, 0]}>
                {/* Thick part of pin near body */}
                <mesh castShadow receiveShadow position={[0, 6, 0]}>
                  <boxGeometry args={[1.5, 8, 1.2]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
                {/* Thin part of pin */}
                <mesh castShadow receiveShadow position={[0, -2, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, 14]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "mosfet":`;
code = code.replace(regexT, newT);

// Fix TO-220 (MOSFETs/Regulators)
const regexM = /case "mosfet_p":[\s\S]*?case "digital_multimeter":/;
const newM = `case "mosfet_p":
      case "to220": return (<group position={[0, 0, 0]}>
            {/* Metallic Heat Sink Tab */}
            <mesh castShadow receiveShadow position={[0, 12, 0.5]}>
              <boxGeometry args={[40, 6, 4]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Main Plastic Body */}
            <mesh castShadow receiveShadow position={[0, 20, 2]}>
              <boxGeometry args={[40, 32, 12]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            {/* Heat Sink Hole */}
            <mesh castShadow receiveShadow position={[0, 32, 0.5]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[4, 4, 4.2]} />
               <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 30, 0.5]}>
              <boxGeometry args={[40, 12, 4]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Laser-etched Text */}
            <Text
              position={[0, 20, 8.1]}
              fontSize={5}
              color="#a1a1aa"
              anchorX="center"
              anchorY="middle"
            >
              {value || (type === "mosfet" ? "IRFZ44N" : "IRF4905")}
            </Text>
            {/* Pins */}
            {[-10, 0, 10].map((pinX) => (
              <group key={pinX} position={[pinX, 0, isPCB ? 0 : 1]}>
                 <mesh castShadow receiveShadow position={[0, 4, 0]}>
                   <boxGeometry args={[2.5, 6, 1.5]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[0, 1, 0]}>
                   <boxGeometry args={[1.5, 6.0, 1.0]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[0, -4, 0]}>
                   <cylinderGeometry args={[0.4, 0.4, 8]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
              </group>
            ))}
          </group>
        );
      case "digital_multimeter":`;
code = code.replace(regexM, newM);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
