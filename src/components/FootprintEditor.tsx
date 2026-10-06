import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { X, Save, Plus } from 'lucide-react';

export function FootprintEditor({ onClose, onSave }: { onClose: () => void, onSave: (footprint: any) => void }) {
  const [pads, setPads] = useState<{id: string, x: number, y: number, radius: number}[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const addPad = () => {
    setPads([...pads, { id: Date.now().toString(), x: 200, y: 200, radius: 5 }]);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#2d2d33] rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#2d2d33]">
          <h2 className="text-lg font-semibold text-white">Editor de Footprints</h2>
          <div className="flex space-x-2">
            <button onClick={addPad} className="px-3 py-1 bg-[#2d2d33] hover:bg-[#3d3d45] text-white rounded flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pad
            </button>
            <button onClick={() => onSave({ pads })} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </button>
            <button onClick={onClose} className="p-1 hover:bg-[#2d2d33] text-gray-400 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-[#0a0a0a] relative">
          <Stage width={800} height={600} onClick={(e) => {
            if(e.target === e.target.getStage()) setSelected(null);
          }}>
            <Layer>
               {/* Grid */}
               {Array.from({ length: 40 }).map((_, i) => (
                  <Rect key={'v'+i} x={i*20} y={0} width={1} height={600} fill="rgba(255,255,255,0.05)" />
               ))}
               {Array.from({ length: 30 }).map((_, i) => (
                  <Rect key={'h'+i} x={0} y={i*20} width={800} height={1} fill="rgba(255,255,255,0.05)" />
               ))}

               {pads.map((p, i) => (
                 <Group 
                   key={p.id} 
                   x={p.x} 
                   y={p.y} 
                   draggable 
                   onDragEnd={(e) => {
                     const newPads = [...pads];
                     newPads[i] = { ...newPads[i], x: Math.round(e.target.x()/5)*5, y: Math.round(e.target.y()/5)*5 };
                     setPads(newPads);
                   }}
                   onClick={() => setSelected(p.id)}
                 >
                   <Rect x={-p.radius} y={-p.radius} width={p.radius*2} height={p.radius*2} fill={selected === p.id ? "#a78bfa" : "#ef4444"} />
                   <Text text={(i+1).toString()} x={-p.radius} y={-p.radius} width={p.radius*2} height={p.radius*2} align="center" verticalAlign="middle" fill="white" fontSize={8} />
                 </Group>
               ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
