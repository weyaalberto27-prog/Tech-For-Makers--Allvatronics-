const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const mcuCode = `
function ArduinoUno3D({ isPCB }: { isPCB?: boolean }) {
  // Typical Uno size approx 68.6 x 53.4 mm.
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
         {/* Using a box, but an Arduino has a custom shape. We'll use a box for simplicity but with nice teal color */}
         <boxGeometry args={[68.6 * 1.6, 1.5, 53.4 * 1.6]} />
         <meshPhysicalMaterial color="#005e7a" roughness={0.7} />
      </mesh>
      
      {/* USB-B Port */}
      <mesh castShadow receiveShadow position={[-45, 4, 30]}>
         <boxGeometry args={[12, 10, 16]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* DC Power Jack */}
      <mesh castShadow receiveShadow position={[-45, 4, -20]}>
         <boxGeometry args={[14, 10, 10]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      
      {/* ATmega328P DIP */}
      <mesh castShadow receiveShadow position={[10, 3, -15]}>
         <boxGeometry args={[35, 3, 10]} />
         <meshPhysicalMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <Text position={[10, 5, -15]} rotation={[-Math.PI/2, 0, 0]} fontSize={2.5} color="#64748b">ATMEGA328P-PU</Text>

      {/* CH340 / 16U2 */}
      <mesh castShadow receiveShadow position={[-20, 2.5, 15]}>
         <boxGeometry args={[6, 1.5, 6]} />
         <meshPhysicalMaterial color="#1f2937" />
      </mesh>

      {/* Headers (Top and Bottom) */}
      <mesh castShadow receiveShadow position={[0, 4, 38]}>
         <boxGeometry args={[60, 5, 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[5, 4, -38]}>
         <boxGeometry args={[50, 5, 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      
      {/* Reset Button */}
      <mesh castShadow receiveShadow position={[-30, 3, 38]}>
         <boxGeometry args={[4, 2, 4]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-30, 4.5, 38]}>
         <cylinderGeometry args={[1, 1, 1]} />
         <meshPhysicalMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function ESP32_3D({ isPCB, isS3 = false }: { isPCB?: boolean, isS3?: boolean }) {
  // ESP32 DevKit V1 typically 30 pins, ~ 52x28 mm
  const w = 28 * 1.6;
  const l = 52 * 1.6;
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[w, 1.5, l]} />
         <meshPhysicalMaterial color="#111827" roughness={0.8} />
      </mesh>
      
      {/* Metal Shield */}
      <mesh castShadow receiveShadow position={[0, 2.5, 15]}>
         <boxGeometry args={[w - 12, 3, 24]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
      </mesh>
      <Text position={[0, 4.1, 15]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#334155">
         {isS3 ? "ESP32-S3-WROOM" : "ESP32-WROOM-32"}
      </Text>

      {/* Antenna Trace Area */}
      <mesh castShadow receiveShadow position={[0, 2, 35]}>
         <boxGeometry args={[w - 12, 1, 8]} />
         <meshPhysicalMaterial color="#020617" />
      </mesh>
      {/* Zig zag trace */}
      <mesh castShadow receiveShadow position={[0, 2.6, 35]}>
         <boxGeometry args={[w - 16, 0.1, 4]} />
         <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* USB Port (Micro or Type-C) */}
      <mesh castShadow receiveShadow position={[0, 2.5, -l/2 + 2]}>
         <boxGeometry args={[8, 3, 6]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      {isS3 && (
        <mesh castShadow receiveShadow position={[12, 2.5, -l/2 + 2]}>
           <boxGeometry args={[8, 3, 6]} />
           <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      )}

      {/* Buttons EN / BOOT */}
      <mesh castShadow receiveShadow position={[-10, 2.5, -20]}>
         <boxGeometry args={[3, 1.5, 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[-10, 3.5, -20]}>
         <cylinderGeometry args={[0.8, 0.8, 0.5]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>

      <mesh castShadow receiveShadow position={[10, 2.5, -20]}>
         <boxGeometry args={[3, 1.5, 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[10, 3.5, -20]}>
         <cylinderGeometry args={[0.8, 0.8, 0.5]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* Headers */}
      <mesh castShadow receiveShadow position={[-w/2 + 2, 4, 0]}>
         <boxGeometry args={[2.5, 5, l - 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[w/2 - 2, 4, 0]}>
         <boxGeometry args={[2.5, 5, l - 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
    </group>
  );
}

function RaspberryPi3D({ isPCB }: { isPCB?: boolean }) {
  // ~85x56 mm
  const w = 56 * 1.6;
  const l = 85 * 1.6;
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[w, 1.5, l]} />
         <meshPhysicalMaterial color="#166534" roughness={0.7} />
      </mesh>
      
      {/* Broadcom SoC */}
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
         <boxGeometry args={[14, 2, 14]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.6, 0]}>
         <boxGeometry args={[10, 0.2, 10]} />
         <meshPhysicalMaterial color="#64748b" metalness={0.8} />
      </mesh>

      {/* RAM (if Pi 4, otherwise stacked) */}
      <mesh castShadow receiveShadow position={[15, 2.5, 10]}>
         <boxGeometry args={[12, 1.5, 10]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* USB Ports Stack */}
      <mesh castShadow receiveShadow position={[-w/2 + 10, 8, l/2 - 10]}>
         <boxGeometry args={[15, 16, 18]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 30, 8, l/2 - 10]}>
         <boxGeometry args={[15, 16, 18]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>

      {/* Ethernet Port */}
      <mesh castShadow receiveShadow position={[w/2 - 15, 7, l/2 - 10]}>
         <boxGeometry args={[16, 14, 22]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* 40-pin Header */}
      <mesh castShadow receiveShadow position={[w/2 - 5, 5, -l/2 + 35]}>
         <boxGeometry args={[5, 6, 50]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      {/* Pins sticking out */}
      <mesh castShadow receiveShadow position={[w/2 - 5, 8, -l/2 + 35]}>
         <boxGeometry args={[2, 4, 48]} />
         <meshPhysicalMaterial color="#d4af37" metalness={0.9} />
      </mesh>

      {/* HDMI / Power */}
      <mesh castShadow receiveShadow position={[-w/2 + 5, 3, -10]}>
         <boxGeometry args={[8, 3, 12]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 5, 3, -30]}>
         <boxGeometry args={[8, 3, 12]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
    </group>
  );
}

function LDR3D() {
  return (
    <group position={[0, 2, 0]}>
      {/* Pins */}
      <mesh castShadow receiveShadow position={[-5, -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, 8]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[5, -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, 8]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      {/* Ceramic Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
         <cylinderGeometry args={[6, 6, 1.5, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
      {/* Track Pattern (Simple visual rep) */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
         <cylinderGeometry args={[5, 5, 0.1, 32]} />
         <meshPhysicalMaterial color="#fcd34d" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
         {/* using a plane with wireframe or just some zigzag lines. we will use a textured looking orange line */}
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, 2]}>
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, -2]}>
         <boxGeometry args={[8, 0.1, 1]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[-4, 0.85, 1]}>
         <boxGeometry args={[1, 0.1, 3]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[4, 0.85, -1]}>
         <boxGeometry args={[1, 0.1, 3]} />
         <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
      </mesh>
      {/* Epoxy Coating */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
         <cylinderGeometry args={[6.1, 6.1, 2, 32]} />
         <meshPhysicalMaterial color="#fff" transparent opacity={0.3} roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}

function CR20323D() {
  return (
    <group position={[0, 2, 0]}>
      {/* Battery Holder base */}
      <mesh castShadow receiveShadow position={[0, -1, 0]}>
         <cylinderGeometry args={[11, 11, 2, 32]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      {/* Battery */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
         <cylinderGeometry args={[10, 10, 2, 32]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Rim */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
         <cylinderGeometry args={[9.5, 9.5, 1.1, 32]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Top engraving */}
      <Text position={[0, 2.1, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#94a3b8">CR2032</Text>
      <Text position={[0, 2.1, 4]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#94a3b8">+ 3V</Text>
      {/* Holder Metal Clip */}
      <mesh castShadow receiveShadow position={[0, 2.2, -8]}>
         <boxGeometry args={[4, 0.4, 6]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      {/* Pins */}
      <mesh castShadow receiveShadow position={[-15, -4, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 6]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[15, -4, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 6]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
    </group>
  );
}

function OLED3D({ isActive }: { isActive?: boolean }) {
  return (
    <group position={[0, 2, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[28, 1.5, 28]} />
         <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      {/* Pins Header */}
      <mesh castShadow receiveShadow position={[0, 2.5, 12]}>
         <boxGeometry args={[10, 3, 2.5]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      {[-3.75, -1.25, 1.25, 3.75].map(x => (
        <mesh castShadow receiveShadow key={x} position={[x, -2, 12]}>
           <cylinderGeometry args={[0.3, 0.3, 10]} />
           <meshPhysicalMaterial color="silver" />
        </mesh>
      ))}
      <Text position={[-3.75, 1.6, 10]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#fff">GND</Text>
      <Text position={[-1.25, 1.6, 10]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#fff">VCC</Text>
      <Text position={[1.25, 1.6, 10]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#fff">SCL</Text>
      <Text position={[3.75, 1.6, 10]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#fff">SDA</Text>

      {/* Glass Screen */}
      <mesh castShadow receiveShadow position={[0, 1.5, -2]}>
         <boxGeometry args={[24, 2, 16]} />
         <meshPhysicalMaterial color="#020617" roughness={0.1} clearcoat={1.0} />
      </mesh>
      
      {/* Active Screen Area */}
      <mesh castShadow receiveShadow position={[0, 2.51, -2]}>
         <planeGeometry args={[20, 12]} />
         <meshPhysicalMaterial 
           color={isActive ? "#38bdf8" : "#020617"} 
           emissive={isActive ? "#38bdf8" : "#000"} 
           emissiveIntensity={isActive ? 1 : 0} 
         />
      </mesh>
      {isActive && (
        <Text position={[0, 2.52, -2]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#fff">Hello</Text>
      )}
    </group>
  );
}

function SevenSegment3D({ isActive, value }: { isActive?: boolean, value?: string }) {
  // A typical 1-digit 7-segment display is a black plastic box with translucent segments.
  const isLit = isActive;
  const segColorLit = "#ef4444";
  const segColorOff = "#450a0a";
  const char = value || "8";
  
  // Very crude segment map just for visual flavor
  const segments = [
    { p: [0, 4.5, -8], s: [8, 1, 1.5] }, // A
    { p: [4.5, 4.5, -4], s: [1.5, 1, 8] }, // B
    { p: [4.5, 4.5, 4], s: [1.5, 1, 8] }, // C
    { p: [0, 4.5, 8], s: [8, 1, 1.5] }, // D
    { p: [-4.5, 4.5, 4], s: [1.5, 1, 8] }, // E
    { p: [-4.5, 4.5, -4], s: [1.5, 1, 8] }, // F
    { p: [0, 4.5, 0], s: [8, 1, 1.5] }, // G
  ];

  return (
    <group position={[0, 4, 0]}>
      {/* Plastic Body */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[16, 8, 22]} />
         <meshPhysicalMaterial color="#111827" roughness={0.8} />
      </mesh>
      
      {/* Pins */}
      {[-5, 5].map(x => 
        [-8, -4, 0, 4, 8].map(z => (
          <mesh castShadow receiveShadow key={x+z} position={[x, -8, z]}>
             <cylinderGeometry args={[0.3, 0.3, 8]} />
             <meshPhysicalMaterial color="silver" />
          </mesh>
        ))
      )}

      {/* Segments */}
      {segments.map((seg, i) => (
        <mesh castShadow receiveShadow key={i} position={seg.p as [number,number,number]}>
           <boxGeometry args={seg.s as [number,number,number]} />
           <meshPhysicalMaterial 
             color={isLit ? segColorLit : segColorOff} 
             emissive={isLit ? segColorLit : "#000"} 
             emissiveIntensity={isLit ? 2 : 0} 
             transparent opacity={0.9} 
           />
        </mesh>
      ))}
      {/* DP */}
      <mesh castShadow receiveShadow position={[6, 4.5, 9]}>
         <cylinderGeometry args={[1, 1, 1]} />
         <meshPhysicalMaterial 
             color={isLit ? segColorLit : segColorOff} 
             emissive={isLit ? segColorLit : "#000"} 
             emissiveIntensity={isLit ? 2 : 0} 
         />
      </mesh>
    </group>
  );
}

`;

content = content.replace('function STM32BluePill3D', mcuCode + 'function STM32BluePill3D');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
