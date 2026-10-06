const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /\{Array\.from\(\{length: 15\}\)\.map\(\(_, i\) => \{[\s\S]*?<\/group>\n\s*\);\n\s*\}\)\}/;

const newBlock = `{Array.from({length: isS3 ? 22 : 15}).map((_, i) => {
        const pinCount = isS3 ? 22 : 15;
        const spacing = isS3 ? 8 : 10.4; // 10.4 is 6.5 * 1.6
        const offset = isS3 ? -84 : -6 * 1.6;
        const z = offset + i * spacing;
        
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-w/2 + 3, isPCB ? -1.5 : -4, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <Text position={[-w/2 + 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? (mcuLabels.esp32s3 ? mcuLabels.esp32s3[i] : '') : (mcuLabels.esp32 ? mcuLabels.esp32[i] : '')}
            </Text>
            
            <mesh castShadow receiveShadow position={[w/2 - 3, isPCB ? -1.5 : -4, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <Text position={[w/2 - 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? (mcuLabels.esp32s3 ? mcuLabels.esp32s3[i + 22] : '') : (mcuLabels.esp32 ? mcuLabels.esp32[i + 15] : '')}
            </Text>
          </group>
        );
      })}`;

code = code.replace(regex, newBlock);
fs.writeFileSync('src/components/Meshes3D.tsx', code);

// fix pinmap x for ESP32 and ESP32S3
let pinmap = fs.readFileSync('src/lib/pinmap.ts', 'utf8');
// w = 28 * 1.6 = 44.8, so x is roughly 44.8 / 2 = 22.4. Let's say 20.
pinmap = pinmap.replace(/esp32s3: \[\.\.\.Array\.from\(\{length: 22\}\)\.map\(\(_, i\) => \(\{x: -64, y: \(-84 \+ i \* 8\) \* 1\}\)\), \.\.\.Array\.from\(\{length: 22\}\)\.map\(\(_, i\) => \(\{x: 64, y: \(-84 \+ i \* 8\) \* 1\}\)\)\],/, 
  'esp32s3: [...Array.from({length: 22}).map((_, i) => ({x: -19.4, y: -84 + i * 8})), ...Array.from({length: 22}).map((_, i) => ({x: 19.4, y: -84 + i * 8}))],');
pinmap = pinmap.replace(/esp32: \[\.\.\.Array\.from\(\{length: 15\}\)\.map\(\(_, i\) => \(\{x: -64, y: \(-6 \+ i \* 6\.5\) \* 1\.6\}\)\), \.\.\.Array\.from\(\{length: 15\}\)\.map\(\(_, i\) => \(\{x: 64, y: \(-6 \+ i \* 6\.5\) \* 1\.6\}\)\)\],/, 
  'esp32: [...Array.from({length: 15}).map((_, i) => ({x: -19.4, y: (-6 + i * 6.5) * 1.6})), ...Array.from({length: 15}).map((_, i) => ({x: 19.4, y: (-6 + i * 6.5) * 1.6}))],');
fs.writeFileSync('src/lib/pinmap.ts', pinmap);
