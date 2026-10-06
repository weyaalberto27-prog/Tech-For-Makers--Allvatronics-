const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// I'll rewrite the start of DIP_IC3D
const regexDip = /function DIP_IC3D\(\{ pins, length, width, value, type, isPCB \}: \{ pins: number, length: number, width: number, value\?: string, type\?: string, isPCB\?: boolean \}\) \{[\s\S]*?const calcLength = \(pins \/ 2\) \* pinGap;/;
const newDip = `function DIP_IC3D({ pins, length, width, value, type, isPCB }: { pins: number, length: number, width: number, value?: string, type?: string, isPCB?: boolean }) {
  const isVertical = type === "attiny85" || type === "dip8";
  // Always use standard spacing (10 for pins distance, 30 for distance between rows for standard DIP)
  const pinGap = 10;
  const calcLength = (pins / 2) * pinGap;`;

code = code.replace(regexDip, newDip);
fs.writeFileSync('src/components/Meshes3D.tsx', code);
