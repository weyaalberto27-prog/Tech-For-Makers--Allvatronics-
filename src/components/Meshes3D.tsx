import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Html } from "@react-three/drei";
import { getResistorColors } from "./Symbols";
import { useEditor } from "../store";
import { mcuLabels } from "../lib/mcu_pins";

function OscilloscopeScreen3D({ id, isActive, customProps }: { id?: string, isActive: boolean, customProps?: any }) {
  const [data, setData] = React.useState<{time: number, value: number}[]>([]);
  React.useEffect(() => {
    if (!isActive || !id) return;
    const interval = setInterval(() => {
      const readings = (window as any)._circuitReadings || {};
      const readingStr = readings[id] || "0V";
      const val = parseFloat(readingStr.replace(/[^\d.-]/g, ""));
      const now = Date.now();
      setData(prev => {
        const filtered = prev.filter((p) => now - p.time < 3000);
        return [...filtered, { time: now, value: isNaN(val) ? 0 : val }];
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isActive, id]);

  if (!isActive || !id || data.length < 2) return null;

  const w = 400;
  const h = 260;
  const now = Date.now();
  const scale = customProps?.scale || 20;
  const mapY = (v: number) => h / 2 - (v / scale) * (h / 2);
  const mapX = (t: number) => w - ((now - t) / 3000) * w;
  
  const dPath = data.map((p, i) => `${i === 0 ? "M" : "L"} ${mapX(p.time)} ${mapY(p.value)}`).join(" ");

  const values = data.map(p => p.value);
  const max = values.length > 0 ? Math.max(...values) : 0;
  const min = values.length > 0 ? Math.min(...values) : 0;
  const vpp = max - min;
  const amp = vpp / 2;

  return (
    <Html transform distanceFactor={1.5} position={[-15, 0, -32.2]} rotation={[0, Math.PI, 0]} scale={0.1}>
       <div style={{ 
         width: 400, 
         height: 260, 
         background: 'rgba(10, 10, 15, 0.9)', 
         border: '2px solid #22c55e',
         position: 'relative', 
         overflow: 'hidden', 
         borderRadius: '4px',
         fontFamily: 'monospace',
         boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
       }}>
          {/* Subtle grid pattern background */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px)',
            backgroundSize: '25px 25px',
            pointerEvents: 'none'
          }} />

          {/* Core Waveform Path */}
          <svg width="400" height="260" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
             {/* Main voltage center reference line */}
             <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(34, 197, 94, 0.3)" strokeDasharray="5,5" strokeWidth="1" />
             <path d={dPath} fill="none" stroke="#22c55e" strokeWidth="4" style={{ filter: 'drop-shadow(0px 0px 4px #22c55e)' }} />
          </svg>

          {/* High-visibility Digital Display Text (Oscilloscope Readings / Wave Amplitudes) */}
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            color: '#22c55e',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 0 2px #22c55e',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '4px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(34,197,94,0.3)'
          }}>
            <div>CH1 (A0)</div>
            <div style={{ color: '#ffffff' }}>Scale: {scale}V/div</div>
          </div>

          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 2,
            color: '#22c55e',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 0 2px #22c55e',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '4px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(34,197,94,0.3)'
          }}>
            <div style={{ color: '#fff' }}>AMP: {amp.toFixed(2)}V</div>
            <div>VPP: {vpp.toFixed(2)}V</div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
            gap: 10,
            color: '#22c55e',
            fontSize: '11px',
            fontWeight: 'bold',
            textShadow: '0 0 2px #22c55e',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '4px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(34,197,94,0.3)'
          }}>
            <div>MAX: {max.toFixed(2)}V</div>
            <div>MIN: {min.toFixed(2)}V</div>
          </div>

          {/* Scanning / Trigger indicator */}
          <div style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            color: '#22c55e',
            fontSize: '11px',
            textShadow: '0 0 2px #22c55e',
            background: 'rgba(0, 0, 0, 0.65)',
            padding: '4px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(34,197,94,0.3)'
          }}>
            TRG: AUTO
          </div>
       </div>
    </Html>
  );
}

function IC_SMD({
  position,
  pins,
  length,
  width,
}: {
  position: [number, number, number];
  pins: number;
  length: number;
  width: number;
}) {
  
  const pinGap = length / (pins / 2 + 1);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, Math.max(1, width / 4), 0]}>
        <boxGeometry args={[length, Math.max(2, width / 2), width]} />
        <meshPhysicalMaterial
          color="#141414"
          roughness={0.7}
          metalness={0.9}
          clearcoat={0.15}
          clearcoatRoughness={0.8}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[-length / 2 + 2, Math.max(1.5, width / 4 + 0.5), 0]}>
        <circleGeometry args={[Math.min(1, width / 8), 8]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
      {Array.from({ length: pins / 2 }).map((_, i) => (
        <group key={"pin" + i}>
          <mesh castShadow receiveShadow
            position={[-length / 2 + pinGap * (i + 1), 0, width / 2 + 0.5]}
           
          >
            <boxGeometry args={[pinGap * 0.4, 0.5, 2]} />
            <meshPhysicalMaterial
              color="#cbd5e1"
              metalness={0.9}
              clearcoat={1}
              clearcoatRoughness={0.1}
              roughness={0.3}
            />
          </mesh>
          <mesh castShadow receiveShadow
            position={[-length / 2 + pinGap * (i + 1), 0, -width / 2 - 0.5]}
           
          >
            <boxGeometry args={[pinGap * 0.4, 0.5, 2]} />
            <meshPhysicalMaterial
              color="#cbd5e1"
              metalness={0.9}
              clearcoat={1}
              clearcoatRoughness={0.1}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}



function ScrewTerminalBlock3D({ scale = [1, 1, 1] }: { scale?: [number, number, number] }) {
  return (
    <group position={[0, 4, 0]} scale={scale}>
      {/* Plastic Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[26, 8, 14]} />
        <meshPhysicalMaterial color="#16a34a" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Wire holes */}
      <mesh castShadow receiveShadow position={[-10, 0, 7.1]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[10, 0, 7.1]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* Screws */}
      <mesh castShadow receiveShadow position={[-10, 4.1, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, 4.1, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 16]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
      
      {/* Screw slots */}
      <mesh castShadow receiveShadow position={[-10, 4.2, 0]}>
        <boxGeometry args={[4, 0.1, 0.8]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>
      <mesh castShadow receiveShadow position={[10, 4.2, 0]}>
        <boxGeometry args={[4, 0.1, 0.8]} />
        <meshPhysicalMaterial color="#333" />
      </mesh>

      {/* Pins to PCB */}
      <mesh castShadow receiveShadow position={[-10, -5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, -5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 2]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* PCB Pads */}
      <mesh castShadow receiveShadow position={[-10, -5.65, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.12, 16]} />
        <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, -5.65, 0]}>
        <cylinderGeometry args={[2.0, 2.0, 0.12, 16]} />
        <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-10, -5.65, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.15, 16]} />
        <meshPhysicalMaterial color="#1a1a1a" />
      </mesh>
      <mesh castShadow receiveShadow position={[10, -5.65, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.15, 16]} />
        <meshPhysicalMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function DIP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  // Always use standard spacing (10 for pins distance, 30 for distance between rows for standard DIP)
  const pinGap = 10;
  const calcLength = (pins / 2) * pinGap;
  const pinDist = 15; // 0.3 inch spacing (30 units apart: -15 and +15)
  const bodyWidth = 26; // 6.6mm width for 0.3" DIP
  const displayText = value || (type ? type.toUpperCase() : "IC");

  const totalLength = calcLength + 2; 

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {isPCB && (
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[totalLength + 2, 0.1, bodyWidth + 2]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.9} transparent opacity={0.8} />
        </mesh>
      )}
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 4.5, 0]}>
        <boxGeometry args={[totalLength, 5, bodyWidth]} />
        <meshPhysicalMaterial color="#1a1c1e" roughness={0.9} metalness={0.1} clearcoat={0.1} />
      </mesh>
      {/* Notch */}
      <mesh castShadow receiveShadow position={[-totalLength / 2, 7.0, 0]}>
        <cylinderGeometry args={[2, 2, 0.5, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-totalLength / 2 + 3, 7.0, bodyWidth/2 - 3]}>
        <cylinderGeometry args={[1, 1, 0.2, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      {/* Text on top */}
      <Text
        position={[0, 7.05, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(4, totalLength / displayText.length * 1.5)}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>
      {/* Pins */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = (i - (pins / 2 - 1) / 2) * pinGap;
         return (
           <group key={"pin"+i}>
              {/* Left Pin (Z negative) */}
              <mesh castShadow receiveShadow position={[px, 4.5, -bodyWidth/2 - 1]}>
                <boxGeometry args={[2, 0.5, 3]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 2.5, -pinDist]}>
                <boxGeometry args={[1.5, 4.5, 1.0]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              {isPCB && (
                <mesh castShadow receiveShadow position={[px, -0.8, -pinDist]}>
                  <cylinderGeometry args={[0.4, 0.2, 2.0, 8]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              )}
              {/* Right Pin (Z positive) */}
              <mesh castShadow receiveShadow position={[px, 4.5, bodyWidth/2 + 1]}>
                <boxGeometry args={[2, 0.5, 3]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 2.5, pinDist]}>
                <boxGeometry args={[1.2, 4.5, 0.8]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              {isPCB && (
                <mesh castShadow receiveShadow position={[px, -0.8, pinDist]}>
                  <cylinderGeometry args={[0.4, 0.2, 2.0, 8]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              )}
           </group>
         );
      })}
    </group>
  );
}

function SOP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  
  const pinGap = 5;
  const calcLength = (pins / 2) * pinGap;
  const pinDist = 15;
  const bodyWidth = 20;
  const displayText = value || (type ? type.toUpperCase() : "IC");

  const totalLength = calcLength + 2;

  return (
    <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {isPCB && (
        <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[totalLength + 2, 0.1, bodyWidth + 2]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.9} transparent opacity={0.8} />
        </mesh>
      )}
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 2.0, 0]}>
        <boxGeometry args={[totalLength, 2.5, bodyWidth]} />
        <meshPhysicalMaterial color="#1a1c1e" roughness={0.9} metalness={0.1} clearcoat={0.2} />
      </mesh>
      {/* Pin 1 dot */}
      <mesh castShadow receiveShadow position={[-totalLength / 2 + 2, 3.25, bodyWidth/2 - 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
        <meshPhysicalMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
      {/* Text on top */}
      <Text
        position={[0, 3.3, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={Math.min(3, totalLength / displayText.length * 1.5)}
        color="#a1a1aa"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>
      {/* Pins */}
      {Array.from({ length: pins / 2 }).map((_, i) => {
         const px = (i - (pins / 2 - 1) / 2) * pinGap;
         return (
           <group key={"pin"+i}>
              {/* Left Pin (Z negative) */}
              {/* Gull-wing leg going out */}
              <mesh castShadow receiveShadow position={[px, 1.25, -bodyWidth/2 - 1]}>
                <boxGeometry args={[1.5, 0.2, 2]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              {/* Gull-wing leg going down */}
              <mesh castShadow receiveShadow position={[px, 0.8, -bodyWidth/2 - 2]}>
                <boxGeometry args={[1.5, 0.9, 0.2]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              {/* Gull-wing leg flat on pad */}
              <mesh castShadow receiveShadow position={[px, 0.45, -pinDist + 0.5]}>
                <boxGeometry args={[1.5, 0.2, (pinDist - bodyWidth/2 - 2 + 1)]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>

              {/* Right Pin (Z positive) */}
              <mesh castShadow receiveShadow position={[px, 1.25, bodyWidth/2 + 1]}>
                <boxGeometry args={[1.5, 0.2, 2]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 0.8, bodyWidth/2 + 2]}>
                <boxGeometry args={[1.5, 0.9, 0.2]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
              <mesh castShadow receiveShadow position={[px, 0.45, pinDist - 0.5]}>
                <boxGeometry args={[1.5, 0.2, (pinDist - bodyWidth/2 - 2 + 1)]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
           </group>
         );
      })}
    </group>
  );
}

function Resistor_SMD({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshPhysicalMaterial
          color="#111"
          roughness={0.6}
          clearcoat={0.3}
          clearcoatRoughness={0.8}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.1, 1.1]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.1, 1.1]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

function Capacitor_SMD({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshPhysicalMaterial color="#cda87a" />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.1, 1.3]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[1.2, 0.5, 0]}>
        <boxGeometry args={[0.4, 1.1, 1.3]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

const unoShapeData = new THREE.Shape();
unoShapeData.moveTo(-34, -26);
unoShapeData.lineTo(32, -26);
unoShapeData.lineTo(34.3, -24);
unoShapeData.lineTo(34.3, 10);
unoShapeData.lineTo(32, 12);
unoShapeData.lineTo(32, 26);
unoShapeData.lineTo(-34, 26);
unoShapeData.lineTo(-34, -26);

const rpiShapeData = new THREE.Shape();
(() => {
  const w = 85 / 2;
  const h = 56 / 2;
  const r = 3;
  rpiShapeData.moveTo(-w + r, -h);
  rpiShapeData.lineTo(w - r, -h);
  rpiShapeData.quadraticCurveTo(w, -h, w, -h + r);
  rpiShapeData.lineTo(w, h - r);
  rpiShapeData.quadraticCurveTo(w, h, w - r, h);
  rpiShapeData.lineTo(-w + r, h);
  rpiShapeData.quadraticCurveTo(-w, h, -w, h - r);
  rpiShapeData.lineTo(-w, -h + r);
  rpiShapeData.quadraticCurveTo(-w, -h, -w + r, -h);
})();

const espShapeData = new THREE.Shape();
(() => {
  const w = 28 / 2;
  const h = 54 / 2;
  const r = 1;
  espShapeData.moveTo(-w + r, -h);
  espShapeData.lineTo(w - r, -h);
  espShapeData.quadraticCurveTo(w, -h, w, -h + r);
  espShapeData.lineTo(w, h - r);
  espShapeData.quadraticCurveTo(w, h, w - r, h);
  espShapeData.lineTo(-w + r, h);
  espShapeData.quadraticCurveTo(-w, h, -w, h - r);
  espShapeData.lineTo(-w, -h + r);
  espShapeData.quadraticCurveTo(-w, -h, -w + r, -h);
})();

const esp32s3ShapeData = new THREE.Shape();
(() => {
  const w = 25.4 / 2;
  const h = 50.8 / 2;
  const r = 1;
  esp32s3ShapeData.moveTo(-w + r, -h);
  esp32s3ShapeData.lineTo(w - r, -h);
  esp32s3ShapeData.quadraticCurveTo(w, -h, w, -h + r);
  esp32s3ShapeData.lineTo(w, h - r);
  esp32s3ShapeData.quadraticCurveTo(w, h, w - r, h);
  esp32s3ShapeData.lineTo(-w + r, h);
  esp32s3ShapeData.quadraticCurveTo(-w, h, -w, h - r);
  esp32s3ShapeData.lineTo(-w, -h + r);
  esp32s3ShapeData.quadraticCurveTo(-w, -h, -w + r, -h);
})();

const to92Shape = new THREE.Shape();
(() => {
  // D-shape: straight bottom line from x=-8 to 8, at y=3
  to92Shape.moveTo(-8, 3);
  to92Shape.lineTo(8, 3);
  // Curve from 8 to -8 at the top
  to92Shape.absarc(0, 3, 8, 0, Math.PI, false);
})();


function DMMScreen3D({ id, isActive, customProps }: { id?: string, isActive: boolean, customProps?: any }) {
  const [reading, setReading] = React.useState("0.00");
  React.useEffect(() => {
    if (!isActive || !id) {
      setReading("0.00");
      return;
    }
    const interval = setInterval(() => {
      const readings = (window as any)._circuitReadings || {};
      let r = readings[id];
      let disp = "0.00";
      if (r !== undefined && r !== "SHORT!" && r !== "BROKEN!") {
        const rawVal = parseFloat(r);
        if (!isNaN(rawVal)) {
          const mode = customProps?.dmmMode || "DCV";
          const scaleStr = customProps?.dmmScale || "20";
          let maxVal = 20;
          let mult = 1;
          if (scaleStr.endsWith('m')) { maxVal = parseFloat(scaleStr) * 1e-3; mult = 1e3; }
          else if (scaleStr.endsWith('k')) { maxVal = parseFloat(scaleStr) * 1e3; mult = 1e-3; }
          else if (scaleStr.endsWith('M')) { maxVal = parseFloat(scaleStr) * 1e6; mult = 1e-6; }
          else if (scaleStr.endsWith('A')) { maxVal = parseFloat(scaleStr); mult = 1; }
          else { maxVal = parseFloat(scaleStr); mult = 1; }
          
          if (Math.abs(rawVal) > maxVal && mode !== 'RES') {
            disp = "1 .   ";
          } else if (mode === 'RES' && rawVal > maxVal) {
            disp = "1 .   ";
          } else {
            const scaled = Math.abs(rawVal) * mult;
            disp = scaled.toFixed(2);
            if (rawVal < 0 && mode !== 'RES') disp = "-" + disp;
          }
        }
      }
      setReading(disp);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, id, customProps]);

  return (
    <group position={[0, 2.1, -6]}>
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 4]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>
      <Text
        position={[-4, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={2.5}
        color="#111827"
        anchorX="left"
        anchorY="middle"
      >
        {reading}
      </Text>
      <Text
        position={[4, 0.1, 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="#111827"
        anchorX="right"
        anchorY="middle"
      >
        {customProps?.dmmMode || "DCV"}
      </Text>
    </group>
  );
}

function DMMProbeWire({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) {
  const curvePts = React.useMemo(() => {
    const pts = [];
    const safeStart = start.map(v => (isNaN(v) || v === null) ? 0 : Number(v)) as [number, number, number];
    const safeEnd = end.map(v => (isNaN(v) || v === null) ? 0 : Number(v)) as [number, number, number];

    pts.push(new THREE.Vector3(...safeStart));
    // add slack
    pts.push(new THREE.Vector3(safeStart[0] * 1.5, safeStart[1] - 4, safeStart[2] + 4));
    pts.push(new THREE.Vector3(safeEnd[0] * 1.5, safeEnd[1] - 4, safeEnd[2] - 4));
    pts.push(new THREE.Vector3(...safeEnd));
    return pts;
  }, [start, end]);

  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(curvePts), [curvePts]);

  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 32, 0.25, 12, false]} />
      <meshPhysicalMaterial color={color} roughness={0.7} clearcoat={0.2} />
    </mesh>
  );
}

function DigitalMultimeter3D({ id, isActive, customProps }: { id?: string, isActive: boolean, customProps?: any }) {
  let dialRot = 0;
  const mode = customProps?.dmmMode || "DCV";
  if (mode === "DCV") dialRot = -Math.PI / 4;
  if (mode === "ACV") dialRot = Math.PI / 4;
  if (mode === "DCA") dialRot = 3 * Math.PI / 4;
  if (mode === "RES") dialRot = -3 * Math.PI / 4;

  const parseCoord = (val: any, def: number) => {
    if (val === undefined || val === null || val === "") return def;
    const n = Number(val);
    return isNaN(n) ? def : n;
  };

  const blackX = parseCoord(customProps?.probeBlackX, -10) / 5;
  const blackZ = parseCoord(customProps?.probeBlackY, 115) / 5;
  const redX = parseCoord(customProps?.probeRedX, 10) / 5;
  const redZ = parseCoord(customProps?.probeRedY, 115) / 5;

  return (
    <group position={[0, 2, 0]}>
      {/* Outer Yellow/Orange Rubber Case with Beveled edges */}
      <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[13.5, 3.5, 19.5]} />
        <meshPhysicalMaterial color="#fbbf24" roughness={0.8} clearcoat={0.1} />
      </mesh>
      
      {/* Main Dark Grey Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[12.5, 3.8, 18.5]} />
        <meshPhysicalMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      
      {/* Screen Indentation */}
      <mesh castShadow receiveShadow position={[0, 2.05, -5]}>
        <boxGeometry args={[10.5, 0.2, 6.5]} />
        <meshPhysicalMaterial color="#334155" roughness={0.8} />
      </mesh>
      
      {/* Screen Glass */}
      <mesh castShadow receiveShadow position={[0, 2.1, -5]}>
        <boxGeometry args={[9.5, 0.2, 5.5]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.1} transmission={0.4} opacity={0.8} transparent />
      </mesh>
      
      <DMMScreen3D id={id} isActive={isActive} customProps={customProps} />

      {/* Dial Bezel */}
      <group position={[0, 2.1, 2.5]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 3.5, 0.4, 32]} />
          <meshPhysicalMaterial color="#334155" roughness={0.8} />
        </mesh>
        
        {/* Dial Knob */}
        <group rotation={[0, dialRot, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[2.4, 2.4, 0.6, 32]} />
            <meshPhysicalMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.7, -1.2]}>
            <boxGeometry args={[0.5, 0.5, 1.8]} />
            <meshPhysicalMaterial color="#f8fafc" />
          </mesh>
        </group>
      </group>

      {/* Jacks Panel */}
      <mesh castShadow receiveShadow position={[0, 2.0, 7.5]}>
        <boxGeometry args={[10, 0.3, 3]} />
        <meshPhysicalMaterial color="#0f172a" />
      </mesh>

      <group position={[0, 2.2, 7.5]}>
        {/* COM Jack */}
        <mesh castShadow receiveShadow position={[-3, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshPhysicalMaterial color="#475569" />
        </mesh>
        <mesh castShadow receiveShadow position={[-3, 0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.2, 16]} />
          <meshPhysicalMaterial color="#000000" />
        </mesh>

        {/* V/Ohm/mA Jack */}
        <mesh castShadow receiveShadow position={[3, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshPhysicalMaterial color="#475569" />
        </mesh>
        <mesh castShadow receiveShadow position={[3, 0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.2, 16]} />
          <meshPhysicalMaterial color="#ef4444" />
        </mesh>

        <Text position={[-3, 0.2, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#cbd5e1" anchorX="center" anchorY="middle">COM</Text>
        <Text position={[3, 0.2, -1.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#cbd5e1" anchorX="center" anchorY="middle">V/Ω/mA</Text>
      </group>

      {/* Flexible Wires to Probes */}
      <DMMProbeWire start={[-3, 2.3, 7.5]} end={[blackX, 6, blackZ + 3]} color="#111827" />
      <DMMProbeWire start={[3, 2.3, 7.5]} end={[redX, 6, redZ + 3]} color="#ef4444" />

      {/* Black Probe Handle & Tip */}
      <group position={[blackX, -2, blackZ]}>
        <group rotation={[Math.PI / 6, 0, 0]}>
           <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
             <cylinderGeometry args={[0.08, 0.12, 3, 16]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
           </mesh>
           <mesh castShadow receiveShadow position={[0, 5, 0]}>
             <cylinderGeometry args={[0.45, 0.45, 4.5, 16]} />
             <meshPhysicalMaterial color="#111827" roughness={0.8} />
           </mesh>
           <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
             <cylinderGeometry args={[0.7, 0.7, 0.3, 16]} />
             <meshPhysicalMaterial color="#111827" />
           </mesh>
        </group>
      </group>

      {/* Red Probe Handle & Tip */}
      <group position={[redX, -2, redZ]}>
        <group rotation={[Math.PI / 6, 0, 0]}>
           <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
             <cylinderGeometry args={[0.08, 0.12, 3, 16]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
           </mesh>
           <mesh castShadow receiveShadow position={[0, 5, 0]}>
             <cylinderGeometry args={[0.45, 0.45, 4.5, 16]} />
             <meshPhysicalMaterial color="#ef4444" roughness={0.8} />
           </mesh>
           <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
             <cylinderGeometry args={[0.7, 0.7, 0.3, 16]} />
             <meshPhysicalMaterial color="#ef4444" />
           </mesh>
        </group>
      </group>
    </group>
  );
}
function MeterScreen3D({ id, isActive, type }: { id?: string, isActive: boolean, type: string }) {
  const [reading, setReading] = React.useState("0.00");
  React.useEffect(() => {
    if (!isActive || !id) {
      setReading("0.00");
      return;
    }
    const interval = setInterval(() => {
      const readings = (window as any)._circuitReadings || {};
      let r = readings[id] || "0.00";
      if (type === "voltmeter" && !r.endsWith("V") && r !== "SHORT!") {
        r += "V";
      } else if (type === "ammeter" && !r.endsWith("A") && r !== "SHORT!") {
        r += "A";
      }
      setReading(r);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, id, type]);
  
  return (
    <group position={[0, 8.1, 8]}>
      <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 12]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>
      <Text
        position={[-10, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={8}
        color="#111827"
        anchorX="left"
        anchorY="middle"
      >
        {reading}
      </Text>
    </group>
  );
}

function PowerSupplyDisplay3D({ id, isActive, defaultValue, defaultMaxCurrent }: { id?: string, isActive: boolean, defaultValue: string, defaultMaxCurrent: number }) {
  const [v, setV] = React.useState(defaultValue || "5.0");
  const [i, setI] = React.useState("0.00A");
  
  React.useEffect(() => {
    if (!isActive || !id) {
       setI("0.00A");
       setV(defaultValue || "5.0");
       return;
    }
    const interval = setInterval(() => {
      const readings = (window as any)._circuitReadings || {};
      let cv = defaultValue || "5.0";
      let ca = "0.00A";
      if (readings[id]) {
         const parts = readings[id].split(" ");
         if (parts.length > 1) {
            cv = parts[0]; ca = parts[1];
         }
      }
      setV(cv);
      setI(ca);
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, id, defaultValue]);

  return (
    <group position={[0, 0, 0.2]}>
      <Text position={[-5, 0, 0]} fontSize={5} color="#ef4444">{v}V</Text>
      <Text position={[5, 0, 0]} fontSize={5} color="#3b82f6">{i}</Text>
    </group>
  );
}

function ServoHornGroup({ id, isActive }: { id?: string, isActive: boolean }) {
  const [angle, setAngle] = React.useState(0);
  
  React.useEffect(() => {
     if (!isActive || !id) {
       setAngle(0);
       return;
     }
     const interval = setInterval(() => {
        const readings = (window as any)._circuitReadings || {};
        let a = readings[id] || "0";
        setAngle(parseFloat(a) || 0);
     }, 100);
     return () => clearInterval(interval);
  }, [isActive, id]);

  return (
    <group position={[0, 16, 0]} rotation={[0, (angle * Math.PI) / 180, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, -10]}>
        <boxGeometry args={[4, 2, 20]} />
        <meshPhysicalMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function OLED3DMesh({ isActive, isBroken }: { isActive: boolean, isBroken: boolean }) {
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
              emissiveIntensity={0.5}
            />
          </mesh>
          <group position={[-36.5, 24, 0.1]} scale={[73/128, 48/64, 1]}>
             {oledBuffer.length === 0 && (
                <Text
                  position={[128/2, -64/2, 0]}
                  fontSize={12}
                  color="#a5f3fc"
                  fillOpacity={0.3}
                >
                  OLED I2C
                </Text>
             )}
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
  );
}



function ArduinoUno3D({ isPCB }: { isPCB?: boolean }) {
  return <ArduinoUno3DInner isPCB={isPCB} />;
}function ArduinoUno3DInner({ isPCB }: { isPCB?: boolean }) {
  // Typical Uno size approx 68.6 x 53.4 mm.
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
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
      <group position={[-45, 5, 30]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[16, 12, 12]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* USB hole */}
        <mesh position={[8.1, 0, 0]}>
           <boxGeometry args={[0.2, 8, 10]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* DC Power Jack */}
      <group position={[-45, 4.5, -25]}>
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
           <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
        </mesh>
      </group>
      
      {/* ATmega328P DIP */}
      <group position={[15, 3, -20]}>
        {/* Socket */}
        <mesh castShadow receiveShadow position={[0, -1, 0]}>
           <boxGeometry args={[36, 1.5, 13]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[35, 3.5, 12]} />
           <meshPhysicalMaterial color="#1f2937" roughness={0.8} />
        </mesh>
        {/* Chip pins */}
        {Array.from({length: 14}).map((_, i) => (
          <mesh key={i} castShadow receiveShadow position={[-16.25 + i * 2.5, -1, 6.5]}>
            <boxGeometry args={[1, 3, 1]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
          </mesh>
        ))}
        {Array.from({length: 14}).map((_, i) => (
          <mesh key={'top'+i} castShadow receiveShadow position={[-16.25 + i * 2.5, -1, -6.5]}>
            <boxGeometry args={[1, 3, 1]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
          </mesh>
        ))}
        {/* Notch */}
        <mesh castShadow receiveShadow position={[-17.5, 0.5, 0]}>
           <cylinderGeometry args={[1.5, 1.5, 4]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* Dimple */}
        <mesh castShadow receiveShadow position={[-14, 1.8, -3]}>
           <cylinderGeometry args={[0.5, 0.5, 0.2]} />
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
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
      </mesh>

      {/* Crystal Oscillator (Silver Oval) */}
      <mesh castShadow receiveShadow position={[-8, 2, 5]} rotation={[0, 0, Math.PI/2]}>
         <cylinderGeometry args={[2, 2, 8, 16]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Voltage Regulator */}
      <group position={[-25, 2, -10]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[5, 2, 8]} />
           <meshPhysicalMaterial color="#1f2937" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.5, 4.5]}>
           <boxGeometry args={[5, 0.5, 2]} />
           <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
        </mesh>
      </group>

      {/* Capacitors */}
      <mesh castShadow receiveShadow position={[-20, 4, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 5]} />
         <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-20, 6.5, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 0.2]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[-12, 4, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 5]} />
         <meshPhysicalMaterial color="#111" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-12, 6.5, -5]}>
         <cylinderGeometry args={[2.5, 2.5, 0.2]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
      </mesh>

      {/* RX / TX / L / ON LEDs */}
      <mesh castShadow receiveShadow position={[-15, 1, 20]}>
         <boxGeometry args={[1, 0.5, 2]} />
         <meshPhysicalMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-12, 1, 20]}>
         <boxGeometry args={[1, 0.5, 2]} />
         <meshPhysicalMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-9, 1, 20]}>
         <boxGeometry args={[1, 0.5, 2]} />
         <meshPhysicalMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-25, 1, -2]}>
         <boxGeometry args={[1, 0.5, 2]} />
         <meshPhysicalMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>

      {/* Headers (Top and Bottom) with holes */}
      <group position={[0, 3, 38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[60, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 16}).map((_, i) => (
          <group key={i}>
            <mesh position={[-28 + i * 3.73, 3.1, 0]}>
               <boxGeometry args={[1.5, 0.1, 1.5]} />
               <meshPhysicalMaterial color="#050505" />
            </mesh>
            {/* Header Pins Downwards */}
            <mesh castShadow receiveShadow position={[-28 + i * 3.73, isPCB ? -4.5 : -6, 0]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
            </mesh>
            {i < 12 && (
              <Text position={[-28 + i * 3.73, 3.2, 5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.8} color="#fff">
                 {mcuLabels.arduino_uno[14 + i]}
              </Text>
            )}
          </group>
        ))}
      </group>
      
      <group position={[5, 3, -38]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[50, 6, 5]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 14}).map((_, i) => (
          <group key={i}>
            <mesh position={[-24.2 + i * 3.73, 3.1, 0]}>
               <boxGeometry args={[1.5, 0.1, 1.5]} />
               <meshPhysicalMaterial color="#050505" />
            </mesh>
            {/* Header Pins Downwards */}
            <mesh castShadow receiveShadow position={[-24.2 + i * 3.73, isPCB ? -4.5 : -6, 0]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
            </mesh>
            <Text position={[-24.2 + i * 3.73, 3.2, -5]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.8} color="#fff">
               {mcuLabels.arduino_uno[i]}
            </Text>
          </group>
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
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          ))
        ))}
      </group>
    </group>
  );
}

function ESP32_CAM3D({ isPCB }: { isPCB?: boolean }) {
  const w = 43.2; // 27 * 1.6
  const l = 64; // 40 * 1.6
  return (
    <group position={[0, 1.5, 0]}>
      {/* PCB - Dark almost black */}
      <mesh castShadow receiveShadow>
         <boxGeometry args={[w, 1.5, l]} />
         <meshPhysicalMaterial color="#111827" roughness={0.8} />
      </mesh>
      
      {/* Metal Shield (ESP32-S) */}
      <group position={[0, 3, l/2 - 15]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[w - 12, 3, 16]} />
           <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
        </mesh>
        <Text position={[0, 1.6, 2]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#334155" anchorX="center" anchorY="middle">
           ESP32-S
        </Text>
        <Text position={[0, 1.6, -4]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="#334155" anchorX="center" anchorY="middle">
           Ai-Thinker
        </Text>
        {/* Antenna Trace Area */}
        <mesh castShadow receiveShadow position={[0, -0.5, 12]}>
           <boxGeometry args={[w - 12, 1, 6]} />
           <meshPhysicalMaterial color="#020617" />
        </mesh>
        {/* Zig zag trace (Gold) */}
        <group position={[0, 0.01, 12]}>
          {[[-4,0], [-2,0], [0,0], [2,0], [4,0]].map((pos, i) => (
            <mesh key={i} castShadow receiveShadow position={[pos[0], 0, 0]}>
              <boxGeometry args={[1, 0.1, 4]} />
              <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
          <mesh castShadow receiveShadow position={[-3, 0, 2]}>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[-1, 0, -2]}>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[1, 0, 2]}>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh castShadow receiveShadow position={[3, 0, -2]}>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* OV2640 Camera Module */}
      <group position={[0, 3, -4]}>
        {/* Camera Base/Socket */}
        <mesh castShadow receiveShadow>
           <boxGeometry args={[16, 2, 16]} />
           <meshPhysicalMaterial color="#1f2937" />
        </mesh>
        {/* Camera Lens Barrel (Silver) */}
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
           <cylinderGeometry args={[5, 5, 2.5, 32]} />
           <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Lens Inner Ring (Black) */}
        <mesh castShadow receiveShadow position={[0, 3.3, 0]}>
           <cylinderGeometry args={[4, 4, 0.2, 32]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* Lens Glass (Reflective) */}
        <mesh castShadow receiveShadow position={[0, 3.35, 0]}>
           <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
           <meshPhysicalMaterial color="#020617" roughness={0.1} clearcoat={1.0} />
        </mesh>
        {/* Orange FPC Ribbon */}
        <mesh castShadow receiveShadow position={[0, -0.5, 10]}>
           <boxGeometry args={[10, 0.2, 6]} />
           <meshPhysicalMaterial color="#d97706" roughness={0.5} />
        </mesh>
      </group>

      {/* Flash LED (High-power SMD LED) */}
      <group position={[0, 2, -22]}>
        <mesh castShadow receiveShadow>
           <boxGeometry args={[8, 1, 8]} />
           <meshPhysicalMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
           <cylinderGeometry args={[3, 3, 0.2, 16]} />
           <meshPhysicalMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* MicroSD Card Slot */}
      <mesh castShadow receiveShadow position={[0, -1.5, 8]} rotation={[0, 0, Math.PI]}>
         <boxGeometry args={[22, 1.2, 25]} />
         <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.4} />
      </mesh>
      {/* MicroSD Card inserted */}
      <mesh castShadow receiveShadow position={[0, -1.5, 23]} rotation={[0, 0, Math.PI]}>
         <boxGeometry args={[18, 0.5, 8]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* Header Pins */}
      {Array.from({length: 8}).map((_, i) => {
        const z = -14 + i * 4;
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-19.4, isPCB ? -1.5 : -6, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[19.4, isPCB ? -1.5 : -6, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        )
      })}
    </group>
  );
}

function RaspberryPi3D({ isPCB }: { isPCB?: boolean }) {
  const w = 85 * 1.6;
  const l = 56 * 1.6;
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 1.5, l]} />
        <meshPhysicalMaterial color="#166534" roughness={0.9} />
      </mesh>
      
      {/* CPU (Broadcom SoC) */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[14, 1.5, 14]} />
        <meshPhysicalMaterial color="#111827" />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
        <boxGeometry args={[12, 0.5, 12]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>
      <Text position={[0, 3, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff" anchorX="center" anchorY="middle">
         BROADCOM
      </Text>

      {/* RAM / Network ICs */}
      <mesh castShadow receiveShadow position={[-15, 1.5, -10]}>
        <boxGeometry args={[8, 1, 8]} />
        <meshPhysicalMaterial color="#111827" />
      </mesh>

      {/* USB/Ethernet ports stack on right side (w/2 edge) */}
      {/* Ethernet Port */}
      <group position={[w/2 - 10, 5, l/2 - 12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[18, 12, 14]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* RJ45 plastic inside */}
        <mesh castShadow receiveShadow position={[2, -2, 0]}>
          <boxGeometry args={[14, 8, 12]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>
      
      {/* Wi-Fi / Bluetooth Shield (added) */}
      <group position={[-w/2 + 20, 2, l/2 - 20]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[12, 3, 12]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Logo engraved on shield */}
        <mesh castShadow receiveShadow position={[0, 1.6, 0]}>
          <cylinderGeometry args={[3, 3, 0.1, 16]} />
          <meshPhysicalMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Dual USB Port 1 (USB 3.0 - Blue) */}
      <group position={[w/2 - 10, 5, l/2 - 30]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[16, 14, 12]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* USB plastic inserts */}
        <mesh castShadow receiveShadow position={[1, 2, 0]}>
           <boxGeometry args={[14, 2, 10]} />
           <meshPhysicalMaterial color="#2563eb" />
        </mesh>
        <mesh castShadow receiveShadow position={[1, -4, 0]}>
           <boxGeometry args={[14, 2, 10]} />
           <meshPhysicalMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* Dual USB Port 2 */}
      <group position={[w/2 - 10, 5, l/2 - 45]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[16, 14, 12]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.3} clearcoat={0.5} />
        </mesh>
        {/* USB plastic inserts */}
        <mesh castShadow receiveShadow position={[1, 2, 0]}>
           <boxGeometry args={[14, 2, 10]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
        <mesh castShadow receiveShadow position={[1, -4, 0]}>
           <boxGeometry args={[14, 2, 10]} />
           <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* Micro USB Power */}
      <mesh castShadow receiveShadow position={[-w/2 + 10, 1.5, l/2 - 2]}>
        <boxGeometry args={[8, 3, 6]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.95} />
      </mesh>

      {/* HDMI */}
      <mesh castShadow receiveShadow position={[-w/2 + 30, 1.5, l/2 - 2]}>
        <boxGeometry args={[12, 4, 8]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.95} />
      </mesh>

      {/* Audio Jack */}
      <mesh castShadow receiveShadow position={[-w/2 + 55, 3, l/2 - 4]} rotation={[0, Math.PI/2, 0]}>
        <boxGeometry args={[8, 6, 6]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 55, 3, l/2 - 1]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 3]} />
        <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
      </mesh>

      {/* CSI / DSI connectors */}
      <mesh castShadow receiveShadow position={[-w/2 + 35, 1.5, -l/2 + 25]}>
        <boxGeometry args={[4, 5, 20]} />
        <meshPhysicalMaterial color="#f8fafc" />
      </mesh>
      <mesh castShadow receiveShadow position={[-w/2 + 35, 4, -l/2 + 25]}>
        <boxGeometry args={[3, 1, 18]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>
      
      <mesh castShadow receiveShadow position={[w/2 - 35, 1.5, l/2 - 25]}>
        <boxGeometry args={[4, 5, 20]} />
        <meshPhysicalMaterial color="#f8fafc" />
      </mesh>

      {/* 40 pin header Plastic Base */}
      <mesh castShadow receiveShadow position={[(-w/2 + 5 + (-w/2 + 5 + 19 * 5)) / 2, 2.5, -l/2 + 7.5]}>
        <boxGeometry args={[20 * 5 + 2, 2, 10]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>

      {/* 40 pin header */}
      {Array.from({length: 20}).map((_, i) => {
        const x = -w/2 + 5 + i * 5;
        return (
          <group key={i}>
            {/* Header Pins Upwards */}
            <mesh castShadow receiveShadow position={[x, 5.5, -l/2 + 5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[x, 5.5, -l/2 + 10]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
            {/* Header Pins Downwards (if PCB, for connection visualization) */}
            <mesh castShadow receiveShadow position={[x, isPCB ? -4.5 : -6, -l/2 + 5]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[x, isPCB ? -4.5 : -6, -l/2 + 10]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
               <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Micro SD Slot (bottom) */}
      <mesh castShadow receiveShadow position={[-w/2 + 8, -1, 0]}>
        <boxGeometry args={[16, 2, 14]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      {/* Inserted Micro SD Card */}
      <mesh castShadow receiveShadow position={[-w/2 - 2, -1, 0]}>
        <boxGeometry args={[10, 0.5, 11]} />
        <meshPhysicalMaterial color="#111" />
      </mesh>

    </group>
  );
}


function STM32BluePill3D({ isPCB }: { isPCB?: boolean }) {
  const w = 22 * 1.6;
  const l = 53 * 1.6;
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      {/* PCB */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, 1.5, l]} />
        <meshPhysicalMaterial color="#1d4ed8" roughness={0.8} />
      </mesh>
      
      {/* STM32 Microcontroller (LQFP48) - Rotated 45 degrees */}
      <group position={[0, 1.5, 5]}>
        <mesh castShadow receiveShadow rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[10, 1.2, 10]} />
          <meshPhysicalMaterial color="#111827" />
        </mesh>
        {/* Dimple */}
        <mesh castShadow receiveShadow position={[-3, 0.6, 0]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.2]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
        <Text position={[0, 0.61, 0]} rotation={[-Math.PI/2, 0, Math.PI / 4]} fontSize={1.6} color="#94a3b8">STM32</Text>
      </group>

      {/* Micro USB Port */}
      <group position={[0, 2.5, -l/2 + 4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8, 3.5, 6]} />
          <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -2]}>
          <boxGeometry args={[5, 1, 4]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* Reset Button */}
      <mesh castShadow receiveShadow position={[0, 1.5, -l/2 + 15]}>
        <boxGeometry args={[4, 1.5, 4]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 2.5, -l/2 + 15]}>
        <cylinderGeometry args={[1, 1, 0.5]} />
        <meshPhysicalMaterial color="#ef4444" />
      </mesh>

      {/* Crystals */}
      {/* 8MHz Crystal */}
      <mesh castShadow receiveShadow position={[8, 2, -l/2 + 15]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
        <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* 32.768kHz Crystal */}
      <mesh castShadow receiveShadow position={[8, 1.5, -l/2 + 22]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.8, 0.8, 3, 16]} />
        <meshPhysicalMaterial color="#111" metalness={0.5} />
      </mesh>

      {/* BOOT0 / BOOT1 Jumpers */}
      <group position={[-8, 2, -l/2 + 28]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1, 8]} />
          <meshPhysicalMaterial color="#eab308" />
        </mesh>
        {/* Jumper Cap 1 */}
        <mesh castShadow receiveShadow position={[0, 2, -2]}>
          <boxGeometry args={[2, 3, 3]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
        {/* Jumper Cap 2 */}
        <mesh castShadow receiveShadow position={[0, 2, 2]}>
          <boxGeometry args={[2, 3, 3]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
      </group>

      {/* ST-Link Header (4 pins at bottom edge) */}
      <group position={[0, 2, l/2 - 2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[16, 2, 2.5]} />
          <meshPhysicalMaterial color="#111" />
        </mesh>
        {Array.from({length: 4}).map((_, i) => (
          <mesh key={i} castShadow receiveShadow position={[-6 + i * 4, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 4]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Power LED (Red) & User LED PC13 (Green) */}
      <mesh castShadow receiveShadow position={[-6, 1.5, -l/2 + 10]}>
        <boxGeometry args={[1.5, 0.5, 2.5]} />
        <meshPhysicalMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[-6, 1.5, -l/2 + 15]}>
        <boxGeometry args={[1.5, 0.5, 2.5]} />
        <meshPhysicalMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.2} />
      </mesh>

      {/* Side Pin Headers */}
      {/* Plastic Bases */}
      <mesh castShadow receiveShadow position={[-w/2 + 3, 1.5, 0.6]}>
        <boxGeometry args={[2.5, 2, 20 * 4]} />
        <meshPhysicalMaterial color="#eab308" />
      </mesh>
      <mesh castShadow receiveShadow position={[w/2 - 3, 1.5, 0.6]}>
        <boxGeometry args={[2.5, 2, 20 * 4]} />
        <meshPhysicalMaterial color="#eab308" />
      </mesh>

      {Array.from({length: 20}).map((_, i) => (
        <group key={i}>
          {/* Left Pins */}
          <mesh castShadow receiveShadow position={[-w/2 + 3, 4, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.3, 0.3, 4]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
          <mesh castShadow receiveShadow position={[-w/2 + 3, isPCB ? -4.5 : -6, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.3, 0.3, isPCB ? 4 : 8]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>

          {/* Right Pins */}
          <mesh castShadow receiveShadow position={[w/2 - 3, 4, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.3, 0.3, 4]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
          <mesh castShadow receiveShadow position={[w/2 - 3, isPCB ? -4.5 : -6, -l/2 + 5 + i * 4]}>
             <cylinderGeometry args={[0.3, 0.3, isPCB ? 4 : 8]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LDR3D({ isPCB }: { isPCB?: boolean }) {
  return (
    <group position={[0, isPCB ? 1.5 : 4, 0]}>
      {/* Leads */}
      <mesh castShadow receiveShadow position={[-5, isPCB ? -1 : -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[5, isPCB ? -1 : -4, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      
      {/* Ceramic Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
         <cylinderGeometry args={[7, 7, 1.5, 32]} />
         <meshPhysicalMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      
      {/* CdS Track (Snake pattern representation) */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
         <cylinderGeometry args={[5, 5, 0.2, 32]} />
         <meshPhysicalMaterial color="#d97706" roughness={0.4} />
      </mesh>
      {/* Track cutouts to make zigzag */}
      <mesh castShadow receiveShadow position={[0, 0.85, 1.5]}>
         <boxGeometry args={[8, 0.2, 0.5]} />
         <meshPhysicalMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.85, -1.5]}>
         <boxGeometry args={[8, 0.2, 0.5]} />
         <meshPhysicalMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      
      {/* Clear Epoxy Coating */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
         <cylinderGeometry args={[7.2, 7.2, 2.5, 32]} />
         <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
}

function CR20323D({ isPCB }: { isPCB?: boolean }) {
  return (
    <group position={[0, isPCB ? 1.5 : 2, 0]}>
      <mesh castShadow receiveShadow position={[-10, isPCB ? -1 : -2, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 6]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, isPCB ? -1 : -2, 0]}>
         <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 6]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 10, 0]} rotation={[Math.PI/2, 0, 0]}>
         <cylinderGeometry args={[10, 10, 2, 32]} />
         <meshPhysicalMaterial color="#d1d5db" metalness={0.9} />
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
      
      {/* Module Base PCB (Green/Blue/Black under shield) */}
      <mesh castShadow receiveShadow position={[0, 1.5, 15]}>
         <boxGeometry args={[w - 10, 1.6, 26]} />
         <meshPhysicalMaterial color="#1e293b" />
      </mesh>
      
      {/* Metal Shield */}
      <mesh castShadow receiveShadow position={[0, 3, 15]}>
         <boxGeometry args={[w - 12, 3, 24]} />
         <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
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
      {Array.from({length: isS3 ? 22 : 15}).map((_, i) => {
        const pinCount = isS3 ? 22 : 15;
        const spacing = 4;
        const offset = isS3 ? -42 : -28;
        const z = offset + i * spacing;
        
        return (
          <group key={i}>
            <mesh castShadow receiveShadow position={[-19.4, isPCB ? -1.5 : -4, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <Text position={[-w/2 + 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? (mcuLabels.esp32s3 ? mcuLabels.esp32s3[i] : '') : (mcuLabels.esp32 ? mcuLabels.esp32[i] : '')}
            </Text>
            
            <mesh castShadow receiveShadow position={[19.4, isPCB ? -1.5 : -4, z]}>
               <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 10]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <Text position={[w/2 - 8, 5, z]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#fff">
               {isS3 ? (mcuLabels.esp32s3 ? mcuLabels.esp32s3[i + 22] : '') : (mcuLabels.esp32 ? mcuLabels.esp32[i + 15] : '')}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function OLED3D({ isActive, isBroken }: { isActive?: boolean, isBroken?: boolean }) {
  return <OLED3DInner isActive={isActive} isBroken={isBroken} />;
}
function OLED3DInner({ isActive, isBroken }: { isActive?: boolean, isBroken?: boolean }) {
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
      <mesh castShadow receiveShadow position={[0, 2.5, -12]}>
         <boxGeometry args={[20, 3, 2.5]} />
         <meshPhysicalMaterial color="#111" />
      </mesh>
      {[-7.5, -2.5, 2.5, 7.5].map(x => (
        <mesh castShadow receiveShadow key={x} position={[x, -2, -12]}>
           <cylinderGeometry args={[0.4, 0.4, 12]} />
           <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
        </mesh>
      ))}
      <Text position={[-7.5, 1.6, -9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">GND</Text>
      <Text position={[-2.5, 1.6, -9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">VCC</Text>
      <Text position={[2.5, 1.6, -9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SCL</Text>
      <Text position={[7.5, 1.6, -9]} rotation={[-Math.PI/2, 0, 0]} fontSize={1.2} color="#fff">SDA</Text>

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
function NTC3D({ isPCB }: { isPCB?: boolean }) {
  return <NTC3DInner isPCB={isPCB} />;
}

function NTC3DInner({ isPCB }: { isPCB?: boolean }) {
  return (
    <group position={[0, isPCB ? 1.5 : 4, 0]}>
      {/* Leads */}
      <mesh castShadow receiveShadow position={[-5, isPCB ? -1 : -5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[5, isPCB ? -1 : -5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
      </mesh>
      
      {/* Thermistor Bead / Epoxy Head */}
      <mesh castShadow receiveShadow position={[0, 1, 0]} scale={[1, 0.8, 0.4]}>
        {/* A bulbous disc shape typically found on NTCs */}
        <sphereGeometry args={[4, 32, 16]} />
        <meshPhysicalMaterial color="#0f766e" roughness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, -0.5, 0]} scale={[1, 1, 0.4]}>
        <cylinderGeometry args={[2.5, 2.5, 2, 32]} />
        <meshPhysicalMaterial color="#0f766e" roughness={0.2} clearcoat={0.8} />
      </mesh>
      
      {/* Value Text */}
      <Text position={[0, 1, 1.7]} fontSize={1.2} color="#ccfbf1">10K</Text>
    </group>
  );
}

function SevenSegment3D({ isActive, value }: { isActive?: boolean, value?: string }) {
  return <SevenSegment3DInner isActive={isActive} value={value} />;
}
function SevenSegment3DInner({ isActive, value }: { isActive?: boolean, value?: string }) {
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
         <boxGeometry args={[26, 8, 36]} />
         <meshPhysicalMaterial color="#111827" roughness={0.8} />
      </mesh>
      
      {/* Pins */}
      {[-15, 15].map(z => 
        [-10, -5, 0, 5, 10].map(x => (
          <mesh castShadow receiveShadow key={x+z} position={[x, -8, z]}>
             <cylinderGeometry args={[0.3, 0.3, 8]} />
             <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
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



export function HighQualityMesh({
  id,
  type,
  isActive = false,
  isBroken = false,
  isClosed = false,
  customProps = {},
  value = "",
  showBody = true,
  reading = "",
  isPCB = false, bounds,
}: {
  isPCB?: boolean; bounds?: {w: number, d: number};
  reading?: string;
  showBody?: boolean;
  id?: string;
  type: string;
  isActive?: boolean;
  isBroken?: boolean;
  isClosed?: boolean;
  customProps?: any;
  value?: string;
}) {
  const { updateElement } = useEditor();
  const groupRef = React.useRef<any>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (isActive && type === "motor") {
      const mesh = groupRef.current.getObjectByName("motorShaft");
      if (mesh) mesh.rotateY(0.2); // Spin locally
    }
    if (isActive && type === "buzzer") {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 100) * 0.5;
    } else if (type === "buzzer") {
      groupRef.current.position.y = 0;
    }
  });

  const getMeshes = () => {
    switch (type) {
      case "pad":
      case "via": {
        const isVia = type === "via";
        // Via has smaller ring usually
        const innerRadius = 1.5;
        const outerRadius = isVia ? 2.5 : 3.5;
        // On PCB, pad is just a copper ring around the hole
        return (
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[innerRadius, outerRadius, 16]} />
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[innerRadius, outerRadius, 16]} />
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[innerRadius, innerRadius, 1.6, 16, 1, true]} />
              <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      }
      case "dip8":
      case "timer555":
      case "opamp":
      case "attiny85": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 8;
        const l = (p / 2) * 2.5;
        return <DIP_IC3D pins={p} length={Math.max(10, l)} width={8} value={value} type={type} isPCB={isPCB} />;
      }
        
      case "ic":
      case "logic_gate":
      case "logic_and":
      case "logic_or":
      case "logic_not":
      case "logic_nand":
      case "logic_nor":
      case "logic_xor": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 14;
        const l = (p / 2) * 2.5;
        return <DIP_IC3D pins={p} length={Math.max(10, l)} width={8} value={value} type={type} isPCB={isPCB} />;
      }

      case "stm32_bluepill":
        return <STM32BluePill3D isPCB={isPCB} />;

      
      case "sop":
      case "soic": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 8;
        const l = (p / 2) * 1.5;
        return <SOP_IC3D pins={p} length={Math.max(6, l)} width={4} value={value} type={type} isPCB={isPCB} />;
      }
        
      case "qfp":
      case "bga": {
        const p = customProps?.pins ? parseInt(customProps.pins) : 16;
        const l = (p / 2) * 1.5;
        return <SOP_IC3D pins={p} length={Math.max(10, l)} width={10} value={value} type={type} isPCB={isPCB} />;
      }
      case "usb_c":
      case "micro_usb": {
        const isTypeC = type === "usb_c";
        const w = isTypeC ? 30 : 20;
        const h = isTypeC ? 20 : 16;
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
              <boxGeometry args={[w, 3, h]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.5, -h/2 + 1]}>
              <boxGeometry args={[w-2, 2, 2]} />
              <meshPhysicalMaterial color="#111111" />
            </mesh>
            
            {isTypeC ? (
              <group position={[0, 0, h/2]}>
                {[...Array(12)].map((_, i) => (
                  <mesh castShadow receiveShadow key={`pad_${i}`} position={[-11.5 + i * 2, -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                  </mesh>
                ))}
                <group position={[-12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                </group>
                <group position={[12, 0, -8]}>
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                </group>
              </group>
            ) : (
              <group position={[0, 0, h/2]}>
                {[...Array(5)].map((_, i) => (
                  <mesh castShadow receiveShadow key={`pad_${i}`} position={[-4.5 + i * 2, -1.65, 0]}>
                    <boxGeometry args={[1.5, 0.1, 4]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                  </mesh>
                ))}
                <group position={[-9.5, 0, -6.5]}>
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                </group>
                <group position={[9.5, 0, -6.5]}>
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                  <mesh castShadow receiveShadow position={[0, 0.05, 0]}><boxGeometry args={[4, 0.1, 4]} /><meshPhysicalMaterial color="#d4af37" metalness={0.9} roughness={0.2} /></mesh>
                  
                </group>
              </group>
            )}
          </group>
        );
      }

      case "servo_motor": { return (<group position={[0, 0, 0]}>
            {/* Main Blue Body */}
            <mesh castShadow receiveShadow position={[0, 11, 0]}>
              <boxGeometry args={[22, 22, 12]} />
              <meshPhysicalMaterial color="#2563eb" roughness={0.6} />
            </mesh>
            {/* Mounting Ears */}
            <mesh castShadow receiveShadow position={[0, 18, 0]}>
              <boxGeometry args={[32, 2, 12]} />
              <meshPhysicalMaterial color="#2563eb" roughness={0.6} />
            </mesh>
            {/* Motor Cylinder Top */}
            <mesh castShadow receiveShadow position={[4, 23, 0]}>
              <cylinderGeometry args={[5, 5, 2, 32]} />
              <meshPhysicalMaterial color="#2563eb" roughness={0.6} />
            </mesh>
            {/* Gear / Horn */}
            <mesh castShadow receiveShadow position={[4, 24.5, 0]}>
              <cylinderGeometry args={[2, 2, 1, 16]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 25.5, 0]}>
              <boxGeometry args={[16, 1, 4]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            {/* Wires */}
            <group position={[-11, 4, 0]}>
              {["#b45309", "#ef4444", "#fbbf24"].map((c, i) => (
                <mesh castShadow receiveShadow key={i} position={[0, -2, (i - 1) * 2]}>
                  <cylinderGeometry args={[0.5, 0.5, 8, 8]} />
                  <meshPhysicalMaterial color={c} />
                </mesh>
              ))}
            </group>
          </group>
        );
      }

      
      case "gps_pcb":
      case "gps": return (<group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
              <boxGeometry args={[26, 4, 35]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 5, 5]}>
              <boxGeometry args={[20, 2, 20]} />
              <meshPhysicalMaterial color="#d1d5db" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 6, 5]}>
              <cylinderGeometry args={[2, 2, 0.5, 16]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4, -12]}>
              <boxGeometry args={[10, 3, 5]} />
              <meshPhysicalMaterial color="#374151" />
            </mesh>
            {[-7.5, -2.5, 2.5, 7.5].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, -16]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
          </group>
        );

      case "accelerometer_pcb":
      case "accelerometer": return (<group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
              <boxGeometry args={[16, 3, 20]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
              <boxGeometry args={[5, 1.5, 5]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            <mesh castShadow receiveShadow position={[-4, 3.5, -4]}>
              <boxGeometry args={[2, 1, 3]} />
              <meshPhysicalMaterial color="#4b5563" />
            </mesh>
            {[-8.75, -6.25, -3.75, -1.25, 1.25, 3.75, 6.25, 8.75].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -2 : -6, -8]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
          </group>
        );

                  case "gas_sensor_pcb":
      case "gas_sensor": return (<group position={[0, 0, 0]}>
            {/* PCB */}
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
              <boxGeometry args={[40, 1.5, 40]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.7} />
            </mesh>
            
            {/* Gas Sensor Head (MQ-2) */}
            <group position={[0, 1.5, -5]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, -2]}>
                <cylinderGeometry args={[10, 10, 4, 32]} />
                <meshPhysicalMaterial color="#0f172a" roughness={0.9} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, -8]}>
                <cylinderGeometry args={[10, 10, 12, 32]} />
                <meshPhysicalMaterial color="#d1d5db" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, -14.1]}>
                <cylinderGeometry args={[9, 9, 0.5, 32]} />
                <meshPhysicalMaterial color="#334155" wireframe wireframeLinewidth={2} />
              </mesh>
            </group>
            
            {/* Trim Potentiometer */}
            <group position={[0, 3, 10]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[8, 4, 8]} />
                <meshPhysicalMaterial color="#0284c7" />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 2, 0]}>
                <cylinderGeometry args={[2, 2, 1, 16]} />
                <meshPhysicalMaterial color="#fbbf24" metalness={0.8} roughness={0.4} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 2.6, 0]}>
                <boxGeometry args={[3, 0.2, 0.5]} />
                <meshPhysicalMaterial color="#111827" />
              </mesh>
            </group>
            {/* Small IC */}
            <mesh castShadow receiveShadow position={[-4, 2, 11]}>
              <boxGeometry args={[4, 1, 5]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            
            <Text position={[0, 2, 4]} rotation={[-Math.PI/2, 0, 0]} fontSize={4} color="#ffffff">MQ-2</Text>
            {/* Pins */}
            <group position={[0, 0, 20]}>
              {[-15, -5, 5, 15].map((x, i) => (
                <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -2 : 0, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              ))}
              {/* Pin Labels */}
              <Text position={[-15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">A0</Text>
              <Text position={[-5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">D0</Text>
              <Text position={[5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">GND</Text>
              <Text position={[15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">VCC</Text>
            </group>
          </group>
        );
case "esp8266":
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
              <boxGeometry args={[18, 2, 28]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3.5, 4]}>
              <boxGeometry args={[12, 1.5, 16]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 3.1, -8]}>
              <boxGeometry args={[14, 0.5, 6]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {[-14, -10, -6, -2, 2, 6, 10, 14].map((z, i) => (
              <group key={i}>
                <mesh castShadow receiveShadow position={[-18, isPCB ? -1.5 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
                <mesh castShadow receiveShadow position={[18, isPCB ? -1.5 : -6, z]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        );

      case "motor_driver": return (<group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
              <boxGeometry args={[35, 3, 80]} />
              <meshPhysicalMaterial color="#dc2626" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 6, 0]}>
              <boxGeometry args={[14, 5, 16]} />
              <meshPhysicalMaterial color="#111827" roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 8.5, 0]}>
              <boxGeometry args={[14, 1, 16]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.8} roughness={0.4} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 9.5, 0]}>
              <boxGeometry args={[16, 1, 18]} />
              <meshPhysicalMaterial color="#9ca3af" metalness={0.9} roughness={0.2} />
            </mesh>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const z = -35 + i * 10;
              return (
                <group key={i}>
                  <mesh castShadow receiveShadow position={[-15, -4, z]}>
                    <cylinderGeometry args={[0.5, 0.5, 12, 8]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.8} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[15, -4, z]}>
                    <cylinderGeometry args={[0.5, 0.5, 12, 8]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.8} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );

      case "stepper_motor": return (<group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 10, 0]}>
              <boxGeometry args={[42, 42, 40]} />
              <meshPhysicalMaterial color="#374151" roughness={0.8} metalness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 10, 22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[11, 11, 4, 32]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 10, 28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.5, 2.5, 15, 16]} />
              <meshPhysicalMaterial color="#e5e7eb" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Wires descending to z = 30 pads */}
            <group position={[0, 10, -20]}>
              {[-15, -5, 5, 15].map((x, i) => (
                <mesh castShadow receiveShadow key={i} position={[x, -10, 50]}>
                  <cylinderGeometry args={[0.5, 0.5, 20]} />
                  <meshPhysicalMaterial color={["#ef4444", "#3b82f6", "#10b981", "#000000"][i]} />
                </mesh>
              ))}
            </group>
          </group>
        );

      case "dht11":
        return (
          <group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 4, 0]}>
              <boxGeometry args={[12, 15, 6]} />
              <meshPhysicalMaterial color="#0ea5e9" roughness={0.6} />
            </mesh>
            <group position={[0, 4, 3.1]}>
              {[-3, -1, 1, 3].map((y, i) => (
                <mesh castShadow receiveShadow key={i} position={[0, y, 0]}>
                  <boxGeometry args={[8, 0.5, 0.5]} />
                  <meshPhysicalMaterial color="#0284c7" />
                </mesh>
              ))}
            </group>
            {[-8, 0, 8].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
          </group>
        );

      case "hc05": return (<group position={[0, 0, 0]}>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
              <boxGeometry args={[16, 3, 30]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4, -4]}>
              <boxGeometry args={[12, 2, 16]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4, 8]}>
              <boxGeometry args={[12, 1, 8]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {[-12.5, -7.5, -2.5, 2.5, 7.5, 12.5].map((x, i) => (
              <mesh castShadow receiveShadow key={i} position={[x, isPCB ? -1.5 : -6, -14]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 12]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
          </group>
        );

                  case "ultrasonic": return (<group position={[0, 0, 0]}>
            {/* PCB */}
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
              <boxGeometry args={[60, 1.5, 30]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.7} />
            </mesh>
            
            {/* T (Transmitter) Transducer */}
            <group position={[-15, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, -6]}>
                <cylinderGeometry args={[10, 10, 12, 32]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Mesh cover */}
              <mesh castShadow receiveShadow position={[0, 0, -12.1]}>
                <cylinderGeometry args={[9.5, 9.5, 0.2, 32]} />
                <meshPhysicalMaterial color="#111827" wireframe />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, -12.1]}>
                <cylinderGeometry args={[9.7, 9.7, 0.4, 32]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.8} />
              </mesh>
            </group>
            
            <Text position={[-15, 2.5, 12]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#ffffff">T</Text>
            {/* R (Receiver) Transducer */}
            <group position={[15, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, -6]}>
                <cylinderGeometry args={[10, 10, 12, 32]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Mesh cover */}
              <mesh castShadow receiveShadow position={[0, 0, -12.1]}>
                <cylinderGeometry args={[9.5, 9.5, 0.2, 32]} />
                <meshPhysicalMaterial color="#111827" wireframe />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, -12.1]}>
                <cylinderGeometry args={[9.7, 9.7, 0.4, 32]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.5} roughness={0.8} />
              </mesh>
            </group>
            
            <Text position={[15, 2.5, 12]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#ffffff">R</Text>
            {/* Crystal Oscillator */}
            <mesh castShadow receiveShadow position={[-3, 3, -8]}>
              <boxGeometry args={[4, 2, 10]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Main IC */}
            <mesh castShadow receiveShadow position={[0, 2.5, 5]}>
              <boxGeometry args={[10, 1, 10]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {/* Pins */}
            <group position={[0, 0, 15]}>
              {[-15, -5, 5, 15].map((x, i) => (
                <mesh castShadow receiveShadow key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              ))}
              {/* Pin Labels */}
              <Text position={[-15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Vcc</Text>
              <Text position={[-5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Trig</Text>
              <Text position={[5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Echo</Text>
              <Text position={[15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Gnd</Text>
            </group>
            <Text position={[-20, 2.5, -12]} rotation={[-Math.PI/2, 0, 0]} fontSize={3} color="#ffffff">HC-SR04</Text>
          </group>
        );
case "protoboard": {
        const holes: [number, number][] = [];
        for (let i = 0; i < 60 * 10; i++) {
          holes.push([
            -290 + (i % 60) * 10,
            i < 300
              ? -20 - Math.floor(i / 60) * 10
              : 20 + Math.floor((i - 300) / 60) * 10,
          ]);
        }
        for (let i = 0; i < 60 * 4; i++) {
          holes.push([
            -290 + (i % 60) * 10,
            i < 120
              ? -90 + Math.floor(i / 60) * 10
              : 80 + Math.floor((i - 120) / 60) * 10,
          ]);
        }

        return (
          <group position={[0, 0, 0]}>
            {/* Base plastic */}
            <mesh castShadow receiveShadow position={[0, -2, 0]}>
              <boxGeometry args={[620, 6, 210]} />
              <meshPhysicalMaterial
                color="#f8fafc"
                clearcoat={0.3}
                clearcoatRoughness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Center groove */}
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
              <boxGeometry args={[600, 0.4, 18]} />
              <meshPhysicalMaterial color="#e2e8f0" roughness={0.7} />
            </mesh>
            {/* Red and Blue Lines */}
            <mesh castShadow receiveShadow position={[0, 1.05, -75]}>
              <boxGeometry args={[610, 0.2, 1.5]} />
              <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.05, -105]}>
              <boxGeometry args={[610, 0.2, 1.5]} />
              <meshPhysicalMaterial color="#3b82f6" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.05, 75]}>
              <boxGeometry args={[610, 0.2, 1.5]} />
              <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 1.05, 105]}>
              <boxGeometry args={[610, 0.2, 1.5]} />
              <meshPhysicalMaterial color="#3b82f6" />
            </mesh>
            {/* Holes simulation */}
            <group position={[0, 1.02, 0]}>
              {holes.map((h, i) => (
                <mesh castShadow receiveShadow key={i} position={[h[0], 0, h[1]]}>
                  <boxGeometry args={[4, 0.2, 4]} />
                  <meshBasicMaterial color="#1a1c1e" />
                </mesh>
              ))}
            </group>
          </group>
        );
      }
      case "resistor":
        const resVal = value || customProps?.resistance?.toString() || "10";
        const bands = getResistorColors(resVal);
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
            {bands.map((color, i) => {
              const spacing = bands.length === 4 ? 4 : 3;
              const startX = -7;
              const xPos = startX + i * spacing;
              return (
                <mesh key={i} castShadow receiveShadow position={[xPos, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[3.05, 3.05, 1.5, 16]} />
                  <meshPhysicalMaterial color={color} roughness={0.9} />
                </mesh>
              );
            })}
          </group>
        );
      case "capacitor":
        return (
          <group position={[0, isPCB ? 6 : 6, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-5, isPCB ? -3 : -6, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 7 : 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, isPCB ? -3 : -6, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 7 : 12]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            {/* Ceramic Body - Yellow/Orange */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <sphereGeometry args={[7, 16, 16]} />
              <meshPhysicalMaterial color="#eab308" roughness={0.4} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[7, 7, 3, 16]} />
              <meshPhysicalMaterial color="#eab308" roughness={0.4} clearcoat={0.5} />
            </mesh>
          </group>
        );
      case "capacitor_elec":
        return (
          <group position={[0, isPCB ? 4 : 4, 0]}>
            {/* Leads */}
            <mesh castShadow receiveShadow position={[-5, isPCB ? -2 : -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, isPCB ? -2 : -4, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            
            {/* Plastic Base Plate */}
            <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
              <cylinderGeometry args={[11, 11, 1, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.9} />
            </mesh>
            
            {/* Main Body */}
            <mesh castShadow receiveShadow position={[0, 16.5, 0]}>
              <cylinderGeometry args={[10, 10, 32, 32]} />
              <meshPhysicalMaterial color="#1e40af" roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.2} metalness={0.1} />
            </mesh>
            
            {/* Metallic Top Cap */}
            <mesh castShadow receiveShadow position={[0, 32.5, 0]}>
              <cylinderGeometry args={[9.9, 9.9, 0.2, 32]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} clearcoat={1} />
            </mesh>
            
            {/* Vent/Cross Indent on Top */}
            <group position={[0, 32.6, 0]}>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[10, 0.1, 1]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[1, 0.1, 10]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
            
            {/* Negative Stripe Marker (+X side) */}
            <mesh castShadow receiveShadow position={[0, 16.5, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[10.1, 10.1, 32, 16, 1, false, -0.4, 0.8]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.3} />
            </mesh>
            
            {/* Minus symbols on the stripe (+X side) */}
            <mesh castShadow receiveShadow position={[10.15, 23, 0]}>
              <boxGeometry args={[0.1, 1.2, 4]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[10.15, 10, 0]}>
              <boxGeometry args={[0.1, 1.2, 4]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      case "inductor":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            {/* Axials Leads */}
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.4, 0.4, 9]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            
            {/* Ferrite Drum Core */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[2.5, 2.5, 16, 32]} />
              <meshPhysicalMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
            </mesh>
            
            {/* End Caps holding the wire */}
            <mesh castShadow receiveShadow position={[-7.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.8, 3.8, 1, 32]} />
              <meshPhysicalMaterial color="#334155" roughness={0.9} />
            </mesh>
            <mesh castShadow receiveShadow position={[7.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[3.8, 3.8, 1, 32]} />
              <meshPhysicalMaterial color="#334155" roughness={0.9} />
            </mesh>

            {/* Coiled Copper Wire (Axial Windings) */}
            {Array.from({ length: 14 }).map((_, i) => (
              <mesh key={`coil-${i}`} castShadow receiveShadow position={[-6.5 + i * 1.0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.6, 0.45, 8, 32]} />
                <meshPhysicalMaterial color="#b45309" roughness={0.3} metalness={0.8} clearcoat={0.5} />
              </mesh>
            ))}
          </group>
        );
      case "diode":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Diode Black Body 1N4007 Style */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[2.2, 2.2, 14, 32]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            {/* Rounded Ends */}
            <mesh castShadow receiveShadow position={[-7, 0, 0]}>
              <sphereGeometry args={[2.2, 32, 16]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            <mesh castShadow receiveShadow position={[7, 0, 0]}>
              <sphereGeometry args={[2.2, 32, 16]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} />
            </mesh>
            
            {/* Silver Stripe at +X */}
            <mesh castShadow receiveShadow position={[5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[2.25, 2.25, 2, 32]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Label */}
            <Text position={[0, 2.3, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.2} color="#94a3b8" anchorX="center" anchorY="middle">
              1N4007
            </Text>
          </group>
        );
      case "zener_diode":
        return (
          <group position={[0, isPCB ? 1.5 : 2, 0]}>
            <mesh castShadow receiveShadow position={[-10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[-15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 9]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh castShadow receiveShadow position={[15, isPCB ? -0.5 : -2, 0]}>
              <cylinderGeometry args={[0.4, 0.4, isPCB ? 5 : 4]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Glass Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.8, 1.8, 12, 32]} />
              <meshPhysicalMaterial color="#f97316" transmission={0.8} opacity={1} transparent roughness={0.1} clearcoat={1} />
            </mesh>
            {/* Rounded Glass Ends */}
            <mesh castShadow receiveShadow position={[-6, 0, 0]}>
              <sphereGeometry args={[1.8, 32, 16]} />
              <meshPhysicalMaterial color="#f97316" transmission={0.8} opacity={1} transparent roughness={0.1} clearcoat={1} />
            </mesh>
            <mesh castShadow receiveShadow position={[6, 0, 0]}>
              <sphereGeometry args={[1.8, 32, 16]} />
              <meshPhysicalMaterial color="#f97316" transmission={0.8} opacity={1} transparent roughness={0.1} clearcoat={1} />
            </mesh>

            {/* Inner Core (Visible through glass) */}
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.8, 0.8, 10]} />
              <meshPhysicalMaterial color="#ea580c" metalness={0.5} roughness={0.8} />
            </mesh>
            
            {/* Cathode Black Stripe at +X */}
            <mesh castShadow receiveShadow position={[4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1.85, 1.85, 1.5, 32]} />
              <meshPhysicalMaterial color="#111" roughness={0.9} />
            </mesh>

            {/* Small Label */}
            <Text position={[-1, 1.9, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1} color="#111" anchorX="center" anchorY="middle">
              4148
            </Text>
          </group>
        );

case "transistor":
      case "transistor_pnp": return (<group position={[0, 0, 0]}>
            {/* TO-92 D-shape plastic body using extrudeGeometry */}
            <mesh castShadow receiveShadow position={[0, 16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <extrudeGeometry args={[to92Shape, { depth: 16, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 3 }]} />
              <meshPhysicalMaterial color="#0f172a" roughness={0.7} clearcoat={0.2} />
            </mesh>
            {/* Laser-etched metallic text on the flat face */}
            <Text position={[0, 12, 3.1]} fontSize={2.5} color="#e2e8f0" rotation={[0, 0, 0]}>
              {value || (type === "transistor_pnp" ? "BC558" : "BC548")}
            </Text>
            <Text position={[0, 8.5, 3.1]} fontSize={1.6} color="#cbd5e1" rotation={[0, 0, 0]}>
              {type === "transistor_pnp" ? "PNP" : "NPN"}
            </Text>
            {/* Long realistic pins bent to 0.1" pitch (-10, 0, 10) */}
            {[-10, 0, 10].map((pinX) => (
              <group key={pinX} position={[pinX, -2, 0]}>
                {/* Thick part of pin near body */}
                <mesh castShadow receiveShadow position={[0, 6, 0]}>
                  <boxGeometry args={[1.5, 8, 1.2]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
                {/* Thin part of pin */}
                <mesh castShadow receiveShadow position={[0, -2, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, 14]} />
                  <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "mosfet":
      case "mosfet_p":
      case "to220": return (<group position={[0, 0, 0]}>
            {/* Metallic Heat Sink Tab */}
            <mesh castShadow receiveShadow position={[0, 12, 0.5]}>
              <boxGeometry args={[40, 6, 4]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Main Plastic Body */}
            <mesh castShadow receiveShadow position={[0, 20, 2]}>
              <boxGeometry args={[40, 32, 12]} />
              <meshPhysicalMaterial color="#111827" roughness={0.8} />
            </mesh>
            {/* Heat Sink Hole */}
            <mesh castShadow receiveShadow position={[0, 32, 0.5]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[4, 4, 4.2]} />
               <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 30, 0.5]}>
              <boxGeometry args={[40, 12, 4]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.95} roughness={0.2} />
            </mesh>
            {/* Laser-etched Text */}
            <Text
              position={[0, 20, 8.1]}
              fontSize={5}
              color="#a1a1aa"
              anchorX="center"
              anchorY="middle"
            >
              {value || (type === "mosfet" ? "IRFZ44N" : "IRF4905")}
            </Text>
            {/* Pins */}
            {[-10, 0, 10].map((pinX) => (
              <group key={pinX} position={[pinX, 0, isPCB ? 0 : 1]}>
                 <mesh castShadow receiveShadow position={[0, 4, 0]}>
                   <boxGeometry args={[2.5, 6, 1.5]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[0, 1, 0]}>
                   <boxGeometry args={[1.5, 6.0, 1.0]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[0, -4, 0]}>
                   <cylinderGeometry args={[0.4, 0.4, 8]} />
                   <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                 </mesh>
              </group>
            ))}
          </group>
        );
      case "digital_multimeter":
        return <DigitalMultimeter3D id={id} isActive={isActive} customProps={customProps} />;
      case "voltmeter":
      case "ammeter":
      case "multimeter":
        return (
          <group position={[0, 8, 10]}>
            <mesh castShadow receiveShadow position={[0, 0, -2]}>
              <boxGeometry args={[36, 18, 16]} />
              <meshPhysicalMaterial
                color={
                  type === "voltmeter"
                    ? "#0284c7"
                    : type === "multimeter"
                      ? "#eab308"
                      : "#ea580c"
                }
                roughness={0.7}
                clearcoat={0.1}
              />
            </mesh>
            {/* Rubber bumpers */}
            <mesh castShadow receiveShadow position={[0, 0, -2]}>
              <boxGeometry args={[38, 20, 18]} />
              <meshPhysicalMaterial color="#1f2937" roughness={0.9} transparent opacity={0.3} />
            </mesh>
            {/* Dynamic Real-time Screen */}
            <group position={[0, 1, 5]}>
              <MeterScreen3D id={id} isActive={isActive} type={type} />
            </group>
            {/* Terminals pointing out backwards to align with z=20 */}
            <mesh castShadow receiveShadow position={[-10, -5, 8]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            <mesh castShadow receiveShadow position={[-10, -5, 10]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.4, 0.4, 4]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>

            <mesh castShadow receiveShadow position={[10, -5, 8]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial
                color="#111"
                roughness={0.6}
              />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -5, 10]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.4, 0.4, 4]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      case "oscilloscope":
        return (
          <group position={[0, 20, 10]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[80, 40, 40]} />
              <meshPhysicalMaterial color="#cbd5e1" roughness={0.8} clearcoat={0.1} />
            </mesh>
            {/* Rubber protective bumpers */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[82, 42, 38]} />
              <meshPhysicalMaterial color="#1e293b" roughness={0.9} transparent opacity={0.3} />
            </mesh>
            {/* Screen bezel */}
            <mesh castShadow receiveShadow position={[-15, 0, -21]}>
              <boxGeometry args={[44, 30, 2]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            {/* Screen */}
            <mesh castShadow receiveShadow position={[-15, 0, -22.1]}>
              <planeGeometry args={[40, 26]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {/* Waveform active */}
            {isActive && (
              <>
                <mesh castShadow receiveShadow position={[-15, 0, -22.2]}>
                  <planeGeometry args={[30, 14]} />
                  <meshPhysicalMaterial
                    color="#22c55e"
                    emissive="#22c55e"
                    emissiveIntensity={2}
                    wireframe
                    transparent
                    opacity={0.1}
                  />
                </mesh>
                <group position={[0, 0, 10]}>
                  <OscilloscopeScreen3D id={id} isActive={isActive} customProps={customProps} />
                </group>
              </>
            )}
            {/* Knobs */}
            <mesh castShadow receiveShadow position={[18, 5, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[30, 5, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[18, -8, -20]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 3]} />
              <meshPhysicalMaterial color="#cbd5e1" />
            </mesh>

            {/* Probes/Pins mapping to pinmap (Z=40 relative to origin -> Z=30 relative to this group since group is at Z=10) */}
            {/* Left Channel (CH1) */}
            <mesh castShadow receiveShadow position={[-20, -10, 25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[-20, -10, 28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial
                color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8}
              />
            </mesh>
            {/* Right Channel (CH2) */}
            <mesh castShadow receiveShadow position={[20, -10, 25]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3, 3, 4]} />
              <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            <mesh castShadow receiveShadow position={[20, -10, 28]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial
                color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8}
              />
            </mesh>
          </group>
        );

      
      case "relay":
        return (
          <group position={[0, 7.5, 0]}>
            {/* Realistic Songle Type Relay Box */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[24, 18, 18]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} clearcoat={0.3} />
            </mesh>
            {/* Relay Etched Text */}
            <Text position={[0, 7.6, 0]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={3} color="#e2e8f0" anchorX="center" anchorY="bottom">SONGLE</Text>
            <Text position={[0, 7.6, 0]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={2} color="#cbd5e1" anchorX="center" anchorY="top">10A 250VAC</Text>
            <Text position={[4, 7.6, -4]} rotation={[-Math.PI/2, 0, -Math.PI/2]} fontSize={1.5} color="#94a3b8" anchorX="right" anchorY="top">SRD-05VDC-SL-C</Text>
            {/* Coil & COM pins */}
            {[-6, 0, 6].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[-6, -8.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
            {/* NO / NC pins */}
            {[-6, 6].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[6, -8.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 5]} />
                <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
              </mesh>
            ))}
          </group>
        );

      case "relay_module":
        return (
          <group position={[0, 0.5, 0]}>
            {/* PCB Base */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[50, 1.5, 32]} />
              <meshPhysicalMaterial color="#1e3a8a" roughness={0.8} />
            </mesh>
            {/* Relay Block */}
            <mesh castShadow receiveShadow position={[-2, 8, 0]}>
              <boxGeometry args={[24, 18, 18]} />
              <meshPhysicalMaterial color="#1d4ed8" roughness={0.4} />
            </mesh>
            {/* Terminal Block (Output) */}
            <mesh castShadow receiveShadow position={[-16, 4, 0]}>
              <boxGeometry args={[8, 7, 22]} />
              <meshPhysicalMaterial color="#22c55e" roughness={0.6} />
            </mesh>
            {/* Pins Header (Input) */}
            <mesh castShadow receiveShadow position={[18, 1.5, 0]}>
              <boxGeometry args={[2, 2, 10]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            {[-3, 0, 3].map((z, i) => (
              <mesh castShadow receiveShadow key={i} position={[18, 2.5, z]}>
                <cylinderGeometry args={[0.3, 0.3, 8]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
            {/* Terminal Block Pins (going down) */}
            {[-7.5, 0, 7.5].map((z, i) => (
              <mesh castShadow receiveShadow key={'term_'+i} position={[-16, -1.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
            {/* Input Header Pins (going down) */}
            {[-3, 0, 3].map((z, i) => (
              <mesh castShadow receiveShadow key={'in_'+i} position={[18, -1.5, z]}>
                <cylinderGeometry args={[0.4, 0.4, 4]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
              </mesh>
            ))}
            {/* Component highlights (LED, transistor) */}
            <mesh castShadow receiveShadow position={[11, 1, -8]}>
              <boxGeometry args={[2, 1, 4]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[14, 1, 8]}>
              <cylinderGeometry args={[1, 1, 2]} />
              <meshPhysicalMaterial color={isActive ? "#ef4444" : "#450a0a"} emissive={isActive ? "#ef4444" : "#000"} />
            </mesh>
          </group>
        );

      
      case "led": {
        const ledColor = customProps?.color?.toLowerCase() === "green" ? "#22c55e" :
                         customProps?.color?.toLowerCase() === "blue" ? "#3b82f6" :
                         customProps?.color?.toLowerCase() === "yellow" ? "#eab308" :
                         customProps?.color?.toLowerCase() === "white" ? "#ffffff" : "#ef4444";
        return (
          <group position={[0, 5, 0]}>
            <mesh castShadow receiveShadow position={[-5, -5, 0]}>
               <cylinderGeometry args={[0.4, 0.4, 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -5, 0]}>
               <cylinderGeometry args={[0.4, 0.4, 12]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
               <cylinderGeometry args={[3.5, 3.5, 6]} />
               <meshPhysicalMaterial color={ledColor} transparent opacity={0.6} emissive={ledColor} emissiveIntensity={isActive ? 2 : 0} roughness={0.1} clearcoat={1.0} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4, 0]}>
               <sphereGeometry args={[3.5, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
               <meshPhysicalMaterial color={ledColor} transparent opacity={0.6} emissive={ledColor} emissiveIntensity={isActive ? 2 : 0} roughness={0.1} clearcoat={1.0} />
            </mesh>
            {/* Internal Anode / Cathode posts */}
            <mesh position={[1, 2, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 4]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh position={[-1, 1.5, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 3]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh position={[-1, 3, 0]}>
               <boxGeometry args={[1.5, 1.2, 0.6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      }
      case "lamp": return (<group position={[0, isPCB ? 12 : 10, 0]} scale={isPCB ? [1.8, 1.8, 1.8] : [1, 1, 1]}>
            <mesh castShadow receiveShadow position={[0, -5, 0]}>
              <cylinderGeometry args={[3, 3, 5]} />
              <meshPhysicalMaterial color="gray" metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 2, 0]}>
               <sphereGeometry args={[6, 16, 16]} />
               <meshPhysicalMaterial color="#fbbf24" transparent opacity={0.6} emissive="#fbbf24" emissiveIntensity={isActive ? 5 : 0} />
            </mesh>
            <mesh castShadow receiveShadow position={[-5, -9, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 5]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -9, 0]}>
               <cylinderGeometry args={[0.3, 0.3, 5]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      case "switch":
        return (
          <group position={[0, 3, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[24, 6, 24]} />
               <meshPhysicalMaterial color="#1a1a1a" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, isClosed ? 2 : 4, 0]}>
               <cylinderGeometry args={[6, 6, 4]} />
               <meshPhysicalMaterial color="#ef4444" />
            </mesh>
            {/* Pins for typical 6x6 tactile button (often spaced ~5mm x ~6.5mm). We'll assume typical breadboard insertion points. */}
            <mesh castShadow receiveShadow position={[-10, -3, -7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -3, -7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[-10, -3, 7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -3, 7.5]}>
               <cylinderGeometry args={[0.4, 0.4, 6]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
            </mesh>
          </group>
        );
      case "buzzer":
        return (
          <group position={[0, 4, 0]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <cylinderGeometry args={[9, 9, 10]} />
              <meshPhysicalMaterial color="#111" />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4.1, 0]}>
              <cylinderGeometry args={[1, 1, 0.1]} />
              <meshPhysicalMaterial color="#000" />
            </mesh>
            <mesh castShadow receiveShadow position={[-5, -6, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh castShadow receiveShadow position={[5, -6, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 6]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      case "motor": return (<group position={[0, 8, 10]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[8, 8, 20]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.4} />
            </mesh>
            <mesh castShadow receiveShadow position={[12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[1, 1, 6]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
            {/* Terminals descending to pads at z = -11, x = -4, 4 */}
            <mesh castShadow receiveShadow position={[-4, 0, -8]}>
              <boxGeometry args={[2, 2, 6]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, 0, -8]}>
              <boxGeometry args={[2, 2, 6]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.8} />
            </mesh>
            {/* Pins descending to board */}
            <mesh castShadow receiveShadow position={[-4, -4, -11]}>
              <cylinderGeometry args={[0.5, 0.5, 8]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[4, -4, -11]}>
              <cylinderGeometry args={[0.5, 0.5, 8]} />
              <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
            </mesh>
          </group>
        );
            case "battery_9v":
            case "battery": {
             const voltageLabel = value ? (value.toUpperCase().includes("V") ? value.toUpperCase() : `${value}V`) : "9V";
             return (<group position={[0, 12, 0]}>
             {/* Main Battery Body - Metal Shell with rounded edges approximated by a cylinder inside a box, or just nice materials */}
             <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[26, 26, 16]} />
               <meshPhysicalMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
             </mesh>
             {/* Yellow stripe / Label area */}
             <mesh castShadow receiveShadow position={[0, -4, 0]}>
               <boxGeometry args={[26.2, 8, 16.2]} />
               <meshPhysicalMaterial color="#eab308" roughness={0.8} />
             </mesh>
             <Text position={[0, -4, 8.2]} fontSize={5} color="#111827">{voltageLabel} HEAVY DUTY</Text>
             <Text position={[0, 5, 8.1]} fontSize={8} color="#eab308">{voltageLabel}</Text>
             {isPCB ? (
               <>
                 {/* PCB Battery Clip Terminals going directly down to pads at x = -10, 10, z = 0 */}
                 <mesh castShadow receiveShadow position={[-10, -13, 0]}>
                   <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                   <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[10, -13, 0]}>
                   <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                   <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
                 </mesh>
                 {/* Battery Clips */}
                 <mesh castShadow receiveShadow position={[-10, -11, 0]}>
                   <boxGeometry args={[3, 2, 4]} />
                   <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[10, -11, 0]}>
                   <boxGeometry args={[3, 2, 4]} />
                   <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
                 </mesh>
               </>
             ) : (
               <>
                 {/* Terminals extending to z=-40 */}
                 {/* Positive (Smaller Hex/Circular Snap) */}
                 <mesh castShadow receiveShadow position={[-6, 0, -10]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[2.5, 2.5, 4, 16]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[-6, 0, -20]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 40]} />
                    <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
                 </mesh>
                 <Text position={[-6, 14, -8]} rotation={[0, 0, 0]} fontSize={5} color="#ef4444">+</Text>
                 {/* Negative (Larger Crown Snap) */}
                 <mesh castShadow receiveShadow position={[6, 0, -10]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[3.5, 3.5, 4, 6]} />
                    <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[6, 0, -20]} rotation={[Math.PI/2, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 40]} />
                    <meshPhysicalMaterial color="#111827" roughness={0.5} />
                 </mesh>
                 <Text position={[6, 14, -8]} rotation={[0, 0, 0]} fontSize={5} color="#cbd5e1">-</Text>
                 
                 {/* Terminals bridging to -10/10 layout to match pinmap */}
                 <mesh castShadow receiveShadow position={[-8, 0, -40]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.5, 0.5, 4]} />
                    <meshPhysicalMaterial color="#ef4444" roughness={0.5} />
                 </mesh>
                 <mesh castShadow receiveShadow position={[8, 0, -40]} rotation={[0, 0, Math.PI/2]}>
                    <cylinderGeometry args={[0.5, 0.5, 4]} />
                    <meshPhysicalMaterial color="#111827" roughness={0.5} />
                 </mesh>
               </>
             )}

          </group>
        );
        }
      case "powersupply": {
        if (isPCB) return <ScrewTerminalBlock3D scale={[1.8, 1.8, 1.8]} />;
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
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>

            {/* GND Terminal */}
            <mesh castShadow receiveShadow position={[10, -5, 14]}>
              <cylinderGeometry args={[2, 2, 4]} />
              <meshPhysicalMaterial color="#111" roughness={0.6} />
            </mesh>
            <mesh castShadow receiveShadow position={[10, -8, 20]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[0.5, 0.5, 10]} />
               <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.2} clearcoat={0.5} />
            </mesh>
          </group>
        );
      }
      case "ac_source": {
        if (isPCB) return <ScrewTerminalBlock3D scale={[1.8, 1.8, 1.8]} />;
        const acCurrent = reading || (parseFloat((customProps?.currentLimit ?? 2).toString())).toFixed(2) + " A";
        return (
          <group position={[0, 10, 15]}>
            {/* Main Chassis */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
               <boxGeometry args={[26, 16, 24]} />
               <meshPhysicalMaterial color="#475569" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Front Panel */}
            <mesh castShadow receiveShadow position={[0, 0, 12.1]}>
               <planeGeometry args={[24, 14]} />
               <meshPhysicalMaterial color="#0f172a" />
            </mesh>
            
            {/* Sine Wave Graphic */}
            <Text position={[0, 4, 12.2]} fontSize={2} color="#f59e0b" anchorX="center">
               ~ AC SOURCE ~
            </Text>

            {/* Display Screen */}
            <mesh castShadow receiveShadow position={[0, 0, 12.2]}>
               <boxGeometry args={[16, 4, 0.2]} />
               <meshPhysicalMaterial color="#000000" />
            </mesh>
            {/* Real-time Display Value */}
            <Text position={[-3.5, 0, 12.4]} fontSize={2.4} color="#fbbf24" anchorX="center" fontStyle="italic">
               {value || "220"} V
            </Text>
            <Text position={[3.5, 0, 12.4]} fontSize={2.4} color="#ef4444" anchorX="center" fontStyle="italic">
               {acCurrent}
            </Text>

            {/* Terminals */}
            <mesh castShadow receiveShadow position={[-6, -5, 12.5]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[1.5, 1.5, 2]} />
               <meshPhysicalMaterial color="#ef4444" /> {/* Live */}
            </mesh>
            <mesh castShadow receiveShadow position={[6, -5, 12.5]} rotation={[Math.PI/2, 0, 0]}>
               <cylinderGeometry args={[1.5, 1.5, 2]} />
               <meshPhysicalMaterial color="#3b82f6" /> {/* Neutral */}
            </mesh>
          </group>
        );
      }
      case "potentiometer": return (<group position={[0, 5, 0]}>
             {/* Metal base shell */}
             <mesh castShadow receiveShadow position={[0, -2, 0]}>
               <cylinderGeometry args={[12, 12, 8, 32]} />
               <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.4} />
             </mesh>
             {/* Base bottom plastic */}
             <mesh castShadow receiveShadow position={[0, -6.5, 0]}>
               <cylinderGeometry args={[11.8, 11.8, 1, 32]} />
               <meshPhysicalMaterial color="#0f172a" />
             </mesh>
             {/* Shaft Base/Thread */}
             <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
               <cylinderGeometry args={[4.5, 4.5, 3, 32]} />
               <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.3} />
             </mesh>
             {/* Rotating Shaft with flat cut */}
             <mesh castShadow receiveShadow position={[0, 9, 0]}>
               <cylinderGeometry args={[3.5, 3.5, 8, 32, 1, false, 0, Math.PI * 1.8]} />
               <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.5} />
             </mesh>
             <mesh castShadow receiveShadow position={[0, 9, 0]}>
                <boxGeometry args={[3, 8, 7]} />
                <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.5} />
             </mesh>
             {/* Pins */}
             {[-10, 0, 10].map(x => (
               <mesh castShadow receiveShadow key={x} position={[x, -8, 12]}>
                 <boxGeometry args={[1, 4, 0.5]} />
                 <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
               </mesh>
             ))}
             {/* Lead extensions from pin to body */}
             {[-10, 0, 10].map(x => (
               <mesh castShadow receiveShadow key={'ext'+x} position={[x/2, -6, 6]}>
                 <cylinderGeometry args={[0.3, 0.3, 12]} />
                 <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
               </mesh>
             ))}
          </group>
        );
      case "ground":
        return null; // Ground is usually implicit or just a trace/symbol
      case "arduino_uno":
        return <ArduinoUno3D isPCB={isPCB} />;
      
      case "esp32_cam":
        return <ESP32_CAM3D isPCB={isPCB} />;
      case "esp32":
        return <ESP32_3D isPCB={isPCB} />;
      case "esp32s3":
        return <ESP32_3D isPCB={isPCB} isS3={true} />;
      case "raspberry_pi":
        return <RaspberryPi3D isPCB={isPCB} />;
      case "ntc":
      case "thermistor":
        return <NTC3D isPCB={isPCB} />;
      case "ldr":
      case "ldr_smd":
      case "photoresistor":
        return <LDR3D />;
      case "cr2032":
      case "coin_cell":
        return <CR20323D />;
      case "oled":
        return <OLED3D isActive={isActive} />;
      case "seven_segment":
        return <SevenSegment3D isActive={isActive} value={value} />;

      case "a4988":
        return (
          <group position={[0, 0, 0]}>
            {/* PCB */}
            <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
              <boxGeometry args={[15, 1.5, 20]} />
              <meshPhysicalMaterial color="#dc2626" roughness={0.8} />
            </mesh>
            {/* Main IC */}
            <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
              <boxGeometry args={[6, 1, 6]} />
              <meshPhysicalMaterial color="#111827" />
            </mesh>
            {/* Heat sink */}
            <mesh castShadow receiveShadow position={[0, 3.5, 0]}>
              <boxGeometry args={[5, 1, 5]} />
              <meshPhysicalMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 4.0, 0]}>
              <boxGeometry args={[5, 0.5, 1]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Trimpot */}
            <mesh castShadow receiveShadow position={[0, 2.5, -6]}>
              <cylinderGeometry args={[2, 2, 1, 16]} />
              <meshPhysicalMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
            {/* Pins */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const z = -7.5 + i * 2;
              return (
                <group key={i}>
                  <mesh castShadow receiveShadow position={[-6.5, -1, z]}>
                    <cylinderGeometry args={[0.4, 0.4, 6]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                  </mesh>
                  <mesh castShadow receiveShadow position={[6.5, -1, z]}>
                    <cylinderGeometry args={[0.4, 0.4, 6]} />
                    <meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );


      case "mounting_hole":
        return (
          <group position={[0, isPCB ? 0 : 2, 0]}>
            {isPCB ? (
              <group>
                {/* Plated hole ring */}
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.5, 3.5, 32]} />
                  <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.2} side={THREE.DoubleSide} />
                </mesh>
                {/* Screw head (silver/metal) inside */}
                <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[2.8, 2.8, 0.8, 32]} />
                  <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.4} clearcoat={0.5} />
                </mesh>
                {/* Screw Phillips cross */}
                <mesh position={[0, 0.81, 0]}>
                  <boxGeometry args={[3.6, 0.1, 0.6]} />
                  <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.81, 0]} rotation={[0, Math.PI / 2, 0]}>
                  <boxGeometry args={[3.6, 0.1, 0.6]} />
                  <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.5} />
                </mesh>
              </group>
            ) : (
              <group position={[0, 0, 0]}>
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[2.8, 2.8, 4, 32]} />
                  <meshPhysicalMaterial color="#cbd5e1" metalness={0.9} roughness={0.4} />
                </mesh>
              </group>
            )}
          </group>
        );

      default:
        const bw = bounds?.w || 10;
        const bd = bounds?.d || 10;
        return (
          <group position={[0, 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[bw - 4, 4, bd - 4]} />
              <meshPhysicalMaterial
                color={isActive ? "#3b82f6" : "#1e293b"}
                emissive={isActive ? "#3b82f6" : "#000000"}
                emissiveIntensity={isActive ? 1 : 0}
                roughness={0.8}
              />
            </mesh>
            <Text
              position={[0, 2.1, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={Math.min(bw, bd) * 0.15}
              color="#e5e5e5"
              anchorX="center"
              anchorY="middle"
            >
              {value || type}
            </Text>
            {isActive && !isBroken && (
              <pointLight color="#3b82f6" intensity={1} distance={20} />
            )}
          </group>
        );

        
    }
  };

  return <group ref={groupRef}>{getMeshes()}</group>;
}
