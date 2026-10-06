const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{\[-2\.5, 0, 2\.5\]\.map\(\(x, i\) => \([\s\S]*?<\/mesh>\n\s*\)\)\}/, 
`{[-8, 0, 8].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);

let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/dht11: \[\{x:-8, y:15\}, \{x:0, y:15\}, \{x:8, y:15\}\],/, 
  'dht11: [{x:-8, y:0}, {x:0, y:0}, {x:8, y:0}],');
pinmap = pinmap.replace(/\} \/\/ Add missing components/, 
  '  dht11: [{x:-8, y:0}, {x:0, y:0}, {x:8, y:0}],\n} // Add missing components');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
