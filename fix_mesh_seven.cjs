const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t = `      case "seven_segment":
        return (
          <group position={[15, 4, 16]}>
            {/* Realistic 7-Segment Display (Kingbright style) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[26, 8, 38]} />
              <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.8}
                clearcoat={0.1}
              />
            </mesh>
            {/* Black / Gray Face */}
            <mesh castShadow receiveShadow position={[0, 4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[22, 34]} />
              <meshPhysicalMaterial color="#18181b" roughness={0.8} />
            </mesh>
            <Text
              position={[0, 4.11, -15]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.4}
              color="#52525b"
            >
              HDSP-3901
            </Text>

            {/* Glowing Segments */}`;

const r = `      case "seven_segment":
        return (
          <group position={[0, 4, 0]}>
            {/* Realistic 7-Segment Display (Kingbright style) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[26, 8, 38]} />
              <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.8}
                clearcoat={0.1}
              />
            </mesh>
            {/* Black / Gray Face */}
            <mesh castShadow receiveShadow position={[0, 4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[22, 34]} />
              <meshPhysicalMaterial color="#18181b" roughness={0.8} />
            </mesh>
            <Text
              position={[0, 4.11, -15]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.4}
              color="#52525b"
            >
              HDSP-3901
            </Text>
            
            {/* Pins going down */}
            {[-10, -5, 0, 5, 10].map(x => (
              <group key={x}>
                <mesh castShadow receiveShadow position={[x, -5, -15]}>
                  <cylinderGeometry args={[0.4, 0.4, 4]} />
                  <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[x, -5, 15]}>
                  <cylinderGeometry args={[0.4, 0.4, 4]} />
                  <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
                </mesh>
              </group>
            ))}

            {/* Glowing Segments */}`;

code = code.replace(t, r);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
