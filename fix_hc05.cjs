const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{\[-3, -1\.5, 0, 1\.5, 3\]\.map\(\(x, i\) => \([\s\S]*?<\/mesh>\n\s*\)\)\}/, 
`{[-12.5, -7.5, -2.5, 2.5, 7.5, 12.5].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, -14]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);

let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/hc05: \[\{x:-12\.5, y:25\}, \{x:-7\.5, y:25\}, \{x:-2\.5, y:25\}, \{x:2\.5, y:25\}, \{x:7\.5, y:25\}, \{x:12\.5, y:25\}\],/, 
  'hc05: [{x:-12.5, y:14}, {x:-7.5, y:14}, {x:-2.5, y:14}, {x:2.5, y:14}, {x:7.5, y:14}, {x:12.5, y:14}],');
pinmap = pinmap.replace(/\} \/\/ Add missing components/, 
  '  hc05: [{x:-12.5, y:-14}, {x:-7.5, y:-14}, {x:-2.5, y:-14}, {x:2.5, y:-14}, {x:7.5, y:-14}, {x:12.5, y:-14}],\n} // Add missing components');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
