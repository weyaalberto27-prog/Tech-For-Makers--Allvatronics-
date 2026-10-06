import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, Sparkles, Copy, Check, MessageSquarePlus, Trash2, Paperclip, Image as ImageIcon, Camera } from 'lucide-react';
import { useEditor } from '../store';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'react-markdown';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { CircuitPhotoConverterModal } from './CircuitPhotoConverterModal';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isBlock = match || String(children).includes('\n');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isBlock) {
    return (
      <div className="relative my-3 bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="flex justify-between items-center px-3 py-1.5 bg-black/40 border-b border-white/10">
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{match ? match[1] : 'Code'}</span>
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Copiar código"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] font-medium">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
        <div className="p-3 overflow-x-auto text-xs font-mono text-gray-200">
          <code className={className} {...props}>{children}</code>
        </div>
      </div>
    );
  }

  return <code className="bg-black/30 px-1.5 py-0.5 rounded text-teal-300 font-mono text-xs border border-white/5" {...props}>{children}</code>;
};

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  imageBase64?: string;
}

export function AIAssistantChat({ onClose, inline, onAddParts }: { onClose: () => void, inline?: boolean, onAddParts?: (parts: any[], replace?: boolean, projectName?: string) => void }) {
  const { mode, setMode, setIs3DView, setIsCodePanelOpen, userMode, activeTutorialId, elements, pcbElements, setElements, setPcbElements, addElement, chatMessages: messages, setChatMessages: setMessages } = useEditor();
  const [showPhotoConverter, setShowPhotoConverter] = useState(false);
  const [converterInitialImage, setConverterInitialImage] = useState<string | null>(null);

  const getInitialMessage = () => {
    if (activeTutorialId === 'blink') {
      return 'Olá! Bem-vindo ao exemplo Pisca LED! Vamos ligar o LED ao Arduino e programá-lo passo-a-passo.\n1. Adicione um resistor em série com o LED.\n2. Ligue o resistor ao pino 13 do Arduino.\n3. Ligue o GND do LED ao GND do Arduino.\nDiga "próximo" quando quiser avançar, ou pergunte se tiver dúvidas.';
    } else if (activeTutorialId === 'motor') {
      return 'Olá! Exemplo de Controle de Motor DC carregado. O motor precisa de mais energia, por isso temos uma bateria de 9V.\nLigue a bateria ao motor e intercale o botão (Switch) para poder ligar e desligar. Diga "ajuda" para ver mais passos.';
    } else if (activeTutorialId === 'simple') {
      return 'Olá! Circuito simples com LED e bateria. Tente ligar o pólo positivo (+) da bateria ao resistor, e do resistor ao ânodo (pino longo) do LED. Dúvidas? Pergunte-me!';
    }
    if (onAddParts) return '✨ **AllvaCreator: Projetista 3D Ultra Realista Ativado!**\n\nSou a **Allva AI**. Crio designs 3D **ultra realistas (extremamente reais), 100% completos e bem detalhados** — com dezenas de peças anatômicas coordenadas, materiais PBR (metal polido, verniz brilhante, vidros fumê translúcidos e LEDs ativos), sem peças inacabadas ou flutuando no ar.\n\nDiga o que deseja criar (ex: *"Cria um super carro"*, *"Projeta um drone com câmera 4K"*) ou toque nas sugestões rápidas:';
    return 'Olá! Sou a sua Assistente IA de Eletrónica. Envie mensagens com suas dúvidas ou anexe uma foto de circuito para eu desenhar o esquemático e PCB em 2D e 3D diretamente na sua tela!';
  };

  // Removed local useState for messages since it's global now
  
  useEffect(() => {
    // Only load from network/storage if the global state is empty
    if (messages.length > 0) return;
    let unsubscribe = () => {};
    let isMounted = true;

    const loadChat = () => {
      const user = auth?.currentUser;
      if (user && db && !auth?.isDummy) {
        const docRef = doc(db, 'user_chats', user.uid);
        unsubscribe = onSnapshot(docRef, (snap) => {
           if (!isMounted) return;
           if (snap.exists()) {
             setMessages(snap.data().messages || []);
           } else {
             setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
           }
        }, (err) => {
           console.error("Error loading chat history:", err);
        });
      } else {
        try {
          const saved = localStorage.getItem('ai_chat_history');
          if (saved) {
             const parsed = JSON.parse(saved);
             if (parsed && parsed.length > 0) {
               setMessages(parsed);
               return;
             }
          }
        } catch(e) {}
        setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
      }
    };
    
    const authUnsub = (auth as any)?.onAuthStateChanged?.(() => {
       loadChat();
    });
    
    if (!(auth as any)?.onAuthStateChanged) {
        loadChat();
    }

    return () => {
       isMounted = false;
       unsubscribe();
       if (authUnsub) authUnsub();
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const user = auth?.currentUser;
    if (user && db && !auth?.isDummy) {
      setDoc(doc(db, 'user_chats', user.uid), { messages, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.error);
    } else {
      localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);
  const [inputValue, setInputValue] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTutorialId) {
      setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
    }
  }, [activeTutorialId]);
  
  const handleNewChat = () => {
    setMessages([{ id: Date.now().toString(), sender: 'ai', text: getInitialMessage() }]);
  };

  const handleConvertPhotoToCircuit = async (imgData: string, promptText?: string) => {
    setIsTyping(true);
    setAttachedImage(null);
    setInputValue('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText || "Converter foto de circuito em esquemático e PCB 2D e 3D.",
      imageBase64: imgData,
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/photo-to-circuit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData,
          description: promptText || "Foto de circuito eletrônico",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha na análise da imagem do circuito.");
      }

      const data = await response.json();

      // Immediately draw on canvas: schematic AND PCB (2D & 3D)!
      if (Array.isArray(data.elements) && data.elements.length > 0) {
        setElements(data.elements);
      }
      if (Array.isArray(data.pcbElements) && data.pcbElements.length > 0) {
        setPcbElements(data.pcbElements);
      }

      // Automatically switch to schematic so user sees it drawn on screen immediately
      setMode('schematic');
      setIs3DView(false);
      if (setIsCodePanelOpen) setIsCodePanelOpen(false);

      // Build informative response with detected parts and action buttons
      const detectedList = Array.isArray(data.detectedComponents)
        ? data.detectedComponents.map((c: any) => `• **${c.name}** (${c.type}): ${c.value || ''} - *${c.role || ''}*`).join('\n')
        : '';

      const schCount = (data.elements || []).filter((e: any) => e.type === 'component').length;
      const wireCount = (data.elements || []).filter((e: any) => e.type === 'wire').length;
      const pcbCompCount = (data.pcbElements || []).filter((e: any) => e.type === 'pcb_component').length;
      const traceCount = (data.pcbElements || []).filter((e: any) => e.type === 'trace').length;

      const aiReplyText = `✨ **Circuito Reconhecido e Desenhado com Sucesso!**\n\n**Projeto:** ${data.projectName || 'Circuito Convertido'}\n${data.description || ''}\n\n**Componentes Detectados:**\n${detectedList || 'Componentes identificados na foto.'}\n\n📊 **Estatísticas no Editor:**\n- **Esquemático 2D:** ${schCount} componentes, ${wireCount} conexões de fios desenhadas.\n- **Placa PCB 2D & 3D:** Placa base gerada com ${pcbCompCount} footprints e ${traceCount} trilhas de cobre.\n\n*O circuito já está desenhado na sua área de trabalho! Use os botões abaixo para alternar entre as visualizações:*`;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("[Convert Photo Error]:", err);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ Não foi possível converter a foto: ${err.message || 'Erro de comunicação'}. Você pode tentar novamente com uma foto mais nítida ou aproximada dos componentes.`,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSend = async () => {
    if ((!inputValue.trim() && !attachedImage) || isTyping) return;
    
    // If user attached an image in electronics workspace, prioritize converting it into schematic and PCB directly!
    if (attachedImage && !onAddParts) {
      await handleConvertPhotoToCircuit(attachedImage, inputValue.trim());
      return;
    }

    const userText = inputValue.trim() || (attachedImage ? "Imagem anexada." : "");
    const newUserMsg: Message = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: userText,
      ...(attachedImage && { imageBase64: attachedImage })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setAttachedImage(null);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMsg],
          mode,
          circuit: mode === 'schematic' ? elements : pcbElements,
          allvaCreatorMode: !!onAddParts
        })
      });
      let data;
      try {
        if (!response.ok) {
           const errText = await response.text();
           let errMsg = 'Erro na API';
           try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
           throw new Error(errMsg);
        }
        data = await response.json();
      } catch(e: any) {
         throw new Error(e.message || "Erro na conexão");
      }
      
      let replyText = data.reply || "Desculpe, não consegui gerar uma resposta.";
      
      // Auto-complete and 3D build logic with robust JSON extraction
      let jsonStr = "";
      const fenceMatch = replyText.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/i);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      } else {
        const rawJsonMatch = replyText.match(/(\{[\s\S]*"action"\s*:\s*"(?:build_3d|autocomplete)"[\s\S]*\})/);
        if (rawJsonMatch) jsonStr = rawJsonMatch[1].trim();
      }

      if (jsonStr) {
        let actionData: any = null;
        try {
          actionData = JSON.parse(jsonStr);
        } catch(e) {
          // Attempt repair on truncated JSON
          try {
            const lastBracket = jsonStr.lastIndexOf('}');
            if (lastBracket !== -1) {
              const repaired = jsonStr.substring(0, lastBracket + 1) + '\n  ]\n}';
              actionData = JSON.parse(repaired);
            }
          } catch(err2) {
            console.error("Could not repair JSON:", err2);
          }
        }

        if (actionData) {
          if (actionData.action === 'build_3d' && onAddParts) {
             const partsCount = Array.isArray(actionData.parts) ? actionData.parts.length : 0;
             if (fenceMatch) {
               replyText = replyText.replace(fenceMatch[0], `\n*(✨ Modelo 3D ultra realista gerado com ${partsCount} peças anatômicas e detalhadas na tela...)*\n`);
             }
             if (actionData.parts && actionData.parts.length > 0) {
               onAddParts(actionData.parts, actionData.replace !== false, actionData.projectName);
             }
          }
          else if (actionData.action === 'autocomplete') {
             if (fenceMatch) {
               replyText = replyText.replace(fenceMatch[0], '\n*(Auto-completando circuito na tela...)*\n');
             }
             if (actionData.components) {
               actionData.components.forEach((c: any) => {
                 addElement({
                   type: 'component',
                   componentType: c.type,
                   x: c.x || 0,
                   y: c.y || 0,
                   rotation: 0,
                   name: (c.type || 'comp').toUpperCase(),
                   value: c.value
                 });
               });
             }
             if (actionData.wires) {
                actionData.wires.forEach((w: any) => {
                  addElement({
                    type: 'wire',
                    points: w.points
                  });
                });
             }
          }
        } else if (fenceMatch && jsonStr.includes('build_3d')) {
          replyText = replyText.replace(fenceMatch[0], '\n*(A estrutura 3D foi gerada na área de trabalho 3D...)*\n');
        }
      }

      const newAiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: replyText };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (err: any) {
      console.error(err);
      let errorText = "Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.";
      if (err.message && err.message.includes("503")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message && err.message.includes("overloaded")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message && err.message.includes("high demand")) {
          errorText = "A IA está com alta demanda no momento. Por favor, tente novamente em alguns instantes.";
      } else if (err.message) {
          errorText = "Erro: " + err.message;
      }
      const newAiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: errorText };
      setMessages(prev => [...prev, newAiMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className={`flex flex-col ${inline ? "h-full w-full" : "h-[40vh] md:h-full bg-[#16161a] border-t md:border-t-0 md:border-r border-[#2d2d33] w-full md:w-80 shrink-0 shadow-2xl relative z-40 rounded-t-xl md:rounded-none"}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d33] bg-[#121215] rounded-t-xl md:rounded-none">
        <div className="flex items-center text-teal-400">
          <Sparkles className="w-4 h-4 mr-2" />
          <h3 className="text-sm font-bold tracking-wide">
            {onAddParts ? "Allva 3D Ultra Realista" : "Assistente IA"}
          </h3>
          {onAddParts && (
            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold bg-teal-500/20 text-teal-300 rounded border border-teal-500/30 uppercase tracking-wider">
              Ultra Detalhado
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {!onAddParts && (
            <button
              onClick={() => {
                setConverterInitialImage(attachedImage);
                setShowPhotoConverter(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 text-[11px] font-semibold border border-teal-500/30 transition shadow-sm"
              title="Converter Foto de Circuito em Esquemático e PCB (2D/3D)"
            >
              <Camera className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Foto ➔ Circuito</span>
            </button>
          )}
          <button onClick={handleNewChat} className="text-gray-400 hover:text-teal-400 transition p-1 rounded hover:bg-[#2d2d33]" title="Novo Chat">
            <MessageSquarePlus className="w-4 h-4" />
          </button>
          <button onClick={handleNewChat} className="text-gray-400 hover:text-red-400 transition p-1 rounded hover:bg-[#2d2d33]" title="Limpar Histórico">
            <Trash2 className="w-4 h-4" />
          </button>
          {!inline && <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-[#2d2d33]" title="Fechar">
            <X className="w-4 h-4" />
          </button>}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0f0f13]"
      >
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-[#2d2d33] text-gray-200 rounded-tl-none border border-[#3d3d45]'}`}>
               {msg.sender === 'ai' && (
                 <div className="flex items-center mb-1 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                   <Bot className="w-3 h-3 mr-1" />
                   Allva AI
                 </div>
               )}
               {msg.imageBase64 && (
                 <div className="mb-2 max-w-[200px] rounded overflow-hidden border border-black/20">
                   <img src={msg.imageBase64} alt="Attached" className="w-full h-auto" />
                 </div>
               )}
               <div className="whitespace-pre-wrap break-words markdown-body text-[13px]">
                 {msg.sender === 'user' ? (
                   msg.text
                 ) : (
                   <Markdown
                     components={{
                       code: CodeBlock,
                       p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                       strong: ({node, ...props}) => <strong className="font-bold text-teal-300" {...props} />,
                       ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                       ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                       li: ({node, ...props}) => <li {...props} />,
                     }}
                   >
                     {msg.text}
                   </Markdown>
                 )}
               </div>
               {msg.sender === "ai" && msg.text.includes("Circuito Reconhecido e Desenhado") && (
                 <div className="mt-3 pt-2.5 border-t border-[#3d3d45] flex flex-wrap gap-1.5">
                   <button
                     onClick={() => {
                       setMode("schematic");
                       setIs3DView(false);
                       if (setIsCodePanelOpen) setIsCodePanelOpen(false);
                     }}
                     className="px-2.5 py-1 bg-blue-600/40 hover:bg-blue-600 text-blue-200 hover:text-white rounded text-[11px] font-semibold border border-blue-500/40 transition flex items-center gap-1 shadow-sm"
                     title="Ver Esquemático 2D"
                   >
                     <span>👁️ Esquemático 2D</span>
                   </button>
                   <button
                     onClick={() => {
                       setMode("pcb");
                       setIs3DView(false);
                       if (setIsCodePanelOpen) setIsCodePanelOpen(false);
                     }}
                     className="px-2.5 py-1 bg-emerald-600/40 hover:bg-emerald-600 text-emerald-200 hover:text-white rounded text-[11px] font-semibold border border-emerald-500/40 transition flex items-center gap-1 shadow-sm"
                     title="Ver Placa PCB 2D"
                   >
                     <span>🟩 Placa PCB 2D</span>
                   </button>
                   <button
                     onClick={() => {
                       setIs3DView(true);
                       if (setIsCodePanelOpen) setIsCodePanelOpen(false);
                     }}
                     className="px-2.5 py-1 bg-purple-600/40 hover:bg-purple-600 text-purple-200 hover:text-white rounded text-[11px] font-semibold border border-purple-500/40 transition flex items-center gap-1 shadow-sm"
                     title="Ver Placa PCB em 3D"
                   >
                     <span>🧊 Vista 3D Realista</span>
                   </button>
                 </div>
               )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-[#2d2d33] text-gray-200 rounded-lg p-3 rounded-tl-none border border-[#3d3d45] flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#121215] border-t border-[#2d2d33]">
        {/* Sugestões Rápidas de Design Ultra Realista para AllvaCreator */}
        {onAddParts && (
          <div className="mb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {[
              { label: "🏎️ Supercarro Completo", prompt: "Cria um super carro esportivo ultra realista e completo com faróis bi-LED, para-brisa, teto, janelas, interior com bancos esportivos, rodas cromadas com pinças de freio, aerofólio e escapamento." },
              { label: "🛸 Drone Tático 4K", prompt: "Projeta um drone quadricóptero tático ultra realista e completo com gimbal estabilizado, câmera 4K, 4 motores brushless, hélices, trem de pouso e bateria LiPo." },
              { label: "👓 Smart Glasses", prompt: "Projeta óculos inteligentes smart glasses ultra realistas e completos com armação frontal de titânio, lentes polarizadas, visor HUD holográfico, microcâmera e hastes ergonômicas com linha curva anatômica de acabamento perfeito nas orelhas." },
              { label: "🤖 Braço Robótico", prompt: "Projeta um braço robótico industrial articulado ultra realista e completo com base giratória de aço, servomotores cilíndricos, antebraço treliçado e garra dupla." },
              { label: "🎮 Console Gamer", prompt: "Projeta um console portátil gamer ultra realista e completo com tela OLED widescreen, analógicos, botões e saídas de ar." },
              { label: "⌚ Smartwatch Luxo", prompt: "Projeta um smartwatch de luxo ultra realista e completo com caixa em aço escovado, coroa lateral, tela AMOLED curva e sensor cardíaco." },
            ].map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputValue(sug.prompt);
                }}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] font-medium bg-[#1e1e24] hover:bg-teal-500/20 text-gray-300 hover:text-teal-300 border border-[#33333d] hover:border-teal-500/40 rounded-full transition-all shrink-0 active:scale-95"
              >
                {sug.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col bg-[#0f0f13] border border-[#2d2d33] rounded-lg p-1 focus-within:border-teal-500 transition-colors">
          {attachedImage && (
            <div className="m-2 p-2 rounded-lg bg-[#16161a] border border-[#2d2d33] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 rounded border border-[#3d3d45] overflow-hidden">
                    <img src={attachedImage} alt="attachment" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-300 font-medium block">Imagem de circuito anexada</span>
                    <span className="text-[9px] text-gray-500">Pronta para envio ou conversão</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAttachedImage(null)}
                  className="bg-black/60 hover:bg-black/90 rounded p-1 text-gray-400 hover:text-white transition"
                  title="Remover imagem"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {!onAddParts && (
                <button
                  type="button"
                  onClick={() => handleConvertPhotoToCircuit(attachedImage, inputValue.trim())}
                  className="w-full py-2 px-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-teal-200 animate-pulse" />
                  Desenhar Circuito na Tela (Esquemático & PCB 2D/3D)
                </button>
              )}
            </div>
          )}
          <div className="flex items-center w-full">
            <button 
              type="button"
              className="p-1.5 text-gray-500 hover:text-teal-400 transition-colors rounded-md hover:bg-[#2d2d33]"
              title="Anexar imagem"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setAttachedImage(ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
            >
              <Paperclip className="w-4 h-4" />
            </button>
            {!onAddParts && (
              <button
                type="button"
                className="p-1.5 text-gray-500 hover:text-teal-400 transition-colors rounded-md hover:bg-[#2d2d33]"
                title="Fotografar circuito com câmera do celular ou anexar foto"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  (input as any).capture = "environment";
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setAttachedImage(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={onAddParts ? "Peça um design 3D ultra realista (ex: Carro esportivo, Drone)..." : "Pergunte sobre o circuito..."}
              className="flex-1 bg-transparent border-none text-sm text-white px-3 py-1.5 focus:outline-none placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={(!inputValue.trim() && !attachedImage) || isTyping}
              className="p-1.5 text-teal-500 hover:text-teal-400 disabled:text-gray-600 disabled:hover:text-gray-600 transition-colors rounded-md hover:bg-[#2d2d33]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        {userMode === 'beginner' && (
          <p className="text-[9px] text-gray-500 text-center mt-2">Dica: A IA pode sugerir ligações e código para os componentes.</p>
        )}
      </div>

      {/* Modal de Conversão Foto para Circuito */}
      <CircuitPhotoConverterModal
        isOpen={showPhotoConverter}
        onClose={() => setShowPhotoConverter(false)}
        initialImage={converterInitialImage}
        onLaunchEditor={() => {
          setShowPhotoConverter(false);
          setAttachedImage(null);
          setMode('schematic');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: '⚡ **Circuito importado com sucesso a partir da foto!**\n\nO esquemático 2D e o layout da placa PCB (2D e 3D) estão agora carregados no seu projeto. Você pode alternar entre as abas **Esquemático**, **PCB** e **Vista 3D** no topo do editor para inspecionar, testar e editar o circuito.'
            }
          ]);
        }}
      />
    </div>
  );
}
