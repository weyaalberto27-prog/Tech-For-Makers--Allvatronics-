import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

const oldRelay = `      } else if (comp.componentType === "relay" || comp.componentType === "relay_module") {
        const nNC = pointToNode.get(pins[0]);
        const nNO = pointToNode.get(pins[1]);
        const nCoil1 = pointToNode.get(pins[2]);
        const nCOM = pointToNode.get(pins[3]);
        const nCoil2 = pointToNode.get(pins[4]);

        if (nCoil1 !== undefined && nCoil2 !== undefined) {
          // Coil resistance
          resistors.push({ node1: nCoil1, node2: nCoil2, g: 0.014 }); // ~70 ohms for 5V relay

          const lastVolt = (window as any)._lastVoltages || {};
          const vC1 = lastVolt[pins[2]] || 0;
          const vC2 = lastVolt[pins[4]] || 0;

          // Activate if coil voltage > 3.5V
          const isActive = Math.abs(vC1 - vC2) > 3.5;

          if (nCOM !== undefined) {
            if (isActive && nNO !== undefined) {
              resistors.push({ node1: nCOM, node2: nNO, g: 10 }); // ~0.1 ohm closed
              if (nNC !== undefined)
                resistors.push({ node1: nCOM, node2: nNC, g: 1e-9 }); // open
            } else {
              if (nNC !== undefined)
                resistors.push({ node1: nCOM, node2: nNC, g: 10 }); // ~0.1 ohm closed
              if (nNO !== undefined)
                resistors.push({ node1: nCOM, node2: nNO, g: 1e-9 }); // open
            }
          }
        }`;

const newRelay = `      } else if (comp.componentType === "relay" || comp.componentType === "relay_module") {
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
        }`;

content = content.replace(oldRelay, newRelay);
fs.writeFileSync('src/lib/simulator.ts', content);
