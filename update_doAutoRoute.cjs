const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

const oldDoAutoRoute = /const doAutoRoute = \([\s\S]*?if \(!visited\.has\(node\)\) \{[\s\S]*?nets\.push\(net\);\s*\}\s*\}\s*\}/;

const newDoAutoRoute = `const doAutoRoute = (
  elements: any[],
  pcbElements: any[],
  setPcbElements: any,
  pinMap: any,
  astarRoute: any,
  uuidv4: any,
) => {
  const newPcbElements = [...pcbElements.filter((el) => el.type !== "trace")];
  const components = newPcbElements.filter(
    (el) => el.type === "pcb_component",
  ) as any[];
  
  if (components.length < 2) return;

  const { nets, compPins } = calculateNets(elements);
`;

content = content.replace(oldDoAutoRoute, newDoAutoRoute);
fs.writeFileSync("src/components/CanvasEditor.tsx", content);
