const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const regex = /case "resistor":[\s\S]*?case "capacitor":/;
const newResistor = `case "resistor":
        const bands = getResistorColors(
          value || customProps?.resistance?.toString() || "10",
        );
        return (
          <group position={[0, isPCB ? 5.5 : 2, 0]}>
            {/* Pins */}
            <mesh castShadow receiveShadow position={[-10, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -4.5 : -5, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 8 : 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -4.5 : -5, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 8 : 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            
            {/* Body */}
            <mesh castShadow receiveShadow
              position={[0, -2, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[3, 3, 20, 16]} />
              <meshPhysicalMaterial color="#eecb9b" roughness={0.8} />
            </mesh>
            
            {/* Ends */}
            <mesh castShadow receiveShadow position={[-9.5, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.4, 3.4, 3, 16]} />
              <meshPhysicalMaterial color="#eecb9b" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-11, -2, 0]}>
              <sphereGeometry args={[3.4, 16, 16]} />
              <meshPhysicalMaterial color="#eecb9b" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[9.5, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.4, 3.4, 3, 16]} />
              <meshPhysicalMaterial color="#eecb9b" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[11, -2, 0]}>
              <sphereGeometry args={[3.4, 16, 16]} />
              <meshPhysicalMaterial color="#eecb9b" roughness={0.8} />
            </mesh>
            
            {/* Color Bands */}
            <mesh castShadow receiveShadow position={[-7, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.05, 3.05, 1.5, 16]} />
              <meshPhysicalMaterial color={bands[0]} roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[-3, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.05, 3.05, 1.5, 16]} />
              <meshPhysicalMaterial color={bands[1]} roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[1, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.05, 3.05, 1.5, 16]} />
              <meshPhysicalMaterial color={bands[2]} roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[7, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.05, 3.05, 1.5, 16]} />
              <meshPhysicalMaterial
                color={bands[3]}
                roughness={0.7}
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </mesh>
          </group>
        );
      case "capacitor":`;

code = code.replace(regex, newResistor);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
