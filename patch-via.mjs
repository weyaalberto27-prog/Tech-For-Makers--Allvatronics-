import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const padRegex = /case "pad":\s*case "via":\s*return \(\s*<group position=\{\[0, 0, 0\]\}>\s*<mesh castShadow receiveShadow position=\{\[0, 0\.02, 0\]\} rotation=\{\[Math\.PI \/ 2, 0, 0\]\}>\s*<ringGeometry args=\{\[type === "via" \? 1\.5 : 1\.5, type === "via" \? 3 : 3, 16\]\} \/>\s*<meshPhysicalMaterial color="#d4af37" metalness=\{1\} roughness=\{0\.2\} \/>\s*<\/mesh>\s*<\/group>\s*\);/m;

const padReplacement = `case "pad":
      case "via":
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[type === "via" ? 1.5 : 1.5, type === "via" ? 3 : 3, 16]} />
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={2} />
            </mesh>
            {type === "via" && (
              <>
                <mesh castShadow receiveShadow position={[0, -1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.5, 3, 16]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={2} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, -0.8, 0]}>
                  <cylinderGeometry args={[1.5, 1.5, 1.6, 16, 1, true]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={2} />
                </mesh>
              </>
            )}
          </group>
        );`;

content = content.replace(padRegex, padReplacement);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched via to go through the board");
