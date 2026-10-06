import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /default:\s*\{\s*const typeForSchematic = comp.componentType as any;\s*let InnerSymbol: any = PCBPadSymbol;\s*switch \(typeForSchematic\) \{([\s\S]*?)\}\s*const PCBGenericSymbol/g;

const match = regex.exec(content);
if (match) {
    const newBlock = `default:
                    {
                      const typeForSchematic = comp.componentType as any;
                      const PCBGenericSymbol = ({ x, y, rotation, selected, customProps, compName, componentType }: any) => {
                          let w = 40, h = 40;
                          const pins = getPcbComponentPins({ componentType, name: compName, customProps });
                          if (pins && pins.length > 0) {
                              const xs = pins.map((p: any) => p.x);
                              const ys = pins.map((p: any) => p.y);
                              w = Math.max(...xs) - Math.min(...xs) + 20;
                              h = Math.max(...ys) - Math.min(...ys) + 20;
                              if (w < 20) w = 20;
                              if (h < 20) h = 20;
                          }
                          return (
                             <Group x={x} y={y} rotation={rotation} draggable={false}>
                                <Rect x={-w/2} y={-h/2} width={w} height={h} stroke="#fbbf24" strokeWidth={1.5} dash={[4, 4]} />
                             </Group>
                          );
                      };
                      SymbolView = (props: any) => <PCBGenericSymbol {...props} compName={comp.name} componentType={comp.componentType} />;\n                    `;
    
    // Replace the whole default block
    const wholeDefaultRegex = /default:\s*\{\s*const typeForSchematic = comp\.componentType as any;\s*let InnerSymbol: any = PCBPadSymbol;[\s\S]*?SymbolView = \(props: any\) => <PCBGenericSymbol \{\.\.\.props\} compName=\{comp\.name\} componentType=\{comp\.componentType\} \/>;\s*\}/;
    
    content = content.replace(wholeDefaultRegex, newBlock + '}');
    fs.writeFileSync('src/components/CanvasEditor.tsx', content);
    console.log("Patched PCB generic symbol to be just a box");
} else {
    console.log("No match");
}
