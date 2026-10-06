const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t = `            {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x * 1.5, 1.5, -11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}`;

const r = `            {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, -1.5, -8]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 4, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}`;

code = code.replace(t, r);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
