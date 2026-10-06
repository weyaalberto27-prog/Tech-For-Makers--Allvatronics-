import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

content = content.replace(
  /case "pad":\s*case "via":\s*return \(\s*<group position=\{\[0, 0, 0\]\}>\s*<mesh castShadow receiveShadow position=\{\[0, -1\.65, 0\]\} rotation=\{\[Math\.PI \/ 2, 0, 0\]\}>/m,
  `case "pad":
      case "via":
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched pad and via in 3D");
