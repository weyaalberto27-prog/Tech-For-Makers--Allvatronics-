import fs from 'fs';
let content = fs.readFileSync('src/components/CanvasEditor.tsx', 'utf-8');

const regex = /default:\s*\{\s*const typeForSchematic = comp.componentType as any;\s*switch \(typeForSchematic\) \{([\s\S]*?)\}\s*\}/;

const match = content.match(regex);
if (match) {
    let block = match[1];
    block = block.replace(/SymbolView = /g, 'InnerSymbol = ');
    const newBlock = `default:
                    {
                      const typeForSchematic = comp.componentType as any;
                      let InnerSymbol: any = PCBPadSymbol;
                      switch (typeForSchematic) {${block}}
                      
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
                                <Rect x={-w/2} y={-h/2} width={w} height={h} stroke="#e2e8f0" strokeWidth={1} dash={[4, 2]} />
                                <InnerSymbol x={0} y={0} rotation={0} selected={selected} customProps={customProps} />
                             </Group>
                          );
                      };
                      SymbolView = (props: any) => <PCBGenericSymbol {...props} compName={comp.name} componentType={comp.componentType} />;
                    }`;
    content = content.replace(match[0], newBlock);
    fs.writeFileSync('src/components/CanvasEditor.tsx', content);
    console.log("Patched generic symbol");
} else {
    console.log("No match");
}
