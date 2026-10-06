import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /default:\s*\{\s*const typeForSchematic = comp.componentType as any;\s*const PCBGenericSymbol[\s\S]*?SymbolView = \(props: any\) => <PCBGenericSymbol \{\.\.\.props\} compName=\{comp\.name\} componentType=\{comp\.componentType\} \/>;\s*\}/g;

const newBlock = `default:
                    {
                      const typeForSchematic = comp.componentType as any;
                      let InnerSymbol: any = PCBPadSymbol;
                      switch (typeForSchematic) {
                          case "resistor":
                            InnerSymbol = ResistorSymbol;
                            break;
                          case "capacitor":
                            InnerSymbol = CapacitorSymbol;
                            break;
                          case "capacitor_elec":
                            InnerSymbol = CapacitorElectrolyticSymbol;
                            break;
                          case "inductor":
                            InnerSymbol = InductorSymbol;
                            break;
                          case "diode":
                            InnerSymbol = DiodeSymbol;
                            break;
                          case "zener_diode":
                            InnerSymbol = ZenerDiodeSymbol;
                            break;
                          case "transistor":
                            InnerSymbol = TransistorSymbol;
                            break;
                          case "transistor_pnp":
                            InnerSymbol = TransistorPNPSymbol;
                            break;
                          case "mosfet":
                            InnerSymbol = MosfetSymbol;
                            break;
                          case "mosfet_p":
                            InnerSymbol = MosfetPSymbol;
                            break;
                          case "timer555":
                            InnerSymbol = Timer555Symbol;
                            break;
                          case "opamp":
                            InnerSymbol = OpampSymbol;
                            break;
                          case "logic_gate":
                          case "logic_and":
                          case "logic_or":
                          case "logic_nand":
                          case "logic_not":
                          case "logic_nor":
                          case "logic_xor":
                            InnerSymbol = LogicGateSymbol;
                            break;
                          case "ac_source":
                          case "dc_source":
                            InnerSymbol = SourceSymbol;
                            break;
                          case "switch":
                          case "pushbutton":
                            InnerSymbol = SwitchSymbol;
                            break;
                          case "led":
                            InnerSymbol = LEDSymbol;
                            break;
                          case "lamp":
                            InnerSymbol = LampSymbol;
                            break;
                          case "motor":
                          case "servo_motor":
                          case "stepper_motor":
                            InnerSymbol = MotorSymbol;
                            break;
                          case "buzzer":
                          case "speaker":
                            InnerSymbol = SpeakerSymbol;
                            break;
                          case "antenna":
                            InnerSymbol = AntennaSymbol;
                            break;
                          case "microphone":
                            InnerSymbol = MicrophoneSymbol;
                            break;
                          case "battery":
                            InnerSymbol = BatterySymbol;
                            break;
                          case "voltmeter":
                          case "ammeter":
                          case "ohmmeter":
                          case "oscilloscope":
                          case "multimeter":
                          case "digital_multimeter":
                            InnerSymbol = MeterSymbol;
                            break;
                          case "ldr":
                          case "photodiode":
                          case "thermistor":
                            InnerSymbol = SensorSymbol;
                            break;
                          case "potentiometer":
                            InnerSymbol = PotentiometerSymbol;
                            break;
                          case "transformer":
                            InnerSymbol = TransformerSymbol;
                            break;
                          case "relay":
                            InnerSymbol = RelaySymbol;
                            break;
                          case "arduino_uno":
                          case "esp32":
                          case "esp32_cam":
                          case "raspberry_pi":
                          case "attiny85":
                          case "stm32_bluepill":
                            InnerSymbol = IC_Symbol;
                            break;
                          case "ic":
                            InnerSymbol = IC_Symbol;
                            break;
                          default:
                            InnerSymbol = PCBPadSymbol;
                      }

                      const PCBGenericSymbol = ({ x, y, rotation, selected, customProps, compName, componentType, layer, value }: any) => {
                          let w = 40, h = 40;
                          let cx = 0, cy = 0;
                          const pins = getPcbComponentPins({ componentType, name: compName, customProps });
                          
                          if (pins && pins.length > 0) {
                              const xs = pins.map((p: any) => p.x);
                              const ys = pins.map((p: any) => p.y);
                              const minX = Math.min(...xs);
                              const maxX = Math.max(...xs);
                              const minY = Math.min(...ys);
                              const maxY = Math.max(...ys);
                              w = (maxX - minX) + 20;
                              h = (maxY - minY) + 20;
                              cx = (minX + maxX) / 2;
                              cy = (minY + maxY) / 2;
                              if (w < 20) w = 20;
                              if (h < 20) h = 20;
                          }
                          const color = layer === "top" ? "#fbbf24" : "#60a5fa";
                          return (
                             <Group x={x} y={y} rotation={rotation} draggable={false}>
                                <Rect x={cx - w/2} y={cy - h/2} width={w} height={h} stroke={color} strokeWidth={1.5} dash={[4, 4]} />
                                <InnerSymbol x={0} y={0} rotation={0} selected={selected} customProps={customProps} value={value} />
                             </Group>
                          );
                      };
                      SymbolView = (props: any) => <PCBGenericSymbol {...props} compName={comp.name} componentType={comp.componentType} layer={comp.layer} value={comp.value} />;
                    }`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/components/CanvasEditor.tsx', content);
console.log("Patched PCB silkscreen");
