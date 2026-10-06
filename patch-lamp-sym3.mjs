import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const targetGlass = `{/* Lightbulb Glass */}
      <Path
        data="M -15 -10 C -25 -30, 25 -30, 15 -10 C 10 5, 10 10, 10 15 L -10 15 C -10 10, -10 5, -15 -10 Z"
        fill={isBroken ? "#1e293b" : (lit ? "#fde047" : "#f1f5f9")}
        opacity={isBroken ? 0.8 : (lit ? 0.9 : 0.4)}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        shadowColor="#fde047"
        shadowBlur={lit ? 25 : 0}
        shadowEnabled={lit}
      />`;

const replacementGlass = `{/* Lightbulb Glass */}
      <Path
        data="M -15 -10 C -25 -30, 25 -30, 15 -10 C 10 5, 10 10, 10 15 L -10 15 C -10 10, -10 5, -15 -10 Z"
        fill={isBroken ? "#1e293b" : (lit ? "#fde047" : "#f1f5f9")}
        opacity={isBroken ? 0.8 : (lit ? 0.9 : 0.4)}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        shadowColor="#fde047"
        shadowBlur={lit ? 25 : 0}
        shadowEnabled={lit}
      />
      {isBroken && (
        <Text
          text="💥"
          x={-7}
          y={-17}
          fontSize={14}
        />
      )}`;

content = content.replace(targetGlass, replacementGlass);
fs.writeFileSync('src/components/Symbols.tsx', content, 'utf8');
console.log("Patched LampSymbol with explosion.");
