const fs = require("fs");
let content = fs.readFileSync("src/store.tsx", "utf8");

content = content.replace(
  `        showPcbComponents, setShowPcbComponents,
        diffPairActive, setDiffPairActive,`,
  `        showPcbComponents, setShowPcbComponents,
        diffPairActive, setDiffPairActive,`
);
fs.writeFileSync("src/store.tsx", content);
