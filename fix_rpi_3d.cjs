const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// ---------------------------------------------------------
// RaspberryPi3D
// ---------------------------------------------------------
const rpiLoopRegex = /\{\/\* 2 rows of 20 pins \*\/\}\s*\{Array\.from\(\{length: 20\}\)\.map\(\(\_, i\) => \(\s*<mesh key=\{i\} castShadow receiveShadow position=\{\[\-1\.25, 3, \-24 \+ i \* 2\.5\]\}>\s*<cylinderGeometry args=\{\[0\.3, 0\.3, 6\]\} \/>\s*<meshPhysicalMaterial color=\"\#d4af37\" metalness=\{0\.9\} roughness=\{0\.2\} \/>\s*<\/mesh>\s*\)\)\}\s*\{Array\.from\(\{length: 20\}\)\.map\(\(\_, i\) => \(\s*<mesh key=\{\'r2\'\+i\} castShadow receiveShadow position=\{\[1\.25, 3, \-24 \+ i \* 2\.5\]\}>\s*<cylinderGeometry args=\{\[0\.3, 0\.3, 6\]\} \/>\s*<meshPhysicalMaterial color=\"\#d4af37\" metalness=\{0\.9\} roughness=\{0\.2\} \/>\s*<\/mesh>\s*\)\)\}/;

const rpiLoopReplacement = `{/* 2 rows of 20 pins */}
        {Array.from({length: 20}).map((_, i) => (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-1.25, 3, -24 + i * 2.5]}>
               <cylinderGeometry args={[0.3, 0.3, 6]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[-3, 4, -24 + i * 2.5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff" anchorX="right">
               {mcuLabels.raspberry_pi[i]}
            </Text>
          </group>
        ))}
        {Array.from({length: 20}).map((_, i) => (
          <group key={'r2'+i}>
            <mesh castShadow receiveShadow position={[1.25, 3, -24 + i * 2.5]}>
               <cylinderGeometry args={[0.3, 0.3, 6]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[3, 4, -24 + i * 2.5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff" anchorX="left">
               {mcuLabels.raspberry_pi[i + 20]}
            </Text>
          </group>
        ))}`;

content = content.replace(rpiLoopRegex, rpiLoopReplacement);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
