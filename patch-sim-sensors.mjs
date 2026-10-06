import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

// 1. Remove gas_sensor from resistor block
content = content.replace(/\|\| comp.componentType === "gas_sensor"/g, '');
content = content.replace(/\['ldr', 'ntc', 'gas_sensor'\]/g, "['ldr', 'ntc']");

// 2. Add gas_sensor to the complex sensors block and fix VCC/GND pins
const oldSensorsBlock = `      } else if (['ultrasonic', 'dht11', 'hc05', 'esp8266', 'accelerometer', 'gps', 'motor_driver'].includes(comp.componentType)) {
          // Simplistic logic: active if VCC-GND > 2V
          const lastVolt = (window as any)._lastVoltages || {};
          const v1 = lastVolt[pins[0]] || 0;
          const v2 = lastVolt[pins[1]] || 0;
          if (Math.abs(v1 - v2) > 2) {
             active.add(comp.id);
          }`;

const newSensorsBlock = `      } else if (['ultrasonic', 'dht11', 'hc05', 'esp8266', 'accelerometer', 'gps', 'motor_driver', 'gas_sensor'].includes(comp.componentType)) {
          // Simplistic logic: active if VCC-GND > 2V
          const lastVolt = (window as any)._lastVoltages || {};
          let vccPin = 0;
          let gndPin = 1;
          
          if (comp.componentType === 'ultrasonic') { vccPin = 0; gndPin = 3; }
          else if (comp.componentType === 'dht11') { vccPin = 1; gndPin = 2; }
          else if (comp.componentType === 'hc05') { vccPin = 1; gndPin = 2; }
          else if (comp.componentType === 'accelerometer') { vccPin = 0; gndPin = 1; }
          else if (comp.componentType === 'gps') { vccPin = 0; gndPin = 3; }
          else if (comp.componentType === 'gas_sensor') { vccPin = 3; gndPin = 2; }
          else if (comp.componentType === 'motor_driver') { vccPin = 1; gndPin = 7; }

          const vcc = lastVolt[pins[vccPin]] || 0;
          const gnd = lastVolt[pins[gndPin]] || 0;
          
          if (comp.componentType === 'gas_sensor') {
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
          }`;

content = content.replace(oldSensorsBlock, newSensorsBlock);
fs.writeFileSync('src/lib/simulator.ts', content);
