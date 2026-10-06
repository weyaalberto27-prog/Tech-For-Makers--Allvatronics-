const code = "void setup() {}";
const Mcu = { _lastRawCode: undefined };
console.log(!Mcu || (Mcu._lastRawCode !== undefined && Mcu._lastRawCode !== code));
console.log(!Mcu || (Mcu._lastRawCode !== code));
