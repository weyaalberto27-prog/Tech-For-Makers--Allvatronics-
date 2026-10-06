const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const restoreCode = `
function LDR3D() {
  return (
    <group position={[0, 2, 0]}>
      <mesh castShadow receiveShadow position={[-5, -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, 8]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[5, -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, 8]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
         <cylinderGeometry args={[6, 6, 1.5, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
         <cylinderGeometry args={[5, 5, 0.1, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, 2]}>
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, -2]}>
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[-4, 0.85, 1]}>
         <boxGeometry args={[1, 0.1, 3]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[4, 0.85, -1]}>
         <boxGeometry args={[1, 0.1, 3]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
         <cylinderGeometry args={[6.1, 6.1, 2, 32]} />
         <meshPhysicalMaterial color="#fff" transparent opacity={0.3} roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}

function CR20323D() {
  return (
    <group position={[0, 2, 0]}>
      <mesh castShadow receiveShadow position={[0, -1, 0]}>
         <cylinderGeometry args={[11, 11, 2, 32]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
         <cylinderGeometry args={[10, 10, 2, 32]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
         <cylinderGeometry args={[9.5, 9.5, 1.1, 32]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
      <Text position={[0, 2.1, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#94a3b8">CR2032</Text>
      <Text position={[0, 2.1, 4]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#94a3b8">+ 3V</Text>
      <mesh castShadow receiveShadow position={[0, 2.2, -8]}>
         <boxGeometry args={[4, 0.4, 6]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-15, -4, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 6]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[15, -4, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 6]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
    </group>
  );
}

`;

// First remove the second STM32BluePill3D if it's there
let m = content.match(/function STM32BluePill3D[\s\S]*?<\/group>\s*\);\s*\}/g);
if (m && m.length > 1) {
    // Keep the first one, replace the second one with nothing (or rather we'll replace the first one with the restoreCode and the first one, then delete second)
    let first = m[0];
    content = content.replace(first, restoreCode + first);
    // remove the last occurrence
    let lastIndex = content.lastIndexOf("function STM32BluePill3D");
    let afterLast = content.substring(lastIndex);
    let endOfLast = afterLast.indexOf("</group>\n  );\n}") + "</group>\n  );\n}".length;
    content = content.substring(0, lastIndex) + afterLast.substring(endOfLast);
}

fs.writeFileSync('src/components/Meshes3D.tsx', content);
