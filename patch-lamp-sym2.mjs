import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const target = `export function LampSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
  reading,
}: SymbolProps) {
  const isBroken = reading === "BROKEN!";`;

const replacement = `export function LampSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
  reading,
  broken,
}: SymbolProps) {
  const isBroken = broken || reading === "BROKEN!";`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Symbols.tsx', content, 'utf8');
console.log("Patched LampSymbol with broken prop.");
