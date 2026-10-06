import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const target = `export function LampSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
}: SymbolProps) {
  const lit = isOn || value === "1" || value === "true";`;

const replacement = `export function LampSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
  reading,
}: SymbolProps) {
  const isBroken = reading === "BROKEN!";
  const lit = !isBroken && (isOn || value === "1" || value === "true");`;

content = content.replace(target, replacement);

const targetFilament = `{/* Filament inside */}
      <Path
        data="M -6 15 L -6 0 L -3 -5 M 6 15 L 6 0 L 3 -5"
        stroke={lit ? "#eab308" : "#94a3b8"}
        strokeWidth={1.5}
        fill="transparent"
      />
      <Path
        data="M -3 -5 L -1 -8 L 1 -5 L 3 -8"
        stroke={lit ? "#ffffff" : "#64748b"}
        strokeWidth={1.5}
        fill="transparent"
        lineJoin="round"
      />`;

const replacementFilament = `{/* Filament inside */}
      <Path
        data="M -6 15 L -6 0 L -3 -5 M 6 15 L 6 0 L 3 -5"
        stroke={lit ? "#eab308" : isBroken ? "#1e293b" : "#94a3b8"}
        strokeWidth={1.5}
        fill="transparent"
      />
      {!isBroken && (
      <Path
        data="M -3 -5 L -1 -8 L 1 -5 L 3 -8"
        stroke={lit ? "#ffffff" : "#64748b"}
        strokeWidth={1.5}
        fill="transparent"
        lineJoin="round"
      />
      )}
      {isBroken && (
         <Path
          data="M -3 -5 L -2 -2 M 1 2 L 3 -8"
          stroke="#1e293b"
          strokeWidth={1.5}
          fill="transparent"
          lineJoin="round"
        />
      )}`;

content = content.replace(targetFilament, replacementFilament);

const targetGlass = `{/* Lightbulb Glass */}
      <Path
        data="M -15 -10 C -25 -30, 25 -30, 15 -10 C 10 5, 10 10, 10 15 L -10 15 C -10 10, -10 5, -15 -10 Z"
        fill={lit ? "#fde047" : "#f1f5f9"}
        opacity={lit ? 0.9 : 0.4}
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
      />`;

content = content.replace(targetGlass, replacementGlass);

fs.writeFileSync('src/components/Symbols.tsx', content, 'utf8');
console.log("Patched LampSymbol.");
