import fs from 'fs';

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const ldrPads = `
            <mesh castShadow receiveShadow position={[2, 4, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 8]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
            </mesh>
            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-2, -1.65, 0]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[2, -1.65, 0]}>
                  <cylinderGeometry args={[1.5, 1.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[-2, -1.65, 0]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
                <mesh castShadow receiveShadow position={[2, -1.65, 0]}>
                  <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
              </>
            )}
`;

content = content.replace(/<mesh castShadow receiveShadow position=\{\[2, 4, 0\]\}>\s*<cylinderGeometry args=\{\[0\.3, 0\.3, 8\]\} \/>\s*<meshPhysicalMaterial color="#d1d5db" metalness=\{0\.9\} roughness=\{0\.1\} \/>\s*<\/mesh>/, ldrPads);

const cr2032Pads = `
            <Text position={[15, 3, 20]} rotation={[-Math.PI/2, 0, 0]} fontSize={2.5} color="#ffffff">-</Text>
            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-15, -1.65, 20]}>
                  <cylinderGeometry args={[2.5, 2.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[15, -1.65, 20]}>
                  <cylinderGeometry args={[2.5, 2.5, 0.12, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[-15, -1.65, 20]}>
                  <cylinderGeometry args={[1.0, 1.0, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
                <mesh castShadow receiveShadow position={[15, -1.65, 20]}>
                  <cylinderGeometry args={[1.0, 1.0, 0.12, 16]} />
                  <meshPhysicalMaterial color="#0f0f13" />
                </mesh>
              </>
            )}
`;

content = content.replace(/<Text position=\{\[15, 3, 20\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\} fontSize=\{2\.5\} color="#ffffff"\s*>\s*-\s*<\/Text>/, cr2032Pads);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
