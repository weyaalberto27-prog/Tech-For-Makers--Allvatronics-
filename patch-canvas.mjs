import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

content = content.replace(/InnerSymbol = SourceSymbol;/g, 'InnerSymbol = ACSourceSymbol;');
content = content.replace(/InnerSymbol = SwitchSymbol;/g, 'InnerSymbol = ACSourceSymbol; /* TODO */');
content = content.replace(/InnerSymbol = LEDSymbol;/g, 'InnerSymbol = ACSourceSymbol;');
content = content.replace(/InnerSymbol = LampSymbol;/g, 'InnerSymbol = ACSourceSymbol;');
content = content.replace(/InnerSymbol = SpeakerSymbol;/g, 'InnerSymbol = BuzzerSymbol;');
content = content.replace(/InnerSymbol = AntennaSymbol;/g, 'InnerSymbol = ModuleSymbol;');
content = content.replace(/InnerSymbol = MicrophoneSymbol;/g, 'InnerSymbol = ModuleSymbol;');
content = content.replace(/InnerSymbol = BatterySymbol;/g, 'InnerSymbol = PowerSupplySymbol;');
content = content.replace(/InnerSymbol = MeterSymbol;/g, 'InnerSymbol = VoltmeterSymbol;');
content = content.replace(/InnerSymbol = SensorSymbol;/g, 'InnerSymbol = ModuleSymbol;');
content = content.replace(/InnerSymbol = PotentiometerSymbol;/g, 'InnerSymbol = PotentiometerSymbol;');
content = content.replace(/InnerSymbol = TransformerSymbol;/g, 'InnerSymbol = ModuleSymbol;');
content = content.replace(/InnerSymbol = RelaySymbol;/g, 'InnerSymbol = RelaySymbol;');
content = content.replace(/InnerSymbol = IC_Symbol;/g, 'InnerSymbol = ICSymbol;');

fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched missing symbols");
