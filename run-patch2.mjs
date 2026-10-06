import fs from 'fs';
let content = fs.readFileSync('src/components/Symbols.tsx', 'utf8');

content = content.replace(/if \(Math\.floor\(c \/ 5\) % 2 === 0\) \{/g, 'if (true) {');

fs.writeFileSync('src/components/Symbols.tsx', content, 'utf8');
console.log("Successfully removed gaps from power rails.");
