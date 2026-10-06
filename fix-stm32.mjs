import fs from 'fs';
let content = fs.readFileSync('src/components/Meshes3D.tsx', 'utf-8');

content = content.replace(/case "stm32_bluepill":\s*return <STM32BluePill3D isPCB=\{isPCB\} \/>; length=\{Math\.max\(18, l\)\} width=\{8\} value=\{value\} type=\{type\} isPCB=\{isPCB\} \/>;\s*\}/, 'case "stm32_bluepill":\n        return <STM32BluePill3D isPCB={isPCB} />;');

fs.writeFileSync('src/components/Meshes3D.tsx', content);
