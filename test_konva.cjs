const fs = require("fs");
let content = fs.readFileSync("src/components/CanvasEditor.tsx", "utf8");

const copperPourComponent = `
const CopperPourGroup = ({ board, pcbElements, activePcbLayer, copperPourElement }: any) => {
  const groupRef = React.useRef<any>(null);
  
  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.cache();
      groupRef.current.getLayer()?.batchDraw();
    }
  }, [board, pcbElements, activePcbLayer, copperPourElement]);

  if (!board) return null;

  // Use the layer of the copper pour to determine color
  const isTop = copperPourElement.layer === "top";
  // Only show if the active layer matches or if we show all
  if (activePcbLayer !== copperPourElement.layer) return null;

  const color = isTop ? "rgba(185, 28, 28, 0.6)" : "rgba(29, 78, 216, 0.6)";

  return (
    <Group ref={groupRef} x={board.x} y={board.y}>
      {/* 1. Draw the copper area (currently fills the board) */}
      {(!board.boardShape || board.boardShape === "rect") && (
         <Rect x={0} y={0} width={board.width} height={board.height} fill={color} />
      )}
      {board.boardShape === "circle" && (
         <Ellipse x={board.width / 2} y={board.height / 2} radiusX={board.width / 2} radiusY={board.height / 2} fill={color} />
      )}
      {board.boardShape === "triangle" && (
         <Line points={[board.width / 2, 0, board.width, board.height, 0, board.height]} closed fill={color} />
      )}

      {/* 2. Punch holes for traces and pads */}
      <Group globalCompositeOperation="destination-out">
        {pcbElements.map((el: any) => {
           if (el.type === 'trace' && el.layer === copperPourElement.layer) {
              return (
                 <Line
                    key={"clear_"+el.id}
                    points={el.points.flatMap((p: any) => [p.x - board.x, p.y - board.y])}
                    stroke="black"
                    strokeWidth={(el.width || 4) + 6} // Clearance 3px on each side
                    lineCap="round"
                    lineJoin="round"
                 />
              );
           }
           if (el.type === 'pcb_component' && el.componentType !== 'copper_pour' && el.componentType !== 'board') {
              // Thermal relief for GND (we assume pad name GND)
              const isGnd = el.name && el.name.toLowerCase().includes("gnd");
              const px = el.x - board.x;
              const py = el.y - board.y;
              if (isGnd) {
                 // Thermal relief: Erase a ring, but leave 4 thin spokes
                 return (
                    <Group key={"clear_"+el.id} x={px} y={py}>
                       <Circle x={0} y={0} radius={12} stroke="black" strokeWidth={6} />
                       {/* Spokes are NOT erased, so we draw with destination-in or just erase sections.
                           Actually, to erase sections, we can draw 4 arcs.
                       */}
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={10} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={100} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={190} fill="black" />
                       <Arc x={0} y={0} innerRadius={9} outerRadius={15} angle={70} rotation={280} fill="black" />
                    </Group>
                 )
              } else {
                 return <Circle key={"clear_"+el.id} x={px} y={py} radius={12} fill="black" />;
              }
           }
           return null;
        })}
      </Group>
    </Group>
  );
};
`;

if (!content.includes("const CopperPourGroup")) {
  content = content.replace(
    /function getOrthogonalPoints/,
    copperPourComponent + "\nfunction getOrthogonalPoints"
  );
  fs.writeFileSync("src/components/CanvasEditor.tsx", content);
}
