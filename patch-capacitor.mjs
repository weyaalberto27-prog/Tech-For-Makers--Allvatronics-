import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const regex = /case "capacitor":\s*return \(\s*<group position=\{\[25, 3, 0\]\}>/;
const newBlock = `case "capacitor":
        return (
          <group position={[0, 6, 0]}>`;

content = content.replace(regex, newBlock);

const leadsRegex = /\{\/\* Leads \*\/\}[^]+?\{\/\* Ceramic Body/m;
const newLeads = `{/* Leads */}
            <mesh castShadow receiveShadow position={[-20, -5, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[20, -5, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Ceramic Body`;

content = content.replace(leadsRegex, newLeads);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("Patched capacitor position");
