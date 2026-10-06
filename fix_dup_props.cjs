const fs = require('fs');
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

// I need to replace:
// layer: "top",
// customProps: comp.customProps,
// customProps: { parentId: compId }
// with:
// layer: "top",
// customProps: { parentId: compId, ...comp.customProps }

content = content.replace(/customProps: comp.customProps,\n\s*customProps: \{ parentId: compId \}/g, 'customProps: { parentId: compId, ...comp.customProps }');

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
