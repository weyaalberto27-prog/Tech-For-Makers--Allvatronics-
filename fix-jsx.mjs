import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf-8');
content = content.replace('      )}}', '      )}');
fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
console.log("Fixed JSX syntax error");
