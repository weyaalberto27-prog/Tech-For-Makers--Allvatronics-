import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  BookOpen,
  Layers,
  Box,
  Cpu,
  Calculator,
  Compass,
  Move,
  RotateCw,
  Maximize2,
  Upload,
  Zap,
} from "lucide-react";

export interface TourStep {
  title: string;
  badge: string;
  description: string;
  tips?: string[];
  icon: React.ReactNode;
  highlightSelector?: string;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  title: string;
  steps: TourStep[];
}

export function InteractiveTour({
  isOpen,
  onClose,
  tourId,
  title,
  steps,
}: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleFinish();
      } else if (e.key === "ArrowRight") {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          handleFinish();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, steps.length]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleFinish = () => {
    try {
      localStorage.setItem(`tour_completed_${tourId}`, "true");
    } catch (e) {
      console.warn("Could not save tour state", e);
    }
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#16161a] border border-[#2d2d33] rounded-2xl w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col text-white"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Progress bar */}
        <div className="w-full bg-[#1e1e24] h-1.5">
          <div
            className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 h-1.5 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#24242b]">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {title}
              </h2>
              <span className="text-[11px] text-teal-400 font-medium">
                Passo {currentStep + 1} de {steps.length}
              </span>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#25252d] transition"
            title="Fechar / Pular Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {/* Badge & Icon Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 shadow-lg shadow-teal-500/10">
              {step.icon}
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-1">
                {step.badge}
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {step.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Highlights / Tips */}
          {step.tips && step.tips.length > 0 && (
            <div className="space-y-2 bg-[#0f0f13] border border-[#26262e] rounded-xl p-3.5 mb-2">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                Destaques deste recurso:
              </span>
              {step.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start text-xs text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 mr-2 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121215] border-t border-[#24242b]">
          <button
            onClick={handleFinish}
            className="text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded hover:bg-[#202026]"
          >
            Pular Tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center px-3 py-1.5 rounded-lg border border-[#2d2d33] text-gray-300 hover:text-white hover:bg-[#202026] text-xs font-medium transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Anterior
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-500/20 transition transform active:scale-95"
            >
              <span>{currentStep === steps.length - 1 ? "Concluir" : "Próximo"}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured steps for Study Hub (Dashboard)
export const STUDY_HUB_TOUR_STEPS: TourStep[] = [
  {
    title: "Bem-vindo ao Hub de Estudo AllvaTronics Pro",
    badge: "Visão Geral",
    icon: <BookOpen className="w-6 h-6" />,
    description:
      "O seu centro de comando para engenharia eletrônica, prototipagem, bibliotecas de componentes e gerenciamento de projetos.",
    tips: [
      "Acesso centralizado aos seus esquemáticos e placas PCB.",
      "Troca rápida entre o Hub de Estudo e o Editor de Circuitos.",
      "Integração nativa com a Allva AI para tirar dúvidas e acelerar desenvolvimentos.",
    ],
  },
  {
    title: "Modos de Utilização: Iniciante vs Pro",
    badge: "Personalização",
    icon: <Zap className="w-6 h-6" />,
    description:
      "Escolha a interface que melhor se adapta à sua experiência. Alterne entre os modos a qualquer momento sem perder seus dados.",
    tips: [
      "Modo Iniciante: Menos distrações, foco no básico e tutoriais práticos com IA integrada.",
      "Modo Pro: Ferramentas completas de CAD eletrônico, roteamento avançado e controle fino de camadas.",
    ],
  },
  {
    title: "Biblioteca de Componentes & Guia de PCB",
    badge: "Referência Técnica",
    icon: <Cpu className="w-6 h-6" />,
    description:
      "Consulte detalhes técnicos, faixas de tensão, pinagens e funções de dezenas de componentes clássicos e modernos (Arduino, ESP32, Semicondutores, Passivos).",
    tips: [
      "Busca rápida e filtragem por categorias.",
      "Páginas de teoria prática sobre fabricação e traçado de PCBs.",
      "Calculadora de código de cores de resistores integrada.",
    ],
  },
  {
    title: "AllvaCreator 3D: Modelador de Peças e Gabinetes",
    badge: "Modelagem 3D",
    icon: <Box className="w-6 h-6" />,
    description:
      "Crie caixas personalizadas, chassis de robôs e peças 3D para seus circuitos eletrônicos diretamente no navegador.",
    tips: [
      "Primitivas geométricas completas e materiais hiper-realistas.",
      "Construção assistida por IA para criar modelos complexos instantaneamente.",
      "Exportação em formato OBJ pronto para impressão 3D.",
    ],
  },
  {
    title: "Abrir o Editor Principal",
    badge: "Área de Trabalho",
    icon: <Layers className="w-6 h-6" />,
    description:
      "Quando estiver pronto, clique em 'Abrir Editor' para desenhar seus esquemáticos, rotear PCBs em camadas e inspecionar a placa final em 3D realista!",
    tips: [
      "Esquemático 2D intuitivo com auto-roteamento de fios.",
      "PCB 2D com planos de cobre, vias e pads padronizados.",
      "Visualizador 3D com renderização de solda, componentes e textura real de fibra FR4.",
    ],
  },
];

// Pre-configured steps for AllvaCreator 3D
export const ALLVACREATOR_TOUR_STEPS: TourStep[] = [
  {
    title: "Bem-vindo ao AllvaCreator 3D",
    badge: "Estúdio 3D",
    icon: <Box className="w-6 h-6" />,
    description:
      "O ambiente tridimensional da AllvaTronics para desenhar invólucros, suportes mecânicos, chassis de drones e peças personalizadas para sua eletrônica.",
    tips: [
      "Renderização 3D em tempo real com sombras e reflexos físicos.",
      "Criação modular combinando geometrias e formas primitivas.",
      "Suporte a exportação para impressão 3D (OBJ/STL).",
    ],
  },
  {
    title: "Catálogo de Formas & Geometrias",
    badge: "Paleta de Peças",
    icon: <Layers className="w-6 h-6" />,
    description:
      "No painel lateral, você encontra cubos, cilindros, esferas, cones, prismas, cápsulas, linhas curvas e formas personalizadas.",
    tips: [
      "Clique em uma forma para adicioná-la imediatamente ao centro do cenário 3D.",
      "Combine múltiplos sólidos para construir objetos detalhados e acabamentos profissionais.",
    ],
  },
  {
    title: "Controles de Câmera e Órbita 3D",
    badge: "Navegação",
    icon: <Compass className="w-6 h-6" />,
    description:
      "Manipule a visão 3D facilmente através do mouse ou touch para inspecionar seu modelo sob qualquer ângulo.",
    tips: [
      "Botão Esquerdo do Mouse: Gira a câmera em órbita 360°.",
      "Botão Direito do Mouse: Move o ponto de foco (Pan horizontal/vertical).",
      "Roda de Rolagem (Scroll): Aproxima e afasta a visão (Zoom in / Zoom out).",
    ],
  },
  {
    title: "Gizmo de Transformação: Posição, Rotação e Escala",
    badge: "Manipulação",
    icon: <Move className="w-6 h-6" />,
    description:
      "Selecione qualquer peça na cena para exibir os manipuladores visuais coloridos (vermelho: X, verde: Y, azul: Z).",
    tips: [
      "Ferramenta Mover: Translada a peça no espaço tridimensional.",
      "Ferramenta Rotacionar: Gira a peça em torno dos eixos principais.",
      "Ferramenta Escala: Ajusta a largura, altura e profundidade milimetricamente.",
    ],
  },
  {
    title: "Allva AI 3D: Construção Automática Inteligente",
    badge: "Inteligência Artificial",
    icon: <Sparkles className="w-6 h-6" />,
    description:
      "Abra o chat da Allva AI no canto superior e descreva o que você deseja construir (ex: 'Crie um gabinete para Arduino com furos de ventilação' ou 'Construa um chassi de drone com 4 suportes de motor').",
    tips: [
      "A IA projeta e posiciona dezenas de formas geométricas perfeitamente alinhadas.",
      "Aplica cores realistas, metalicidade e rugosidade de acabamento industrial.",
    ],
  },
  {
    title: "Exportar, Salvar e Usar no Circuito",
    badge: "Finalização",
    icon: <Upload className="w-6 h-6" />,
    description:
      "Salve seu modelo 3D na nuvem, exporte o arquivo OBJ para fabricação ou integre como componente customizado nos seus projetos de circuito!",
    tips: [
      "O botão 'Exportar OBJ' gera o arquivo tridimensional universal.",
      "O botão 'Salvar na Nuvem' preserva seu trabalho associado à sua conta.",
    ],
  },
];
