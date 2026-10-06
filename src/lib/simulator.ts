import { ComponentEntity, WireEntity, Point } from "../types";
import { getComponentPins } from "./pinmap";
import { mcuLabels } from "./mcu_pins";

function parseValue(val: string | undefined, defaultVal: number, isCapacitor: boolean = false): number {
  if (!val) return defaultVal;
  let s = val.toLowerCase().replace(",", ".");
  
  if (isCapacitor && /^\d{3}$/.test(s)) {
    const d1 = parseInt(s[0]);
    const d2 = parseInt(s[1]);
    const m = parseInt(s[2]);
    return (d1 * 10 + d2) * Math.pow(10, m) * 1e-12; // in Farads
  }
  
  let mult = 1;
  if (s.includes("k")) mult = 1e3;
  if (s.includes("m")) mult = 1e6;
  if (s.includes("u")) mult = 1e-6;
  if (s.includes("n")) mult = 1e-9;
  if (s.includes("p")) mult = 1e-12;
  s = s.replace(/[^0-9.-]/g, "");
  const num = parseFloat(s);
  if (isNaN(num)) return defaultVal;
  return num * mult;
}

export function formatSimValue(value: number, unit: string): string {
  const absVal = Math.abs(value);
  if (absVal < 1e-9) return `0.00 ${unit}`;
  if (absVal >= 1e6) return `${(value / 1e6).toFixed(2)} M${unit}`;
  if (absVal >= 1e3) return `${(value / 1e3).toFixed(2)} k${unit}`;
  if (absVal >= 1) return `${value.toFixed(2)} ${unit}`;
  if (absVal >= 1e-3) return `${(value * 1e3).toFixed(2)} m${unit}`;
  if (absVal >= 1e-6) return `${(value * 1e6).toFixed(2)} µ${unit}`;
  return `${(value * 1e9).toFixed(2)} n${unit}`;
}

export function solveLinearSystem(A: number[][], B: number[]): number[] | null {
  const n = B.length;
  const a = A.map((row) => [...row]);
  const b = [...B];

  for (let i = 0; i < n; i++) {
    let maxEl = Math.abs(a[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(a[k][i]) > maxEl) {
        maxEl = Math.abs(a[k][i]);
        maxRow = k;
      }
    }

    if (maxEl < 1e-12) continue; // Skip singular/near singular

    const tmp = a[maxRow];
    a[maxRow] = a[i];
    a[i] = tmp;
    const tmpB = b[maxRow];
    b[maxRow] = b[i];
    b[i] = tmpB;

    for (let k = i + 1; k < n; k++) {
      const c = -a[k][i] / a[i][i];
      for (let j = i; j < n; j++) {
        if (i === j) {
          a[k][j] = 0;
        } else {
          a[k][j] += c * a[i][j];
        }
      }
      b[k] += c * b[i];
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    if (Math.abs(a[i][i]) < 1e-12) {
      x[i] = 0;
      continue;
    }
    x[i] = b[i];
    for (let k = i + 1; k < n; k++) {
      x[i] -= a[i][k] * x[k];
    }
    x[i] /= a[i][i];
  }
  return x;
}

const pointId = (x: number, y: number) => `${Math.round(x / 5) * 5},${Math.round(y / 5) * 5}`;

export function simulateDC(
  elements: any[],
  pinMap: Record<string, Point[]>,
  t: number = 0,
) {
  const wireAdj = new Map<string, string[]>();
  const addWireEdge = (p1: Point, p2: Point) => {
    const id1 = pointId(p1.x, p1.y);
    const id2 = pointId(p2.x, p2.y);
    if (!wireAdj.has(id1)) wireAdj.set(id1, []);
    if (!wireAdj.has(id2)) wireAdj.set(id2, []);
    wireAdj.get(id1)!.push(id2);
    wireAdj.get(id2)!.push(id1);
  };

  const compPins = new Map<string, string[]>();
  const groundNodes = new Set<string>();

  elements.forEach((el) => {
    if (el.type === "wire") {
      const wire = el as WireEntity;
      if (Array.isArray(wire.points) && wire.points.length > 1) {
        for (let i = 0; i < wire.points.length - 1; i++) {
          addWireEdge(wire.points[i], wire.points[i + 1]);
        }
      }
    } else if (el.type === "component") {
      const comp = el as ComponentEntity;
      const localPins = getComponentPins(comp) || [{ x: 0, y: 0 }];
      const rad = (comp.rotation * Math.PI) / 180;
      const pins = localPins.map((p) => ({
        x: comp.x + p.x * Math.cos(rad) - p.y * Math.sin(rad),
        y: comp.y + p.x * Math.sin(rad) + p.y * Math.cos(rad),
      }));

      const ids = pins.map((p) => pointId(p.x, p.y));
      compPins.set(comp.id, ids);

      ids.forEach((id) => {
        if (!wireAdj.has(id)) wireAdj.set(id, []);
      });

      if (comp.componentType === "ground") {
        groundNodes.add(ids[0]);
      }
      if (comp.componentType === "protoboard") {
        for (let col = 0; col < 60; col++) {
          for (let row = 0; row < 4; row++) {
            addWireEdge(pins[col + row * 60], pins[col + (row + 1) * 60]);
            addWireEdge(pins[300 + col + row * 60], pins[300 + col + (row + 1) * 60]);
          }
        }
        const powerOffsets = [600, 660, 720, 780];
        for (const offset of powerOffsets) {
          for (let col = 0; col < 59; col++) {
            addWireEdge(pins[offset + col], pins[offset + col + 1]);
          }
        }
      }
    }
  });

  const gndArray = Array.from(groundNodes);
  for (let i = 0; i < gndArray.length - 1; i++) {
    const id1 = gndArray[i];
    const id2 = gndArray[i + 1];
    wireAdj.get(id1)!.push(id2);
    wireAdj.get(id2)!.push(id1);
  }

  const visited = new Set<string>();
  const nodeIds: string[][] = [];
  const pointToNode = new Map<string, number>();

  for (const [pt] of wireAdj.entries()) {
    if (!visited.has(pt)) {
      const currentGroup: string[] = [];
      const q = [pt];
      visited.add(pt);
      while (q.length > 0) {
        const curr = q.shift()!;
        currentGroup.push(curr);
        for (const neighbor of wireAdj.get(curr) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            q.push(neighbor);
          }
        }
      }
      const nodeIdx = nodeIds.length;
      nodeIds.push(currentGroup);
      currentGroup.forEach((p) => pointToNode.set(p, nodeIdx));
    }
  }

  const numNodes = nodeIds.length;
  if (numNodes === 0)
    return { readings: {}, active: new Set<string>(), hasShortCircuit: false };

  let gndNode = -1;
  for (const g of groundNodes) {
    if (pointToNode.has(g)) {
      gndNode = pointToNode.get(g)!;
      break;
    }
  }
  if (gndNode === -1) gndNode = 0; // Se não tiver ground explícito, usar nó 0 como referência.

  const vSources: {
    compId: string;
    node1: number;
    node2: number;
    v: number;
  }[] = [];
  const iSources: {
    compId: string;
    node1: number;
    node2: number;
    i: number;
  }[] = [];
  const resistors: { node1: number; node2: number; g: number }[] = [];
  const readings: Record<string, string> = {};
  const active = new Set<string>();

  const dt = 0.05; // 50ms time step for simulation update loop

  // Initialize transient state variables if they do not exist
  if (!(window as any)._brokenComponents) {
    (window as any)._brokenComponents = new Set<string>();
  }
  const brokenComponents = (window as any)._brokenComponents;

  if (!(window as any)._transientState) {
    (window as any)._transientState = { capVolts: {}, indCurrents: {} };
  }
  const tranState = (window as any)._transientState;

  elements.forEach((el) => {
    if (el.type === "component") {
      const comp = el as ComponentEntity;
      const pins = compPins.get(comp.id);
      if (!pins || pins.length < 2) return;

      if (comp.componentType === "potentiometer" && pins.length >= 3) {
        const totalR = parseValue(comp.value, 10000); // 10k default
        const setting = comp.customProps?.setting ?? 50;
        // Wiper is the 3rd pin (pins[2])
        const n1_pot = pointToNode.get(pins[0])!;
        const n2_pot = pointToNode.get(pins[1])!;
        const nWiper = pointToNode.get(pins[2])!;

        const r1 = Math.max(totalR * (setting / 100), 1e-3);
        const r2 = Math.max(totalR * ((100 - setting) / 100), 1e-3);

        if (n1_pot !== undefined && nWiper !== undefined)
          resistors.push({ node1: n1_pot, node2: nWiper, g: 1 / r1 });
        if (n2_pot !== undefined && nWiper !== undefined)
          resistors.push({ node1: nWiper, node2: n2_pot, g: 1 / r2 });
        return;
      }

      const n1 = pointToNode.get(pins[0])!;
      const n2 = pointToNode.get(pins[1])!;

      if (
        ["arduino_uno", "esp32", "esp32s3", "esp32_cam", "raspberry_pi", "attiny85", "stm32_bluepill", "esp8266"].includes(
          comp.componentType,
        )
      ) {
        const labels = mcuLabels[comp.componentType];
        const wMcuPinsMap = (window as any).mcu_pins_map;
        const wMcuPins = wMcuPinsMap ? wMcuPinsMap[comp.id] : null;

        for (let i = 0; i < pins.length; i++) {
          const nodeMcu = pointToNode.get(pins[i]);
          if (nodeMcu !== undefined) {
             const lbl = labels ? labels[i] : null;
             let isPowerPin = false;

             // Hardcoded default voltages for power pins
             if (lbl === "GND" || lbl === "GND1" || lbl === "GND2") {
                resistors.push({ node1: nodeMcu, node2: gndNode, g: 1e6 }); // Strong short to ground
                isPowerPin = true;
             } else if (lbl === "5V" || (lbl === "VIN" && comp.componentType === 'arduino_uno') || (lbl === "VCC" && comp.componentType === 'attiny85')) {
                vSources.push({
                   compId: comp.id + "_5V_" + i,
                   node1: nodeMcu,
                   node2: gndNode,
                   v: 5.0,
                });
                isPowerPin = true;
             } else if (lbl === "3V3" || lbl === "3.3V") {
                vSources.push({
                   compId: comp.id + "_3V3_" + i,
                   node1: nodeMcu,
                   node2: gndNode,
                   v: 3.3,
                });
                isPowerPin = true;
             } else if (lbl === "VCC" || lbl === "VDD") {
                const volt = ["esp32", "esp32s3", "esp32_cam", "stm32_bluepill", "esp8266"].includes(comp.componentType) ? 3.3 : 5.0;
                vSources.push({
                   compId: comp.id + "_VCC_" + i,
                   node1: nodeMcu,
                   node2: gndNode,
                   v: volt,
                });
                isPowerPin = true;
             } else if (lbl === "VIN") {
                const volt = ["esp32", "esp32s3", "esp32_cam", "esp8266"].includes(comp.componentType) ? 5.0 : 5.0;
                vSources.push({
                   compId: comp.id + "_VIN_" + i,
                   node1: nodeMcu,
                   node2: gndNode,
                   v: volt,
                });
                isPowerPin = true;
             }

             // Handle dynamic states set by code execution
             if (wMcuPins) {
                const volt = wMcuPins[i];
                if (volt !== undefined && volt !== null && !isPowerPin) {
                  vSources.push({
                    compId: comp.id + "_pin_" + i,
                    node1: nodeMcu,
                    node2: gndNode,
                    v: volt,
                  });
                } else if (!isPowerPin) {
                  resistors.push({ node1: nodeMcu, node2: gndNode, g: 1e-6 }); 
                }
             } else if (!isPowerPin) {
                resistors.push({ node1: nodeMcu, node2: gndNode, g: 1e-6 }); 
             }
          }
        }
        return;
      }
      if (comp.componentType === "resistor" || comp.componentType === "ldr" || comp.componentType === "ntc" ) {
        let r = parseValue(comp.value, 1000);
          if (['ldr', 'ntc'].includes(comp.componentType)) {
             const env = comp.customProps?.envValue ?? 50;
             // 0% -> 100k, 100% -> 100 ohms (log scale approximation)
             r = 100 + (100 - env) * 1000; 
          } // 1k ohm por defeito
        resistors.push({ node1: n1, node2: n2, g: 1 / Math.max(r, 1e-3) });
      } else if (
        comp.componentType === "capacitor" ||
        comp.componentType === "capacitor_elec"
      ) {
        const c = parseValue(comp.value, 1e-6, true); // default 1uF
        const gc = c / dt;
        const vPrev = tranState.capVolts[comp.id] || 0;
        resistors.push({ node1: n1, node2: n2, g: gc });
        iSources.push({ compId: comp.id, node1: n1, node2: n2, i: gc * vPrev });
      } else if (comp.componentType === "inductor") {
        const L = parseValue(comp.value, 1e-3); // default 1mH
        const gl = dt / L;
        const iPrev = tranState.indCurrents[comp.id] || 0;
        resistors.push({ node1: n1, node2: n2, g: gl });
        iSources.push({ compId: comp.id, node1: n1, node2: n2, i: -iPrev });
      } else if (
        comp.componentType === "battery" || comp.componentType === "battery_9v" || comp.componentType === "cr2032" ||
        comp.componentType === "powersupply" ||
        comp.componentType === "ac_source" ||
        comp.componentType === "usb_c" ||
        comp.componentType === "micro_usb"
      ) {
        const vStr = comp.value
          ? comp.value.replace("V", "")
          : comp.componentType === "ac_source"
            ? "220"
            : comp.componentType === "battery" || comp.componentType === "battery_9v" ? "9"
              : comp.componentType === "cr2032" ? "3" : "5";
        let v = parseValue(vStr, 5);
        if (comp.componentType === "ac_source") {
          const f = 1; // 1 Hz for visual display
          v = v * Math.sin(2 * Math.PI * f * t);
        }

        if (n1 === n2) {
          readings[comp.id] = "SHORT!";
        } else {
          if (comp.componentType === "battery" || comp.componentType === "battery_9v") {
            // The battery symbol has + on the left (pins[0]) and - on the right (pins[1])
            vSources.push({ compId: comp.id, node1: n1, node2: n2, v: v });
          } else {
            vSources.push({ compId: comp.id, node1: n1, node2: n2, v: v });
          }
        }
      } else if (['ultrasonic', 'dht11', 'hc05', 'esp8266', 'accelerometer', 'gps', 'motor_driver', 'gas_sensor', 'accelerometer_pcb', 'gps_pcb', 'gas_sensor_pcb'].includes(comp.componentType)) {
          // Simplistic logic: active if VCC-GND > 2V
          const lastVolt = (window as any)._lastVoltages || {};
          let vccPin = 0;
          let gndPin = 1;
          
          if (comp.componentType === 'ultrasonic') { vccPin = 0; gndPin = 3; }
          else if (comp.componentType === 'dht11') { vccPin = 1; gndPin = 2; }
          else if (comp.componentType === 'hc05') { vccPin = 1; gndPin = 2; }
          else if (comp.componentType === 'accelerometer' || comp.componentType === 'accelerometer_pcb') { vccPin = 0; gndPin = 1; }
          else if (comp.componentType === 'gps' || comp.componentType === 'gps_pcb') { vccPin = 0; gndPin = 3; }
          else if (comp.componentType === 'gas_sensor' || comp.componentType === 'gas_sensor_pcb') { vccPin = 3; gndPin = 2; }
          else if (comp.componentType === 'motor_driver') { vccPin = 14; gndPin = 15; }

          const vcc = lastVolt[pins[vccPin]] || 0;
          const gnd = lastVolt[pins[gndPin]] || 0;
          
          if (comp.componentType === 'gas_sensor' || comp.componentType === 'gas_sensor_pcb') {
             const nAout = pointToNode.get(pins[0]);
             const nGnd = pointToNode.get(pins[2]);
             const nVcc = pointToNode.get(pins[3]);
             if (nAout !== undefined && nGnd !== undefined && nVcc !== undefined) {
                const env = comp.customProps?.envValue ?? 0;
                const outV = gnd + (vcc - gnd) * (env / 100);
                vSources.push({ compId: comp.id + "_aout", node1: nAout, node2: nGnd, v: outV });
                resistors.push({ node1: nVcc, node2: nGnd, g: 1 / 30 }); // ~30 ohms heater
             }
          }
          
          if (Math.abs(vcc - gnd) > 2) {
             active.add(comp.id);
          }
        } else if (comp.componentType.startsWith("logic_")) {
          const lastVolt = (window as any)._lastVoltages || {};
          const vcc = lastVolt[pins[13]] || 0;
          const gnd = lastVolt[pins[6]] || 0;
          const isPowered = vcc > 3 && gnd < 1;
          const threshold = vcc > 3 ? vcc / 2 : 2.5;

          if (comp.componentType === "logic_not") {
            const hexInverters = [
              { a: 0, y: 1 },
              { a: 2, y: 3 },
              { a: 4, y: 5 },
              { a: 8, y: 7 },
              { a: 10, y: 9 },
              { a: 12, y: 11 }
            ];

            hexInverters.forEach((gate, i) => {
              const nA = pointToNode.get(pins[gate.a]);
              const nY = pointToNode.get(pins[gate.y]);

              if (nA !== undefined) resistors.push({ node1: nA, node2: gndNode, g: 1e-6 });

              if (nA !== undefined && nY !== undefined) {
                let stateA = (lastVolt[pins[gate.a]] || 0) > threshold;
                let outState = !stateA;
                
                if (isPowered) {
                  const outNodeGnd = pointToNode.get(pins[6]) !== undefined ? pointToNode.get(pins[6])! : gndNode;
                  vSources.push({
                    compId: comp.id + "_inv_" + i,
                    node1: nY,
                    node2: outNodeGnd,
                    v: outState ? (vcc - gnd) : 0,
                  });
                } else {
                  resistors.push({ node1: nY, node2: gndNode, g: 1e-6 });
                }
              }
            });
          } else {
            // Quad 2-input logic gates (74xx series - 14 pins)
            let gates = [
              { a: 0, b: 1, y: 2 },
              { a: 3, b: 4, y: 5 },
              { a: 8, b: 9, y: 7 },
              { a: 11, b: 12, y: 10 }
            ];

            if (comp.componentType === "logic_nor") {
              // 7402 NOR gate has different pinout
              gates = [
                { y: 0, a: 1, b: 2 },
                { y: 3, a: 4, b: 5 },
                { a: 7, b: 8, y: 9 },
                { a: 10, b: 11, y: 12 }
              ];
            }
            
            gates.forEach((gate, i) => {
              const nA = pointToNode.get(pins[gate.a]);
              const nB = pointToNode.get(pins[gate.b]);
              const nY = pointToNode.get(pins[gate.y]);

              if (nA !== undefined) resistors.push({ node1: nA, node2: gndNode, g: 1e-6 });
              if (nB !== undefined) resistors.push({ node1: nB, node2: gndNode, g: 1e-6 });

              if (nA !== undefined && nB !== undefined && nY !== undefined) {
                let stateA = (lastVolt[pins[gate.a]] || 0) > threshold;
                let stateB = (lastVolt[pins[gate.b]] || 0) > threshold;

                let outState = false;
                if (comp.componentType === "logic_and") outState = stateA && stateB;
                else if (comp.componentType === "logic_or") outState = stateA || stateB;
                else if (comp.componentType === "logic_nand") outState = !(stateA && stateB);
                else if (comp.componentType === "logic_nor") outState = !(stateA || stateB);
                else if (comp.componentType === "logic_xor") outState = stateA !== stateB;
                
                if (isPowered) {
                  const outNodeGnd = pointToNode.get(pins[6]) !== undefined ? pointToNode.get(pins[6])! : gndNode;
                  vSources.push({
                    compId: comp.id + "_gate_" + i,
                    node1: nY,
                    node2: outNodeGnd,
                    v: outState ? (vcc - gnd) : 0,
                  });
                } else {
                  resistors.push({ node1: nY, node2: gndNode, g: 1e-6 });
                }
              }
            });
        }
      } else if (comp.componentType === "digital_multimeter") {
        const mode = comp.customProps?.dmmMode || "DCV";
        if (mode === "DCA" || mode === "ACA") {
           vSources.push({ compId: comp.id, node1: n1, node2: n2, v: 0 }); // ammeter
        } else if (mode === "RES") {
           iSources.push({ compId: comp.id, node1: n1, node2: n2, i: 1e-3 });
           resistors.push({ node1: n1, node2: n2, g: 1e-7 }); 
        } else {
           resistors.push({ node1: n1, node2: n2, g: 1e-7 }); 
        }
      } else if (comp.componentType === "voltmeter" || comp.componentType === "oscilloscope") {
        resistors.push({ node1: n1, node2: n2, g: 1e-7 }); 
      } else if (comp.componentType === "ammeter") {
        vSources.push({ compId: comp.id, node1: n1, node2: n2, v: 0 }); // fonte 0V para medir corrente
      } else if (comp.componentType === "switch") {
        const isClosed = comp.customProps?.closed;
        resistors.push({ node1: n1, node2: n2, g: isClosed ? 1 : 1e-9 }); // 1 ohm or 1000 Mohm
      } else if (comp.componentType === "transistor") {
        const nC = pointToNode.get(pins[0]);
        const nB = pointToNode.get(pins[1]);
        const nE = pointToNode.get(pins[2]);
        if (nC !== undefined && nB !== undefined && nE !== undefined) {
          const lastVolt = (window as any)._lastVoltages || {};
          const vB = lastVolt[pins[1]] || 0;
          const vE = lastVolt[pins[2]] || 0;
          const vBE = vB - vE;

          let rCE = 1e6;
          if (vBE > 0.65) {
            rCE = 5;
            active.add(comp.id);
          }

          resistors.push({ node1: nC, node2: nE, g: 1 / rCE });
          let rBE = vBE > 0.6 ? 100 : 1e6;
          resistors.push({ node1: nB, node2: nE, g: 1 / rBE });
        }
      } else if (comp.componentType === "transistor_pnp") {
        const nC = pointToNode.get(pins[0]);
        const nB = pointToNode.get(pins[1]);
        const nE = pointToNode.get(pins[2]);
        if (nC !== undefined && nB !== undefined && nE !== undefined) {
          const lastVolt = (window as any)._lastVoltages || {};
          const vB = lastVolt[pins[1]] || 0;
          const vE = lastVolt[pins[2]] || 0;
          const vEB = vE - vB;

          let rCE = 1e6;
          if (vEB > 0.65) {
            rCE = 5;
            active.add(comp.id);
          }

          resistors.push({ node1: nC, node2: nE, g: 1 / rCE });
          let rEB = vEB > 0.6 ? 100 : 1e6;
          resistors.push({ node1: nE, node2: nB, g: 1 / rEB });
        }
      } else if (
        comp.componentType === "mosfet" ||
        comp.componentType === "mosfet_p"
      ) {
        const nG = pointToNode.get(pins[0]);
        const nD = pointToNode.get(pins[1]);
        const nS = pointToNode.get(pins[2]);
        if (nG !== undefined && nD !== undefined && nS !== undefined) {
          const lastVolt = (window as any)._lastVoltages || {};
          const vG = lastVolt[pins[0]] || 0;
          const vS = lastVolt[pins[2]] || 0;

          let rDS = 1e6;
          if (comp.componentType === "mosfet") {
            // N-CH
            if (vG - vS > 2.5) rDS = 0.1;
          } else {
            // P-CH
            if (vS - vG > 2.5) rDS = 0.1;
          }

          if (rDS < 1) active.add(comp.id);
          resistors.push({ node1: nD, node2: nS, g: 1 / rDS });
          resistors.push({ node1: nG, node2: nS, g: 1e-9 }); // gate impedance 1000M
        }
      } else if (comp.componentType === "opamp") {
        // LM358 (Dual OpAmp, 8 pins)
        // Pin 1 (0): 1OUT, Pin 2 (1): 1IN-, Pin 3 (2): 1IN+
        // Pin 4 (3): GND/VEE
        // Pin 5 (4): 2IN+, Pin 6 (5): 2IN-, Pin 7 (6): 2OUT
        // Pin 8 (7): VCC
        
        const lastVolt = (window as any)._lastVoltages || {};
        const vcc = lastVolt[pins[7]] || 0;
        const vee = lastVolt[pins[3]] || 0;

        const opamps = [
          { inPos: 2, inNeg: 1, out: 0 },
          { inPos: 4, inNeg: 5, out: 6 }
        ];

        opamps.forEach((op, i) => {
          const nInPos = pointToNode.get(pins[op.inPos]);
          const nInNeg = pointToNode.get(pins[op.inNeg]);
          const nOut = pointToNode.get(pins[op.out]);

          if (nInPos !== undefined) resistors.push({ node1: nInPos, node2: gndNode, g: 1e-6 });
          if (nInNeg !== undefined) resistors.push({ node1: nInNeg, node2: gndNode, g: 1e-6 });

          if (nInPos !== undefined && nInNeg !== undefined && nOut !== undefined) {
            const vInPos = lastVolt[pins[op.inPos]] || 0;
            const vInNeg = lastVolt[pins[op.inNeg]] || 0;

            let vDiff = vInPos - vInNeg;
            let vOutTarget = vDiff * 1e5; // Open loop gain

            // Clamp to rails (LM358 output can go to GND, but maxes out at VCC - 1.5V)
            if (vOutTarget > vcc - 1.5) vOutTarget = vcc - 1.5;
            if (vOutTarget < vee) vOutTarget = vee;

            vSources.push({
              compId: comp.id + "_amp_" + i,
              node1: nOut,
              node2: gndNode,
              v: vOutTarget,
            });
          }
        });
      } else if (comp.componentType === "timer555") {
        // Pins: 1: GND(0), 2: TRIG(1), 3: OUT(2), 4: RESET(3), 5: CTRL(4), 6: THR(5), 7: DISCH(6), 8: VCC(7)
        const nTrig = pointToNode.get(pins[1]);
        const nOut = pointToNode.get(pins[2]);
        const nThr = pointToNode.get(pins[5]);
        const nDisch = pointToNode.get(pins[6]);
        
        if (nOut !== undefined && nTrig !== undefined && nThr !== undefined && nDisch !== undefined) {
          const lastVolt = (window as any)._lastVoltages || {};
          const vcc = lastVolt[pins[7]] || 5;
          const vTrig = lastVolt[pins[1]] || 0;
          const vThr = lastVolt[pins[5]] || 0;
          const vReset = lastVolt[pins[3]] !== undefined ? lastVolt[pins[3]] : vcc;

          // High impedance inputs
          if (nTrig !== undefined) resistors.push({ node1: nTrig, node2: gndNode, g: 1e-6 });
          if (nThr !== undefined) resistors.push({ node1: nThr, node2: gndNode, g: 1e-6 });

          if (!(window as any)._timer555State) (window as any)._timer555State = {};
          let state = (window as any)._timer555State[comp.id] || false;

          // Flip-flop logic
          if (vReset < 0.7) {
            state = false;
          } else {
            if (vTrig < vcc / 3) {
              state = true;
            } else if (vThr > (2 * vcc) / 3) {
              state = false;
            }
          }
          (window as any)._timer555State[comp.id] = state;

          // Output (Pin 3)
          vSources.push({
            compId: comp.id,
            node1: nOut,
            node2: gndNode,
            v: state ? Math.max(0, vcc - 1.2) : 0.1, // Approximate output logic levels
          });

          // Discharge transistor (Pin 7)
          if (!state) {
            // Closed to ground
            resistors.push({ node1: nDisch, node2: gndNode, g: 0.1 }); // ~10 ohms
          } else {
            // Open string
            resistors.push({ node1: nDisch, node2: gndNode, g: 1e-9 });
          }
        }
      } else if (comp.componentType === "seven_segment") {
        const comNode = pointToNode.get(pins[2]); // We'll just use top-middle as COM
        const segmentPins = [0, 1, 3, 4, 5, 6, 8, 9];
        if (comNode !== undefined) {
          segmentPins.forEach((pIdx) => {
            const sNode = pointToNode.get(pins[pIdx]);
            if (sNode !== undefined) {
              resistors.push({ node1: sNode, node2: comNode, g: 0.05 }); // ~20 ohm per LED segment
            }
          });
        }
      } else if (comp.componentType === "oled") {
        const nVcc = pointToNode.get(pins[1]);
        const nGnd = pointToNode.get(pins[0]);
        if (nVcc !== undefined && nGnd !== undefined) {
          resistors.push({ node1: nVcc, node2: nGnd, g: 0.001 }); // ~1k ohm load
        }
      } else if (
        comp.componentType === "diode" || comp.componentType === "zener_diode" ||
        comp.componentType === "led"
      ) {
        let threshold = comp.componentType === "led" ? 1.8 : 0.6;
        if (comp.componentType === "led") {
          const c = (comp.customProps?.color || "").toLowerCase();
          if (c === "green") threshold = 2.2;
          else if (c === "blue" || c === "white") threshold = 3.0;
          else if (c === "yellow") threshold = 2.1;
        }

        const breakdown = comp.componentType === "led" ? -5.0 : -50.0; 

        const lastVolt = (window as any)._lastVoltages || {};
        const vA = lastVolt[pins[0]] || 0;
        const vK = lastVolt[pins[1]] || 0;
        const vD = vA - vK;
        
        let rD = 1e9;
        let vTh = 0;
        if (vD > threshold) {
          rD = 10; // Forward biased
          vTh = threshold;
        } else if (vD < breakdown) {
          rD = 5; // Reverse breakdown (Zener effect / Avalanche)
          vTh = breakdown;
        }

        resistors.push({ node1: n1, node2: n2, g: 1 / rD });
        if (vTh !== 0) {
          iSources.push({ compId: comp.id, node1: n1, node2: n2, i: vTh / rD });
        }
      } else if (comp.componentType === "lamp") {
        const nominalV = parseValue(comp.value, 220);
        // Assuming ~100W lamp -> R = V^2 / P. We use a generic conductance based on nominal voltage.
        const r = (nominalV * nominalV) / 100;
        resistors.push({ node1: n1, node2: n2, g: 1 / Math.max(r, 1) });
      } else if (["motor", "buzzer"].includes(comp.componentType)) {
        resistors.push({ node1: n1, node2: n2, g: 0.01 }); // ~100 ohm
      } else if (comp.componentType === "servo_motor") {
        const nSig = pointToNode.get(pins[0]);
        const nVCC = pointToNode.get(pins[1]);
        const nGnd = pointToNode.get(pins[2]);
        if (nVCC !== undefined && nGnd !== undefined) {
          resistors.push({ node1: nVCC, node2: nGnd, g: 0.005 }); // ~200 ohm power load
        }
        if (nSig !== undefined && nGnd !== undefined) {
          resistors.push({ node1: nSig, node2: nGnd, g: 1e-5 }); // 100k input impedance
        }
      } else if (comp.componentType === "relay" || comp.componentType === "relay_module") {
        let nNC, nNO, nCoil1, nCOM, nCoil2, nIN, nGnd, nVcc;
        let isActive = false;
        const lastVolt = (window as any)._lastVoltages || {};

        if (comp.componentType === "relay") {
            nNC = pointToNode.get(pins[0]);
            nNO = pointToNode.get(pins[1]);
            nCoil1 = pointToNode.get(pins[2]);
            nCOM = pointToNode.get(pins[3]);
            nCoil2 = pointToNode.get(pins[4]);
            
            if (nCoil1 !== undefined && nCoil2 !== undefined) {
               resistors.push({ node1: nCoil1, node2: nCoil2, g: 0.014 });
               const vC1 = lastVolt[pins[2]] || 0;
               const vC2 = lastVolt[pins[4]] || 0;
               isActive = Math.abs(vC1 - vC2) > 3.5;
            }
        } else {
            nIN = pointToNode.get(pins[0]);
            nGnd = pointToNode.get(pins[1]);
            nVcc = pointToNode.get(pins[2]);
            nNO = pointToNode.get(pins[3]);
            nCOM = pointToNode.get(pins[4]);
            nNC = pointToNode.get(pins[5]);

            if (nVcc !== undefined && nGnd !== undefined) {
               resistors.push({ node1: nVcc, node2: nGnd, g: 0.005 }); // Module power consumption
               const vcc = lastVolt[pins[2]] || 0;
               const gnd = lastVolt[pins[1]] || 0;
               const vIn = lastVolt[pins[0]] || 0;
               
               if (nIN !== undefined) {
                   resistors.push({ node1: nIN, node2: nGnd, g: 1e-5 }); // Input impedance
               }
               
               if (vcc - gnd > 3.5 && vIn - gnd > 1.5) {
                   isActive = true;
               }
            }
        }

        if (nCOM !== undefined) {
          if (isActive) {
            if (nNO !== undefined) resistors.push({ node1: nCOM, node2: nNO, g: 10 });
            if (nNC !== undefined) resistors.push({ node1: nCOM, node2: nNC, g: 1e-9 });
          } else {
            if (nNC !== undefined) resistors.push({ node1: nCOM, node2: nNC, g: 10 });
            if (nNO !== undefined) resistors.push({ node1: nCOM, node2: nNO, g: 1e-9 });
          }
        }
    }
    }
  });

  const numVars = numNodes + vSources.length;
  const A: number[][] = Array(numVars)
    .fill(0)
    .map(() => Array(numVars).fill(0));
  const B: number[] = Array(numVars).fill(0);

  // Apply resistors
  resistors.forEach((r) => {
    A[r.node1][r.node1] += r.g;
    A[r.node2][r.node2] += r.g;
    A[r.node1][r.node2] -= r.g;
    A[r.node2][r.node1] -= r.g;
  });

  // Add GMIN to prevent singular matrix for floating nodes
  for (let i = 0; i < numNodes; i++) {
    A[i][i] += 1e-9;
  }

  // Apply voltage sources
  vSources.forEach((vs, idx) => {
    const k = numNodes + idx;
    A[vs.node1][k] += 1;
    A[k][vs.node1] += 1;
    A[vs.node2][k] -= 1;
    A[k][vs.node2] -= 1;
    B[k] = vs.v;
  });

  // Apply current sources
  iSources.forEach((is) => {
    B[is.node1] += is.i;
    B[is.node2] -= is.i;
  });

  // Ground constraint
  for (let j = 0; j < numVars; j++) A[gndNode][j] = 0;
  A[gndNode][gndNode] = 1;
  B[gndNode] = 0;

  const x = solveLinearSystem(A, B);
  let hasShortCircuit = false;

  const pointVoltages: Record<string, number> = {};
  if (x) {
    for (const [pt, nodeIdx] of pointToNode.entries()) {
      pointVoltages[pt] = x[nodeIdx];
    }
    elements.forEach((el) => {
      if (el.type === "component") {
        const comp = el as ComponentEntity;
        const pins = compPins.get(comp.id);
        if (!pins || pins.length < 2) return;
        const n1 = pointToNode.get(pins[0])!;
        const n2 = pointToNode.get(pins[1])!;

        const vDiff = x[n1] - x[n2];

        // Update transient states
        if (
          comp.componentType === "capacitor" ||
          comp.componentType === "capacitor_elec"
        ) {
          tranState.capVolts[comp.id] = vDiff;
          const maxV = comp.componentType === "capacitor_elec" ? 16 : 50;
          if (Math.abs(vDiff) > maxV) {
             readings[comp.id] = "BROKEN!";
          }
        } else if (comp.componentType === "transistor" || comp.componentType === "transistor_pnp" || comp.componentType === "mosfet" || comp.componentType === "mosfet_p") {
          const n3 = pins.length >= 3 ? pointToNode.get(pins[2]) : undefined;
          if (n3 !== undefined) {
             const v1 = x[n1] || 0;
             const v2 = x[n2] || 0;
             const v3 = x[n3] || 0;
             const maxV = 45;
             if (Math.abs(v1 - v2) > maxV || Math.abs(v1 - v3) > maxV || Math.abs(v2 - v3) > maxV) {
                readings[comp.id] = "BROKEN!";
             }
          }
        } else if (comp.componentType === "inductor") {
          const l = parseValue(comp.value, 1e-3);
          const iPrev = tranState.indCurrents[comp.id] || 0;
          tranState.indCurrents[comp.id] = iPrev + (dt / l) * vDiff;
        }

        if (comp.componentType === "resistor") {
          const r = parseValue(comp.value, 1000);
          const power = (vDiff * vDiff) / Math.max(r, 1e-3);
          const maxPower =
            comp.customProps?.maxPower !== undefined
              ? comp.customProps.maxPower
              : 0.25; // default 1/4W
          if (power > maxPower) {
            readings[comp.id] = "BROKEN!";
          }
        } else if (comp.componentType === "relay") {
          const lastVolt = (window as any)._lastVoltages || {};
          const vC1 = lastVolt[pins[2]] || 0;
          const vC2 = lastVolt[pins[4]] || 0;
          if (Math.abs(vC1 - vC2) > 3.5) active.add(comp.id);
        } else if (comp.componentType === "relay_module") {
          const lastVolt = (window as any)._lastVoltages || {};
          const vcc = lastVolt[pins[2]] || 0;
          const gnd = lastVolt[pins[1]] || 0;
          const vIn = lastVolt[pins[0]] || 0;
          if (vcc - gnd > 3.5 && vIn - gnd > 1.5) active.add(comp.id);
        } else if (comp.componentType === "digital_multimeter") {
          const mode = comp.customProps?.dmmMode || "DCV";
          let val = 0;
          if (mode === "DCA" || mode === "ACA") {
            const vsIdx = vSources.findIndex((vs) => vs.compId === comp.id);
            if (vsIdx >= 0) val = x[numNodes + vsIdx];
          } else if (mode === "RES") {
            val = Math.abs(vDiff / 1e-3);
          } else {
            val = vDiff;
          }
          // Simple raw value for now, we will format it in the Symbol component for 2D/3D
          readings[comp.id] = val.toString();
          active.add(comp.id);
        } else if (
          comp.componentType === "voltmeter" ||
          comp.componentType === "oscilloscope"
        ) {
          readings[comp.id] = formatSimValue(vDiff, "V");
          active.add(comp.id);
        } else if (comp.componentType.startsWith("logic_")) {
          // Logic is now stateless and relies on _lastVoltages
        } else if (comp.componentType === "ammeter") {
          const vsIdx = vSources.findIndex((vs) => vs.compId === comp.id);
          if (vsIdx >= 0) {
            const current = x[numNodes + vsIdx];
            readings[comp.id] = formatSimValue(current, "A");
            active.add(comp.id);
          }
        } else if (comp.componentType === "servo_motor") {
          const nSig = pointToNode.get(pins[0]);
          const nGnd = pointToNode.get(pins[2]);
          if (nSig !== undefined && nGnd !== undefined) {
            const vSig = x[nSig] || 0;
            const vGnd = x[nGnd] || 0;
            const vDiff = vSig - vGnd;
            // Interpolate: 0V -> 0 deg, 5V -> 180 deg
            const angle = Math.max(0, Math.min(180, Math.round((vDiff / 5) * 180)));
            readings[comp.id] = `${angle}°`;
            active.add(comp.id);
          }
        } else if (
          comp.componentType === "battery" || comp.componentType === "battery_9v" || comp.componentType === "cr2032" ||
          comp.componentType === "powersupply" ||
          comp.componentType === "ac_source" ||
          comp.componentType === "usb_c" ||
          comp.componentType === "micro_usb"
        ) {
          const vsIdx = vSources.findIndex((vs) => vs.compId === comp.id);
          if (vsIdx >= 0) {
            const current = x[numNodes + vsIdx];
            const maxI = comp.customProps?.currentLimit ?? 2;
            if (Math.abs(current) > maxI) hasShortCircuit = true;
            // Record real-time current for screen visual output
            readings[comp.id] = formatSimValue(Math.abs(current), "A");
            active.add(comp.id);
          } else if (readings[comp.id] === "SHORT!") {
            hasShortCircuit = true;
          }
        } else if (
          ["led", "diode", "zener_diode", "motor", "buzzer", "lamp", "stepper_motor"].includes(
            comp.componentType,
          )
        ) {
          let hasACConnected = false;
          vSources.forEach((vs) => {
            const sourceComp = elements.find(
              (e) => e.id === vs.compId,
            ) as ComponentEntity;
            if (sourceComp && sourceComp.componentType === "ac_source") {
              hasACConnected = true; // Simple heuristic: if there's an AC source, assume it's AC powered if voltage is high enough
            }
          });

          if (comp.componentType === "led" || comp.componentType === "diode" || comp.componentType === "zener_diode") {
            const vA = x[n1] || 0;
            const vK = x[n2] || 0;
            const vD = vA - vK;
            
            let threshold = comp.componentType === "led" ? 1.8 : 0.6;
            if (comp.componentType === "led") {
              const c = (comp.customProps?.color || "").toLowerCase();
              if (c === "green") threshold = 2.2;
              else if (c === "blue" || c === "white") threshold = 3.0;
              else if (c === "yellow") threshold = 2.1;
            }
            if (vD > threshold + 0.01 && vD <= threshold + 0.4) {
               active.add(comp.id);
            } else if (comp.componentType === "led" && (vD > threshold + 0.4 || vD < -5.5)) {
               readings[comp.id] = "BROKEN!";
            } else if ((comp.componentType === "diode" || comp.componentType === "zener_diode") && vD > threshold + 0.01) {
               active.add(comp.id); // Diodes handle more current generically
            }
          } else if (comp.componentType === "lamp") {
            if (brokenComponents.has(comp.id)) {
              readings[comp.id] = "BROKEN!";
              return;
            }
            const nominalV = parseValue(comp.value, 220);
            const burnoutV = comp.customProps?.burnoutVoltage ? parseValue(comp.customProps.burnoutVoltage, nominalV * 1.5) : nominalV * 1.2;
            if (Math.abs(vDiff) > burnoutV) {
              readings[comp.id] = "BROKEN!";
              brokenComponents.add(comp.id);
            } else if (Math.abs(vDiff) >= nominalV * 0.05) {
              active.add(comp.id);
              readings[comp.id] = `${(Math.abs(vDiff) / nominalV).toFixed(2)}`;
            } else {
              readings[comp.id] = "0";
            }
          } else {
            if (
              vDiff >= 0.1 ||
              (!["diode", "zener_diode"].includes(comp.componentType) &&
                Math.abs(vDiff) >= 0.1)
            ) {
              active.add(comp.id);
            }
          }
        }
      }
    });
  }

  (window as any)._lastVoltages = pointVoltages;
  (window as any)._circuitReadings = readings;
  return { readings, active, hasShortCircuit, pointVoltages };
}
