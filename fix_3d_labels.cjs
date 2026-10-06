const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

if (!content.includes('import { mcuLabels }')) {
  content = content.replace('import { useEditor } from "../store";', 'import { useEditor } from "../store";\nimport { mcuLabels } from "../lib/mcu_pins";');
}

// ---------------------------------------------------------
// ESP32_3D
// ---------------------------------------------------------
const esp32LoopRegex = /\{Array\.from\(\{length: 15\}\)\.map\(\(\_, i\) => \{\s*const z = \- \(14 \* 5\.4\)\/2 \+ i \* 5\.4;\s*return \([\s\S]*?<\/group>\s*\)\s*\}\)\}/;

const esp32LoopReplacement = `{Array.from({length: 15}).map((_, i) => {
        const z = - (14 * 5.4)/2 + i * 5.4;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-w/2 + 3, 1, z]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
            <Text position={[-w/2 + 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? mcuLabels.esp32s3[i] : mcuLabels.esp32[i]}
            </Text>
            <mesh castShadow receiveShadow position={[w/2 - 3, 1, z]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
            <Text position={[w/2 - 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? mcuLabels.esp32s3[i + 15] : mcuLabels.esp32[i + 15]}
            </Text>
          </group>
        )
      })}`;

content = content.replace(esp32LoopRegex, esp32LoopReplacement);

// ---------------------------------------------------------
// ESP32_CAM3D
// ---------------------------------------------------------
const esp32CamLoopRegex = /\{Array\.from\(\{length: 8\}\)\.map\(\(\_, i\) => \{\s*const z = \-22 \+ i \* 7\.3;\s*return \([\s\S]*?<\/group>\s*\)\s*\}\)\}/;

const esp32CamLoopReplacement = `{Array.from({length: 8}).map((_, i) => {
        const z = -22 + i * 7.3;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-36.9, 0, z]}>
               <cylinderGeometry args={[1, 1, 15]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[-30, 3.1, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#fff" anchorX="left">
               {mcuLabels.esp32_cam[i]}
            </Text>
            <mesh castShadow receiveShadow position={[36.9, 0, z]}>
               <cylinderGeometry args={[1, 1, 15]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[30, 3.1, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#fff" anchorX="right">
               {mcuLabels.esp32_cam[i + 8]}
            </Text>
            <mesh castShadow receiveShadow position={[-36.9, 1.5, z]}>
               <boxGeometry args={[5, 3, 7]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[36.9, 1.5, z]}>
               <boxGeometry args={[5, 3, 7]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        )
      })}`;

content = content.replace(esp32CamLoopRegex, esp32CamLoopReplacement);


// ---------------------------------------------------------
// STM32BluePill3D
// ---------------------------------------------------------
const stm32LoopRegex = /\{Array\.from\(\{ length: 20 \}\)\.map\(\(\_, i\) => \{\s*const pzScaled = \- \(19 \* pinGap\) \/ 2 \+ i \* pinGap;\s*return \([\s\S]*?<\/group>\s*\);\s*\}\)\}/;

const stm32LoopReplacement = `{Array.from({ length: 20 }).map((_, i) => {
        const pzScaled = - (19 * pinGap) / 2 + i * pinGap;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-pinDist, 0, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[-pinDist + 4, 2, pzScaled]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.5} color="#fff" anchorX="left">
               {mcuLabels.stm32_bluepill[i]}
            </Text>
            <mesh castShadow receiveShadow position={[pinDist, 0, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[pinDist - 4, 2, pzScaled]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.5} color="#fff" anchorX="right">
               {mcuLabels.stm32_bluepill[19 - i + 20]} 
            </Text>
            <mesh castShadow receiveShadow position={[-pinDist, 1, pzScaled]}>
               <boxGeometry args={[3, 2.5, pinGap-0.2]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, 1, pzScaled]}>
               <boxGeometry args={[3, 2.5, pinGap-0.2]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        );
      })}`;
// Note: STM32 right side pins in the loop go from top to bottom, 
// so if the layout in mcuLabels is top-to-bottom for both, we map directly.
// Let's just use `mcuLabels.stm32_bluepill[i + 20]` if it's top-to-bottom, wait...
// In mcu_pins.ts: STM32 left is top-to-bottom, right is top-to-bottom.
// The z loop `i * pinGap` means `i=0` is negative z (top). So yes, just `i+20`.
const stm32LoopReplacementFixed = stm32LoopReplacement.replace('19 - i + 20', 'i + 20');

content = content.replace(stm32LoopRegex, stm32LoopReplacementFixed);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
