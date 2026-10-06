const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{\[-3, -1, 1, 3\]\.map\(\(x, i\) => \([\s\S]*?<\/mesh>\n\s*\)\)\}/, 
`{[-7.5, -2.5, 2.5, 7.5].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, -16]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);

let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/gps: \[\{x:-15,y:25\}, \{x:-5,y:25\}, \{x:5,y:25\}, \{x:15,y:25\}\],/, 
  'gps: [{x:-7.5,y:-16}, {x:-2.5,y:-16}, {x:2.5,y:-16}, {x:7.5,y:-16}],');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
