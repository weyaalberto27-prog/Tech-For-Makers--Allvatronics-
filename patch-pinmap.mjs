import fs from 'fs';
let content = fs.readFileSync('src/lib/pinmap.ts', 'utf-8');

const oldCode = `  const isStandardPcbPackage = ["smd", "dip8", "sot23", "to220", "sop", "qfp", "bga", "battery_9v", "cr2032", "usb_c", "micro_usb", "ldr_smd", "ntc_smd", "crystal", "gas_sensor_pcb", "accelerometer_pcb", "gps_pcb", "pad", "via"].includes(pcbType);
  if (numPins > 0 && (!isStandardPcbPackage || pcbType === "pinheader")) {`;

const newCode = `  const isStandardPcbPackage = ["smd", "dip8", "sot23", "to220", "sop", "qfp", "bga", "battery_9v", "cr2032", "usb_c", "micro_usb", "ldr_smd", "ntc_smd", "crystal", "gas_sensor_pcb", "accelerometer_pcb", "gps_pcb", "pad", "via"].includes(pcbType);
  
  // If it is in pinMap and NOT a standard PCB package, we should just use pinMap (unless it's a generic IC with no pinMap entry)
  const hasSchematicPins = !!pinMap[pcbType];
  
  if (numPins > 0 && (!isStandardPcbPackage || pcbType === "pinheader") && (!hasSchematicPins || pcbType === "ic")) {`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/lib/pinmap.ts', content);
console.log("Patched pinmap.ts");
