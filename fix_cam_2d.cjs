const fs = require('fs');

let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

const camLeftRegex = /<Text\s+text=\{\"\"\}\s+x=\{\-28\}\s+y=\{\-31 \+ i \* 9\.5\}\s+fontSize=\{5\}\s+fill=\"\#fff\"\s+\/>/;
const camLeftReplacement = '<Text\n              text={pin}\n              x={-28}\n              y={-31 + i * 9.5}\n              fontSize={5}\n              fill="#fff"\n            />';

content = content.replace(camLeftRegex, camLeftReplacement);

const camRightRegex = /<Text\s+text=\{\"\"\}\s+x=\{18\}\s+y=\{\-31 \+ i \* 9\.5\}\s+fontSize=\{5\}\s+fill=\"\#fff\"\s+\/>/;
const camRightReplacement = '<Text\n              text={pin}\n              x={18}\n              y={-31 + i * 9.5}\n              fontSize={5}\n              fill="#fff"\n            />';

content = content.replace(camRightRegex, camRightReplacement);


fs.writeFileSync('src/components/Symbols.tsx', content);
