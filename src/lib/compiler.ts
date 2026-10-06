
export function compileCppToJS(code: string): string {
    let jsCode = code
        .replace(/#include\s+[<"][^>"]+[>"]/g, '// include')
        .replace(/#define\s+([a-zA-Z0-9_]+)\s+([^\n]+)/g, 'const $1 = $2;')
        
        // Remove C-style type casts e.g. (int)x -> x
        .replace(/\(\s*(int|float|double|String|bool|char|byte|long|short)\s*\)/g, '')
        
        // Map standard Arduino structure
        .replace(/\bvoid\s+setup\s*\(\)\s*\{/g, 'Mcu._setup = async function() {')
        .replace(/\bvoid\s+loop\s*\(\)\s*\{/g, 'Mcu._loop = async function() {')
        
        // Map custom functions and remove argument types
        .replace(/\b(void|int|float|double|String|bool|char|byte|long|short)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g, (match, p1, p2, p3) => {
            let params = p3.replace(/\b(const\s+)?(unsigned\s+)?(int|float|double|String|bool|char|byte|long|short)\s+/g, '');
            return `async function ${p2}(${params}) {`;
        })
        
        // Map variable declarations
        .replace(/\bconst\s+(unsigned\s+)?(int|float|double|String|bool|char|byte|long|short)\s+/g, 'const ')
        .replace(/\bunsigned\s+(int|long|char|short|byte)\s+/g, 'let ')
        .replace(/\b(int|float|double|String|bool|char|byte|long|short)\s+/g, 'let ')
        
        // Support Serial
        .replace(/Serial\.println\(/g, 'console.log(')
        .replace(/Serial\.print\(/g, 'console.log(')
        .replace(/Serial\.begin\([^)]*\);?/g, '')
        
        // Delay (adds await)
        .replace(/delay\(([^)]+)\);?/g, 'await Mcu.delay($1); if(Mcu._abort) return;')
        
        // MCU calls
        .replace(/pinMode\(/g, 'Mcu.pinMode(')
        .replace(/digitalWrite\(/g, 'Mcu.digitalWrite(')
        .replace(/digitalRead\(/g, 'Mcu.digitalRead(')
        .replace(/analogWrite\(/g, 'Mcu.analogWrite(')
        .replace(/analogRead\(/g, 'Mcu.analogRead(')
        
        // OLED display support
        .replace(/Adafruit_SSD1306\s+([a-zA-Z0-9_]+)[^;]*;/g, 'const $1 = Mcu.OLED;')
        .replace(/([a-zA-Z0-9_]+)\.begin\([^)]*\);?/g, '$1.begin();')
        .replace(/([a-zA-Z0-9_]+)\.clearDisplay\(\);?/g, '$1.clearDisplay();')
        .replace(/([a-zA-Z0-9_]+)\.display\(\);?/g, '$1.display();')
        .replace(/([a-zA-Z0-9_]+)\.setCursor\(([^)]+)\);?/g, '$1.setCursor($2);')
        .replace(/([a-zA-Z0-9_]+)\.setTextSize\(([^)]+)\);?/g, '$1.setTextSize($2);')
        .replace(/([a-zA-Z0-9_]+)\.setTextColor\([^)]+\);?/g, '')
        .replace(/([a-zA-Z0-9_]+)\.print\(([^)]+)\);?/g, '$1.print($2);')
        .replace(/([a-zA-Z0-9_]+)\.println\(([^)]+)\);?/g, '$1.println($2);')
        
        // Constants
        .replace(/\bHIGH\b/g, '1')
        .replace(/\bLOW\b/g, '0')
        .replace(/\bOUTPUT\b/g, '1')
        .replace(/\bINPUT\b/g, '0')
        .replace(/\bINPUT_PULLUP\b/g, '2');

    return jsCode;
}
