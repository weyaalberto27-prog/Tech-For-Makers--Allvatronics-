import fs from 'fs';
let content = fs.readFileSync('src/components/ProjectManager.tsx', 'utf8');

const t1 = `setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: '9V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'switch', name: 'SW1' }, { id: '3', type: 'component', x: 600, y: 200, rotation: 0, componentType: 'motor', name: 'M1' }, { id: '4', type: 'component', x: 400, y: 350, rotation: 0, componentType: 'transistor', name: 'Q1' }]);`;
const r1 = `setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: 'B1', value: '9V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'switch', name: 'SW1' }, { id: '3', type: 'component', x: 600, y: 200, rotation: 0, componentType: 'motor', name: 'M1' }, { id: '4', type: 'component', x: 400, y: 350, rotation: 0, componentType: 'transistor', name: 'Q1' }]);`;

const t2 = `setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: '3V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'resistor', name: 'R1' }, { id: '3', type: 'component', x: 550, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);`;
const r2 = `setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: 'B1', value: '3V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'resistor', name: 'R1' }, { id: '3', type: 'component', x: 550, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);`;

content = content.replace(t1, r1);
content = content.replace(t2, r2);

fs.writeFileSync('src/components/ProjectManager.tsx', content, 'utf8');
console.log("Patched ProjectManager.");
