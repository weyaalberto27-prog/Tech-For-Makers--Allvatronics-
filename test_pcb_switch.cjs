const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');
const start = content.indexOf('switch (comp.componentType) {');
console.log(content.substring(start, start + 3000));
