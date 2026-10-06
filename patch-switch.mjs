import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const regex = /led: \[\{x: -5, y: 0\}, \{x: 5, y: 0\}\],/;
const newCode = `led: [{x: -5, y: 0}, {x: 5, y: 0}],
  switch: [{x: -5, y: 0}, {x: 5, y: 0}],
  buzzer: [{x: -5, y: 0}, {x: 5, y: 0}],`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);

content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

// Switch
content = content.replace(
  /case "switch":\s*return \(\s*<group position=\{\[15, 2, 0\]\}>[\s\S]*?<\/group>\s*\);/m,
  `case "switch":
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[12, 4, 12]} />
               <meshPhysicalMaterial color="#1a1a1a" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, isClosed ? 1.5 : 3, 0]}>
               <cylinderGeometry args={[3, 3, 2]} />
               <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            <mesh castShadow receiveShadow position={[-5, -3, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 6]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -3, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 6]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
          </group>
        );`
);

// Buzzer
content = content.replace(
  /case "buzzer":\s*return \(\s*<group position=\{\[15, 4, 0\]\}>[\s\S]*?<\/group>\s*\);/m,
  `case "buzzer":
        return (
          <group position={[0, 4, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[6, 6, 8]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4.1, 0]}>
              <cylinderGeometry args={[1, 1, 0.1]} />
              <meshPhysicalMaterial color="#000" />
            </mesh>
            <mesh castShadow receiveShadow position={[-5, -6, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="silver" />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -6, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="silver" />
            </mesh>
          </group>
        );`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched switch and buzzer");
