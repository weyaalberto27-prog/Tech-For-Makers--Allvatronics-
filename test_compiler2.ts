import { compileCppToJS } from './src/lib/compiler';
const code = `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`;
console.log(compileCppToJS(code));
