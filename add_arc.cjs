const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");
content = content.replace(
  `import { Stage, Layer, Circle, Line, Text, Group, Rect, Ellipse, Path } from "react-konva";`,
  `import { Stage, Layer, Circle, Line, Text, Group, Rect, Ellipse, Path, Arc } from "react-konva";`
);
fs.writeFileSync("src/components/CanvasEditor.tsx", content);
