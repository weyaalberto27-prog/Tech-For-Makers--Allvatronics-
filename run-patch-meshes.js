const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

const newComponents = `
      case "gps":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[26, 4, 35]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 5, 5]}>
              <boxGeometry args={[20, 2, 20]} />
              <meshPhysicalMaterial color="#d1d5db" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 6, 5]}>
              <cylinderGeometry args={[2, 2, 0.5, 16]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            <mesh position={[0, 4, -12]}>
              <boxGeometry args={[10, 3, 5]} />
              <meshPhysicalMaterial color="#374151" />
            </mesh>
            {[-3, -1, 1, 3].map((x, i) => (
              <mesh key={i} position={[x * 2.5, 2, -18]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case "accelerometer":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[16, 3, 20]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 3.5, 0]}>
              <boxGeometry args={[5, 1.5, 5]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            <mesh position={[-4, 3.5, -4]}>
              <boxGeometry args={[2, 1, 3]} />
              <meshPhysicalMaterial color="#4b5563" />
            </mesh>
            {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
              <mesh key={i} position={[x * 1.5, 1.5, -11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case "gas_sensor":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[20, 4, 25]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 9, 2]}>
              <cylinderGeometry args={[7, 7, 10, 24]} />
              <meshPhysicalMaterial color="#d1d5db" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, 14, 2]}>
              <cylinderGeometry args={[6.5, 6.5, 0.5, 24]} />
              <meshPhysicalMaterial color="#4b5563" wireframe />
            </mesh>
            {[-2, 0, 2].map((x, i) => (
              <mesh key={i} position={[x * 3, 2, -14]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case "esp8266":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[18, 2, 28]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            <mesh position={[0, 3.5, 4]}>
              <boxGeometry args={[12, 1.5, 16]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 3.1, -8]}>
              <boxGeometry args={[14, 0.5, 6]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {[-4, -1, 1, 4].map((z, i) => (
              <group key={i}>
                <mesh position={[-10, 2, z * 2]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
                </mesh>
                <mesh position={[10, 2, z * 2]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
                </mesh>
              </group>
            ))}
          </group>
        );

      case "motor_driver":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[15, 3, 20]} />
              <meshPhysicalMaterial color="#dc2626" roughness={0.7} />
            </mesh>
            <mesh position={[0, 4.5, 0]}>
              <boxGeometry args={[8, 2, 8]} />
              <meshPhysicalMaterial color="#111827" roughness={0.9} />
            </mesh>
            <mesh position={[0, 6, 0]}>
              <boxGeometry args={[6, 1, 6]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh position={[0, 6.6, 0]}>
              <boxGeometry args={[7, 0.2, 7]} />
              <meshPhysicalMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
            </mesh>
            {[-3, -1, 1, 3].map((z, i) => (
              <group key={i}>
                <mesh position={[-8.5, 2, z * 2.2]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
                </mesh>
                <mesh position={[8.5, 2, z * 2.2]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
                </mesh>
              </group>
            ))}
          </group>
        );

      case "stepper_motor":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 10, 0]}>
              <boxGeometry args={[42, 42, 40]} />
              <meshPhysicalMaterial color="#374151" roughness={0.8} metalness={0.2} />
            </mesh>
            <mesh position={[0, 10, 22]}>
              <cylinderGeometry args={[11, 11, 4, 32]} rotation={[Math.PI / 2, 0, 0]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.6} />
            </mesh>
            <mesh position={[0, 10, 28]}>
              <cylinderGeometry args={[2.5, 2.5, 15, 16]} rotation={[Math.PI / 2, 0, 0]} />
              <meshPhysicalMaterial color="#e5e7eb" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );

      case "dht11":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 4, 0]}>
              <boxGeometry args={[12, 15, 6]} />
              <meshPhysicalMaterial color="#0ea5e9" roughness={0.6} />
            </mesh>
            <group position={[0, 4, 3.1]}>
              {[-3, -1, 1, 3].map((y, i) => (
                <mesh key={i} position={[0, y, 0]}>
                  <boxGeometry args={[8, 0.5, 0.5]} />
                  <meshPhysicalMaterial color="#0284c7" />
                </mesh>
              ))}
            </group>
            {[-2.5, 0, 2.5].map((x, i) => (
              <mesh key={i} position={[x, -5, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 4, 8]} />
                <meshPhysicalMaterial color="#d1d5db" metalness={0.8} />
              </mesh>
            ))}
          </group>
        );

      case "hc05":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[16, 3, 30]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 4, -4]}>
              <boxGeometry args={[12, 2, 16]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            <mesh position={[0, 4, 8]}>
              <boxGeometry args={[12, 1, 8]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
              <mesh key={i} position={[x * 1.5, 2, -16]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 3, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );

      case "ultrasonic":
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 2, 0]}>
              <boxGeometry args={[45, 3, 20]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh position={[-12, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[8, 8, 12, 32]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.6} />
            </mesh>
            <mesh position={[-12, 14, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[7, 7, 0.5, 32]} />
              <meshPhysicalMaterial color="#111827" wireframe />
            </mesh>
            <mesh position={[12, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[8, 8, 12, 32]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.6} />
            </mesh>
            <mesh position={[12, 14, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[7, 7, 0.5, 32]} />
              <meshPhysicalMaterial color="#111827" wireframe />
            </mesh>
            <mesh position={[0, 4, 0]}>
              <boxGeometry args={[6, 3, 6]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {[-4.5, -1.5, 1.5, 4.5].map((x, i) => (
              <mesh key={i} position={[x, 2, -11]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            ))}
          </group>
        );
`;

code = code.replace('case "protoboard":', newComponents + '\n      case "protoboard":');
fs.writeFileSync('src/components/Meshes3D.tsx', code);
