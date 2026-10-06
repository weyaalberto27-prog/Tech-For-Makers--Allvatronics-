const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const camRightRegex = /<Text\s+text=\{\"\"\}\s+x=\{10\}\s+y=\{\-31 \+ i \* 9\.5\}/;
const camRightReplacement = '<Text\n              text={pin}\n              x={10}\n              y={-31 + i * 9.5}';

content = content.replace(camRightRegex, camRightReplacement);

fs.writeFileSync('src/components/Symbols.tsx', content);
