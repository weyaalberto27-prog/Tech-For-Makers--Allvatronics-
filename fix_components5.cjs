const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Relay
content = content.replace(
  /case "relay":[\s\S]*?<boxGeometry args=\{\[19, 15, 15\]\} \/>\s*<meshPhysicalMaterial color="#1d4ed8" roughness=\{0\.4\} clearcoat=\{0\.3\} \/>\s*<\/mesh>/g,
  `case "relay":
        return (
          <group position={[0, 7.5, 0]}>
            {/* Realistic Songle Type Relay Box */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[19, 15, 15]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} clearcoat={0.3} />
            </mesh>
            {/* Relay Etched Text */}
            <Text position={[0, 7.6, 0]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={3} color="#e2e8f0" anchorX="center" anchorY="bottom">SONGLE</Text>
            <Text position={[0, 7.6, 0]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={2} color="#cbd5e1" anchorX="center" anchorY="top">10A 250VAC</Text>
            <Text position={[4, 7.6, -4]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={1.5} color="#94a3b8" anchorX="right" anchorY="top">SRD-05VDC-SL-C</Text>`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
