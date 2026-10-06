const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const missingFuncs = `
function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const w = 22 * 1.6;
  const l = 53 * 1.6;
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 1.5, l]} />
        <meshPhysicalMaterial color="#1d4ed8" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[10, 1.5, 10]} />
        <meshPhysicalMaterial color="#111827" />
      </mesh>
      {Array.from({length: 20}).map((_, i) => (
        <group key={i}>
          <mesh castShadow receiveShadow position={[-w/2 + 3, isPCB ? -1.5 : -4, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
          <mesh castShadow receiveShadow position={[w/2 - 3, isPCB ? -1.5 : -4, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LDR3D({ isPCB }: { isPCB?: boolean }) {
  return (
    <group position={[0, isPCB ? 2 : 4, 0]}>
      <mesh castShadow receiveShadow position={[-5, isPCB ? -1 : -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[5, isPCB ? -1 : -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
         <cylinderGeometry args={[8, 8, 2, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
         <cylinderGeometry args={[5, 5, 0.1, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CR20323D({ isPCB }: { isPCB?: boolean }) {
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      <mesh castShadow receiveShadow position={[-10, isPCB ? -1 : -2, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 6]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, isPCB ? -1 : -2, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 6]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 10, 0]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[10, 10, 2, 32]} />
         <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>
    </group>
  );
}
`;

code = code.replace(/function ESP32_3D/, missingFuncs + 'function ESP32_3D');

fs.writeFileSync('src/components/Meshes3D.tsx', code);
