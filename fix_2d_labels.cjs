const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

// For Arduino Uno
content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{\-41 \+ i \* 6 \- 2\}\s+y=\{\-43\}/, '<Text\n              text={pin}\n              x={-41 + i * 6 - 2}\n              y={-43}');
content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{\-41 \+ i \* 6 \+ 2\}\s+y=\{43\}/, '<Text\n              text={pin}\n              x={-41 + i * 6 + 2}\n              y={43}');
content = content.replace(/<Text\s+text=\{\"\"\}\s+x=\{19 \+ i \* 6 \+ 2\}\s+y=\{43\}/, '<Text\n              text={pin}\n              x={19 + i * 6 + 2}\n              y={43}');

fs.writeFileSync('src/components/Symbols.tsx', content);
