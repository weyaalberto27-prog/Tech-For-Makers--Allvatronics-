const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const target = `{isTypeC ? (
              <group position={[0, 0, h/2]}>
                {[...Array(12)].map((_, i) => (
                  <mesh castShadow receiveShadow key={\`pad_\${i}\`} position={[-11.5 + i * 2, -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                ))}
                <group position={[-12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><cylinderGeometry args={[1.5, 1.5, 0.12, 16]} /><meshPhysicalMaterial color="#0f0f13" /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><cylinderGeometry args={[1.5, 1.5, 0.12, 16]} /><meshPhysicalMaterial color="#0f0f13" /></mesh>
                </group>
                <group position={[12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><cylinderGeometry args={[1.5, 1.5, 0.12, 16]} /><meshPhysicalMaterial color="#0f0f13" /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  <mesh castShadow receiveShadow position={[0, -1.65, 0]}><cylinderGeometry args={[1.5, 1.5, 0.12, 16]} /><meshPhysicalMaterial color="#0f0f13" /></mesh>
                </group>
              </group>
            ) : (
              <group position={[0, 0, h/2]}>
                {[...Array(5)].map((_, i) => (
                  <mesh castShadow receiveShadow key={\`pad_\${i}\`} position={[-4.5 + i * 2, -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                ))}
              </group>
            )}`;

const rep = `{isTypeC ? (
              <group position={[0, 0, h/2]}>
                {[...Array(12)].map((_, i) => (
                  <mesh castShadow receiveShadow key={\`pad_\${i}\`} position={[-11.5 + i * 2, isPCB ? 0.05 : -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                ))}
                <group position={[-12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, isPCB ? 0.05 : -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                </group>
                <group position={[12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, isPCB ? 0.05 : -1.65, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                </group>
              </group>
            ) : (
              <group position={[0, 0, h/2]}>
                {[...Array(5)].map((_, i) => (
                  <mesh castShadow receiveShadow key={\`pad_\${i}\`} position={[-4.5 + i * 2, isPCB ? 0.05 : -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                ))}
              </group>
            )}`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
