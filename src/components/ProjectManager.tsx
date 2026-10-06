import React, { useEffect, useState } from "react";
import { getProjects, deleteProject, ProjectData } from "../services/projects";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEditor } from "../store";
import { Trash2, Edit, Layers, Plus } from "lucide-react";

export function ProjectManager({
  onLaunchEditor,
}: {
  onLaunchEditor: () => void;
}) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setElements, setPcbElements, setCurrentProjectId, userMode, setUserMode, setActiveTutorialId, setIsAIChatOpen } = useEditor();

  const fetchProjects = async () => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    try {
      const data = await getProjects(auth.currentUser.uid);
      setProjects(data);
    } catch (error: any) {
      console.warn("Could not fetch projects from cloud, loading cached projects:", error);
      try {
        const lsData = localStorage.getItem("allvatronics_projects");
        const cached = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
        if (cached && cached.length > 0) {
          setProjects(cached.map((p: any) => ({
            ...p,
            updateAt: { toDate: () => new Date(p.updateAt?.toDate ? new Date() : p.updateAt || p.updatedAt || new Date()) }
          })));
          setErrorMsg(null);
        } else {
          setErrorMsg("Não foi possível sincronizar projetos da nuvem no momento. Use 'Novo Projeto' para começar.");
        }
      } catch (e) {
        setErrorMsg("Não foi possível carregar os projetos no momento.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsub = () => {};
    let isMounted = true;

    try {
      if (auth && (auth as any).onAuthStateChanged) {
        unsub = onAuthStateChanged(auth, async (user) => {
          if (!isMounted) return;
          if (user) {
            try {
              const data = await getProjects(user.uid);
              if (isMounted) {
                setProjects(data);
                setErrorMsg(null);
              }
            } catch (err) {
              console.warn("Could not fetch projects for user:", err);
            } finally {
              if (isMounted) setLoading(false);
            }
          } else {
            // Guest or not signed in
            if (isMounted) {
              try {
                const lsData = localStorage.getItem("allvatronics_projects");
                const cached = lsData && lsData !== "undefined" ? JSON.parse(lsData) : [];
                setProjects(cached.map((p: any) => ({
                  ...p,
                  updateAt: { toDate: () => new Date(p.updateAt?.toDate ? new Date() : p.updateAt || p.updatedAt || new Date()) }
                })));
              } catch (e) {}
              setLoading(false);
            }
          }
        });
      } else {
        fetchProjects();
      }
    } catch (e) {
      console.warn("Auth state listener error in ProjectManager", e);
      fetchProjects();
    }
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleOpenProject = (project: ProjectData) => {
    try {
      setElements(project.elements && project.elements !== "undefined" ? JSON.parse(project.elements) : []);
      setPcbElements(project.pcbElements && project.pcbElements !== "undefined" ? JSON.parse(project.pcbElements) : []);
      setCurrentProjectId(project.id!);
      onLaunchEditor();
    } catch (e) {
      console.error("Failed to parse project data", e);
      alert("Erro ao carregar o projeto: Dados corrompidos.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        await deleteProject(id);
        setProjects((p) => p.filter((x) => x.id !== id));
      } catch (e) {
        console.warn("Could not delete project:", e);
        setErrorMsg("Erro ao excluir projeto: " + (e as Error).message);
      }
    }
  };

  const handleNewProject = () => {
    setElements([]);
    setPcbElements([]);
    setCurrentProjectId(null);
    onLaunchEditor();
  };

  if (loading) {
    return <div className="text-gray-400">Carregando projetos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#16161a] border border-[#2d2d33] rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-white mb-1">Como quer utilizar a AllvaTronics?</h2>
          <p className="text-sm text-gray-400">Pode alterar a qualquer momento no editor.</p>
        </div>
        <div className="flex bg-[#0f0f13] border border-[#2d2d33] rounded-lg p-1">
          <button
            onClick={() => setUserMode("beginner")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${userMode === "beginner" ? "bg-teal-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-[#2d2d33]"}`}
          >
            Modo Iniciante
          </button>
          <button
            onClick={() => setUserMode("pro")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${userMode === "pro" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-[#2d2d33]"}`}
          >
            Modo Pro
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meus Projetos</h1>
          <p className="text-gray-400 text-sm">
            Gerencie seus arquivos de esquemático e PCB 2D/3D.
          </p>
        </div>
        <div>
          <button
            onClick={handleNewProject}
            className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition flex items-center shadow-lg shadow-teal-500/20 text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Novo Projeto
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-[#16161a] border border-[#2d2d33] rounded-xl p-12 text-center shadow-xl">
          <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum projeto</h3>
          <p className="text-gray-400 mb-6">
            Você ainda não tem nenhum projeto salvo.
          </p>
          <button
            onClick={handleNewProject}
            className="bg-[#2d2d33] hover:bg-teal-600 hover:text-white text-gray-300 px-6 py-2.5 rounded-lg font-medium transition text-xs"
          >
            Criar meu primeiro projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-[#16161a] border border-[#2d2d33] rounded-lg p-4 hover:border-teal-500/50 transition duration-300 shadow-xl flex flex-col h-full group"
            >
              <div className="flex-1">
                <h3
                  className="text-md font-bold text-white mb-1 truncate"
                  title={p.name}
                >
                  {p.name}
                </h3>
                <p className="text-[10px] text-gray-500 mb-4">
                  Atualizado:{" "}
                  {p.updateAt?.toDate
                    ? p.updateAt.toDate().toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex gap-3 mb-4">
                  <div className="bg-[#0f0f13] px-2 py-1 rounded text-[10px] text-gray-400 font-mono border border-[#2d2d33]">
                    SCH/PARTS:{" "}
                    {(() => {
                      try {
                        if (p.parts) return p.parts.length;
                        return (p.elements && p.elements !== "undefined") ? JSON.parse(p.elements).length : 0;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                  <div className="bg-[#0f0f13] px-2 py-1 rounded text-[10px] text-gray-400 font-mono border border-[#2d2d33]">
                    PCB/WIRING:{" "}
                    {(() => {
                      try {
                        if (p.wiringConnections) return p.wiringConnections.length;
                        return (p.pcbElements && p.pcbElements !== "undefined") ? JSON.parse(p.pcbElements).length : 0;
                      } catch {
                        return 0;
                      }
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2d2d33]">
                <button
                  onClick={() => handleOpenProject(p)}
                  className="text-teal-400 hover:text-teal-300 text-xs font-medium flex items-center transition"
                >
                  <Edit className="w-3 h-3 mr-1" /> Abrir no Editor
                </button>
                <button
                  onClick={() => handleDeleteProject(p.id!)}
                  className="text-gray-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-1"
                  title="Deletar Projeto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {userMode === 'beginner' && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Projetos de Exemplo</h2>
              <p className="text-gray-400">Circuitos prontos com Esquemático e PCB para estudar e aprender.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            <div className="bg-[#16161a] border border-[#2d2d33] rounded-lg p-4 hover:border-teal-500/50 transition duration-300 shadow-xl flex flex-col h-full group">
               <div className="flex-1">
                 <h3 className="text-md font-bold text-white mb-1">Pisca LED (Blink)</h3>
                 <p className="text-[10px] text-gray-500 mb-4">Exemplo Básico</p>
                 <p className="text-xs text-gray-400 mb-4">Um projeto simples com Arduino e um LED para aprender o fluxo básico.</p>
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-[#2d2d33]">
                 <button
                   onClick={() => {
                     setActiveTutorialId('blink');
                     setIsAIChatOpen(true);
                     setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'arduino_uno', name: 'Arduino' }, { id: '2', type: 'component', x: 500, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);
                     setPcbElements([{ id: '1', type: 'pcb_component', x: 300, y: 200, rotation: 0, componentType: 'pinheader', name: 'Arduino' }]);
                     setCurrentProjectId(null);
                     onLaunchEditor();
                   }}
                   className="text-teal-400 hover:text-teal-300 text-xs font-medium flex items-center transition"
                 >
                   <Edit className="w-3 h-3 mr-1" /> Estudar Exemplo
                 </button>
               </div>
            </div>
             <div className="bg-[#16161a] border border-[#2d2d33] rounded-lg p-4 hover:border-blue-500/50 transition duration-300 shadow-xl flex flex-col h-full group">
               <div className="flex-1">
                 <h3 className="text-md font-bold text-white mb-1">Controle de Motor DC</h3>
                 <p className="text-[10px] text-gray-500 mb-4">Exemplo Intermediário</p>
                 <p className="text-xs text-gray-400 mb-4">Usa um Transistor e um Switch para controlar um Motor de alta potência.</p>
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-[#2d2d33]">
                 <button
                   onClick={() => {
                     setActiveTutorialId('motor');
                     setIsAIChatOpen(true);
                     setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: 'B1', value: '9V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'switch', name: 'SW1' }, { id: '3', type: 'component', x: 600, y: 200, rotation: 0, componentType: 'motor', name: 'M1' }, { id: '4', type: 'component', x: 400, y: 350, rotation: 0, componentType: 'transistor', name: 'Q1' }]);
                     setPcbElements([{ id: '1', type: 'pcb_component', x: 200, y: 200, rotation: 0, componentType: 'pinheader', name: 'BATT' }]);
                     setCurrentProjectId(null);
                     onLaunchEditor();
                   }}
                   className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center transition"
                 >
                   <Edit className="w-3 h-3 mr-1" /> Estudar Exemplo
                 </button>
               </div>
            </div>
            
            <div className="bg-[#16161a] border border-[#2d2d33] rounded-lg p-4 hover:border-green-500/50 transition duration-300 shadow-xl flex flex-col h-full group">
               <div className="flex-1">
                 <h3 className="text-md font-bold text-white mb-1">Circuito Simples</h3>
                 <p className="text-[10px] text-gray-500 mb-4">Exemplo Básico</p>
                 <p className="text-xs text-gray-400 mb-4">O ponto de partida da eletrónica: Bateria, Resistor e LED.</p>
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-[#2d2d33]">
                 <button
                   onClick={() => {
                     setActiveTutorialId('simple');
                     setIsAIChatOpen(true);
                     setElements([{ id: '1', type: 'component', x: 200, y: 200, rotation: 0, componentType: 'battery', name: 'B1', value: '3V' }, { id: '2', type: 'component', x: 400, y: 200, rotation: 0, componentType: 'resistor', name: 'R1' }, { id: '3', type: 'component', x: 550, y: 200, rotation: 0, componentType: 'led', name: 'LED 1' }]);
                     setPcbElements([{ id: '1', type: 'pcb_component', x: 200, y: 200, rotation: 0, componentType: 'cr2032', name: 'BATT' }, { id: '2', type: 'pcb_component', x: 300, y: 200, rotation: 0, componentType: 'pad', name: 'R1' }]);
                     setCurrentProjectId(null);
                     onLaunchEditor();
                   }}
                   className="text-green-400 hover:text-green-300 text-xs font-medium flex items-center transition"
                 >
                   <Edit className="w-3 h-3 mr-1" /> Estudar Exemplo
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
