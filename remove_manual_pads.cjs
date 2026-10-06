const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// For DIP ICs, we added this big block:
const t1 = `{isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, 0.05, -pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, -pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                </>
              )}`;

code = code.replace(t1, "");

// Remove resistor gold pads
const t2 = `{isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-15, -1.45, 0]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[15, -1.45, 0]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[-15, -1.45, 0]}>
                  <cylinderGeometry args={[1.0, 1.0, 0.15, 16]} />
                  <meshPhysicalMaterial color="#1a1a1a" />
                </mesh>
                <mesh castShadow receiveShadow position={[15, -1.45, 0]}>
                  <cylinderGeometry args={[1.0, 1.0, 0.15, 16]} />
                  <meshPhysicalMaterial color="#1a1a1a" />
                </mesh>
              </>
            )}`;

code = code.replace(t2, "");

// We can just regex remove all `<mesh ...><cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />...</mesh>`
code = code.replace(/<mesh[^>]*>\s*<cylinderGeometry args=\{\[1\.5, 1\.5, 0\.12, 16\]\}\s*\/>[\s\S]*?<\/mesh>/g, "");
code = code.replace(/<mesh[^>]*>\s*<cylinderGeometry args=\{\[1\.0, 1\.0, 0\.15, 16\]\}\s*\/>[\s\S]*?<\/mesh>/g, "");

fs.writeFileSync('src/components/Meshes3D.tsx', code);
