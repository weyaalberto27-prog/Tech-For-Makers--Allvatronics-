import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

content = content.replace(/\['ultrasonic', 'dht11', 'hc05', 'esp8266', 'accelerometer', 'gps', 'motor_driver', 'gas_sensor'\]/g, "['ultrasonic', 'dht11', 'hc05', 'esp8266', 'accelerometer', 'gps', 'motor_driver', 'gas_sensor', 'accelerometer_pcb', 'gps_pcb', 'gas_sensor_pcb']");
content = content.replace(/comp\.componentType === 'accelerometer'/g, "comp.componentType === 'accelerometer' || comp.componentType === 'accelerometer_pcb'");
content = content.replace(/comp\.componentType === 'gps'/g, "comp.componentType === 'gps' || comp.componentType === 'gps_pcb'");
content = content.replace(/comp\.componentType === 'gas_sensor'/g, "comp.componentType === 'gas_sensor' || comp.componentType === 'gas_sensor_pcb'");

fs.writeFileSync('src/lib/simulator.ts', content);
