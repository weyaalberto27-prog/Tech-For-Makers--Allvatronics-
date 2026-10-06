const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{\[-5, -2\.5, 0, 2\.5, 5\]\.map\(\(x, i\) => \([\s\S]*?<\/mesh>\n\s*\)\)\}/, 
`{[-8.75, -6.25, -3.75, -1.25, 1.25, 3.75, 6.25, 8.75].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -2 : -6, -8]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);

let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/accelerometer_pcb: \[\{x: -5, y: -8\}, \{x: -2\.5, y: -8\}, \{x: 0, y: -8\}, \{x: 2\.5, y: -8\}, \{x: 5, y: -8\}\],/, 
  'accelerometer_pcb: [{x: -8.75, y: -8}, {x: -6.25, y: -8}, {x: -3.75, y: -8}, {x: -1.25, y: -8}, {x: 1.25, y: -8}, {x: 3.75, y: -8}, {x: 6.25, y: -8}, {x: 8.75, y: -8}],');
pinmap = pinmap.replace(/accelerometer: \[\{x:-25,y:25\}, \{x:-15,y:25\}, \{x:-5,y:25\}, \{x:5,y:25\}, \{x:15,y:25\}, \{x:25,y:25\}, \{x:35,y:25\}, \{x:45,y:25\}\],/, 
  'accelerometer: [{x: -8.75, y: 20}, {x: -6.25, y: 20}, {x: -3.75, y: 20}, {x: -1.25, y: 20}, {x: 1.25, y: 20}, {x: 3.75, y: 20}, {x: 6.25, y: 20}, {x: 8.75, y: 20}],');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
