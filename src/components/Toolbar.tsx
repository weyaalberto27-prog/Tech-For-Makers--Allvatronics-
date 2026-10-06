import React from "react";
import { useEditor } from "../store";
import {
  Save,
  Undo2,
  Trash2,
  Cpu,
  Grid,
  SlidersHorizontal,
  ArrowLeft,
  RotateCw,
  Box,
  Download,
  Play,
  Square,
  Wand2,
  FolderOpen,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "../lib/utils";
import { auth } from "../firebase";
import { saveProject } from "../services/projects";

export function Toolbar({
  toggleLeft,
  toggleRight,
  onExit,
}: {
  toggleLeft?: () => void;
  toggleRight?: () => void;
  onExit?: () => void;
}) {
  const {
    activePcbLayer,
    setActivePcbLayer,
    diffPairActive,
    setDiffPairActive,
    elements,
    setElements,
    clearElements,
    mode,
    setMode,
    selectedIds,
    updateElement,
    pcbElements,
    setPcbElements,
    currentProjectId,
    setCurrentProjectId,
    undo,
    is3DView,
    setIs3DView,
    isSimulating,
    setIsSimulating,
    userMode,
    setUserMode,
    smartWiring,
    wireDirection,
    setWireDirection,
    setSmartWiring,
    setActiveTutorialId,
    isAIChatOpen,
    setIsAIChatOpen,
    boardTheme,
    setBoardTheme
  } = useEditor();

  const [isSaving, setIsSaving] = React.useState(false);
  const hasSelection = selectedIds && selectedIds.length > 0;

  const loadExample = (type: string) => {
    setActiveTutorialId(type);
    setIsAIChatOpen(true);
    if (type === 'blink') {
      setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'arduino_uno', name: 'Arduino' }, { id: '2', type: 'component', x: 500, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);
      setPcbElements([{ id: '1', type: 'pcb_component', x: 300, y: 200, rotation: 0, componentType: 'pinheader', name: 'Arduino' }]);
    } else if (type === 'motor') {
      setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: '9V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'switch', name: 'SW1' }, { id: '3', type: 'component', x: 600, y: 200, rotation: 0, componentType: 'motor', name: 'M1' }]);
      setPcbElements([{ id: '1', type: 'pcb_component', x: 200, y: 200, rotation: 0, componentType: 'pinheader', name: 'BATT' }]);
    } else if (type === 'simple') {
      setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: '3V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'resistor', name: 'R1' }, { id: '3', type: 'component', x: 550, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);
      setPcbElements([{ id: '1', type: 'pcb_component', x: 200, y: 200, rotation: 0, componentType: 'cr2032', name: 'BATT' }, { id: '2', type: 'pcb_component', x: 300, y: 200, rotation: 0, componentType: 'pad', name: 'R1' }]);
    }
  };

  const handleRotate = () => {
    if (!selectedIds) return;
    selectedIds.forEach((id) => {
      let el: any = elements.find((e) => e.id === id);
      if (!el) {
        el = pcbElements.find((e) => e.id === id);
      }
      if (el && (el.type === "component" || el.type === "pcb_component")) {
        updateElement(id, { rotation: (el.rotation + 90) % 360 });
      }
    });
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("Faça login para salvar seus projetos na nuvem.");
      return;
    }
    setIsSaving(true);
    try {
      const id = await saveProject(
        auth.currentUser.uid,
        `Projeto ${new Date().toLocaleDateString()}`,
        elements,
        pcbElements,
        currentProjectId || undefined,
      );
      if (!currentProjectId) {
        setCurrentProjectId(id);
      }
      alert("Projeto salvo com sucesso!");
    } catch (error) {
      console.warn("Could not save project:", error);
      alert(
        "Erro ao salvar. Verifique se você tem permissão ou faça login novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-14 shrink-0 bg-[#16161a] border-b border-[#2d2d33] flex items-center justify-between px-2 md:px-4 overflow-x-auto overflow-y-hidden scrollbar-hide md:custom-scrollbar z-10 w-full relative">
      <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
        {onExit && (
          <button 
            onClick={onExit} 
            className="flex items-center mr-2 group" 
            title="Voltar"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2d2d33] group-hover:bg-[#3d3d43] transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        )}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center mr-2 shadow-sm p-1.5">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-white"
              fill="currentColor"
            >
              <path
                d="M 50 25 L 75 70"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 37.5 47.5 L 75 70"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="50" cy="25" r="12" />
              <circle cx="75" cy="70" r="12" />
              <circle cx="25" cy="70" r="12" />
              <circle cx="37.5" cy="47.5" r="6" />
            </svg>
          </div>
          <span className="text-white font-semibold hidden md:inline">
            AllvaTronics <span className="text-[10px] font-normal text-gray-400 ml-1">Tech for makers</span>
          </span>
        </div>
        
        <div className="h-6 w-px bg-[#2d2d33] mx-2"></div>

        

        <div className="flex bg-[#2d2d33] rounded-lg p-1">
          <button
            onClick={() => setBoardTheme('dark')}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              boardTheme === "dark"
                ? "bg-slate-700 text-white"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Escuro"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setBoardTheme('light')}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              boardTheme === "light"
                ? "bg-slate-200 text-slate-900"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Claro"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-6 w-px bg-[#2d2d33] mx-2"></div>

        <div className="flex bg-[#2d2d33] rounded-lg p-1">
          <button
            onClick={() => setUserMode("beginner")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              userMode === "beginner"
                ? "bg-teal-600 text-white"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Iniciante - Interface Simplificada"
          >
            Iniciante
          </button>
          <button
            onClick={() => setUserMode("pro")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center",
              userMode === "pro"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            )}
            title="Modo Pro - Todas as Funcionalidades"
          >
            Pro
          </button>
        </div>
        
        <div className="h-6 w-px bg-[#2d2d33] mx-1 md:mx-2 hidden sm:block"></div>
        <button
          onClick={undo}
          className="flex items-center text-xs md:text-sm text-gray-300 hover:text-white px-2 py-1.5 rounded hover:bg-[#2d2d33] transition"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={clearElements}
          className="flex items-center text-xs md:text-sm text-red-400 hover:text-red-300 px-2 py-1.5 rounded hover:bg-[#2d2d33] transition"
          title="Limpar Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
        {!is3DView && (
          <div className="flex items-center space-x-1 mx-2 border-l border-[#2d2d33] pl-2 hidden sm:flex">
            <select
              value={wireDirection}
              onChange={(e) => setWireDirection(e.target.value as any)}
              className="bg-[#2d2d33] text-gray-200 text-xs px-2 py-1 rounded outline-none border border-transparent focus:border-blue-500 transition-colors"
            >
              <option value="auto">Roteamento: Auto</option>
              <option value="h-first">Roteamento: Horizontal Primeiro</option>
              <option value="v-first">Roteamento: Vertical Primeiro</option>
            </select>
          </div>
        )}
        
        
        

        {mode === "pcb" && !is3DView && userMode === "pro" && (
          <div className="flex items-center space-x-1 mx-2 border-l border-[#2d2d33] pl-2 hidden sm:flex">
            <span className="text-xs text-gray-500 mr-2 uppercase tracking-wide">
              Trilhas
            </span>
            
            <button
              onClick={() => setSmartWiring(!smartWiring)}
              className={cn(
                "px-2 py-1 flex items-center text-xs rounded transition-colors mr-1",
                smartWiring
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                  : "text-gray-400 hover:text-gray-200 border border-transparent",
              )}
              title="Roteamento Inteligente (Avoid Obstacles)"
            >
              Push & Shove
            </button>
            <button
              onClick={() => setDiffPairActive(!diffPairActive)}
              className={cn(
                "px-2 py-1 flex items-center text-xs rounded transition-colors mr-2 border-r border-[#2d2d33] pr-3",
                diffPairActive
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                  : "text-gray-400 hover:text-gray-200 border border-transparent",
              )}
              title="Pares Diferenciais"
            >
              Diff Pairs
            </button>

            <button
              onClick={() => setActivePcbLayer("top")}
              className={cn(
                "px-2 py-1 flex items-center text-xs rounded transition-colors",
                activePcbLayer === "top"
                  ? "bg-red-500/20 text-red-400 border border-red-500/50"
                  : "text-gray-400 hover:text-gray-200 border border-transparent",
              )}
              title="Trilha Superior (Positiva/Vermelha)"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5 shadow-[0_0_8px_#ef4444]"></div>{" "}
              Topo
            </button>
            <button
              onClick={() => setActivePcbLayer("bottom")}
              className={cn(
                "px-2 py-1 flex items-center text-xs rounded transition-colors",
                activePcbLayer === "bottom"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                  : "text-gray-400 hover:text-gray-200 border border-transparent",
              )}
              title="Trilha Inferior (Negativa/Azul)"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 shadow-[0_0_8px_#3b82f6]"></div>{" "}
              Fundo
            </button>
          </div>
        )}

        {/* Simulate Button globally available */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={cn(
            "flex items-center text-xs md:text-sm px-2 md:px-3 py-1.5 rounded transition gap-1 md:gap-2 border mr-2",
            isSimulating 
              ? "text-red-400 hover:text-red-300 hover:bg-[#2d2d33] border-red-500/30"
              : "text-amber-400 hover:text-amber-300 hover:bg-[#2d2d33] border-amber-500/30"
          )}
        >
          {isSimulating ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span className="hidden md:inline">{isSimulating ? "Parar" : "Simular"}</span>
        </button>

        {mode === "pcb" && !is3DView && userMode === "pro" && (
          <>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("auto-route-pcb"))}
              className="flex items-center text-xs md:text-sm text-blue-400 hover:text-blue-300 px-2 md:px-3 py-1.5 rounded hover:bg-[#2d2d33] transition gap-1 md:gap-2 border border-blue-500/30 mr-2"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden md:inline">Auto-Route</span>
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("ai-circuit-review"))}
              className="flex items-center text-xs md:text-sm text-purple-400 hover:text-purple-300 px-2 md:px-3 py-1.5 rounded hover:bg-[#2d2d33] transition gap-1 md:gap-2 border border-purple-500/30 mr-2"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden md:inline">Revisão IA (DRC)</span>
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-footprint-editor"))}
              className="flex items-center text-xs md:text-sm text-teal-400 hover:text-teal-300 px-2 md:px-3 py-1.5 rounded hover:bg-[#2d2d33] transition gap-1 md:gap-2 border border-teal-500/30 mr-2"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden md:inline">Editor de Footprints</span>
            </button>
          </>
        )}
        
        {mode === "schematic" && !is3DView && (
          <>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("export-to-pcb"))}
              className="flex items-center text-xs md:text-sm text-green-400 hover:text-green-300 px-2 md:px-3 py-1.5 rounded hover:bg-[#2d2d33] transition gap-1 md:gap-2 border border-green-500/30 mr-2"
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden md:inline">Exportar para PCB</span>
            </button>


          </>
        )}

        <button
          onClick={handleRotate}
          disabled={!hasSelection}
          className={cn(
            "p-2 rounded transition-colors",
            hasSelection ? "text-blue-400 hover:bg-[#2d2d33]" : "text-gray-600 cursor-not-allowed"
          )}
          title="Rodar Componente (R)"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        
        <div className="h-6 w-px bg-[#2d2d33] mx-1 md:mx-2"></div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center text-xs md:text-sm text-green-400 hover:text-green-300 px-2 md:px-3 py-1.5 rounded hover:bg-[#2d2d33] transition gap-1 md:gap-2"
          title="Salvar Projeto"
        >
          <Save className="w-4 h-4" />
          <span className="hidden md:inline">{isSaving ? "Salvando..." : "Salvar"}</span>
        </button>

        <button
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className={cn(
            "flex items-center text-xs md:text-sm px-2 md:px-3 py-1.5 rounded transition gap-1 md:gap-2 border",
            isAIChatOpen 
              ? "text-teal-400 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20" 
              : "text-gray-400 border-transparent hover:bg-[#2d2d33] hover:text-gray-300"
          )}
          title="Assistente IA"
        >
          <Wand2 className="w-4 h-4" />
          <span className="hidden md:inline">IA Chat</span>
        </button>

        {toggleLeft && (
          <button
            onClick={toggleLeft}
            title="Propriedades"
            className="md:hidden p-1.5 bg-[#2d2d33] text-gray-300 hover:text-white rounded transition ml-1"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        {toggleRight && (
          <button
            onClick={toggleRight}
            title="Catálogo"
            className="md:hidden p-1.5 bg-[#2d2d33] text-gray-300 hover:text-white rounded transition ml-1"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
