import fs from 'fs';

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Update HighQualityMesh props
content = content.replace(
  /reading = "",\n\}: \{/,
  'reading = "",\n  isPCB = false,\n}: {\n  isPCB?: boolean;'
);

// Update DIP_IC3D function
const dipRegex = /function DIP_IC3D\(\{.*?\}\) \{[\s\S]*?return \([\s\S]*?<\/group>\s*\);\s*\}/;
content = content.replace(dipRegex, `function DIP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  const pinGap = length / (pins / 2 + 1);
  const displayText = value || (type ? type.toUpperCase() : "IC");
  return (
    <group position={[0, 0, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <boxGeometry args={[length, 4, width]} />
        <meshPhysicalMaterial color="#111111" roughness={0.8} metalness={0.1} clearcoat={0.1} clearcoatRoughness={0.8} />
      </mesh>
      
      {/* Notch */}
      <mesh castShadow receiveShadow position={[-length / 2, 3.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-length / 2 + 2, 4, width/2 - 1.5]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Text on top */}
      <Text
        position={[0, 4.05, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(2.5, length / 4)}
        color="#e5e5e5"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>

      {/* Pins and Pads */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = -length / 2 + pinGap * (i + 1);
         return (
           <group key={"pin"+i}>
              <mesh castShadow receiveShadow position={[px, 1, -width/2 - 0.5]}>
                <boxGeometry args={[0.8, 2, 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 1, width/2 + 0.5]}>
                <boxGeometry args={[0.8, 2, 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, -1.0, -width/2 - 0.5]}>
                <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, -1.0, width/2 + 0.5]}>
                <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>

              {isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, 0.05, -width/2 - 0.5]}>
                    <boxGeometry args={[2, 0.1, 2]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, width/2 + 0.5]}>
                    <boxGeometry args={[2, 0.1, 2]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -width/2 - 0.5]}>
                    <boxGeometry args={[2, 0.1, 2]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, width/2 + 0.5]}>
                    <boxGeometry args={[2, 0.1, 2]} />
                    <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                  </mesh>

                  <mesh castShadow receiveShadow position={[px, 0.05, -width/2 - 0.5]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, width/2 + 0.5]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, -width/2 - 0.5]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, -1.65, width/2 + 0.5]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                    <meshPhysicalMaterial color="#0f0f13" />
                  </mesh>
                </>
              )}
           </group>
         );
      })}
    </group>
  );
}`);

const sopRegex = /function SOP_IC3D\(\{.*?\}\) \{[\s\S]*?return \([\s\S]*?<\/group>\s*\);\s*\}/;
content = content.replace(sopRegex, `function SOP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  const pinGap = length / (pins / 2 + 1);
  const displayText = value || (type ? type.toUpperCase() : "IC");
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[length, 2, width]} />
        <meshPhysicalMaterial color="#111111" roughness={0.8} metalness={0.1} clearcoat={0.1} clearcoatRoughness={0.8} />
      </mesh>
      
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-length / 2 + 1, 2.2, width/2 - 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      
      {/* Text on top */}
      <Text
        position={[0, 2.25, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(1.5, length / 4)}
        color="#e5e5e5"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>

      {/* Pins and Pads */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = -length / 2 + pinGap * (i + 1);
         return (
           <group key={"pin"+i}>
              <mesh castShadow receiveShadow position={[px, 0.5, -width/2 - 0.5]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.4, 0.2, 1.5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 0.25, -width/2 - 1.2]}>
                <boxGeometry args={[0.4, 0.2, 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>

              <mesh castShadow receiveShadow position={[px, 0.5, width/2 + 0.5]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[0.4, 0.2, 1.5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 0.25, width/2 + 1.2]}>
                <boxGeometry args={[0.4, 0.2, 1]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>

              {isPCB && (
                <>
                  <mesh castShadow receiveShadow position={[px, 0.05, -width/2 - 1.5]}>
                    <boxGeometry args={[1, 0.1, 1.6]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[px, 0.05, width/2 + 1.5]}>
                    <boxGeometry args={[1, 0.1, 1.6]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
                  </mesh>
                </>
              )}
           </group>
         );
      })}
    </group>
  );
}`);

// Add parsing for pins in getMeshes
content = content.replace(
  /case "dip8":\s*case "timer555":\s*case "opamp":\s*case "attiny85":\s*return <DIP_IC3D pins=\{8\} length=\{10\} width=\{8\} value=\{value\} type=\{type\} \/>;/,
  `case "dip8":
      case "timer555":
      case "opamp":
      case "attiny85": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 8;
        const l = (p / 2) * 2.5;
        return <DIP_IC3D pins={p} length={Math.max(10, l)} width={8} value={value} type={type} isPCB={isPCB} />;
      }`
);

content = content.replace(
  /case "ic":\s*case "logic_gate":\s*case "logic_and":\s*case "logic_or":\s*case "logic_not":\s*case "logic_nand":\s*case "logic_nor":\s*case "logic_xor":\s*case "stm32_bluepill":\s*return <DIP_IC3D pins=\{14\} length=\{18\} width=\{8\} value=\{value\} type=\{type\} \/>;/,
  `case "ic":
      case "logic_gate":
      case "logic_and":
      case "logic_or":
      case "logic_not":
      case "logic_nand":
      case "logic_nor":
      case "logic_xor":
      case "stm32_bluepill": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 14;
        const l = (p / 2) * 2.5;
        return <DIP_IC3D pins={p} length={Math.max(18, l)} width={8} value={value} type={type} isPCB={isPCB} />;
      }`
);

content = content.replace(
  /case "sop":\s*case "soic":\s*return <SOP_IC3D pins=\{8\} length=\{6\} width=\{4\} value=\{value\} type=\{type\} \/>;/,
  `case "sop":
      case "soic": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 8;
        const l = (p / 2) * 1.5;
        return <SOP_IC3D pins={p} length={Math.max(6, l)} width={4} value={value} type={type} isPCB={isPCB} />;
      }`
);

content = content.replace(
  /case "qfp":\s*case "bga":\s*return <SOP_IC3D pins=\{16\} length=\{10\} width=\{10\} value=\{value\} type=\{type\} \/>;/,
  `case "qfp":
      case "bga": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 16;
        const l = (p / 2) * 1.5;
        return <SOP_IC3D pins={p} length={Math.max(10, l)} width={10} value={value} type={type} isPCB={isPCB} />;
      }`
);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
