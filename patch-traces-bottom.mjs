import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

const oldTraces = `                  const stableRandom =
                    ((safeId.charCodeAt(0) || 0) +
                      (safeId.charCodeAt(safeId.length - 1) || 0)) /
                    1000;
                  const yOffset = isTop
                    ? -1.18 + stableRandom
                    : -2.82 - stableRandom;`;

const newTraces = `                  const stableRandom =
                    ((safeId.charCodeAt(0) || 0) +
                      (safeId.charCodeAt(safeId.length - 1) || 0)) /
                    10000;
                  const yOffset = isTop
                    ? -1.175 + stableRandom
                    : -2.825 - stableRandom;`;

content = content.replace(oldTraces, newTraces);

const oldLight = `<pointLight position={[0, -200, 0]} intensity={0.4} color="#ffffff" />`;
const newLight = `<pointLight position={[0, -200, 0]} intensity={1.5} color="#ffffff" />\n          <directionalLight position={[0, -300, 0]} intensity={0.8} color="#e0f2fe" />`;

content = content.replace(oldLight, newLight);

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
