const fs = require('fs');
let code = fs.readFileSync('src/components/Meshes3D.tsx', 'utf8');

// fix ultrasonic pins
code = code.replace(/\{\[-10, -3\.3, 3\.3, 10\]\.map\(\(x, i\) => \(/, '{[-15, -5, 5, 15].map((x, i) => (');
code = code.replace(/<Text position=\{\[-10, 2, -3\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\} fontSize=\{2\} color="#ffffff">Vcc<\/Text>\n\s*<Text position=\{\[-3\.3, 2, -3\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\} fontSize=\{2\} color="#ffffff">Trig<\/Text>\n\s*<Text position=\{\[3\.3, 2, -3\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\} fontSize=\{2\} color="#ffffff">Echo<\/Text>\n\s*<Text position=\{\[10, 2, -3\]\} rotation=\{\[-Math\.PI\/2, 0, 0\]\} fontSize=\{2\} color="#ffffff">Gnd<\/Text>/,
`<Text position={[-15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Vcc</Text>
              <Text position={[-5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Trig</Text>
              <Text position={[5, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Echo</Text>
              <Text position={[15, 2, -3]} rotation={[-Math.PI/2, 0, 0]} fontSize={2} color="#ffffff">Gnd</Text>`);

// Fix the cylinder args inside ultrasonic
code = code.replace(/case "ultrasonic":[\s\S]*?<\/group>\n            <Text position=\{\[-20, 2\.5, -12\]\}/, (match) => {
  return match.replace(/<cylinderGeometry args=\{\[0\.5, 0\.5, 6, 8\]\} \/>/, '<cylinderGeometry args={[0.4, 0.4, isPCB ? 4 : 8]} />')
              .replace(/<meshPhysicalMaterial color="#fbbf24" metalness=\{0\.8\} roughness=\{0\.2\} \/>/, '<meshPhysicalMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} clearcoat={0.8} />');
});


fs.writeFileSync('src/components/Meshes3D.tsx', code);
