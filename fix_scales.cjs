const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// Revert group scales
code = code.replace(/return <group scale=\{\[1\.2, 1\.2, 1\.2\]\}><ArduinoUno3DInner isPCB=\{isPCB\} \/><\/group>;/g, 
                    'return <ArduinoUno3DInner isPCB={isPCB} />;');
code = code.replace(/return <group scale=\{\[1\.3, 1\.3, 1\.3\]\}><CR20323DInner \/><\/group>;/g, 
                    'return <CR20323DInner />;');
code = code.replace(/return <group scale=\{\[1\.3, 1\.3, 1\.3\]\}><STM32BluePill3DInner isPCB=\{isPCB\} \/><\/group>;/g, 
                    'return <STM32BluePill3DInner isPCB={isPCB} />;');
code = code.replace(/return <group scale=\{\[1\.3, 1\.3, 1\.3\]\}><OLED3DInner isActive=\{isActive\} isBroken=\{isBroken\} \/><\/group>;/g, 
                    'return <OLED3DInner isActive={isActive} isBroken={isBroken} />;');
code = code.replace(/return <group scale=\{\[1\.4, 1\.4, 1\.4\]\}><NTC3DInner \/><\/group>;/g, 
                    'return <NTC3DInner />;');
code = code.replace(/return <group scale=\{\[1\.4, 1\.4, 1\.4\]\}><SevenSegment3DInner isActive=\{isActive\} value=\{value\} \/><\/group>;/g, 
                    'return <SevenSegment3DInner isActive={isActive} value={value} />;');

// For inline cases:
code = code.replace(/<group position=\{\[0, 0, 0\]\} scale=\{\[1\.\d, 1\.\d, 1\.\d\]\}>/g, '<group position={[0, 0, 0]}>');
code = code.replace(/<group position=\{\[0, 10, 0\]\} scale=\{\[1\.\d, 1\.\d, 1\.\d\]\}>/g, '<group position={[0, 10, 0]}>');
code = code.replace(/<group position=\{\[15, 10, 0\]\} rotation=\{\[0, 0, Math\.PI \/ 2\]\} scale=\{\[1\.\d, 1\.\d, 1\.\d\]\}>/g, '<group position={[15, 10, 0]} rotation={[0, 0, Math.PI / 2]}>');
code = code.replace(/<group position=\{\[0, 12, 0\]\} scale=\{\[1\.\d, 1\.\d, 1\.\d\]\}>/g, '<group position={[0, 12, 0]}>');
code = code.replace(/<group position=\{\[0, 5, 0\]\} scale=\{\[1\.\d, 1\.\d, 1\.\d\]\}>/g, '<group position={[0, 5, 0]}>');

// Also revert my length/width hacks in ICs if they were bad.
code = code.replace(/length = length \* 1\.2;\s*width = width \* 1\.2;/g, '');
code = code.replace(/length = length \* 1\.3;\s*width = width \* 1\.3;/g, '');

fs.writeFileSync('src/components/Meshes3D.tsx', code);
