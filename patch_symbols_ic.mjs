import fs from 'fs';

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

// Replace PCBDIP8Symbol
const dip8Regex = /export const PCBDIP8Symbol = \(\{ x, y, rotation, selected \}: SymbolProps\) => \{[\s\S]*?return \([\s\S]*?<\/Group>\s*\);\s*\};/;
content = content.replace(dip8Regex, `export const PCBDIP8Symbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 8;
  const pinGap = 5;
  const length = (pins / 2) * pinGap + pinGap;
  const halfLength = length / 2;
  const xs = Array.from({ length: pins / 2 }).map((_, i) => -halfLength + pinGap * (i + 1));
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-halfLength} y={-15} width={length} height={30} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={2} />
      <Path data="M -5 -15 A 5 5 0 0 0 5 -15" stroke="#4b5563" strokeWidth={1} />
      {xs.map((px) => (
        <Group key={"p1_"+px} x={px} y={-12}>
          <Rect x={-2.5} y={-2.5} width={5} height={5} fill="#fbbf24" cornerRadius={2.5} />
          <Circle radius={1.2} fill="#0f0f13" />
        </Group>
      ))}
      {xs.map((px) => (
        <Group key={"p2_"+px} x={px} y={12}>
          <Rect x={-2.5} y={-2.5} width={5} height={5} fill="#fbbf24" cornerRadius={2.5} />
          <Circle radius={1.2} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};`);

// Replace PCBSMDSymbol (which looks like SOP/SOIC)
const smdRegex = /export const PCBSMDSymbol = \(\{ x, y, rotation, selected \}: SymbolProps\) => \{[\s\S]*?return \([\s\S]*?<\/Group>\s*\);\s*\};/;
content = content.replace(smdRegex, `export const PCBSMDSymbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 8;
  const pinGap = 3;
  const length = (pins / 2) * pinGap + pinGap;
  const halfLength = length / 2;
  const xs = Array.from({ length: pins / 2 }).map((_, i) => -halfLength + pinGap * (i + 1));
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-halfLength} y={-10} width={length} height={20} fill="#111" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={1} />
      <Circle x={-halfLength + 3} y={-7} radius={1} fill="#555" />
      {xs.map((px) => (
        <Group key={"p1_"+px} x={px} y={-12}>
          <Rect x={-1.2} y={-2.5} width={2.4} height={5} fill="#e2e8f0" cornerRadius={0.5} />
        </Group>
      ))}
      {xs.map((px) => (
        <Group key={"p2_"+px} x={px} y={12}>
          <Rect x={-1.2} y={-2.5} width={2.4} height={5} fill="#e2e8f0" cornerRadius={0.5} />
        </Group>
      ))}
    </Group>
  );
};`);

// Replace PCBSopSymbol
const sopRegex = /export const PCBSopSymbol = \(\{ x, y, rotation, selected \}: SymbolProps\) => \{[\s\S]*?return \([\s\S]*?<\/Group>\s*\);\s*\};/;
content = content.replace(sopRegex, `export const PCBSopSymbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 8;
  const pinGap = 5;
  const length = (pins / 2) * pinGap + pinGap;
  const halfLength = length / 2;
  const ys = Array.from({ length: pins / 2 }).map((_, i) => -halfLength + pinGap * (i + 1));
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* IC Plastic Body */}
      <Rect x={-9} y={-halfLength} width={18} height={length} fill="#1e293b" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={1} />
      {/* Pin 1 polarity dot */}
      <Circle x={-5} y={-halfLength + 4} radius={1.2} fill="#94a3b8" />
      
      {/* Left side solder pads */}
      {ys.map((py, idx) => (
        <Group key={"left_"+idx} y={py}>
          <Rect x={-18} y={-1.2} width={6} height={2.4} fill="#cbd5e1" cornerRadius={0.5} />
          <Rect x={-13} y={-0.6} width={4} height={1.2} fill="#e2e8f0" />
        </Group>
      ))}

      {/* Right side solder pads */}
      {ys.map((py, idx) => (
        <Group key={"right_"+idx} y={py}>
          <Rect x={12} y={-1.2} width={6} height={2.4} fill="#cbd5e1" cornerRadius={0.5} />
          <Rect x={9} y={-0.6} width={4} height={1.2} fill="#e2e8f0" />
        </Group>
      ))}
    </Group>
  );
};`);

fs.writeFileSync('src/components/Symbols.tsx', content);
