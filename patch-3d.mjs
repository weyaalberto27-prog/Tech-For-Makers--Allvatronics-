import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

const oldPcbComponentItem = `  let Component3D = (
    <group>
      {compType === "pad" || compType === "via" ? (
        <HighQualityMesh
          type={compType}
          isActive={isActive}
          isBroken={isBroken}
        />
      ) : null}
      
      {/* Silkscreen Reference Designator */}`;

const newPcbComponentItem = `  const isSpecial = compType === "pad" || compType === "via" || compType === "copper_pour" || compType === "mounting_hole" || compType === "fiducial" || compType === "silkscreen_text";
  
  let w = 0, d = 0;
  if (!isSpecial) {
      const pins = getPcbComponentPins({ componentType: compType, name: el.name, customProps: el.customProps });
      if (pins && pins.length > 0) {
          const xs = pins.map(p => p.x);
          const ys = pins.map(p => p.y);
          w = (Math.max(...xs) - Math.min(...xs)) + 6;
          d = (Math.max(...ys) - Math.min(...ys)) + 6;
          if (w < 4) w = 4;
          if (d < 4) d = 4;
      }
  }

  let Component3D = (
    <group>
      {compType === "pad" || compType === "via" ? (
        <HighQualityMesh
          type={compType}
          isActive={isActive}
          isBroken={isBroken}
        />
      ) : null}

      {/* Silkscreen Outline */}
      {!isSpecial && w > 0 && d > 0 && (
          <group position={[0, 0.15, 0]}>
             <mesh position={[0, 0, d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[0, 0, -d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[-w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
          </group>
      )}
      
      {/* Silkscreen Reference Designator */}`;

content = content.replace(oldPcbComponentItem, newPcbComponentItem);
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
