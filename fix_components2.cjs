const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// PowerSupply
content = content.replace(
  /case "powersupply": \{[\s\S]*?<group position=\{\[0, 10, 0\]\}>[\s\S]*?<\/group>\s*\);\s*\}/g,
  `case "powersupply": {
        const pval = customProps?.voltage ? customProps.voltage : "5V";
        const cval = customProps?.current ? customProps.current : "1A";
        return (
          <group position={[0, 10, 15]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[40, 20, 25]} />
              <meshPhysicalMaterial color="#e2e8f0" roughness={0.8} />
            </mesh>
            {/* Front Panel */}
            <mesh castShadow receiveShadow position={[0, 0, 12.6]}>
              <boxGeometry args={[38, 18, 0.5]} />
              <meshPhysicalMaterial color="#1e293b" />
            </mesh>
            {/* Screen */}
            <group position={[0, 3, 12.7]}>
               <mesh castShadow receiveShadow>
                 <boxGeometry args={[26, 10, 0.2]} />
                 <meshPhysicalMaterial color="#020617" />
               </mesh>
               <PowerSupplyDisplay3D id={id} isActive={isActive} defaultValue={pval} defaultMaxCurrent={parseFloat(cval)} />
            </group>
            {/* Terminals extending to z=25 where the PCB pad is */}
            {/* VCC Terminal */}
            <mesh castShadow receiveShadow position={[-10, -5, 14]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#ef4444" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[-10, -8, 20]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.5, 0.5, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>

            {/* GND Terminal */}
            <mesh castShadow receiveShadow position={[10, -5, 14]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#111" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -8, 20]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.5, 0.5, 10]} />
               <meshPhysicalMaterial color="silver" />
            </mesh>
          </group>
        );
      }`
);

// Diode
content = content.replace(
  /case "diode":[\s\S]*?<mesh castShadow receiveShadow position=\{\[0, 0, 0\]\} rotation=\{\[0, 0, Math\.PI \/ 2\]\}>\s*<cylinderGeometry args=\{\[1\.5, 1\.5, 12, 16\]\} \/>\s*<meshPhysicalMaterial color="#111" roughness=\{0\.6\} \/>\s*<\/mesh>\s*<mesh castShadow receiveShadow position=\{\[-4, 0, 0\]\} rotation=\{\[0, 0, Math\.PI \/ 2\]\}>\s*<cylinderGeometry args=\{\[1\.6, 1\.6, 2, 16\]\} \/>\s*<meshPhysicalMaterial color="#cbd5e1" \/>\s*<\/mesh>[\s\S]*?<\/group>\s*\);/g,
  `case "diode":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-15, 0.05, 0]}>
                   <boxGeometry args={[3, 0.1, 3]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[15, 0.05, 0]}>
                   <boxGeometry args={[3, 0.1, 3]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
              </>
            )}
            
            {/* Diode body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.5, 1.5, 12, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            {/* Rounded ends */}
            <mesh castShadow receiveShadow position={[-6, 0, 0]}>
              <sphereGeometry args={[1.5, 32, 16]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[6, 0, 0]}>
              <sphereGeometry args={[1.5, 32, 16]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            {/* Silver Band (Cathode) */}
            <mesh castShadow receiveShadow position={[-4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.55, 1.55, 2, 32]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        );`
);

// Zener Diode
content = content.replace(
  /case "zener_diode":[\s\S]*?<mesh castShadow receiveShadow position=\{\[0, 0, 0\]\} rotation=\{\[0, 0, Math\.PI \/ 2\]\}>\s*<cylinderGeometry args=\{\[1\.2, 1\.2, 10, 16\]\} \/>\s*<meshPhysicalMaterial color="#f97316" transparent opacity=\{0\.6\} roughness=\{0\.2\} \/>\s*<\/mesh>\s*<mesh castShadow receiveShadow position=\{\[-3, 0, 0\]\} rotation=\{\[0, 0, Math\.PI \/ 2\]\}>\s*<cylinderGeometry args=\{\[1\.21, 1\.21, 1\.5, 16\]\} \/>\s*<meshPhysicalMaterial color="#111" \/>\s*<\/mesh>[\s\S]*?<\/group>\s*\);/g,
  `case "zener_diode":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.3, 0.3, isPCB ? 1 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            {isPCB && (
              <>
                <mesh castShadow receiveShadow position={[-15, 0.05, 0]}>
                   <boxGeometry args={[3, 0.1, 3]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
                <mesh castShadow receiveShadow position={[15, 0.05, 0]}>
                   <boxGeometry args={[3, 0.1, 3]} />
                   <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
                </mesh>
              </>
            )}
            
            {/* Zener Glass Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.2, 1.2, 10, 32]} />
              <meshPhysicalMaterial color="#f97316" transparent opacity={0.65} roughness={0.1} clearcoat={1.0} />
            </mesh>
            {/* Copper inner core */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.5, 0.5, 9, 16]} />
              <meshPhysicalMaterial color="#b45309" metalness={0.8} />
            </mesh>
            {/* Rounded glass ends */}
            <mesh castShadow receiveShadow position={[-5, 0, 0]}>
              <sphereGeometry args={[1.2, 32, 16]} />
              <meshPhysicalMaterial color="#f97316" transparent opacity={0.65} roughness={0.1} clearcoat={1.0} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, 0, 0]}>
              <sphereGeometry args={[1.2, 32, 16]} />
              <meshPhysicalMaterial color="#f97316" transparent opacity={0.65} roughness={0.1} clearcoat={1.0} />
            </mesh>

            {/* Black Band (Cathode) */}
            <mesh castShadow receiveShadow position={[-3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.25, 1.25, 1.5, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.5} />
            </mesh>
          </group>
        );`
);


fs.writeFileSync('src/components/Meshes3D.tsx', content);
