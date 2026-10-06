import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasViewer3D.tsx', 'utf8');

content = content.replace(
  '<Logo3D position={[lx - 10, 0.81, lz - 10]} scale={1.0} />',
  '<Logo3D position={[0, 0.81, 0]} scale={0.7} />'
);

// We need to fix the rotation of the SVG cylinders to lay flat properly.
// The SVG icon was grouped and rotated, but some meshes might be flipped.
// Let's just update Logo3D to a clean version that is visible and centered.

fs.writeFileSync('src/components/CanvasViewer3D.tsx', content);
