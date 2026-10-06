import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

const silkRegex = /\{compType === 'capacitor_elec' \|\| compType === 'led' \? \([\s\S]*?\} \)/m;

const newSilk = `{compType === 'capacitor_elec' ? (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[6.2, 7.2, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : compType === 'led' ? (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[3.0, 3.5, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : (
                <>
                   <mesh position={[0, 0, d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[0, 0, -d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[-w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                </>
             )}`;

content = content.replace(silkRegex, newSilk);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Patched silkscreen");
