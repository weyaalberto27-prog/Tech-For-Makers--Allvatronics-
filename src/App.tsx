import { useState, useEffect } from 'react';
import { EditorProvider, useEditor } from './store';
import { Toolbar } from './components/Toolbar';
import { BlockEditor } from './components/BlockEditor';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { CanvasEditor } from './components/CanvasEditor';
import { CanvasViewer3D } from './components/CanvasViewer3D';
import { RealTimeOscilloscope } from './components/RealTimeOscilloscope';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { FootprintEditor } from './components/FootprintEditor';
import { AIAssistantChat } from './components/AIAssistantChat';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { BoxSelect } from 'lucide-react';

function EditorLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [inEditor, setInEditor] = useState(false);
  const [showFootprintEditor, setShowFootprintEditor] = useState(false);
  
  const { is3DView, setIs3DView, isCodePanelOpen, setIsCodePanelOpen, code, setCode, elements, pcbElements, userMode, isBlockMode, setIsBlockMode, hasSeenTutorial, setHasSeenTutorial, mode, setMode, isAIChatOpen, setIsAIChatOpen, addCustomComponent } = useEditor();

  (window as any)._globalAppCode = code;
  const hasMCU = [...elements, ...pcbElements].some((e) => e.type === 'component' && ['arduino_uno', 'esp32', 'esp32_cam', 'raspberry_pi'].includes((e as any).componentType));

  const currentTab = isCodePanelOpen ? 'code' : is3DView ? '3d' : mode;

  useEffect(() => {
    const handleOpenFootprint = () => setShowFootprintEditor(true);
    window.addEventListener("open-footprint-editor", handleOpenFootprint);
    return () => window.removeEventListener("open-footprint-editor", handleOpenFootprint);
  }, []);
  
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (auth && auth.isDummy) {
          // Dummy auth
          unsubscribe = (auth as any).onAuthStateChanged((user: any) => {
            if (!(window as any).guestAuthBypass) {
              setIsAuthenticated(!!user);
            }
          });
      } else {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!(window as any).guestAuthBypass) {
            setIsAuthenticated(!!user);
          }
        });
      }
    } catch (e) {
       console.warn("Auth state error", e);
       setIsAuthenticated(false);
    }
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="fixed inset-0 bg-[#0f0f13] flex items-center justify-center p-4">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <WelcomeScreen onComplete={() => {
      (window as any).guestAuthBypass = true;
      setIsAuthenticated(true);
    }} />;
  }

  if (!inEditor) {
    return <Dashboard onLaunchEditor={() => setInEditor(true)} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0f0f13] text-white font-sans overflow-hidden relative">
      <Toolbar 
        toggleLeft={() => setShowProperties(!showProperties)} 
        toggleRight={() => setShowSidebar(!showSidebar)} 
        onExit={() => setInEditor(false)}
      />
      <div className="flex flex-1 overflow-hidden relative w-full h-full">
        {userMode === 'beginner' && !hasSeenTutorial && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#16161a] border border-[#2d2d33] rounded-2xl p-6 max-w-[320px] w-full shadow-2xl relative overflow-hidden transform transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
              
              <div className="flex flex-col items-center text-center mb-4 mt-2">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-teal-500/30">
                  <span className="text-2xl animate-bounce">👋</span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">Modo Iniciante</h2>
                <p className="text-teal-400 text-[11px] font-medium mt-1">Ambiente de aprendizagem simplificado.</p>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center bg-[#0f0f13] p-2.5 rounded-lg border border-[#2d2d33] hover:border-blue-500/50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3 shrink-0 text-[10px] font-bold">1</div>
                  <p className="text-[11px] text-gray-300 leading-tight"><strong>Componentes Essenciais:</strong> Foco no básico com ligações automáticas.</p>
                </div>
                <div className="flex items-center bg-[#0f0f13] p-2.5 rounded-lg border border-[#2d2d33] hover:border-green-500/50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mr-3 shrink-0 text-[10px] font-bold">2</div>
                  <p className="text-[11px] text-gray-300 leading-tight"><strong>Projetos Prontos:</strong> Vá ao "Hub de Estudo" e escolha exemplos para começar.</p>
                </div>
                <div className="flex items-center bg-[#0f0f13] p-2.5 rounded-lg border border-[#2d2d33] hover:border-purple-500/50 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3 shrink-0 text-[10px] font-bold">3</div>
                  <p className="text-[11px] text-gray-300 leading-tight"><strong>IA Chat Interativo:</strong> Um assistente pessoal para ajudar e validar circuitos.</p>
                </div>
              </div>

              <button 
                onClick={() => setHasSeenTutorial(true)}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 text-xs transform hover:scale-[1.02]"
              >
                Começar a Criar
              </button>
            </div>
          </div>
        )}
        {/* Mobile Overlays */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300 md:hidden ${showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowSidebar(false)}
        />
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300 md:hidden ${showProperties ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setShowProperties(false)}
        />

        {/* Left Panels Container */}
        <div className={`absolute md:relative z-30 h-full flex transition-transform duration-300 md:translate-x-0 ${showProperties ? 'translate-x-0' : '-translate-x-full'}`}>
          <PropertiesPanel />
        </div>

        {/* Desktop AI Chat Panel */}
        {isAIChatOpen && (
          <div className="hidden md:flex relative z-30 h-full shadow-2xl">
            <AIAssistantChat onClose={() => setIsAIChatOpen(false)} />
          </div>
        )}
        
        {/* Center Area Container */}
        <div className="flex-1 h-full relative overflow-hidden flex flex-col bg-[#0f0f13]">
          
          {/* Editor Tabs */}
          <div className="flex bg-[#121215] border-b border-[#2d2d33] shrink-0 overflow-x-auto scrollbar-hide md:custom-scrollbar">
            <button
              onClick={() => { setMode('schematic'); setIs3DView(false); setIsCodePanelOpen(false); }}
              className={`px-6 py-2.5 text-sm font-medium border-r border-[#2d2d33] transition-colors whitespace-nowrap ${currentTab === 'schematic' ? 'bg-[#1e1e24] text-blue-400 border-b-2 border-b-blue-500' : 'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border-b-2 border-b-transparent'}`}
            >
              Esquemático
            </button>
            <button
              onClick={() => { setMode('pcb'); setIs3DView(false); setIsCodePanelOpen(false); }}
              className={`px-6 py-2.5 text-sm font-medium border-r border-[#2d2d33] transition-colors whitespace-nowrap ${currentTab === 'pcb' ? 'bg-[#1e1e24] text-blue-400 border-b-2 border-b-blue-500' : 'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border-b-2 border-b-transparent'}`}
            >
              PCB
            </button>
            <button
              onClick={() => { setIs3DView(true); setIsCodePanelOpen(false); }}
              className={`px-6 py-2.5 text-sm font-medium border-r border-[#2d2d33] transition-colors whitespace-nowrap ${currentTab === '3d' ? 'bg-[#1e1e24] text-blue-400 border-b-2 border-b-blue-500' : 'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border-b-2 border-b-transparent'}`}
            >
              Vista 3D
            </button>
            {hasMCU && (
              <button
                onClick={() => { setIsCodePanelOpen(true); setIs3DView(false); }}
                className={`px-6 py-2.5 text-sm font-medium border-r border-[#2d2d33] transition-colors whitespace-nowrap ${currentTab === 'code' ? 'bg-[#1e1e24] text-blue-400 border-b-2 border-b-blue-500' : 'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200 border-b-2 border-b-transparent'}`}
              >
                Código
              </button>
            )}
          </div>

          <div className="flex-1 relative flex overflow-hidden">
            {/* Main 2D Canvas OR 3D Canvas */}
            <div className={`flex-1 relative flex flex-col min-w-0 ${currentTab === 'code' ? 'hidden' : ''}`}>
               {is3DView ? <CanvasViewer3D /> : <CanvasEditor />}
               <RealTimeOscilloscope />
            </div>

            {/* Mobile AI Chat Container (Bottom Sheet) */}
            {isAIChatOpen && (
              <div className="md:hidden absolute bottom-0 left-0 right-0 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <AIAssistantChat onClose={() => setIsAIChatOpen(false)} />
              </div>
            )}

            {/* Code Editor Panel */}
            {currentTab === 'code' && hasMCU && (
              <div className="flex-1 h-full bg-[#16161a] flex flex-col z-10 shrink-0">
                <div className="h-10 border-b border-[#2d2d33] flex items-center justify-between px-4 shrink-0 bg-[#121215]">
                  <h3 className="text-sm font-semibold text-gray-300">
                    {userMode === 'beginner' && isBlockMode ? 'Programação em Blocos' : 'C++ Microcontroller Code'}
                  </h3>
                  {userMode === 'beginner' && (
                    <button 
                      onClick={() => setIsBlockMode(!isBlockMode)}
                      className="text-xs px-2 py-1 bg-[#2d2d33] rounded hover:bg-[#3d3d45] text-gray-300"
                    >
                      {isBlockMode ? "Ver C++" : "Ver Blocos"}
                    </button>
                  )}
                </div>
                <div className="flex-1 relative">
                  {userMode === 'beginner' && isBlockMode ? (
                    <BlockEditor code={code} setCode={setCode} />
                  ) : (
                    <textarea
                      className="w-full h-full bg-transparent text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none custom-scrollbar"
                      placeholder="void setup() { ... }"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar (Right) */}
        <div className={`absolute right-0 md:relative z-30 h-full transition-transform duration-300 md:translate-x-0 ${showSidebar ? 'translate-x-0' : 'translate-x-[100%]'}`}>
          <Sidebar />
        </div>
        
        {showFootprintEditor && (
          <FootprintEditor 
            onClose={() => setShowFootprintEditor(false)}
            onSave={(footprint) => {
              addCustomComponent({
                type: `custom_${Date.now()}`,
                label: `Custom Part ${Math.floor(Math.random() * 1000)}`,
                icon: BoxSelect,
                ...footprint
              });
              setShowFootprintEditor(false);
            }} 
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}

