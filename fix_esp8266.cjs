const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

code = code.replace(/\{\[-4, -1, 1, 4\]\.map\(\(z, i\) => \([\s\S]*?<\/group>\n\s*\)\)\}/, 
`{[-14, -10, -6, -2, 2, 6, 10, 14].map((z, i) => (
              <group key={i}>
                <mesh castShadow receiveShadow position={[-18, isPCB ? -1.5 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[18, isPCB ? -1.5 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              </group>
            ))}`);

fs.writeFileSync('src/components/Meshes3D.tsx', code);

let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
pinmap = pinmap.replace(/esp8266: \[\.\.\.Array\.from\(\{length: 8\}\)\.map\(\(_, i\) => \(\{x:-18, y:-5\+i\*4\}\)\), \.\.\.Array\.from\(\{length: 8\}\)\.map\(\(_, i\) => \(\{x:18, y:-5\+i\*4\}\)\)\],/, 
  'esp8266: [...Array.from({length: 8}).map((_, i) => ({x:-18, y:-14+i*4})), ...Array.from({length: 8}).map((_, i) => ({x:18, y:-14+i*4}))],');

fs.writeFileSync('src/lib/pinmap.ts', pinmap);
