const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// --- RESISTOR ---
// Main body
code = code.replace(/<cylinderGeometry args=\{\[2, 2, 18, 16\]\} \/>/g, '<cylinderGeometry args={[3, 3, 22, 16]} />');
// Ends
code = code.replace(/<cylinderGeometry args=\{\[2\.2, 2\.2, 3, 16\]\} \/>/g, '<cylinderGeometry args={[3.3, 3.3, 3, 16]} />');
code = code.replace(/<sphereGeometry args=\{\[2\.2, 16, 16\]\} \/>/g, '<sphereGeometry args={[3.3, 16, 16]} />');
// Bands
code = code.replace(/<cylinderGeometry args=\{\[1\.55, 1\.55, 1\.5, 16\]\} \/>/g, '<cylinderGeometry args={[3.1, 3.1, 1.5, 16]} />');
// Fix band positions to fit new length (22) and ends (at -11, +11).
// Original bands were at -5, -2, 1, 5. Let's space them out a bit more: -7, -3, 1, 7
code = code.replace(/position=\{\[-5, -2, 0\]\}/g, 'position={[-7, -2, 0]}');
code = code.replace(/position=\{\[-2, -2, 0\]\}/g, 'position={[-3, -2, 0]}');
code = code.replace(/position=\{\[1, -2, 0\]\}/g, 'position={[1, -2, 0]}');
code = code.replace(/position=\{\[5, -2, 0\]\}/g, 'position={[7, -2, 0]}');
// Wait, position={[-5, -2, 0]} might match other things. Let's be careful. Let's do it manually on the whole block.

fs.writeFileSync('src/components/Meshes3D.tsx', code);
