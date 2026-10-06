const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regexLed = /case "led": \{[\s\S]*?case "rgb_led":/;
const newLed = `case "led": {
        const ledColor =
          customProps?.color || value || (type === "led_red" ? "red" : type === "led_green" ? "green" : type === "led_blue" ? "blue" : type === "led_yellow" ? "yellow" : "red");
        const hexColor =
          ledColor === "red"
            ? "#ef4444"
            : ledColor === "green"
            ? "#22c55e"
            : ledColor === "blue"
            ? "#3b82f6"
            : ledColor === "yellow"
            ? "#eab308"
            : "#ef4444";
        return (
          <group position={[0, isPCB ? 4 : 5, 0]}>
            <mesh castShadow receiveShadow position={[-5, isPCB ? -2 : -5, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, isPCB ? -2 : -5, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-5, -4.5, 0]}>
                  <cylinderGeometry args={[1, 1, 1]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[5, -4.5, 0]}>
                  <cylinderGeometry args={[1, 1, 1]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
              </>
            )}
            <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
              <cylinderGeometry args={[10, 10, 12]} />
              <meshPhysicalMaterial
                color={hexColor}
                emissive={hexColor}
                emissiveIntensity={isActive && !isBroken ? 2 : 0.1}
                transparent
                opacity={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 5.5, 0]}>
              <sphereGeometry args={[10, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
              <meshPhysicalMaterial
                color={hexColor}
                emissive={hexColor}
                emissiveIntensity={isActive && !isBroken ? 2 : 0.1}
                transparent
                opacity={0.8}
                roughness={0.2}
                clearcoat={1}
              />
            </mesh>
            {isActive && !isBroken && (
              <pointLight color={hexColor} intensity={2} distance={50} position={[0, 10, 0]} />
            )}
          </group>
        );
      }
      case "rgb_led":`;
code = code.replace(regexLed, newLed);

const regexPot = /case "potentiometer": return \([\s\S]*?case "ground":/;
const newPot = `case "potentiometer": return (<group position={[0, 5, 0]}>
             {/* Metal base shell */}
             <mesh castShadow receiveShadow position={[0, -2, 0]}>
               <cylinderGeometry args={[12, 12, 8, 32]} />
               <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.4} />
             </mesh>
             {/* Base bottom plastic */}
             <mesh castShadow receiveShadow position={[0, -6.5, 0]}>
               <cylinderGeometry args={[11.8, 11.8, 1, 32]} />
               <meshPhysicalMaterial color="#0f172a" />
             </mesh>
             {/* Shaft Base/Thread */}
             <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
               <cylinderGeometry args={[4.5, 4.5, 3, 32]} />
               <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
             </mesh>
             {/* Rotating Shaft with flat cut */}
             <mesh castShadow receiveShadow position={[0, 9, 0]}>
               <cylinderGeometry args={[3.5, 3.5, 8, 32, 1, false, 0, Math.PI * 1.8]} />
               <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.5} />
             </mesh>
             <mesh castShadow receiveShadow position={[0, 9, 0]}>
                <boxGeometry args={[3, 8, 7]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.5} />
             </mesh>
             {/* Pins */}
             {[-10, 0, 10].map(x => (
               <mesh castShadow receiveShadow key={x} position={[x, -8, 12]}>
                 <boxGeometry args={[1, 4, 0.5]} />
                 <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
               </mesh>
             ))}
             {/* Lead extensions from pin to body */}
             {[-10, 0, 10].map(x => (
               <mesh castShadow receiveShadow key={'ext'+x} position={[x/2, -6, 6]}>
                 <cylinderGeometry args={[0.3, 0.3, 12]} />
                 <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
               </mesh>
             ))}
          </group>
        );
      case "ground":`;
code = code.replace(regexPot, newPot);

fs.writeFileSync('src/components/Meshes3D.tsx', code);
