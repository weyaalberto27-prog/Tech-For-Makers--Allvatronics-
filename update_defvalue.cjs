const fs = require('fs');
let code = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');

const regex = /else if \(tool === "lamp"\) defValue = "220V";/;
const replacement = `else if (tool === "lamp") defValue = "220V";
        else if (["arduino_uno", "attiny85", "raspberry_pi"].includes(tool)) defValue = "5V";
        else if (["esp32", "esp32s3", "esp32_cam", "stm32_bluepill", "esp8266"].includes(tool)) defValue = "3.3V";`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/CanvasEditor.tsx', code);
