const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

// For STM32BluePillSymbol
const stm32L = `<Circle
              x={-20}
              y={py}
              radius={3}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={-15}
              y={py - 2}
              fontSize={4}
              fill="#fff"
            />`;

const stm32R = `<Circle
              x={20}
              y={py}
              radius={3}
              fill={selected ? selectedColor : "#e2e8f0"}
              stroke={selected ? selectedColor : "#94a3b8"}
              strokeWidth={1}
            />
            <Text
              text={pin}
              x={10}
              y={py - 2}
              fontSize={4}
              fill="#fff"
            />`;

content = content.replace(/<Circle\s+x=\{\-20\}\s+y=\{py\}\s+radius=\{3\}\s+fill=\{selected \? selectedColor : \"#e2e8f0\"\}\s+stroke=\{selected \? selectedColor : \"#94a3b8\"\}\s+strokeWidth=\{1\}\s+\/>/, stm32L);

content = content.replace(/<Circle\s+x=\{20\}\s+y=\{py\}\s+radius=\{3\}\s+fill=\{selected \? selectedColor : \"#e2e8f0\"\}\s+stroke=\{selected \? selectedColor : \"#94a3b8\"\}\s+strokeWidth=\{1\}\s+\/>/, stm32R);


// For Raspberry Pi
content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{\-52\.5 \+ i \* 5 \- 2\}\s+y=\{\-38\}/, '<Text\n              text={pin}\n              x={-52.5 + i * 5 - 2}\n              y={-38}');

content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{\-52\.5 \+ i \* 5 \+ 2\.5\}\s+y=\{\-25\}/, '<Text\n              text={pin}\n              x={-52.5 + i * 5 + 2.5}\n              y={-25}');


fs.writeFileSync('src/components/Symbols.tsx', content);
