const fs = require("fs");
let content = fs.readFileSync("src/components/AllvaCreator.tsx", "utf8");

content = content.replace(
  `  // Fake Simulation Loop for UI Feedback
  useEffect(() => {
    const handleOpenFootprint = () => setShowFootprintEditor(true);
    window.addEventListener("open-footprint-editor", handleOpenFootprint);
    return () => window.removeEventListener("open-footprint-editor", handleOpenFootprint);
  }, []);
  
  useEffect(() => {`,
  `  // Fake Simulation Loop for UI Feedback
  useEffect(() => {`
);

content = content.replace(
  `import { FootprintEditor } from "./FootprintEditor";`,
  ``
);

fs.writeFileSync("src/components/AllvaCreator.tsx", content);
