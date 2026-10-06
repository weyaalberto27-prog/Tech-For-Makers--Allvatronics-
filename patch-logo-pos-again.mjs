import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

content = content.replace(
  'let lx = boardShape.width / 2 - 25;\n                   let lz = boardShape.height / 2 - 25;',
  'let lx = boardShape.width / 2 - 40;\n                   let lz = boardShape.height / 2 - 40;'
);

content = content.replace(
  'lx = (boardShape.width / 2 - 25) * Math.cos(Math.PI/4);\n                     lz = (boardShape.height / 2 - 25) * Math.sin(Math.PI/4);',
  'lx = (boardShape.width / 2 - 40) * Math.cos(Math.PI/4);\n                     lz = (boardShape.height / 2 - 40) * Math.sin(Math.PI/4);'
);

content = content.replace(
  'lx = 0;\n                     lz = boardShape.height / 2 - 25;',
  'lx = 0;\n                     lz = boardShape.height / 2 - 40;'
);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
