const fs = require("fs");
let content = fs.readFileSync("src/store.tsx", "utf8");

content = content.replace(
  `  const [showPcbComponents, setShowPcbComponents] = useState(true);`,
  `  const [showPcbComponents, setShowPcbComponents] = useState(true);\n  const [diffPairActive, setDiffPairActive] = useState(false);`
);

fs.writeFileSync("src/store.tsx", content);
