const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

content = content.replace(
  `boardTheme,
    isSimulating,
    activeWireColor,
  } = useEditor();`,
  `boardTheme,
    isSimulating,
    activeWireColor,
    smartWiring,
    diffPairActive,
  } = useEditor();`
);

fs.writeFileSync("src/components/CanvasEditor.tsx", content);
