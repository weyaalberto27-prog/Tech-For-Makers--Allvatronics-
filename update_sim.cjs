const fs = require('fs');

let code = fs.readFileSync('src/lib/simulator.ts', 'utf8');

// 1. Add import for mcuLabels
if (!code.includes("mcuLabels")) {
    code = code.replace(
        'import { getComponentPins } from "./pinmap";',
        'import { getComponentPins } from "./pinmap";\nimport { mcuLabels } from "./mcu_pins";'
    );
}

// 2. Find the MCU block
const regex = /if\s*\(\s*\["arduino_uno",\s*"esp32",\s*"esp32s3",\s*"esp32_cam",\s*"raspberry_pi",\s*"attiny85",\s*"stm32_bluepill",\s*"esp8266"\]\.includes\(\s*comp\.componentType,?\s*\)\s*\)\s*\{\s*const wMcuPinsMap = \(window as any\)\.mcu_pins_map;\s*if\s*\(wMcuPinsMap\)\s*\{[\s\S]*?\}\s*\}\s*return;\s*\}/;

const replacement = `if (
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
      }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/lib/simulator.ts', code);
console.log('simulator.ts updated');
