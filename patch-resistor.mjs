import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const regex = /<mesh castShadow receiveShadow position=\{\[-15, -2, 0\]\}[\s\S]*?<mesh castShadow receiveShadow\s*position=\{\[0, -2, 0\]\}/;

const newBlock = `<mesh castShadow receiveShadow position={[-15, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-20, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[20, -5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow
              position={[0, -2, 0]}`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched resistor position");
