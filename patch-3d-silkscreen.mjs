import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');

const regex = /let w = 0, d = 0;\s*if \(\!isSpecial\) \{[\s\S]*?if \(d < 4\) d = 4;\s*\}\s*\}/;

const newBlock = `let w = 0, d = 0, scx = 0, scy = 0;
  if (!isSpecial) {
      const pins = getPcbComponentPins({ componentType: compType, name: el.name, customProps: el.customProps });
      if (pins && pins.length > 0) {
          const xs = pins.map((p: any) => p.x);
          const ys = pins.map((p: any) => p.y);
          xs.push(0);
          ys.push(0);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          w = (maxX - minX) + 20;
          d = (maxY - minY) + 20;
          scx = (minX + maxX) / 2;
          scy = (minY + maxY) / 2;
          if (w < 4) w = 4;
          if (d < 4) d = 4;
      }
  }`;

content = content.replace(regex, newBlock);

const regex2 = /\{!\isSpecial && w > 0 && d > 0 && \([\s\S]*?<\/group>\s*\)/;
const newBlock2 = `{!isSpecial && w > 0 && d > 0 && (
          <group position={[scx, 0.15, scy]}>
             <mesh position={[0, 0, d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[0, 0, -d/2]}><boxGeometry args={[w, 0.1, 0.5]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
             <mesh position={[-w/2, 0, 0]}><boxGeometry args={[0.5, 0.1, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.8}/></mesh>
          </group>
      )}`;

content = content.replace(regex2, newBlock2);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Patched 3D silkscreen bounding box");
