const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const t = `  return (
    <group position={[0, 4, 15]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[88, 4, 88]} />
        <meshPhysicalMaterial color="#001a33" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.5, 6]}>
        <boxGeometry args={[75, 4, 50]} />
        <meshPhysicalMaterial
          color="#000"
          metalness={0.9}
          clearcoatRoughness={0.1}
          roughness={0.1}
          clearcoat={1.0}
        />
      </mesh>
      {isActive && !isBroken && (
        <group position={[0, 4.6, 6]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh castShadow receiveShadow>
            <planeGeometry args={[73, 48]} />
            <meshPhysicalMaterial
              color="#0f0f0f"
              emissive="#111"
              emissiveIntensity={2}
            />
          </mesh>
          <group position={[-34, 20, 0]}>
             {oledBuffer.map((item, idx) => (
                 <Text key={idx} position={[item.x, -item.y, 0]} fontSize={8 * item.size} color="#38bdf8" anchorX="left" anchorY="top">
                   {item.text}
                 </Text>
             ))}
          </group>
        </group>
      )}
      <mesh castShadow receiveShadow position={[0, 2.5, -28]}>
        <boxGeometry args={[44, 2, 10]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      {/* Pins at z = 40 (which makes it 55 in global if group is at 15) */}
      {[-22, -7.3, 7.3, 22].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, -4, 40]}>
          <cylinderGeometry args={[2, 2, 8]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );`;

const r = `  return (
    <group position={[0, 0, 0]}>
      <group position={[0, 2, 0]} scale={0.33}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[88, 4, 88]} />
          <meshPhysicalMaterial color="#001a33" roughness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2.5, 6]}>
          <boxGeometry args={[75, 4, 50]} />
          <meshPhysicalMaterial color="#000" metalness={0.9} clearcoatRoughness={0.1} roughness={0.1} clearcoat={1.0} />
        </mesh>
        {isActive && !isBroken && (
          <group position={[0, 4.6, 6]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh castShadow receiveShadow>
              <planeGeometry args={[73, 48]} />
              <meshPhysicalMaterial color="#0f0f0f" emissive="#111" emissiveIntensity={2} />
            </mesh>
            <group position={[-34, 20, 0]}>
               {oledBuffer.map((item, idx) => (
                   <Text key={idx} position={[item.x, -item.y, 0]} fontSize={8 * item.size} color="#38bdf8" anchorX="left" anchorY="top">
                     {item.text}
                   </Text>
               ))}
            </group>
          </group>
        )}
        <mesh castShadow receiveShadow position={[0, 2.5, -28]}>
          <boxGeometry args={[44, 2, 10]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>
      {/* Pins at z = -12 */}
      {[-7.5, -2.5, 2.5, 7.5].map((x, i) => (
        <mesh castShadow receiveShadow key={i} position={[x, -1, -12]}>
          <cylinderGeometry args={[0.4, 0.4, 4]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );`;

code = code.replace(t, r);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
