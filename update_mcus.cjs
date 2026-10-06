const fs = require('fs');
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const mcuCode = `
function ArduinoUno3D({ isPCB }: { isPCB?: boolean }) {
  // Typical Uno size approx 68.6 x 53.4 mm.
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB - Custom shape approximation using two boxes */}
      <mesh castShadow receiveShadow position={[-2, 0, 0]}>
         <boxGeometry args={[65 * 1.6, 1.5, 53.4 * 1.6]} />
         <meshPhysicalMaterial color="#006680" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[45, 0, -5]}>
         <boxGeometry args={[10 * 1.6, 1.5, 46 * 1.6]} />
         <meshPhysicalMaterial color="#006680" roughness={0.8} />
      </mesh>
      
      {/* Silkscreen text */}
      <Text position={[15, 0.8, -10]} rotation={[-Math.PI/2, 0, 0]} fontSize={5} color="#ffffff" fontStyle="italic">UNO</Text>
      <Text position={[-5, 0.8, 5]} rotation={[-Math.PI/2, 0, 0]} fontSize={4} color="#ffffff">ARDUINO</Text>

      {/* USB-B Port */}
      <group position={[-45, 4, 30]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[14, 11, 16]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* USB hole */}
        <mesh position={[7.1, 0, 0]}>
           <boxGeometry args={[0.2, 9, 14]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* DC Power Jack */}
      <group position={[-45, 4, -25]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[14, 11, 11]} />
           <meshPhysicalMaterial color="#111827" roughness={0.6} />
        </mesh>
        {/* DC hole */}
        <mesh position={[7.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
           <cylinderGeometry args={[3, 3, 0.2, 16]} />
           <meshPhysicalMaterial color="#050505" />
        </mesh>
        <mesh position={[7.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
           <cylinderGeometry args={[1, 1, 1, 16]} />
           <meshPhysicalMaterial color="silver" />
        </mesh>
      </group>
      
      {/* ATmega328P DIP */}
      <group position={[15, 3, -20]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[35, 3.5, 12]} />
           <meshPhysicalMaterial color="#1f2937" roughness={0.8} />
        </mesh>
        {/* Chip pins */}
        {Array.from({length: 14}).map((_, i) => (
          <mesh key={i} castShadow receiveShadow position={[-16.25 + i * 2.5, -1, 6.5]}>
            <boxGeometry args={[1, 3, 1]} />
            <meshPhysicalMaterial color="silver" />
          </mesh>
        ))}
        {Array.from({length: 14}).map((_, i) => (
          <mesh key={'top'+i} castShadow receiveShadow position={[-16.25 + i * 2.5, -1, -6.5]}>
            <boxGeometry args={[1, 3, 1]} />
            <meshPhysicalMaterial color="silver" />
          </mesh>
        ))}
        {/* Notch */}
        <mesh castShadow receiveShadow position={[-17.5, 0.5, 0]}>
           <cylinderGeometry args={[1.5, 1.5, 4]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <Text position={[0, 2, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={2.5} color="#94a3b8">ATMEGA328P-PU</Text>
      </group>

      {/* CH340 / 16U2 (USB to Serial) */}
      <mesh castShadow receiveShadow position={[-20, 1.5, 10]}>
         <boxGeometry args={[6, 1, 6]} />
         <meshPhysicalMaterial color="#1f2937" />
      </mesh>
      <mesh castShadow receiveShadow position={[-25, 1.5, 15]} rotation={[0, Math.PI/4, 0]}>
         <boxGeometry args={[1.5, 1, 3]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>

      {/* Voltage Regulator */}
      <group position={[-25, 2, -10]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[5, 2, 8]} />
           <meshPhysicalMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.5, 4.5]}>
           <boxGeometry args={[5, 0.5, 2]} />
           <meshPhysicalMaterial color="silver" />
        </mesh>
      </group>

      {/* Capacitors */}
      <mesh castShadow receiveShadow position={[-20, 4, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 5]} />
         <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-20, 6.5, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 0.2]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[-12, 4, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 5]} />
         <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-12, 6.5, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 0.2]} />
         <meshPhysicalMaterial color="silver" />
      </mesh>

      {/* Headers (Top and Bottom) with holes */}
      <group position={[0, 3, 38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[60, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 16}).map((_, i) => (
          <mesh key={i} position={[-28 + i * 3.73, 3.1, 0]}>
             <boxGeometry args={[1.5, 0.1, 1.5]} />
             <meshPhysicalMaterial color="#050505" />
          </mesh>
        ))}
      </group>
      
      <group position={[5, 3, -38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[50, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 14}).map((_, i) => (
          <mesh key={i} position={[-24.2 + i * 3.73, 3.1, 0]}>
             <boxGeometry args={[1.5, 0.1, 1.5]} />
             <meshPhysicalMaterial color="#050505" />
          </mesh>
        ))}
      </group>
      
      {/* Reset Button */}
      <mesh castShadow receiveShadow position={[-30, 2, 38]}>
         <boxGeometry args={[5, 2, 5]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[-30, 3, 38]}>
         <cylinderGeometry args={[1.2, 1.2, 1]} />
         <meshPhysicalMaterial color="#ef4444" />
      </mesh>
      
      {/* ICSP Headers */}
      <group position={[35, 3, 5]}>
        <mesh castShadow receiveShadow position={[0, -1, 0]}>
           <boxGeometry args={[6, 2, 8]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {[-1.5, 1.5].map(x => (
          [-2.5, 0, 2.5].map(z => (
            <mesh key={'icsp'+x+z} castShadow receiveShadow position={[x, 1, z]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="silver" />
            </mesh>
          ))
        ))}
      </group>

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
      
      {/* Module Base PCB (Green/Blue/Black under shield) */}
      <mesh castShadow receiveShadow position={[0, 1.5, 15]}>
         <boxGeometry args={[w - 10, 1.6, 26]} />
         <meshPhysicalMaterial color="#1e293b" />
      </mesh>
      
      {/* Metal Shield */}
      <mesh castShadow receiveShadow position={[0, 3, 15]}>
         <boxGeometry args={[w - 12, 3, 24]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Shield Dimples */}
      <mesh castShadow receiveShadow position={[-w/2 + 8, 4.5, 10]}>
         <cylinderGeometry args={[0.8, 0.8, 0.2]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[w/2 - 8, 4.5, 10]}>
         <cylinderGeometry args={[0.8, 0.8, 0.2]} />
         <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      
      <Text position={[0, 4.6, 17]} rotation={[-Math.PI/2, 0, 0]} fontSize={2.5} color="#334155" anchorX="center" anchorY="middle">
         {isS3 ? "ESP32-S3-WROOM" : "ESP32-WROOM-32"}
      </Text>
      <Text position={[0, 4.6, 12]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#334155" anchorX="center" anchorY="middle">
         ESPRESSIF
      </Text>

      {/* Antenna Trace Area */}
      <mesh castShadow receiveShadow position={[0, 2, 35]}>
         <boxGeometry args={[w - 12, 1, 8]} />
         <meshPhysicalMaterial color="#020617" />
      </mesh>
      {/* Zig zag trace (Gold) */}
      <group position={[0, 2.51, 35]}>
         <mesh castShadow receiveShadow position={[-5, 0, 0]}>
           <boxGeometry args={[1, 0.1, 5]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         <mesh castShadow receiveShadow position={[-2, 0, 0]}>
           <boxGeometry args={[1, 0.1, 5]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         <mesh castShadow receiveShadow position={[1, 0, 0]}>
           <boxGeometry args={[1, 0.1, 5]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         <mesh castShadow receiveShadow position={[4, 0, 0]}>
           <boxGeometry args={[1, 0.1, 5]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         {/* Connecting horizontal bits */}
         <mesh castShadow receiveShadow position={[-3.5, 0, 2.5]}>
           <boxGeometry args={[3, 0.1, 1]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         <mesh castShadow receiveShadow position={[-0.5, 0, -2.5]}>
           <boxGeometry args={[3, 0.1, 1]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
         <mesh castShadow receiveShadow position={[2.5, 0, 2.5]}>
           <boxGeometry args={[3, 0.1, 1]} />
           <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
         </mesh>
      </group>

      {/* USB Port (Micro or Type-C) */}
      <group position={[0, 2.5, -l/2 + 2]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[10, 3, 7]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, -3.6]}>
           <boxGeometry args={[8, 1, 0.2]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>
      
      {/* USB-to-UART chip (CP2102 or CH340) */}
      <mesh castShadow receiveShadow position={[0, 1.5, -l/2 + 15]}>
         <boxGeometry args={[5, 1, 5]} />
         <meshPhysicalMaterial color="#1f2937" />
      </mesh>

      {/* AMS1117 3.3V Regulator */}
      <mesh castShadow receiveShadow position={[-10, 1.5, -l/2 + 10]}>
         <boxGeometry args={[4, 1, 6]} />
         <meshPhysicalMaterial color="#1f2937" />
      </mesh>
      
      {/* Buttons EN / BOOT */}
      <group position={[-12, 1.5, -l/2 + 20]}>
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
           <boxGeometry args={[4, 1.5, 5]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
           <cylinderGeometry args={[1, 1, 0.5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      <group position={[12, 1.5, -l/2 + 20]}>
        <mesh castShadow receiveShadow position={[0, 1, 0]}>
           <boxGeometry args={[4, 1.5, 5]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
           <cylinderGeometry args={[1, 1, 0.5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* Headers (Black Plastic) */}
      <mesh castShadow receiveShadow position={[-w/2 + 3, 3, 0]}>
         <boxGeometry args={[4, 4, l - 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[w/2 - 3, 3, 0]}>
         <boxGeometry args={[4, 4, l - 4]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      
      {/* Pins sticking up/down */}
      {Array.from({length: 15}).map((_, i) => {
        const z = - (14 * 5.4)/2 + i * 5.4;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-w/2 + 3, 1, z]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
            <mesh castShadow receiveShadow position={[w/2 - 3, 1, z]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
          </group>
        )
      })}
    </group>
  );
}

function RaspberryPi3D({ isPCB }: { isPCB?: boolean }) {
  // ~85x56 mm
  const w = 56 * 1.6;
  const l = 85 * 1.6;
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB - Dark Green with rounded corners */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[w, 1.5, l]} />
         <meshPhysicalMaterial color="#064e3b" roughness={0.7} />
      </mesh>
      
      {/* Mounting holes */}
      {[[-w/2+4, -l/2+4], [w/2-4, -l/2+4], [-w/2+4, l/2-4], [w/2-4, l/2-4]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0, pos[1]]}>
          <cylinderGeometry args={[2, 2, 2]} />
          <meshPhysicalMaterial color="#050505" />
        </mesh>
      ))}

      {/* Broadcom SoC (CPU) */}
      <group position={[0, 2.5, 0]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[15, 2, 15]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
           <boxGeometry args={[11, 0.2, 11]} />
           <meshPhysicalMaterial color="#64748b" metalness={0.9} roughness={0.4} />
        </mesh>
        <Text position={[0, 1.25, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#111">BROADCOM</Text>
      </group>

      {/* RAM (Pi 4 separate chip) */}
      <mesh castShadow receiveShadow position={[18, 1.5, 10]}>
         <boxGeometry args={[10, 1, 14]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      
      {/* WiFi/BT Shield */}
      <mesh castShadow receiveShadow position={[25, 2.5, -20]}>
         <boxGeometry args={[12, 2.5, 12]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* USB Ports Stack (Dual) */}
      <group position={[-w/2 + 10, 8, l/2 - 10]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[15, 16, 18]} />
           <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Blue USB 3.0 inserts */}
        <mesh position={[0, 4, 9.1]}>
           <boxGeometry args={[12, 2, 0.2]} />
           <meshPhysicalMaterial color="#2563eb" />
        </mesh>
        <mesh position={[0, -4, 9.1]}>
           <boxGeometry args={[12, 2, 0.2]} />
           <meshPhysicalMaterial color="#2563eb" />
        </mesh>
      </group>

      <group position={[-w/2 + 28, 8, l/2 - 10]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[15, 16, 18]} />
           <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Black USB 2.0 inserts */}
        <mesh position={[0, 4, 9.1]}>
           <boxGeometry args={[12, 2, 0.2]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <mesh position={[0, -4, 9.1]}>
           <boxGeometry args={[12, 2, 0.2]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* Ethernet Port */}
      <group position={[w/2 - 15, 7, l/2 - 12]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[17, 14, 22]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -2, 11.1]}>
           <boxGeometry args={[13, 8, 0.2]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* RJ45 LEDs */}
        <mesh position={[-5, 5, 11.1]}>
           <boxGeometry args={[2, 2, 0.2]} />
           <meshPhysicalMaterial color="#22c55e" emissive="#22c55e" />
        </mesh>
        <mesh position={[5, 5, 11.1]}>
           <boxGeometry args={[2, 2, 0.2]} />
           <meshPhysicalMaterial color="#eab308" emissive="#eab308" />
        </mesh>
      </group>

      {/* 40-pin GPIO Header */}
      <group position={[w/2 - 5, 5, -l/2 + 45]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
           <boxGeometry args={[5, 6, 52]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* 2 rows of 20 pins */}
        {Array.from({length: 20}).map((_, i) => (
          <mesh key={i} castShadow receiveShadow position={[-1.25, 3, -24 + i * 2.5]}>
             <cylinderGeometry args={[0.3, 0.3, 6]} />
             <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {Array.from({length: 20}).map((_, i) => (
          <mesh key={'r2'+i} castShadow receiveShadow position={[1.25, 3, -24 + i * 2.5]}>
             <cylinderGeometry args={[0.3, 0.3, 6]} />
             <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Micro HDMI Ports */}
      <mesh castShadow receiveShadow position={[-w/2 + 5, 3, -10]}>
         <boxGeometry args={[8, 3, 10]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 5, 3, 2]}>
         <boxGeometry args={[8, 3, 10]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      
      {/* USB-C Power */}
      <mesh castShadow receiveShadow position={[-w/2 + 5, 3, -25]}>
         <boxGeometry args={[8, 3, 10]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Audio Jack */}
      <mesh castShadow receiveShadow position={[-w/2 + 8, 4, 20]}>
         <boxGeometry args={[10, 6, 8]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 2, 4, 20]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[2, 2, 3]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>
      
      {/* CSI / DSI Ribbon Connectors */}
      <mesh castShadow receiveShadow position={[w/2 - 20, 2, -l/2 + 15]}>
         <boxGeometry args={[3, 4, 22]} />
         <meshPhysicalMaterial color="#1e293b" />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 25, 2, 10]}>
         <boxGeometry args={[22, 4, 3]} />
         <meshPhysicalMaterial color="#1e293b" />
      </mesh>

    </group>
  );
}

function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const pinGap = isPCB ? 8 : 4;
  const pinDist = isPCB ? 20 : 10;
  const length = 20 * pinGap;
  const width = pinDist * 2.5; // Made slightly wider for realism

  return (
    <group position={[0, 1.5, 0]}>
      {/* Blue PCB */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, 1.5, length + 4]} />
        <meshPhysicalMaterial color="#0284c7" roughness={0.6} />
      </mesh>
      
      {/* STM32 Microcontroller chip (LQFP-48) */}
      <mesh castShadow receiveShadow position={[0, 1.2, 0]} rotation={[0, Math.PI/4, 0]}>
        <boxGeometry args={[width * 0.45, 1, width * 0.45]} />
        <meshPhysicalMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      {/* Circle indent on chip */}
      <mesh castShadow receiveShadow position={[-3, 1.8, -3]} rotation={[0, Math.PI/4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      <Text position={[0, 1.8, 0]} rotation={[-Math.PI/2, 0, Math.PI/4]} fontSize={1.2} color="#94a3b8">STM32F103</Text>

      {/* Micro USB Connector */}
      <group position={[0, 2, -length/2 + 2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[10, 2.5, 7]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.5, -3.6]}>
           <boxGeometry args={[7, 1, 0.2]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>
      
      {/* 8MHz Crystal Oscillator (Silver oval) */}
      <mesh castShadow receiveShadow position={[5, 1.5, -length/2 + 15]}>
        <boxGeometry args={[5, 1.5, 3]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>
      
      {/* 32.768kHz Crystal (Cylinder) */}
      <mesh castShadow receiveShadow position={[-5, 1.5, -length/2 + 15]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 4, 16]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>

      {/* Yellow Jumpers (BOOT0 / BOOT1) */}
      <group position={[0, 2, -length/2 + 25]}>
        <mesh castShadow receiveShadow position={[-2, 0, 0]}>
          <boxGeometry args={[2.5, 2.5, 8]} />
          <meshPhysicalMaterial color="#fbbf24" roughness={0.4} />
        </mesh>
        <mesh castShadow receiveShadow position={[2, 0, 0]}>
          <boxGeometry args={[2.5, 2.5, 8]} />
          <meshPhysicalMaterial color="#fbbf24" roughness={0.4} />
        </mesh>
        {/* Black jumper caps */}
        <mesh castShadow receiveShadow position={[-2, 1, -2]}>
           <boxGeometry args={[3, 3, 3]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <mesh castShadow receiveShadow position={[2, 1, -2]}>
           <boxGeometry args={[3, 3, 3]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* Reset Button */}
      <group position={[7, 1.5, length/2 - 10]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[4, 1, 4]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>
      
      {/* Header Pins */}
      {Array.from({ length: 20 }).map((_, i) => {
        const pzScaled = - (19 * pinGap) / 2 + i * pinGap;
        return (
          <group key={i}>
            {/* Pins extending up and down */}
            <mesh castShadow receiveShadow position={[-pinDist, 0, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, 0, pzScaled]}>
               <cylinderGeometry args={[0.4, 0.4, 10]} />
               <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Black Plastic Header base */}
            <mesh castShadow receiveShadow position={[-pinDist, 1, pzScaled]}>
               <boxGeometry args={[3, 2.5, pinGap-0.2]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[pinDist, 1, pzScaled]}>
               <boxGeometry args={[3, 2.5, pinGap-0.2]} />
               <meshPhysicalMaterial color="#111" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

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
      {/* PCB - Dark Blue */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[28, 1.5, 28]} />
         <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
      </mesh>
      
      {/* Mounting holes */}
      {[[-12, -12], [12, -12], [-12, 12], [12, 12]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0, pos[1]]}>
          <cylinderGeometry args={[1, 1, 2]} />
          <meshPhysicalMaterial color="#050505" />
        </mesh>
      ))}

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
      <Text position={[-3.75, 1.6, 9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">GND</Text>
      <Text position={[-1.25, 1.6, 9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">VCC</Text>
      <Text position={[1.25, 1.6, 9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SCL</Text>
      <Text position={[3.75, 1.6, 9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SDA</Text>

      {/* OLED Glass Screen */}
      <mesh castShadow receiveShadow position={[0, 1.5, -2]}>
         <boxGeometry args={[26, 2, 16]} />
         <meshPhysicalMaterial color="#020617" roughness={0.1} clearcoat={1.0} clearcoatRoughness={0.1} />
      </mesh>
      
      {/* FPC Ribbon at the bottom */}
      <mesh castShadow receiveShadow position={[0, 1.6, 7]}>
         <boxGeometry args={[12, 0.2, 4]} />
         <meshPhysicalMaterial color="#b45309" roughness={0.6} />
      </mesh>
      
      {/* Active Screen Area (Inner part) */}
      <mesh castShadow receiveShadow position={[0, 2.51, -2]}>
         <planeGeometry args={[22, 12]} />
         <meshPhysicalMaterial 
           color="#000" 
           emissive="#000" 
         />
      </mesh>
      
      {/* Dynamic Text Buffer */}
      {isActive && !isBroken && (
        <group position={[0, 2.52, -2]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[22, 12]} />
            <meshPhysicalMaterial color="#000" emissive="#38bdf8" emissiveIntensity={0.1} transparent opacity={0.1} />
          </mesh>
          {oledBuffer.map((line, i) => (
            <Text
              key={i}
              position={[-10, 4.5 - i * 1.5, 0]}
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
            <Text position={[0, 0, 0]} fontSize={2} color="#38bdf8" anchorX="center" anchorY="middle" font="monospace">
              Ready
            </Text>
          )}
        </group>
      )}
    </group>
  );
}

function NTC3D() {
  return (
    <group position={[0, 4, 0]}>
      {/* Leads */}
      <mesh castShadow receiveShadow position={[-5, -5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 10]} />
        <meshPhysicalMaterial color="silver" />
      </mesh>
      <mesh castShadow receiveShadow position={[5, -5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 10]} />
        <meshPhysicalMaterial color="silver" />
      </mesh>
      
      {/* Thermistor Bead / Epoxy Head */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        {/* It looks like a flattened sphere or a teardrop */}
        <sphereGeometry args={[3, 32, 16]} />
        <meshPhysicalMaterial color="#111827" roughness={0.3} clearcoat={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 2, 2, 32]} />
        <meshPhysicalMaterial color="#111827" roughness={0.3} clearcoat={0.5} />
      </mesh>
      
      {/* Value Text */}
      <Text position={[0, 1, 3.1]} fontSize={1.2} color="#94a3b8">10K</Text>
    </group>
  );
}

`;

content = content.replace(/function ArduinoUno3D[\s\S]*?function OLED3D[\s\S]*?return \(\s*<group[\s\S]*?<\/group>\s*\);\s*\}/g, mcuCode.trim());

// Add NTC to cases
const ntcCase = `
      case "ntc":
      case "thermistor":
        return <NTC3D />;`;

content = content.replace(/case "ldr":/g, ntcCase.trim() + '\n      case "ldr":');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
