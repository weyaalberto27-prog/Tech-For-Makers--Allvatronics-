import { Group, Rect, Circle, Line, Text, Path, Ellipse, Arc, Shape } from "react-konva";
import Konva from "konva";
import React from "react";

export interface SymbolProps {
  onUpdate?: (updates: any) => void;

  customProps?: any;
  x: number;
  y: number;
  rotation: number;
  selected?: boolean;
  value?: string;
  isOn?: boolean;
  reading?: string;
  broken?: boolean;
  hasAC?: boolean;
  voltages?: Record<string, number> | number[];
}

const color = "#840000";
const pinColor = "#008484";
const textColor = "#000084";
const selectedColor = "#008400";

export function getCapacitorCode(value: string | undefined): string {
  if (!value) return "104";
  const match = value.match(/^([\d.]+)\s*(p|n|u|m)?(?:[fF])?$/);
  if (!match) return value;
  let val = parseFloat(match[1]);
  const multStr = match[2];
  let multiplier = 1; // pf
  if (multStr === "n") multiplier = 1000;
  if (multStr === "u") multiplier = 1000000;
  if (multStr === "m") multiplier = 1000000000;
  let pf = val * multiplier;
  if (pf < 10) return Math.floor(pf).toString();
  let exp = 0;
  while (pf >= 100 && exp < 9) { pf /= 10; exp++; }
  const digit12 = Math.floor(pf);
  return `${digit12}${exp}`;
}

export function getResistorColors(value: string | undefined): string[] {
  let v = value ? value.toUpperCase().replace(/,/g, ".") : "150";
  
  let ohms = 150;
  const match = v.match(/^([0-9.]+)?([KMR]?)([0-9.]+)?$/);
  if (match) {
    let p1 = match[1] || "";
    let unit = match[2] || "";
    let p2 = match[3] || "";
    
    let numStr = p1;
    if (unit && p2) {
      numStr += "." + p2;
    } else if (p2) {
      numStr += p2;
    }
    
    if (numStr) {
      let val = parseFloat(numStr);
      if (unit === 'K') val *= 1000;
      else if (unit === 'M') val *= 1000000;
      ohms = val;
    }
  } else {
    let multiplierValue = 1;
    const numStr = v.replace(/[^0-9.]/g, "");
    if (v.includes("K")) multiplierValue = 1000;
    if (v.includes("M")) multiplierValue = 1000000;
    let val = parseFloat(numStr) * multiplierValue;
    if (!isNaN(val)) ohms = val;
  }

  const colors = [
    "#000000",
    "#8b4513",
    "#ff0000",
    "#ffa500",
    "#ffff00",
    "#008000",
    "#0000ff",
    "#ee82ee",
    "#808080",
    "#ffffff",
  ];
  if (ohms === 0) return [colors[0], colors[0], colors[0], "#d4af37"];

  let exponent = Math.floor(Math.log10(ohms));
  let digits = Math.round(ohms / Math.pow(10, exponent - 1));
  if (digits < 10) {
    digits *= 10;
    exponent -= 1;
  }

  let first = Math.floor(digits / 10) % 10;
  let second = Object.is(digits % 10, -0) ? 0 : digits % 10;
  let multiplier = exponent - 1;

  let multColor = "#000";
  if (multiplier === -1) multColor = "#d4af37"; // Gold for x0.1
  else if (multiplier === -2) multColor = "#c0c0c0"; // Silver for x0.01
  else if (multiplier >= 0 && multiplier <= 9) multColor = colors[multiplier];

  return [
    colors[first] || "#000",
    colors[second] || "#000",
    multColor,
    "#d4af37",
  ];
}

const FallbackSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  label,
}: SymbolProps & { label: string }) => {
  const isPcb = label.startsWith("PCB");
  const fallbackStroke = isPcb ? "#0ea5e9" : color;
  const fallbackText = isPcb ? "#0ea5e9" : textColor;

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-15}
        y={-15}
        width={30}
        height={30}
        fill="transparent"
        stroke={selected ? selectedColor : fallbackStroke}
        strokeWidth={isPcb ? 1 : 2}
        cornerRadius={4}
      />
      <Text
        text={label.replace("PCB", "")}
        fontSize={isPcb ? 6 : 4}
        x={-12}
        y={-5}
        fill={selected ? selectedColor : fallbackText}
      />
    </Group>
  );
};

export function ResistorSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  customProps,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "#e2c290";
  const bands = getResistorColors(value?.toString());
  const offsets = customProps?.pinOffsets || {};
  const p0x = -30 + (offsets[0]?.x || 0); const p0y = 0 + (offsets[0]?.y || 0);
  const p1x = 30 + (offsets[1]?.x || 0); const p1y = 0 + (offsets[1]?.y || 0);
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[p0x, p0y, -12, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[12, 0, p1x, p1y]} stroke="#bcc2c2" strokeWidth={2} />
      <Rect
        x={-12}
        y={-4}
        width={24}
        height={8}
        fill="#e4c596"
        shadowColor="#000"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.3}
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
      />
      <Rect x={-8} y={-4} width={2} height={8} fill={bands[0]} />
      <Rect x={-4} y={-4} width={2} height={8} fill={bands[1]} />
      <Rect x={0} y={-4} width={2} height={8} fill={bands[2]} />
      <Rect x={6} y={-4} width={2} height={8} fill={bands[3]} />

      {/* 3D highlights */}
      <Rect
        x={-12}
        y={-3}
        width={24}
        height={2}
        fill="#ffffff"
        opacity={0.3}
        cornerRadius={1}
      />

      <Circle
        x={-30}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={25}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      {value ? (
        <Text
          text={value + "Ω"}
          x={-10}
          y={-18}
          fontSize={10}
          fill={textColor}
        />
      ) : null}
    </Group>
  );
}

export function CapacitorSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  customProps,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const offsets = customProps?.pinOffsets || {};
  const p0x = -20 + (offsets[0]?.x || 0); const p0y = 0 + (offsets[0]?.y || 0);
  const p1x = 20 + (offsets[1]?.x || 0); const p1y = 0 + (offsets[1]?.y || 0);
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[p0x, p0y, -8, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[8, 0, p1x, p1y]} stroke="#bcc2c2" strokeWidth={2} />
      {/* Ceramic disc capacitor: a nice orange/brown circle slightly squashed */}
      <Ellipse
        x={0}
        y={0}
        radiusX={9}
        radiusY={6}
        fill="#e67e22"
        shadowColor="#000"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
      />
      <Path
        data="M -4 -3 Q 0 -5 4 -3"
        stroke="#f39c12"
        strokeWidth={1}
        fill="transparent"
      />
      <Text
        text={getCapacitorCode(value)}
        x={-6}
        y={-2}
        fontSize={4}
        fill="#333"
        fontStyle="bold"
      />
      <Line points={[-20, 0, -5, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[5, 0, 20, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Circle
        x={-20}
        y={0}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={20}
        y={0}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}
export function InductorSymbol({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "#333";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[-15, 0, 15, 0]} stroke="#aaa" strokeWidth={2} />
      <Rect
        x={-10}
        y={-4}
        width={20}
        height={8}
        fill="#111"
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
      />
      <Line points={[-8, -4, -6, 4]} stroke="#b87333" strokeWidth={1.5} />
      <Line points={[-4, -4, -2, 4]} stroke="#b87333" strokeWidth={1.5} />
      <Line points={[0, -4, 2, 4]} stroke="#b87333" strokeWidth={1.5} />
      <Line points={[4, -4, 6, 4]} stroke="#b87333" strokeWidth={1.5} />
      <Line points={[8, -4, 10, 4]} stroke="#b87333" strokeWidth={1.5} />
      <Circle
        x={-15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}

export function SwitchSymbol({ x, y, rotation, selected, value }: SymbolProps) {
  const stroke = selected ? selectedColor : "#1a1a1a";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Base Tactile switch */}
      <Rect
        x={-8}
        y={-8}
        width={16}
        height={16}
        fill="#303030"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={1}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
      />
      <Line points={[-15, 0, -8, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[15, 0, 8, 0]} stroke="#bcc2c2" strokeWidth={2} />

      {/* Button center */}
      <Circle x={0} y={0} radius={4.5} fill="#111" />
      <Circle x={0} y={0} radius={3.5} fill="#e11d48" />
      <Circle x={0} y={-1} radius={3.5} fill="#ff4d79" opacity={0.6} />

      <Circle
        x={-15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}
export function DiodeSymbol({ x, y, rotation, selected, value, customProps }: SymbolProps) {
  const stroke = selected ? selectedColor : "#111";
  const offsets = customProps?.pinOffsets || {};
  const p0x = -15 + (offsets[0]?.x || 0); const p0y = 0 + (offsets[0]?.y || 0);
  const p1x = 15 + (offsets[1]?.x || 0); const p1y = 0 + (offsets[1]?.y || 0);
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[p0x, p0y, -8, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[8, 0, p1x, p1y]} stroke="#bcc2c2" strokeWidth={2} />
      <Rect
        x={-8}
        y={-4}
        width={16}
        height={8}
        fill="#222"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
      />
      <Rect x={4} y={-4} width={2} height={8} fill="#bdc3c7" />
      <Rect
        x={-8}
        y={-3}
        width={16}
        height={2}
        fill="#ffffff"
        opacity={0.2}
        cornerRadius={1}
      />
      <Circle
        x={-15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}
export function BatterySymbol({
  x,
  y,
  rotation,
  selected,
  voltages,
  value,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "#1e1e1e";
  // 9V Battery Realistic Look
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-15}
        y={-25}
        width={30}
        height={50}
        fill="#222"
        shadowColor="#000"
        shadowBlur={5}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={3}
      />
      {/* Label wrap */}
      <Rect x={-15} y={-15} width={30} height={35} fill="#d97706" />
      <Rect x={-15} y={0} width={30} height={20} fill="#111" />
      <Text
        text={parseFloat(value?.toString() || "9").toString() + "V"}
        x={-12}
        y={-10}
        fontSize={12}
        fill="#fff"
        fontStyle="bold"
      />
      <Text text="POWER" x={-10} y={5} fontSize={5} fill="#d97706" />
      <Text
        text="+"
        x={-10}
        y={-23}
        fontSize={8}
        fill="#fff"
        fontStyle="bold"
      />
      <Text text="-" x={4} y={-23} fontSize={8} fill="#fff" fontStyle="bold" />

      {/* Terminals */}
      {/* Left terminal: Positive (smaller) */}
      <Rect
        x={-7}
        y={-29}
        width={5}
        height={4}
        fill="#bcc2c2"
        cornerRadius={0.5}
      />
      {/* Right terminal: Negative (larger) */}
      <Rect
        x={1}
        y={-30}
        width={7}
        height={5}
        fill="#bcc2c2"
        cornerRadius={1}
      />

      <Circle x={-4.5} y={-29} radius={1} fill="#777" />
      <Circle x={4.5} y={-30} radius={3.5} fill="#777" />

      {/* Wire from positive (left) */}
      <Line
        points={[-7, -29, -10, -32, -10, -40]}
        stroke="#ef4444"
        strokeWidth={2.5}
      />
      {/* Wire from negative (right) */}
      <Line
        points={[4.5, -30, 10, -32, 10, -40]}
        stroke="#3b82f6"
        strokeWidth={2.5}
      />

      <Circle
        x={-10}
        y={-40}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={-40}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}
export const TransistorPNPSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#334155";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* 2D TO-92 Front View (Flat rectangle with bevels) */}
      <Rect x={-14} y={-10} width={28} height={18} fill="#1e293b" cornerRadius={[2, 2, 0, 0]} stroke={stroke} strokeWidth={selected ? 2 : 1} />
      {/* Small bevel highlight on top edge */}
      <Rect x={-12} y={-9} width={24} height={2} fill="#334155" opacity={0.5} />
      
      {/* Etched text */}
      <Text
        text={value || "BC558"}
        x={-14}
        y={-4}
        width={28}
        align="center"
        fontSize={6}
        fill="#94a3b8"
      />
      <Text
        text="PNP"
        x={-14}
        y={2}
        width={28}
        align="center"
        fontSize={4}
        fill="#64748b"
      />

      {/* 3 Silver Pins extending straight down */}
      <Line points={[-10, 8, -10, 30]} stroke="#cbd5e1" strokeWidth={2} />
      <Line points={[0, 8, 0, 30]} stroke="#cbd5e1" strokeWidth={2} />
      <Line points={[10, 8, 10, 30]} stroke="#cbd5e1" strokeWidth={2} />

      {/* Snap Points (Pads) */}
      {[-10, 0, 10].map((px) => (
        <Circle
          key={px}
          x={px}
          y={30}
          radius={4}
          fill={selected ? selectedColor : "#e2e8f0"}
          stroke={selected ? selectedColor : "#94a3b8"}
          strokeWidth={1.5}
        />
      ))}
    </Group>
  );
};
export const PCBBGASymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-15} y={-15} width={30} height={30} fill="#111827" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={2} />
      <Circle x={-10} y={-10} radius={1} fill="#4b5563" />
      {/* 5x5 Grid */}
      {[...Array(5)].map((_, r) => 
        [...Array(5)].map((_, c) => 
          <Group key={`bga_${r}_${c}`} x={-10 + c * 5} y={-10 + r * 5}>
             <Circle radius={1.8} fill="#cbd5e1" />
             <Circle radius={1.2} fill="#9ca3af" />
           </Group>
        )
      )}
    </Group>
  );
};

export const PCBPinHeaderSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-20} y={-5} width={40} height={10} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      {[...Array(4)].map((_, i) => (
        <Group key={i} x={-15 + i * 10} y={0}>
          <Rect x={-3.5} y={-3.5} width={7} height={7} fill="#fbbf24" cornerRadius={1} />
          <Circle x={0} y={0} radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};

export const PCBUSBCSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-15} y={-10} width={30} height={20} fill="#e5e7eb" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={2} />
      <Rect x={-13} y={-10} width={26} height={10} fill="#9ca3af" cornerRadius={1} />
      {/* SMT Pads */}
      {[...Array(12)].map((_, i) => <Group key={`pad_${i}`}><Rect x={-11.5 + i * 2} y={9} width={2} height={6} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-11 + i * 2} y={10} width={1} height={4} fill="#9ca3af" /></Group>)}
      {/* Mounting holes */}
      <Group x={-12} y={2}><Circle radius={3.5} fill="#fbbf24" /><Circle radius={1.5} fill="#0f0f13" /></Group>
      <Group x={12} y={2}><Circle radius={3.5} fill="#fbbf24" /><Circle radius={1.5} fill="#0f0f13" /></Group>
    </Group>
  );
};

export const PCBMicroUSBSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-10} y={-8} width={20} height={16} fill="#e5e7eb" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={2} />
      <Path data="M -8 -8 L -6 -6 L 6 -6 L 8 -8" fill="#9ca3af" />
      {/* 5 SMT Pads */}
      {[...Array(5)].map((_, i) => <Group key={`pad_${i}`}><Rect x={-4.5 + i * 2} y={7.5} width={2.2} height={5} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-4 + i * 2} y={8} width={1.2} height={4} fill="#9ca3af" /></Group>)}
      {/* Mounting holes */}
      <Group x={-9.5} y={1.5}><Rect x={-2.5} y={-2.5} width={5} height={5} fill="#fbbf24" cornerRadius={1} /><Circle radius={1.5} fill="#0f0f13" /></Group>
      <Group x={9.5} y={1.5}><Rect x={-2.5} y={-2.5} width={5} height={5} fill="#fbbf24" cornerRadius={1} /><Circle radius={1.5} fill="#0f0f13" /></Group>
    </Group>
  );
};

export const MosfetSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#334155";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* TO-220 Metal Tab Heatsink */}
      <Rect
        x={-12}
        y={-18}
        width={24}
        height={14}
        fill="#cbd5e1" // Silver metallic look
        stroke="#94a3b8"
        strokeWidth={1}
        cornerRadius={1.5}
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.3}
      />
      {/* Heatsink Mounting Hole */}
      <Circle x={0} y={-11} radius={3.5} fill="#475569" stroke="#94a3b8" strokeWidth={0.5} />
      <Circle x={0} y={-11} radius={2.2} fill="#1e293b" />

      {/* Black Plastic Epoxy Body */}
      <Rect
        x={-12}
        y={-4}
        width={24}
        height={15}
        fill="#1e293b" // Epoxy black
        stroke={stroke}
        strokeWidth={selected ? 2 : 1}
        cornerRadius={1}
        shadowColor="#000"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        shadowOpacity={0.3}
      />
      {/* 3D highlight bevel on plastic body */}
      <Line points={[-11, -3, 11, -3]} stroke="#475569" strokeWidth={1} />
      <Line points={[-11, -3, -11, 10]} stroke="#475569" strokeWidth={1} opacity={0.5} />

      {/* Text labels on body */}
      <Text text={value || "IRFZ44N"} x={-10} y={0} fontSize={4.5} fontStyle="bold" fill="#f1f5f9" />
      <Text text="N-CH" x={-5} y={6} fontSize={3.5} fontStyle="bold" fill="#94a3b8" />

      {/* 3D Metal Pins (Legs): Extended to y=30, spaced at -10, 0, 10 */}
      {/* Pin 1 (Gate) */}
      <Line points={[-10, 11, -10, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[-10, 11, -10, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="G" x={-14} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Pin 2 (Drain) */}
      <Line points={[0, 11, 0, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[0, 11, 0, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="D" x={-1.5} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Pin 3 (Source) */}
      <Line points={[10, 11, 10, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[10, 11, 10, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="S" x={11} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Connection Terminals Snapped to Grid at y=30 */}
      <Circle
        x={-10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
      <Circle
        x={0}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const MosfetPSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#334155";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* TO-220 Metal Tab Heatsink */}
      <Rect
        x={-12}
        y={-18}
        width={24}
        height={14}
        fill="#cbd5e1" // Silver metallic look
        stroke="#94a3b8"
        strokeWidth={1}
        cornerRadius={1.5}
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.3}
      />
      {/* Heatsink Mounting Hole */}
      <Circle x={0} y={-11} radius={3.5} fill="#475569" stroke="#94a3b8" strokeWidth={0.5} />
      <Circle x={0} y={-11} radius={2.2} fill="#1e293b" />

      {/* Black Plastic Epoxy Body */}
      <Rect
        x={-12}
        y={-4}
        width={24}
        height={15}
        fill="#1e293b" // Epoxy black
        stroke={stroke}
        strokeWidth={selected ? 2 : 1}
        cornerRadius={1}
        shadowColor="#000"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        shadowOpacity={0.3}
      />
      {/* 3D highlight bevel on plastic body */}
      <Line points={[-11, -3, 11, -3]} stroke="#475569" strokeWidth={1} />
      <Line points={[-11, -3, -11, 10]} stroke="#475569" strokeWidth={1} opacity={0.5} />

      {/* Text labels on body */}
      <Text text={value || "IRF9Z34N"} x={-10} y={0} fontSize={4.5} fontStyle="bold" fill="#f1f5f9" />
      <Text text="P-CH" x={-5} y={6} fontSize={3.5} fontStyle="bold" fill="#94a3b8" />

      {/* 3D Metal Pins (Legs): Extended to y=30, spaced at -10, 0, 10 */}
      {/* Pin 1 (Gate) */}
      <Line points={[-10, 11, -10, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[-10, 11, -10, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="G" x={-14} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Pin 2 (Drain) */}
      <Line points={[0, 11, 0, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[0, 11, 0, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="D" x={-1.5} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Pin 3 (Source) */}
      <Line points={[10, 11, 10, 30]} stroke="#475569" strokeWidth={3} />
      <Line points={[10, 11, 10, 30]} stroke="#cbd5e1" strokeWidth={1.5} />
      <Text text="S" x={11} y={32} fontSize={4.5} fill="#64748b" fontStyle="bold" />

      {/* Connection Terminals Snapped to Grid at y=30 */}
      <Circle
        x={-10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
      <Circle
        x={0}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#475569"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const Timer555Symbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-8 IC Body (Horizontal) */}
      <Rect
        x={-20}
        y={-16}
        width={40}
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
      <Circle x={-12} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -20 -4 A 4 4 0 0 0 -20 4" fill="#111" />
      <Text text={value || "NE555"} x={-14} y={-2} fontSize={7} fill="#ccc" />

      {/* 4 bottom pins (-15, -5, 5, 15 y=20) */}
      {[...Array(4)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-17 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-15 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-16 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 4 top pins (-15, -5, 5, 15 y=-20) - numbering goes from right to left (8 to 5) */}
      {[...Array(4)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={13 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={15 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={14 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const OpampSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-8 IC Body (Horizontal) */}
      <Rect
        x={-20}
        y={-16}
        width={40}
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
      <Circle x={-12} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -20 -4 A 4 4 0 0 0 -20 4" fill="#111" />
      <Text text={value || "LM741"} x={-14} y={-2} fontSize={7} fill="#ccc" />

      {/* 4 bottom pins (-15, -5, 5, 15 y=20) */}
      {[...Array(4)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-17 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-15 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-16 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 4 top pins (-15, -5, 5, 15 y=-20) - numbering goes from right to left (8 to 5) */}
      {[...Array(4)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={13 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={15 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={14 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicGateSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text text={value || "Gate"} x={-20} y={-2} fontSize={7} fill="#ccc" />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicAndSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC08 AND"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};


export const LogicNotSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC04 NOT"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}

      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicOrSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC32 OR"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicNandSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC00 NAND"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicNorSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC02 NOR"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};

export const LogicXorSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DIP-14 IC Body (Horizontal) */}
      <Rect
        x={-35}
        y={-16}
        width={70}
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
      <Circle x={-27} y={-8} radius={4.5} fill="#0c0c0c" />
      <Path data="M -35 -4 A 4 4 0 0 0 -35 4" fill="#111" />
      <Text
        text={value || "74HC86 XOR"}
        x={-20}
        y={-2}
        fontSize={7}
        fill="#ccc"
      />

      {/* 7 bottom pins (y=20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"B" + i}>
          <Rect x={-32 + i * 10} y={16} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={-30 + i * 10}
            y={20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={-31 + i * 10}
            y={10}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
      {/* 7 top pins (y=-20) */}
      {[...Array(7)].map((_, i) => (
        <Group key={"T" + i}>
          <Rect x={28 - i * 10} y={-20} width={6} height={6} fill="#bcc2c2" />
          <Circle
            x={30 - i * 10}
            y={-20}
            radius={4}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={""}
            x={29 - i * 10}
            y={-14}
            fontSize={4}
            fill="#555"
          />
        </Group>
      ))}
    </Group>
  );
};export const ACSourceSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  reading,
}: SymbolProps & { reading?: string }) => {
  const stroke = selected ? selectedColor : "#ccc";

  let currentDisplay = "0.00 A";
  if (reading) {
    currentDisplay = reading;
  }

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Wall Socket / AC Generator look */}
      <Circle
        x={0}
        y={0}
        radius={22}
        fill="#2a2a2a"
        shadowColor="#000"
        shadowBlur={6}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        stroke={stroke}
        strokeWidth={selected ? 2 : 1}
      />
      <Circle x={0} y={0} radius={20} fill="#333" />
      <Path
        data="M -8 0 Q -4 -8 0 0 T 8 0"
        stroke="#3b82f6"
        strokeWidth={2}
        fill="transparent"
      />
      {/* Real-time Display */}
      <Rect
        x={-20}
        y={4}
        width={40}
        height={10}
        fill="#064e3b"
        cornerRadius={2}
      />
      <Text text={(value || "220V").replace("V", "") + "V"} x={-18} y={6} fontSize={6} fill="#34d399" fontStyle="bold" fontFamily="monospace" />
      <Text text={currentDisplay} x={2} y={6} fontSize={6} fill="#34d399" fontStyle="bold" fontFamily="monospace" />

      <Line points={[0, -22, 0, -35]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[0, 22, 0, 35]} stroke="#bcc2c2" strokeWidth={2} />
      <Circle
        x={0}
        y={-35}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={0}
        y={35}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Text text="L" x={4} y={-32} fontSize={6} fill="#ef4444" />
      <Text text="N" x={4} y={28} fontSize={6} fill="#3b82f6" />
    </Group>
  );
};
export const VoltmeterSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  reading,
}: SymbolProps & { reading?: string }) => {
  const stroke = selected ? selectedColor : "#333";
  const displayVal = reading || "0.00V";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-20}
        y={-15}
        width={40}
        height={30}
        fill="#e11d48"
        stroke={stroke}
        strokeWidth={2}
        cornerRadius={4}
      />
      <Rect x={-16} y={-10} width={32} height={12} fill="#111" />
      <Text text={displayVal} x={-14} y={-8} fontSize={7} fill="#0f0" fontFamily="monospace" fontWeight="bold" />

      <Line points={[-10, 15, -10, 20]} stroke="#aaa" strokeWidth={2} />
      <Line points={[10, 15, 10, 20]} stroke="#aaa" strokeWidth={2} />

      <Text text="+" x={-13} y={11} fontSize={6} fill="#fff" />
      <Text text="-" x={7} y={11} fontSize={6} fill="#fff" />

      <Circle
        x={-10}
        y={20}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={20}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const AmmeterSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  reading,
}: SymbolProps & { reading?: string }) => {
  const stroke = selected ? selectedColor : "#333";
  const displayVal = reading || "0.00A";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-20}
        y={-15}
        width={40}
        height={30}
        fill="#0284c7"
        stroke={stroke}
        strokeWidth={2}
        cornerRadius={4}
      />
      <Rect x={-16} y={-10} width={32} height={12} fill="#111" />
      <Text text={displayVal} x={-14} y={-8} fontSize={7} fill="#0f0" fontFamily="monospace" fontWeight="bold" />

      <Line points={[-10, 15, -10, 20]} stroke="#aaa" strokeWidth={2} />
      <Line points={[10, 15, 10, 20]} stroke="#aaa" strokeWidth={2} />

      <Text text="+" x={-13} y={11} fontSize={6} fill="#fff" />
      <Text text="-" x={7} y={11} fontSize={6} fill="#fff" />

      <Circle
        x={-10}
        y={20}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={20}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const OscilloscopeSymbol = ({
  x,
  y,
  rotation,
  selected,
  isOn,
  reading,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#111";
  const pathRef = React.useRef<Konva.Path>(null);
  const textRef = React.useRef<Konva.Text>(null);

  const latestValue = React.useRef(0);
  React.useEffect(() => {
    if (reading) {
      const parsed = parseFloat(reading.replace(/[^\d.-]/g, ""));
      if (!isNaN(parsed)) {
        latestValue.current = parsed;
      }
    } else {
      latestValue.current = 0;
    }
  }, [reading]);

  React.useEffect(() => {
    if (!pathRef.current) return;
    if (!isOn) {
      pathRef.current.data("M -32 -7 L 18 -7");
      pathRef.current.getLayer()?.batchDraw();
      if (textRef.current) textRef.current.text("");
      return;
    }
    let animId: number;
    let history: number[] = Array(50).fill(0);
    const updateOscilloscope = () => {
      history.push(latestValue.current);
      if (history.length > 50) history.shift();

      let d = "";
      const maxAbs = Math.max(...history.map(Math.abs));
      const scale = Math.max(15, maxAbs * 1.2); 

      for (let i = 0; i < history.length; i++) {
        const px = -32 + (i / 49) * 50; 
        const py = -7 - (history[i] / scale) * 12; 
        d += `${i === 0 ? "M " : "L "}${px} ${py} `;
      }
      if (pathRef.current) {
        pathRef.current.data(d);
      }

      const minVal = Math.min(...history);
      const isAC = (maxAbs - minVal) > 2; // if variation > 2V, it's AC

      if (textRef.current) {
        textRef.current.text(isAC ? "AC" : "DC");
      }

      pathRef.current?.getLayer()?.batchDraw();
      animId = requestAnimationFrame(updateOscilloscope);
    };
    updateOscilloscope();
    return () => cancelAnimationFrame(animId);
  }, [isOn]);

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-40}
        y={-30}
        width={80}
        height={60}
        fill="#333"
        stroke={stroke}
        strokeWidth={2}
        cornerRadius={4}
      />
      <Rect
        x={-32}
        y={-22}
        width={50}
        height={30}
        fill="#0ea5e9"
        opacity={0.3}
      />
      <Path
        ref={pathRef}
        data="M -32 -7 L 18 -7"
        stroke="#38bdf8"
        strokeWidth={1}
      />
      <Text
        ref={textRef}
        text=""
        x={-30}
        y={-20}
        fontSize={6}
        fill="#38bdf8"
        fontFamily="monospace"
      />
      <Circle x={26} y={-10} radius={4} fill="#666" />
      <Circle x={26} y={5} radius={4} fill="#666" />

      <Line points={[-20, 30, -20, 40]} stroke="#aaa" strokeWidth={2} />
      <Line points={[20, 30, 20, 40]} stroke="#aaa" strokeWidth={2} />

      <Text text="CH1" x={-26} y={23} fontSize={5} fill="#fff" />
      <Text text="CH2" x={14} y={23} fontSize={5} fill="#fff" />

      <Circle
        x={-20}
        y={40}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={20}
        y={40}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const SevenSegmentSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  voltages,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  // Pin mapping: Top: [G, F, COM, A, B], Bot: [E, D, COM, C, DP]
  // Indices: 0:G, 1:F, 2:COM, 3:A, 4:B  |  5:E, 6:D, 7:COM, 8:C, 9:DP
  // Segment to voltage index map:
  const segIdx: Record<string, number> = {
    A: 3,
    B: 4,
    C: 8,
    D: 6,
    E: 5,
    F: 1,
    G: 0,
    DP: 9,
  };

  const isSegmentLit = (segName: string) => {
    if (voltages && voltages.length > 0) {
      // Basic common-cathode logic: if voltage at segment pin is high (>1.5V)
      return (voltages[segIdx[segName]] || 0) > 1.5;
    }
    // Fallback logic for basic generic numeric values
    if (!value) return false;
    const digitMap: Record<string, string[]> = {
      "0": ["A", "B", "C", "D", "E", "F"],
      "1": ["B", "C"],
      "2": ["A", "B", "D", "E", "G"],
      "3": ["A", "B", "C", "D", "G"],
      "4": ["B", "C", "F", "G"],
      "5": ["A", "C", "D", "F", "G"],
      "6": ["A", "C", "D", "E", "F", "G"],
      "7": ["A", "B", "C"],
      "8": ["A", "B", "C", "D", "E", "F", "G"],
      "9": ["A", "B", "C", "D", "F", "G"],
    };
    return (digitMap[String(value).trim()] || []).includes(segName);
  };
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-25}
        y={-35}
        width={50}
        height={70}
        fill="#111111"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={3}
      />
      {[
        { n: "A", c: [-10, -26, 20, 6] },
        { n: "G", c: [-10, -3, 20, 6] },
        { n: "D", c: [-10, 20, 20, 6] },
        { n: "F", c: [-16, -22, 6, 17] },
        { n: "B", c: [10, -22, 6, 17] },
        { n: "E", c: [-16, 1, 6, 17] },
        { n: "C", c: [10, 1, 6, 17] },
      ].map((seg, i) => {
        const lit = isSegmentLit(seg.n);
        return (
          <Rect
            key={"sgbg" + i}
            x={seg.c[0]}
            y={seg.c[1]}
            width={seg.c[2]}
            height={seg.c[3]}
            fill={lit ? "#ff0000" : "#222"}
            shadowColor="#ff0000"
            shadowBlur={15}
            shadowEnabled={lit}
            cornerRadius={2}
            opacity={lit ? 1 : 0.8}
          />
        );
      })}

      <Circle
        x={20}
        y={23}
        radius={3}
        fill={isSegmentLit("DP") ? "#ff0000" : "#222"}
        shadowColor="#ff0000"
        shadowBlur={15}
        shadowEnabled={isSegmentLit("DP")}
      />

      {[...Array(5)].map((_, i) => (
        <Group key={"tpin" + i}>
          <Line
            points={[-20 + i * 10, -45, -20 + i * 10, -35]}
            stroke="#bcc2c2"
            strokeWidth={2}
          />
          <Circle
            x={-20 + i * 10}
            y={-45}
            radius={4.5}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={["G", "F", "COM", "A", "B"][i]}
            x={-22 + i * 10}
            y={-32}
            fontSize={4}
            fill="#777"
          />
        </Group>
      ))}
      {[...Array(5)].map((_, i) => (
        <Group key={"bpin" + i}>
          <Line
            points={[-20 + i * 10, 35, -20 + i * 10, 45]}
            stroke="#bcc2c2"
            strokeWidth={2}
          />
          <Circle
            x={-20 + i * 10}
            y={45}
            radius={4.5}
            fill={selected ? selectedColor : "#e2e8f0"}
            stroke={selected ? selectedColor : "#94a3b8"}
            strokeWidth={1.5}
          />
          <Text
            text={["E", "D", "COM", "C", "DP"][i]}
            x={-22 + i * 10}
            y={28}
            fontSize={4}
            fill="#777"
          />
        </Group>
      ))}
    </Group>
  );
};

export const PCBCR2032Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "#4b5563";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Battery Holder circular plastic outline */}
      <Circle x={0} y={0} radius={22} fill="#111827" stroke={stroke} strokeWidth={selected ? 2 : 1} />
      {/* Internal coin cell metal representation */}
      <Circle x={0} y={0} radius={18} fill="#374151" stroke="#9ca3af" strokeWidth={1} />
      {/* Plus polarity sign engraved */}
      <Text text="+" x={10} y={-15} fontSize={14} fill="#fbbf24" fontStyle="bold" />
      <Text text="CR2032" x={-15} y={-4} fontSize={7} fill="#9ca3af" fontStyle="bold" />
      <Text text="3V LITHIUM" x={-18} y={4} fontSize={5} fill="#6b7280" />
      
      {/* Left solder tab centered exactly at x = -15, y = 20 */}
      <Rect x={-19} y={15} width={8} height={10} fill="#cbd5e1" cornerRadius={1} />
      <Text text="+" x={-17} y={26} fontSize={8} fill="#ef4444" fontStyle="bold" />
      {/* Metal connection track */}
      <Rect x={-17} y={11} width={4} height={5} fill="#e2e8f0" />
      
      {/* Right solder tab centered exactly at x = 15, y = 20 */}
      <Rect x={11} y={15} width={8} height={10} fill="#cbd5e1" cornerRadius={1} />
      <Text text="-" x={14} y={26} fontSize={10} fill="#3b82f6" fontStyle="bold" />
      {/* Metal connection track */}
      <Rect x={13} y={11} width={4} height={5} fill="#e2e8f0" />
    </Group>
  );
};

export const PCBLDRSMDSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Outer red/maroon body for CdS sensor */}
      <Rect x={-7} y={-5} width={14} height={10} fill="#7f1d1d" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={1} />
      
      {/* Left Solder pad centered at x = -10 */}
      <Rect x={-13} y={-5.5} width={6} height={11} fill="#cbd5e1" cornerRadius={1} />
      
      {/* Right Solder pad centered at x = 10 */}
      <Rect x={7} y={-5.5} width={6} height={11} fill="#cbd5e1" cornerRadius={1} />

      {/* Yellow CdS serpentine zig-zag photoresist track inside */}
      <Line
        points={[-5, -3, -5, 3, -1.5, 3, -1.5, -3, 1.5, -3, 1.5, 3, 5, 3, 5, -3]}
        stroke="#fbbf24"
        strokeWidth={1.2}
        tension={0.1}
      />
    </Group>
  );
};

export const PCBNTCSMDSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-8} y={-5} width={4} height={10} fill="#9ca3af" cornerRadius={1} />
      <Rect x={4} y={-5} width={4} height={10} fill="#9ca3af" cornerRadius={1} />
      <Rect x={-5} y={-4.5} width={10} height={9} fill="#4b5563" stroke={stroke} strokeWidth={selected ? 2 : 0} />
    </Group>
  );
};

export const PCBCrystalSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Ellipse x={0} y={0} radiusX={12} radiusY={6} fill="#d1d5db" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      <Rect x={-11} y={-3} width={4} height={6} fill="#9ca3af" />
      <Rect x={7} y={-3} width={4} height={6} fill="#9ca3af" />
      <Text text="Y" x={-4} y={-5} fontSize={10} fill="#4b5563" />
    </Group>
  );
};

export const PCBCopperPourSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "#b91c1c";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-30} y={-20} width={60} height={40} fill="rgba(185, 28, 28, 0.1)" stroke={stroke} strokeWidth={1} dash={[4, 4]} />
      <Text text="GND" x={-15} y={-6} fontSize={12} fill="#b91c1c" fontStyle="bold" opacity={0.5} />
    </Group>
  );
};

export const ProtoboardSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#94a3b8";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* 3D Bottom Base Shadow/Bevel Plate */}
      <Rect
        x={-316}
        y={-111}
        width={632}
        height={222}
        fill="#cbd5e1"
        cornerRadius={4.5}
      />

      {/* Main Ivory Plastic Body */}
      <Rect
        x={-315}
        y={-110}
        width={630}
        height={220}
        fill="#faf9f5" // Realistic Warm Ivory/Off-white
        stroke={stroke}
        strokeWidth={selected ? 2 : 1.5}
        cornerRadius={4}
        shadowColor="#000"
        shadowBlur={15}
        shadowOffsetX={5}
        shadowOffsetY={8}
        shadowOpacity={0.25}
      />

      {/* Subtly embossed/beveled inner edge border */}
      <Rect
        x={-312}
        y={-107}
        width={624}
        height={214}
        stroke="#ffffff"
        strokeWidth={1}
        opacity={0.8}
        cornerRadius={3.5}
      />

      {/* Center Divider Groove (3D Channel) */}
      <Rect
        x={-310}
        y={-11}
        width={620}
        height={22}
        fill="#e2e8f0" // Deep channel wall
        stroke="#cbd5e1"
        strokeWidth={0.5}
      />
      {/* Deep inner shadow box for channel */}
      <Rect
        x={-310}
        y={-5}
        width={620}
        height={10}
        fill="#94a3b8" // Inner groove depth
        opacity={0.35}
      />
      {/* Channel sharp shadow lines */}
      <Line points={[-310, -11, 310, -11]} stroke="#94a3b8" strokeWidth={1} opacity={0.7} />
      <Line points={[-310, 11, 310, 11]} stroke="#ffffff" strokeWidth={1.2} />

      {/* Power Rails Silk-screen Lines */}
      {/* Top Positive Rail */}
      <Line
        points={[-305, -80, 305, -80]}
        stroke="#ef4444" // Bright red positive line
        strokeWidth={1.8}
        opacity={0.85}
      />
      {/* Top Negative Rail */}
      <Line
        points={[-305, -100, 305, -100]}
        stroke="#2563eb" // Royal blue negative line
        strokeWidth={1.8}
        opacity={0.85}
      />
      {/* Bottom Negative Rail */}
      <Line
        points={[-305, 90, 305, 90]}
        stroke="#2563eb"
        strokeWidth={1.8}
        opacity={0.85}
      />
      {/* Bottom Positive Rail */}
      <Line
        points={[-305, 70, 305, 70]}
        stroke="#ef4444"
        strokeWidth={1.8}
        opacity={0.85}
      />

      {/* Positive and Negative Labels Printed along the Rails */}
      {[-290, -190, -90, 10, 110, 210].map((labelX) => (
        <Group key={"rail_labels_" + labelX}>
          <Text text="+" x={labelX} y={-84} fontSize={9} fontStyle="bold" fill="#ef4444" opacity={0.8} />
          <Text text="-" x={labelX} y={-104} fontSize={9} fontStyle="bold" fill="#2563eb" opacity={0.8} />
          <Text text="-" x={labelX} y={86} fontSize={9} fontStyle="bold" fill="#2563eb" opacity={0.8} />
          <Text text="+" x={labelX} y={66} fontSize={9} fontStyle="bold" fill="#ef4444" opacity={0.8} />
        </Group>
      ))}

      {/* Single Shape rendering all holes for extreme performance */}
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          for (let c = 0; c < 60; c++) {
            if (true) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-293 + c * 10, -93, 6, 6, 1);
                context.roundRect(-293 + c * 10, -83, 6, 6, 1);
                context.roundRect(-293 + c * 10, 87, 6, 6, 1);
                context.roundRect(-293 + c * 10, 77, 6, 6, 1);
              } else {
                context.rect(-293 + c * 10, -93, 6, 6);
                context.rect(-293 + c * 10, -83, 6, 6);
                context.rect(-293 + c * 10, 87, 6, 6);
                context.rect(-293 + c * 10, 77, 6, 6);
              }
            }
            for (let r = 0; r < 5; r++) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-293 + c * 10, -63 + r * 10, 6, 6, 1);
                context.roundRect(-293 + c * 10, 17 + r * 10, 6, 6, 1);
              } else {
                context.rect(-293 + c * 10, -63 + r * 10, 6, 6);
                context.rect(-293 + c * 10, 17 + r * 10, 6, 6);
              }
            }
          }
          context.fillStyle = "#cbd5e1";
          context.fill();
          context.strokeStyle = "#94a3b8";
          context.lineWidth = 0.5;
          context.stroke();

          context.beginPath();
          for (let c = 0; c < 60; c++) {
            if (true) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-291.5 + c * 10, -91.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, -81.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 88.5, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 78.5, 3, 3, 0.5);
              } else {
                context.rect(-291.5 + c * 10, -91.5, 3, 3);
                context.rect(-291.5 + c * 10, -81.5, 3, 3);
                context.rect(-291.5 + c * 10, 88.5, 3, 3);
                context.rect(-291.5 + c * 10, 78.5, 3, 3);
              }
            }
            for (let r = 0; r < 5; r++) {
              if (typeof context.roundRect === 'function') {
                context.roundRect(-291.5 + c * 10, -61.5 + r * 10, 3, 3, 0.5);
                context.roundRect(-291.5 + c * 10, 18.5 + r * 10, 3, 3, 0.5);
              } else {
                context.rect(-291.5 + c * 10, -61.5 + r * 10, 3, 3);
                context.rect(-291.5 + c * 10, 18.5 + r * 10, 3, 3);
              }
            }
          }
          context.fillStyle = "#090d16";
          context.fill();
        }}
      />

      {/* Indexing numbers and Letters (Printed Screen look) */}
      {[...Array(12)].map((_, c) => (
        <Text
          key={"tnum" + c}
          text={""}
          x={-294 + c * 50}
          y={-73}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
      {[...Array(12)].map((_, c) => (
        <Text
          key={"bnum" + c}
          text={""}
          x={-294 + c * 50}
          y={9}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
      {["A", "B", "C", "D", "E"].map((letter, i) => (
        <Text
          key={letter}
          text={letter}
          x={-305}
          y={-62 + i * 10}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
      {["F", "G", "H", "I", "J"].map((letter, i) => (
        <Text
          key={letter}
          text={letter}
          x={-305}
          y={18 + i * 10}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
      {["A", "B", "C", "D", "E"].map((letter, i) => (
        <Text
          key={letter + "R"}
          text={letter}
          x={299}
          y={-62 + i * 10}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
      {["F", "G", "H", "I", "J"].map((letter, i) => (
        <Text
          key={letter + "R"}
          text={letter}
          x={299}
          y={18 + i * 10}
          fontSize={6.5}
          fontStyle="bold"
          fontFamily="monospace"
          fill="#475569"
        />
      ))}
    </Group>
  );
};
export const USBCSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-25}
        y={-25}
        width={50}
        height={40}
        fill="#ef4444"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.3}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={3}
      />
      <Text
        text="USB-C"
        x={-15}
        y={-5}
        fontSize={8}
        fill="#ffffff"
        fontStyle="bold"
      />
      <Rect
        x={-35}
        y={-15}
        width={10}
        height={30}
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth={1}
        cornerRadius={[2, 0, 0, 2]}
      />
      <Rect
        x={-33}
        y={-10}
        width={6}
        height={20}
        fill="#0b0f19"
        cornerRadius={1}
      />
      <Line points={[25, -15, 35, -15]} stroke="#bcc2c2" strokeWidth={2.5} />
      <Line points={[25, 15, 35, 15]} stroke="#bcc2c2" strokeWidth={2.5} />
      <Circle
        x={20}
        y={-15}
        radius={3}
        fill="#e2e8f0"
        stroke="#d4af37"
        strokeWidth={1}
      />
      <Circle
        x={20}
        y={15}
        radius={3}
        fill="#e2e8f0"
        stroke="#d4af37"
        strokeWidth={1}
      />
      <Circle
        x={20}
        y={0}
        radius={3}
        fill="#e2e8f0"
        stroke="#d4af37"
        strokeWidth={1}
      />
      <Text text="V+" x={8} y={-17} fontSize={6} fill="#fff" />
      <Text text="G" x={10} y={13} fontSize={6} fill="#fff" />
      <Circle
        x={35}
        y={-15}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={35}
        y={15}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const MicroUSBSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#111";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-12}
        y={-10}
        width={24}
        height={20}
        fill="#e2ffeb"
        stroke={stroke}
        strokeWidth={2}
        cornerRadius={2}
      />
      <Rect
        x={-10}
        y={-16}
        width={20}
        height={6}
        fill="silver"
        stroke="#aaa"
        strokeWidth={1}
      />

      <Text
        text="+"
        x={-8}
        y={-6}
        fontSize={8}
        fill="#ef4444"
        fontStyle="bold"
      />
      <Text
        text="-"
        x={4}
        y={-6}
        fontSize={8}
        fill="#3b82f6"
        fontStyle="bold"
      />

      <Line points={[-10, 10, -10, 20]} stroke="#ef4444" strokeWidth={1.5} />
      <Line points={[10, 10, 10, 20]} stroke="#3b82f6" strokeWidth={1.5} />

      <Circle
        x={-10}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const RaspberryPiSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const topPins = [
    "3V3",
    "SDA",
    "SCL",
    "4",
    "GND",
    "17",
    "27",
    "22",
    "3V3",
    "10",
    "9",
    "11",
    "GND",
    "0",
    "5",
    "6",
    "13",
    "19",
    "26",
    "GND",
  ];
  const botPins = [
    "5V",
    "5V",
    "GND",
    "TX",
    "RX",
    "18",
    "GND",
    "23",
    "24",
    "GND",
    "25",
    "8",
    "7",
    "1",
    "GND",
    "12",
    "GND",
    "16",
    "20",
    "21",
  ];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={1.8} scaleY={1.8}>
        {/* Green PCB */}
        <Rect
          x={-70}
          y={-47.5}
          width={140}
          height={95}
          fill="#116814"
          shadowColor="#000"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.4}
          stroke={stroke}
          strokeWidth={selected ? 2 : 0}
          cornerRadius={4}
        />
        <Circle x={-64} y={-41} radius={3.5} fill="#e2e8f0" />
        <Circle x={64} y={-41} radius={3.5} fill="#e2e8f0" />
        <Circle x={-64} y={41} radius={3.5} fill="#e2e8f0" />
        <Circle x={64} y={41} radius={3.5} fill="#e2e8f0" />
        <Rect
          x={-15}
          y={-15}
          width={30}
          height={30}
          fill="#1f2937"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          shadowOpacity={0.6}
          cornerRadius={2}
        />
        <Text text="Broadcom" x={-13} y={0} fontSize={4} fill="#888" />
        <Rect x={-55} y={-43} width={100} height={10} fill="#111" />
        {topPins.map((pin, i) => (
          <Group key={"rpt" + i}>
            <Line
              points={[-52.5 + i * 5, -41, -52.5 + i * 5, -55]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Circle
              x={-52.5 + i * 5}
              y={-55}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-52.5 + i * 5 - 2}
              y={-38}
              fontSize={3.5}
              fill="#fff"
              rotation={-90}
            />
          </Group>
        ))}
        {botPins.map((pin, i) => (
          <Group key={"rpb" + i}>
            <Line
              points={[-52.5 + i * 5, -36, -52.5 + i * 5, -22]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Circle
              x={-52.5 + i * 5}
              y={-22}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-52.5 + i * 5 + 2.5}
              y={-25}
              fontSize={3.5}
              fill="#fff"
              rotation={90}
            />
          </Group>
        ))}
        <Rect
          x={45}
          y={10}
          width={35}
          height={25}
          fill="#cbd5e1"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={2}
          shadowOpacity={0.4}
          stroke="#94a3b8"
          strokeWidth={1}
          cornerRadius={1}
        />
        <Rect
          x={45}
          y={-25}
          width={35}
          height={25}
          fill="#cbd5e1"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={2}
          shadowOpacity={0.4}
          stroke="#94a3b8"
          strokeWidth={1}
          cornerRadius={1}
        />
        <Rect
          x={40}
          y={-10}
          width={40}
          height={18}
          fill="#cbd5e1"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={2}
          shadowOpacity={0.4}
          stroke="#94a3b8"
          strokeWidth={1}
        />
        <Circle
          x={-40}
          y={0}
          radius={10}
          stroke="#ffffff"
          strokeWidth={1.5}
          opacity={0.5}
        />
        <Text
          text="Raspberry Pi"
          x={-25}
          y={25}
          fontSize={10}
          fill="#ffffff"
          fontStyle="bold"
          opacity={0.9}
        />
      </Group>
    </Group>
  );
};

export const BuzzerSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#111";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Black plastic cylinder body (top view) */}
      <Circle
        x={0}
        y={0}
        radius={12}
        fill="#222"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={2}
      />
      <Circle x={0} y={0} radius={10} fill="#1f2937" />
      <Circle x={0} y={0} radius={4} fill="#111" />
      {/* Sticker text */}
      <Text text="+" x={-4} y={3} fontSize={8} fill="#ef4444" />

      {/* Legs (bottom) */}
      <Line points={[-5, 12, -5, 20]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[5, 12, 5, 20]} stroke="#bcc2c2" strokeWidth={2} />

      <Circle
        x={-5}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={5}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};
export const RelaySymbol = ({
  x,
  y,
  rotation,
  selected,
  isOn,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-15}
        y={-15}
        width={30}
        height={30}
        fill="#1d4ed8"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 1 : 0}
        cornerRadius={2}
      />
      <Text text="SRD-05VDC" x={-12} y={-4} fontSize={4.5} fill="#fff" />
      <Text text="SONGLE" x={-10} y={3} fontSize={4} fill="#93c5fd" />

      {/* 2 Top pins (NC, NO) */}
      <Line points={[-10, 15, -10, 20]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[10, 15, 10, 20]} stroke="#bcc2c2" strokeWidth={2} />

      {/* 3 Bottom pins (Coil1, COM, Coil2) */}
      <Line points={[-10, -15, -10, -20]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[0, -15, 0, -20]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[10, -15, 10, -20]} stroke="#bcc2c2" strokeWidth={2} />

      <Text text="NC" x={-14} y={12} fontSize={3} fill="#fff" />
      <Text text="NO" x={6} y={12} fontSize={3} fill="#fff" />
      <Text text="COIL" x={-13} y={-12} fontSize={3} fill="#fff" />
      <Text text="COM" x={-3} y={-12} fontSize={3} fill="#fff" />
      <Text text="COIL" x={7} y={-12} fontSize={3} fill="#fff" />

      <Circle
        x={-10}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={-10}
        y={-20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={0}
        y={-20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={-20}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />

      {isOn && (
        <Circle
          x={5}
          y={-5}
          radius={3.5}
          fill="#fbbf24"
          shadowColor="#fbbf24"
          shadowBlur={4}
        />
      )}
    </Group>
  );
};

export const PotentiometerSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#111";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle
        x={0}
        y={0}
        radius={10}
        fill="#3b82f6"
        stroke={stroke}
        strokeWidth={1}
      />
      <Circle x={0} y={0} radius={4} fill="#fff" />
      <Line points={[-4, 0, 4, 0]} stroke="#ccc" strokeWidth={2} />
      <Line points={[-10, 10, -10, 15]} stroke="#aaa" strokeWidth={2} />
      <Line points={[0, 10, 0, 15]} stroke="#aaa" strokeWidth={2} />
      <Line points={[10, 10, 10, 15]} stroke="#aaa" strokeWidth={2} />
      <Circle
        x={-10}
        y={15}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={0}
        y={15}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={15}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const OLEDSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const [buffer, setBuffer] = React.useState<any[]>([]);
  const bufferRef = React.useRef<any[]>([]);

  React.useEffect(() => {
    let frameId: number;
    const loop = () => {
      const b = (window as any)._oledDisplayBuffer;
      if (b && JSON.stringify(b) !== JSON.stringify(bufferRef.current)) {
        bufferRef.current = b;
        setBuffer(b);
      }
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={2.2} scaleY={2.2} y={-5}>
        <Rect
          x={-30}
          y={-25}
          width={60}
          height={55}
          fill="#003366"
          shadowColor="#000"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.4}
          stroke={stroke}
          strokeWidth={selected ? 2 / 2.2 : 0}
          cornerRadius={3}
        />
        <Rect
          x={-25}
          y={-20}
          width={50}
          height={28}
          fill="#0d0d0d"
          stroke="#1f2937"
          strokeWidth={1}
          shadowColor="#fff"
          shadowBlur={1}
          shadowOpacity={0.1}
        />
        <Group x={-25} y={-20} scaleX={50/128} scaleY={28/64} clipX={0} clipY={0} clipWidth={128} clipHeight={64}>
           {buffer.length === 0 && (
              <Text
                text="OLED I2C"
                x={128/2 - 30}
                y={64/2 - 10}
                fontSize={12}
                fill="#a5f3fc"
                opacity={0.3}
                fontStyle="bold"
              />
           )}
           {buffer.map((item, idx) => (
               <Text key={idx} x={item.x} y={item.y} text={item.text} fontSize={8 * item.size} fill="#a5f3fc" fontFamily="monospace" />
           ))}
        </Group>
        <Line
          points={[-25, -6, 25, -6]}
          stroke="#a5f3fc"
          strokeWidth={0.5}
          opacity={0.1}
        />

        <Rect x={-15} y={15} width={30} height={8} fill="#1f2937" />

        <Line points={[-10, 23, -10, 27]} stroke="#eab308" strokeWidth={2} />
        <Line
          points={[-3.33, 23, -3.33, 27]}
          stroke="#eab308"
          strokeWidth={2}
        />
        <Line points={[3.33, 23, 3.33, 27]} stroke="#eab308" strokeWidth={2} />
        <Line points={[10, 23, 10, 27]} stroke="#eab308" strokeWidth={2} />

        <Text text="GND" x={-13} y={16.5} fontSize={4} fill="#fff" />
        <Text text="VCC" x={-6} y={16.5} fontSize={4} fill="#fff" />
        <Text text="SCL" x={1} y={16.5} fontSize={4} fill="#fff" />
        <Text text="SDA" x={8} y={16.5} fontSize={4} fill="#fff" />
      </Group>

      <Circle
        x={-22}
        y={55}
        radius={3.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={-7.3}
        y={55}
        radius={3.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={7.3}
        y={55}
        radius={3.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={22}
        y={55}
        radius={3.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const MotorSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* DC Motor realistic body */}
      <Rect
        x={-16}
        y={-22}
        width={32}
        height={44}
        fill="#d1d5db"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={16}
      />
      {/* Front axle cap */}
      <Rect x={-8} y={-26} width={16} height={4} fill="#9ca3af" />
      {/* Spinning Spindle effect if isOn */}
      <Rect
        x={-2}
        y={-32}
        width={4}
        height={6}
        fill={isOn ? "#fbbf24" : "#f3f4f6"}
        shadowColor="#fbbf24"
        shadowBlur={8}
        shadowEnabled={isOn}
      />

      {/* Detail vents */}
      <Circle x={-6} y={-10} radius={4} fill="#374151" opacity={0.6} />
      <Circle x={6} y={-10} radius={4} fill="#374151" opacity={0.6} />
      <Circle x={-6} y={10} radius={4} fill="#374151" opacity={0.6} />
      <Circle x={6} y={10} radius={4} fill="#374151" opacity={0.6} />

      {/* Terminals */}
      <Line points={[-6, 22, -10, 35]} stroke="#ef4444" strokeWidth={2} />
      <Line points={[6, 22, 10, 35]} stroke="#3b82f6" strokeWidth={2} />
      <Text
        text="+"
        x={-16}
        y={15}
        fontSize={8}
        fill="#ef4444"
        fontStyle="bold"
      />
      <Text
        text="-"
        x={12}
        y={15}
        fontSize={8}
        fill="#3b82f6"
        fontStyle="bold"
      />

      <Circle
        x={-10}
        y={35}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={35}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export function CapacitorElectrolyticSymbol({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-12}
        y={-15}
        width={24}
        height={30}
        fill="#0f172a"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={1}
      />
      <Rect
        x={-10}
        y={-15}
        width={4}
        height={30}
        fill="#ffffff"
        opacity={0.15}
      />
      <Rect x={4} y={-15} width={6} height={30} fill="#cbd5e1" />
      <Text text="-" x={5.5} y={-5} fontSize={8} fill="#000" fontStyle="bold" />
      <Rect
        x={-10}
        y={-18}
        width={20}
        height={3}
        fill="#e2e8f0"
        cornerRadius={1}
      />
      <Path
        data="M -5 -18 L 5 -18 M 0 -18 L 0 -15"
        stroke="#94a3b8"
        strokeWidth={1}
      />
      <Text
        text={value || "10uF"}
        x={-9}
        y={0}
        fontSize={5}
        fill="#38bdf8"
        fontStyle="bold"
        rotation={-90}
      />
      <Line points={[-10, 15, -10, 30]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[10, 15, 10, 30]} stroke="#bcc2c2" strokeWidth={2} />
      <Circle
        x={-10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={30}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}



export const UltrasonicSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* PCB Board */}
      <Rect x={-30} y={-15} width={60} height={30} fill="#1e40af" stroke={selected ? selectedColor : "#1e3a8a"} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* Txt */}
      <Text text="HC-SR04" x={-20} y={-12} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      {/* Cylinders (Eyes) */}
      <Circle x={-15} y={0} radius={10} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={2} />
      <Circle x={-15} y={0} radius={7} fill="#111827" />
      <Circle x={15} y={0} radius={10} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={2} />
      <Circle x={15} y={0} radius={7} fill="#111827" />
      {/* Crystal */}
      <Rect x={-3} y={-8} width={6} height={12} fill="#9ca3af" cornerRadius={1} />
      {/* 4 Pins on bottom */}
      <Circle x={-10} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={-3.3} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={3.3} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={10} y={15} radius={1.5} fill="#fbbf24" />
      <Text text="VCC TRIG ECHO GND" x={-14} y={10} fill="#f8fafc" fontSize={3} fontStyle="bold" />
      <Text text="+" x={-10.5} y={6} fill="#ef4444" fontSize={5} fontStyle="bold" />
      <Text text="-" x={9.5} y={6} fill="#3b82f6" fontSize={6} fontStyle="bold" />
    </Group>
  );
};

export const DHT11Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Blue Body */}
      <Rect x={-15} y={-15} width={30} height={30} fill="#0ea5e9" stroke={selected ? selectedColor : "#0284c7"} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* Grid lines */}
      <Line points={[-10, -5, 10, -5]} stroke="#0284c7" strokeWidth={1} />
      <Line points={[-10, 0, 10, 0]} stroke="#0284c7" strokeWidth={1} />
      <Line points={[-10, 5, 10, 5]} stroke="#0284c7" strokeWidth={1} />
      {/* 3 Pins */}
      <Circle x={-8} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={0} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={8} y={15} radius={1.5} fill="#fbbf24" />
      <Text text="DHT11" x={-12} y={-12} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="S  VCC  GND" x={-12} y={10} fill="#f8fafc" fontSize={4} fontStyle="bold" />
      <Text text="+" x={0} y={7} fill="#ef4444" fontSize={5} fontStyle="bold" />
      <Text text="-" x={7} y={7} fill="#3b82f6" fontSize={6} fontStyle="bold" />
    </Group>
  );
};

export const HC05Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Base Board */}
      <Rect x={-15} y={-25} width={30} height={50} fill="#1e40af" stroke={selected ? selectedColor : "#1e3a8a"} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* Bluetooth module on top */}
      <Rect x={-12} y={-20} width={24} height={30} fill="#22c55e" cornerRadius={1} />
      {/* Antenna */}
      <Path data="M-8 -18 L-8 -16 L8 -16 L8 -14 L-8 -14 L-8 -12 L8 -12 L8 -10" stroke="#fbbf24" strokeWidth={1} fill="transparent" />
      {/* 6 Pins */}
      <Circle x={-12.5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={-7.5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={-2.5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={2.5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={7.5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={12.5} y={25} radius={1.5} fill="#fbbf24" />
      <Text text="HC-05" x={-10} y={12} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="EN VCC GND TX RX ST" x={-14} y={20} fill="#f8fafc" fontSize={3} fontStyle="bold" />
      <Text text="+" x={-8} y={16} fill="#ef4444" fontSize={5} fontStyle="bold" />
      <Text text="-" x={-3} y={16} fill="#3b82f6" fontSize={6} fontStyle="bold" />
    </Group>
  );
};

export const ESP8266Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-18} y={-25} width={36} height={50} fill="#1e293b" stroke={selected ? selectedColor : "#0f172a"} strokeWidth={selected ? 2 : 1} />
      {/* Metal Shield */}
      <Rect x={-14} y={-10} width={28} height={25} fill="#94a3b8" cornerRadius={2} />
      {/* Antenna Trace */}
      <Path data="M-10 -22 L-10 -18 L10 -18 L10 -22" stroke="#fbbf24" strokeWidth={2} fill="transparent" />
      {/* Castellated holes on sides */}
      {[...Array(8)].map((_, i) => <Circle key={'l'+i} x={-18} y={-5 + i*4} radius={1.5} fill="#fbbf24" />)}
      {[...Array(8)].map((_, i) => <Circle key={'r'+i} x={18} y={-5 + i*4} radius={1.5} fill="#fbbf24" />)}
      <Text text="ESP8266" x={-12} y={-5} fill="#1e293b" fontSize={5} fontStyle="bold" />
      <Text text="ESP-12E" x={-10} y={5} fill="#1e293b" fontSize={4} />
    </Group>
  );
};


export const LDRSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Red board/base */}
      <Circle x={0} y={0} radius={12} fill="#ef4444" stroke={stroke} strokeWidth={selected ? 2 : 1} />
      {/* Photoresistor squiggly track */}
      <Path data="M-6 -2 C-6 -8, -2 -8, -2 -2 C-2 4, 2 4, 2 -2 C2 -8, 6 -8, 6 -2" stroke="#fbbf24" strokeWidth={2} fill="transparent" />
      {/* 2 Pins */}
      <Circle x={-10} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={10} y={15} radius={1.5} fill="#fbbf24" />
      <Text text="LDR" x={-8} y={-18} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="A  B" x={-10} y={10} fill="#f8fafc" fontSize={4} fontStyle="bold" />
    </Group>
  );
};

export const NTCSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Thermistor bead */}
      <Circle x={0} y={0} radius={8} fill="#10b981" stroke={stroke} strokeWidth={selected ? 2 : 1} />
      <Text text="t°" x={-3} y={-3} fill="#111827" fontSize={6} fontStyle="bold" />
      {/* 2 Pins */}
      <Circle x={-10} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={10} y={15} radius={1.5} fill="#fbbf24" />
      <Text text="NTC" x={-8} y={-14} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="A  B" x={-10} y={10} fill="#f8fafc" fontSize={4} fontStyle="bold" />
    </Group>
  );
};

export const GasSensorSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* PCB Base */}
      <Rect x={-20} y={-20} width={40} height={40} fill="#1e40af" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* MQ-2 Mesh Dome */}
      <Circle x={0} y={-5} radius={12} fill="#94a3b8" />
      <Circle x={0} y={-5} radius={10} fill="transparent" stroke="#475569" strokeWidth={1} dash={[1, 1]} />
      <Circle x={0} y={-5} radius={8} fill="transparent" stroke="#475569" strokeWidth={1} dash={[1, 1]} />
      {/* 4 Pins */}
      <Circle x={-15} y={20} radius={1.5} fill="#fbbf24" />
      <Circle x={-5} y={20} radius={1.5} fill="#fbbf24" />
      <Circle x={5} y={20} radius={1.5} fill="#fbbf24" />
      <Circle x={15} y={20} radius={1.5} fill="#fbbf24" />
      <Text text="MQ-2" x={-10} y={10} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="AOUT DOUT GND VCC" x={-16} y={16} fill="#f8fafc" fontSize={3} fontStyle="bold" />
      <Text text="-" x={5} y={12} fill="#3b82f6" fontSize={6} fontStyle="bold" />
      <Text text="+" x={14} y={12} fill="#ef4444" fontSize={5} fontStyle="bold" />
    </Group>
  );
};

export const AccelerometerSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* PCB Base */}
      <Rect x={-30} y={-20} width={80} height={45} fill="#1e40af" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* IC */}
      <Rect x={-10} y={-10} width={20} height={20} fill="#111827" cornerRadius={1} />
      <Text text="MPU6050" x={-12} y={12} fill="#f8fafc" fontSize={5} fontStyle="bold" />
      <Text text="VCC GND SCL SDA XDA XCL AD0 INT" x={-28} y={20} fill="#f8fafc" fontSize={3} fontStyle="bold" />
      <Text text="+" x={-27} y={16} fill="#ef4444" fontSize={5} fontStyle="bold" />
      <Text text="-" x={-16} y={16} fill="#3b82f6" fontSize={6} fontStyle="bold" />
      {/* 8 Pins */}
      <Circle x={-25} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={-15} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={-5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={15} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={25} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={35} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={45} y={25} radius={1.5} fill="#fbbf24" />
    </Group>
  );
};

export const GPSSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* PCB Base */}
      <Rect x={-20} y={-25} width={40} height={50} fill="#1e40af" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      {/* Ceramic Antenna */}
      <Rect x={-15} y={-20} width={30} height={30} fill="#e2e8f0" cornerRadius={2} />
      <Circle x={0} y={-5} radius={3} fill="#fbbf24" />
      <Text text="NEO-6M" x={-12} y={13} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      <Text text="VCC RX TX GND" x={-16} y={20} fill="#f8fafc" fontSize={4} fontStyle="bold" />
      <Text text="+" x={-16} y={16} fill="#ef4444" fontSize={5} fontStyle="bold" />
      <Text text="-" x={13} y={16} fill="#3b82f6" fontSize={6} fontStyle="bold" />
      {/* 4 Pins */}
      <Circle x={-15} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={-5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={5} y={25} radius={1.5} fill="#fbbf24" />
      <Circle x={15} y={25} radius={1.5} fill="#fbbf24" />
    </Group>
  );
};

export const CR2032Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Battery Holder / Battery */}
      <Circle x={0} y={0} radius={15} fill="#94a3b8" stroke={stroke} strokeWidth={selected ? 2 : 1} />
      <Circle x={0} y={0} radius={12} fill="#cbd5e1" />
      <Text text="+" x={-3} y={-4} fill="#111827" fontSize={8} fontStyle="bold" />
      <Text text="CR2032" x={-10} y={4} fill="#111827" fontSize={5} />
      {/* 2 Pins */}
      <Circle x={-15} y={20} radius={1.5} fill="#fbbf24" />
      <Circle x={15} y={20} radius={1.5} fill="#fbbf24" />
      {/* Pin polarities */}
      <Text text="+" x={-19} y={10} fill="#ef4444" fontSize={10} fontStyle="bold" />
      <Text text="-" x={15} y={10} fill="#3b82f6" fontSize={12} fontStyle="bold" />
    </Group>
  );
};

export const CrystalSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Metal Can */}
      <Rect x={-8} y={-5} width={16} height={20} fill="#cbd5e1" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={4} />
      <Text text="16M" x={-6} y={0} fill="#111827" fontSize={5} />
      {/* 2 Pins */}
      <Circle x={-10} y={15} radius={1.5} fill="#fbbf24" />
      <Circle x={10} y={15} radius={1.5} fill="#fbbf24" />
    </Group>
  );
};


export const ModuleSymbol = ({ x, y, rotation, selected, value, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const label = value || customProps?.name || "MODULE";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-25}
        y={-25}
        width={50}
        height={50}
        fill="#1e293b"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={2}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={selected ? selectedColor : "#3b82f6"}
        strokeWidth={selected ? 2 : 1}
        cornerRadius={4}
      />
      <Text
        text={label}
        x={-20}
        y={-5}
        fill="#f8fafc"
        fontSize={10}
        fontStyle="bold"
        width={40}
        align="center"
      />
      {/* Generic 4 Pins on bottom */}
      <Circle x={-15} y={25} radius={3} fill="#fbbf24" stroke="#d97706" strokeWidth={1} />
      <Circle x={-5} y={25} radius={3} fill="#fbbf24" stroke="#d97706" strokeWidth={1} />
      <Circle x={5} y={25} radius={3} fill="#fbbf24" stroke="#d97706" strokeWidth={1} />
      <Circle x={15} y={25} radius={3} fill="#fbbf24" stroke="#d97706" strokeWidth={1} />
      
      {/* Pins for connecting */}
      <Circle x={-15} y={25} radius={1.5} fill="#475569" />
      <Circle x={-5} y={25} radius={1.5} fill="#475569" />
      <Circle x={5} y={25} radius={1.5} fill="#475569" />
      <Circle x={15} y={25} radius={1.5} fill="#475569" />
    </Group>
  );
};

export const ICSymbol = ({ x, y, rotation, selected, value, customProps }: SymbolProps) => {
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
      <Path data={`M ${-halfLength} -4 A 4 4 0 0 0 ${-halfLength} 4`} fill="#111" />
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
};

export function GroundSymbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "#ccc";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[0, 0, 0, 10]} stroke={stroke} strokeWidth={2} />
      <Line points={[-15, 10, 15, 10]} stroke={stroke} strokeWidth={2} />
      <Line points={[-10, 15, 10, 15]} stroke={stroke} strokeWidth={2} />
      <Line points={[-5, 20, 5, 20]} stroke={stroke} strokeWidth={2} />
      <Circle
        x={0}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
}

export function LampSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
  reading,
  broken,
}: SymbolProps) {
  const isBroken = broken || reading === "BROKEN!";
  const brightnessRatio = reading && !isNaN(parseFloat(reading)) ? Math.min(parseFloat(reading), 2) : (isOn ? 1 : 0);
  const lit = !isBroken && (isOn || value === "1" || value === "true" || brightnessRatio > 0.05);
  const stroke = selected ? selectedColor : (isBroken ? "#334155" : "transparent");
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Glow effect */}
      {lit && (
        <Circle x={0} y={-10} radius={30 + brightnessRatio * 30} fill="#fef08a" opacity={Math.min(0.8, brightnessRatio * 0.35)} />
      )}
      
      {/* Lightbulb Glass */}
      <Path
        data="M -15 -10 C -25 -30, 25 -30, 15 -10 C 10 5, 10 10, 10 15 L -10 15 C -10 10, -10 5, -15 -10 Z"
        fill={isBroken ? "#020617" : (lit ? "#fef08a" : "#f8fafc")}
        opacity={isBroken ? 0.85 : (lit ? Math.min(0.95, 0.4 + brightnessRatio * 0.5) : 0.3)}
        stroke={stroke}
        strokeWidth={selected ? 2 : (isBroken ? 1 : 0)}
        shadowColor="#fef08a"
        shadowBlur={lit ? brightnessRatio * 30 : 0}
        shadowEnabled={lit}
      />
      
      {isBroken && (
        <Group>
          {/* Burned soot inside */}
          <Circle x={0} y={-12} radius={8} fill="#000000" opacity={0.6} />
          <Circle x={-5} y={-18} radius={6} fill="#000000" opacity={0.5} />
          <Circle x={6} y={-15} radius={7} fill="#000000" opacity={0.5} />
          <Text
            text="💥"
            x={-7}
            y={-17}
            fontSize={14}
            opacity={0.9}
          />
        </Group>
      )}
      
      {/* Glass reflections */}
      {!isBroken && (
        <Path
          data="M -10 -20 C -5 -23, 0 -23, 5 -20"
          stroke="#ffffff"
          strokeWidth={2}
          lineCap="round"
          opacity={lit ? 0.9 : 0.6}
          fill="transparent"
        />
      )}
      
      {/* Filament inside */}
      <Path
        data="M -6 15 L -6 0 L -3 -5 M 6 15 L 6 0 L 3 -5"
        stroke={lit ? (brightnessRatio > 1.2 ? "#ffffff" : "#f59e0b") : isBroken ? "#1e293b" : "#94a3b8"}
        strokeWidth={1.5}
        fill="transparent"
      />
      {!isBroken && (
      <Path
        data="M -3 -5 L -1 -8 L 1 -5 L 3 -8"
        stroke={lit ? (brightnessRatio > 1.2 ? "#ffffff" : "#fef08a") : "#64748b"}
        strokeWidth={1.5}
        fill="transparent"
        lineJoin="round"
        shadowColor={lit ? "#fef08a" : "transparent"}
        shadowBlur={lit ? 5 : 0}
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
      )}

      {/* Screw Base (Metal) */}
      <Rect x={-10} y={15} width={20} height={4} fill={isBroken ? "#475569" : "#cbd5e1"} />
      <Rect x={-10} y={19} width={20} height={4} fill={isBroken ? "#334155" : "#94a3b8"} />
      <Rect x={-8} y={23} width={16} height={3} fill={isBroken ? "#1e293b" : "#64748b"} />
      
      {/* Terminals */}
      <Circle x={-5} y={26} radius={1.5} fill={selected ? selectedColor : "#334155"} />
      <Circle x={5} y={26} radius={1.5} fill={selected ? selectedColor : "#334155"} />
      
      {/* Bottom Solder Tip */}
      <Path data="M -5 27 L 5 27 L 3 30 L -3 30 Z" fill={isBroken ? "#334155" : "#64748b"} />
      
      {/* Pins coming from base */}
      <Path 
        data="M -3 30 L -15 30" 
        stroke={isBroken ? "#475569" : "#cbd5e1"} 
        strokeWidth={2.5} 
        lineJoin="round" 
        lineCap="round" 
      />
      <Path 
        data="M 3 30 L 15 30" 
        stroke={isBroken ? "#475569" : "#cbd5e1"} 
        strokeWidth={2.5} 
        lineJoin="round" 
        lineCap="round" 
      />
      
      {/* Terminals */}
      <Circle
        x={-15}
        y={30}
        radius={4}
        fill={selected ? selectedColor : (isBroken ? "#1e293b" : "#e2e8f0")}
        stroke={selected ? selectedColor : (isBroken ? "#334155" : "#94a3b8")}
        strokeWidth={1.5}
      />
      <Circle
        x={15}
        y={30}
        radius={4}
        fill={selected ? selectedColor : (isBroken ? "#1e293b" : "#e2e8f0")}
        stroke={selected ? selectedColor : (isBroken ? "#334155" : "#94a3b8")}
        strokeWidth={1.5}
      />
    </Group>
  );
}

export function LEDSymbol({
  x,
  y,
  rotation,
  selected,
  value,
  isOn,
  customProps,
  broken,
}: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const offsets = customProps?.pinOffsets || {};
  const p0x = -10 + (offsets[0]?.x || 0); const p0y = 10 + (offsets[0]?.y || 0);
  const p1x = 10 + (offsets[1]?.x || 0); const p1y = 0 + (offsets[1]?.y || 0);
  const lit = isOn || value === "1" || value === "true";
  
  let baseColor = customProps?.color?.toLowerCase() || "red";
  let litHex = "#ef4444";
  let dimHex = "#fca5a5";
  let darkHex = "#7f1d1d";
  let glassHex = "#f87171";
  
  switch(baseColor) {
    case "green": litHex = "#22c55e"; dimHex = "#86efac"; darkHex = "#14532d"; glassHex = "#4ade80"; break;
    case "blue": litHex = "#3b82f6"; dimHex = "#93c5fd"; darkHex = "#1e3a8a"; glassHex = "#60a5fa"; break;
    case "yellow": litHex = "#eab308"; dimHex = "#fde047"; darkHex = "#713f12"; glassHex = "#facc15"; break;
    case "white": litHex = "#ffffff"; dimHex = "#e2e8f0"; darkHex = "#9ca3af"; glassHex = "#f1f5f9"; break;
  }
  
  if (broken) {
    litHex = "#4b5563";
    dimHex = "#6b7280";
    darkHex = "#1f2937";
    glassHex = "#374151";
  }

  const fillHex = lit ? litHex : glassHex;
  const opacity = lit ? 0.9 : 0.6;

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Glow Effect */}
      {lit && !broken && (
        <Group x={0} y={-25}>
          <Circle radius={35} fill={litHex} opacity={0.15} />
          <Circle radius={25} fill={litHex} opacity={0.3} />
          <Circle radius={12} fill={litHex} opacity={0.6} />
          <Circle radius={6} fill="#ffffff" opacity={0.8} shadowColor={litHex} shadowBlur={15} shadowOpacity={1} />
        </Group>
      )}

      {/* Pins */}
      {/* Anode Pin (Left, Positive, Longer) */}
      <Path 
        data={`M ${p0x} ${p0y} L -10 -15`}
        stroke="#cbd5e1" 
        strokeWidth={2.5} 
        lineJoin="round" 
        lineCap="round" 
      />
      {/* Cathode Pin (Right, Negative, Shorter) */}
      <Path 
        data={`M ${p1x} ${p1y} L 10 -15`}
        stroke="#cbd5e1" 
        strokeWidth={2.5} 
        lineJoin="round" 
        lineCap="round" 
      />

      {/* Internal Electrodes */}
      {/* Anode (smaller, left) */}
      <Rect x={-12} y={-23} width={4} height={8} fill="#94a3b8" />
      {/* Cathode (larger anvil, right) */}
      <Path data="M 10 -15 L 6 -15 L 6 -20 L 4 -26 L 11 -26 L 10 -20 Z" fill="#94a3b8" />
      {/* Wire Bond */}
      <Path data="M -8 -23 Q -2 -28 4 -25" stroke="#fbbf24" strokeWidth={0.5} fill="transparent" />

      {/* LED Epoxy Body */}
      {/* Flange (Base) */}
      <Path
        data="M -14 -12 L -14 -15 L 13 -15 L 13 -12 Z"
        fill={fillHex}
        opacity={opacity}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
      />
      {/* Dome */}
      <Path
        data="M -13 -12 L -13 -32 C -13 -44, 12 -44, 12 -32 L 12 -12 Z"
        fill={fillHex}
        opacity={opacity}
        shadowColor={litHex}
        shadowBlur={lit ? 25 : 0}
        shadowEnabled={lit && !broken}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
      />
      
      {/* Highlight reflection for 3D glass effect */}
      {!broken && (
        <Path
          data="M -9 -13 L -9 -31 C -9 -39, -1 -39, -1 -31 L -1 -13 Z"
          fill="#ffffff"
          opacity={0.3}
        />
      )}

      {/* Markings */}
      {!broken && <Text text="+" x={-20} y={0} fontSize={10} fill={litHex} fontStyle="bold" />}
      {broken && <Text text="X" x={-6} y={-25} fontSize={14} fill="#ef4444" fontStyle="bold" />}

      {/* Terminals */}
      <Circle x={-10} y={10} radius={4} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1.5} />
      <Circle x={10} y={0} radius={4} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1.5} />
    </Group>
  );
}

export const ServoMotorSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  reading,
}: SymbolProps & { reading?: string }) => {
  const stroke = selected ? selectedColor : "transparent";
  const angle = parseInt(reading || "0°") || 0;
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Servo Body */}
      <Rect
        x={-15}
        y={-25}
        width={30}
        height={35}
        fill="#1d4ed8"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={3}
      />
      <Rect x={-19} y={-20} width={4} height={5} fill="#1d4ed8" cornerRadius={1} />
      <Rect x={15} y={-20} width={4} height={5} fill="#1d4ed8" cornerRadius={1} />
      
      <Circle x={0} y={-10} radius={6} fill="#fbbf24" stroke="#d97706" strokeWidth={1} />
      
      <Group x={0} y={-10} rotation={angle}>
        <Rect x={-20} y={-2.5} width={40} height={5} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={0.5} cornerRadius={2} />
        <Circle x={-15} y={0} radius={1.5} fill="#475569" />
        <Circle x={-8} y={0} radius={1.5} fill="#475569" />
        <Circle x={0} y={0} radius={2.5} fill="#475569" />
        <Circle x={8} y={0} radius={1.5} fill="#475569" />
        <Circle x={15} y={0} radius={1.5} fill="#475569" />
      </Group>

      {/* Brown (GND), Red (VCC), Orange (PWM) */}
      <Line points={[-10, 10, -10, 20]} stroke="#f97316" strokeWidth={2} />
      <Line points={[0, 10, 0, 20]} stroke="#ef4444" strokeWidth={2} />
      <Line points={[10, 10, 10, 20]} stroke="#78350f" strokeWidth={2} />

      <Text text="S" x={-13} y={23} fontSize={5} fill="#f97316" fontStyle="bold" />
      <Text text="V" x={-2} y={23} fontSize={5} fill="#ef4444" fontStyle="bold" />
      <Text text="G" x={8} y={23} fontSize={5} fill="#78350f" fontStyle="bold" />

      <Text text={`${angle}°`} x={-8} y={-35} fontSize={7} fill="#1e293b" fontStyle="bold" />

      {[-10, 0, 10].map((pinX) => (
        <Circle
          key={pinX}
          x={pinX}
          y={20}
          radius={4.5}
          fill={selected ? selectedColor : "#e2e8f0"}
          stroke={selected ? selectedColor : "#94a3b8"}
          strokeWidth={1.5}
        />
      ))}
    </Group>
  );
};

export function ATtiny85Symbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = ["RST", "PB3", "PB4", "GND"];
  const rightPins = ["VCC", "PB2", "PB1", "PB0"];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-18}
        y={-20}
        width={36}
        height={40}
        fill="#1a1a1a"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={1.5}
      />
      <Arc x={0} y={-20} innerRadius={0} outerRadius={4} angle={180} fill="#111" rotation={0} />
      <Circle x={-12} y={-14} radius={2} fill="#333" />
      <Text text="ATTINY85" x={-15} y={-3} fontSize={5.5} fill="#94a3b8" fontFamily="monospace" fontWeight="bold" />

      {leftPins.map((pin, i) => {
        const py = -15 + i * 10;
        return (
          <Group key={pin}>
            <Line points={[-18, py, -24, py]} stroke="#cbd5e1" strokeWidth={2} />
            <Circle
              x={-15}
              y={py}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1.2}
            />
            
            <Text text={""} x={-23} y={py - 6} fontSize={3.5} fill="#94a3b8" />
          </Group>
        );
      })}

      {rightPins.map((pin, i) => {
        const py = -15 + i * 10;
        const pinNum = 8 - i;
        return (
          <Group key={pin}>
            <Line points={[18, py, 24, py]} stroke="#cbd5e1" strokeWidth={2} />
            <Circle
              x={15}
              y={py}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1.2}
            />
            
            <Text text={""} x={19} y={py - 6} fontSize={3.5} fill="#94a3b8" />
          </Group>
        );
      })}
    </Group>
  );
}

export function STM32BluePillSymbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = [
    "VB", "PC13", "PC14", "PC15", "PA0", "PA1", "PA2", "PA3", "PA4", "PA5",
    "PA6", "PA7", "PB0", "PB1", "PB10", "PB11", "RST", "3V3", "GND", "GND"
  ];
  const rightPins = [
    "5V", "GND", "3V3", "PA15", "PA12", "PA11", "PA10", "PA9", "PA8", "PB15",
    "PB14", "PB13", "PB12", "PB9", "PB8", "PB7", "PB6", "PB5", "PB4", "PB3"
  ];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-24}
        y={-85}
        width={48}
        height={170}
        fill="#1e40af"
        shadowColor="#000"
        shadowBlur={6}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.5}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={4}
      />
      <Rect x={-10} y={-90} width={20} height={12} fill="#94a3b8" cornerRadius={2} />
      <Rect x={-8} y={-92} width={16} height={2} fill="#475569" />

      <Rect x={-12} y={-15} width={24} height={24} fill="#111" cornerRadius={1} rotation={45} />
      <Text text="STM32" x={-15} y={-4} fontSize={4.5} fill="#fff" fontWeight="bold" />

      <Rect x={-15} y={20} width={8} height={4} fill="#e2e8f0" cornerRadius={1} />
      <Rect x={-2} y={-45} width={4} height={10} fill="#e2e8f0" cornerRadius={1} />

      <Circle x={14} y={-72} radius={3.5} fill="#ef4444" stroke="#475569" strokeWidth={1} />

      {leftPins.map((pin, i) => {
        const py = -76 + i * 8;
        return (
          <Group key={`L_${i}`}>
            <Circle
              x={-20}
              y={py}
              radius={3}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-15}
              y={py - 2}
              fontSize={4}
              fill="#fff"
            />
            
          </Group>
        );
      })}

      {rightPins.map((pin, i) => {
        const py = 76 - i * 8;
        return (
          <Group key={`R_${i}`}>
            <Circle
              x={20}
              y={py}
              radius={3}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={10}
              y={py - 2}
              fontSize={4}
              fill="#fff"
            />
            
          </Group>
        );
      })}
    </Group>
  );
}

export function ArduinoUnoSymbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const topPins = [
    "GND",
    "13",
    "12",
    "11",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1",
  ];
  const b1Pins = ["RST", "3V3", "5V", "GND", "GND", "VIN"];
  const b2Pins = ["A0", "A1", "A2", "A3", "A4", "A5"];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={1.6} scaleY={1.6}>
        <Rect
          x={-60}
          y={-45}
          width={120}
          height={90}
          fill="#006468"
          shadowColor="#000"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.5}
          stroke={stroke}
          strokeWidth={selected ? 2 : 0}
          cornerRadius={3}
        />
        <Rect
          x={-55}
          y={-35}
          width={30}
          height={20}
          fill="#c0c0c0"
          cornerRadius={2}
        />
        <Rect
          x={-55}
          y={15}
          width={25}
          height={15}
          fill="#111"
          cornerRadius={2}
        />
        <Rect
          x={-10}
          y={-25}
          width={35}
          height={15}
          fill="#111"
          cornerRadius={2}
        />
        <Text
          text="UNO"
          x={-10}
          y={5}
          fontSize={12}
          fill="#fff"
          fontStyle="bold"
          opacity={0.8}
        />

        <Rect x={-45} y={-42} width={90} height={6} fill="#1f2937" />
        {topPins.map((pin, i) => (
          <Group key={"T" + i}>
            <Line
              points={[-41 + i * 6, -39, -41 + i * 6, -55]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={-43 + i * 6}
              y={-41}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={-41 + i * 6}
              y={-55}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-41 + i * 6 - 2}
              y={-43}
              fontSize={4}
              fill="#fff"
              rotation={-90}
            />
          </Group>
        ))}
        <Rect x={-45} y={36} width={40} height={6} fill="#1f2937" />
        {b1Pins.map((pin, i) => (
          <Group key={"B1" + i}>
            <Line
              points={[-41 + i * 6, 39, -41 + i * 6, 55]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={-43 + i * 6}
              y={37}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={-41 + i * 6}
              y={55}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-41 + i * 6 + 2}
              y={43}
              fontSize={4}
              fill="#fff"
              rotation={90}
            />
          </Group>
        ))}
        <Rect x={15} y={36} width={40} height={6} fill="#1f2937" />
        {b2Pins.map((pin, i) => (
          <Group key={"B2" + i}>
            <Line
              points={[19 + i * 6, 39, 19 + i * 6, 55]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={17 + i * 6}
              y={37}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={19 + i * 6}
              y={55}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={19 + i * 6 + 2}
              y={43}
              fontSize={4}
              fill="#fff"
              rotation={90}
            />
          </Group>
        ))}
      </Group>
    </Group>
  );
}

export function ESP32Symbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = [
    "3V3",
    "EN",
    "VP",
    "VN",
    "34",
    "35",
    "32",
    "33",
    "25",
    "26",
    "27",
    "14",
    "12",
    "GND",
    "13",
  ];
  const rightPins = [
    "GND",
    "23",
    "22",
    "TXD",
    "RXD",
    "21",
    "GND",
    "19",
    "18",
    "5",
    "17",
    "16",
    "4",
    "2",
    "15",
  ];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={1.6} scaleY={1.6}>
        <Rect
          x={-32.5}
          y={-60}
          width={65}
          height={120}
          fill="#111111"
          shadowColor="#000"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.5}
          stroke={stroke}
          strokeWidth={selected ? 2 : 0}
          cornerRadius={3}
        />
        <Rect x={-20} y={-58} width={40} height={35} fill="#18181b" />
        <Path
          data="M-15 -50 L-15 -55 L-10 -55 L-10 -50 L-5 -50 L-5 -55 L0 -55 L0 -50 L5 -50 L5 -55 L10 -55 L10 -50 L15 -50 L15 -55"
          stroke="#d4af37"
          strokeWidth={2}
        />
        <Rect
          x={-25}
          y={-20}
          width={50}
          height={40}
          fill="#cbd5e1"
          shadowColor="#000"
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={2}
          shadowOpacity={0.3}
          cornerRadius={2}
        />
        <Text
          text="ESP-WROOM-32"
          x={-20}
          y={-5}
          fontSize={5}
          fill="#333"
          fontStyle="bold"
        />
        <Rect
          x={-8}
          y={50}
          width={16}
          height={10}
          fill="#cbd5e1"
          cornerRadius={1}
        />
        <Rect x={-6} y={54} width={12} height={6} fill="#4b5563" />
        <Circle x={-15} y={45} radius={4} fill="#222" />
        <Circle x={15} y={45} radius={4} fill="#222" />
        <Text text="EN" x={-20} y={40} fontSize={4} fill="#fff" />
        <Text text="BOOT" x={11} y={40} fontSize={4} fill="#fff" />

        <Rect x={-30} y={-45} width={6} height={100} fill="#1f2937" />
        {leftPins.map((pin, i) => (
          <Group key={"l" + i}>
            <Line
              points={[-27, -41 + i * 6.5, -40, -41 + i * 6.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={-29}
              y={-43 + i * 6.5}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={-40}
              y={-41 + i * 6.5}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-24}
              y={-42.5 + i * 6.5}
              fontSize={4}
              fill="#fff"
            />
          </Group>
        ))}
        <Rect x={24} y={-45} width={6} height={100} fill="#1f2937" />
        {rightPins.map((pin, i) => (
          <Group key={"r" + i}>
            <Line
              points={[27, -41 + i * 6.5, 40, -41 + i * 6.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={25}
              y={-43 + i * 6.5}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={40}
              y={-41 + i * 6.5}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={10}
              y={-42.5 + i * 6.5}
              width={13}
              fontSize={4}
              fill="#fff"
              align="right"
            />
          </Group>
        ))}
      </Group>
    </Group>
  );
}

export function ESP32CamSymbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = ["5V", "GND", "12", "13", "15", "14", "2", "4"];
  const rightPins = ["3V3", "U0R", "U0T", "GND", "16", "0", "VCC", "GND"];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={1.6} scaleY={1.6}>
        <Rect
          x={-40}
          y={-50}
          width={80}
          height={100}
          fill="#18181a"
          stroke={stroke}
          strokeWidth={selected ? 2 : 0}
          cornerRadius={4}
          shadowColor="#000"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.5}
        />
        <Text
          text="ESP32-CAM"
          x={-20}
          y={-45}
          fontSize={7}
          fill="#fff"
          fontStyle="bold"
        />
        <Rect x={-38} y={-35} width={8} height={80} fill="#222" />
        {leftPins.map((pin, i) => (
          <Group key={"cl" + i}>
            <Line
              points={[-34, -29 + i * 9.5, -48, -29 + i * 9.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={-37}
              y={-32 + i * 9.5}
              width={6}
              height={6}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={-48}
              y={-29 + i * 9.5}
              radius={3.5}
              fill={selected ? selectedColor : "#eee"}
            />
            <Text
              text={pin}
              x={-28}
              y={-31 + i * 9.5}
              fontSize={5}
              fill="#fff"
            />
          </Group>
        ))}
        <Rect x={30} y={-35} width={8} height={80} fill="#222" />
        {rightPins.map((pin, i) => (
          <Group key={"cr" + i}>
            <Line
              points={[34, -29 + i * 9.5, 48, -29 + i * 9.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={31}
              y={-32 + i * 9.5}
              width={6}
              height={6}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={48}
              y={-29 + i * 9.5}
              radius={3.5}
              fill={selected ? selectedColor : "#eee"}
            />
            <Text
              text={pin}
              x={10}
              y={-31 + i * 9.5}
              width={18}
              fontSize={5}
              fill="#fff"
              align="right"
            />
          </Group>
        ))}
        <Rect
          x={-15}
          y={-10}
          width={30}
          height={30}
          fill="#111"
          shadowColor="#000"
          shadowBlur={4}
          shadowOpacity={0.6}
          cornerRadius={2}
        />
        <Circle
          x={0}
          y={5}
          radius={10}
          fill="#0d0d0d"
          stroke="#333"
          strokeWidth={1}
        />
        <Circle x={0} y={5} radius={4} fill="#0a3a40" opacity={0.8} />
        <Circle x={2} y={3} radius={1} fill="#fff" opacity={0.6} />
      </Group>
    </Group>
  );
};

export const PowerSupplySymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
  customProps,
  reading,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  
  let currentDisplay = (parseFloat((customProps?.currentLimit ?? 2).toString()) ).toFixed(2) + " A";
  if (reading) {
    currentDisplay = reading;
  }
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Bench Power Supply Case */}
      <Rect
        x={-26}
        y={-30}
        width={52}
        height={60}
        fill="#1f2937"
        shadowColor="#000"
        shadowBlur={6}
        shadowOffsetX={2}
        shadowOffsetY={3}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 2 : 0}
        cornerRadius={3}
      />
      {/* Screen */}
      <Rect
        x={-24}
        y={-26}
        width={48}
        height={14}
        fill="#064e3b"
        cornerRadius={2}
      />
      <Text
        text={(parseFloat(value?.toString() || "12")).toFixed(1) + " V"}
        x={-22}
        y={-23}
        fontSize={8}
        fill="#34d399"
        fontStyle="bold"
        fontFamily="monospace"
      />
      <Text
        text={currentDisplay}
        x={4}
        y={-23}
        fontSize={8}
        fill="#34d399"
        fontStyle="bold"
        fontFamily="monospace"
      />

      {/* Knobs */}
      <Circle
        x={-14}
        y={8}
        radius={5}
        fill="#111"
        stroke="#4b5563"
        strokeWidth={1}
      />
      <Circle
        x={14}
        y={8}
        radius={5}
        fill="#111"
        stroke="#4b5563"
        strokeWidth={1}
      />

      {/* Banana Plug Ports */}
      <Circle x={-12} y={22} radius={4} fill="#7f1d1d" />
      <Circle x={-12} y={22} radius={4} fill="#000" />
      <Text text="+" x={-16} y={28} fontSize={6} fill="#ef4444" />

      <Circle x={12} y={22} radius={4} fill="#1e3a8a" />
      <Circle x={12} y={22} radius={4} fill="#000" />
      <Text text="-" x={14} y={28} fontSize={6} fill="#3b82f6" />

      {/* Bottom Pins (Routing) */}
      <Line points={[-12, 22, -10, 40]} stroke="#ef4444" strokeWidth={2} />
      <Line points={[12, 22, 10, 40]} stroke="#3b82f6" strokeWidth={2} />

      <Circle
        x={-10}
        y={40}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={10}
        y={40}
        radius={4.5}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
    </Group>
  );
};

export const TransistorSymbol = ({
  x,
  y,
  rotation,
  selected,
  value,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "#334155";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* 2D TO-92 Front View (Flat rectangle with bevels) */}
      <Rect x={-14} y={-10} width={28} height={18} fill="#1e293b" cornerRadius={[2, 2, 0, 0]} stroke={stroke} strokeWidth={selected ? 2 : 1} />
      {/* Small bevel highlight on top edge */}
      <Rect x={-12} y={-9} width={24} height={2} fill="#334155" opacity={0.5} />
      
      {/* Etched text */}
      <Text
        text={value || "BC548"}
        x={-14}
        y={-4}
        width={28}
        align="center"
        fontSize={6}
        fill="#94a3b8"
      />
      <Text
        text="NPN"
        x={-14}
        y={2}
        width={28}
        align="center"
        fontSize={4}
        fill="#64748b"
      />

      {/* 3 Silver Pins extending straight down */}
      <Line points={[-10, 8, -10, 30]} stroke="#cbd5e1" strokeWidth={2} />
      <Line points={[0, 8, 0, 30]} stroke="#cbd5e1" strokeWidth={2} />
      <Line points={[10, 8, 10, 30]} stroke="#cbd5e1" strokeWidth={2} />

      {/* Snap Points (Pads) */}
      {[-10, 0, 10].map((px) => (
        <Circle
          key={px}
          x={px}
          y={30}
          radius={4}
          fill={selected ? selectedColor : "#e2e8f0"}
          stroke={selected ? selectedColor : "#94a3b8"}
          strokeWidth={1.5}
        />
      ))}
    </Group>
  );
};

export const PCBDIP8Symbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 8;
  const pinGap = 10;
  const length = (pins / 2) * pinGap + pinGap;
  const halfLength = length / 2;
  const xs = Array.from({ length: pins / 2 }).map((_, i) => -halfLength + pinGap * (i + 1));
  
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-halfLength} y={-18} width={length} height={36} fill="transparent" stroke={selected ? selectedColor : "white"} strokeWidth={1.5} cornerRadius={2} />
      <Path data="M -5 -18 A 5 5 0 0 0 5 -18" stroke="#4b5563" strokeWidth={1} />
      {xs.map((px) => (
        <Group key={"p1_"+px} x={px} y={-15}>
          <Rect x={-3} y={-3} width={6} height={6} fill="#fbbf24" cornerRadius={3} />
          <Circle radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
      {xs.map((px) => (
        <Group key={"p2_"+px} x={px} y={15}>
          <Rect x={-3} y={-3} width={6} height={6} fill="#fbbf24" cornerRadius={3} />
          <Circle radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};

export const PCBSMDSymbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const pins = customProps?.pins ? parseInt(customProps.pins) : 2;

  if (pins <= 2) {
      return (
        <Group x={x} y={y} rotation={rotation} draggable={false}>
          <Rect x={-5} y={-3} width={10} height={6} fill="transparent" stroke={selected ? selectedColor : "white"} strokeWidth={1} cornerRadius={1} />
          <Rect x={-12} y={-4} width={4} height={8} fill="#e2e8f0" cornerRadius={0.5} />
          <Rect x={8} y={-4} width={4} height={8} fill="#e2e8f0" cornerRadius={0.5} />
        </Group>
      );
  }

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
};

export const PCBPadSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle x={0} y={0} radius={4} fill="#d1d5db" stroke={stroke} strokeWidth={selected ? 2 : 0} />
    </Group>
  );
};

export const PCBViaSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle x={0} y={0} radius={3.5} fill="#fbbf24" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      <Circle x={0} y={0} radius={1.5} fill="#0f0f13" />
    </Group>
  );
};

export const PCBSot23Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-6} y={-4} width={12} height={8} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={1} />
      <Rect x={-9} y={-7} width={5} height={5} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-8} y={-6} width={3.5} height={3.5} fill="#9ca3af" />
      <Rect x={3.5} y={-7} width={5} height={5} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={4.5} y={-6} width={3.5} height={3.5} fill="#9ca3af" />
      <Rect x={-2.75} y={2.5} width={5} height={5} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-1.75} y={3} width={3.5} height={3.5} fill="#9ca3af" />
    </Group>
  );
};

export const PCBTo220Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-16} y={-4} width={32} height={8} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      <Rect x={-16} y={-10} width={32} height={6} fill="#9ca3af" />
      <Circle x={0} y={-7} radius={2.5} fill="#374151" />
      {[-10, 0, 10].map((px) => (
        <Group key={px} x={px} y={0}>
          <Rect x={-3} y={-3} width={6} height={6} fill="#fbbf24" cornerRadius={1} />
          <Circle radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};

export const PCBSopSymbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
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
};
export const PCBQfpSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-20} y={-20} width={40} height={40} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={1} />
      <Circle x={-15} y={-15} radius={1.5} fill="#4b5563" />
      {[...Array(8)].map((_, i) => <Group key={`t_${i}`}><Rect x={-15 + i * 4} y={-24} width={4} height={6} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-14 + i * 4} y={-23} width={2} height={4} fill="#9ca3af" /></Group>)}
      {[...Array(8)].map((_, i) => <Group key={`b_${i}`}><Rect x={-15 + i * 4} y={18} width={4} height={6} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-14 + i * 4} y={19} width={2} height={4} fill="#9ca3af" /></Group>)}
      {[...Array(8)].map((_, i) => <Group key={`l_${i}`}><Rect x={-24} y={-15 + i * 4} width={6} height={4} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={-23} y={-14 + i * 4} width={4} height={2} fill="#9ca3af" /></Group>)}
      {[...Array(8)].map((_, i) => <Group key={`r_${i}`}><Rect x={18} y={-15 + i * 4} width={6} height={4} fill="#cbd5e1" cornerRadius={0.5} /><Rect x={19} y={-14 + i * 4} width={4} height={2} fill="#9ca3af" /></Group>)}
    </Group>
  );
};


export const PCBFiducialSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle x={0} y={0} radius={3.5} fill="transparent" stroke="#b91c1c" strokeWidth={1} />
      <Circle x={0} y={0} radius={1.5} fill="#fbbf24" stroke={stroke} strokeWidth={selected ? 1 : 0} />
    </Group>
  );
};

export const PCBMountingHoleSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle x={0} y={0} radius={4} fill="#fbbf24" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      <Circle x={0} y={0} radius={2.5} fill="#1f2937" />
    </Group>
  );
};

export const PCBTestPointSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Circle x={0} y={0} radius={2.5} fill="#fbbf24" stroke={stroke} strokeWidth={selected ? 1 : 0} />
      <Text text="TP" x={3} y={-10} fontSize={8} fill="#ffffff" />
    </Group>
  );
};

export const PCBSilkscreenTextSymbol = ({ x, y, rotation, selected, customProps }: SymbolProps) => {
  const stroke = selected ? "#8b5cf6" : "transparent";
  const textValue = customProps?.text || "TEXT";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-1} y={-1} width={2} height={2} fill={stroke} />
      <Text text={textValue} x={0} y={0} fontSize={8} fill="#ffffff" fontFamily="monospace" align="center" />
    </Group>
  );
};

export const PCBAccelerometerSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-40} y={-5} width={80} height={10} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      {[...Array(8)].map((_, i) => (
        <Group key={i} x={-35 + i * 10} y={0}>
          <Rect x={-3.5} y={-3.5} width={7} height={7} fill="#fbbf24" cornerRadius={1} />
          <Circle x={0} y={0} radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};

export const PCBGPSSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-20} y={-5} width={40} height={10} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      {[...Array(4)].map((_, i) => (
        <Group key={i} x={-15 + i * 10} y={0}>
          <Rect x={-3.5} y={-3.5} width={7} height={7} fill="#fbbf24" cornerRadius={1} />
          <Circle x={0} y={0} radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};

export const PCBGasSensorSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? "#008400" : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-20} y={-5} width={40} height={10} fill="#1f2937" stroke={stroke} strokeWidth={selected ? 2 : 0} />
      {[...Array(4)].map((_, i) => (
        <Group key={i} x={-15 + i * 10} y={0}>
          <Rect x={-3.5} y={-3.5} width={7} height={7} fill="#fbbf24" cornerRadius={1} />
          <Circle x={0} y={0} radius={1.5} fill="#0f0f13" />
        </Group>
      ))}
    </Group>
  );
};


export const StepperMotorSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* NEMA 17 style body */}
      <Rect x={-20} y={-20} width={40} height={40} fill="#e2e8f0" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      <Rect x={-15} y={-15} width={30} height={30} fill="#94a3b8" cornerRadius={2} />
      <Circle x={0} y={0} radius={10} fill="#475569" />
      <Circle x={0} y={0} radius={4} fill="#cbd5e1" />
      <Text text="NEMA 17" x={-14} y={-25} fill="#1e293b" fontSize={6} fontStyle="bold" />
      
      {/* 4 Pins at the bottom */}
      <Circle x={-15} y={30} radius={1.5} fill="#fbbf24" />
      <Circle x={-5} y={30} radius={1.5} fill="#fbbf24" />
      <Circle x={5} y={30} radius={1.5} fill="#fbbf24" />
      <Circle x={15} y={30} radius={1.5} fill="#fbbf24" />
      <Text text="A+ A- B+ B-" x={-17} y={34} fill="#1e293b" fontSize={5} fontStyle="bold" />
    </Group>
  );
};

export const MotorDriverSymbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* A4988 Module */}
      <Rect x={-20} y={-40} width={40} height={80} fill="#ef4444" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={2} />
      <Rect x={-10} y={-15} width={20} height={30} fill="#111827" cornerRadius={1} />
      {/* Trimpot */}
      <Circle x={0} y={25} radius={4} fill="#fbbf24" />
      <Line points={[-2, 25, 2, 25]} stroke="#111827" strokeWidth={1} />
      <Text text="A4988" x={-12} y={-25} fill="#f8fafc" fontSize={6} fontStyle="bold" />
      
      {/* 16 Pins (8 each side) */}
      {[...Array(8)].map((_, i) => <Circle key={'l'+i} x={-15} y={-35 + i*10} radius={1.5} fill="#fbbf24" />)}
      {[...Array(8)].map((_, i) => <Circle key={'r'+i} x={15} y={-35 + i*10} radius={1.5} fill="#fbbf24" />)}
    </Group>
  );
};

export const DigitalMultimeterSymbol = ({ x, y, rotation, selected, reading, customProps, onUpdate }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  
  // Parse reading based on scale
  let disp = "0.00";
  if (reading !== undefined && reading !== "SHORT!" && reading !== "BROKEN!") {
    const rawVal = parseFloat(reading);
    if (!isNaN(rawVal)) {
      const mode = customProps?.dmmMode || "DCV";
      const scaleStr = customProps?.dmmScale || "20";
      let maxVal = 20;
      let mult = 1;
      if (scaleStr.endsWith('m')) { maxVal = parseFloat(scaleStr) * 1e-3; mult = 1e3; }
      else if (scaleStr.endsWith('k')) { maxVal = parseFloat(scaleStr) * 1e3; mult = 1e-3; }
      else if (scaleStr.endsWith('M')) { maxVal = parseFloat(scaleStr) * 1e6; mult = 1e-6; }
      else if (scaleStr.endsWith('A')) { maxVal = parseFloat(scaleStr); mult = 1; }
      else { maxVal = parseFloat(scaleStr); mult = 1; }
      
      if (Math.abs(rawVal) > maxVal && mode !== 'RES') {
         disp = "1 .   ";
      } else if (mode === 'RES' && rawVal > maxVal) {
         disp = "1 .   ";
      } else {
         const scaled = Math.abs(rawVal) * mult;
         disp = scaled.toFixed(2);
         if (rawVal < 0 && mode !== 'RES') disp = "-" + disp;
      }
    }
  }

  let dialRot = 0;
  const mode = customProps?.dmmMode || "DCV";
  if (mode === "DCV") dialRot = -45;
  if (mode === "ACV") dialRot = 45;
  if (mode === "DCA") dialRot = 135;
  if (mode === "RES") dialRot = -135;

  const initialBlackX = customProps?.probeBlackX ?? -10;
  const initialBlackY = customProps?.probeBlackY ?? 115;
  const initialRedX = customProps?.probeRedX ?? 10;
  const initialRedY = customProps?.probeRedY ?? 115;

  const [localBlack, setLocalBlack] = React.useState({ x: initialBlackX, y: initialBlackY });
  const [localRed, setLocalRed] = React.useState({ x: initialRedX, y: initialRedY });

  // Sync state if props change externally
  React.useEffect(() => {
    setLocalBlack({ x: initialBlackX, y: initialBlackY });
    setLocalRed({ x: initialRedX, y: initialRedY });
  }, [initialBlackX, initialBlackY, initialRedX, initialRedY]);

  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Flexible Wires */}
      {/* Black Wire */}
      <Line points={[-10, 40, -15, 60, localBlack.x - 5, localBlack.y - 30, localBlack.x, localBlack.y - 20]} stroke="#111827" strokeWidth={2} tension={0.5} />
      {/* Red Wire */}
      <Line points={[10, 40, 15, 60, localRed.x + 5, localRed.y - 30, localRed.x, localRed.y - 20]} stroke="#ef4444" strokeWidth={2} tension={0.5} />

      {/* Body */}
      <Rect x={-30} y={-40} width={60} height={90} fill="#f59e0b" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={4} />
      <Rect x={-25} y={-35} width={50} height={25} fill="#94a3b8" cornerRadius={2} />
      <Rect x={-22} y={-32} width={44} height={19} fill="#a7f3d0" cornerRadius={1} />
      <Text text={disp} x={-20} y={-28} fill="#111827" fontSize={12} fontFamily="monospace" />
      <Text text={mode} x={-20} y={-12} fill="#111827" fontSize={6} fontStyle="bold" />
      <Text text={customProps?.dmmScale || "20"} x={10} y={-12} fill="#111827" fontSize={6} fontStyle="bold" />
      
      <Group x={0} y={5} rotation={dialRot}>
        <Circle x={0} y={0} radius={12} fill="#1e293b" />
        <Circle x={0} y={0} radius={9} fill="#334155" />
        <Line points={[0, 0, 0, -10]} stroke="#f8fafc" strokeWidth={2} />
      </Group>
      
      <Circle x={-10} y={40} radius={4} fill="#111827" />
      <Circle x={10} y={40} radius={4} fill="#ef4444" />
      <Text text="COM" x={-16} y={30} fill="#111827" fontSize={4} fontStyle="bold" />
      <Text text="V/Ω/A" x={2} y={30} fill="#111827" fontSize={4} fontStyle="bold" />

      {/* Black Probe Handle (Draggable) */}
      <Group 
        x={localBlack.x} 
        y={localBlack.y} 
        draggable 
        onDragMove={(e) => {
           setLocalBlack({ x: e.target.x(), y: e.target.y() });
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          if (onUpdate) {
            onUpdate({
              customProps: {
                ...customProps,
                probeBlackX: e.target.x(),
                probeBlackY: e.target.y()
              }
            });
          }
        }}
      >
        <Rect x={-2} y={-25} width={4} height={15} fill="#111827" cornerRadius={1} />
        <Line points={[0, -10, 0, 0]} stroke="#94a3b8" strokeWidth={1} />
        <Rect x={-10} y={-30} width={20} height={40} fill="transparent" />
      </Group>

      {/* Red Probe Handle (Draggable) */}
      <Group 
        x={localRed.x} 
        y={localRed.y} 
        draggable 
        onDragMove={(e) => {
           setLocalRed({ x: e.target.x(), y: e.target.y() });
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          if (onUpdate) {
            onUpdate({
              customProps: {
                ...customProps,
                probeRedX: e.target.x(),
                probeRedY: e.target.y()
              }
            });
          }
        }}
      >
        <Rect x={-2} y={-25} width={4} height={15} fill="#ef4444" cornerRadius={1} />
        <Line points={[0, -10, 0, 0]} stroke="#94a3b8" strokeWidth={1} />
        <Rect x={-10} y={-30} width={20} height={40} fill="transparent" />
      </Group>
    </Group>
  );
};
export const ESP32S3Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = ["3V3", "3V3", "RST", "4", "5", "6", "7", "15", "16", "17", "18", "8", "3", "46", "9", "10", "11", "12", "13", "14", "5V", "GND"];
  const rightPins = ["GND", "GND", "0", "45", "48", "47", "21", "20", "19", "35", "36", "37", "38", "39", "40", "41", "42", "TX", "RX", "2", "1", "GND"];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      {/* Main Board PCB */}
      <Rect x={-50} y={-100} width={100} height={200} fill="#1e1e1e" shadowColor="#000" shadowBlur={4} shadowOffsetX={2} shadowOffsetY={3} shadowOpacity={0.5} stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={4} />
      
      {/* ESP32-S3 Module PCB */}
      <Rect x={-30} y={-95} width={60} height={60} fill="#111111" cornerRadius={2} />
      {/* Antenna Trace */}
      <Path data="M-22 -88 L-22 -80 L-14 -80 L-14 -88 L-6 -88 L-6 -80 L2 -80 L2 -88 L10 -88 L10 -80 L18 -80 L18 -88" stroke="#d4af37" strokeWidth={2} />
      {/* Module Metallic Shield */}
      <Rect x={-27} y={-70} width={54} height={32} fill="#cbd5e1" shadowColor="#000" shadowBlur={2} shadowOffsetX={1} shadowOffsetY={2} shadowOpacity={0.4} cornerRadius={2} />
      <Text text="ESP32-S3" x={-22} y={-58} fontSize={6} fill="#475569" fontStyle="bold" />
      <Text text="WROOM-1" x={-15} y={-48} fontSize={4} fill="#64748b" />

      {/* Two USB-C Ports (UART and USB) */}
      <Rect x={-20} y={88} width={14} height={12} fill="#94a3b8" cornerRadius={1.5} shadowColor="#000" shadowBlur={2} shadowOffsetY={1} shadowOpacity={0.5} />
      <Rect x={-17} y={93} width={8} height={4} fill="#111111" cornerRadius={1} />
      <Text text="UART" x={-18} y={83} fontSize={3} fill="#cbd5e1" fontStyle="bold" />
      
      <Rect x={6} y={88} width={14} height={12} fill="#94a3b8" cornerRadius={1.5} shadowColor="#000" shadowBlur={2} shadowOffsetY={1} shadowOpacity={0.5} />
      <Rect x={9} y={93} width={8} height={4} fill="#111111" cornerRadius={1} />
      <Text text="USB" x={9} y={83} fontSize={3} fill="#cbd5e1" fontStyle="bold" />

      {/* Push Buttons */}
      <Rect x={-35} y={70} width={8} height={8} fill="#e2e8f0" cornerRadius={1.5} />
      <Circle x={-31} y={74} radius={2} fill="#334155" />
      <Text text="RST" x={-37} y={65} fontSize={4} fill="#cbd5e1" fontStyle="bold" />

      <Rect x={27} y={70} width={8} height={8} fill="#e2e8f0" cornerRadius={1.5} />
      <Circle x={31} y={74} radius={2} fill="#334155" />
      <Text text="BOOT" x={24} y={65} fontSize={4} fill="#cbd5e1" fontStyle="bold" />
      
      {/* RGB LED (WS2812) */}
      <Rect x={-4} y={72} width={8} height={8} fill="#f8fafc" cornerRadius={1} />
      <Circle x={0} y={76} radius={2.5} fill="#10b981" />
      <Text text="RGB" x={-4} y={68} fontSize={3} fill="#cbd5e1" />

      {/* USB-to-UART Bridge Chip */}
      <Rect x={-16} y={55} width={8} height={8} fill="#1a1a1a" cornerRadius={1} />
      {/* Voltage Regulator */}
      <Rect x={12} y={35} width={6} height={8} fill="#1a1a1a" cornerRadius={1} />

      {/* Pin Headers */}
      <Rect x={-45} y={-86} width={8} height={176} fill="#262626" cornerRadius={1} />
      {leftPins.map((pin, i) => (
        <Group key={"l" + i}>
          <Rect x={-44} y={-84 + i * 8 - 1.5} width={6} height={3} fill="#fbbf24" cornerRadius={1} />
          <Line points={[-41, -84 + i * 8, -64, -84 + i * 8]} stroke="#fbbf24" strokeWidth={1} />
          <Circle x={-64} y={-84 + i * 8} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
          <Text text={pin} x={-40} y={-86 + i * 8} fontSize={4} fill="#fff" />
        </Group>
      ))}
      <Rect x={37} y={-86} width={8} height={176} fill="#262626" cornerRadius={1} />
      {rightPins.map((pin, i) => (
        <Group key={"r" + i}>
          <Rect x={38} y={-84 + i * 8 - 1.5} width={6} height={3} fill="#fbbf24" cornerRadius={1} />
          <Line points={[41, -84 + i * 8, 64, -84 + i * 8]} stroke="#fbbf24" strokeWidth={1} />
          <Circle x={64} y={-84 + i * 8} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
          <Text text={pin} x={25} y={-86 + i * 8} fontSize={4} fill="#fff" />
        </Group>
      ))}
    </Group>
  );
};

export function ZenerDiodeSymbol({ x, y, rotation, selected, value }: SymbolProps) {
  const stroke = selected ? selectedColor : "#111";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Line points={[-15, 0, 15, 0]} stroke="#bcc2c2" strokeWidth={2} />
      <Rect
        x={-8}
        y={-4}
        width={16}
        height={8}
        fill="#eab308"
        shadowColor="#000"
        shadowBlur={4}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={1}
        cornerRadius={2}
      />
      {/* Zener cathode mark */}
      <Rect x={4} y={-4} width={2} height={8} fill="#111" />
      <Line points={[4, -4, 2, -4]} stroke="#111" strokeWidth={1.5} />
      <Line points={[6, 4, 8, 4]} stroke="#111" strokeWidth={1.5} />

      <Rect
        x={-8}
        y={-3}
        width={16}
        height={2}
        fill="#ffffff"
        opacity={0.3}
        cornerRadius={1}
      />
      <Circle
        x={-15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      <Circle
        x={15}
        y={0}
        radius={4}
        fill={selected ? selectedColor : "#e2e8f0"}
        stroke={selected ? selectedColor : "#94a3b8"}
        strokeWidth={1.5}
      />
      {value && (
        <Text
          text={value}
          x={-15}
          y={10}
          fontSize={10}
          fill="#cbd5e1"
          fontFamily="monospace"
        />
      )}
    </Group>
  );
}

export const RelayModuleSymbol = ({
  x,
  y,
  rotation,
  selected,
  isOn,
}: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect
        x={-15}
        y={-20}
        width={30}
        height={40}
        fill="#0f172a"
        shadowColor="#000"
        shadowBlur={3}
        shadowOffsetX={1}
        shadowOffsetY={2}
        shadowOpacity={0.4}
        stroke={stroke}
        strokeWidth={selected ? 1 : 0}
        cornerRadius={3}
      />
      <Rect
        x={-12}
        y={-17}
        width={24}
        height={18}
        fill="#1d4ed8"
        cornerRadius={2}
      />
      <Text text="RELAY" x={-10} y={-10} fontSize={6} fill="#fff" />
      
      {/* 3 Top pins (VCC, GND, IN) */}
      <Line points={[-10, 20, -10, 25]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[0, 20, 0, 25]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[10, 20, 10, 25]} stroke="#bcc2c2" strokeWidth={2} />
      
      <Text text="IN" x={-12} y={12} fontSize={4} fill="#fff" />
      <Text text="GND" x={-3} y={12} fontSize={4} fill="#fff" />
      <Text text="VCC" x={7} y={12} fontSize={4} fill="#fff" />

      {/* 3 Bottom pins (NO, COM, NC) */}
      <Line points={[-15, -20, -15, -25]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[0, -20, 0, -25]} stroke="#bcc2c2" strokeWidth={2} />
      <Line points={[15, -20, 15, -25]} stroke="#bcc2c2" strokeWidth={2} />
      
      <Text text="NO" x={-14} y={-24} fontSize={4} fill="#fff" />
      <Text text="COM" x={-4} y={-24} fontSize={4} fill="#fff" />
      <Text text="NC" x={10} y={-24} fontSize={4} fill="#fff" />

      <Circle x={-10} y={25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      <Circle x={0} y={25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      <Circle x={10} y={25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      <Circle x={-15} y={-25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      <Circle x={0} y={-25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      <Circle x={15} y={-25} radius={3} fill={selected ? selectedColor : "#e2e8f0"} stroke={selected ? selectedColor : "#94a3b8"} strokeWidth={1} />
      
      <Circle x={-10} y={5} radius={2} fill={isOn ? "#ef4444" : "#450a0a"} />
      <Circle x={10} y={5} radius={2} fill={isOn ? "#22c55e" : "#052e16"} />
    </Group>
  );
};
