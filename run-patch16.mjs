import fs from 'fs';
let content = fs.readFileSync('src/lib/astar.ts', 'utf8');

const target = `      // Calculate movement cost + direction change penalty
      let dirChangePenalty = (current.dir !== i) ? gridSize * 2.5 : 0;
      
      // Additional penalty for diagonals to prefer orthogonal when possible, 
      // but allow 45s for corners.
      let diagonalPenalty = (i >= 4) ? gridSize * 0.5 : 0;
      
      let g = current.g + d.cost + dirChangePenalty + diagonalPenalty;`;

const replacement = `      // Calculate movement cost + direction change penalty
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

content = content.replace(target, replacement);
fs.writeFileSync('src/lib/astar.ts', content, 'utf8');
console.log("Patched astar direction penalties");
