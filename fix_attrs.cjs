const fs = require('fs');
const file = 'src/components/AllvaCreator.tsx';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/showDimensions={showDimensions}\n\s+showDimensions={showDimensions}/g, 'showDimensions={showDimensions}');

fs.writeFileSync(file, content);
console.log('fixed attributes');
