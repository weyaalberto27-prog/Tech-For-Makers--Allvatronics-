const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

content = content.replace(
  `    <Group ref={groupRef} x={board.x} y={board.y}>`,
  `    <Group ref={groupRef} x={0} y={0}>`
);

content = content.replace(
  `{mode === "pcb" && pcbElements.filter((p: any) => p.type === 'pcb_component' && p.componentType === 'copper_pour').map((cp: any) => (`,
  `// test` // just a fake replace to see if it works, actually we haven't added it to CanvasEditor yet!
);
fs.writeFileSync("src/components/CanvasEditor.tsx", content);
