const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Replace OLED3D with OLED3DMesh combined logic
const newOLED = `
function OLED3D({ isActive, isBroken }: { isActive?: boolean, isBroken?: boolean }) {
  const [oledBuffer, setOledBuffer] = React.useState<any[]>([]);
  const oledBufferRef = React.useRef<any[]>([]);

  React.useEffect(() => {
    let frameId: number;
    const loop = () => {
      const b = (window as any)._oledDisplayBuffer;
      if (b && JSON.stringify(b) !== JSON.stringify(oledBufferRef.current)) {
        oledBufferRef.current = b;
        setOledBuffer(b);
      }
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <group position={[0, 2, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[32, 1.5, 32]} />
         <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      {/* Pins Header */}
      <mesh castShadow receiveShadow position={[0, 2.5, 14]}>
         <boxGeometry args={[10, 3, 2.5]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      {[-3.75, -1.25, 1.25, 3.75].map(x => (
        <mesh castShadow receiveShadow key={x} position={[x, -2, 14]}>
           <cylinderGeometry args={[0.3, 0.3, 10]} />
           <meshPhysicalMaterial color="silver" />
        </mesh>
      ))}
      <Text position={[-3.75, 1.6, 11]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">GND</Text>
      <Text position={[-1.25, 1.6, 11]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">VCC</Text>
      <Text position={[1.25, 1.6, 11]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SCL</Text>
      <Text position={[3.75, 1.6, 11]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SDA</Text>

      {/* Glass Screen */}
      <mesh castShadow receiveShadow position={[0, 1.5, -2]}>
         <boxGeometry args={[26, 2, 18]} />
         <meshPhysicalMaterial color="#020617" roughness={0.1} clearcoat={1.0} />
      </mesh>
      
      {/* Active Screen Area */}
      <mesh castShadow receiveShadow position={[0, 2.51, -2]}>
         <planeGeometry args={[24, 14]} />
         <meshPhysicalMaterial 
           color="#000" 
           emissive="#000" 
         />
      </mesh>
      {isActive && !isBroken && (
        <group position={[0, 2.52, -2]} rotation={[-Math.PI / 2, 0, 0]}>
          {oledBuffer.map((line, i) => (
            <Text
              key={i}
              position={[-11, 5 - i * 1.5, 0]}
              fontSize={1.2}
              color="#38bdf8"
              anchorX="left"
              anchorY="top"
              font="monospace"
            >
              {line}
            </Text>
          ))}
          {oledBuffer.length === 0 && (
            <Text position={[0, 0, 0]} fontSize={2} color="#38bdf8" anchorX="center" anchorY="middle">
              {/* Ready */}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}`;

content = content.replace(/function OLED3D\(\{ isActive \}: \{ isActive\?: boolean \}\) \{[\s\S]*?<\group>\s*\);\s*\}/, newOLED);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
