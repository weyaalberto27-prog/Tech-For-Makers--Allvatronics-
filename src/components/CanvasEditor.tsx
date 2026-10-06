import { astarRoute } from "../lib/astar";
import { alignAndRouteConvertedCircuit } from "../lib/circuitAutoAlign";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Stage, Layer, Circle, Line, Text, Group, Rect, Ellipse, Path, Arc } from "react-konva";
import { useEditor } from "../store";
import { BuzzerAudio } from "../lib/BuzzerAudio";
import {
  ResistorSymbol,
  CapacitorSymbol,
  CapacitorElectrolyticSymbol,
  GroundSymbol,
  ICSymbol,
  ModuleSymbol,
  LDRSymbol,
  NTCSymbol,
  GasSensorSymbol,
  AccelerometerSymbol,
  GPSSymbol,
  CR2032Symbol,
  CrystalSymbol,
  UltrasonicSymbol,
  HC05Symbol,
  DHT11Symbol,
  ESP8266Symbol,
  InductorSymbol,
  DiodeSymbol,
  BatterySymbol,
  SwitchSymbol,
  LEDSymbol,
  LampSymbol,
  PowerSupplySymbol,
  PCBDIP8Symbol,
  PCBSMDSymbol,
  PCBPadSymbol,
  PCBViaSymbol,
  ArduinoUnoSymbol,
  ESP32Symbol,
  ESP32CamSymbol,
  RaspberryPiSymbol,
  ServoMotorSymbol,
  ATtiny85Symbol,
  STM32BluePillSymbol,
  BuzzerSymbol,
  RelaySymbol,
  RelayModuleSymbol,
  ZenerDiodeSymbol,
  PotentiometerSymbol,
  OLEDSymbol,
  MotorSymbol,
  PCBSot23Symbol,
  PCBTo220Symbol,
  PCBSopSymbol,
  PCBQfpSymbol,
  TransistorSymbol,
  TransistorPNPSymbol,
  PCBBGASymbol,
  PCBPinHeaderSymbol,
  PCBUSBCSymbol,
  PCBMicroUSBSymbol,
  MosfetSymbol,
  MosfetPSymbol,
  Timer555Symbol,
  OpampSymbol,
  LogicGateSymbol,
  LogicAndSymbol,
  LogicOrSymbol,
  LogicNandSymbol,
  LogicNorSymbol,
  LogicXorSymbol,
  LogicNotSymbol,
  ACSourceSymbol,
  VoltmeterSymbol,
  AmmeterSymbol,
  OscilloscopeSymbol,
  SevenSegmentSymbol,
  PCBCR2032Symbol,
  PCBLDRSMDSymbol,
  PCBNTCSMDSymbol,
  PCBCrystalSymbol,
  PCBCopperPourSymbol,
  PCBFiducialSymbol,
  PCBMountingHoleSymbol,
  PCBTestPointSymbol,
  PCBSilkscreenTextSymbol,
  ProtoboardSymbol,
  USBCSymbol,
  MicroUSBSymbol, PCBAccelerometerSymbol, PCBGPSSymbol, PCBGasSensorSymbol, StepperMotorSymbol, MotorDriverSymbol, DigitalMultimeterSymbol, ESP32S3Symbol} from "./Symbols";
import { snapToGrid, GRID_SIZE, cn } from "../lib/utils";
import {
  ComponentType,
  WireEntity,
  ComponentEntity,
  Point,
  PcbComponentType,
  PcbComponentEntity,
  TraceEntity,
  PcbBoardEntity,
  PcbElement,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { pinMap, getComponentPins, pcbPinMap, getPcbComponentPins } from "../lib/pinmap";
import { compileCppToJS } from "../lib/compiler";
import { calculatePinOffsetsForProtoboard } from "../lib/protoboard_snap";
import { simulateDC } from "../lib/simulator";
import { TriangleAlert, ZoomIn, ZoomOut } from "lucide-react";
import { CanvasViewer3D } from "./CanvasViewer3D";


const CopperPourGroup = ({ board, pcbElements, activePcbLayer, copperPourElement }: any) => {
  const groupRef = React.useRef<any>(null);
  
  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.cache();
      groupRef.current.getLayer()?.batchDraw();
    }
  }, [board, pcbElements, activePcbLayer, copperPourElement]);

  if (!board) return null;

  // Use the layer of the copper pour to determine color
  const isTop = copperPourElement.layer === "top";
  // Only show if the active layer matches or if we show all
  if (activePcbLayer !== copperPourElement.layer) return null;

  const color = isTop ? "rgba(185, 28, 28, 0.6)" : "rgba(29, 78, 216, 0.6)";

  return (
    <Group ref={groupRef} x={0} y={0}>
      {/* 1. Draw the copper area (currently fills the board) */}
      {(!board.boardShape || board.boardShape === "rect") && (
         <Rect x={0} y={0} width={board.width} height={board.height} fill={color} />
      )}
      {board.boardShape === "circle" && (
         <Ellipse x={board.width / 2} y={board.height / 2} radiusX={board.width / 2} radiusY={board.height / 2} fill={color} />
      )}
      {board.boardShape === "triangle" && (
         <Line points={[board.width / 2, 0, board.width, board.height, 0, board.height]} closed fill={color} />
      )}

      {/* 2. Punch holes for traces and pads */}
      <Group globalCompositeOperation="destination-out">
        {pcbElements.map((el: any) => {
           if (el.type === 'trace' && el.layer === copperPourElement.layer) {
              return (
                 <Line
                    key={"clear_"+el.id}
                    points={((el as any).points || []).flatMap((p: any) => [p.x - board.x, p.y - board.y])}
                    stroke="black"
                    strokeWidth={(el.width || 4) + 6} // Clearance 3px on each side
                    lineCap="round"
                    lineJoin="round"
                 />
              );
           }
           if (el.type === 'pcb_component' && el.componentType !== 'copper_pour' && el.componentType !== 'board') {
              // Thermal relief for GND (we assume pad name GND)
              const isGnd = el.name && el.name.toLowerCase().includes("gnd");
              const px = el.x - board.x;
              const py = el.y - board.y;
              if (isGnd) {
                 // Thermal relief: Erase a ring, but leave 4 thin spokes
                 return (
                    <Group key={"clear_"+el.id} x={px} y={py}>
                       <Circle x={0} y={0} radius={12} stroke="black" strokeWidth={6} />
                       {/* Spokes are NOT erased, so we draw with destination-in or just erase sections.
                           Actually, to erase sections, we can draw 4 arcs.
                       */}
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={10} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={100} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={190} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={280} fill="black" />
                    </Group>
                 )
              } else {
                 return <Circle key={"clear_"+el.id} x={px} y={py} radius={12} fill="black" />;
              }
           }
           return null;
        })}
      </Group>
    </Group>
  );
};

function getOrthogonalPoints(p1: Point, p2: Point, obstacles?: {x: number, y: number, width: number, height: number}[], direction: "auto" | "h-first" | "v-first" = "auto"): Point[] {
  if (obstacles && obstacles.length > 0 && direction === "auto") {
     return astarRoute(p1, p2, obstacles, 10, "orthogonal");
  }
  // If aligned horizontally or vertically already
  if (Math.abs(p1.x - p2.x) < 5 || Math.abs(p1.y - p2.y) < 5) {
    return [p1, p2];
  }

  if (direction === "h-first") {
    return [p1, { x: p2.x, y: p1.y }, p2];
  } else if (direction === "v-first") {
    return [p1, { x: p1.x, y: p2.y }, p2];
  }

  // Add an elbow (L shape)
  // We determine direction based on longest distance
  if (Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y)) {
    return [p1, { x: p2.x, y: p1.y }, p2];
  } else {
    return [p1, { x: p1.x, y: p2.y }, p2];
  }
}

function get45DegreePoints(p1: Point, p2: Point, direction: "auto" | "h-first" | "v-first" = "auto"): Point[] {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);

  if (dx < 5 || dy < 5 || Math.abs(dx - dy) < 5) {
    return [p1, p2];
  }

  const signX = p2.x > p1.x ? 1 : -1;
  const signY = p2.y > p1.y ? 1 : -1;

  // Option 1: 45 degree first, then orthogonal
  const opt1 = dx > dy ? { x: p1.x + dy * signX, y: p2.y } : { x: p2.x, y: p1.y + dx * signY };
  // Option 2: orthogonal first, then 45 degree
  const opt2 = dx > dy ? { x: p2.x - dy * signX, y: p1.y } : { x: p1.x, y: p2.y - dx * signY };

  if (direction === "h-first") {
    return [p1, opt1, p2];
  } else if (direction === "v-first") {
    return [p1, opt2, p2];
  }

  return [p1, opt1, p2];
}


function simplifyTracePath(path: Point[]): Point[] {
   if (path.length <= 2) return path;
   let simplified = [path[0]];
   for (let i = 1; i < path.length - 1; i++) {
      let prev = path[i-1];
      let curr = path[i];
      let next = path[i+1];
      let dx1 = curr.x - prev.x;
      let dy1 = curr.y - prev.y;
      let dx2 = next.x - curr.x;
      let dy2 = next.y - curr.y;
      if (dx1 * dy2 !== dx2 * dy1) {
         simplified.push(curr);
      }
   }
   simplified.push(path[path.length-1]);
   return simplified;
}

export const calculateNets = (elements: any[]) => {
  const wireAdj = new Map<string, Set<string>>();
  const pointId = (x: number, y: number) => Math.round(x / 5) * 5 + "," + Math.round(y / 5) * 5;
  const addWireEdge = (p1: any, p2: any) => {
    const id1 = pointId(p1.x, p1.y);
    const id2 = pointId(p2.x, p2.y);
    if (!wireAdj.has(id1)) wireAdj.set(id1, new Set());
    if (!wireAdj.has(id2)) wireAdj.set(id2, new Set());
    wireAdj.get(id1)!.add(id2);
    wireAdj.get(id2)!.add(id1);
  };
  elements.forEach((el) => {
    if (el.type === "wire") {
      const w = el as any;
      for (let i = 0; i < w.points.length - 1; i++) {
        addWireEdge(w.points[i], w.points[i + 1]);
      }
    }
  });

  const schComponents = elements.filter((el) => el.type === "component");
  const compPins = new Map<string, string[]>();
  schComponents.forEach((comp) => {
    const localPins = getComponentPins(comp) || [{ x: 0, y: 0 }];
    const rad = (comp.rotation * Math.PI) / 180;
    const pins = localPins.map((p: any) => ({
      x: comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad),
      y: comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad),
    }));
    const ids = pins.map((p: any) => pointId(p.x, p.y));
    if (comp.name) {
      compPins.set(comp.name, ids);
    }
    ids.forEach((id: any) => {
      if (!wireAdj.has(id)) wireAdj.set(id, new Set());
    });
  });

  const visited = new Set<string>();
  const nets: Set<string>[] = [];
  for (const node of wireAdj.keys()) {
    if (!visited.has(node)) {
      const net = new Set<string>();
      const queue = [node];
      visited.add(node);
      while (queue.length > 0) {
        const curr = queue.shift();
        if(!curr) continue;
        net.add(curr);
        for (const neighbor of wireAdj.get(curr) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      if (net.size > 1) {
        nets.push(net);
      }
    }
  }
  return { nets, compPins };
};

const doAutoRoute = (
  elements: any[],
  pcbElements: any[],
  setPcbElements: any,
  pinMap: any,
  astarRoute: any,
  uuidv4: any,
) => {
  const newPcbElements = [...pcbElements.filter((el) => el.type !== "trace")];
  const components = newPcbElements.filter(
    (el) => el.type === "pcb_component",
  ) as any[];
  
  if (components.length < 2) return;

  const { nets, compPins } = calculateNets(elements);


  nets.forEach((net, i) => {
    const pcbPoints: { x: number; y: number }[] = [];
    components.forEach((pcbComp) => {
      if (!pcbComp.name) return;
      const schPins = compPins.get(pcbComp.name);
      if (schPins) {
        schPins.forEach((pinId, idx) => {
          if (net.has(pinId)) {
            const pcbType = pcbComp.componentType;
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
        const p1 = pcbPoints[j];
        const p2 = pcbPoints[j + 1];
        const obstacles = components.map((c) => ({
          x: c.x,
          y: c.y,
          width: 20,
          height: 20,
        }));
        const pts = astarRoute(p1, p2, obstacles, 5, "pcb");
        newPcbElements.push({
          id: uuidv4(),
          type: "trace",
          points: pts,
          layer: i % 2 === 0 ? "bottom" : "top",
          width: 4,
        } as any);
      }
    }
  });

  setPcbElements(newPcbElements);
};
export function CanvasEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const {
    mode,
    setMode,
    elements,
    pcbElements,
    setPcbElements,
    tool,
    pcbTool,
    activePcbLayer,
    setTool,
    setPcbTool,
    zoom,
    setZoom,
    pan,
    setPan,
    selectedIds,
    setSelectedIds,
    addElement,
    updateElement,
    updateElements,
    removeElement,
    boardTheme,
    isSimulating,
    activeWireColor,
    smartWiring,
    wireDirection,
    diffPairActive,
  } = useEditor();

  const [probePos, setProbePos] = useState<Point | null>(null);

  const [wiring, setWiring] = useState<{
    active: boolean;
    start: Point | null;
    current: Point | null;
  }>({
    active: false,
    start: null,
    current: null,
  });

  const activeTool = mode === "schematic" ? tool : pcbTool;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ["INPUT", "TEXTAREA"].includes(
        document.activeElement?.tagName || "",
      );
      if (isInput) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0) {
          selectedIds.forEach((id) => removeElement(id));
          setSelectedIds([]);
        }
      } else if (e.key.toLowerCase() === "r") {
        selectedIds.forEach((id) => {
          const el =
            mode === "schematic"
              ? elements.find((el) => el.id === id)
              : pcbElements.find((el) => el.id === id);

          if (el && "rotation" in el) {
            let rot = ((el as any).rotation || 0) + 90;
            if (mode === "pcb") {
               const cx = (el as any).x;
               const cy = (el as any).y;
               const deltaRot = rot - ((el as any).rotation || 0);
               const rad = deltaRot * (Math.PI / 180);
               const cos = Math.cos(rad);
               const sin = Math.sin(rad);
               
               const updates: any[] = [{ id, updates: { rotation: rot } }];
               pcbElements.forEach((p) => {
                   if (p.type === "pcb_component" && (p as any).customProps?.parentId === id) {
                       const px = (p as any).x - cx;
                       const py = (p as any).y - cy;
                       const newX = cx + px * cos - py * sin;
                       const newY = cy + px * sin + py * cos;
                       updates.push({ id: p.id, updates: { x: newX, y: newY } });
                   }
               });
               updateElements(updates);
            } else {
               updateElement(id, { rotation: rot });
            }
          }
        });
      } else if (e.key.toLowerCase() === "m") {
        if (mode === "schematic") setTool("select");
        else setPcbTool("select");
      } else if (e.key.toLowerCase() === "w") {
        if (mode === "schematic") setTool("wire");
        else setPcbTool("trace");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIds,
    removeElement,
    setSelectedIds,
    mode,
    elements,
    pcbElements,
    updateElement,
    setTool,
    setPcbTool,
  ]);

  useEffect(() => {
    const handleAddHoles = () => {
      if (mode !== "pcb" || selectedIds.length === 0) return;
      
      const toAdd: PcbElement[] = [];
      selectedIds.forEach((id) => {
        const comp = pcbElements.find((e) => e.id === id);
        if (comp && comp.type === "pcb_component") {
            const rot = comp.rotation * (Math.PI / 180);
            const getPos = (px: number, py: number) => {
                return {
                    x: comp.x + px * Math.cos(rot) - py * Math.sin(rot),
                    y: comp.y + px * Math.sin(rot) + py * Math.cos(rot)
                };
            };
            
            let points: {x: number, y: number}[] = [];
            
            if (comp.componentType === "dip8") {
                const is14Pin = comp.name && comp.name.startsWith("U"); // roughly
                const xs = is14Pin ? [-30, -20, -10, 0, 10, 20, 30] : [-15, -5, 5, 15];
                xs.forEach(px => {
                    points.push(getPos(px, -20));
                    points.push(getPos(px, 20));
                });
            } else if (comp.componentType === "to220") {
                points.push(getPos(-10, 15));
                points.push(getPos(0, 15));
                points.push(getPos(10, 15));
            } else if (comp.componentType === "sot23") {
                points.push(getPos(-10, 10));
                points.push(getPos(10, 10));
                points.push(getPos(0, -10));
            } else {
                // Generic 2 pins
                points.push(getPos(-15, 0));
                points.push(getPos(15, 0));
            }
            
            points.forEach((pt, i) => {
                toAdd.push({
                  id: uuidv4(),
                  type: "pcb_component",
                  componentType: "pad", // Through hole pad
                  x: pt.x,
                  y: pt.y,
                  rotation: 0,
                  name: "",
                  layer: "all"
                });
            });
        }
      });
      if (toAdd.length > 0) {
        setPcbElements(prev => [...prev, ...toAdd]);
      }
    };
    
    
  }, [mode, selectedIds, pcbElements, setPcbElements]);

  useEffect(() => {
    const handleExport = (e: any) => {
      const format = e.detail?.format || "png";
      if (stageRef.current) {
        // Create a temporary stage to export without grid if in PCB mode?
        // Keep it simple for now and export as is.
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        if (format === "png") {
          const link = document.createElement("a");
          link.download = `AllvaTronics-${mode}.png`;
          link.href = uri;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (format === "pdf") {
          import("jspdf").then(({ jsPDF }) => {
            const pdf = new jsPDF("l", "px", [size.width, size.height]);
            pdf.addImage(uri, "PNG", 0, 0, size.width, size.height);
            pdf.save(`AllvaTronics-${mode}.pdf`);
          });
        }
      }
    };

    const handleExportToPcb = () => {
      const newPcbElements: PcbElement[] = [];
      // Create a default board with plenty of space
      newPcbElements.push({
        id: uuidv4(),
        type: "board",
        x: 150,
        y: 150,
        width: 500,
        height: 380,
      });

      // Map schematic components to PCB footprints
      let pcbX = 200;
      let pcbY = 200;
      const rowHeight = 70;
      const colWidth = 75;

      elements.forEach((el) => {
        if (el.type === "component") {
          const comp = el as ComponentEntity;
          let pcbType: PcbComponentType = comp.componentType as PcbComponentType;
          if (comp.componentType === "battery") pcbType = "battery_9v";
          else if (comp.componentType === "ldr") pcbType = "ldr_smd";
          else if (comp.componentType === "ntc") pcbType = "ntc_smd";
          else if (comp.componentType === "gas_sensor") pcbType = "gas_sensor_pcb";
          else if (comp.componentType === "accelerometer") pcbType = "accelerometer_pcb";
          else if (comp.componentType === "gps") pcbType = "gps_pcb";
          
          let finalCustomProps = { ...comp.customProps };
          if (((comp.componentType as string) === "pinheader" || (comp.componentType as string).includes("header")) && !finalCustomProps.pins) {
            const schPins2 = getComponentPins(comp);
            if (schPins2.length > 0) {
              finalCustomProps.pins = String(schPins2.length);
            }
          }
          
          const compId = uuidv4();
          newPcbElements.push({
            id: compId,
            type: "pcb_component",
            componentType: pcbType as PcbComponentType,
            x: pcbX,
            y: pcbY,
            rotation: 0,
            name: comp.name,
            layer: "top",
            customProps: finalCustomProps,
          });

          pcbX += colWidth;
          if (pcbX > 580) {
            pcbX = 200;
            pcbY += rowHeight;
          }
        }
      });

      // Use alignAndRouteConvertedCircuit for professional alignment and initial 45-degree routing
      const aligned = alignAndRouteConvertedCircuit(elements, newPcbElements, {
        boardShape: "rect",
        boardColor: "#105232",
        traceColor: "#eab308",
      });

      // Update state
      setPcbElements(aligned.pcbElements);
      setMode("pcb");
    };

    const handleAutoRoute = () => {
      doAutoRoute(
        elements,
        pcbElements,
        setPcbElements,
        pinMap,
        astarRoute,
        uuidv4,
      );
      alert("Auto-Routing baseado no esquemático concluído!");
    };

    const handleRunDRC = () => {
      let errorCount = 0;
      let errors: string[] = [];

      // 1. Components outside board
      const board = pcbElements.find((el) => el.type === "board") as any;
      const components = pcbElements.filter(
        (el) => el.type === "pcb_component",
      ) as any[];
      if (board) {
        const rx = board.x;
        const ry = board.y;
        const rx2 = board.x + board.width;
        const ry2 = board.y + board.height;

        components.forEach((c) => {
          if (c.x < rx || c.x > rx2 || c.y < ry || c.y > ry2) {
            errorCount++;
            errors.push(`Componente fora da placa: ID ${c.id.substring(0, 4)}`);
          }
        });
      }

      // 2. Trace clearance check and intersections
      const traces = pcbElements.filter((el) => el.type === "trace") as any[];
      const lineIntersects = (p1: any, p2: any, p3: any, p4: any) => {
        const det =
          (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
        if (det === 0) return false;
        const lambda =
          ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
        const gamma =
          ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
      };

      for (let i = 0; i < traces.length; i++) {
        for (let j = i + 1; j < traces.length; j++) {
          const t1 = traces[i],
            t2 = traces[j];
          if (t1.layer === t2.layer && t1.points && t2.points) {
            for (let m = 0; m < t1.points.length - 1; m++) {
              for (let n = 0; n < t2.points.length - 1; n++) {
                const p1 = t1.points[m],
                  p2 = t1.points[m + 1];
                const p3 = t2.points[n],
                  p4 = t2.points[n + 1];

                // Very simple overlap check
                if (lineIntersects(p1, p2, p3, p4)) {
                  errorCount++;
                  if (errors.length < 10)
                    errors.push(
                      `Trilhas em curto/sobrepostas na camada ${t1.layer || "top"}.`,
                    );
                }
              }
            }
          }
        }
      }

      // 3. Unconnected components based on schematic constraints
      if (traces.length === 0 && components.length > 1) {
        errorCount++;
        errors.push(`Nenhuma trilha desenhada. Faltam conexões.`);
      }

      // 4. Trace width limits (DRC trace width minimum)
      const minClearance = 0.2; // mm
      traces.forEach((t) => {
        const w = t.width || 2;
        if (w < 1) {
          // let's assume < 1mm is warning for this simple demo
          errorCount++;
          if (errors.length < 10)
            errors.push(
              `Aviso: Largura da trilha muito fina (${w}mm). ID: ${t.id.substring(0, 4)}`,
            );
        }
      });

      if (errorCount === 0) {
        alert("DRC Passou! Nenhuma violação encontrada.");
      } else {
        alert(
          `Erros de DRC encontrados (${errorCount}):\n` +
            errors.slice(0, 10).join("\n") +
            (errors.length > 10 ? "\n..." : ""),
        );
      }
    };

    const handleExportGerber = () => {
      let gerber =
        "%FSLAX26Y26*%\n%MOMM*%\n%ADD10C,0.2000*%\n%ADD11C,1.5000*%\n";
      gerber += "G01*\n";

      const traces = pcbElements.filter(
        (e: any) => e.type === "trace",
      ) as any[];
      gerber += "D10*\n";
      traces.forEach((t) => {
        if (!t.points || t.points.length === 0) return;
        gerber += `X${Math.round(t.points[0].x * 1000)}Y${Math.round(-t.points[0].y * 1000)}D02*\n`; // negate Y for gerber
        for (let i = 1; i < t.points.length; i++) {
          gerber += `X${Math.round(t.points[i].x * 1000)}Y${Math.round(-t.points[i].y * 1000)}D01*\n`;
        }
      });

      gerber += "M02*\n";

      // Just a simulated export
      const blob = new Blob([gerber], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "board.gbr";
      a.click();
      URL.revokeObjectURL(url);
    };

    const handleExportBOM = () => {
      let bom = "ID,Designator,Component,Value\n";
      elements.forEach((el) => {
        if (el.type === "component") {
          const comp = el as ComponentEntity;
          const val = comp.value || "";
          bom += `${comp.id},${comp.name || ""},${comp.componentType},${val}\n`;
        }
      });
      const blob = new Blob([bom], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "BOM.csv";
      a.click();
      URL.revokeObjectURL(url);
    };

    
    const handleAIReview = async () => {
      if (elements.length === 0) {
        alert("O esquemático está vazio.");
        return;
      }
      
      const isConfirmed = window.confirm("Você deseja enviar o esquemático atual para revisão da IA? (Pode levar alguns segundos)");
      if (!isConfirmed) return;

      try {
        const res = await fetch("/api/circuit-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ circuit: elements }),
        });
        if (!res.ok) {
           const errText = await res.text();
           let errMsg = "Erro na Revisão IA";
           try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
           alert(errMsg);
           return;
        }
        const data = await res.json();
        if (data.error) {
           alert("Erro na Revisão IA: " + data.error);
        } else {
           alert("Resultado da Revisão IA (DRC):\n\n" + data.review);
        }
      } catch (err: any) {
        alert("Erro de conexão ao realizar revisão: " + err.message);
      }
    };

    window.addEventListener("export-canvas", handleExport);
    window.addEventListener("export-to-pcb", handleExportToPcb);
    window.addEventListener("auto-route-pcb", handleAutoRoute);
    window.addEventListener("run-drc", handleRunDRC);
    window.addEventListener("ai-circuit-review", handleAIReview);
    

    return () => {
      window.removeEventListener("export-canvas", handleExport);
      window.removeEventListener("export-to-pcb", handleExportToPcb);
      window.removeEventListener("auto-route-pcb", handleAutoRoute);
      window.removeEventListener("run-drc", handleRunDRC);
      window.removeEventListener("ai-circuit-review", handleAIReview);
      
    };
  }, [mode, size, elements]);

  const handlePointerDown = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    // Transform position relative to pan/zoom
    const x = (pos.x - pan.x) / zoom;
    const y = (pos.y - pan.y) / zoom;
    let snappedX = snapToGrid(x);
    let snappedY = snapToGrid(y);

    if (activeTool === "wire" || activeTool === "trace") {
      let closestDist = 40;
      const targetElements = activeTool === "trace" ? pcbElements : elements;
      const targetPinMap = activeTool === "trace" ? pcbPinMap : pinMap;
      const getPins = (el) => activeTool === "trace" ? getPcbComponentPins(el) : getComponentPins(el);
      const targetCompType = activeTool === "trace" ? "pcb_component" : "component";
      
      targetElements.forEach((el) => {
        if (el.type === targetCompType) {
          const comp = el as any;
          const localPins = targetPinMap[comp.componentType] || [];
          const rad = ((comp.rotation || 0) * Math.PI) / 180;
          localPins.forEach((p: any) => {
            const pinGlobalX =
              comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad);
            const pinGlobalY =
              comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad);
            const dist = Math.sqrt(
              Math.pow(x - pinGlobalX, 2) + Math.pow(y - pinGlobalY, 2),
            );
            if (dist < closestDist) {
              closestDist = dist;
              snappedX = pinGlobalX;
              snappedY = pinGlobalY;
            }
          });
        }
      });
    }

    if (
      e.evt.button === 1 ||
      (e.evt.button === 0 && activeTool === "select" && e.target === stage)
    ) {
      // Middle click pan start, or background drag
      setSelectedIds([]); // deselect
      return;
    }

    if (activeTool === "eraser") {
      return; // Handle on child clicks
    }

    if (mode === "schematic") {
      if (tool === "wire") {
        if (!wiring.active) {
          setWiring({
            active: true,
            start: { x: snappedX, y: snappedY },
            current: { x: snappedX, y: snappedY },
          });
        } else {
          // Finish drawing wire
          if (wiring.start && wiring.current) {
            const obstacles = elements.filter(el => el.type === "component").map(c => ({x: (c as any).x, y: (c as any).y, width: 40, height: 40}));
            addElement({
              type: "wire",
              points: getOrthogonalPoints(wiring.start, wiring.current, obstacles, wireDirection),
              color: activeWireColor,
            });
          }
          setWiring({ active: false, start: null, current: null });
        }
        return;
      }

      if (tool !== "select") {
        const typeLetters: Record<string, string> = {
          resistor: "R",
          capacitor: "C",
          inductor: "L",
          diode: "D",
          zener_diode: "D",
          led: "LED",
          lamp: "LAMP",
          powersupply: "PSU",
          battery: "BT",
          switch: "SW",
          ic: "U",
          seven_segment: "DS",
          ground: "GND",
          arduino_uno: "UNO",
          esp32: "ESP",
          esp32_cam: "CAM",
          raspberry_pi: "RPI",
          buzzer: "BZ",
          relay: "K",
          relay_module: "K",
          potentiometer: "RV",
          oled: "DISP",
          motor: "M",
          transistor: "Q",
          transistor_pnp: "Q",
          capacitor_elec: "C",
        };

        const count =
          elements.filter(
            (el) =>
              el.type === "component" &&
              (el as ComponentEntity).componentType === tool,
          ).length + 1;

        const prefix = typeLetters[tool] || tool.toUpperCase().slice(0, 2);
        
        let defValue: string | undefined = undefined;
        if (tool === "ac_source") defValue = "220V";
        else if (tool === "battery") defValue = "9V";
        else if (tool === "powersupply") defValue = "5V";
        else if (tool === "resistor") defValue = "1k";
        else if (tool === "capacitor" || tool === "capacitor_elec") defValue = "10uF";
        else if (tool === "inductor") defValue = "1mH";
        else if (tool === "transistor") defValue = "2N2222";
        else if (tool === "transistor_pnp") defValue = "2N3906";
        else if (tool === "mosfet") defValue = "IRFZ44N";
        else if (tool === "mosfet_p") defValue = "IRF4905";
        else if (tool === "ic") defValue = "LM358";
        else if (tool === "timer555") defValue = "NE555";
        else if (tool === "opamp") defValue = "LM741";
        else if (tool === "lamp") defValue = "220V";
        else if (["arduino_uno", "attiny85", "raspberry_pi"].includes(tool)) defValue = "5V";
        else if (["esp32", "esp32s3", "esp32_cam", "stm32_bluepill", "esp8266"].includes(tool)) defValue = "3.3V";

        const newComp: any = {
          type: "component",
          componentType: tool as ComponentType,
          x: snappedX,
          y: snappedY,
          rotation: 0,
          value: defValue,
          name: `${prefix}${count}`,
          customProps: {},
        };
        const offsets = calculatePinOffsetsForProtoboard(newComp, snappedX, snappedY, elements);
        if (offsets) {
          newComp.customProps.pinOffsets = offsets.pinOffsets;
        }
        addElement(newComp);
      }
    } else {
      // PCB mode
      if (pcbTool === "board") {
        addElement({
          type: "board",
          x: snappedX,
          y: snappedY,
          width: 200,
          height: 150,
        });
        return;
      }

      if (pcbTool === "trace") {
        if (!wiring.active) {
          setWiring({
            active: true,
            start: { x: snappedX, y: snappedY },
            current: { x: snappedX, y: snappedY },
          });
        } else {
          if (wiring.start && wiring.current) {
            const obstaclesList = (() => {
               const comps = pcbElements.filter(el => el.type === "pcb_component").map(c => ({
                  x: (c as any).x, y: (c as any).y, width: 20, height: 20
               }));
               const traceLines = [];
               pcbElements.filter(el => el.type === "trace" && (el as any).layer === activePcbLayer).forEach(t => {
                  const tracePts = (t as any).points;
                  if (tracePts && tracePts.length > 1) {
                     for (let i = 0; i < tracePts.length - 1; i++) {
                        traceLines.push({ p1: tracePts[i], p2: tracePts[i+1] });
                     }
                  }
               });
               (comps as any).traceLines = traceLines;
               return comps;
            })();
            const pts = smartWiring ? astarRoute(wiring.start, wiring.current, obstaclesList as any, 5, "pcb") : get45DegreePoints(wiring.start, wiring.current, wireDirection);
            addElement({
              type: "trace",
              points: pts,
              layer: activePcbLayer,
            });
            if (diffPairActive) {
               // Add a second trace parallel to the first
               const pts2 = pts.map(p => ({ x: p.x + 5, y: p.y + 5 }));
               addElement({
                 type: "trace",
                 points: pts2,
                 layer: activePcbLayer,
               });
            }
          }
          setWiring({ active: false, start: null, current: null });
        }
        return;
      }

      const isVia = pcbTool === "via";
      if (
        [
          "pad",
          "via",
          "dip8",
          "smd",
          "sot23",
          "to220",
          "sop",
          "qfp",
          "bga",
          "pinheader",
          "usb_c",
          "micro_usb",
          "cr2032",
          "ldr_smd",
          "ntc_smd",
          "crystal",
          "copper_pour",
          "fiducial",
          "mounting_hole",
          "test_point",
        ].includes(pcbTool)
      ) {
        const pcbTypeLetters: Record<string, string> = {
          pad: "P",
          via: "V",
          dip8: "U",
          smd: "J",
          sot23: "Q",
          to220: "Q",
          sop: "U",
          qfp: "U",
          bga: "U",
          pinheader: "J",
          usb_c: "J",
          micro_usb: "J",
          cr2032: "BT",
          ldr_smd: "LDR",
          ntc_smd: "NTC",
          crystal: "Y",
          copper_pour: "POUR",
          fiducial: "FID",
          mounting_hole: "H",
          test_point: "TP",
    accelerometer_pcb: "ACC",
    gps_pcb: "GPS",
    gas_sensor_pcb: "GAS",
    };
        const count =
          pcbElements.filter(
            (el) =>
              el.type === "pcb_component" &&
              (el as PcbComponentEntity).componentType === pcbTool,
          ).length + 1;

        addElement({
          type: "pcb_component",
          componentType: pcbTool as PcbComponentType,
          x: snappedX,
          y: snappedY,
          rotation: 0,
          name: `${pcbTypeLetters[pcbTool]}${count}`,
          layer: isVia ? undefined : activePcbLayer,
        });
      }
    }
  };

  const handlePointerMove = (e: any) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = (pos.x - pan.x) / zoom;
    const y = (pos.y - pan.y) / zoom;
    let snappedX = snapToGrid(x);
    let snappedY = snapToGrid(y);

    if (activeTool === "probe") {
      setProbePos({ x: snappedX, y: snappedY });
    } else if (probePos) {
      setProbePos(null);
    }

    if (wiring.active) {
      let closestDist = 40;
      const isPcb = activeTool === "trace" || mode === "pcb";
      const targetElements = isPcb ? pcbElements : elements;
      const targetPinMap = isPcb ? pcbPinMap : pinMap;
      const getPins = (el) => isPcb ? getPcbComponentPins(el) : getComponentPins(el);
      const targetCompType = isPcb ? "pcb_component" : "component";
      
      targetElements.forEach((el) => {
        if (el.type === targetCompType) {
          const comp = el as any;
          const localPins = targetPinMap[comp.componentType] || [];
          const rad = ((comp.rotation || 0) * Math.PI) / 180;
          localPins.forEach((p: any) => {
            const pinGlobalX =
              comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad);
            const pinGlobalY =
              comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad);
            const dist = Math.sqrt(
              Math.pow(x - pinGlobalX, 2) + Math.pow(y - pinGlobalY, 2),
            );
            if (dist < closestDist) {
              closestDist = dist;
              snappedX = pinGlobalX;
              snappedY = pinGlobalY;
            }
          });
        }
      });
      setWiring((prev) => ({ ...prev, current: { x: snappedX, y: snappedY } }));
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = (pos.x - pan.x) / zoom;
    const y = (pos.y - pan.y) / zoom;

    // Check if we are hovering a selected component
    // If so, mouse wheel rotates it instead of zooming
    let hoveringSelected = false;
    let hoveringId = null;
    if (selectedIds.length > 0) {
      for (const el of [...elements, ...pcbElements]) {
        if (selectedIds.includes(el.id)) {
          const cx = (el as any).x;
          const cy = (el as any).y;
          if (
            cx !== undefined &&
            cy !== undefined &&
            Math.abs(cx - x) < 30 &&
            Math.abs(cy - y) < 30
          ) {
            hoveringSelected = true;
            hoveringId = el.id;
            break;
          }
        }
      }
    }

    if (!e.evt.ctrlKey && !e.evt.metaKey && !hoveringSelected && !e.evt.shiftKey) {
      setPan({
        x: pan.x - e.evt.deltaX,
        y: pan.y - e.evt.deltaY,
      });
      return;
    }

    if (hoveringSelected || e.evt.shiftKey) {
      const angleDelta = e.evt.deltaY > 0 ? 90 : -90; // Snap to 90 degrees by default for PCB components
      selectedIds.forEach((id) => {
        const el =
          mode === "schematic"
            ? elements.find((e) => e.id === id)
            : pcbElements.find((e) => e.id === id);

        if (el && "rotation" in el) {
          let rot = ((el as any).rotation || 0) + (e.evt.deltaY > 0 ? 15 : -15);
          if (!e.evt.shiftKey) rot = Math.round(rot / 90) * 90;
          
          if (mode === "pcb") {
             const cx = (el as any).x;
             const cy = (el as any).y;
             const deltaRot = rot - ((el as any).rotation || 0);
             const rad = deltaRot * (Math.PI / 180);
             const cos = Math.cos(rad);
             const sin = Math.sin(rad);
             
             const updates: any[] = [{ id, updates: { rotation: rot } }];
             pcbElements.forEach((p) => {
                 if (p.type === "pcb_component" && (p as any).customProps?.parentId === id) {
                     const px = (p as any).x - cx;
                     const py = (p as any).y - cy;
                     const newX = cx + px * cos - py * sin;
                     const newY = cy + px * sin + py * cos;
                     updates.push({ id: p.id, updates: { x: newX, y: newY } });
                 }
             });
             updateElements(updates);
             setTimeout(() => {
                 const currentPcbElements = pcbElements.map((p) => {
                     const u = updates.find((up) => up.id === p.id);
                     return u ? { ...p, ...u.updates } as any : p;
                 });
                 doAutoRoute(elements, currentPcbElements, setPcbElements, pinMap, astarRoute, uuidv4);
             }, 50);
          } else {
             updateElement(id, { rotation: rot });
          }
        }
      });
      return;
    }

    const scaleBy = 1.1;
    const oldScale = zoom;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - pan.x) / oldScale,
      y: (pointer.y - pan.y) / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(0.1, Math.min(newScale, 10)); // limits

    setZoom(newScale);
    setPan({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const drawGrid = useMemo(() => {
    const minX = -pan.x / zoom;
    const minY = -pan.y / zoom;
    const maxX = (size.width - pan.x) / zoom;
    const maxY = (size.height - pan.y) / zoom;

    const renderGridSize = 10;

    const startX = Math.floor(minX / renderGridSize) * renderGridSize;
    const endX = Math.ceil(maxX / renderGridSize) * renderGridSize;
    const startY = Math.floor(minY / renderGridSize) * renderGridSize;
    const endY = Math.ceil(maxY / renderGridSize) * renderGridSize;

    const dotColor =
      mode === "pcb"
        ? boardTheme === "light"
          ? "#94a3b8"
          : "#3a3a45"
        : boardTheme === "light" ? "#94a3b8" : "#475569"; // darker grid for light schematic

    const dots = [];
    for (let x = startX; x <= endX; x += renderGridSize) {
      for (let y = startY; y <= endY; y += renderGridSize) {
        dots.push(
          <Circle key={`${x}-${y}`} x={x} y={y} radius={1} fill={dotColor} />,
        );
      }
    }
    return dots;
  }, [pan, zoom, size, mode, boardTheme]);

  const [simTime, setSimTime] = useState(0);

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

  // Reset simulator state when simulation starts
  useEffect(() => {
    if (isSimulating) {
      (window as any).mcuContexts = {};
      (window as any)._transientState = undefined;
      (window as any)._logicState = {};
    }
  }, [isSimulating]);

  const circuitState = useMemo(() => {
    if (mode !== "schematic")
      return {
        active: new Set<string>(),
        hasShortCircuit: false,
        readings: {} as Record<string, string>,
        pointVoltages: {} as Record<string, number>,
      };

    // Execute MCU Emulators
    const mcuMap =
      (window as any).mcuContexts || ((window as any).mcuContexts = {});
    let mcuPinsMap: Record<string, number[]> = {};

    elements.forEach((c) => {
      if (
        c.type === "component" &&
        ["arduino_uno", "esp32", "esp32s3", "esp32_cam", "raspberry_pi", "attiny85", "stm32_bluepill", "esp8266"].includes(
          c.componentType,
        )
      ) {
        const code = c.customProps?.code || (window as any)._globalAppCode;
        let Mcu = mcuMap[c.id];
        if (!Mcu || Mcu._lastRawCode !== code) {
          if (Mcu) {
            Mcu._abort = true;
            if (Mcu._abortCurrentDelay) Mcu._abortCurrentDelay();
          }
          // ESP32 and Arduino have different numbers of pins, 60 is safe max for now
          Mcu = mcuMap[c.id] = {
            state: {},
            pins: new Array(60).fill(undefined),
            pinMode: () => {},
            digitalWrite: () => {},
            analogWrite: () => {},
            digitalRead: () => 0,
            analogRead: () => 0,
            OLED: {
              buffer: [] as any[],
              cursorX: 0,
              cursorY: 0,
              size: 1,
              begin: function() {},
              clearDisplay: function() { this.buffer = []; },
              display: function() {
                (window as any)._oledDisplayBuffer = [...this.buffer];
              },
              setCursor: function(x: number, y: number) { this.cursorX = x; this.cursorY = y; },
              setTextSize: function(s: number) { this.size = s; },
              print: function(txt: string) { 
                this.buffer.push({text: String(txt), x: this.cursorX, y: this.cursorY, size: this.size}); 
                this.cursorX += String(txt).length * 6 * this.size; 
              },
              println: function(txt: string) { 
                this.print(txt); 
                this.cursorX = 0; 
                this.cursorY += 8 * this.size; 
              }
            },
            delay: (ms: number) => new Promise(r => {
              let aborted = false;
              const timeout = setTimeout(() => {
                if (!aborted) r(undefined);
              }, ms);
              Mcu._abortCurrentDelay = () => {
                aborted = true;
                clearTimeout(timeout);
                r(undefined);
              };
            }),
            _lastRawCode: code
          };
        }

        // Initialize power pins for simulation
        const pType = c.componentType;
        if (pType === 'arduino_uno') {
           Mcu.pins[0] = 0.0; // GND top
           Mcu.pins[15] = 3.3; // 3V3
           Mcu.pins[16] = 5.0; // 5V
           Mcu.pins[17] = 0.0; // GND bot 1
           Mcu.pins[18] = 0.0; // GND bot 2
           Mcu.pins[19] = 5.0; // VIN
        } else if (pType === 'esp32') {
           Mcu.pins[0] = 3.3;  // 3V3 left[0]
           Mcu.pins[13] = 0.0; // GND left[13]
           Mcu.pins[15] = 0.0; // GND2 right[0]
           Mcu.pins[21] = 0.0; // GND3 right[6]
        } else if (pType === 'esp32s3') {
           Mcu.pins[0] = 3.3;
           Mcu.pins[1] = 3.3;
           Mcu.pins[20] = 5.0; // 5V
           Mcu.pins[21] = 0.0; // GND
           Mcu.pins[22] = 0.0; // GND right[0]
           Mcu.pins[23] = 0.0; // GND right[1]
           Mcu.pins[43] = 0.0; // GND right[21]
        } else if (pType === 'esp8266') {
           Mcu.pins[7] = 3.3;  // VCC
           Mcu.pins[15] = 0.0; // GND
        } else if (pType === 'esp32_cam') {
           Mcu.pins[0] = 5.0;  // 5V
           Mcu.pins[1] = 0.0;  // GND
           Mcu.pins[8] = 3.3;  // 3V3
           Mcu.pins[11] = 0.0; // GND2
           Mcu.pins[14] = 3.3; // VCC
           Mcu.pins[15] = 0.0; // GND3
        } else if (pType === 'attiny85') {
           Mcu.pins[3] = 0.0;  // GND
           Mcu.pins[4] = 5.0;  // VCC
        } else if (pType === 'stm32_bluepill') {
           Mcu.pins[17] = 3.3; // 3V3
           Mcu.pins[18] = 0.0; // GND
           Mcu.pins[19] = 0.0; // GND
           Mcu.pins[20] = 5.0; // 5V
           Mcu.pins[21] = 0.0; // GND
           Mcu.pins[22] = 3.3; // 3V3
        } else if (pType === 'raspberry_pi') {
           Mcu.pins[1] = 5.0;  // Pin 2
           Mcu.pins[3] = 5.0;  // Pin 4
           Mcu.pins[5] = 0.0;  // Pin 6
           Mcu.pins[0] = 3.3;  // Pin 1
           Mcu.pins[16] = 3.3; // Pin 17
           Mcu.pins[8] = 0.0;  // Pin 9
           Mcu.pins[13] = 0.0; // Pin 14
           Mcu.pins[19] = 0.0; // Pin 20
           Mcu.pins[24] = 0.0; // Pin 25
           Mcu.pins[29] = 0.0; // Pin 30
           Mcu.pins[33] = 0.0; // Pin 34
           Mcu.pins[38] = 0.0; // Pin 39
        }

        // Update I/O functions

        const mapPin = (pin: any) => {
          const type = c.componentType;
          let p = String(pin).toUpperCase().replace(/^D/, '');
          if (type === 'arduino_uno') {
            const top = ['GND','13','12','11','10','9','8','7','6','5','4','3','2','1'];
            const b1 = ['RST','3V3','5V','GND','GND2','VIN'];
            const b2 = ['A0','A1','A2','A3','A4','A5'];
            if (p === 'TX') p = '1';
            if (p === 'RX') p = '0'; // RX usually 0, but no pin in array, fallthrough
            if (top.includes(p)) return top.indexOf(p);
            if (b1.includes(p)) return b1.indexOf(p) + 14;
            if (b2.includes(p)) return b2.indexOf(p) + 20;
            if (p === 'GND') return 0;
          } else if (type === 'esp32') {
            const left = ['3V3','EN','VP','VN','34','35','32','33','25','26','27','14','12','GND','13'];
            const right = ['GND2','23','22','TX0','RX0','21','GND3','19','18','5','17','16','4','2','15'];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return right.indexOf(p) + 15;
            if (p==='GND') return 13;
          } else if (type === 'esp32s3') {
            const left = ["3V3", "3V3", "RST", "4", "5", "6", "7", "15", "16", "17", "18", "8", "3", "46", "9", "10", "11", "12", "13", "14", "5V", "GND"];
            const right = ["GND", "GND", "0", "45", "48", "47", "21", "20", "19", "35", "36", "37", "38", "39", "40", "41", "42", "TX", "RX", "2", "1", "GND"];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return right.indexOf(p) + 22;
            if (p==='GND') return 21;
          } else if (type === 'esp8266') {
            const left = ["RST","ADC","EN","16","14","12","13","VCC"];
            const right = ["TX","RX","5","4","0","2","15","GND"];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return right.indexOf(p) + 8;
            if (p==='GND') return 15;
          } else if (type === 'esp32_cam') {
            const left = ['5V','GND','12','13','15','14','2','4'];
            const right = ['3V3','U0R','U0T','GND2','16','0','VCC','GND3'];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return right.indexOf(p) + 8;
            if (p==='GND') return 1;
          } else if (type === 'attiny85') {
            const left = ['RESET', 'PB3', 'PB4', 'GND'];
            const right = ['VCC', 'PB2', 'PB1', 'PB0'];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return 7 - right.indexOf(p);
          } else if (type === 'stm32_bluepill') {
            const left = [
              "VB", "PC13", "PC14", "PC15", "PA0", "PA1", "PA2", "PA3", "PA4", "PA5",
              "PA6", "PA7", "PB0", "PB1", "PB10", "PB11", "RST", "3V3", "GND", "GND"
            ];
            const right = [
              "5V", "GND", "3V3", "PA15", "PA12", "PA11", "PA10", "PA9", "PA8", "PB15",
              "PB14", "PB13", "PB12", "PB9", "PB8", "PB7", "PB6", "PB5", "PB4", "PB3"
            ];
            if (left.includes(p)) return left.indexOf(p);
            if (right.includes(p)) return right.indexOf(p) + 20;
          }
          return parseInt(p) || 0;
        };

        Mcu.pinMode = (pin, mode) => {}; Mcu.digitalWrite = (pin: any, value: number) => {
          const idx = mapPin(pin);
          Mcu.pins[idx] = value ? 5 : 0;
        };
        Mcu.analogWrite = (pin: any, value: number) => {
          const idx = mapPin(pin);
          Mcu.pins[idx] = Math.max(0, Math.min(5, value * 5 / 255)); // Assuming 0-255 like arduino
        };

        const getPinVoltage = (pin: any) => {
          const pinIndex = mapPin(pin);
          const lastV = (window as any)._lastVoltages;
          if (!lastV) return 0;
          const rad = (c.rotation * Math.PI) / 180;
          const pList = getComponentPins(c) || [];
          const pLoc = pList[pinIndex];
          if (pLoc) {
            const px =
              Math.round(
                (c.x + pLoc.x * Math.cos(rad) - pLoc.y * Math.sin(rad)) / 5,
              ) * 5;
            const py =
              Math.round(
                (c.y + pLoc.x * Math.sin(rad) + pLoc.y * Math.cos(rad)) / 5,
              ) * 5;
            return lastV[`${px},${py}`] || 0;
          }
          return 0;
        };
        Mcu.analogRead = (pin: any) => {
          const v = getPinVoltage(pin);
          let adc = Math.round((v / 5.0) * 1023);
          if (adc < 0) adc = 0;
          if (adc > 1023) adc = 1023;
          return adc;
        };
        Mcu.digitalRead = (pin: any) => getPinVoltage(pin) > 1.5 ? 1 : 0;

        if (code && typeof code === "string") {
          try {
            if (!Mcu._compiledCode) {
               const jsCode = compileCppToJS(code);
               
               Mcu._hasSetup = false;
               Mcu._isLooping = false;
               Mcu._abort = false;

               const fn = new Function("Mcu", jsCode + "\nif(Mcu._setup && !Mcu._hasSetup) { Mcu._setup().catch(e => console.warn('Setup Error:', e)); Mcu._hasSetup = true; }");
               fn(Mcu);
               Mcu._compiledCode = true;
            }
            if (Mcu._loop && !Mcu._isLooping && !Mcu._abort) {
               Mcu._isLooping = true;
               Promise.resolve(Mcu._loop()).catch(e => console.warn("Loop Error:", e)).finally(() => {
                 Mcu._isLooping = false;
               });
            }
          } catch (e) {
            console.warn("MCU Code Error:", e);
          }
        }
        mcuPinsMap[c.id] = Mcu.pins;
      }
    });

    (window as any).mcu_pins_map = mcuPinsMap;

    try {
      return simulateDC(elements, pinMap, simTime);
    } catch(err) {
      console.error("simulateDC error:", err);
      return { elements: [], wires: [], readings: {}, hasShortCircuit: false, pointVoltages: {}, active: new Set<string>() };
    }
  }, [elements, mode, isSimulating, simTime]);

  
  const { ratsnestLines, netList } = useMemo(() => {
    if (mode !== "pcb" || pcbElements.length === 0 || elements.length === 0) return { ratsnestLines: [], netList: [] };
    const { nets, compPins } = calculateNets(elements);
    const pcbComps = pcbElements.filter((el) => el.type === "pcb_component");
    
    // Build a map of traces to see what's already routed
    // We will do a simple point distance check or just show all unrouted 
    // for ratsnest:
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    
    nets.forEach((net) => {
      const pcbPoints: { x: number; y: number }[] = [];
      pcbComps.forEach((pcbComp: any) => {
        if (!pcbComp.name) return;
        const schPins = compPins.get(pcbComp.name);
        if (schPins) {
          schPins.forEach((pinId, idx) => {
            if (net.has(pinId)) {
              const pcbType = pcbComp.componentType;
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
           // We could check if trace exists between p1 and p2. 
           // For simplicity in ratsnest, we just draw if they are far and no trace is near them.
           // Better: just draw all for now if no traces exist, or refine.
           lines.push({ x1: pcbPoints[j].x, y1: pcbPoints[j].y, x2: pcbPoints[j+1].x, y2: pcbPoints[j+1].y });
        }
      }
    });

    // Remove ratsnest lines that are covered by traces
    const traces = pcbElements.filter(el => el.type === "trace") as TraceEntity[];
    const isRouted = (x1: number, y1: number, x2: number, y2: number) => {
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
    
    const finalLines = lines.filter(l => !isRouted(l.x1, l.y1, l.x2, l.y2));
    
    return { ratsnestLines: finalLines, netList: nets };
  }, [elements, pcbElements, mode]);

  const activeElements = mode === "schematic" ? elements : pcbElements;
  const sortedActiveElements = [...activeElements].sort((a, b) => {
    const isBgA =
      a.type === "board" ||
      (a.type === "component" &&
        [
          "protoboard",
          "arduino_uno",
          "raspberry_pi",
          "esp32",
          "esp32_cam",
        ].includes(a.componentType));
    const isBgB =
      b.type === "board" ||
      (b.type === "component" &&
        [
          "protoboard",
          "arduino_uno",
          "raspberry_pi",
          "esp32",
          "esp32_cam",
        ].includes(b.componentType));
    if (isBgA && !isBgB) return -1;
    if (!isBgA && isBgB) return 1;
    return 0;
  });

  const bgColor = mode === "pcb" ? boardTheme === "light" ? "bg-[#f1f5f9]" : "bg-[#000000]" : boardTheme === "light" ? "bg-[#ffffe6]" : "bg-[#1e1e24]";

  
  const drcErrors = useMemo(() => {
    if (mode !== "pcb") return [];
    const errors: {x: number, y: number}[] = [];
    const traces = pcbElements.filter((el) => el.type === "trace") as any[];
    const lineIntersects = (p1: any, p2: any, p3: any, p4: any) => {
      const det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
      if (det === 0) return null;
      const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
      const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;
      if (0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
        return { x: p1.x + lambda * (p2.x - p1.x), y: p1.y + lambda * (p2.y - p1.y) };
      }
      return null;
    };

    for (let i = 0; i < traces.length; i++) {
      for (let j = i + 1; j < traces.length; j++) {
        const t1 = traces[i], t2 = traces[j];
        if (t1.layer === t2.layer && t1.points && t2.points) {
          for (let m = 0; m < t1.points.length - 1; m++) {
            for (let n = 0; n < t2.points.length - 1; n++) {
              const p1 = t1.points[m], p2 = t1.points[m + 1];
              const p3 = t2.points[n], p4 = t2.points[n + 1];
              const inter = lineIntersects(p1, p2, p3, p4);
              if (inter) errors.push(inter);
            }
          }
        }
      }
    }
    return errors;
  }, [pcbElements, mode]);

  const junctionPoints = useMemo(() => {
    if (mode !== "schematic") return [];
    const ptCounts = new Map<string, number>();

    elements.forEach((el) => {
      if (el.type === "wire") {
        const w = el as any;
        if (w.points && w.points.length >= 2) {
          for (let i = 0; i < w.points.length; i++) {
            const pt = w.points[i];
            const id = `${Math.round(pt.x / 5) * 5},${Math.round(pt.y / 5) * 5}`;
            const isEnd = i === 0 || i === w.points.length - 1;
            ptCounts.set(id, (ptCounts.get(id) || 0) + (isEnd ? 1 : 2));
          }
        }
      } else if (el.type === "component") {
        const pins = getComponentPins(el) || [];
        const rot = ((el as any).rotation || 0) * (Math.PI / 180);
        pins.forEach((pin: any) => {
          const px = pin.x * Math.cos(rot) - pin.y * Math.sin(rot) + (el as any).x;
          const py = pin.x * Math.sin(rot) + pin.y * Math.cos(rot) + (el as any).y;
          const id = `${Math.round(px / 5) * 5},${Math.round(py / 5) * 5}`;
          ptCounts.set(id, (ptCounts.get(id) || 0) + 1);
        });
      }
    });

    const jcts: { x: number; y: number }[] = [];
    ptCounts.forEach((count, id) => {
      if (count >= 3) {
        const [x, y] = id.split(",").map(Number);
        jcts.push({ x, y });
      }
    });
    return jcts;
  }, [elements, mode]);

  return (
    <div
      ref={containerRef}
      className={cn("flex-1 relative overflow-hidden", bgColor)}
      style={{ cursor: activeTool === "select" ? "default" : "crosshair" }}
    >
      {isSimulating && circuitState.hasShortCircuit && mode === "schematic" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 border border-red-500/50 text-white px-4 py-2 rounded-md font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-pulse flex items-center space-x-2 pointer-events-none">
          <TriangleAlert className="w-5 h-5 text-red-100" />
          <span>CURTO-CIRCUITO DETECTADO</span>
        </div>
      )}
      
      {elements
        .filter((el) => el.type === "component" && (el as any).componentType === "buzzer")
        .map((buzzer) => (
          <BuzzerAudio key={buzzer.id} isAlive={isSimulating && circuitState.active.has(buzzer.id)} />
      ))}
      
      {size.width > 0 && size.height > 0 && (
        <Stage
          ref={stageRef}
          width={size.width}
          height={size.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onWheel={handleWheel}
          draggable={activeTool === "select"}
          onDragMove={(e) => {
            if (e.target === e.target.getStage() && activeTool === "select") {
              setPan({ x: e.target.x(), y: e.target.y() });
            }
          }}
          x={pan.x}
          y={pan.y}
          scaleX={zoom}
          scaleY={zoom}
          onClick={(e) => {
            if (e.target === stageRef.current) setSelectedIds([]);
          }}
          onTap={(e) => {
            if (e.target === stageRef.current) setSelectedIds([]);
          }}
        >
          <Layer listening={false}>{drawGrid}</Layer>

          <Layer>
            
            {/* Ratsnest rendering */}
            {mode === "pcb" && ratsnestLines.map((line, i) => (
              <Line
                key={`ratsnest-${i}`}
                points={[line.x1, line.y1, line.x2, line.y2]}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth={1}
                dash={[4, 4]}
                listening={false}
              />
            ))}
            
            {sortedActiveElements.map((el) => {

              const isSelected = selectedIds.includes(el.id);

              if (el.type === "board") {
                const board = el as PcbBoardEntity;
                return (
                  <Group
                    key={board.id}
                    x={board.x}
                    y={board.y}
                    draggable={pcbTool === "select"}
                    onDragEnd={(e) => {
                      let newX = snapToGrid(e.target.x());
                      let newY = snapToGrid(e.target.y());
                      e.target.position({ x: newX, y: newY });
                      updateElement(board.id, { x: newX, y: newY });
                    }}
                    onClick={(e) => {
                      if (pcbTool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(board.id);
                      } else if (pcbTool === "select") {
                        e.cancelBubble = true;
                        setSelectedIds([board.id]);
                      }
                    }}
                    onTap={(e) => {
                      if (pcbTool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(board.id);
                      } else if (pcbTool === "select") {
                        e.cancelBubble = true;
                        setSelectedIds([board.id]);
                      }
                    }}
                  >
                    
                    {(!(board as any).boardShape || (board as any).boardShape === "rect") && (
                      <Rect
                        x={0}
                        y={0}
                        width={board.width}
                        height={board.height}
                        stroke={isSelected ? "#a78bfa" : "#fbbf24"}
                        strokeWidth={isSelected ? 4 : 2}
                        fill={(board as any).boardColor ? 
                           ({
                             green: "rgba(21, 128, 61, 0.8)",
                             red: "rgba(185, 28, 28, 0.8)",
                             blue: "rgba(29, 78, 216, 0.8)",
                             black: "rgba(20, 20, 20, 0.9)",
                             white: "rgba(240, 240, 240, 0.9)",
                             purple: "rgba(126, 34, 206, 0.8)"
                           }[(board as any).boardColor as string] || (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)"))
                           : (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)")}
                        cornerRadius={10}
                      />
                    )}
                    {(board as any).boardShape === "circle" && (
                      <Ellipse
                        x={board.width / 2}
                        y={board.height / 2}
                        radiusX={board.width / 2}
                        radiusY={board.height / 2}
                        stroke={isSelected ? "#a78bfa" : "#fbbf24"}
                        strokeWidth={isSelected ? 4 : 2}
                        fill={(board as any).boardColor ? 
                           ({
                             green: "rgba(21, 128, 61, 0.8)",
                             red: "rgba(185, 28, 28, 0.8)",
                             blue: "rgba(29, 78, 216, 0.8)",
                             black: "rgba(20, 20, 20, 0.9)",
                             white: "rgba(240, 240, 240, 0.9)",
                             purple: "rgba(126, 34, 206, 0.8)"
                           }[(board as any).boardColor as string] || (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)"))
                           : (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)")}
                      />
                    )}
                    {(board as any).boardShape === "triangle" && (
                      <Line
                        points={[board.width / 2, 0, board.width, board.height, 0, board.height]}
                        closed={true}
                        stroke={isSelected ? "#a78bfa" : "#fbbf24"}
                        strokeWidth={isSelected ? 4 : 2}
                        fill={(board as any).boardColor ? 
                           ({
                             green: "rgba(21, 128, 61, 0.8)",
                             red: "rgba(185, 28, 28, 0.8)",
                             blue: "rgba(29, 78, 216, 0.8)",
                             black: "rgba(20, 20, 20, 0.9)",
                             white: "rgba(240, 240, 240, 0.9)",
                             purple: "rgba(126, 34, 206, 0.8)"
                           }[(board as any).boardColor as string] || (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)"))
                           : (boardTheme === "dark" ? "rgba(20,20,30,0.8)" : "rgba(240,240,250,0.8)")}
                        lineJoin="round"
                      />
                    )}
                    
                    {/* Render copper pours here */}
                    {mode === "pcb" && pcbElements.filter((p: any) => p.type === 'pcb_component' && p.componentType === 'copper_pour').map((cp: any) => (
                       <CopperPourGroup 
                           key={"cp_" + cp.id} 
                           board={board} 
                           pcbElements={pcbElements} 
                           activePcbLayer={activePcbLayer}
                           copperPourElement={cp}
                       />
                    ))}


                    {/* Mounting holes at corners */}
                    
                    {(!(board as any).boardShape || (board as any).boardShape === "rect") && (
                      <>
                        <Circle x={10} y={10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width - 10} y={10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={10} y={board.height - 10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width - 10} y={board.height - 10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        
                        <Group x={board.width - 40} y={board.height - 40} scaleX={0.2} scaleY={0.2}>
                          <Path data="M 50 25 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Path data="M 37.5 47.5 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Circle x={50} y={25} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={75} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={25} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={37.5} y={47.5} radius={6} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Text x={-40} y={95} text="ALLVATRONICS" fontSize={26} fontStyle="bold" fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                        </Group>
                      </>
                    )}
                    {(board as any).boardShape === "circle" && (
                      <>
                        <Circle x={board.width/2 + (board.width/2 - 15) * Math.cos(Math.PI/4)} y={board.height/2 + (board.height/2 - 15) * Math.sin(Math.PI/4)} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width/2 + (board.width/2 - 15) * Math.cos(3*Math.PI/4)} y={board.height/2 + (board.height/2 - 15) * Math.sin(3*Math.PI/4)} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width/2 + (board.width/2 - 15) * Math.cos(5*Math.PI/4)} y={board.height/2 + (board.height/2 - 15) * Math.sin(5*Math.PI/4)} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width/2 + (board.width/2 - 15) * Math.cos(7*Math.PI/4)} y={board.height/2 + (board.height/2 - 15) * Math.sin(7*Math.PI/4)} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />

                        <Group x={board.width/2 - 10} y={board.height - 40} scaleX={0.2} scaleY={0.2}>
                          <Path data="M 50 25 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Path data="M 37.5 47.5 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Circle x={50} y={25} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={75} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={25} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={37.5} y={47.5} radius={6} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Text x={-40} y={95} text="ALLVATRONICS" fontSize={26} fontStyle="bold" fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                        </Group>
                      </>
                    )}
                    {(board as any).boardShape === "triangle" && (
                      <>
                        <Circle x={board.width/2} y={20} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={20} y={board.height - 10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />
                        <Circle x={board.width - 20} y={board.height - 10} radius={4} stroke="#fbbf24" strokeWidth={1} fill="transparent" />

                        <Group x={board.width/2 - 10} y={board.height - 40} scaleX={0.2} scaleY={0.2}>
                          <Path data="M 50 25 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Path data="M 37.5 47.5 L 75 70" stroke={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} strokeWidth={8} lineCap="round" />
                          <Circle x={50} y={25} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={75} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={25} y={70} radius={12} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Circle x={37.5} y={47.5} radius={6} fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                          <Text x={-40} y={95} text="ALLVATRONICS" fontSize={26} fontStyle="bold" fill={(boardTheme === "light" ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)")} />
                        </Group>
                      </>
                    )}
                  </Group>
                );
              }
                if (el.type === "wire") {
                const points = ((el as any).points || []).map((p) => [p.x, p.y]).flat();
                return (
                  <Group key={el.id}>
                    <Line
                      points={points}
                      stroke={
                        isSelected
                          ? "#4ade80"
                          : mode === "schematic"
                            ? ((el as any).color || "#008400")
                            : "#22c55e"
                      }
                      strokeWidth={(el as any).width || 2}
                      hitStrokeWidth={10}
                      onClick={(e) => {
                        if (tool === "eraser") {
                          e.cancelBubble = true;
                          removeElement(el.id);
                        } else if (tool === "select") {
                          e.cancelBubble = true;
                          setSelectedIds([el.id]);
                        }
                      }}
                      onTap={(e) => {
                        if (tool === "eraser") {
                          e.cancelBubble = true;
                          removeElement(el.id);
                        } else if (tool === "select") {
                          e.cancelBubble = true;
                          setSelectedIds([el.id]);
                        }
                      }}
                    />
                    {isSelected && tool === "select" && ((el as any).points || []).map((pt: any, i: number) => (
                      <Circle
                        key={`handle-${i}`}
                        x={pt.x}
                        y={pt.y}
                        radius={4}
                        fill="#4ade80"
                        stroke="#fff"
                        strokeWidth={1}
                        draggable
                        onDragMove={(e) => {
                           e.cancelBubble = true;
                        }}
                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                          const newPts = [...(el as any).points];
                          newPts[i] = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                          updateElement(el.id, { points: simplifyTracePath(newPts) });
                        }}
                      />
                    ))}
                    {isSelected && tool === "select" && Array.from({ length: ((el as any).points || []).length - 1 }).map((_, i) => {
                      const pts = (el as any).points || [];
                      const p1 = pts[i];
                      const p2 = pts[i+1];
                      if (!p1 || !p2) return null;
                      const mx = (p1.x + p2.x) / 2;
                      const my = (p1.y + p2.y) / 2;
                      return (
                         <Circle
                           key={`mid-${i}`}
                           x={mx}
                           y={my}
                           radius={4}
                           fill="#4ade80"
                           opacity={0.5}
                           stroke="#fff"
                           strokeWidth={1}
                           draggable
                           onDragMove={(e) => {
                             e.cancelBubble = true;
                           }}
                           onDragEnd={(e) => {
                             e.cancelBubble = true;
                             const newPts = [...pts];
                             newPts.splice(i + 1, 0, { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) });
                             updateElement(el.id, { points: simplifyTracePath(newPts) });
                           }}
                         />
                      );
                    })}
                  </Group>
                );
              }
              if (el.type === "trace") {
                const trace = el as TraceEntity;
                const points = trace.points.map((p) => [p.x, p.y]).flat();
                const isTop = trace.layer === "top";
                let stroke = isSelected
                  ? "#a78bfa"
                  : isTop
                    ? "#ef4444"
                    : "#3b82f6"; // purple if selected, red/blue for layer
                return (
                  <Group key={el.id}>
                    <Line
                      points={points}
                      stroke={stroke}
                      strokeWidth={trace.width || 4}
                      hitStrokeWidth={12}
                      opacity={0.8}
                      onClick={(e) => {
                        if (pcbTool === "eraser") {
                          e.cancelBubble = true;
                          removeElement(el.id);
                        } else if (pcbTool === "select") {
                          e.cancelBubble = true;
                          setSelectedIds([el.id]);
                        }
                      }}
                      onTap={(e) => {
                        if (pcbTool === "eraser") {
                          e.cancelBubble = true;
                          removeElement(el.id);
                        } else if (pcbTool === "select") {
                          e.cancelBubble = true;
                          setSelectedIds([el.id]);
                        }
                      }}
                    />
                    {isSelected && pcbTool === "select" && trace.points.map((pt: any, i: number) => (
                      <Circle
                        key={`handle-${i}`}
                        x={pt.x}
                        y={pt.y}
                        radius={4}
                        fill="#a78bfa"
                        stroke="#fff"
                        strokeWidth={1}
                        draggable
                        onDragMove={(e) => {
                           e.cancelBubble = true;
                        }}
                        onDragEnd={(e) => {
                          e.cancelBubble = true;
                          const newPts = [...trace.points];
                          const targetPt = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                          if (i === 0) {
                             if (newPts.length > 1) {
                                const pts = get45DegreePoints(targetPt, newPts[1]);
                                newPts.splice(0, 2, ...pts);
                             } else {
                                newPts[0] = targetPt;
                             }
                          } else if (i === trace.points.length - 1) {
                             const pts = get45DegreePoints(newPts[i-1], targetPt);
                             newPts.splice(i-1, 2, ...pts);
                          } else {
                             const pts1 = get45DegreePoints(newPts[i-1], targetPt);
                             const pts2 = get45DegreePoints(targetPt, newPts[i+1]);
                             newPts.splice(i-1, 3, ...pts1, ...pts2.slice(1));
                          }
                          updateElement(el.id, { points: simplifyTracePath(newPts) });
                        }}
                      />
                    ))}
                    {isSelected && pcbTool === "select" && Array.from({ length: trace.points.length - 1 }).map((_, i) => {
                      const p1 = trace.points[i];
                      const p2 = trace.points[i+1];
                      if (!p1 || !p2) return null;
                      const mx = (p1.x + p2.x) / 2;
                      const my = (p1.y + p2.y) / 2;
                      return (
                         <Circle
                           key={`mid-${i}`}
                           x={mx}
                           y={my}
                           radius={4}
                           fill="#a78bfa"
                           opacity={0.5}
                           stroke="#fff"
                           strokeWidth={1}
                           draggable
                           onDragMove={(e) => {
                             e.cancelBubble = true;
                           }}
                           onDragEnd={(e) => {
                             e.cancelBubble = true;
                             const newPts = [...trace.points];
                             const targetPt = { x: snapToGrid(e.target.x()), y: snapToGrid(e.target.y()) };
                             const pts1 = get45DegreePoints(newPts[i], targetPt);
                             const pts2 = get45DegreePoints(targetPt, newPts[i+1]);
                             newPts.splice(i, 2, ...pts1, ...pts2.slice(1));
                             updateElement(el.id, { points: simplifyTracePath(newPts) });
                           }}
                         />
                      );
                    })}
                  </Group>
                );
              }

              if (el.type === "component") {
                const comp = el as ComponentEntity;
                const props = {
                  x: comp.x,
                  y: comp.y,
                  rotation: comp.rotation,
                  selected: isSelected,
                };

                let SymbolView;
                switch (comp.componentType) {
                  case "resistor":
                    SymbolView = ResistorSymbol;
                    break;
                  case "capacitor":
                    SymbolView = CapacitorSymbol;
                    break;
                  case "capacitor_elec":
                    SymbolView = CapacitorElectrolyticSymbol;
                    break;
                  case "inductor":
                    SymbolView = InductorSymbol;
                    break;
                  case "diode":
                    SymbolView = DiodeSymbol;
                    break;
                  case "zener_diode":
                    SymbolView = ZenerDiodeSymbol;
                    break;
                  case "transistor":
                    SymbolView = TransistorSymbol;
                    break;
                  case "transistor_pnp":
                    SymbolView = TransistorPNPSymbol;
                    break;
                  case "mosfet":
                    SymbolView = MosfetSymbol;
                    break;
                  case "mosfet_p":
                    SymbolView = MosfetPSymbol;
                    break;
                  case "timer555":
                    SymbolView = Timer555Symbol;
                    break;
                  case "opamp":
                    SymbolView = OpampSymbol;
                    break;
                  case "logic_gate":
                    SymbolView = LogicGateSymbol;
                    break;
                  case "logic_and":
                    SymbolView = LogicAndSymbol;
                    break;
                  case "logic_or":
                    SymbolView = LogicOrSymbol;
                    break;
                  case "logic_nand":
                    SymbolView = LogicNandSymbol;
                    break;
                  case "logic_not":
                    SymbolView = LogicNotSymbol;
                    break;
                  case "logic_nor":
                    SymbolView = LogicNorSymbol;
                    break;
                  case "logic_xor":
                    SymbolView = LogicXorSymbol;
                    break;
                  case "ac_source":
                    SymbolView = ACSourceSymbol;
                    break;
                  case "voltmeter":
                    SymbolView = VoltmeterSymbol;
                    break;
                  case "ammeter":
                    SymbolView = AmmeterSymbol;
                    break;
                  case "oscilloscope":
                    SymbolView = OscilloscopeSymbol;
                    break;
                  case "seven_segment":
                    SymbolView = SevenSegmentSymbol;
                    break;
                  case "led":
                    SymbolView = LEDSymbol;
                    break;
                  case "powersupply":
                    SymbolView = PowerSupplySymbol;
                    break;
                  case "battery":
                    SymbolView = BatterySymbol;
                    break;
                  case "lamp":
                    SymbolView = LampSymbol;
                    break;
                  case "switch":
                    SymbolView = SwitchSymbol;
                    break;
                  case "ic":
                    SymbolView = ICSymbol;
                    break;
                  case "ground":
                    SymbolView = GroundSymbol;
                    break;
                  case "arduino_uno":
                    SymbolView = ArduinoUnoSymbol;
                    break;
                  case "esp32":
                    SymbolView = ESP32Symbol;
                    break;
                  case "esp32_cam":
                    SymbolView = ESP32CamSymbol;
                    break;
                  case "raspberry_pi":
                    SymbolView = RaspberryPiSymbol;
                    break;
                  case "buzzer":
                    SymbolView = BuzzerSymbol;
                    break;
                  case "relay":
                    SymbolView = RelaySymbol;
                    break;
                  case "relay_module":
                    SymbolView = RelayModuleSymbol;
                    break;
                  case "potentiometer":
                    SymbolView = PotentiometerSymbol;
                    break;
                  case "oled":
                    SymbolView = OLEDSymbol;
                    break;
                  case "motor":
                    SymbolView = MotorSymbol;
                    break;
                  case "servo_motor":
                    SymbolView = ServoMotorSymbol;
                    break;
                  case "attiny85":
                    SymbolView = ATtiny85Symbol;
                    break;
                  case "stm32_bluepill":
                    SymbolView = STM32BluePillSymbol;
                    break;
                  case "protoboard":
                    SymbolView = ProtoboardSymbol;
                    break;
                  case "usb_c":
                    SymbolView = USBCSymbol;
                    break;
                  
                  case "accelerometer_pcb":
                    SymbolView = PCBAccelerometerSymbol;
                    break;
                  case "gps_pcb":
                    SymbolView = PCBGPSSymbol;
                    break;
                  case "gas_sensor_pcb":
                    SymbolView = PCBGasSensorSymbol;
                    break;
                  

                  case "digital_multimeter":
                    SymbolView = DigitalMultimeterSymbol;
                    break;
                  case "esp32s3":
                    SymbolView = ESP32S3Symbol;
                    break;
                  case "micro_usb":
                    SymbolView = MicroUSBSymbol;
                    break;
                                                                        case "ultrasonic":
                    SymbolView = UltrasonicSymbol;
                    break;
                  case "hc05":
                    SymbolView = HC05Symbol;
                    break;
                  case "dht11":
                    SymbolView = DHT11Symbol;
                    break;
                  case "esp8266":
                    SymbolView = ESP8266Symbol;
                    break;
                  case "ldr":
                    SymbolView = LDRSymbol;
                    break;
                  case "ntc":
                    SymbolView = NTCSymbol;
                    break;
                  case "gas_sensor":
                    SymbolView = GasSensorSymbol;
                    break;
                  case "stepper_motor":
                    SymbolView = StepperMotorSymbol;
                    break;
                  case "motor_driver":
                    SymbolView = MotorDriverSymbol;
                    break;
                  case "accelerometer":
                    SymbolView = AccelerometerSymbol;
                    break;
                  case "gps":
                    SymbolView = GPSSymbol;
                    break;
                  case "cr2032":
                    SymbolView = CR2032Symbol;
                    break;
                  case "crystal":
                    SymbolView = CrystalSymbol;
                    break;
                  
                  default:
                    SymbolView = GroundSymbol;
                }

                return (
                  <Group
                    key={el.id}
                    x={comp.x}
                    y={comp.y}
                    rotation={comp.rotation}
                    draggable={tool === "select"}
                    onDragEnd={(e) => {
                      let newX = snapToGrid(e.target.x());
                      let newY = snapToGrid(e.target.y());
                      e.target.position({ x: newX, y: newY });
                      
                      const dx = newX - comp.x;
                      const dy = newY - comp.y;
                      
                      const updates: {id: string, updates: any}[] = [{ id: comp.id, updates: { x: newX, y: newY } }];
                      
                      const offsets = calculatePinOffsetsForProtoboard(comp, newX, newY, elements);
                      if (offsets) {
                        updates[0].updates.customProps = { ...comp.customProps, pinOffsets: offsets.pinOffsets };
                      }
                      
                      const movedComponents = [comp];
                      
                      if (comp.componentType === 'protoboard') {
                        elements.forEach(el => {
                          if (el.type === 'component' && el.id !== comp.id) {
                            if (el.x >= comp.x - 315 && el.x <= comp.x + 315 && el.y >= comp.y - 110 && el.y <= comp.y + 110) {
                              const elNewX = snapToGrid(el.x + dx);
                              const elNewY = snapToGrid(el.y + dy);
                              updates.push({
                                id: el.id,
                                updates: { x: elNewX, y: elNewY }
                              });
                              movedComponents.push(el as any);
                            }
                          }
                        });
                      }

                      // Move wires connected to moved components
                      const oldPins: {x: number, y: number}[] = [];
                      movedComponents.forEach(mc => {
                          const rad = (mc.rotation * Math.PI) / 180;
                          (getComponentPins(mc) || []).forEach((p: any) => {
                            const px = mc.x + p.x * Math.cos(rad) - p.y * Math.sin(rad);
                            const py = mc.y + p.x * Math.sin(rad) + p.y * Math.cos(rad);
                            oldPins.push({x: Math.round(px), y: Math.round(py)});
                          });
                      });

                      elements.forEach(el => {
                         if (el.type === "wire") {
                             const wire = el as WireEntity;
                             let changed = false;
                             let isStartConnected = false;
                             let isEndConnected = false;
                             let startPt = wire.points[0];
                             let endPt = wire.points[wire.points.length - 1];

                             if (oldPins.some(op => Math.abs(op.x - Math.round(startPt.x)) < 5 && Math.abs(op.y - Math.round(startPt.y)) < 5)) {
                                 isStartConnected = true;
                                 changed = true;
                             }
                             if (oldPins.some(op => Math.abs(op.x - Math.round(endPt.x)) < 5 && Math.abs(op.y - Math.round(endPt.y)) < 5)) {
                                 isEndConnected = true;
                                 changed = true;
                             }

                             if (changed) {
                                 const newStart = isStartConnected ? { x: startPt.x + dx, y: startPt.y + dy } : startPt;
                                 const newEnd = isEndConnected ? { x: endPt.x + dx, y: endPt.y + dy } : endPt;
                                 const obstacles = elements.filter(el => el.type === "component").map(c => ({x: (c as any).x, y: (c as any).y, width: 40, height: 40}));
                                 updates.push({ id: wire.id, updates: { points: getOrthogonalPoints(newStart, newEnd, obstacles, wireDirection) } });
                             }
                         }
                      });


                      updateElements(updates);

                      // Run auto-route professionally on component move
                      setTimeout(() => {
                        const currentElements = elements.map((el) => {
                          const matchingUpdate = updates.find(u => u.id === el.id);
                          return matchingUpdate ? { ...el, ...matchingUpdate.updates } as any : el;
                        });
                        doAutoRoute(
                          currentElements,
                          pcbElements,
                          setPcbElements,
                          pinMap,
                          astarRoute,
                          uuidv4,
                        );
                      }, 50);
                    }}
                    onClick={(e) => {
                      if (tool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(comp.id);
                      } else if (tool === "select") {
                        e.cancelBubble = true;
                        if (isSimulating && comp.componentType === "switch") {
                          updateElement(comp.id, {
                            customProps: {
                              ...(comp as any).customProps,
                              closed: !(comp as any).customProps?.closed,
                            },
                          });
                        } else {
                          setSelectedIds([comp.id]);
                        }
                      }
                    }}
                    onTap={(e) => {
                      if (tool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(comp.id);
                      } else if (tool === "select") {
                        e.cancelBubble = true;
                        if (isSimulating && comp.componentType === "switch") {
                          updateElement(comp.id, {
                            customProps: {
                              ...(comp as any).customProps,
                              closed: !(comp as any).customProps?.closed,
                            },
                          });
                        } else {
                          setSelectedIds([comp.id]);
                        }
                      }
                    }}
                  >
                    <SymbolView
                      x={0}
                      y={0}
                      rotation={0}
                      selected={isSelected}
                      value={comp.value}
                      isOn={
                        isSimulating &&
                        [
                          "led",
                          "motor",
                          "servo_motor",
                          "buzzer",
                          "voltmeter",
                          "ammeter",
                          "oscilloscope",
                          "lamp",
                        ].includes(comp.componentType)
                          ? circuitState.active.has(comp.id)
                          : comp.componentType === "switch"
                            ? comp.customProps?.closed
                            : undefined
                      }
                      voltages={
                        isSimulating &&
                        ["seven_segment", "oled"].includes(comp.componentType)
                          ? (() => {
                              const rad = (comp.rotation * Math.PI) / 180;
                              return (getComponentPins(comp) || []).map(
                                (p) => {
                                  const px =
                                    Math.round(
                                      (comp.x +
                                        p.x * Math.cos(rad) -
                                        p.y * Math.sin(rad)) /
                                        5,
                                    ) * 5;
                                  const py =
                                    Math.round(
                                      (comp.y +
                                        p.x * Math.sin(rad) +
                                        p.y * Math.cos(rad)) /
                                        5,
                                    ) * 5;
                                  return (
                                    (circuitState as any).pointVoltages?.[
                                      `${px},${py}`
                                    ] || 0
                                  );
                                },
                              );
                            })()
                          : undefined
                      }
                      reading={
                        isSimulating && circuitState.active.has(comp.id)
                          ? circuitState.readings[comp.id]
                          : undefined
                      }
                      hasAC={
                        isSimulating &&
                        elements.some(
                          (e) =>
                            e.type === "component" &&
                            (e as ComponentEntity).componentType ===
                              "ac_source",
                        )
                      }
                      broken={
                        isSimulating &&
                        circuitState.readings[comp.id] === "BROKEN!"
                      }
                      customProps={comp.customProps}
                      onUpdate={(updates) => updateElement(comp.id, updates)}
                    />

                    <Group x={0} y={-30} rotation={-comp.rotation}>
                      <Text
                        text={comp.name || ""}
                        fill="#9ca3af"
                        fontSize={12}
                        fontFamily="monospace"
                      />
                      {!!comp.value && (
                        <Text
                          text={comp.value}
                          y={14}
                          fill="#4ade80"
                          fontSize={12}
                          fontFamily="monospace"
                        />
                      )}
                    </Group>
                  </Group>
                );
              }

              if (el.type === "pcb_component") {
                const comp = el as PcbComponentEntity;

                let SymbolView;
                switch (comp.componentType) {
                  case "dip8":
                    SymbolView = PCBDIP8Symbol;
                    break;
                  case "smd":
                    SymbolView = PCBSMDSymbol;
                    break;
                  case "pad":
                    SymbolView = PCBPadSymbol;
                    break;
                  case "via":
                    SymbolView = PCBViaSymbol;
                    break;
                  case "sot23":
                    SymbolView = PCBSot23Symbol;
                    break;
                  case "to220":
                    SymbolView = PCBTo220Symbol;
                    break;
                  case "sop":
                    SymbolView = PCBSopSymbol;
                    break;
                  case "qfp":
                    SymbolView = PCBQfpSymbol;
                    break;
                  case "bga":
                    SymbolView = PCBBGASymbol;
                    break;
                  case "pinheader":
                    SymbolView = PCBPinHeaderSymbol;
                    break;
                  case "usb_c":
                    SymbolView = PCBUSBCSymbol;
                    break;
                  case "micro_usb":
                    SymbolView = PCBMicroUSBSymbol;
                    break;
                  case "cr2032":
                    SymbolView = PCBCR2032Symbol;
                    break;
                  case "ldr_smd":
                    SymbolView = PCBLDRSMDSymbol;
                    break;
                  case "ntc_smd":
                    SymbolView = PCBNTCSMDSymbol;
                    break;
                  case "crystal":
                    SymbolView = PCBCrystalSymbol;
                    break;
                  case "copper_pour":
                    SymbolView = PCBCopperPourSymbol;
                    break;
                  case "fiducial":
                    SymbolView = PCBFiducialSymbol;
                    break;
                  case "mounting_hole":
                    SymbolView = PCBMountingHoleSymbol;
                    break;
                  case "test_point":
                    SymbolView = PCBTestPointSymbol;
                    break;
                  case "silkscreen_text":
                    SymbolView = PCBSilkscreenTextSymbol;
                    break;
                  default:
                    {
                      const typeForSchematic = comp.componentType as any;
                      let InnerSymbol: any = PCBPadSymbol;
                      switch (typeForSchematic) {
                          case "resistor":
                            InnerSymbol = ResistorSymbol;
                            break;
                          case "capacitor":
                            InnerSymbol = CapacitorSymbol;
                            break;
                          case "capacitor_elec":
                            InnerSymbol = CapacitorElectrolyticSymbol;
                            break;
                          case "inductor":
                            InnerSymbol = InductorSymbol;
                            break;
                          case "diode":
                            InnerSymbol = DiodeSymbol;
                            break;
                          case "zener_diode":
                            InnerSymbol = ZenerDiodeSymbol;
                            break;
                          case "transistor":
                            InnerSymbol = TransistorSymbol;
                            break;
                          case "transistor_pnp":
                            InnerSymbol = TransistorPNPSymbol;
                            break;
                          case "mosfet":
                            InnerSymbol = MosfetSymbol;
                            break;
                          case "mosfet_p":
                            InnerSymbol = MosfetPSymbol;
                            break;
                          case "timer555":
                            InnerSymbol = Timer555Symbol;
                            break;
                          case "opamp":
                            InnerSymbol = OpampSymbol;
                            break;
                          case "logic_gate":
                          case "logic_and":
                          case "logic_or":
                          case "logic_nand":
                          case "logic_not":
                          case "logic_nor":
                          case "logic_xor":
                            InnerSymbol = LogicGateSymbol;
                            break;
                          case "ac_source":
                          case "dc_source":
                            InnerSymbol = ACSourceSymbol;
                            break;
                          case "switch":
                          case "pushbutton":
                            InnerSymbol = ACSourceSymbol; /* TODO */
                            break;
                          case "led":
                            InnerSymbol = ACSourceSymbol;
                            break;
                          case "lamp":
                            InnerSymbol = ACSourceSymbol;
                            break;
                          case "motor":
                          case "servo_motor":
                          case "stepper_motor":
                            InnerSymbol = MotorSymbol;
                            break;
                          case "buzzer":
                          case "speaker":
                            InnerSymbol = BuzzerSymbol;
                            break;
                          case "antenna":
                            InnerSymbol = ModuleSymbol;
                            break;
                          case "microphone":
                            InnerSymbol = ModuleSymbol;
                            break;
                          case "battery":
                            InnerSymbol = PowerSupplySymbol;
                            break;
                          case "voltmeter":
                          case "ammeter":
                          case "ohmmeter":
                          case "oscilloscope":
                          case "multimeter":
                          case "digital_multimeter":
                            InnerSymbol = VoltmeterSymbol;
                            break;
                          case "ldr":
                          case "photodiode":
                          case "thermistor":
                            InnerSymbol = ModuleSymbol;
                            break;
                          case "potentiometer":
                            InnerSymbol = PotentiometerSymbol;
                            break;
                          case "transformer":
                            InnerSymbol = ModuleSymbol;
                            break;
                          case "relay":
                            InnerSymbol = RelaySymbol;
                            break;
                          case "arduino_uno":
                          case "esp32":
                          case "esp32_cam":
                          case "raspberry_pi":
                          case "attiny85":
                          case "stm32_bluepill":
                            InnerSymbol = ICSymbol;
                            break;
                          case "ic":
                            InnerSymbol = ICSymbol;
                            break;
                          default:
                            InnerSymbol = PCBPadSymbol;
                      }

                      const PCBGenericSymbol = ({ x, y, rotation, selected, customProps, compName, componentType, layer, value }: any) => {
                          let w = 40, h = 40;
                          let cx = 0, cy = 0;
                          const pins = getPcbComponentPins({ componentType, name: compName, customProps });
                          
                          if (pins && pins.length > 0) {
                              const xs = pins.map((p: any) => p.x);
                              const ys = pins.map((p: any) => p.y);
                              // Include origin to ensure the symbol's main body is also bounded
                              xs.push(0);
                              ys.push(0);
                              const minX = Math.min(...xs);
                              const maxX = Math.max(...xs);
                              const minY = Math.min(...ys);
                              const maxY = Math.max(...ys);
                              w = (maxX - minX) + 20;
                              h = (maxY - minY) + 20;
                              cx = (minX + maxX) / 2;
                              cy = (minY + maxY) / 2;
                              if (w < 20) w = 20;
                              if (h < 20) h = 20;
                          }
                          const color = layer === "top" ? "#fbbf24" : "#60a5fa";
                          return (
                             <Group x={x} y={y} rotation={rotation} draggable={false}>
                                {/* Silkscreen outline */}
                                <Rect x={cx - w/2} y={cy - h/2} width={w} height={h} stroke="white" strokeWidth={1.5} />
                                {/* Pads exactly on the terminals */}
                                {pins && pins.map((p, i) => (
                                    <Group key={i} x={p.x} y={p.y}>
                                       <Circle radius={3} fill="#d4af37" />
                                       <Circle radius={1.5} fill="#0f0f13" />
                                    </Group>
                                ))}
                                {selected && <Rect x={cx - w/2 - 2} y={cy - h/2 - 2} width={w + 4} height={h + 4} stroke="#a78bfa" strokeWidth={2} dash={[4,4]} />}
                             </Group>
                          );
                      };
                      SymbolView = (props: any) => <PCBGenericSymbol {...props} compName={comp.name} componentType={comp.componentType} layer={comp.layer} value={comp.value} />;
                    }
                }

                let dimText = "";
                switch (comp.componentType) {
                  case "dip8": dimText = "L:9.5mm W:6.5mm"; break;
                  case "smd": dimText = "L:3.2mm W:1.6mm"; break;
                  case "sot23": dimText = "L:2.9mm W:1.3mm"; break;
                  case "to220": dimText = "L:10mm W:4.5mm"; break;
                  case "sop": dimText = "L:5mm W:6mm"; break;
                  case "qfp": dimText = "L:10mm W:10mm"; break;
                  case "bga": dimText = "L:12mm W:12mm"; break;
                  case "cr2032": dimText = "D:20mm"; break;
                  case "crystal": dimText = "L:11.5mm W:4.7mm"; break;
                  case "pad":
                  case "via":
                  case "mounting_hole":
                  case "test_point":
                  case "fiducial":
                    dimText = ""; break;
                  default: dimText = "L:- W:-"; break;
                }

                return (
                  <Group
                    key={el.id}
                    x={comp.x}
                    y={comp.y}
                    rotation={comp.rotation}
                    draggable={pcbTool === "select"}
                    onDragEnd={(e) => {
                      let newX = snapToGrid(e.target.x());
                      let newY = snapToGrid(e.target.y());
                      e.target.position({ x: newX, y: newY });
                      
                      const dx = newX - comp.x;
                      const dy = newY - comp.y;
                      const updates: {id: string, updates: any}[] = [{ id: comp.id, updates: { x: newX, y: newY } }];
                      pcbElements.forEach((p) => {
                         if (p.type === "pcb_component" && (p as any).customProps?.parentId === comp.id) {
                            updates.push({ id: p.id, updates: { x: (p as any).x + dx, y: (p as any).y + dy } });
                         }
                      });
                      updateElements(updates);

                      // Run auto-route professionally on component move
                      setTimeout(() => {
                        const currentPcbElements = pcbElements.map((el) => {
                          const u = updates.find((up) => up.id === el.id);
                          return u ? { ...el, ...u.updates } as any : el;
                        });
                        doAutoRoute(
                          elements,
                          currentPcbElements,
                          setPcbElements,
                          pinMap,
                          astarRoute,
                          uuidv4,
                        );
                      }, 50);
                    }}
                    onClick={(e) => {
                      if (pcbTool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(comp.id);
                      } else if (pcbTool === "select") {
                        e.cancelBubble = true;
                        setSelectedIds([comp.id]);
                      }
                    }}
                    onTap={(e) => {
                      if (pcbTool === "eraser") {
                        e.cancelBubble = true;
                        removeElement(comp.id);
                      } else if (pcbTool === "select") {
                        e.cancelBubble = true;
                        setSelectedIds([comp.id]);
                      }
                    }}
                  >
                    <SymbolView
                      x={0}
                      y={0}
                      rotation={0}
                      selected={isSelected}
                      layer={comp.layer}
                      value={comp.value}
                      customProps={comp.customProps}
                      onUpdate={(updates) => updateElement(comp.id, updates)}
                    />

                    <Group x={0} y={-30} rotation={-comp.rotation}>
                      <Text
                        text={comp.name || ""}
                        fill="#9ca3af"
                        fontSize={12}
                        fontFamily="monospace"
                      />
                    </Group>
                    {/* Precision Pads for PCB */}
                    {(getPcbComponentPins(comp)).map((p, idx) => (
                      <Group key={`pad-${idx}`} x={p.x} y={p.y}>
                        <Circle
                          radius={3}
                          fill={isSelected ? "#c084fc" : "#d4af37"}
                          stroke="#1e293b"
                          strokeWidth={1}
                        />
                        <Circle
                          radius={1.2}
                          fill="#0f172a"
                        />
                      </Group>
                    ))}
                  </Group>
                );
              }

              return null;
            })}

                        {mode === "pcb" && drcErrors.map((err, i) => (
              <Group key={`drc-${i}`} x={err.x} y={err.y}>
                 <Circle radius={6} stroke="yellow" strokeWidth={2} />
                 <Line points={[-4, -4, 4, 4]} stroke="yellow" strokeWidth={2} />
                 <Line points={[-4, 4, 4, -4]} stroke="yellow" strokeWidth={2} />
              </Group>
            ))}
            {junctionPoints.map((pt, idx) => (
              <Circle
                key={`junction-${idx}`}
                x={pt.x}
                y={pt.y}
                radius={3.5}
                fill="#008400"
              />
            ))}

            {wiring.active &&
              wiring.start &&
              wiring.current &&
              (() => {
                const obs = mode === "schematic" ? 
    elements.filter(el => el.type === "component").map(c => ({x: (c as any).x, y: (c as any).y, width: 40, height: 40})) 
  : (() => {
      // In PCB mode, gather components and traces for intelligent obstacle avoidance
      const comps = pcbElements.filter(el => el.type === "pcb_component").map(c => ({
         x: (c as any).x, y: (c as any).y, width: 20, height: 20
      }));
      const traceLines = [];
      pcbElements.filter(el => el.type === "trace" && (el as any).layer === activePcbLayer).forEach(t => {
         const pts = (t as any).points;
         if (pts && pts.length > 1) {
            for (let i = 0; i < pts.length - 1; i++) {
               traceLines.push({ p1: pts[i], p2: pts[i+1] });
            }
         }
      });
      (comps as any).traceLines = traceLines;
      return comps;
  })();

                 const pts = mode === "pcb" ? (smartWiring ? astarRoute(wiring.start!, wiring.current!, obs as any, 5, "pcb") : get45DegreePoints(wiring.start!, wiring.current!, wireDirection)) : getOrthogonalPoints(wiring.start!, wiring.current!, obs, wireDirection);
                return (
                  <Line
                    points={pts.flatMap((p) => [p.x, p.y])}
                    stroke={
                      mode === "pcb"
                        ? activePcbLayer === "top"
                          ? "#ef4444"
                          : "#3b82f6"
                        : activeWireColor
                    }
                    strokeWidth={mode === "pcb" ? 4 : 2}
                    dash={mode === "pcb" ? [] : [4, 4]}
                    opacity={mode === "pcb" ? 0.8 : 1}
                  />
                );
              })()}

            {activeTool === "probe" &&
              probePos &&
              isSimulating &&
              (() => {
                const ptId =
                  Math.round(probePos.x / 5) * 5 +
                  "," +
                  Math.round(probePos.y / 5) * 5;
                const volt = (circuitState as any).pointVoltages?.[ptId];

                return (
                  <Group x={probePos.x} y={probePos.y}>
                    <Line
                      points={[0, 0, 10, -10, 10, -30]}
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                    <Circle x={0} y={0} radius={4} fill="#f59e0b" />
                    <Rect
                      x={8}
                      y={-45}
                      width={40}
                      height={15}
                      fill="#111827"
                      cornerRadius={2}
                      stroke="#f59e0b"
                      strokeWidth={1}
                    />
                    <Text
                      x={10}
                      y={-41}
                      text={
                        volt !== undefined && !isNaN(volt) && isFinite(volt)
                          ? `${volt >= 1e-3 || volt === 0 ? volt.toFixed(2) : (volt * 1000).toFixed(2)} ${Math.abs(volt) < 1e-3 && volt !== 0 ? "mV" : "V"}`
                          : "N/C"
                      }
                      fill="#10b981"
                      fontSize={8}
                      fontFamily="monospace"
                      fontStyle="bold"
                    />
                  </Group>
                );
              })()}
          </Layer>
        </Stage>
      )}

      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center bg-[#1a1a1f] border border-[#2d2d33] rounded-md shadow-lg overflow-hidden pointer-events-auto">
        <button
          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d33] transition"
          title="Reduzir (Zoom Out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="px-2 w-14 text-center text-xs font-mono text-gray-300">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(Math.min(10, zoom + 0.1))}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2d2d33] transition"
          title="Ampliar (Zoom In)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
