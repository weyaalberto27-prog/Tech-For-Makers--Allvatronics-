const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const replacement = `      case "smd": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 2;
        if (p > 2) {
            const l = (p / 2) * 1.5;
            return <SOP_IC3D pins={p} length={Math.max(6, l)} width={4} value={value} type={type} isPCB={isPCB} />;
        }
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
              <boxGeometry args={[14, 2, 12]} />
              <meshPhysicalMaterial color="#1a1c1e" emissiveIntensity={0} roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[7, 0.5, 0]}>
              <boxGeometry args={[4, 1, 12]} />
              <meshPhysicalMaterial color="silver" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[-7, 0.5, 0]}>
              <boxGeometry args={[4, 1, 12]} />
              <meshPhysicalMaterial color="silver" metalness={0.9} roughness={0.2} />
            </mesh>
            <Text position={[0, 2.1, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={4} color="#555">{value}</Text>
          </group>
        );
      }`;

content = content.replace(/case "smd":[\s\S]*?(?=case "sot23":)/, replacement + '\n');
fs.writeFileSync('src/components/Meshes3D.tsx', content);
console.log("SMD patched!");
