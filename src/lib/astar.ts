export interface Point {
  x: number;
  y: number;
}

export function astarRoute(
  start: Point,
  end: Point,
  obstacles: { x: number; y: number; width: number; height: number }[],
  gridSize: number = 5,
  routingMode: "orthogonal" | "pcb" = "pcb"
): Point[] {
  // A* routing with 45-degree angles and direction-change penalties
  const id = (p: Point, d: number) => `${p.x},${p.y},${d}`;
  
  let openSet = new Map<string, { p: Point, dir: number, f: number, g: number, parent: any }>();
  let closedSet = new Set<string>();
  
  const hDist = (pa: Point, pb: Point) => {
      // Octile distance heuristic for 45-degree grid
      const dx = Math.abs(pa.x - pb.x);
      const dy = Math.abs(pa.y - pb.y);
      return gridSize * Math.max(dx, dy) + (Math.SQRT2 - 1) * gridSize * Math.min(dx, dy);
  };
  
  // Directions: 0-3 are orthogonal, 4-7 are diagonal
  const dirs = [
    { x: gridSize, y: 0, cost: gridSize },       // 0: Right
    { x: 0, y: gridSize, cost: gridSize },       // 1: Down
    { x: -gridSize, y: 0, cost: gridSize },      // 2: Left
    { x: 0, y: -gridSize, cost: gridSize },      // 3: Up
    { x: gridSize, y: gridSize, cost: gridSize * 1.414 },     // 4: Down-Right
    { x: -gridSize, y: gridSize, cost: gridSize * 1.414 },    // 5: Down-Left
    { x: -gridSize, y: -gridSize, cost: gridSize * 1.414 },   // 6: Up-Left
    { x: gridSize, y: -gridSize, cost: gridSize * 1.414 }     // 7: Up-Right
  ];
  
  // Initial nodes (try all directions from start with 0 cost)
  for (let i = 0; i < dirs.length; i++) {
     if (routingMode === "orthogonal" && i >= 4) continue;
     openSet.set(id(start, i), { p: start, dir: i, g: 0, f: hDist(start, end), parent: null });
  }
  
  
  const isObstacle = (p: Point) => {
     // Check basic rectangular obstacles
     for (let obs of obstacles) {
        if (p.x > obs.x - obs.width/2 - gridSize && p.x < obs.x + obs.width/2 + gridSize &&
            p.y > obs.y - obs.height/2 - gridSize && p.y < obs.y + obs.height/2 + gridSize) {
           return true;
        }
     }
     // Check traces
     if (typeof (obstacles as any).traceLines !== "undefined") {
        for (let line of (obstacles as any).traceLines) {
           const dist = pointToLineSegmentDistance(p, line.p1, line.p2);
           if (dist < gridSize * 1.5) return true;
        }
     }
     return false;
  };

  
  let maxIterations = 8000;
  let it = 0;
  
  let bestEndNode: any = null;
  
  while (openSet.size > 0 && it < maxIterations) {
    it++;
    let currentId = '';
    let currentF = Infinity;
    for (let [nid, node] of openSet.entries()) {
      if (node.f < currentF) {
        currentF = node.f;
        currentId = nid;
      }
    }
    
    let current = openSet.get(currentId)!;
    
    if (Math.abs(current.p.x - end.x) <= gridSize && Math.abs(current.p.y - end.y) <= gridSize) {
       bestEndNode = current;
       break;
    }
    
    openSet.delete(currentId);
    closedSet.add(currentId);
    
    for (let i = 0; i < dirs.length; i++) {
      if (routingMode === "orthogonal" && i >= 4) continue;
      
      let d = dirs[i];
      let nx = current.p.x + d.x;
      let ny = current.p.y + d.y;
      nx = Math.round(nx / gridSize) * gridSize;
      ny = Math.round(ny / gridSize) * gridSize;
      
      let np = { x: nx, y: ny };
      let nid = id(np, i);
      
      if (closedSet.has(nid)) continue;
      
      // Skip if obstacle (unless extremely close to start/end)
      let distE = hDist(np, end);
      let distS = hDist(np, start);
      if (isObstacle(np) && distE > gridSize * 4 && distS > gridSize * 4) {
         continue; 
      }
      
      // Calculate movement cost + direction change penalty
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
      
      let g = current.g + d.cost + dirChangePenalty + diagonalPenalty;
      let f = g + distE;
      
      let neighbor = openSet.get(nid);
      if (!neighbor) {
         openSet.set(nid, { p: np, dir: i, g, f, parent: current });
      } else if (g < neighbor.g) {
         neighbor.g = g;
         neighbor.f = f;
         neighbor.parent = current;
      }
    }
  }
  
  if (bestEndNode) {
       let path = [];
       let curr: any = bestEndNode;
       while (curr) {
         path.push(curr.p);
         curr = curr.parent;
       }
       path.reverse();
       path.push(end);
       return simplifyPath(path);
  }
  
  console.warn("A* failed to route, falling back to orthogonal routing");
  return simplifyPath(routingMode === "pcb" ? fallback45Degree(start, end) : fallbackOrthogonal(start, end));
}

function fallback45Degree(p1: Point, p2: Point): Point[] {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const signX = p2.x > p1.x ? 1 : -1;
  const signY = p2.y > p1.y ? 1 : -1;
  if (dx > dy) {
    return [p1, { x: p1.x + dy * signX, y: p2.y }, p2];
  } else {
    return [p1, { x: p2.x, y: p1.y + dx * signY }, p2];
  }
}
function fallbackOrthogonal(p1: Point, p2: Point): Point[] {
  return [
    {x: p1.x, y: p1.y},
    {x: p2.x, y: p1.y},
    {x: p2.x, y: p2.y}
  ];
}

function simplifyPath(path: Point[]): Point[] {
   if (path.length <= 2) return path;
   let simplified = [path[0]];
   for (let i = 1; i < path.length - 1; i++) {
      let prev = path[i-1];
      let curr = path[i];
      let next = path[i+1];
      
      let dx1 = curr.x - prev.x;
      let dy1 = curr.y - prev.y;
      let dx2 = next.x - curr.x;
      let dy2 = next.y - curr.y;
      
      // Cross product to check if they are collinear
      if (dx1 * dy2 !== dx2 * dy1) {
         simplified.push(curr);
      }
   }
   simplified.push(path[path.length-1]);
   return simplified;
}


function pointToLineSegmentDistance(p: Point, v: Point, w: Point) {
  const l2 = (w.x - v.x)*(w.x - v.x) + (w.y - v.y)*(w.y - v.y);
  if (l2 === 0) return Math.sqrt((p.x - v.x)*(p.x - v.x) + (p.y - v.y)*(p.y - v.y));
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projection = { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) };
  return Math.sqrt((p.x - projection.x)*(p.x - projection.x) + (p.y - projection.y)*(p.y - projection.y));
}
