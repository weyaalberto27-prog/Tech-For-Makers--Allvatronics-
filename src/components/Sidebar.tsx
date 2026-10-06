import React, { useState } from "react";
import { useEditor } from "../store";
import {
  MousePointer2,
  GitCommitHorizontal,
  CircleDot,
  Zap,
  TriangleAlert,
  BoxSelect,
  Eraser,
  Activity,
  ArrowRightToLine,
  Battery as BatteryIcon,
  ToggleLeft,
  Layers,
  SquareChartGantt,
  Lightbulb,
  PlugZap,
  Cpu,
  Volume2,
  Ratio,
  RotateCw,
  Monitor,
  Fan,
  Gauge,
  Waypoints,
  AudioWaveform,
  Play,
  Search,
  Grid,
  ChevronDown,
  ChevronRight,
  Type,
} from "lucide-react";
import { ToolType, PcbToolType } from "../types";
import { cn } from "../lib/utils";
import { ComponentImage } from "./ComponentImage";

function Accordion({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-1.5 flex items-center justify-between text-[10px] font-bold text-gray-400 hover:text-gray-200 uppercase tracking-wider bg-[#1a1a1f] border-y border-[#2d2d33]"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>
      {isOpen && (
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#121215]">
          {children}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const {
    mode,
    tool,
    setTool,
    pcbTool,
    setPcbTool,
    activePcbLayer,
    setActivePcbLayer,
    activeWireColor,
    setActiveWireColor,
    userMode,
    customComponents,
  } = useEditor();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const wireColors = [
    { value: "#bcc2c2", label: "Padrão" },
    { value: "#ef4444", label: "Vermelho" },
    { value: "#000000", label: "Preto" },
    { value: "#3b82f6", label: "Azul" },
    { value: "#22c55e", label: "Verde" },
    { value: "#eab308", label: "Amarelo" },
    { value: "#f97316", label: "Laranja" },
  ];

  const schematicToolItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "select", icon: MousePointer2, label: "Selecionar" },
    { type: "probe", icon: Activity, label: "Ponta de Prova" },
    { type: "wire", icon: GitCommitHorizontal, label: "Fio" },
    { type: "eraser", icon: Eraser, label: "Borracha" },
  ];

  const passiveItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "resistor", icon: Zap, label: "Resistor" },
    { type: "capacitor", icon: CircleDot, label: "Cap Cerâmico" },
    { type: "capacitor_elec", icon: CircleDot, label: "Cap Eletrolítico" },
    { type: "potentiometer", icon: RotateCw, label: "Potenciômetro" },
    { type: "inductor", icon: Activity, label: "Indutor" },
  ];

  const semiconductorItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "diode", icon: ArrowRightToLine, label: "Diodo" },
    { type: "zener_diode", icon: ArrowRightToLine, label: "Diodo Zener" },
    { type: "led", icon: Lightbulb, label: "LED" },
    { type: "lamp", icon: Lightbulb, label: "Lâmpada" },
    { type: "transistor", icon: Layers, label: "NPN" },
    { type: "transistor_pnp", icon: Layers, label: "PNP" },
    { type: "mosfet", icon: Layers, label: "MOSFET-N" },
    { type: "mosfet_p", icon: Layers, label: "MOSFET-P" },
  ];

  const icItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "timer555", icon: BoxSelect, label: "555 Timer" },
    { type: "opamp", icon: Play, label: "Amp Op" },
    { type: "logic_and", icon: Waypoints, label: "AND" },
    { type: "logic_or", icon: Waypoints, label: "OR" },
    { type: "logic_nand", icon: Waypoints, label: "NAND" },
    { type: "logic_nor", icon: Waypoints, label: "NOR" },
    { type: "logic_xor", icon: Waypoints, label: "XOR" },
    { type: "logic_not", icon: Waypoints, label: "NOT" },
  ];

  const powerItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "powersupply", icon: PlugZap, label: "DC" },
    { type: "battery", icon: BatteryIcon, label: "Bateria" },
    { type: "ac_source", icon: Activity, label: "AC" },
    { type: "ground", icon: TriangleAlert, label: "GND" },
  ];

  const instrumentItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "voltmeter", icon: Gauge, label: "Voltímetro" },
    { type: "ammeter", icon: Gauge, label: "Amperímetro" },
    { type: "digital_multimeter", icon: Gauge, label: "Multímetro Digital" },
    { type: "oscilloscope", icon: AudioWaveform, label: "Osciloscópio" },
  ];

  const mcuItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "arduino_uno", icon: Cpu, label: "Arduino Uno" },
    { type: "esp32", icon: Cpu, label: "ESP32" },
    { type: "esp32s3", icon: Cpu, label: "ESP32-S3" },
    { type: "esp32_cam", icon: Cpu, label: "ESP32-CAM" },
    { type: "raspberry_pi", icon: Cpu, label: "Raspberry Pi" },
    { type: "attiny85", icon: Cpu, label: "ATtiny85" },
    { type: "stm32_bluepill", icon: Cpu, label: "STM32 BluePill" },
  ];

  const electroItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "switch", icon: ToggleLeft, label: "Pulsador" },
    { type: "buzzer", icon: Volume2, label: "Buzzer" },
    { type: "relay", icon: Ratio, label: "Relé" },
    { type: "relay_module", icon: Ratio, label: "Módulo Relé" },
    { type: "oled", icon: Monitor, label: "OLED" },
    { type: "seven_segment", icon: Monitor, label: "7-Seg" },
    { type: "motor", icon: Fan, label: "Motor DC" },
    { type: "stepper_motor", icon: Fan, label: "Motor de Passo" },
    { type: "servo_motor", icon: Fan, label: "Servo Motor" },
    { type: "motor_driver", icon: Cpu, label: "Driver A4988" },
    { type: "protoboard", icon: Grid, label: "Protoboard" },
    { type: "usb_c", icon: BoxSelect, label: "USB-C" },
    { type: "micro_usb", icon: BoxSelect, label: "Micro-USB" },
  ];

  const sensorItems: { type: ToolType; icon: any; label: string }[] = [
    { type: "ldr", icon: Activity, label: "LDR" },
    { type: "ntc", icon: Activity, label: "NTC" },
    { type: "ultrasonic", icon: Activity, label: "Ultrassônico HC-SR04" },
    { type: "hc05", icon: Cpu, label: "Bluetooth HC-05" },
    { type: "dht11", icon: Activity, label: "DHT11" },
    { type: "esp8266", icon: Cpu, label: "Wi-Fi ESP8266" },
    { type: "gas_sensor", icon: Activity, label: "Gás MQ-2" },
    { type: "accelerometer", icon: Activity, label: "Acelerômetro" },
    { type: "gps", icon: Activity, label: "GPS NEO-6M" },
    { type: "cr2032", icon: BatteryIcon, label: "Bateria CR2032" },
    { type: "crystal", icon: Cpu, label: "Cristal Oscilador" },
  ];

  const pcbToolItems: { type: PcbToolType; icon: any; label: string }[] = [
    { type: "select", icon: MousePointer2, label: "Selecionar" },
    { type: "trace", icon: GitCommitHorizontal, label: "Trilha" },
    { type: "board", icon: SquareChartGantt, label: "Borda" },
    { type: "eraser", icon: Eraser, label: "Lixeira" },
  ];

  const pcbComponentItems: { type: PcbToolType; icon: any; label: string }[] = [
    { type: "pad", icon: CircleDot, label: "Trough Hole" },
    { type: "via", icon: Zap, label: "Via" },
    { type: "dip8", icon: BoxSelect, label: "DIP-8" },
    { type: "smd", icon: BoxSelect, label: "Pad SMD" },
    { type: "sot23", icon: BoxSelect, label: "SOT-23" },
    { type: "to220", icon: BoxSelect, label: "TO-220" },
    { type: "sop", icon: BoxSelect, label: "SOP/SOIC" },
    { type: "qfp", icon: BoxSelect, label: "QFP/LQFP" },
    { type: "bga", icon: BoxSelect, label: "BGA" },
    { type: "pinheader", icon: CircleDot, label: "Pin Header" },
    { type: "usb_c", icon: BoxSelect, label: "USB-C" },
    { type: "micro_usb", icon: BoxSelect, label: "Micro-USB" },
    { type: "cr2032", icon: CircleDot, label: "CR2032" },
    { type: "ldr_smd", icon: BoxSelect, label: "LDR SMD" },
    { type: "ntc_smd", icon: BoxSelect, label: "NTC SMD" },
    { type: "crystal", icon: BoxSelect, label: "Cristal" },
    { type: "copper_pour", icon: BoxSelect, label: "Polígono" },
    { type: "fiducial", icon: CircleDot, label: "Fiducial" },
    { type: "mounting_hole", icon: CircleDot, label: "Furo Mecânico" },
    { type: "test_point", icon: CircleDot, label: "Test Point" },
    { type: "silkscreen_text", icon: Type, label: "Texto" },
  ];

  const realPartsCatalog: { type: ToolType; icon: any; label: string }[] = [
    { type: "diode", icon: Zap, label: "1N4148 (Fast Diode)" },
    { type: "diode", icon: Zap, label: "1N4007 (Rectifier)" },
    { type: "led", icon: Lightbulb, label: "CREE LED (Alta Potência)" },
    { type: "opamp", icon: Cpu, label: "LM358 (Dual OpAmp)" },
    { type: "timer555", icon: Cpu, label: "NE555 (Timer)" },
    { type: "logic_and", icon: Cpu, label: "74HC08 (Quad AND)" },
    { type: "logic_or", icon: Cpu, label: "74HC32 (Quad OR)" },
  ];

  const allSchematicComponents = userMode === 'pro' ? [
    ...sensorItems,
    ...passiveItems,
    ...semiconductorItems,
    ...icItems,
    ...powerItems,
    ...mcuItems,
    ...electroItems,
    ...instrumentItems,
    ...realPartsCatalog,
  ] : [
    ...passiveItems,
    ...semiconductorItems.filter(i => ['led', 'lamp', 'diode'].includes(i.type)),
    ...powerItems,
    ...electroItems.filter(i => ['switch', 'buzzer', 'motor', 'protoboard'].includes(i.type))
  ];

  const matchSearch = (lbl: string) =>
    lbl.toLowerCase().includes(search.toLowerCase());

  const filteredSchematic = search
    ? (allSchematicComponents.filter((i) =>
        matchSearch(i.label),
      ) as typeof allSchematicComponents)
    : [];
  const filteredPcb = search
    ? (pcbComponentItems.filter((i) =>
        matchSearch(i.label),
      ) as typeof pcbComponentItems)
    : [];

  const getCategorizedItems = () => {
    let items: any[] = [];
    if (activeCategory === 'passive') {
      items = [...passiveItems];
    } else if (activeCategory === 'ic') {
      items = [...semiconductorItems, ...icItems, ...mcuItems, ...realPartsCatalog];
    } else if (activeCategory === 'connector') {
      items = [...powerItems, ...electroItems, ...instrumentItems, ...sensorItems];
    }
    
    if (userMode !== 'pro') {
      items = items.filter(i => allSchematicComponents.includes(i as any));
    }
    return items;
  };

  const getCategorizedPcbItems = () => {
    let items: any[] = [];
    if (activeCategory === 'passive') {
      items = pcbComponentItems.filter(i => ["pad", "via", "copper_pour", "fiducial", "mounting_hole", "test_point", "silkscreen_text"].includes(i.type));
    } else if (activeCategory === 'ic') {
      items = pcbComponentItems.filter(i => !["pad", "via", "copper_pour", "fiducial", "mounting_hole", "test_point", "silkscreen_text", "usb_c", "micro_usb", "cr2032", "crystal", "ldr_smd", "ntc_smd"].includes(i.type));
    } else if (activeCategory === 'connector') {
      items = pcbComponentItems.filter(i => ["usb_c", "micro_usb", "cr2032", "crystal", "ldr_smd", "ntc_smd"].includes(i.type));
    }
    return items;
  };

  const renderGridButton = (item: any, isPcb = false) => {
    const isSelected = isPcb ? pcbTool === item.type : tool === item.type;
    const onClick = () => (isPcb ? setPcbTool(item.type) : setTool(item.type));

    return (
      <button
        key={`${item.type}-${item.label}`}
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-center p-2 rounded-md text-[10px] transition-all border border-transparent h-[60px]",
          isSelected
            ? "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]"
            : "bg-[#16161a] border-[#2d2d33] text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 hover:border-gray-600",
        )}
      >
        <ComponentImage
          type={item.type}
          icon={item.icon}
          className={cn(
            "w-5 h-5 mb-1.5 shrink-0 transition-opacity",
            isSelected ? "opacity-100 text-blue-400" : "opacity-70",
          )}
          isIllustrative={userMode === 'beginner' && mode === 'schematic' && !isPcb}
        />
        <span className="truncate w-full text-center leading-tight">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="w-56 lg:w-64 h-full shrink-0 bg-[#121215] border-r border-[#2d2d33] flex flex-col pt-0 shadow-2xl md:shadow-none z-20">
      <div className="p-3 bg-[#16161a] border-b border-[#2d2d33] flex-shrink-0">
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={
              mode === "schematic"
                ? "Buscar símbolos..."
                : "Buscar footprints..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f13] border border-[#2d2d33] rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide md:custom-scrollbar">
          {['all', 'passive', 'ic', 'connector', 'custom'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-2 py-1 text-[10px] rounded-md uppercase font-bold whitespace-nowrap transition-colors",
                activeCategory === cat ? "bg-blue-600 text-white" : "bg-[#2d2d33] text-gray-400 hover:bg-[#3d3d45]"
              )}
            >
              {cat === 'all' ? 'Todos' : cat === 'passive' ? 'Passivos' : cat === 'ic' ? 'CIs' : cat === 'connector' ? 'Conect' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
        {mode === "schematic" ? (
          <>
            {!search && (
              <div className="p-2 mb-2 bg-[#16161a]">
                <div className="grid grid-cols-3 gap-1">
                  {schematicToolItems.map((item) => (
                    <button
                      key={`${item.type}-${item.label}`}
                      onClick={() => setTool(item.type as any)}
                      className={cn(
                        "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[10px] transition-colors border",
                        tool === item.type
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                          : "bg-[#1f1f24] text-gray-400 border-transparent hover:bg-[#2d2d33] hover:text-gray-200",
                      )}
                      title={item.label}
                    >
                      <ComponentImage type={item.type} icon={item.icon} className="w-4 h-4 mb-1" isIllustrative={userMode === 'beginner' && mode === 'schematic'} />
                      <span className="truncate w-full text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                {tool === "wire" && (
                  <div className="mt-2 flex space-x-1 justify-center p-1 bg-[#121215] rounded border border-[#2d2d33]">
                    {wireColors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setActiveWireColor(c.value)}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 transition-transform",
                          activeWireColor === c.value ? "scale-110 border-white" : "border-transparent"
                        )}
                        style={{ backgroundColor: c.value === '#000000' ? '#333' : c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {search ? (
              <div className="p-2 space-y-1">
                <div className="px-2 mb-2 text-[10px] font-bold text-gray-500 tracking-wider flex items-center justify-between">
                  <span>RESULTADOS</span>
                  <span className="bg-[#2d2d33] px-1.5 py-0.5 rounded text-white">
                    {filteredSchematic.length}
                  </span>
                </div>
                {filteredSchematic.map((item) => (
                  <button
                    key={`${item.type}-${item.label}`}
                    onClick={() => setTool(item.type as any)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-md text-xs transition-colors",
                      tool === item.type
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border border-transparent",
                    )}
                  >
                    <ComponentImage type={item.type} icon={item.icon} className="w-4 h-4 mr-3 shrink-0 opacity-70" isIllustrative={userMode === 'beginner' && mode === 'schematic'} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            ) : activeCategory === 'custom' ? (
              <div className="flex flex-col h-full">
                <div className="p-2 grid grid-cols-2 gap-2">
                  {customComponents.map((item: any) => renderGridButton(item))}
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center space-y-3 mt-4 border-t border-[#2d2d33]">
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1f] flex items-center justify-center border border-[#2d2d33]">
                    <BoxSelect className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">Componentes Customizados</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Crie seus próprios símbolos para o esquemático.</p>
                  </div>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-footprint-editor'))}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                  >
                    Criar Novo Componente
                  </button>
                </div>
              </div>
            ) : activeCategory !== 'all' ? (
              <div className="p-2 grid grid-cols-2 gap-2">
                {getCategorizedItems().map(i => renderGridButton(i))}
              </div>
            ) : (
              <>
                <Accordion title="Básicos e Semicondutores">
                  {[...passiveItems, ...(userMode === 'pro' ? semiconductorItems : semiconductorItems.filter(i => ['led', 'lamp', 'diode'].includes(i.type)))].map((i) => renderGridButton(i))}
                </Accordion>
                {userMode === 'pro' && (
                  <Accordion title="CIs e Microcontroladores" defaultOpen={false}>
                    {[...icItems, ...mcuItems, ...realPartsCatalog].map((i) => renderGridButton(i))}
                  </Accordion>
                )}
                <Accordion title="Energia e Instrumentos" defaultOpen={userMode === 'beginner'}>
                  {[...powerItems, ...(userMode === 'pro' ? instrumentItems : [])].map((i) => renderGridButton(i))}
                </Accordion>
                <Accordion title="Módulos & Outros" defaultOpen={false}>
                  {userMode === 'pro' ? electroItems.map((i) => renderGridButton(i)) : electroItems.filter(i => ['switch', 'buzzer', 'motor'].includes(i.type)).map((i) => renderGridButton(i))}
                </Accordion>
                {userMode === 'pro' && (
                  <Accordion title="Sensores & Módulos Extras">
                    {sensorItems.map((i) => renderGridButton(i))}
                  </Accordion>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {!search && (
              <div className="p-2 mb-2 bg-[#16161a] border-b border-[#2d2d33]">
                <div className="flex gap-1 mb-2">
                  <button
                    onClick={() => setActivePcbLayer("top")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center p-1.5 rounded-md text-[10px] font-bold transition-all border",
                      activePcbLayer === "top"
                        ? "bg-red-500/20 text-red-500 border-red-500/50"
                        : "bg-[#1f1f24] text-gray-500 border-transparent hover:bg-red-500/10 hover:text-red-400",
                    )}
                  >
                    <Layers className="w-3.5 h-3.5 mb-1" /> TOP (F.Cu)
                  </button>
                  <button
                    onClick={() => setActivePcbLayer("bottom")}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center p-1.5 rounded-md text-[10px] font-bold transition-all border",
                      activePcbLayer === "bottom"
                        ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                        : "bg-[#1f1f24] text-gray-500 border-transparent hover:bg-blue-500/10 hover:text-blue-400",
                    )}
                  >
                    <Layers className="w-3.5 h-3.5 mb-1" /> BOT (B.Cu)
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1">
                  {pcbToolItems.map((item, index) => (
                    <button
                      key={`${item.type}-${item.label || index}`}
                      onClick={() => setPcbTool(item.type as any)}
                      className={cn(
                        "flex flex-col items-center justify-center py-2 px-1 rounded-md text-[10px] transition-colors border",
                        pcbTool === item.type
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                          : "bg-[#1f1f24] text-gray-400 border-transparent hover:bg-[#2d2d33] hover:text-gray-200",
                      )}
                      title={item.label}
                    >
                      <ComponentImage type={item.type} icon={item.icon} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {search ? (
              <div className="p-2 space-y-1">
                <div className="px-2 mb-2 text-[10px] font-bold text-gray-500 tracking-wider flex items-center justify-between">
                  <span>RESULTADOS</span>
                  <span className="bg-[#2d2d33] px-1.5 py-0.5 rounded text-white">
                    {filteredPcb.length}
                  </span>
                </div>
                {filteredPcb.map((item, index) => (
                  <button
                    key={`${item.type}-${item.label || index}`}
                    onClick={() => setPcbTool(item.type as any)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-md text-xs transition-colors",
                      pcbTool === item.type
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border border-transparent",
                    )}
                  >
                    <ComponentImage type={item.type} icon={item.icon} className="w-4 h-4 mr-3 shrink-0 opacity-70" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            ) : activeCategory === 'custom' ? (
              <div className="flex flex-col h-full">
                <div className="p-2 grid grid-cols-2 gap-2">
                  {customComponents.map((item: any) => renderGridButton(item, true))}
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center space-y-3 mt-4 border-t border-[#2d2d33]">
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1f] flex items-center justify-center border border-[#2d2d33]">
                    <BoxSelect className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">Footprints Customizados</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Desenhe pads e layouts para o seu projeto.</p>
                  </div>
                  <button
                    onClick={() => window.dispatchEvent(new Event('open-footprint-editor'))}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                  >
                    Criar Novo Footprint
                  </button>
                </div>
              </div>
            ) : activeCategory !== 'all' ? (
              <div className="p-2 grid grid-cols-2 gap-2">
                {getCategorizedPcbItems().map(i => renderGridButton(i, true))}
              </div>
            ) : (
              <>
                <Accordion title="Mecânicos e Pads">
                  {pcbComponentItems
                    .filter((i) =>
                      ["pad", "via", "copper_pour", "fiducial", "mounting_hole", "test_point", "silkscreen_text"].includes(i.type),
                    )
                    .map((i) => renderGridButton(i, true))}
                </Accordion>
                {userMode === 'pro' && (
                  <Accordion title="Standard Footprints">
                    {pcbComponentItems
                      .filter(
                        (i) =>
                          ![
                            "pad",
                            "via",
                            "copper_pour",
                            "fiducial",
                            "mounting_hole",
                            "test_point",
                            "silkscreen_text",
                            "usb_c",
                            "micro_usb",
                            "cr2032",
                            "crystal",
                            "ldr_smd",
                            "ntc_smd",
                          ].includes(i.type),
                      )
                      .map((i) => renderGridButton(i, true))}
                  </Accordion>
                )}
                {userMode === 'pro' && (
                  <Accordion title="Módulos & Outros">
                    {pcbComponentItems
                      .filter((i) =>
                        [
                          "usb_c",
                          "micro_usb",
                          "cr2032",
                          "crystal",
                          "ldr_smd",
                          "ntc_smd",
                        ].includes(i.type),
                      )
                      .map((i) => renderGridButton(i, true))}
                  </Accordion>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
