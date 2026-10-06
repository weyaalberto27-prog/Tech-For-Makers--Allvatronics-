import { compileCppToJS } from './src/lib/compiler';
const code = `
int pinLED = 13;
void setup() {
  pinMode(pinLED, OUTPUT);
}
void loop() {
  digitalWrite(pinLED, HIGH); // Liga o LED
  delay(3000); // Aguarda
  digitalWrite(pinLED, LOW);
  delay(3000);
}
`;
console.log(compileCppToJS(code));
