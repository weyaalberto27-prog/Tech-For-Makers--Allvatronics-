const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{\-24\}\s+y=\{\-42\.5 \+ i \* 6\.5\}/, '<Text\n              text={pin}\n              x={-24}\n              y={-42.5 + i * 6.5}');
content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{10\}\s+y=\{\-42\.5 \+ i \* 6\.5\}/, '<Text\n              text={pin}\n              x={10}\n              y={-42.5 + i * 6.5}');

fs.writeFileSync('src/components/Symbols.tsx', content);
