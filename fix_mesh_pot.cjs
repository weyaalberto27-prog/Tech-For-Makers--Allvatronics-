const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t = `      case "potentiometer":
        return (
          <group position={[15, 8, 0]}>
             <mesh castShadow receiveShadow position={[0, -2, 0]}>
               <cylinderGeometry args={[8, 8, 6]} />
               <meshPhysicalMaterial color="#111" />
             </mesh>
             <mesh castShadow receiveShadow position={[0, 5, 0]}>
               <cylinderGeometry args={[3, 3, 10]} />
               <meshPhysicalMaterial color="#64748b" metalness={0.6} />
             </mesh>
             {[-4, 0, 4].map(x => (
               <mesh castShadow receiveShadow key={x} position={[x, -8, -5]}>
                 <boxGeometry args={[1, 6, 0.5]} />
                 <meshPhysicalMaterial color="silver" />
               </mesh>
             ))}
          </group>
        );`;

const r = `      case "potentiometer":
        return (
          <group position={[0, 5, 0]}>
             <mesh castShadow receiveShadow position={[0, -2, 0]}>
               <cylinderGeometry args={[8, 8, 6]} />
               <meshPhysicalMaterial color="#111" />
             </mesh>
             <mesh castShadow receiveShadow position={[0, 5, 0]}>
               <cylinderGeometry args={[3, 3, 10]} />
               <meshPhysicalMaterial color="#64748b" metalness={0.6} />
             </mesh>
             {[-5, 0, 5].map(x => (
               <mesh castShadow receiveShadow key={x} position={[x, -6, -5]}>
                 <boxGeometry args={[1, 4, 0.5]} />
                 <meshPhysicalMaterial color="silver" />
               </mesh>
             ))}
          </group>
        );`;

code = code.replace(t, r);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
