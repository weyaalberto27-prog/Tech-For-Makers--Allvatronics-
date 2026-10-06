const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t = `{isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, -1.65, -pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, pinDist]}>
                    <cylinderGeometry args={[1.2, 1.2, 0.12, 16]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, pinDist]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                </>
              )}`;

const r = `{isPCB && (
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

code = code.replace(t, r);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
