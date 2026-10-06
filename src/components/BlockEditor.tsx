import React, { useState, useEffect } from 'react';

type BlockType = 'start' | 'set_pin' | 'delay' | 'loop';

interface Block {
  id: string;
  type: BlockType;
  pin?: number;
  value?: string; // HIGH or LOW for pin, ms for delay
}

export function BlockEditor({ code, setCode }: { code: string, setCode: (c: string) => void }) {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'start' }
  ]);

  const generateCode = (currentBlocks: Block[]) => {
    let setup = '';
    let loop = '';
    
    // Auto-detect pins used
    const pinsUsed = new Set<number>();
    currentBlocks.forEach(b => {
      if (b.type === 'set_pin' && b.pin !== undefined) pinsUsed.add(b.pin);
    });
    
    pinsUsed.forEach(p => {
      setup += `  pinMode(${p}, OUTPUT);\n`;
    });

    currentBlocks.forEach(b => {
      if (b.type === 'set_pin') {
        loop += `  digitalWrite(${b.pin}, ${b.value});\n`;
      } else if (b.type === 'delay') {
        loop += `  delay(${b.value});\n`;
      }
    });

    const newCode = `void setup() {\n${setup}}\n\nvoid loop() {\n${loop}}`;
    setCode(newCode);
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = { id: Math.random().toString(), type };
    if (type === 'set_pin') {
      newBlock.pin = 13;
      newBlock.value = 'HIGH';
    } else if (type === 'delay') {
      newBlock.value = '1000';
    }
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    generateCode(newBlocks);
  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    generateCode(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, ...updates } : b);
    setBlocks(newBlocks);
    generateCode(newBlocks);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#16161a]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {blocks.map((b, index) => (
          <div key={b.id} className="relative flex items-center group">
            {b.type === 'start' && (
              <div className="h-10 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center px-4 w-full text-yellow-200 font-bold">
                Ao Iniciar
              </div>
            )}
            {b.type === 'set_pin' && (
              <div className="h-10 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-center px-4 w-full ml-4 text-blue-200">
                <span>Definir Pino</span>
                <input 
                  type="number" 
                  className="w-12 ml-2 mr-2 bg-[#0f0f13] text-white px-1 py-0.5 rounded border border-blue-500/30 outline-none text-center"
                  value={b.pin} 
                  onChange={(e) => updateBlock(b.id, { pin: parseInt(e.target.value) || 0 })}
                />
                <span>para</span>
                <select 
                  className="ml-2 bg-[#0f0f13] text-white px-1 py-0.5 rounded border border-blue-500/30 outline-none"
                  value={b.value}
                  onChange={(e) => updateBlock(b.id, { value: e.target.value })}
                >
                  <option value="HIGH">ALTO (Ligar)</option>
                  <option value="LOW">BAIXO (Desligar)</option>
                </select>
              </div>
            )}
            {b.type === 'delay' && (
              <div className="h-10 bg-purple-500/20 border border-purple-500/50 rounded-lg flex items-center px-4 w-full ml-4 text-purple-200">
                <span>Esperar</span>
                <input 
                  type="number" 
                  className="w-16 ml-2 mr-2 bg-[#0f0f13] text-white px-1 py-0.5 rounded border border-purple-500/30 outline-none text-center"
                  value={b.value} 
                  onChange={(e) => updateBlock(b.id, { value: e.target.value })}
                />
                <span>ms</span>
              </div>
            )}
            
            {b.type !== 'start' && (
              <button 
                onClick={() => removeBlock(b.id)}
                className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-opacity"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#2d2d33] flex gap-2 overflow-x-auto">
        <button 
          onClick={() => addBlock('set_pin')}
          className="shrink-0 px-3 py-1.5 text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/30 transition-colors"
        >
          + Pino
        </button>
        <button 
          onClick={() => addBlock('delay')}
          className="shrink-0 px-3 py-1.5 text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded hover:bg-purple-500/30 transition-colors"
        >
          + Tempo
        </button>
      </div>
    </div>
  );
}
