const fs = require('fs');
let code = fs.readFileSync('src/components/AIAssistantChat.tsx', 'utf8');

const regex = /\/\/ Auto-complete logic[\s\S]*?\} catch\(e\) \{\s*console\.error\("JSON parse error from AI:", e\);\s*\}\s*\}/;

const replacement = `// Auto-complete logic
      const jsonMatch = replyText.match(/\\\`\\\`\\\`json\\n([\\s\\S]*?)(?:\\n\\\`\\\`\\\`|$)/);
      if (jsonMatch) {
        let actionData;
        try {
          actionData = JSON.parse(jsonMatch[1]);
        } catch(e) {
          console.error("JSON parse error from AI:", e);
          try {
            let str = jsonMatch[1];
            const lastBracketIndex = str.lastIndexOf('}');
            if (lastBracketIndex !== -1) {
              str = str.substring(0, lastBracketIndex + 1) + '\\n  ]\\n}';
              actionData = JSON.parse(str);
            }
          } catch(err2) {
             console.error("Could not repair JSON:", err2);
          }
        }

        if (actionData) {
          if (actionData.action === 'build_3d' && onAddParts) {
             replyText = replyText.replace(jsonMatch[0], '\\n*(Construindo objeto 3D na tela...)*\\n');
             if (actionData.parts) {
               onAddParts(actionData.parts);
             }
          }
          else if (actionData.action === 'autocomplete') {
             replyText = replyText.replace(jsonMatch[0], '\\n*(Auto-completando circuito na tela...)*\\n');
             if (actionData.components) {
               actionData.components.forEach((c) => {
                 addElement({
                   type: 'component',
                   componentType: c.type,
                   x: c.x || 0,
                   y: c.y || 0,
                   rotation: 0,
                   name: c.type.toUpperCase(),
                   value: c.value
                 });
               });
             }
             if (actionData.wires) {
                actionData.wires.forEach((w) => {
                  addElement({
                    type: 'wire',
                    points: w.points
                  });
                });
             }
          }
        } else {
          replyText = replyText.replace(jsonMatch[0], '\\n*(A estrutura 3D era muito grande e foi interrompida, mas tentarei gerar o que consegui...)*\\n');
        }
      }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/AIAssistantChat.tsx', code);
