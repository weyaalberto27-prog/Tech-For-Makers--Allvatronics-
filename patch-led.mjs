import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const regex = /diode: \[\{x: -15, y: 0\}, \{x: 15, y: 0\}\],/;
const newCode = `diode: [{x: -15, y: 0}, {x: 15, y: 0}],
  led: [{x: -5, y: 0}, {x: 5, y: 0}],
  lamp: [{x: -5, y: 0}, {x: 5, y: 0}],`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);

content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');
content = content.replace(
  /case "led":\s*\{\s*const ledColor[\s\S]*?return \(\s*<group position=\{\[15, 5, 0\]\}>/m,
  `case "led": {
        const ledColor = customProps?.color?.toLowerCase() === "green" ? "#22c55e" :
                         customProps?.color?.toLowerCase() === "blue" ? "#3b82f6" :
                         customProps?.color?.toLowerCase() === "yellow" ? "#eab308" :
                         customProps?.color?.toLowerCase() === "white" ? "#ffffff" : "#ef4444";
        return (
          <group position={[0, 5, 0]}>`
);
content = content.replace(
  /case "lamp":\s*return \(\s*<group position=\{\[15, 10, 0\]\}>/m,
  `case "lamp":
        return (
          <group position={[0, 10, 0]}>`
);

content = content.replace(
  /<mesh castShadow receiveShadow position=\{\[-2, -5, 0\]\}>\s*<cylinderGeometry args=\{\[0\.3, 0\.3, 10\]\} \/>\s*<meshPhysicalMaterial color="silver" metalness=\{0\.8\} \/>\s*<\/mesh>\s*<mesh castShadow receiveShadow position=\{\[2, -5, 0\]\}>/,
  `<mesh castShadow receiveShadow position={[-5, -5, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 10]} />
               <meshPhysicalMaterial color="silver" metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -5, 0]}>`
);

content = content.replace(
  /<mesh castShadow receiveShadow position=\{\[-2, -9, 0\]\}>\s*<cylinderGeometry args=\{\[0\.3, 0\.3, 5\]\} \/>\s*<meshPhysicalMaterial color="silver" \/>\s*<\/mesh>\s*<mesh castShadow receiveShadow position=\{\[2, -9, 0\]\}>/,
  `<mesh castShadow receiveShadow position={[-5, -9, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 5]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -9, 0]}>`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched LED and lamp");
