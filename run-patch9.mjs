import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const target = `      <Text
        text="9V"
        x={-8}
        y={-10}
        fontSize={12}
        fill="#fff"
        fontStyle="bold"
      />`;

const replacement = `      <Text
        text={parseFloat(value?.toString() || "9").toString() + "V"}
        x={-12}
        y={-10}
        fontSize={12}
        fill="#fff"
        fontStyle="bold"
      />`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Symbols.tsx', content, 'utf8');
console.log("Patched BatterySymbol.");
