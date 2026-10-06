const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasViewer3D.tsx", "utf8");

const holesRegex = /\{\(\(\) => \{\s*const st = boardEl\?\.boardShape \|\| "rect";\s*const w = boardShape\.width;\s*const h = boardShape\.height;\s*const holes = \[\];[\s\S]*?return holes\.map\(\(pos, idx\) => \([\s\S]*?<\/mesh>\s*\)\);\s*\}\)\(\)\}/;

content = content.replace(holesRegex, "");
fs.writeFileSync("src/components/CanvasViewer3D.tsx", content);
