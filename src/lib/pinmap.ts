import { Point } from '../types';

export const pinMap: Record<string, Point[]> = {
  a4988: [...Array.from({length: 8}).map((_, i) => ({x: -6.5, y: -7.5 + i * 2})), ...Array.from({length: 8}).map((_, i) => ({x: 6.5, y: -7.5 + i * 2}))],
  stepper_motor: [{x:-15, y:30}, {x:-5, y:30}, {x:5, y:30}, {x:15, y:30}],
  motor_driver: [...Array.from({length: 8}).map((_, i) => ({x: -15, y: -35 + i*10})), ...Array.from({length: 8}).map((_, i) => ({x: 15, y: -35 + i*10}))],
  digital_multimeter: [{x:-10, y:115}, {x:10, y:115}],
  esp32s3: [...Array.from({length: 22}).map((_, i) => ({x: -19.4, y: -84 + i * 8})), ...Array.from({length: 22}).map((_, i) => ({x: 19.4, y: -84 + i * 8}))],
  hc05: [{x:-12.5, y:-14}, {x:-7.5, y:-14}, {x:-2.5, y:-14}, {x:2.5, y:-14}, {x:7.5, y:-14}, {x:12.5, y:-14}],
  dht11: [{x:-8, y:0}, {x:0, y:0}, {x:8, y:0}],
  esp8266: [...Array.from({length: 8}).map((_, i) => ({x:-18, y:-14+i*4})), ...Array.from({length: 8}).map((_, i) => ({x:18, y:-14+i*4}))],

  
  
  ultrasonic: [{x:-15, y:15}, {x:-5, y:15}, {x:5, y:15}, {x:15, y:15}],
  gas_sensor: [{x:-15,y:20}, {x:-5,y:20}, {x:5,y:20}, {x:15,y:20}],
  accelerometer: [{x: -8.75, y: 20}, {x: -6.25, y: 20}, {x: -3.75, y: 20}, {x: -1.25, y: 20}, {x: 1.25, y: 20}, {x: 3.75, y: 20}, {x: 6.25, y: 20}, {x: 8.75, y: 20}],
  gps: [{x:-7.5,y:-16}, {x:-2.5,y:-16}, {x:2.5,y:-16}, {x:7.5,y:-16}],
  cr2032: [{x:-15,y:20}, {x:15,y:20}],
  crystal: [{x:-10,y:20}, {x:10,y:20}],
  lamp: [{x:-15, y:30}, {x:15, y:30}],
  switch: [{x:-15, y:0}, {x:15, y:0}],
  pushbutton: [{x:-15, y:0}, {x:15, y:0}],
  buzzer: [{x:-5, y:20}, {x:5, y:20}],
  speaker: [{x:-5, y:20}, {x:5, y:20}],
  potentiometer: [{x:-10, y:15}, {x:0, y:15}, {x:10, y:15}],
  relay: [{x:-10, y:20}, {x:10, y:20}, {x:-10, y:-20}, {x:0, y:-20}, {x:10, y:-20}],
  relay_module: [{x: -16, y: -7.5}, {x: -16, y: 0}, {x: -16, y: 7.5}, {x: 18, y: -3}, {x: 18, y: 0}, {x: 18, y: 3}],
  ldr: [{x:-15, y:0}, {x:15, y:0}],
  ntc: [{x:-15, y:0}, {x:15, y:0}],

  resistor: [{x:-30,y:0}, {x:30,y:0}],
  capacitor: [{x:-20,y:0}, {x:20,y:0}],
  capacitor_elec: [{x:-10,y:30}, {x:10,y:30}],
  battery: [{x:-10, y:-40}, {x:10, y:-40}],
  battery_9v: [{x:-10, y:-40}, {x:10, y:-40}],
  transistor: [{x:-10, y:30}, {x:0, y:30}, {x:10, y:30}],
  transistor_pnp: [{x:-10, y:30}, {x:0, y:30}, {x:10, y:30}],
  
  led: [{x:-10,y:10}, {x:10,y:0}],
  diode: [{x:-15,y:0}, {x:15,y:0}],
  zener_diode: [{x:-15,y:0}, {x:15,y:0}],
  
  powersupply: [{x:-10,y:40}, {x:10,y:40}],
  ac_source: [{x:0,y:-30}, {x:0,y:30}],
  inductor: [{x:-15,y:0}, {x:15,y:0}],
  
  ground: [{x:0,y:0}],
  
  
  motor: [{x:-10,y:30}, {x:10,y:30}],
  
  
  
  ic: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  timer555: [
    {x:-15,y:20},{x:-5,y:20},{x:5,y:20},{x:15,y:20},
    {x:15,y:-20},{x:5,y:-20},{x:-5,y:-20},{x:-15,y:-20}
  ],
  opamp: [
    {x:-15,y:20},{x:-5,y:20},{x:5,y:20},{x:15,y:20},
    {x:15,y:-20},{x:5,y:-20},{x:-5,y:-20},{x:-15,y:-20}
  ],
  logic_gate: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_not: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_and: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_or: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_nand: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_nor: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  logic_xor: [
    {x:-30,y:20}, {x:-20,y:20}, {x:-10,y:20}, {x:0,y:20}, {x:10,y:20}, {x:20,y:20}, {x:30,y:20},
    {x:30,y:-20}, {x:20,y:-20}, {x:10,y:-20}, {x:0,y:-20}, {x:-10,y:-20}, {x:-20,y:-20}, {x:-30,y:-20}
  ],
  
  
  
  mosfet: [{x:-10,y:30}, {x:0,y:30}, {x:10,y:30}],
  mosfet_p: [{x:-10,y:30}, {x:0,y:30}, {x:10,y:30}],
  servo_motor: [{x:-10,y:20}, {x:0,y:20}, {x:10,y:20}],
  attiny85: [
    {x:-15,y:-15}, {x:-15,y:-5}, {x:-15,y:5}, {x:-15,y:15},
    {x:15,y:15}, {x:15,y:5}, {x:15,y:-5}, {x:15,y:-15}
  ],
  stm32_bluepill: [
    ...Array.from({length: 20}).map((_, i) => ({x: -20, y: -76 + i * 8})),
    ...Array.from({length: 20}).map((_, i) => ({x: 20, y: 76 - i * 8}))
  ],
  seven_segment: [
    {x:-20,y:-45}, {x:-10,y:-45}, {x:0,y:-45}, {x:10,y:-45}, {x:20,y:-45},
    {x:-20,y:45}, {x:-10,y:45}, {x:0,y:45}, {x:10,y:45}, {x:20,y:45}
  ],
  oled: [{x:-22, y:55}, {x:-7.3, y:55}, {x:7.3, y:55}, {x:22, y:55}],
  protoboard: Array.from({length: 60 * 10}).map((_, i) => ({
    x: -290 + (i % 60) * 10,
    y: (i < 300 ? -20 - Math.floor(i / 60) * 10 : 20 + Math.floor((i - 300) / 60) * 10)
  })).concat(Array.from({length: 60 * 4}).map((_, i) => ({
    x: -290 + (i % 60) * 10,
    y: (i < 120 ? -90 + Math.floor(i / 60) * 10 : 80 + Math.floor((i - 120) / 60) * 10)
  }))),
  usb_c: [
    {x:25, y:-4}, {x:25, y:4}
  ],
  micro_usb: [
    {x:-10, y:20}, {x:10, y:20}
  ],
  arduino_uno: [...Array.from({length: 14}).map((_, i) => ({x: (-41 + i * 6) * 1.6, y: -88})), ...Array.from({length: 6}).map((_, i) => ({x: (-41 + i * 6) * 1.6, y: 88})), ...Array.from({length: 6}).map((_, i) => ({x: (19 + i * 6) * 1.6, y: 88}))],
  esp32: [...Array.from({length: 15}).map((_, i) => ({x: -19.4, y: -28 + i * 4})), ...Array.from({length: 15}).map((_, i) => ({x: 19.4, y: -28 + i * 4}))],
  esp32_cam: [...Array.from({length: 8}).map((_, i) => ({x: -19.4, y: -14 + i * 4})), ...Array.from({length: 8}).map((_, i) => ({x: 19.4, y: -14 + i * 4}))],
  raspberry_pi: [...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -40})), ...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -35}))]
};

export const pcbPinMap: Record<string, Point[]> = {
  transistor: [{x: -10, y: 0}, {x: 0, y: 0}, {x: 10, y: 0}],
  transistor_pnp: [{x: -10, y: 0}, {x: 0, y: 0}, {x: 10, y: 0}],
  resistor: [{x: -15, y: 0}, {x: 15, y: 0}],
  capacitor: [{x: -10, y: 0}, {x: 10, y: 0}],
  capacitor_elec: [{x: -5, y: 0}, {x: 5, y: 0}],
  inductor: [{x: -15, y: 0}, {x: 15, y: 0}],
  diode: [{x: -15, y: 0}, {x: 15, y: 0}],
  zener_diode: [{x: -15, y: 0}, {x: 15, y: 0}],
  led: [{x: -5, y: 0}, {x: 5, y: 0}],
  battery: [{x: -10, y: 0}, {x: 10, y: 0}],
  battery_9v: [{x: -10, y: 0}, {x: 10, y: 0}],
  powersupply: [{x: -10, y: 0}, {x: 10, y: 0}],
  ac_source: [{x: -10, y: 0}, {x: 10, y: 0}],
  dc_source: [{x: -10, y: 0}, {x: 10, y: 0}],
  switch: [{x: -10, y: -7.5}, {x: 10, y: -7.5}, {x: -10, y: 7.5}, {x: 10, y: 7.5}],
  pushbutton: [{x: -10, y: -7.5}, {x: 10, y: -7.5}, {x: -10, y: 7.5}, {x: 10, y: 7.5}],
  buzzer: [{x: -5, y: 0}, {x: 5, y: 0}],
  speaker: [{x: -5, y: 0}, {x: 5, y: 0}],
  lamp: [{x: -9, y: 0}, {x: 9, y: 0}],
  motor: [{x: -4, y: -11}, {x: 4, y: -11}],
  servo_motor: [{x: -11, y: -2}, {x: -11, y: 0}, {x: -11, y: 2}],
  stepper_motor: [{x: -15, y: 30}, {x: -5, y: 30}, {x: 5, y: 30}, {x: 15, y: 30}],
  pad: [{x: 0, y: 0}],
  via: [{x: 0, y: 0}],
  smd: [{x: -10, y: 0}, {x: 10, y: 0}],
  dip8: [
    {x: -15, y: -15}, {x: -5, y: -15}, {x: 5, y: -15}, {x: 15, y: -15},
    {x: 15, y: 15}, {x: 5, y: 15}, {x: -5, y: 15}, {x: -15, y: 15}
  ],
  timer555: [
    {x: -15, y: -15}, {x: -5, y: -15}, {x: 5, y: -15}, {x: 15, y: -15},
    {x: 15, y: 15}, {x: 5, y: 15}, {x: -5, y: 15}, {x: -15, y: 15}
  ],
  opamp: [
    {x: -15, y: -15}, {x: -5, y: -15}, {x: 5, y: -15}, {x: 15, y: -15},
    {x: 15, y: 15}, {x: 5, y: 15}, {x: -5, y: 15}, {x: -15, y: 15}
  ],
  attiny85: [
    {x: -15, y: -15}, {x: -5, y: -15}, {x: 5, y: -15}, {x: 15, y: -15},
    {x: 15, y: 15}, {x: 5, y: 15}, {x: -5, y: 15}, {x: -15, y: 15}
  ],
  logic_gate: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_and: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_or: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_not: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_nand: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_nor: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  logic_xor: [
    {x: -30, y: -15}, {x: -20, y: -15}, {x: -10, y: -15}, {x: 0, y: -15}, {x: 10, y: -15}, {x: 20, y: -15}, {x: 30, y: -15},
    {x: 30, y: 15}, {x: 20, y: 15}, {x: 10, y: 15}, {x: 0, y: 15}, {x: -10, y: 15}, {x: -20, y: 15}, {x: -30, y: 15}
  ],
  relay: [{x: -6, y: -6}, {x: -6, y: 0}, {x: -6, y: 6}, {x: 6, y: -6}, {x: 6, y: 6}],
  relay_module: [{x: -16, y: -7.5}, {x: -16, y: 0}, {x: -16, y: 7.5}, {x: 18, y: -3}, {x: 18, y: 0}, {x: 18, y: 3}],
  usb_c: [{x: -11.5, y: 10}, {x: 11.5, y: 10}],
  micro_usb: [{x: -4.5, y: 8}, {x: 4.5, y: 8}],
  oled: [{x: -7.5, y: -12}, {x: -2.5, y: -12}, {x: 2.5, y: -12}, {x: 7.5, y: -12}],
  seven_segment: [
    {x:-10,y:-15}, {x:-5,y:-15}, {x:0,y:-15}, {x:5,y:-15}, {x:10,y:-15},
    {x:-10,y:15}, {x:-5,y:15}, {x:0,y:15}, {x:5,y:15}, {x:10,y:15}
  ],
  potentiometer: [{x: -10, y: 12}, {x: 0, y: 12}, {x: 10, y: 12}],
  accelerometer_pcb: [{x:-8.75,y:-8}, {x:-6.25,y:-8}, {x:-3.75,y:-8}, {x:-1.25,y:-8}, {x:1.25,y:-8}, {x:3.75,y:-8}, {x:6.25,y:-8}, {x:8.75,y:-8}],
  accelerometer: [{x:-8.75,y:-8}, {x:-6.25,y:-8}, {x:-3.75,y:-8}, {x:-1.25,y:-8}, {x:1.25,y:-8}, {x:3.75,y:-8}, {x:6.25,y:-8}, {x:8.75,y:-8}],
  gas_sensor_pcb: [{x:-15,y:0}, {x:-5,y:0}, {x:5,y:0}, {x:15,y:0}],
  gas_sensor: [{x:-15,y:0}, {x:-5,y:0}, {x:5,y:0}, {x:15,y:0}],
  gps_pcb: [{x:-7.5,y:-16}, {x:-2.5,y:-16}, {x:2.5,y:-16}, {x:7.5,y:-16}],
  gps: [{x:-7.5,y:-16}, {x:-2.5,y:-16}, {x:2.5,y:-16}, {x:7.5,y:-16}],
  sot23: [{x:-10, y:-10}, {x:-10, y:10}, {x:10, y:0}],
  to220: [{x:-10, y:0}, {x:0, y:0}, {x:10, y:0}],
  mosfet: [{x:-10, y:0}, {x:0, y:0}, {x:10, y:0}],
  mosfet_p: [{x:-10, y:0}, {x:0, y:0}, {x:10, y:0}],
  sop: [
    {x:-15, y:-7.5}, {x:-15, y:-2.5}, {x:-15, y:2.5}, {x:-15, y:7.5},
    {x:15, y:7.5}, {x:15, y:2.5}, {x:15, y:-2.5}, {x:15, y:-7.5}
  ],
  soic: [
    {x:-15, y:-7.5}, {x:-15, y:-2.5}, {x:-15, y:2.5}, {x:-15, y:7.5},
    {x:15, y:7.5}, {x:15, y:2.5}, {x:15, y:-2.5}, {x:15, y:-7.5}
  ],
  qfp: [
    {x:-20, y:-15}, {x:-20, y:-5}, {x:-20, y:5}, {x:-20, y:15},
    {x:-15, y:20}, {x:-5, y:20}, {x:5, y:20}, {x:15, y:20},
    {x:20, y:15}, {x:20, y:5}, {x:20, y:-5}, {x:20, y:-15},
    {x:15, y:-20}, {x:5, y:-20}, {x:-5, y:-20}, {x:-15, y:-20}
  ],
  bga: [
    {x:-10, y:-10}, {x:-10, y:0}, {x:-10, y:10},
    {x:0, y:-10},   {x:0, y:0},   {x:0, y:10},
    {x:10, y:-10},  {x:10, y:0},  {x:10, y:10}
  ],
  pinheader: [{x:-15, y:0}, {x:-5, y:0}, {x:5, y:0}, {x:15, y:0}],
  cr2032: [{x:-10, y:0}, {x:10, y:0}],
  ldr_smd: [{x:-5, y:0}, {x:5, y:0}],
  ldr: [{x:-5, y:0}, {x:5, y:0}],
  ntc_smd: [{x:-5, y:0}, {x:5, y:0}],
  ntc: [{x:-5, y:0}, {x:5, y:0}],
  thermistor: [{x:-5, y:0}, {x:5, y:0}],
  crystal: [{x:-5, y:0}, {x:5, y:0}],
  dht11: [{x:-8, y:0}, {x:0, y:0}, {x:8, y:0}],
  hc05: [{x:-12.5, y:-14}, {x:-7.5, y:-14}, {x:-2.5, y:-14}, {x:2.5, y:-14}, {x:7.5, y:-14}, {x:12.5, y:-14}],
  ultrasonic: [{x:-15, y:15}, {x:-5, y:15}, {x:5, y:15}, {x:15, y:15}],
  arduino_uno: [
    ...Array.from({length: 14}).map((_, i) => ({x: -24.2 + i * 3.73, y: -38})),
    ...Array.from({length: 16}).map((_, i) => ({x: -28 + i * 3.73, y: 38}))
  ],
  esp32: [
    ...Array.from({length: 15}).map((_, i) => ({x: -19.4, y: -28 + i * 4})),
    ...Array.from({length: 15}).map((_, i) => ({x: 19.4, y: -28 + i * 4}))
  ],
  esp32_cam: [
    ...Array.from({length: 8}).map((_, i) => ({x: -19.4, y: -14 + i * 4})),
    ...Array.from({length: 8}).map((_, i) => ({x: 19.4, y: -14 + i * 4}))
  ],
  esp32s3: [
    ...Array.from({length: 22}).map((_, i) => ({x: -19.4, y: -42 + i * 4})),
    ...Array.from({length: 22}).map((_, i) => ({x: 19.4, y: -42 + i * 4}))
  ],
  raspberry_pi: [
    ...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -39.8})),
    ...Array.from({length: 20}).map((_, i) => ({x: -63 + i * 5, y: -34.8}))
  ],
  stm32_bluepill: [
    ...Array.from({length: 20}).map((_, i) => ({x: -14.6, y: -37.4 + i * 4})),
    ...Array.from({length: 20}).map((_, i) => ({x: 14.6, y: -37.4 + i * 4}))
  ]
};

export function getComponentPins(comp: any): Point[] {
  const basePins = pinMap[comp.componentType] || [{ x: 0, y: 0 }];
  if (comp.customProps && comp.customProps.pinOffsets) {
     return basePins.map((p, i) => {
        const offset = comp.customProps.pinOffsets[i];
        return offset ? { x: p.x + offset.x, y: p.y + offset.y } : p;
     });
  }
  if (comp.componentType === "digital_multimeter") {
     const blackX = comp.customProps?.probeBlackX ?? basePins[0].x;
     const blackY = comp.customProps?.probeBlackY ?? basePins[0].y;
     const redX = comp.customProps?.probeRedX ?? basePins[1].x;
     const redY = comp.customProps?.probeRedY ?? basePins[1].y;
     return [{x: blackX, y: blackY}, {x: redX, y: redY}];
  }
  return basePins;
}

export function getPcbComponentPins(comp: any): Point[] {
  const pcbType = comp.componentType;
  const numPins = comp.customProps?.pins ? parseInt(comp.customProps.pins) : 0;

  if (pcbType === "pinheader" && numPins > 0) {
    const pins: Point[] = [];
    const pinGap = 10;
    const startX = -((numPins - 1) * pinGap) / 2;
    for (let i = 0; i < numPins; i++) {
      pins.push({ x: startX + i * pinGap, y: 0 });
    }
    return pins;
  }

  if (["dip8", "attiny85", "timer555", "opamp"].includes(pcbType)) {
    return [
      { x: -15, y: -15 }, { x: -5, y: -15 }, { x: 5, y: -15 }, { x: 15, y: -15 },
      { x: 15, y: 15 }, { x: 5, y: 15 }, { x: -5, y: 15 }, { x: -15, y: 15 }
    ];
  }

  if (["logic_gate", "logic_and", "logic_or", "logic_not", "logic_nand", "logic_nor", "logic_xor"].includes(pcbType)) {
    return [
      { x: -30, y: -15 }, { x: -20, y: -15 }, { x: -10, y: -15 }, { x: 0, y: -15 }, { x: 10, y: -15 }, { x: 20, y: -15 }, { x: 30, y: -15 },
      { x: 30, y: 15 }, { x: 20, y: 15 }, { x: 10, y: 15 }, { x: 0, y: 15 }, { x: -10, y: 15 }, { x: -20, y: 15 }, { x: -30, y: 15 }
    ];
  }

  if (pcbType === "ic") {
    const p = numPins || 8;
    const pinGap = 10;
    const half = p / 2;
    const pins: Point[] = [];
    for (let i = 0; i < half; i++) {
      const px = (i - (half - 1) / 2) * pinGap;
      pins.push({ x: px, y: -15 });
    }
    for (let i = half - 1; i >= 0; i--) {
      const px = (i - (half - 1) / 2) * pinGap;
      pins.push({ x: px, y: 15 });
    }
    return pins;
  }

  if (pcbType === "sop" || pcbType === "soic") {
    const p = numPins || 8;
    const pinGap = 5;
    const half = p / 2;
    const pins: Point[] = [];
    for (let i = 0; i < half; i++) {
      const py = (i - (half - 1) / 2) * pinGap;
      pins.push({ x: -15, y: py });
    }
    for (let i = half - 1; i >= 0; i--) {
      const py = (i - (half - 1) / 2) * pinGap;
      pins.push({ x: 15, y: py });
    }
    return pins;
  }

  if (pcbPinMap[pcbType]) {
    return pcbPinMap[pcbType];
  }

  if (pinMap[pcbType]) {
    return pinMap[pcbType];
  }

  return [{ x: 0, y: 0 }];
}
