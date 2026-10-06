import { Point } from '../types';
import { pinMap } from './pinmap';

export function calculatePinOffsetsForProtoboard(
  comp: any,
  newX: number,
  newY: number,
  elements: any[]
): { pinOffsets: Record<number, Point> } | null {
  if (comp.componentType === 'protoboard' || comp.type !== 'component') return null;

  // Find protoboards
  const pbs = elements.filter(e => e.componentType === 'protoboard');
  if (pbs.length === 0) return null;

  // Get base pins without offsets
  const basePins = pinMap[comp.componentType] || [{ x: 0, y: 0 }];
  if (basePins.length === 0) return null;

  const compRad = ((comp.rotation || 0) * Math.PI) / 180;
  
  const pinOffsets: Record<number, Point> = {};
  let anySnapped = false;

  for (let i = 0; i < basePins.length; i++) {
    const p = basePins[i];
    // Global pos of base pin
    const pGlobalX = newX + p.x * Math.cos(compRad) - p.y * Math.sin(compRad);
    const pGlobalY = newY + p.x * Math.sin(compRad) + p.y * Math.cos(compRad);

    let closestDist = 20; // Max snap distance
    let snappedHole = null;

    for (const pb of pbs) {
      const pbRad = ((pb.rotation || 0) * Math.PI) / 180;
      const holes = pinMap['protoboard'] || [];
      
      for (const h of holes) {
        const hGlobalX = pb.x + h.x * Math.cos(pbRad) - h.y * Math.sin(pbRad);
        const hGlobalY = pb.y + h.x * Math.sin(pbRad) + h.y * Math.cos(pbRad);
        
        const dist = Math.sqrt(Math.pow(pGlobalX - hGlobalX, 2) + Math.pow(pGlobalY - hGlobalY, 2));
        if (dist < closestDist) {
          closestDist = dist;
          snappedHole = { x: hGlobalX, y: hGlobalY };
        }
      }
    }

    if (snappedHole) {
      // Calculate local offset needed to reach snappedHole
      const dx = snappedHole.x - pGlobalX;
      const dy = snappedHole.y - pGlobalY;
      
      // Rotate delta back to local component space
      const localDx = dx * Math.cos(-compRad) - dy * Math.sin(-compRad);
      const localDy = dx * Math.sin(-compRad) + dy * Math.cos(-compRad);
      
      pinOffsets[i] = { x: localDx, y: localDy };
      anySnapped = true;
    }
  }

  if (anySnapped) {
    return { pinOffsets };
  }

  // Clear offsets if no pins snapped
  return { pinOffsets: {} };
}
