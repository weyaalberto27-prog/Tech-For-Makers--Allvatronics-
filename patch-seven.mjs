import fs from 'fs';
let content = fs.readFileSync('src/lib/simulator.ts', 'utf-8');

const oldSeven = `      } else if (comp.componentType === "seven_segment") {
        const comNode = pointToNode.get(pins[2]); // We'll just use top-middle as COM
        const segmentPins = [0, 1, 3, 4, 5, 6, 8, 9];
        if (comNode !== undefined) {
          segmentPins.forEach((pIdx) => {
            const sNode = pointToNode.get(pins[pIdx]);
            if (sNode !== undefined) resistors.push({ node1: sNode, node2: comNode, g: 0.005 }); // ~200 ohm LED
          });
        }
      }`;

const newSeven = `      } else if (comp.componentType === "seven_segment") {
        const comNode = pointToNode.get(pins[2]); // top-middle COM
        const comNode2 = pointToNode.get(pins[7]); // bottom-middle COM
        const segmentPins = [0, 1, 3, 4, 5, 6, 8, 9];
        if (comNode !== undefined) {
          segmentPins.forEach((pIdx) => {
            const sNode = pointToNode.get(pins[pIdx]);
            if (sNode !== undefined) resistors.push({ node1: sNode, node2: comNode, g: 0.005 }); // ~200 ohm LED
          });
          if (comNode2 !== undefined) resistors.push({ node1: comNode, node2: comNode2, g: 1000 }); // internal short (1m ohm)
        }
      }`;

content = content.replace(oldSeven, newSeven);
fs.writeFileSync('src/lib/simulator.ts', content);
