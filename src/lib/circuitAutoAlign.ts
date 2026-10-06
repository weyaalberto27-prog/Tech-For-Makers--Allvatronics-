import { Point, SchemaElement, ComponentEntity, WireEntity, PcbElement, PcbComponentEntity, TraceEntity, PcbBoardEntity } from "../types";
import { getComponentPins, getPcbComponentPins } from "./pinmap";
import { snapToGrid } from "./utils";

export interface CircuitAlignmentOptions {
  boardShape?: "rect" | "circle" | "triangle" | "custom";
  boardColor?: string;
  traceColor?: string;
  gridSnap?: number;
}

/**
 * Computes strictly orthogonal (Manhattan 90-degree) line points between two terminals.
 * Never allows diagonal lines across schematic symbols.
 */
export function getCleanOrthogonalWire(p1: Point, p2: Point, preferHorizontalFirst = true): Point[] {
  const pStart = { x: Math.round(p1.x), y: Math.round(p1.y) };
  const pEnd = { x: Math.round(p2.x), y: Math.round(p2.y) };

  // Already horizontal or vertical
  if (Math.abs(pStart.x - pEnd.x) < 3) {
    return [pStart, { x: pStart.x, y: pEnd.y }];
  }
  if (Math.abs(pStart.y - pEnd.y) < 3) {
    return [pStart, { x: pEnd.x, y: pStart.y }];
  }

  if (preferHorizontalFirst) {
    return [pStart, { x: pEnd.x, y: pStart.y }, pEnd];
  } else {
    return [pStart, { x: pStart.x, y: pEnd.y }, pEnd];
  }
}

/**
 * Computes professional 45-degree (octilinear chamfer) routing points for PCB copper traces.
 * Conforms to industry IPC PCB routing standards with mitred 45-degree bends.
 */
export function getProfessional45Trace(p1: Point, p2: Point): Point[] {
  const pStart = { x: Math.round(p1.x), y: Math.round(p1.y) };
  const pEnd = { x: Math.round(p2.x), y: Math.round(p2.y) };

  const dx = pEnd.x - pStart.x;
  const dy = pEnd.y - pStart.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // Directly aligned on horizontal or vertical
  if (absDx < 4) return [pStart, { x: pStart.x, y: pEnd.y }];
  if (absDy < 4) return [pStart, { x: pEnd.x, y: pStart.y }];

  // Already a clean 45-degree line
  if (Math.abs(absDx - absDy) < 4) {
    return [pStart, pEnd];
  }

  const sx = Math.sign(dx);
  const sy = Math.sign(dy);

  if (absDx > absDy) {
    // Chamfer 45-degree first, then horizontal run
    const chamferDist = absDy;
    const mid1 = {
      x: pStart.x + chamferDist * sx,
      y: pStart.y + chamferDist * sy,
    };
    return [pStart, mid1, pEnd];
  } else {
    // Chamfer 45-degree first, then vertical run
    const chamferDist = absDx;
    const mid1 = {
      x: pStart.x + chamferDist * sx,
      y: pStart.y + chamferDist * sy,
    };
    return [pStart, mid1, pEnd];
  }
}

/**
 * Categorizes a schematic component into functional circuit role for automated topological placement
 */
function getComponentCategory(type: string): "source" | "input" | "active" | "passive" | "load" | "ground" {
  const t = (type || "").toLowerCase();
  if (t === "ground") return "ground";
  if (t.includes("battery") || t.includes("power") || t.includes("source") || t.includes("usb")) return "source";
  if (t.includes("switch") || t.includes("button") || t.includes("potentiometer") || t.includes("key")) return "input";
  if (t.includes("arduino") || t.includes("esp") || t.includes("ic") || t.includes("timer") || t.includes("opamp") || t.includes("transistor") || t.includes("mosfet") || t.includes("gate")) return "active";
  if (t.includes("resistor") || t.includes("capacitor") || t.includes("diode") || t.includes("inductor")) return "passive";
  if (t.includes("lamp") || t.includes("led") || t.includes("buzzer") || t.includes("speaker") || t.includes("motor") || t.includes("oled") || t.includes("segment") || t.includes("relay")) return "load";
  return "passive";
}

/**
 * Checks if the converted schematic elements need topological layout (e.g. if they overlap,
 * are clustered at top-left, or are missing coordinates).
 */
function needsTopologicalLayout(components: ComponentEntity[]): boolean {
  if (components.length <= 1) return false;

  let hasZeroPos = false;
  let hasOverlap = false;

  for (let i = 0; i < components.length; i++) {
    const c1 = components[i];
    const x1 = c1.x ?? 0;
    const y1 = c1.y ?? 0;

    if (x1 < 60 || y1 < 60) {
      hasZeroPos = true;
      break;
    }

    for (let j = i + 1; j < components.length; j++) {
      const c2 = components[j];
      const x2 = c2.x ?? 0;
      const y2 = c2.y ?? 0;
      const dist = Math.hypot(x1 - x2, y1 - y2);
      if (dist < 65) {
        hasOverlap = true;
        break;
      }
    }
    if (hasOverlap) break;
  }

  return hasZeroPos || hasOverlap;
}

/**
 * Automatically places schematic components in a clean, professional, non-overlapping signal flow:
 * [Sources] -> [Switches/Inputs] -> [Active/Passives] -> [Loads/Outputs]
 * With return line along bottom.
 */
function applyTopologicalSchematicLayout(rawComponents: ComponentEntity[]): ComponentEntity[] {
  // Sort components into ordered signal flow
  const roleWeights: Record<string, number> = {
    source: 1,
    input: 2,
    active: 3,
    passive: 4,
    load: 5,
    ground: 6,
  };

  const sorted = [...rawComponents].sort((a, b) => {
    const rA = roleWeights[getComponentCategory(a.componentType)] || 3;
    const rB = roleWeights[getComponentCategory(b.componentType)] || 3;
    return rA - rB;
  });

  const sources = sorted.filter(c => getComponentCategory(c.componentType) === "source");
  const others = sorted.filter(c => getComponentCategory(c.componentType) !== "source");

  const result: ComponentEntity[] = [];

  // If there's a battery/source, place it at bottom-left or left
  let startX = 220;
  const mainY = 220;
  const returnY = 380;

  if (sources.length > 0) {
    sources.forEach((src) => {
      result.push({
        ...src,
        x: startX,
        y: returnY - 40,
        rotation: 0,
      });
    });
    startX += 130;
  }

  // Place inputs, active components, passives, and loads sequentially along the main rail
  others.forEach((comp) => {
    const cat = getComponentCategory(comp.componentType);
    let spacing = 140;
    if (cat === "passive") spacing = 120;
    if (cat === "load") spacing = 150;

    result.push({
      ...comp,
      x: snapToGrid(startX),
      y: snapToGrid(mainY),
      rotation: 0,
    });

    startX += spacing;
  });

  return result;
}

/**
 * Comprehensive alignment & auto-route engine for converted circuits (from Allva AI Photo Converter).
 * Fixes:
 *  1. Floating/disconnected schematic wires -> snaps directly to exact component pin terminals.
 *  2. Diagonal schematic wires -> forces 100% orthogonal 90-degree lines.
 *  3. Clumped/misaligned schematic components -> spaces them out and aligns to grid.
 *  4. PCB components floating outside the board -> recalculates board bounds to encompass all components with safe margins.
 *  5. PCB traces with crooked diagonals -> converts into professional 45-degree mitred traces snapped to pads.
 */
export function alignAndRouteConvertedCircuit(
  elements: SchemaElement[],
  pcbElements: PcbElement[],
  options: CircuitAlignmentOptions = {}
): { elements: SchemaElement[]; pcbElements: PcbElement[] } {
  const {
    boardShape = "rect",
    boardColor = "#105232",
    traceColor = "#eab308",
  } = options;

  // ==========================================
  // PART 1: SCHEMATIC ALIGNMENT & WIRE SNAPPING
  // ==========================================
  const rawComponents = elements.filter(
    (el): el is ComponentEntity => el.type === "component"
  );
  const rawWires = elements.filter(
    (el): el is WireEntity => el.type === "wire"
  );

  let alignedComponents: ComponentEntity[] = [];

  // Detect if components need complete topological layout or simple grid snapping
  if (needsTopologicalLayout(rawComponents)) {
    alignedComponents = applyTopologicalSchematicLayout(rawComponents);
  } else {
    // Normal grid snap & margin adjustment
    let minCompX = Infinity;
    let minCompY = Infinity;
    rawComponents.forEach((c) => {
      minCompX = Math.min(minCompX, c.x ?? 0);
      minCompY = Math.min(minCompY, c.y ?? 0);
    });

    const offsetX = minCompX < 120 ? 180 - minCompX : 0;
    const offsetY = minCompY < 120 ? 160 - minCompY : 0;

    alignedComponents = rawComponents.map((c) => {
      const x = snapToGrid((c.x || 0) + offsetX);
      const y = snapToGrid((c.y || 0) + offsetY);
      return {
        ...c,
        x,
        y,
        rotation: c.rotation || 0,
      };
    });
  }

  // Build a lookup table of world pin coordinates for every schematic component
  interface WorldPin {
    compId: string;
    compName: string;
    pinIndex: number;
    x: number;
    y: number;
  }
  const allWorldPins: WorldPin[] = [];
  alignedComponents.forEach((comp) => {
    const localPins = getComponentPins(comp);
    const rad = ((comp.rotation || 0) * Math.PI) / 180;
    localPins.forEach((p, idx) => {
      const wx = Math.round(comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad));
      const wy = Math.round(comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad));
      allWorldPins.push({
        compId: comp.id,
        compName: comp.name || comp.id,
        pinIndex: idx,
        x: wx,
        y: wy,
      });
    });
  });

  const findNearestPin = (pt: Point, maxDist = 90): WorldPin | null => {
    let nearest: WorldPin | null = null;
    let minDist = maxDist;
    for (const wp of allWorldPins) {
      const d = Math.hypot(wp.x - pt.x, wp.y - pt.y);
      if (d < minDist) {
        minDist = d;
        nearest = wp;
      }
    }
    return nearest;
  };

  // Process and align all wires orthogonally
  const alignedWires: WireEntity[] = [];
  const connectedPinPairs = new Set<string>();

  rawWires.forEach((w) => {
    if (!w.points || w.points.length < 2) return;
    const startRaw = w.points[0];
    const endRaw = w.points[w.points.length - 1];

    // Snap to nearest actual component pin
    const nearestStart = findNearestPin(startRaw);
    const nearestEnd = findNearestPin(endRaw);

    const pStart: Point = nearestStart
      ? { x: nearestStart.x, y: nearestStart.y }
      : { x: snapToGrid(startRaw.x), y: snapToGrid(startRaw.y) };
    const pEnd: Point = nearestEnd
      ? { x: nearestEnd.x, y: nearestEnd.y }
      : { x: snapToGrid(endRaw.x), y: snapToGrid(endRaw.y) };

    // Avoid zero-length wire
    if (pStart.x === pEnd.x && pStart.y === pEnd.y) return;

    if (nearestStart && nearestEnd) {
      const key1 = `${nearestStart.compId}_${nearestStart.pinIndex}-${nearestEnd.compId}_${nearestEnd.pinIndex}`;
      const key2 = `${nearestEnd.compId}_${nearestEnd.pinIndex}-${nearestStart.compId}_${nearestStart.pinIndex}`;
      if (connectedPinPairs.has(key1) || connectedPinPairs.has(key2)) return;
      connectedPinPairs.add(key1);
    }

    // Build orthogonal wire
    const orthogonalPoints = getCleanOrthogonalWire(
      pStart,
      pEnd,
      Math.abs(pEnd.x - pStart.x) >= Math.abs(pEnd.y - pStart.y)
    );
    alignedWires.push({
      ...w,
      points: orthogonalPoints,
      color: w.color || "#4ade80",
      width: w.width || 2,
    });
  });

  // If wires were missing or incomplete (e.g. AI did not generate wires, or layout was reset),
  // automatically create a pristine, closed circuit loop!
  if (alignedWires.length < alignedComponents.length - 1 && alignedComponents.length >= 2) {
    alignedWires.length = 0; // Fresh clean wiring

    // Separate power source and circuit chain
    const sourceComp = alignedComponents.find(c => getComponentCategory(c.componentType) === "source") || alignedComponents[0];
    const chainComps = alignedComponents.filter(c => c.id !== sourceComp.id);

    if (chainComps.length > 0) {
      const srcPins = getComponentPins(sourceComp);
      const srcRad = ((sourceComp.rotation || 0) * Math.PI) / 180;

      // Positive / Pin 0 world coordinate
      const srcPositive = {
        x: Math.round(sourceComp.x + (srcPins[0]?.x || 0) * Math.cos(srcRad) - (srcPins[0]?.y || 0) * Math.sin(srcRad)),
        y: Math.round(sourceComp.y + (srcPins[0]?.x || 0) * Math.sin(srcRad) + (srcPins[0]?.y || 0) * Math.cos(srcRad)),
      };

      // Negative / Return Pin (usually last pin, e.g. pin 1 for battery)
      const srcNegative = {
        x: Math.round(sourceComp.x + (srcPins[srcPins.length - 1]?.x || 0) * Math.cos(srcRad) - (srcPins[srcPins.length - 1]?.y || 0) * Math.sin(srcRad)),
        y: Math.round(sourceComp.y + (srcPins[srcPins.length - 1]?.x || 0) * Math.sin(srcRad) + (srcPins[srcPins.length - 1]?.y || 0) * Math.cos(srcRad)),
      };

      // 1. Source positive -> First chain component
      const firstComp = chainComps[0];
      const firstPins = getComponentPins(firstComp);
      const firstRad = ((firstComp.rotation || 0) * Math.PI) / 180;
      const firstIn = {
        x: Math.round(firstComp.x + (firstPins[0]?.x || 0) * Math.cos(firstRad) - (firstPins[0]?.y || 0) * Math.sin(firstRad)),
        y: Math.round(firstComp.y + (firstPins[0]?.x || 0) * Math.sin(firstRad) + (firstPins[0]?.y || 0) * Math.cos(firstRad)),
      };

      alignedWires.push({
        id: "auto_wire_start",
        type: "wire",
        points: getCleanOrthogonalWire(srcPositive, firstIn, false),
        color: "#4ade80",
        width: 2,
      });

      // 2. Cascade through chain components
      for (let i = 0; i < chainComps.length - 1; i++) {
        const c1 = chainComps[i];
        const c2 = chainComps[i + 1];
        const p1s = getComponentPins(c1);
        const p2s = getComponentPins(c2);
        const r1 = ((c1.rotation || 0) * Math.PI) / 180;
        const r2 = ((c2.rotation || 0) * Math.PI) / 180;

        const pOut = {
          x: Math.round(c1.x + (p1s[p1s.length - 1]?.x || 0) * Math.cos(r1) - (p1s[p1s.length - 1]?.y || 0) * Math.sin(r1)),
          y: Math.round(c1.y + (p1s[p1s.length - 1]?.x || 0) * Math.sin(r1) + (p1s[p1s.length - 1]?.y || 0) * Math.cos(r1)),
        };
        const pIn = {
          x: Math.round(c2.x + (p2s[0]?.x || 0) * Math.cos(r2) - (p2s[0]?.y || 0) * Math.sin(r2)),
          y: Math.round(c2.y + (p2s[0]?.x || 0) * Math.sin(r2) + (p2s[0]?.y || 0) * Math.cos(r2)),
        };

        alignedWires.push({
          id: `auto_wire_${i}`,
          type: "wire",
          points: getCleanOrthogonalWire(pOut, pIn, true),
          color: "#4ade80",
          width: 2,
        });
      }

      // 3. Last chain component -> Source negative (return loop along bottom)
      const lastComp = chainComps[chainComps.length - 1];
      const lastPins = getComponentPins(lastComp);
      const lastRad = ((lastComp.rotation || 0) * Math.PI) / 180;
      const lastOut = {
        x: Math.round(lastComp.x + (lastPins[lastPins.length - 1]?.x || 0) * Math.cos(lastRad) - (lastPins[lastPins.length - 1]?.y || 0) * Math.sin(lastRad)),
        y: Math.round(lastComp.y + (lastPins[lastPins.length - 1]?.x || 0) * Math.sin(lastRad) + (lastPins[lastPins.length - 1]?.y || 0) * Math.cos(lastRad)),
      };

      const returnRailY = Math.max(sourceComp.y + 40, 380);
      const returnPoints: Point[] = [
        lastOut,
        { x: lastOut.x, y: returnRailY },
        { x: srcNegative.x, y: returnRailY },
        srcNegative,
      ];

      alignedWires.push({
        id: "auto_wire_return",
        type: "wire",
        points: returnPoints,
        color: "#4ade80",
        width: 2,
      });
    }
  }

  // ==========================================
  // PART 2: PCB COMPONENTS ALIGNMENT & BOARD FRAMING
  // ==========================================
  const rawPcbComponents = pcbElements.filter(
    (el): el is PcbComponentEntity => el.type === "pcb_component"
  );
  const rawTraces = pcbElements.filter(
    (el): el is TraceEntity => el.type === "trace"
  );

  // Helper: map schematic component to appropriate PCB footprint
  const mapSchematicToPcbFootprint = (st: string): string => {
    const s = (st || "").toLowerCase();
    if (s.includes("arduino") || s.includes("esp") || s.includes("raspberry") || s.includes("header")) return "pinheader";
    if (s.includes("battery")) return "battery_9v";
    if (s.includes("lamp")) return "lamp";
    if (s.includes("switch") || s.includes("button")) return "switch";
    if (s.includes("ic") || s.includes("timer") || s.includes("opamp") || s.includes("attiny")) return "dip8";
    if (s.includes("transistor") || s.includes("mosfet")) return "to220";
    if (s.includes("oled")) return "oled";
    if (s.includes("seven_segment")) return "seven_segment";
    if (s.includes("usb_c")) return "usb_c";
    if (s.includes("micro_usb")) return "micro_usb";
    if (s.includes("buzzer") || s.includes("speaker")) return "buzzer";
    if (s.includes("potentiometer")) return "potentiometer";
    if (s.includes("gas")) return "gas_sensor_pcb";
    if (s.includes("accel")) return "accelerometer_pcb";
    if (s.includes("gps")) return "gps_pcb";
    if (s.includes("ultrasonic")) return "ultrasonic";
    return "pad";
  };

  const alignedPcbComponents: PcbComponentEntity[] = [];

  if (rawPcbComponents.length >= alignedComponents.length && rawPcbComponents.length > 0) {
    // PCB components provided - normalize and space out
    rawPcbComponents.forEach((pcbComp, idx) => {
      let compType = pcbComp.componentType;
      if (!compType || compType === "pad") {
        const matchingSch = alignedComponents.find(c => c.name === pcbComp.name || c.id === pcbComp.id);
        if (matchingSch) compType = mapSchematicToPcbFootprint(matchingSch.componentType) as any;
      }

      let x = snapToGrid(pcbComp.x || (240 + idx * 80));
      let y = snapToGrid(pcbComp.y || 240);

      if (x < 140) x += 180;
      if (y < 140) y += 160;

      alignedPcbComponents.push({
        ...pcbComp,
        x,
        y,
        rotation: pcbComp.rotation || 0,
        componentType: compType || "pad",
        layer: pcbComp.layer || "top",
      });
    });
  } else {
    // Generate PCB components directly synchronized with aligned schematic components
    let startX = 260;
    let startY = 240;

    alignedComponents.forEach((schComp, idx) => {
      const pcbType = mapSchematicToPcbFootprint(schComp.componentType);

      alignedPcbComponents.push({
        id: `pcb_${schComp.id || idx}`,
        type: "pcb_component",
        componentType: pcbType as any,
        name: schComp.name || `COMP_${idx + 1}`,
        value: schComp.value,
        x: startX,
        y: startY,
        rotation: 0,
        layer: "top",
      });

      startX += 110;
      if (startX > 640) {
        startX = 260;
        startY += 100;
      }
    });
  }

  // Ensure PCB components never overlap with each other
  for (let i = 0; i < alignedPcbComponents.length; i++) {
    for (let j = i + 1; j < alignedPcbComponents.length; j++) {
      const c1 = alignedPcbComponents[i];
      const c2 = alignedPcbComponents[j];
      const dist = Math.hypot(c1.x - c2.x, c1.y - c2.y);
      if (dist < 60) {
        c2.x = snapToGrid(c1.x + 80);
      }
    }
  }

  // ==========================================
  // PART 3: PCB TRACE ROUTING (45-Degree Octilinear)
  // ==========================================
  interface PcbWorldPin {
    compId: string;
    compName: string;
    pinIndex: number;
    x: number;
    y: number;
  }
  const allPcbPins: PcbWorldPin[] = [];
  alignedPcbComponents.forEach((comp) => {
    const localPins = getPcbComponentPins(comp);
    const rad = ((comp.rotation || 0) * Math.PI) / 180;
    localPins.forEach((p, idx) => {
      const wx = Math.round(comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad));
      const wy = Math.round(comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad));
      allPcbPins.push({
        compId: comp.id,
        compName: comp.name || comp.id,
        pinIndex: idx,
        x: wx,
        y: wy,
      });
    });
  });

  const findNearestPcbPin = (pt: Point, maxDist = 95): PcbWorldPin | null => {
    let nearest: PcbWorldPin | null = null;
    let minDist = maxDist;
    for (const wp of allPcbPins) {
      const d = Math.hypot(wp.x - pt.x, wp.y - pt.y);
      if (d < minDist) {
        minDist = d;
        nearest = wp;
      }
    }
    return nearest;
  };

  const alignedTraces: TraceEntity[] = [];

  if (rawTraces.length >= alignedPcbComponents.length - 1 && rawTraces.length > 0) {
    rawTraces.forEach((tr, i) => {
      if (!tr.points || tr.points.length < 2) return;
      const startRaw = tr.points[0];
      const endRaw = tr.points[tr.points.length - 1];

      const nearestStart = findNearestPcbPin(startRaw);
      const nearestEnd = findNearestPcbPin(endRaw);

      const pStart = nearestStart ? { x: nearestStart.x, y: nearestStart.y } : { x: snapToGrid(startRaw.x), y: snapToGrid(startRaw.y) };
      const pEnd = nearestEnd ? { x: nearestEnd.x, y: nearestEnd.y } : { x: snapToGrid(endRaw.x), y: snapToGrid(endRaw.y) };

      if (pStart.x === pEnd.x && pStart.y === pEnd.y) return;

      const tracePts = getProfessional45Trace(pStart, pEnd);
      alignedTraces.push({
        ...tr,
        points: tracePts,
        layer: tr.layer || (i % 2 === 0 ? "top" : "bottom"),
        width: tr.width || 3.5,
      });
    });
  } else if (alignedPcbComponents.length >= 2) {
    // Generate clean 45-degree traces connecting component pads
    for (let i = 0; i < alignedPcbComponents.length - 1; i++) {
      const c1 = alignedPcbComponents[i];
      const c2 = alignedPcbComponents[i + 1];
      const p1s = getPcbComponentPins(c1);
      const p2s = getPcbComponentPins(c2);
      const rad1 = ((c1.rotation || 0) * Math.PI) / 180;
      const rad2 = ((c2.rotation || 0) * Math.PI) / 180;

      const pt1 = {
        x: Math.round(c1.x + (p1s[p1s.length - 1]?.x || 0) * Math.cos(rad1) - (p1s[p1s.length - 1]?.y || 0) * Math.sin(rad1)),
        y: Math.round(c1.y + (p1s[p1s.length - 1]?.x || 0) * Math.sin(rad1) + (p1s[p1s.length - 1]?.y || 0) * Math.cos(rad1)),
      };
      const pt2 = {
        x: Math.round(c2.x + (p2s[0]?.x || 0) * Math.cos(rad2) - (p2s[0]?.y || 0) * Math.sin(rad2)),
        y: Math.round(c2.y + (p2s[0]?.x || 0) * Math.sin(rad2) + (p2s[0]?.y || 0) * Math.cos(rad2)),
      };

      alignedTraces.push({
        id: `auto_trace_${i}`,
        type: "trace",
        points: getProfessional45Trace(pt1, pt2),
        layer: i % 2 === 0 ? "top" : "bottom",
        width: 3.5,
      });
    }

    // Connect return trace from last component to first component (e.g. ground/negative return)
    if (alignedPcbComponents.length > 2) {
      const cLast = alignedPcbComponents[alignedPcbComponents.length - 1];
      const cFirst = alignedPcbComponents[0];
      const pLastPins = getPcbComponentPins(cLast);
      const pFirstPins = getPcbComponentPins(cFirst);
      const rLast = ((cLast.rotation || 0) * Math.PI) / 180;
      const rFirst = ((cFirst.rotation || 0) * Math.PI) / 180;

      const p1 = {
        x: Math.round(cLast.x + (pLastPins[pLastPins.length - 1]?.x || 0) * Math.cos(rLast) - (pLastPins[pLastPins.length - 1]?.y || 0) * Math.sin(rLast)),
        y: Math.round(cLast.y + (pLastPins[pLastPins.length - 1]?.x || 0) * Math.sin(rLast) + (pLastPins[pLastPins.length - 1]?.y || 0) * Math.cos(rLast)),
      };
      const p2 = {
        x: Math.round(cFirst.x + (pFirstPins[0]?.x || 0) * Math.cos(rFirst) - (pFirstPins[0]?.y || 0) * Math.sin(rFirst)),
        y: Math.round(cFirst.y + (pFirstPins[0]?.x || 0) * Math.sin(rFirst) + (pFirstPins[0]?.y || 0) * Math.cos(rFirst)),
      };

      alignedTraces.push({
        id: "auto_trace_return",
        type: "trace",
        points: getProfessional45Trace(p1, p2),
        layer: "bottom",
        width: 4,
      });
    }
  }

  // ==========================================
  // PART 4: DYNAMIC PCB BOARD ENCLOSURE (Guarantees components & traces are 100% inside!)
  // ==========================================
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  alignedPcbComponents.forEach((c) => {
    minX = Math.min(minX, c.x - 35);
    maxX = Math.max(maxX, c.x + 35);
    minY = Math.min(minY, c.y - 35);
    maxY = Math.max(maxY, c.y + 35);
  });

  alignedTraces.forEach((t) => {
    (t.points || []).forEach((p) => {
      minX = Math.min(minX, p.x - 15);
      maxX = Math.max(maxX, p.x + 15);
      minY = Math.min(minY, p.y - 15);
      maxY = Math.max(maxY, p.y + 15);
    });
  });

  if (minX === Infinity) {
    minX = 200; maxX = 680;
    minY = 160; maxY = 500;
  }

  const marginX = 55;
  const marginY = 50;
  const rawW = maxX - minX + marginX * 2;
  const rawH = maxY - minY + marginY * 2;

  let boardWidth = Math.max(420, Math.ceil(rawW / 20) * 20);
  let boardHeight = Math.max(300, Math.ceil(rawH / 20) * 20);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  let boardX = snapToGrid(centerX - boardWidth / 2);
  let boardY = snapToGrid(centerY - boardHeight / 2);

  if (boardShape === "circle") {
    const diameter = Math.max(boardWidth, boardHeight) + 60;
    boardWidth = diameter;
    boardHeight = diameter;
    boardX = snapToGrid(centerX - diameter / 2);
    boardY = snapToGrid(centerY - diameter / 2);
  } else if (boardShape === "triangle") {
    boardWidth = Math.max(boardWidth * 1.4, 480);
    boardHeight = Math.max(boardHeight * 1.4, 380);
    boardX = snapToGrid(centerX - boardWidth / 2);
    boardY = snapToGrid(centerY - boardHeight / 2);
  }

  // Ensure board and all enclosed items sit well within the viewport canvas
  const shiftX = boardX < 120 ? snapToGrid(140 - boardX) : 0;
  const shiftY = boardY < 100 ? snapToGrid(120 - boardY) : 0;

  if (shiftX !== 0 || shiftY !== 0) {
    boardX += shiftX;
    boardY += shiftY;
    alignedPcbComponents.forEach((c) => {
      c.x += shiftX;
      c.y += shiftY;
    });
    alignedTraces.forEach((t) => {
      (t.points || []).forEach((p) => {
        p.x += shiftX;
        p.y += shiftY;
      });
    });
  }

  const boardEntity: PcbBoardEntity = {
    id: "board_main",
    type: "board",
    x: boardX,
    y: boardY,
    width: boardWidth,
    height: boardHeight,
    boardShape: boardShape || "rect",
    boardColor: boardColor || "#105232",
    traceColor: traceColor || "#eab308",
  };

  const finalElements: SchemaElement[] = [...alignedComponents, ...alignedWires];
  const finalPcbElements: PcbElement[] = [boardEntity, ...alignedPcbComponents, ...alignedTraces];

  return {
    elements: finalElements,
    pcbElements: finalPcbElements,
  };
}
