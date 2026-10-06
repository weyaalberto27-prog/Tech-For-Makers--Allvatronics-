import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

const silkscreenBlock = `      {/* Silkscreen Outline */}
      {!isSpecial && w > 0 && d > 0 && (
          <group position={[scx, 0.15, scy]}>
             {compType === 'capacitor_elec' ? (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[6.5, 7.5, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : (
                <>
                   <mesh position={[0, 0, d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[0, 0, -d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                   <mesh position={[-w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
                </>
             )}
          </group>
      )}`;

content = content.replace(/\{\/\* Silkscreen Outline \*\/\}[\s\S]*?<\/group>\s*\)\}/, silkscreenBlock);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Patched 3D Silkscreen to support circle for capacitor_elec");
