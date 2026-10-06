import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const oldCode = `                  case "cr2032":`;
const newCode = `      case "battery_9v":
        return (
          <group position={[0, 12, 0]}>
             <mesh position={[0, 0, 0]}>
               <boxGeometry args={[26, 26, 16]} />
               <meshStandardMaterial color="#1e293b" />
             </mesh>
             <Text position={[0, 0, 8.1]} fontSize={5} color="#fbbf24">9V</Text>
             {/* Terminals extending to pads */}
             {/* Positive */}
             <mesh position={[-10, -12, 0]}>
                <cylinderGeometry args={[2, 2, 4]} />
                <meshStandardMaterial color="#ef4444" metalness={0.8} />
             </mesh>
             {/* Negative */}
             <mesh position={[10, -12, 0]}>
                <cylinderGeometry args={[2, 2, 4]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.8} />
             </mesh>
          </group>
        );
                  case "cr2032":`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/components/Meshes3D.tsx', content);
