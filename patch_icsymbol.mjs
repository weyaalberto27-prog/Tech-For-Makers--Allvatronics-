import fs from 'fs';

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const icRegex = /export const ICSymbol = \(\{ x, y, rotation, selected, value \}: SymbolProps\) => \{[\s\S]*?<\/Group>\s*\);\s*\};/;
content = content.replace(icRegex, `export const ICSymbol = ({ x, y, rotation, selected, value, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 14;
  const pinGap = 10;
  const length = (pins / 2) * pinGap + pinGap;
  const halfLength = length / 2;
  const xs = Array.from({ length: pins / 2 }).map((_, i) => -halfLength + pinGap * (i + 1));
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* IC Body (Horizontal) */}
      <Rect
        x={-halfLength}
        y={-16}
        width={length}
        height={32}
        fill="#222"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={2}
      />
      <Circle x={-halfLength + 8} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data={\`M \${-halfLength} -4 A 4 4 0 0 0 \${-halfLength} 4\`} fill="#111" />
      <Text text={value || "IC"} x={-halfLength + 15} y={-2} fontSize={7} fill="#ccc" />

      {/* Bottom pins */}
      {xs.map((px, i) => (
        <Group key={"B" + i}>
          <Rect x={px - 2} y={16} width={4} height={6} fill="#bcc2c2" />
          <Circle
            x={px}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
        </Group>
      ))}

      {/* Top pins */}
      {xs.map((px, i) => (
        <Group key={"T" + i}>
          <Rect x={px - 2} y={-22} width={4} height={6} fill="#bcc2c2" />
          <Circle
            x={px}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
        </Group>
      ))}
    </Group>
  );
};`);

fs.writeFileSync('src/components/Symbols.tsx', content);
