const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/<group position=\{\[0, 0, 20\]\}>\n\s*\{\[-15, -5, 5, 15\]\.map\(\(x, i\) => \([\s\S]*?<meshPhysicalMaterial color="#fbbf24" metalness=\{0\.9\} \/>\n\s*<\/mesh>\n\s*\)\)\}/, 
`<group position={[0, 0, 20]}>
              {[-15, -5, 5, 15].map((x, i) => (
                <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -2 : 0, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
