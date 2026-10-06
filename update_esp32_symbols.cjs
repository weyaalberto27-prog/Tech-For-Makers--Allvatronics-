const fs = require('fs');
let code = fs.readFileSync('src/components/Symbols.tsx', 'utf-8');

const esp32Old = `export function ESP32Symbol({ x, y, rotation, selected }: SymbolProps) {
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

        <Rect x={-30} y={-10} width={6} height={100} fill="#1f2937" />
        {leftPins.map((pin, i) => (
          <Group key={"l" + i}>
            <Line
              points={[-27, -6 + i * 6.5, -40, -6 + i * 6.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={-29}
              y={-8 + i * 6.5}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={-40}
              y={-6 + i * 6.5}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-24}
              y={-7.5 + i * 6.5}
              fontSize={4}
              fill="#fff"
            />
          </Group>
        ))}
        <Rect x={24} y={-10} width={6} height={100} fill="#1f2937" />
        {rightPins.map((pin, i) => (
          <Group key={"r" + i}>
            <Line
              points={[27, -6 + i * 6.5, 40, -6 + i * 6.5]}
              stroke="#bcc2c2"
              strokeWidth={1}
            />
            <Rect
              x={25}
              y={-8 + i * 6.5}
              width={4}
              height={4}
              fill="#475569"
              cornerRadius={1}
            />
            <Circle
              x={40}
              y={-6 + i * 6.5}
              radius={3.5}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={pin.length > 2 ? 16 : 18}
              y={-7.5 + i * 6.5}
              fontSize={4}
              fill="#fff"
            />
          </Group>
        ))}
      </Group>
    </Group>
  );
}`;

const esp32New = `export function ESP32Symbol({ x, y, rotation, selected }: SymbolProps) {
  const stroke = selected ? selectedColor : "transparent";
  const leftPins = ["3V3", "EN", "VP", "VN", "34", "35", "32", "33", "25", "26", "27", "14", "12", "GND", "13"];
  const rightPins = ["GND", "23", "22", "TXD", "RXD", "21", "GND", "19", "18", "5", "17", "16", "4", "2", "15"];
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Group scaleX={1.6} scaleY={1.6}>
        {/* Main Board PCB */}
        <Rect x={-32.5} y={-60} width={65} height={120} fill="#1e1e1e" shadowColor="#000" shadowBlur={4} shadowOffsetX={2} shadowOffsetY={3} shadowOpacity={0.5} stroke={stroke} strokeWidth={selected ? 2 : 0} cornerRadius={3} />
        
        {/* PCB Traces for aesthetics */}
        <Path data="M-20 -15 L-10 -5 M20 -15 L10 -5 M0 -15 L0 -5" stroke="#333333" strokeWidth={1} />
        <Path data="M-20 40 L-10 30 M20 40 L10 30 M0 40 L0 30" stroke="#333333" strokeWidth={1} />

        {/* Mounting Holes */}
        <Circle x={-26} y={-53} radius={2.5} fill="#0a0a0a" stroke="#d4af37" strokeWidth={0.5} />
        <Circle x={26} y={-53} radius={2.5} fill="#0a0a0a" stroke="#d4af37" strokeWidth={0.5} />
        <Circle x={-26} y={53} radius={2.5} fill="#0a0a0a" stroke="#d4af37" strokeWidth={0.5} />
        <Circle x={26} y={53} radius={2.5} fill="#0a0a0a" stroke="#d4af37" strokeWidth={0.5} />

        {/* ESP32 Module PCB (Black) */}
        <Rect x={-21} y={-57} width={42} height={48} fill="#111111" cornerRadius={1} />
        
        {/* Antenna Trace */}
        <Path data="M-15 -52 L-15 -48 L-10 -48 L-10 -52 L-5 -52 L-5 -48 L0 -48 L0 -52 L5 -52 L5 -48 L10 -48 L10 -52 L15 -52 L15 -48" stroke="#d4af37" strokeWidth={1.5} />
        
        {/* Module Metallic Shield */}
        <Rect x={-19} y={-38} width={38} height={28} fill="#cbd5e1" shadowColor="#000" shadowBlur={2} shadowOffsetX={1} shadowOffsetY={2} shadowOpacity={0.4} cornerRadius={1.5} />
        
        {/* Shield Engraving / Text */}
        <Text text="ESP-WROOM-32" x={-15} y={-28} fontSize={4} fill="#475569" fontStyle="bold" />
        <Text text="Ai-Thinker" x={-10} y={-22} fontSize={3} fill="#64748b" />
        <Text text="FCC ID: 2AHMR-ESP32S" x={-15} y={-17} fontSize={2.5} fill="#94a3b8" />

        {/* Micro-USB Port */}
        <Rect x={-8} y={53} width={16} height={10} fill="#94a3b8" cornerRadius={1} shadowColor="#000" shadowBlur={2} shadowOffsetY={1} shadowOpacity={0.5} />
        <Rect x={-5} y={56} width={10} height={4} fill="#111111" cornerRadius={0.5} />

        {/* Push Buttons */}
        <Rect x={-17} y={42} width={6} height={6} fill="#e2e8f0" cornerRadius={1} />
        <Circle x={-14} y={45} radius={1.5} fill="#334155" />
        <Text text="EN" x={-19} y={38} fontSize={3.5} fill="#cbd5e1" fontStyle="bold" />

        <Rect x={11} y={42} width={6} height={6} fill="#e2e8f0" cornerRadius={1} />
        <Circle x={14} y={45} radius={1.5} fill="#334155" />
        <Text text="BOOT" x={10} y={38} fontSize={3.5} fill="#cbd5e1" fontStyle="bold" />

        {/* CP2102 / CH340 Chip */}
        <Rect x={-3} y={35} width={6} height={6} fill="#1a1a1a" cornerRadius={0.5} />
        <Text text="CP210x" x={-2.5} y={36.5} fontSize={1.5} fill="#444" />
        
        {/* AMS1117 Voltage Regulator */}
        <Rect x={10} y={20} width={4} height={6} fill="#1a1a1a" cornerRadius={0.5} />

        {/* Pin Headers */}
        <Rect x={-30} y={-10} width={6} height={100} fill="#262626" cornerRadius={1} />
        {leftPins.map((pin, i) => (
          <Group key={"l" + i}>
            <Rect x={-29} y={-8 + i * 6.5} width={4} height={4} fill="#fbbf24" cornerRadius={1} />
            <Line points={[-27, -6 + i * 6.5, -40, -6 + i * 6.5]} stroke="#fbbf24" strokeWidth={1} />
            <Circle x={-40} y={-6 + i * 6.5} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
            <Text text={pin} x={-23} y={-7.5 + i * 6.5} fontSize={4} fill="#e2e8f0" fontStyle="bold" />
          </Group>
        ))}
        <Rect x={24} y={-10} width={6} height={100} fill="#262626" cornerRadius={1} />
        {rightPins.map((pin, i) => (
          <Group key={"r" + i}>
            <Rect x={25} y={-8 + i * 6.5} width={4} height={4} fill="#fbbf24" cornerRadius={1} />
            <Line points={[27, -6 + i * 6.5, 40, -6 + i * 6.5]} stroke="#fbbf24" strokeWidth={1} />
            <Circle x={40} y={-6 + i * 6.5} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
            <Text text={pin} x={pin.length > 2 ? 15 : 17.5} y={-7.5 + i * 6.5} fontSize={4} fill="#e2e8f0" fontStyle="bold" />
          </Group>
        ))}
      </Group>
    </Group>
  );
}`;

code = code.replace(esp32Old, esp32New);

const esp32s3Old = `export const ESP32S3Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
  const stroke = selected ? selectedColor : "transparent";
  return (
    <Group x={x} y={y} rotation={rotation} draggable={false}>
      <Rect x={-75} y={-60} width={150} height={120} fill="#111827" stroke={stroke} strokeWidth={selected ? 2 : 1} cornerRadius={4} />
      <Rect x={-50} y={-50} width={40} height={40} fill="#475569" cornerRadius={2} />
      <Path data="M-40 -40 L-40 -30 L-20 -30 L-20 -40" stroke="#fbbf24" strokeWidth={2} fill="transparent" />
      <Rect x={-15} y={-20} width={30} height={30} fill="#1e293b" cornerRadius={1} />
      <Text text="ESP32-S3" x={-30} y={15} fill="#f8fafc" fontSize={10} fontStyle="bold" />
      
      {/* Pins - let's reuse ESP32 positions but mark as S3 */}
      {[...Array(15)].map((_, i) => <Circle key={'l'+i} x={-64} y={(-6 + i * 6.5) * 1.6} radius={2} fill="#fbbf24" />)}
      {[...Array(15)].map((_, i) => <Circle key={'r'+i} x={64} y={(-6 + i * 6.5) * 1.6} radius={2} fill="#fbbf24" />)}
    </Group>
  );
};`;

const esp32s3New = `export const ESP32S3Symbol = ({ x, y, rotation, selected }: SymbolProps) => {
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
          <Text text={pin} x={-34} y={-82 + i * 8} fontSize={4} fill="#e2e8f0" fontStyle="bold" />
        </Group>
      ))}
      <Rect x={37} y={-86} width={8} height={176} fill="#262626" cornerRadius={1} />
      {rightPins.map((pin, i) => (
        <Group key={"r" + i}>
          <Rect x={38} y={-84 + i * 8 - 1.5} width={6} height={3} fill="#fbbf24" cornerRadius={1} />
          <Line points={[41, -84 + i * 8, 64, -84 + i * 8]} stroke="#fbbf24" strokeWidth={1} />
          <Circle x={64} y={-84 + i * 8} radius={3.5} fill={selected ? selectedColor : "#f8fafc"} stroke={selected ? selectedColor : "#fbbf24"} strokeWidth={1.5} />
          <Text text={pin} x={25} y={-82 + i * 8} fontSize={4} fill="#e2e8f0" fontStyle="bold" align="right" width={10} />
        </Group>
      ))}
    </Group>
  );
};`;

code = code.replace(esp32s3Old, esp32s3New);
fs.writeFileSync('src/components/Symbols.tsx', code);
