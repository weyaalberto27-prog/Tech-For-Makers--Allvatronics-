import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

const oldVisual = `        } else if (comp.componentType === "relay" || comp.componentType === "relay_module") {
          const lastVolt = (window as any)._lastVoltages || {};
          const vC1 = lastVolt[pins[2]] || 0;
          const vC2 = lastVolt[pins[4]] || 0;
          if (Math.abs(vC1 - vC2) > 3.5) active.add(comp.id);`;

const newVisual = `        } else if (comp.componentType === "relay") {
          const lastVolt = (window as any)._lastVoltages || {};
          const vC1 = lastVolt[pins[2]] || 0;
          const vC2 = lastVolt[pins[4]] || 0;
          if (Math.abs(vC1 - vC2) > 3.5) active.add(comp.id);
        } else if (comp.componentType === "relay_module") {
          const lastVolt = (window as any)._lastVoltages || {};
          const vcc = lastVolt[pins[2]] || 0;
          const gnd = lastVolt[pins[1]] || 0;
          const vIn = lastVolt[pins[0]] || 0;
          if (vcc - gnd > 3.5 && vIn - gnd > 1.5) active.add(comp.id);`;

content = content.replace(oldVisual, newVisual);
fs.writeFileSync('src/lib/simulator.ts', content);
