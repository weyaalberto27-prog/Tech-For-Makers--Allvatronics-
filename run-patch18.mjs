import fs from 'fs';
let content = fs.readFileSync('src/lib/astar.ts', 'utf8');

content = content.replace(
  'gridSize: number = 5): Point[] {',
  'gridSize: number = 5, routingMode: "orthogonal" | "pcb" = "pcb"): Point[] {'
);

const targetLoop = `    for (let i = 0; i < dirs.length; i++) {
      let d = dirs[i];`;

const replacementLoop = `    for (let i = 0; i < dirs.length; i++) {
      if (routingMode === "orthogonal" && i >= 4) continue;
      
      let d = dirs[i];`;

content = content.replace(targetLoop, replacementLoop);

const targetStartLoop = `  for (let i = 0; i < dirs.length; i++) {
     openSet.set(id(start, i), { p: start, dir: i, g: 0, f: hDist(start, end), parent: null });
  }`;

const replacementStartLoop = `  for (let i = 0; i < dirs.length; i++) {
     if (routingMode === "orthogonal" && i >= 4) continue;
     openSet.set(id(start, i), { p: start, dir: i, g: 0, f: hDist(start, end), parent: null });
  }`;

content = content.replace(targetStartLoop, replacementStartLoop);

const targetPenalty = `      // Calculate movement cost + direction change penalty
      let dirChangePenalty = 0;
      if (current.dir !== i) {
          const dirAngle = [0, 2, 4, 6, 1, 3, 5, 7];
          let diff = Math.abs(dirAngle[current.dir] - dirAngle[i]);
          if (diff > 4) diff = 8 - diff;
          
          if (diff === 1) dirChangePenalty = gridSize * 1.5; // 45 degree
          else if (diff === 2) dirChangePenalty = gridSize * 8.0; // 90 degree (penalize heavily)
          else if (diff === 3) dirChangePenalty = gridSize * 15.0; // 135 degree
          else if (diff === 4) dirChangePenalty = gridSize * 30.0; // 180 degree
      }
      
      // Slight penalty for diagonals to keep them mainly as corners, unless needed
      let diagonalPenalty = (i >= 4) ? gridSize * 0.1 : 0;
      
      let g = current.g + d.cost + dirChangePenalty + diagonalPenalty;`;

const replacementPenalty = `      // Calculate movement cost + direction change penalty
      let dirChangePenalty = 0;
      if (current.dir !== i) {
          const dirAngle = [0, 2, 4, 6, 1, 3, 5, 7];
          let diff = Math.abs(dirAngle[current.dir] - dirAngle[i]);
          if (diff > 4) diff = 8 - diff;
          
          if (routingMode === "pcb") {
              if (diff >= 2) continue; // STRICTLY 45 DEGREE ANGLES ONLY!
              dirChangePenalty = gridSize * 1.0;
          } else {
              dirChangePenalty = gridSize * 2.0; // penalty for 90 degree turns in orthogonal
          }
      }
      
      let diagonalPenalty = (routingMode === "pcb" && i >= 4) ? gridSize * 0.1 : 0;
      
      let g = current.g + d.cost + dirChangePenalty + diagonalPenalty;`;

content = content.replace(targetPenalty, replacementPenalty);

// fallback update for routingMode
content = content.replace(
  'return simplifyPath(fallback45Degree(start, end));',
  'return simplifyPath(routingMode === "pcb" ? fallback45Degree(start, end) : fallbackOrthogonal(start, end));'
);

fs.writeFileSync('src/lib/astar.ts', content, 'utf8');
console.log("Patched astar routing mode");
