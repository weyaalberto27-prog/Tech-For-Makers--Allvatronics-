const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasViewer3D.tsx", "utf8");

const oldShapeRegex = /const r = 10; \/\/ corner radius[\s\S]*?shape\.quadraticCurveTo\(-w \/ 2, -h \/ 2, -w \/ 2 \+ r, -h \/ 2\);/;

const newShapeCode = `const r = 10; // corner radius
    const shapeType = boardEl?.boardShape || "rect";
    
    if (shapeType === "circle") {
      shape.moveTo(w / 2, 0);
      shape.absellipse(0, 0, w / 2, h / 2, 0, Math.PI * 2, false, 0);
    } else if (shapeType === "triangle") {
      shape.moveTo(0, -h / 2);
      shape.lineTo(w / 2, h / 2);
      shape.lineTo(-w / 2, h / 2);
      shape.lineTo(0, -h / 2);
    } else {
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    }

    // Default mounting holes for the board corners/edges
    if (shapeType === "rect") {
      const hpts = [
        [-w/2 + 10, -h/2 + 10], [w/2 - 10, -h/2 + 10],
        [-w/2 + 10, h/2 - 10], [w/2 - 10, h/2 - 10]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    } else if (shapeType === "circle") {
      const cr = w/2 - 15;
      const hpts = [
        [cr * Math.cos(Math.PI/4), cr * Math.sin(Math.PI/4)],
        [cr * Math.cos(3*Math.PI/4), cr * Math.sin(3*Math.PI/4)],
        [cr * Math.cos(5*Math.PI/4), cr * Math.sin(5*Math.PI/4)],
        [cr * Math.cos(7*Math.PI/4), cr * Math.sin(7*Math.PI/4)]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    } else if (shapeType === "triangle") {
      const hpts = [
        [0, -h/2 + 20], [-w/2 + 20, h/2 - 10], [w/2 - 20, h/2 - 10]
      ];
      hpts.forEach(p => {
        const hp = new THREE.Path();
        hp.absarc(p[0], p[1], 4, 0, Math.PI * 2, false);
        shape.holes.push(hp);
      });
    }
`;

content = content.replace(oldShapeRegex, newShapeCode);
fs.writeFileSync("src/components/CanvasViewer3D.tsx", content);
