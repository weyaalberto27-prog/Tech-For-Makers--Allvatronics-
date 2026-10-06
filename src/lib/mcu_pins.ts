export const mcuLabels: Record<string, string[]> = {
  arduino_uno: [
    // Bottom 14 pins (left to right):
    "NC", "IOREF", "RST", "3V3", "5V", "GND", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5",
    // Top-left 6 pins:
    "SCL", "SDA", "AREF", "GND", "D13", "D12",
    // Top-right 6 pins:
    "D11", "D10", "D9", "D8", "D7", "D6"
  ],
  esp32: [
    // Left side (15 pins)
    "EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "D13", "GND", "VIN",
    // Right side (15 pins)
    "D23", "D22", "TX0", "RX0", "D21", "D19", "D18", "D5", "TX2", "RX2", "D4", "D2", "D15", "GND", "3V3"
  ],
  esp32_cam: [
    // Left side (8 pins)
    "5V", "GND", "D12", "D13", "D15", "D14", "D2", "D4",
    // Right side (8 pins)
    "3V3", "GND", "RX", "TX", "GND", "D16", "D0", "GND"
  ],
  esp32s3: [
    // Left 22
    "3V3", "3V3", "RST", "4", "5", "6", "7", "15", "16", "17", "18", "8", "19", "20", "3", "46", "9", "10", "11", "12", "13", "14",
    // Right 22
    "5V", "GND", "GND", "43", "44", "1", "2", "42", "41", "40", "39", "38", "37", "36", "35", "0", "45", "48", "47", "21", "GND", "GND"
  ],
  raspberry_pi: [
    // Top row (20 pins)
    "3V3", "SDA", "SCL", "GP4", "GND", "GP17", "GP27", "GP22", "3V3", "GP10", "GP9", "GP11", "GND", "ID_SD", "GP5", "GP6", "GP13", "GP19", "GP26", "GND",
    // Bottom row (20 pins)
    "5V", "5V", "GND", "TXD", "RXD", "GP18", "GND", "GP23", "GP24", "GND", "GP25", "GP8", "GP7", "ID_SC", "GND", "GP12", "GND", "GP16", "GP20", "GP21"
  ],
  stm32_bluepill: [
    // Left 20 pins
    "VBAT", "PC13", "PC14", "PC15", "PA0", "PA1", "PA2", "PA3", "PA4", "PA5", "PA6", "PA7", "PB0", "PB1", "PB10", "PB11", "RST", "3V3", "GND", "GND",
    // Right 20 pins
    "3V3", "GND", "5V", "PB9", "PB8", "PB7", "PB6", "PB5", "PB4", "PB3", "PA15", "PA12", "PA11", "PA10", "PA9", "PA8", "PB15", "PB14", "PB13", "PB12"
  ]
};
