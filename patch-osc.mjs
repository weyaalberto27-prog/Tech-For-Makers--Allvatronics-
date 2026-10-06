import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

content = content.replace(/\} else if \(comp\.componentType === "oscilloscope"\) \{\s*resistors\.push\(\{ node1: n1, node2: n2, g: 1e-6 \}\);\s*\}/, '');
content = content.replace(/comp\.componentType === "voltmeter" \|\| comp\.componentType === "oscilloscope" \|\|/g, 'comp.componentType === "voltmeter" ||');

fs.writeFileSync('src/lib/simulator.ts', content);
