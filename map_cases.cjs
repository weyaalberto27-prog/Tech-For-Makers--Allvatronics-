const fs = require('fs');

let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

const cases = `
      case "arduino_uno":
        return <ArduinoUno3D isPCB={isPCB} />;
      case "esp32":
        return <ESP32_3D isPCB={isPCB} />;
      case "esp32s3":
        return <ESP32_3D isPCB={isPCB} isS3={true} />;
      case "raspberry_pi":
        return <RaspberryPi3D isPCB={isPCB} />;
      case "ldr":
      case "ldr_smd":
      case "photoresistor":
        return <LDR3D />;
      case "cr2032":
      case "coin_cell":
        return <CR20323D />;
      case "oled":
        return <OLED3D isActive={isActive} />;
      case "seven_segment":
        return <SevenSegment3D isActive={isActive} value={value} />;
`;

// we will inject this before `default:`
content = content.replace(/\s*default:\s*const bw = bounds\?\.w \|\| 10;/g, cases + `      default:\n        const bw = bounds?.w || 10;`);

fs.writeFileSync('src/components/Meshes3D.tsx', content);
