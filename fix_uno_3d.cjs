const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Top header replacement
const unoTopRegex = /<group position=\{\[0, 3, 38\]\}>\s*<mesh castShadow receiveShadow>\s*<boxGeometry args=\{\[60, 6, 5\]\} \/>\s*<meshPhysicalMaterial color="\#111" \/>\s*<\/mesh>\s*\{Array\.from\(\{length: 16\}\)\.map\(\(\_, i\) => \(\s*<mesh key=\{i\} position=\{\[\-28 \+ i \* 3\.73, 3\.1, 0\]\}>\s*<boxGeometry args=\{\[1\.5, 0\.1, 1\.5\]\} \/>\s*<meshPhysicalMaterial color=\"\#050505\" \/>\s*<\/mesh>\s*\)\)\}\s*<\/group>/;

const unoTopReplacement = `<group position={[0, 3, 38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[60, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 16}).map((_, i) => (
          <group key={i}>
            <mesh position={[-28 + i * 3.73, 3.1, 0]}>
               <boxGeometry args={[1.5, 0.1, 1.5]} />
               <meshPhysicalMaterial color="#050505" />
            </mesh>
            {i < 12 && (
              <Text position={[-28 + i * 3.73, 3.2, 5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.8} color="#fff">
                 {mcuLabels.arduino_uno[14 + i]}
              </Text>
            )}
          </group>
        ))}
      </group>`;

// Bottom header replacement
const unoBottomRegex = /<group position=\{\[5, 3, \-38\]\}>\s*<mesh castShadow receiveShadow>\s*<boxGeometry args=\{\[50, 6, 5\]\} \/>\s*<meshPhysicalMaterial color=\"\#111\" \/>\s*<\/mesh>\s*\{Array\.from\(\{length: 14\}\)\.map\(\(\_, i\) => \(\s*<mesh key=\{i\} position=\{\[\-24\.2 \+ i \* 3\.73, 3\.1, 0\]\}>\s*<boxGeometry args=\{\[1\.5, 0\.1, 1\.5\]\} \/>\s*<meshPhysicalMaterial color=\"\#050505\" \/>\s*<\/mesh>\s*\)\)\}\s*<\/group>/;

const unoBottomReplacement = `<group position={[5, 3, -38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[50, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 14}).map((_, i) => (
          <group key={i}>
            <mesh position={[-24.2 + i * 3.73, 3.1, 0]}>
               <boxGeometry args={[1.5, 0.1, 1.5]} />
               <meshPhysicalMaterial color="#050505" />
            </mesh>
            <Text position={[-24.2 + i * 3.73, 3.2, -5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.8} color="#fff">
               {mcuLabels.arduino_uno[i]}
            </Text>
          </group>
        ))}
      </group>`;

content = content.replace(unoTopRegex, unoTopReplacement);
content = content.replace(unoBottomRegex, unoBottomReplacement);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
