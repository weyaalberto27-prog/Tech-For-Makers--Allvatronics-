const fs = require('fs');
const content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf8');
console.log(content.substring(content.indexOf('const handleExportToPcb = () => {'), content.indexOf('const handleAutoRoute = () => {')));
