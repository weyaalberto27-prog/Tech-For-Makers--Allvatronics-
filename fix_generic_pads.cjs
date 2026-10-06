const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const t = `  return (
    <group
      ref={groupRef}
      position={[cx, absoluteY, cz]}
      rotation={[0, -rot, 0]}
      scale={[1, layer === "bottom" ? -1 : 1, 1]}
    >
      {Component3D}
    </group>
  );`;

const r = `  // Generic Pads
  const pins = getPcbComponentPins({ componentType: compType, name: el.name, customProps: (el as any).customProps });
  const isSMD = ["smd", "sot23", "sop", "cr2032"].includes(compType);
  
  return (
    <group
      ref={groupRef}
      position={[cx, absoluteY, cz]}
      rotation={[0, -rot, 0]}
      scale={[1, layer === "bottom" ? -1 : 1, 1]}
    >
      {/* Generic gold pads on top and bottom */}
      {mode === "pcb" && compType !== "pad" && compType !== "via" && pins.map((p: any, i: number) => {
         const px = p.x;
         const pz = p.y; // mapping y from 2d to z in 3d
         return (
           <group key={'genpad_'+i} position={[px, 0, pz]}>
             <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
               <cylinderGeometry args={[1.6, 1.6, 0.05, 16]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
             </mesh>
             {!isSMD && (
                 <mesh castShadow receiveShadow position={[0, -0.45, 0]}>
                   <cylinderGeometry args={[1.6, 1.6, 0.05, 16]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                 </mesh>
             )}
             {!isSMD && (
                 <mesh castShadow receiveShadow position={[0, 1.25, 0]}>
                   <cylinderGeometry args={[0.6, 0.6, 0.06, 16]} />
                   <meshPhysicalMaterial color="#0f0f13" />
                 </mesh>
             )}
           </group>
         );
      })}
      {Component3D}
    </group>
  );`;

code = code.replace(t, r);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', code);
