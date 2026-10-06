import React, { useMemo, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { HighQualityMesh } from "./Meshes3D";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, RoundedBox,

  ContactShadows,
  Text,
  Grid,
  Html,
 } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO } from "@react-three/postprocessing";
import { useEditor } from "../store";
import { Point } from "../types";
import { simulateDC } from "../lib/simulator";
import { pinMap, getPcbComponentPins } from "../lib/pinmap";
import { getResistorColors } from "./Symbols";
import { calculateNets } from "./CanvasEditor";
import { Line as Line3D } from "@react-three/drei";
import { BuzzerAudio } from "../lib/BuzzerAudio";

function CurvedWire({ pts, isAlive, baseColor, cyb }: { pts: Point[], isAlive: boolean, baseColor: string, cyb: number }) {
  if (!pts || pts.length < 2) return null;

  const curvePts = useMemo(() => {
    const cp = [];
    const raise = 4; // Height of the wire curve
    for (let i = 0; i < pts.length; i++) {
        const x = Number(pts[i].x);
        const z = Number(pts[i].y);
        let y = cyb;
        if (i > 0 && i < pts.length - 1) {
            y += raise * 2;
        } else if (pts.length === 2 && i === 0) {
            cp.push(new THREE.Vector3(x, y + 2.5, z));
            cp.push(new THREE.Vector3(x, y + raise + 1, z));
            continue;
        } else if (pts.length === 2 && i === 1) {
            cp.push(new THREE.Vector3(x, y + raise + 1, z));
            cp.push(new THREE.Vector3(x, y + 2.5, z));
            continue;
        }
        cp.push(new THREE.Vector3(x, y, z));
    }
    return cp;
  }, [pts, cyb]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(curvePts, false, 'catmullrom', 0.5), [curvePts]);
  const mainWireProps = useMemo(() => ({
    color: isAlive ? "#ffeb3b" : baseColor,
    emissive: isAlive ? "#ffeb3b" : "#000000",
    emissiveIntensity: isAlive ? 2 : 0,
    roughness: 0.4,
    metalness: 0.3,
    clearcoat: 0.8,
  }), [isAlive, baseColor]);

  const shrinkTubeProps = { color: "#000000", roughness: 0.9 };
  const plugProps = { color: "#1e293b", roughness: 0.7 };
  const pinProps = { color: "#94a3b8", metalness: 0.9, roughness: 0.3 };
  const sPts = pts;

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 32, 0.8, 8, false]} />
        <meshStandardMaterial {...mainWireProps} />
      </mesh>
      
      {/* Start Connection */}
      <group position={[Number(sPts[0].x), cyb + 2, Number(sPts[0].y)]}>
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.9, 0.9, 2, 12]} /><meshStandardMaterial {...shrinkTubeProps} /></mesh>
        <mesh position={[0, -2.5, 0]} castShadow><boxGeometry args={[2.5, 5.0, 2.5]} /><meshStandardMaterial {...plugProps} /></mesh>
        <mesh position={[0, -4.5, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 1, 8]} /><meshStandardMaterial {...pinProps} /></mesh>
        <mesh position={[0, -6, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 3, 8]} /><meshStandardMaterial {...pinProps} /></mesh>
      </group>

      {/* End Connection */}
      <group position={[Number(sPts[sPts.length-1].x), cyb + 2, Number(sPts[sPts.length-1].y)]}>
        <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.9, 0.9, 2, 12]} /><meshStandardMaterial {...shrinkTubeProps} /></mesh>
        <mesh position={[0, -2.5, 0]} castShadow><boxGeometry args={[2.5, 5.0, 2.5]} /><meshStandardMaterial {...plugProps} /></mesh>
        <mesh position={[0, -4.5, 0]} castShadow><cylinderGeometry args={[0.5, 0.5, 1, 8]} /><meshStandardMaterial {...pinProps} /></mesh>
        <mesh position={[0, -6, 0]} castShadow><cylinderGeometry args={[0.3, 0.3, 3, 8]} /><meshStandardMaterial {...pinProps} /></mesh>
      </group>
    </group>
  );
}

function getCapacitorCode(value: string | undefined): string {
  if (!value) return "104";
  const match = value.match(/^([\d.]+)\s*(p|n|u|m)?(?:[fF])?$/);
  if (!match) return value;

  let val = parseFloat(match[1]);
  const multStr = match[2];

  let multiplier = 1; // pf
  if (multStr === "n") multiplier = 1000;
  if (multStr === "u") multiplier = 1000000;
  if (multStr === "m") multiplier = 1000000000;

  let pf = val * multiplier;
  if (pf < 100) return Math.floor(pf).toString(); // e.g., 22 -> 22

  // Need to represent as two digits and a multiplier
  let exp = 0;
  while (pf >= 100) {
    pf /= 10;
    exp++;
  }

  const digit12 = Math.floor(pf);
  return `${digit12}${exp}`;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Canvas Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070709] text-gray-400">
          <p className="mb-4">Ocorreu um erro no renderizador 3D.</p>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
            onClick={() => this.setState({ hasError: false })}
          >
            Recarregar 3D
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


function Logo3D({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const line1Len = Math.sqrt(25 * 25 + 45 * 45);
  const line1Ang = -Math.atan2(45, 25);
  
  const line2Len = Math.sqrt(37.5 * 37.5 + 22.5 * 22.5);
  const line2Ang = -Math.atan2(22.5, 37.5);
  
  const silkMat = <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.9} emissive="#ffffff" emissiveIntensity={0.2} />;
  const silkThickness = 2; // Making it very thick to ensure it shows up

  return (
    <group position={position} scale={scale * 0.35}>
      {/* SVG Icon recreated in 3D (White, no background) */}
      <group position={[0, silkThickness/2, 0]}>
          <mesh position={[0, 0, -25]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[25, 0, 20]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-25, 0, 20]}>
             <cylinderGeometry args={[14, 14, silkThickness, 32]} />
             {silkMat}
          </mesh>
          <mesh position={[-12.5, 0, -2.5]}>
             <cylinderGeometry args={[8, 8, silkThickness, 24]} />
             {silkMat}
          </mesh>
          <mesh position={[12.5, 0, -2.5]} rotation={[0, line1Ang, 0]}>
             <boxGeometry args={[line1Len, silkThickness, 8]} />
             {silkMat}
          </mesh>
          <mesh position={[6.25, 0, 8.75]} rotation={[0, line2Ang, 0]}>
             <boxGeometry args={[line2Len, silkThickness, 8]} />
             {silkMat}
          </mesh>
      </group>
      
      {/* Brand Name exactly as requested */}
      <Text 
         position={[0, silkThickness, 50]} 
         rotation={[-Math.PI/2, 0, 0]} 
         fontSize={24} 
         color="#ffffff" 
         fontWeight="bold" 
         letterSpacing={0.1}
         anchorX="center"
         anchorY="middle"
      >
        ALLVATRONICS
      </Text>
    </group>
  );
}

export function CanvasViewer3D() {
  const { elements, pcbElements, isSimulating, mode, showPcbComponents, updateElement } = useEditor();

  const [simTime, setSimTime] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(1.0);

  useEffect(() => {
    let frameId: number;
    let startTime = performance.now() - simTime * 1000;
    const loop = (time: number) => {
      setSimTime((time - startTime) / 1000);
      frameId = requestAnimationFrame(loop);
    };
    if (isSimulating) {
      startTime = performance.now() - simTime * 1000;
      frameId = requestAnimationFrame(loop);
    } else {
      setSimTime(0);
    }
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating]);

  
  const ratsnestLines = useMemo(() => {
    if (pcbElements.length === 0 || elements.length === 0) return [];
    const { nets, compPins } = calculateNets(elements);
    const pcbComps = pcbElements.filter((el) => el.type === "pcb_component");
    
    const lines = [];
    
    nets.forEach((net) => {
      const pcbPoints = [];
      pcbComps.forEach((pcbComp) => {
        if (!pcbComp.name) return;
        const schPins = compPins.get(pcbComp.name);
        if (schPins) {
          schPins.forEach((pinId, idx) => {
            if (net.has(pinId)) {
              const localPins = getPcbComponentPins(pcbComp);
              if (localPins && localPins[idx]) {
                const rad = (pcbComp.rotation * Math.PI) / 180;
                const pbp = localPins[idx];
                pcbPoints.push({
                  x: pcbComp.x + pbp.x * Math.cos(rad) - pbp.y * Math.sin(rad),
                  y: pcbComp.y + pbp.x * Math.sin(rad) + pbp.y * Math.cos(rad),
                });
              } else {
                pcbPoints.push({ x: pcbComp.x, y: pcbComp.y });
              }
            }
          });
        }
      });
      if (pcbPoints.length > 1) {
        for (let j = 0; j < pcbPoints.length - 1; j++) {
           lines.push({ x1: pcbPoints[j].x, y1: pcbPoints[j].y, x2: pcbPoints[j+1].x, y2: pcbPoints[j+1].y });
        }
      }
    });

    const traces = pcbElements.filter(el => el.type === "trace");
    const isRouted = (x1, y1, x2, y2) => {
       for(const t of traces) {
         if(!t.points || t.points.length < 2) continue;
         const ptFirst = t.points[0];
         const ptLast = t.points[t.points.length - 1];
         const d1 = Math.hypot(ptFirst.x - x1, ptFirst.y - y1) + Math.hypot(ptLast.x - x2, ptLast.y - y2);
         const d2 = Math.hypot(ptFirst.x - x2, ptFirst.y - y2) + Math.hypot(ptLast.x - x1, ptLast.y - y1);
         if (d1 < 10 || d2 < 10) return true;
       }
       return false;
    };
    
    return lines.filter(l => !isRouted(l.x1, l.y1, l.x2, l.y2));
  }, [elements, pcbElements]);

  const circuitState = useMemo(() => {
    if (!isSimulating)
      return {
        active: new Set<string>(),
        hasShortCircuit: false,
        readings: {} as Record<string, string>,
        pointVoltages: {} as Record<string, number>,
      };
    return simulateDC(elements, pinMap, simTime);
  }, [elements, isSimulating, simTime]);

  const boardEl = useMemo(() => pcbElements.find((el) => el.type === "board") as any, [pcbElements]);
  const boardShape = useMemo(() => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    pcbElements.forEach((el) => {
      if (
        el.type === "pcb_component" ||
        el.type === "trace" ||
        el.type === "board"
      ) {
        if (Array.isArray((el as any).points)) {
          (el as any).points.forEach((p: Point) => {
            minX = Math.min(minX, Number(p.x) || 0);
            minY = Math.min(minY, Number(p.y) || 0);
            maxX = Math.max(maxX, Number(p.x) || 0);
            maxY = Math.max(maxY, Number(p.y) || 0);
          });
        } else if ((el as any).x !== undefined) {
          minX = Math.min(minX, Number((el as any).x) || 0);
          minY = Math.min(minY, Number((el as any).y) || 0);
          maxX = Math.max(maxX, Number((el as any).x) || 0);
          maxY = Math.max(maxY, Number((el as any).y) || 0);
        }
      }
    });

    if (boardEl) {
      return {
        width: Math.max(Number(boardEl.width) || 200, 200),
        height: Math.max(Number(boardEl.height) || 200, 200),
        center: {
          x: (Number(boardEl.x) || 0) + (Number(boardEl.width) || 200) / 2,
          y: (Number(boardEl.y) || 0) + (Number(boardEl.height) || 200) / 2,
        },
      };
    }

    const shapeType = boardEl?.boardShape || "rect";
    
    if (minX === Infinity)
      return { width: 500, height: 500, center: { x: 0, y: 0 } };

    const rawW = Math.max(200, maxX - minX + 100);
    const rawH = Math.max(200, maxY - minY + 100);

    if (shapeType === "circle") {
      const diameter = Math.max(rawW, rawH);
      return {
        width: diameter,
        height: diameter,
        center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
      };
    } else if (shapeType === "triangle") {
      return {
        width: rawW * 1.5,
        height: rawH * 1.5,
        center: { x: (minX + maxX) / 2, y: (minY + Math.max(maxY, minY + rawH)) / 2 }, // approximate center
      };
    }

    return {
      width: rawW,
      height: rawH,
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    };
  }, [pcbElements]);

  const boardGeom = useMemo(() => {
    if (mode !== "pcb") return null;
    const shape = new THREE.Shape();
    const w = boardShape.width;
    const h = boardShape.height;
    const r = 10; // corner radius
    const shapeType = boardEl?.boardShape || "rect";
    
    if (shapeType === "circle") {
      shape.moveTo(w / 2, 0);
      shape.absellipse(0, 0, w / 2, h / 2, 0, Math.PI * 2, false, 0);
    } else if (shapeType === "triangle") {
      shape.moveTo(0, -h / 2);
      shape.lineTo(w / 2, h / 2);
      shape.lineTo(-w / 2, h / 2);
      shape.lineTo(0, -h / 2);
    } else {
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    }

    // Default mounting holes for the board corners/edges
    if (shapeType === "rect") {
      const hpts = [
        [-w/2 + 10, -h/2 + 10], [w/2 - 10, -h/2 + 10],
        [-w/2 + 10, h/2 - 10], [w/2 - 10, h/2 - 10]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    } else if (shapeType === "circle") {
      const rx = w/2 - 15;
      const ry = h/2 - 15;
      const hpts = [
        [rx * Math.cos(Math.PI/4), ry * Math.sin(Math.PI/4)],
        [rx * Math.cos(3*Math.PI/4), ry * Math.sin(3*Math.PI/4)],
        [rx * Math.cos(5*Math.PI/4), ry * Math.sin(5*Math.PI/4)],
        [rx * Math.cos(7*Math.PI/4), ry * Math.sin(7*Math.PI/4)]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    } else if (shapeType === "triangle") {
      const hpts = [
        [0, -h/2 + 20], [-w/2 + 20, h/2 - 10], [w/2 - 20, h/2 - 10]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    }


    // Add holes for pads, vias, and mounting holes
    pcbElements.forEach((el) => {
      if (el.type === "pcb_component") {
        const type = (el as any).componentType;
        if (type === "pad" || type === "via" || type === "mounting_hole") {
          const cx = (Number(el.x) || 0) - boardShape.center.x;
          const cy = (Number(el.y) || 0) - boardShape.center.y;
          // Note: in PCB space, y is actually z in 3D (shape is x, z plane)
          const holePath = new THREE.Path();
          const radius = type === "via" ? 1.5 : (type === "pad" ? 1.5 : 5.8);
          // Canvas uses Y down, 3D shape uses standard coordinates
          // Since mapping is X -> X and Y -> Z, we just draw the circle at cx, cy
          holePath.absarc(cx, cy, radius, 0, Math.PI * 2, false);
          shape.holes.push(holePath);
        }
      }
    });

    const extrudeSettings = {
      depth: 1.6,
      bevelEnabled: false
    };
    
    try {
      // Extrude geometry defaults to X-Y plane, we will need to rotate it to X-Z plane
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    } catch (err) {
      console.warn("ExtrudeGeometry failed:", err);
      return null;
    }
  }, [mode, boardShape, pcbElements]);

  const schematicShape = useMemo(() => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    elements.forEach((el) => {
      if (el.type === "component") {
        minX = Math.min(minX, (Number(el.x) || 0) - 50);
        minY = Math.min(minY, (Number(el.y) || 0) - 50);
        maxX = Math.max(maxX, (Number(el.x) || 0) + 50);
        maxY = Math.max(maxY, (Number(el.y) || 0) + 50);
      } else if (el.type === "wire" && Array.isArray((el as any).points)) {
        (el as any).points.forEach((p: Point) => {
          minX = Math.min(minX, Number(p.x) || 0);
          minY = Math.min(minY, Number(p.y) || 0);
          maxX = Math.max(maxX, Number(p.x) || 0);
          maxY = Math.max(maxY, Number(p.y) || 0);
        });
      }
    });
    if (minX === Infinity)
      return { width: 1000, height: 1000, center: { x: 0, y: 0 } };
    return {
      width: Math.max(1000, maxX - minX + 400),
      height: Math.max(1000, maxY - minY + 400),
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
    };
  }, [elements]);

  return (
    <div className="w-full h-full bg-[#16161a] m-0 p-0 overflow-hidden outline-none relative">
      {/* Audio Engine */}
      {elements
        .filter((el) => el.type === "component" && (el as any).componentType === "buzzer")
        .map((buzzer) => (
          <BuzzerAudio key={buzzer.id} isAlive={isSimulating && circuitState.active.has(buzzer.id)} />
        ))}
        
      {/* Overlay controls could go here */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none text-white/50 text-xs font-mono uppercase tracking-wider font-bold shadow-sm">
        3D Visualizer Engine
      </div>
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-[#16161a]/80 backdrop-blur-md p-3 rounded-lg border border-[#2d2d33] shadow-lg pointer-events-auto">
        <label className="text-white/70 text-[10px] font-mono uppercase tracking-wider">Luz de Estúdio</label>
        <input 
          type="range" 
          min="0.2" 
          max="3.0" 
          step="0.1" 
          value={lightIntensity}
          onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          className="w-32 accent-amber-500 cursor-pointer"
        />
      </div>
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 250, 400], fov: 35, near: 1, far: 50000 }}
          shadows
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
          <color attach="background" args={["#0b0d10"]} />

          {/* Fallback Lighting (No Environment to avoid fetch errors) */}
          <hemisphereLight intensity={(mode === "schematic" ? 0.2 : 0.6) * lightIntensity} groundColor="#000000" />

          <ambientLight
            intensity={(mode === "schematic" ? 0.1 : 0.4) * lightIntensity}
            color="#ffffff"
          />
          <directionalLight
            position={[200, 400, 200]}
            intensity={(mode === "schematic" ? 0.4 : 1.0) * lightIntensity}
            color="#ffffff"
            castShadow
            shadow-mapSize={2048}
            shadow-bias={-0.0005}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-3000, 3000, 3000, -3000]}
              near={-1000}
              far={10000}
            />
          </directionalLight>
          <directionalLight
            position={[-200, 300, -200]}
            intensity={0.5}
            color="#e0f2fe"
          />
          <pointLight position={[0, -200, 0]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[0, -300, 0]} intensity={0.8} color="#e0f2fe" />

          {isSimulating && circuitState.hasShortCircuit && (
            <pointLight color="red" intensity={8} position={[0, 100, 0]} />
          )}

          <Grid
            position={[schematicShape.center.x, -1.98, schematicShape.center.y]}
            args={[schematicShape.width * 2, schematicShape.height * 2]}
            cellSize={10}
            cellThickness={0.8}
            cellColor="#1a1a24"
            sectionSize={50}
            sectionThickness={1.2}
            sectionColor="#2d2d3d"
            fadeDistance={900}
            fadeStrength={1.5}
            visible={mode === "schematic"}
          />

          {/* --- SCHEMATIC VIEW AREA --- */}
          {mode === "schematic" && (
            <group
              position={[-schematicShape.center.x, 0, -schematicShape.center.y]}
            >
              <mesh
                receiveShadow
                position={[
                  schematicShape.center.x,
                  -2.1,
                  schematicShape.center.y,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry
                  args={[schematicShape.width, schematicShape.height]}
                />
                <meshStandardMaterial
                  color="#0f0f13"
                  roughness={0.9}
                  metalness={0.1}
                  depthWrite={true}
                  depthTest={true}
                />
              </mesh>

              {elements.map((el) => {
                if (el.type === "wire") {
                  const pts = el.points as Point[];
                  if (!pts || pts.length === 0) return null;
                  return (
                    <group key={el.id} position={[0, 0, 0]}>
                      {(() => {
                        const midX = (Number(pts[0].x) + Number(pts[pts.length - 1].x)) / 2;
                        const midZ = (Number(pts[0].y) + Number(pts[pts.length - 1].y)) / 2;
                        let cyb = 0;
                        const board = elements.find((b) => {
                          if (b.type !== "component") return false;
                          const bt = (b as any).componentType;
                          if (
                            ![
                              "protoboard",
                              "arduino_uno",
                              "raspberry_pi",
                              "esp32",
                              "esp32_cam",
                              "esp32s3",
                            ].includes(bt)
                          )
                            return false;
                          const dx2 = midX - (Number((b as any).x) || 0);
                          const dz2 = midZ - (Number((b as any).y) || 0);
                          return (
                            (bt === "protoboard" &&
                              dx2 > -180 && dx2 < 180 && dz2 > -100 && dz2 < 100) ||
                            (bt === "arduino_uno" &&
                              dx2 > -100 && dx2 < 250 && dz2 > -100 && dz2 < 250) ||
                            (bt === "raspberry_pi" &&
                              dx2 > -150 && dx2 < 300 && dz2 > -100 && dz2 < 250) ||
                            ((bt === "esp32" || bt === "esp32_cam" || bt === "esp32s3") &&
                              dx2 > -100 && dx2 < 150 && dz2 > -100 && dz2 < 250)
                          );
                        });
                        if (board) {
                          const bt = (board as any).componentType;
                          if (bt === 'protoboard') cyb = 0.2;
                          else if (bt === 'arduino_uno') cyb = 4 * 1.25;
                          else if (bt === 'raspberry_pi') cyb = 4 * 2.27;
                          else if (bt === 'esp32') cyb = 4 * 2.38;
                          else if (bt === 'esp32_cam') cyb = 4 * 2.08;
                          else if (bt === 'esp32s3') cyb = 4 * 1;
                          else if (bt === 'oled') cyb = 4 * 1.5;
                          else cyb = 4;
                        }
                        const isAlive = isSimulating && circuitState.active.has(el.id);
                        const baseColor = (el as any).color || "#15803d";
                        
                        return <CurvedWire pts={pts} isAlive={isAlive} baseColor={baseColor} cyb={cyb} />;
                      })()}
                    </group>
                  );
                }
                if (el.type === "component") {
                  const cx = Number((el as any).x) || 0;
                  const cz = Number((el as any).y) || 0;
                  let cy = 0;
                  const cType = (el as any).componentType;
                  const isBg = [
                    "protoboard",
                    "arduino_uno",
                    "raspberry_pi",
                    "esp32",
                    "esp32_cam",
                    "esp32s3",
                  ].includes(cType);
                  if (!isBg) {
                    const board = elements.find((b) => {
                      if (b.type !== "component") return false;
                      const bt = (b as any).componentType;
                      if (
                        ![
                          "protoboard",
                          "arduino_uno",
                          "raspberry_pi",
                          "esp32",
                          "esp32_cam",
                          "esp32s3",
                        ].includes(bt)
                      )
                        return false;
                      const dx = cx - (Number((b as any).x) || 0);
                      const dz = cz - (Number((b as any).y) || 0);
                      return (
                        (bt === "protoboard" &&
                          dx > -180 && dx < 180 && dz > -100 && dz < 100) ||
                        (bt === "arduino_uno" &&
                          dx > -100 && dx < 250 && dz > -100 && dz < 250) ||
                        (bt === "raspberry_pi" &&
                          dx > -150 && dx < 300 && dz > -100 && dz < 250) ||
                        ((bt === "esp32" || bt === "esp32_cam" || bt === "esp32s3") &&
                          dx > -100 && dx < 150 && dz > -100 && dz < 250)
                      );
                    });
                    if (board) {
                      const bt = (board as any).componentType;
                      
                      if (bt === 'protoboard') cy = 0.2;
                      else if (bt === 'arduino_uno') cy = 4 * 1.25;
                      else if (bt === 'raspberry_pi') cy = 4 * 2.27;
                      else if (bt === 'esp32') cy = 4 * 2.38;
                      else if (bt === 'esp32_cam') cy = 4 * 2.08;
                      else if (bt === 'esp32s3') cy = 4 * 1;
                      else if (bt === 'oled') cy = 4 * 1.5;
                      else cy = 4;

                    }
                  }
                  const rot =
                    Number((el as any).rotation || 0) * (Math.PI / 180);
                  const isBroken =
                    isSimulating && circuitState.readings[el.id] === "BROKEN!";
                  const isActive =
                    isSimulating && circuitState.active.has(el.id) && !isBroken;
                  const compType = (el as any).componentType;

                  
  let s = 1;
  let sY = 1;
  // Use scale 1 for actual size. MCU might need adjustments based on how they were initially modeled.
  if(compType === 'arduino_uno') s = 1;
  else if(compType === 'raspberry_pi') s = 1;
  else if(compType === 'esp32') s = 1;
  else if(compType === 'esp32s3') s = 1;
  else if(compType === 'esp32_cam') s = 1;
  else if(compType === 'oled') s = 1;
  
  sY = s;

  let Component3D = (

                    <HighQualityMesh
                      id={el.id}
                      type={compType}
                      isActive={isActive}
                      isBroken={isBroken}
                      isClosed={compType === "switch" && (el as any).customProps?.closed}
                      reading={circuitState.readings[el.id]}
                      customProps={(el as any).customProps}
            value={(el as any).value}
            isPCB={false}
                    />
                  );

                  return (
                    <group
                      key={el.id}
                      position={[cx, cy, cz]}
                      rotation={[0, -rot, 0]}
                      onClick={(e) => {
                        if (isSimulating && compType === "switch") {
                          e.stopPropagation();
                          updateElement(el.id, {
                            customProps: {
                              ...(el as any).customProps,
                              closed: !(el as any).customProps?.closed,
                            },
                          });
                        }
                      }}
                      onPointerOver={(e) => {
                        if (isSimulating && compType === "switch") {
                          document.body.style.cursor = 'pointer';
                        }
                      }}
                      onPointerOut={(e) => {
                        if (isSimulating && compType === "switch") {
                          document.body.style.cursor = 'auto';
                        }
                      }}
                    >
                      <group scale={[s, s, s]}>{Component3D}</group>
                      {isActive && compType === "led" && (
                        <pointLight
                          color={
                            (el as any).customProps?.color?.toLowerCase() === "green" ? "#22c55e" :
                            (el as any).customProps?.color?.toLowerCase() === "blue" ? "#3b82f6" :
                            (el as any).customProps?.color?.toLowerCase() === "yellow" ? "#eab308" :
                            (el as any).customProps?.color?.toLowerCase() === "white" ? "#ffffff" :
                            "#ef4444"
                          }
                          intensity={2}
                          distance={100}
                          position={[25, 10, 0]}
                        />
                      )}
                    </group>
                  );
                }
                return null;
              })}
            </group>
          )}
          {/* --- PCB BOARD AREA --- */}
          {mode === "pcb" && (
            <group>
              {/* PCB Base Platform - Looks like FR4 Material */}
              {/* PCB Base Platform - Smooth rendering, aligned naturally */}
              <group position={[0, 0, 0]}>
                
                {(() => {
                   let lx = boardShape.width / 2 - 55;
                   let lz = boardShape.height / 2 - 40;
                   const st = boardEl?.boardShape || "rect";
                   if (st === "circle") {
                     lx = (boardShape.width / 2 - 65) * Math.cos(Math.PI/4);
                     lz = (boardShape.height / 2 - 55) * Math.sin(Math.PI/4);
                   } else if (st === "triangle") {
                     lx = boardShape.width / 2 - 65;
                     lz = boardShape.height / 2 - 35;
                   }
                   return boardShape.width > 40 && boardShape.height > 40 ? (
                     <Logo3D position={[lx, 0.01, lz]} scale={0.5} />
                   ) : null;
                })()}
                
                {boardGeom ? (

                  <mesh
                    geometry={boardGeom}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                    receiveShadow
                    castShadow
                  >
                    
                    <meshPhysicalMaterial 
                      color={
                        (boardEl?.boardColor || "green") === "green" ? "#0f4225" :
                        boardEl?.boardColor === "red" ? "#611111" :
                        boardEl?.boardColor === "blue" ? "#0f235e" :
                        boardEl?.boardColor === "black" ? "#1a1a1a" :
                        boardEl?.boardColor === "white" ? "#d4d4d4" :
                        boardEl?.boardColor === "purple" ? "#331366" : "#0f4225"
                      }
                      roughness={0.4} 
                      metalness={0.2} 
                      clearcoat={0.8} 
                      clearcoatRoughness={0.2} 
                    />

                  </mesh>
                ) : (
                  <mesh receiveShadow castShadow position={[0, -0.8, 0]}>
                    <boxGeometry
                      args={[boardShape.width, 1.6, boardShape.height]}
                    />
                    
                    <meshPhysicalMaterial 
                      color={
                        (boardEl?.boardColor || "green") === "green" ? "#0f4225" :
                        boardEl?.boardColor === "red" ? "#611111" :
                        boardEl?.boardColor === "blue" ? "#0f235e" :
                        boardEl?.boardColor === "black" ? "#1a1a1a" :
                        boardEl?.boardColor === "white" ? "#d4d4d4" :
                        boardEl?.boardColor === "purple" ? "#331366" : "#0f4225"
                      }
                      roughness={0.4} 
                      metalness={0.2} 
                      clearcoat={0.8} 
                      clearcoatRoughness={0.2} 
                    />

                  </mesh>
                )}
              </group>

              {/* Copper Traces */}
              {pcbElements.map((el) => {
                if (el.type === "trace") {
                  const pts = el.points as Point[];
                  const isTop = el.layer === "top";
                  const traceType = boardEl?.traceColor || "silver";
                  const traceColor = traceType === "silver" ? "#e5e7eb" : traceType === "gold" ? "#fbbf24" : "#b45309"; // Copper or solder color
                  // Offset Y precisely to avoid z-fighting with the board or other traces
                  const safeId = el.id || "";
                  const stableRandom =
                    ((safeId.charCodeAt(0) || 0) +
                      (safeId.charCodeAt(safeId.length - 1) || 0)) /
                    20000;
                  const yOffset = isTop
                    ? 0.05 + stableRandom
                    : -1.65 - stableRandom;

                  // Better material properties for professional PCB traces (shiny copper/gold or tin)
                  const materialProps = {
                    color: traceColor,
                    metalness: 0.9,
                    roughness: 0.2,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2,
                  };

                  return (
                    <group key={el.id} position={[0, 0, 0]}>
                      {(pts || []).map((p, i) => {
                        const width = Number(el.width) || 4;
                        const cx = (Number(p.x) || 0) - boardShape.center.x;
                        const cz = (Number(p.y) || 0) - boardShape.center.y;

                        let lineMesh = null;
                        if (i > 0) {
                          const prev = pts[i - 1];
                          const px = Number(p.x) || 0;
                          const py = Number(p.y) || 0;
                          const prevX = Number(prev.x) || 0;
                          const prevY = Number(prev.y) || 0;
                          const dx = px - prevX;
                          const dz = py - prevY;
                          const dist = Math.sqrt(dx * dx + dz * dz) || 0.1;
                          const angle = Math.atan2(dz, dx);
                          const midX = prevX + dx / 2 - boardShape.center.x;
                          const midZ = prevY + dz / 2 - boardShape.center.y;

                          lineMesh = (
                            <mesh
                              position={[midX, yOffset, midZ]}
                              rotation={[0, -angle, 0]}
                            >
                              <boxGeometry args={[dist, 0.05, width]} />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          );
                        }

                        return (
                          <group key={i}>
                            {lineMesh}
                            <mesh position={[cx, yOffset, cz]}>
                              <cylinderGeometry
                                args={[width / 2, width / 2, 0.05, 12]}
                              />
                              <meshPhysicalMaterial {...materialProps} />
                            </mesh>
                          </group>
                        );
                      })}
                    </group>
                  );
                }

                if (el.type === "pcb_component") {
                  const cx = (Number(el.x) || 0) - boardShape.center.x;
                  const cz = (Number(el.y) || 0) - boardShape.center.y;
                  const rot = (Number(el.rotation) || 0) * (Math.PI / 180);

                  const schNode = elements.find(
                    (e) =>
                      e.type === "component" &&
                      (e as any).name === (el as any).name,
                  );
                  const schType = schNode
                    ? (schNode as any).componentType
                    : null;
                  const schValue = schNode ? (schNode as any).value : undefined;
                  const isBroken = schNode
                    ? isSimulating &&
                      circuitState.readings[schNode.id] === "BROKEN!"
                    : false;
                  const isActive = schNode
                    ? isSimulating &&
                      circuitState.active.has(schNode.id) &&
                      !isBroken
                    : false;

                  const compType = el.componentType;

                  return (
                    <PcbPcbComponentItem
                      key={el.id}
                      cx={cx}
                      cz={cz}
                      rot={rot}
                      layer={el.layer as any}
                      compType={compType as any}
                      schType={schType}
                      schValue={schValue}
                      isActive={isActive}
                      isBroken={isBroken}
                      el={el}
                      showPcbComponents={showPcbComponents}
                      reading={schNode ? (isSimulating ? circuitState.readings[schNode.id] : "") : ""}
                    />
                  );
                }
                return null;
              })}
              {ratsnestLines.map((line, i) => {
                 const x1 = line.x1 - boardShape.center.x;
                 const z1 = line.y1 - boardShape.center.y;
                 const x2 = line.x2 - boardShape.center.x;
                 const z2 = line.y2 - boardShape.center.y;
                 return (
                    <Line3D 
                      key={"rn_"+i} 
                      points={[[x1, 1, z1], [x2, 1, z2]]} 
                      color="cyan" transparent={true} opacity={0.6} 
                      lineWidth={1} 
                      dashed 
                      dashScale={5}
                      dashSize={2}
                      gapSize={2}
                    />
                 );
              })}
            </group>
          )}

          {/* Global shadows contact floor */}
          <ContactShadows
            resolution={256}
            frames={1}
            position={[0, mode === "pcb" ? -5 : -2.5, 0]}
            opacity={0.6}
            scale={400}
            blur={2}
            far={20}
            color="#000000"
          />
          <EffectComposer multisampling={4}>
            <N8AO halfRes aoRadius={2} intensity={1} color="black" />
            <Bloom luminanceThreshold={1} mipmapBlur luminanceSmoothing={0.5} intensity={1.5} />
          </EffectComposer>
          <OrbitControls
            makeDefault
            minDistance={30}
            maxDistance={1500}
            maxPolarAngle={mode === "pcb" ? Math.PI : Math.PI / 2 - 0.05}
            panSpeed={2}
            zoomSpeed={1.5}
            dampingFactor={0.1}
          />
        </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

export function PcbPcbComponentItem({
  cx,
  cz,
  rot,
  layer,
  compType,
  schType,
  schValue,
  isActive,
  isBroken,
  el, showPcbComponents, reading}: any) {
  const groupRef = React.useRef<any>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (isActive && schType === "motor") {
      const time = clock.getElapsedTime();
      const mesh = groupRef.current.getObjectByName("motorShaft");
      if (mesh) mesh.rotation.x = time * 20;
    }
    if (isActive && schType === "buzzer") {
      const t = clock.getElapsedTime();
      groupRef.current.position.x = cx + Math.sin(t * 100) * 0.5;
      groupRef.current.position.z = cz + Math.cos(t * 100) * 0.5;
    } else {
      groupRef.current.position.x = cx;
      groupRef.current.position.z = cz;
    }
  });

  const isSpecial = compType === "pad" || compType === "via" || compType === "copper_pour" || compType === "mounting_hole" || compType === "fiducial" || compType === "silkscreen_text";
  
  let w = 0, d = 0, scx = 0, scy = 0;
  if (!isSpecial) {
      const pins = getPcbComponentPins({ componentType: compType, name: el.name, customProps: el.customProps });
      if (pins && pins.length > 0) {
          const xs = pins.map((p: any) => p.x);
          const ys = pins.map((p: any) => p.y);
          xs.push(0);
          ys.push(0);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          w = (maxX - minX) + 12;
          d = (maxY - minY) + 12;
          scx = (minX + maxX) / 2;
          scy = (minY + maxY) / 2;
          if (w < 4) w = 4;
          if (d < 4) d = 4;
      }
  }

  let Component3D = (
    <group>
      {compType === "pad" || compType === "via" ? (
        <HighQualityMesh
          type={compType}
          isActive={isActive}
          isBroken={isBroken}
          isPCB={true}
          customProps={(el as any).customProps}
        />
      ) : null}

            {/* Silkscreen Outline */}
      {!isSpecial && w > 0 && d > 0 && (
          <group position={[scx, 1.25, scy]}>
             
             {compType === 'gps_pcb' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 17.5]}><boxGeometry args={[28, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -17.5]}><boxGeometry args={[28, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[13.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 36]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-13.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 36]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>
             ) : compType === 'gas_sensor_pcb' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 20.5]}><boxGeometry args={[42, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -20.5]}><boxGeometry args={[42, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[20.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 42]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-20.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 42]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>

             ) : compType === 'to220' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 8]}><boxGeometry args={[22, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -8]}><boxGeometry args={[22, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[11, 0, 0]}><boxGeometry args={[1.0, 0.2, 16]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-11, 0, 0]}><boxGeometry args={[1.0, 0.2, 16]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -6]}><boxGeometry args={[22, 0.2, 2.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>
             ) : compType === 'accelerometer_pcb' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 11]}><boxGeometry args={[18, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -11]}><boxGeometry args={[18, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[8.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 22]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-8.5, 0, 0]}><boxGeometry args={[1.0, 0.2, 22]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>
             ) : compType === 'capacitor_elec' || compType === 'led' ? (


                <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <ringGeometry args={[6.5, 7.5, 32]} />
                   <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                </mesh>
             ) : compType === 'cr2032' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                      <ringGeometry args={[24, 25, 32]} />
                      <meshPhysicalMaterial color="#ffffff" roughness={0.8} side={2} />
                   </mesh>
                </group>
             ) : compType === 'ultrasonic' ? (
                <group position={[-scx, 0, -scy]}>
                   <mesh position={[0, 0, 16]}><boxGeometry args={[62, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[0, 0, -16]}><boxGeometry args={[62, 0.2, 1.0]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[31, 0, 0]}><boxGeometry args={[1.0, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   <mesh position={[-31, 0, 0]}><boxGeometry args={[1.0, 0.2, 32]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                </group>
             ) : (
                <group position={[0, 0, 0]}>
                   {/* Intelligent Silkscreen: Main Outline */}
                   <mesh position={[0, 0, d/2]}><boxGeometry args={[w, 0.2, 0.8]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   <mesh position={[0, 0, -d/2]}><boxGeometry args={[w, 0.2, 0.8]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   <mesh position={[w/2, 0, 0]}><boxGeometry args={[0.8, 0.2, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   <mesh position={[-w/2, 0, 0]}><boxGeometry args={[0.8, 0.2, d]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   {/* Pin 1 indicator */}
                   <mesh position={[-w/2 + 2, 0, -d/2 + 2]}><cylinderGeometry args={[1, 1, 0.2, 16]}/><meshPhysicalMaterial color="#ffffff" roughness={0.2} emissive="#ffffff" emissiveIntensity={0.2} /></mesh>
                   {/* Crosshair indicator */}
                   <mesh position={[0, 0, 0]}><boxGeometry args={[2, 0.2, 0.2]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   <mesh position={[0, 0, 0]}><boxGeometry args={[0.2, 0.2, 2]}/><meshPhysicalMaterial color="#ffffff" roughness={0.4} emissive="#ffffff" emissiveIntensity={0.1} /></mesh>
                   {/* Inner Area Subtle Highlight */}
                   <mesh position={[0, -0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
                      <planeGeometry args={[w - 1, d - 1]} />
                      <meshPhysicalMaterial color="#ffffff" transparent opacity={0.03} />
                   </mesh>
                </group>
             )}
          </group>
      )}
      
      {/* Silkscreen Reference Designator */}
      {typeof el.name === "string" && !el.name.startsWith("Pad") && compType !== "via" && compType !== "pad" && (
        <Text
          position={[0, 1.26, 10]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.2}
          outlineColor="#000000"
        >
          {el.name}
        </Text>
      )}

      {/* Actual Component Mesh */}
      <HighQualityMesh
        id={el.id}
        type={compType === "smd" && schType === "led" ? "smd_led" : compType}
        isActive={isActive}
        isBroken={isBroken}
        value={(el as any).value || schValue}
        customProps={(el as any).customProps}
        showBody={showPcbComponents}
        reading={reading}
        isPCB={true}
        bounds={w > 0 ? {w, d} : undefined}
      />
    </group>
  );

  const absoluteY = layer === "bottom" ? -1.6 : 0;
  // Generic Pads for PCB components
  const pins = getPcbComponentPins({ componentType: compType, name: el.name, customProps: (el as any).customProps });
  const isSMD = ["smd", "sot23", "sop", "soic", "cr2032", "gps_pcb", "accelerometer_pcb", "gas_sensor_pcb", "ldr_smd", "ntc_smd", "qfp", "bga"].includes(compType);
  
  return (
    <group
      ref={groupRef}
      position={[cx, absoluteY, cz]}
      rotation={[0, -rot, 0]}
      scale={[1, layer === "bottom" ? -1 : 1, 1]}
    >
      {/* Precision solder pads / through-holes aligned exactly to component terminals */}
      {compType !== "pad" && compType !== "via" && compType !== "copper_pour" && compType !== "mounting_hole" && pins.map((p: any, i: number) => {
         const px = p.x;
         const pz = p.y;
         
         if (isSMD) {
           return (
             <group key={'genpad_'+i} position={[px, 0, pz]}>
               {/* SMD Rectangular Pad */}
               <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
                 <boxGeometry args={compType === 'sop' || compType === 'soic' ? [4.5, 0.1, 2.5] : [4.5, 0.1, 4.5]} />
                 <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} clearcoat={0.5} />
               </mesh>
             </group>
           );
         } else {
           return (
             <group key={'genpad_'+i} position={[px, 0, pz]}>
               {/* THT Top Copper Annular Ring Pad */}
               <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
                 <cylinderGeometry args={[2.2, 2.2, 0.08, 16]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.95} roughness={0.25} />
               </mesh>
               {/* THT Bottom Copper Annular Ring Pad */}
               <mesh castShadow receiveShadow position={[0, -1.64, 0]}>
                 <cylinderGeometry args={[2.2, 2.2, 0.08, 16]} />
                 <meshPhysicalMaterial color="#d4af37" metalness={0.95} roughness={0.25} />
               </mesh>
               {/* Plated Through Hole Barrel */}
               <mesh castShadow receiveShadow position={[0, -0.8, 0]}>
                 <cylinderGeometry args={[1.0, 1.0, 1.7, 16]} />
                 <meshPhysicalMaterial color="#0f0f13" roughness={0.8} />
               </mesh>
               {/* Solder Fillet Ring at base of component lead */}
               <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
                 <cylinderGeometry args={[1.1, 1.6, 0.4, 16]} />
                 <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.2} />
               </mesh>
             </group>
           );
         }
      })}
      {Component3D}
    </group>
  );
}
