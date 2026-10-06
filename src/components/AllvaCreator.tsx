import React, { useState, useRef, useEffect } from "react";
import {
  Info,
  Star,
  FolderOpen,
  Maximize2,
  Minimize2,
  Copy,
  Box,
  Ruler,
  List,
  Search,
  Settings,
  Image as ImageIcon,
  Code,
  Play,
  DollarSign,
  X,
  Layers,
  Download,
  Trash,
  Activity,
  Plus,
  Trash2,
  Cloud,
  Upload,
  Link,
  Move,
  RotateCw,
  Sparkles,
  Type,
  Undo2,
  Sun,
  Moon,
} from "lucide-react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Text,
  Edges,
  TransformControls,
  Html,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { db, auth, isRemixed, handleFirestoreError, OperationType } from "../firebase";
import { AIAssistantChat } from "./AIAssistantChat";
import { InteractiveTour, ALLVACREATOR_TOUR_STEPS } from "./InteractiveTour";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";

const CATALOG_PARTS = [
  {
    id: "g1",
    name: "Cubo",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "box",
  },
  {
    id: "g2",
    name: "Cilindro",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "cylinder",
  },
  {
    id: "g3",
    name: "Esfera",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "sphere",
  },
  {
    id: "g4",
    name: "Placa Plana",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "plane",
  },
  {
    id: "g5",
    name: "Cone",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "cone",
  },
  {
    id: "g6",
    name: "Toroide",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "torus",
  },
  {
    id: "g7",
    name: "Pirâmide",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "pyramid",
  },
  {
    id: "g8",
    name: "Prisma",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "prism",
  },
  {
    id: "g9",
    name: "Quadrado",
    category: "Geometria 2D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "plane",
  },
  {
    id: "g10",
    name: "Triângulo",
    category: "Geometria 2D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "pyramid",
  },
  {
    id: "g11",
    name: "Círculo",
    category: "Geometria 2D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "cylinder",
  },
  {
    id: "g12",
    name: "Cápsula",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "capsule",
  },
  {
    id: "g13",
    name: "Anel",
    category: "Geometria 2D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "ring",
  },
  {
    id: "g14",
    name: "Linha Curva (Tubo)",
    category: "Geometria Curva",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_line",
  },
  {
    id: "g15",
    name: "Dodecaedro",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "dodecahedron",
  },
  {
    id: "g16",
    name: "Icosaedro",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "icosahedron",
  },
  {
    id: "g17",
    name: "Octaedro",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "octahedron",
  },
  {
    id: "g18",
    name: "Tetraedro",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "tetrahedron",
  },
  {
    id: "g19",
    name: "Nó Toroidal",
    category: "Geometria Complexa",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "torusKnot",
  },
  {
    id: "g20",
    name: "Hemisfério",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "hemisphere",
  },
  {
    id: "g21",
    name: "Linha Recta",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "box", 
  },
  {
    id: "g22",
    name: "Linha Curva",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_line", 
  },
  {
    id: "g23",
    name: "Rolamento",
    category: "Mecânica",
    color: "text-gray-300",
    hexColor: "#9ca3af",
    cost: 2.5,
    pins: [],
    defaultLogic: "",
    shapeType: "torus", 
  },
  {
    id: "g24",
    name: "Linha Oblíqua",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    subShapes: [
      { type: "box", args: [10, 0.5, 0.5], rotation: [0, 0, Math.PI / 4], color: "#d1d5db" }
    ]
  },
  {
    id: "g25",
    name: "Linhas Paralelas",
    category: "Geometria 3D",
    color: "text-gray-300",
    hexColor: "#d1d5db",
    cost: 1.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    subShapes: [
      { type: "box", args: [10, 0.5, 0.5], position: [0, 0, -1.5], color: "#d1d5db" },
      { type: "box", args: [10, 0.5, 0.5], position: [0, 0, 1.5], color: "#d1d5db" }
    ]
  },
  // --- CARROÇARIA & CHAPARIA CURVA ---
  {
    id: "auto_curved_panel",
    name: "Painel Curvo (Chaparia)",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    cost: 5.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [14, 2, 8],
    description: "Chapa de carroçaria com curvatura aerodinâmica lisa e acabamento em pintura automotiva perolizada.",
  },
  {
    id: "auto_hood_curved",
    name: "Capô Aerodinâmico Curvo",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    cost: 6.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [16, 2, 14],
    subShapes: [
      { type: "cylinder", args: [12, 12, 14, 32, 1, true, -Math.PI / 6, Math.PI / 3], color: "#dc2626", metalness: 0.85, roughness: 0.15, clearcoat: 1.0 },
      { type: "box", args: [5, 0.4, 6], position: [0, 1.2, 0], color: "#18181b", metalness: 0.5, roughness: 0.5 },
      { type: "box", args: [0.3, 0.8, 14], position: [-3, 0.8, 0], color: "#b91c1c", metalness: 0.85, roughness: 0.2 },
      { type: "box", args: [0.3, 0.8, 14], position: [3, 0.8, 0], color: "#b91c1c", metalness: 0.85, roughness: 0.2 },
    ],
    description: "Capô esculpido com extratores de ar e vincos de fluxo aerodinâmico.",
  },
  {
    id: "auto_wheel_fender",
    name: "Para-lama / Arco de Roda Curvo",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [4, 6, 9],
    subShapes: [
      { type: "torus", args: [4, 0.6, 16, 32], rotation: [0, 0, 0], position: [0, 0, 0], color: "#dc2626", metalness: 0.85, roughness: 0.15, clearcoat: 1.0 },
      { type: "box", args: [2.5, 1.0, 9], position: [0, 3.8, 0], color: "#dc2626", metalness: 0.85, roughness: 0.15, clearcoat: 1.0 },
    ],
    description: "Arco de roda arqueado para abrigar pneus de corrida com tolerância perfeita.",
  },
  {
    id: "auto_sport_bumper",
    name: "Para-choque Esportivo com Splitter",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    cost: 7.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [18, 4, 5],
    subShapes: [
      { type: "box", args: [18, 2.5, 4], position: [0, 0, 0], color: "#dc2626", metalness: 0.85, roughness: 0.15, clearcoat: 1.0 },
      { type: "box", args: [19, 0.4, 4.8], position: [0, -1.6, 0.4], color: "#09090b", metalness: 0.3, roughness: 0.4 },
      { type: "box", args: [10, 1.4, 0.6], position: [0, -0.4, 2.1], color: "#18181b", metalness: 0.6, roughness: 0.6 },
    ],
    description: "Para-choque dianteiro agressivo com splitter inferior de fibra de carbono.",
  },
  {
    id: "auto_curved_roof",
    name: "Teto Aerodinâmico Curvo",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    cost: 5.5,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [13, 2, 11],
    description: "Teto curvo de baixo arrasto aerodinâmico.",
  },

  // --- FARÓIS & ÓPTICA LED ---
  {
    id: "auto_headlight_led",
    name: "Farol Dianteiro Bi-LED Projector",
    category: "Óptica & Iluminação",
    color: "text-cyan-300",
    hexColor: "#ffffff",
    cost: 6.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [4, 2, 2.5],
    subShapes: [
      { type: "box", args: [3.8, 1.6, 1.8], position: [0, 0, 0], color: "#09090b", metalness: 0.8, roughness: 0.3 },
      { type: "cone", args: [0.75, 1.2, 24], rotation: [-Math.PI / 2, 0, 0], position: [0.9, 0, 0.3], color: "#e2e8f0", metalness: 0.95, roughness: 0.1 },
      { type: "sphere", args: [0.45, 16, 16], position: [0.9, 0, 0.8], color: "#e0f2fe", emissive: "#38bdf8", emissiveIntensity: 3.0, roughness: 0.1 },
      { type: "sphere", args: [0.35, 16, 16], position: [-0.8, 0, 0.8], color: "#f8fafc", emissive: "#ffffff", emissiveIntensity: 2.5, roughness: 0.1 },
      { type: "box", args: [3.6, 0.2, 0.4], position: [0, 0.65, 0.85], color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.8 },
      { type: "box", args: [3.9, 1.7, 0.15], position: [0, 0, 1.0], color: "#f8fafc", opacity: 0.25, transparent: true, roughness: 0.05, clearcoat: 1.0 },
    ],
    description: "Bloco óptico bi-LED de alta performance com lente externa de cristal e projetor xenônio aceso.",
  },
  {
    id: "auto_taillight_led",
    name: "Farol Traseiro LED Strip (Lanterna)",
    category: "Óptica & Iluminação",
    color: "text-red-500",
    hexColor: "#ff1122",
    cost: 5.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [16, 1.5, 1.5],
    subShapes: [
      { type: "box", args: [16, 1.4, 1.2], position: [0, 0, 0], color: "#09090b", metalness: 0.7, roughness: 0.4 },
      { type: "box", args: [15.4, 0.35, 0.4], position: [0, 0.1, 0.55], color: "#ff1133", emissive: "#ff1122", emissiveIntensity: 3.5 },
      { type: "box", args: [15.6, 1.5, 0.15], position: [0, 0, 0.7], color: "#450a0a", opacity: 0.35, transparent: true, roughness: 0.08, clearcoat: 1.0 },
    ],
    description: "Barra contínua LED neon vermelha com lente translúcida fumê rubi.",
  },
  {
    id: "auto_drl_strip",
    name: "Fita LED DRL / Farol de Milha",
    category: "Óptica & Iluminação",
    color: "text-yellow-300",
    hexColor: "#ffffff",
    cost: 3.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [6, 0.6, 0.8],
    subShapes: [
      { type: "box", args: [6, 0.6, 0.8], position: [0, 0, 0], color: "#18181b", metalness: 0.8, roughness: 0.3 },
      { type: "box", args: [5.6, 0.25, 0.3], position: [0, 0, 0.35], color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 3.0 },
    ],
    description: "Fita guia de luz LED branca de alta visibilidade diurna.",
  },

  // --- RODAS & MECÂNICA ---
  {
    id: "auto_sport_wheel_complete",
    name: "Roda Esportiva Completa (Pneu + Jante)",
    category: "Rodas & Mecânica",
    color: "text-gray-200",
    hexColor: "#171717",
    cost: 8.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [7, 7, 3],
    subShapes: [
      { type: "cylinder", args: [3.5, 3.5, 2.4, 32], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0], color: "#171717", roughness: 0.95, metalness: 0.05 },
      { type: "cylinder", args: [2.7, 2.7, 2.5, 32], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0], color: "#cbd5e1", roughness: 0.15, metalness: 0.95 },
      { type: "cylinder", args: [2.1, 2.1, 0.3, 32], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0], color: "#64748b", roughness: 0.3, metalness: 0.9 },
      { type: "box", args: [0.6, 1.4, 0.8], position: [0, 1.4, 0], color: "#ef4444", roughness: 0.2, metalness: 0.8 },
      { type: "box", args: [0.35, 5.0, 0.3], position: [0, 0, 1.15], color: "#e2e8f0", roughness: 0.15, metalness: 0.95 },
      { type: "box", args: [5.0, 0.35, 0.3], position: [0, 0, 1.15], color: "#e2e8f0", roughness: 0.15, metalness: 0.95 },
      { type: "cylinder", args: [0.6, 0.6, 0.4, 16], rotation: [0, 0, Math.PI / 2], position: [0, 0, 1.25], color: "#0284c7", roughness: 0.1, metalness: 1.0 },
    ],
    description: "Conjunto completo com pneu largo de perfil baixo, jante diamantada, disco perfurado e pinça vermelha.",
  },
  {
    id: "auto_tire_lowprofile",
    name: "Pneu de Corrida Slick / Perfil Baixo",
    category: "Rodas & Mecânica",
    color: "text-gray-400",
    hexColor: "#171717",
    metalness: 0.05,
    roughness: 0.95,
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "cylinder",
    defaultScale: [7, 3, 7],
    defaultRotation: [0, 0, Math.PI / 2],
    description: "Pneu de competição em composto de borracha preta vulcanizada.",
  },
  {
    id: "auto_brake_assembly",
    name: "Disco de Travão Ventilado com Pinça",
    category: "Rodas & Mecânica",
    color: "text-red-500",
    hexColor: "#ef4444",
    cost: 4.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [5, 5, 1.5],
    subShapes: [
      { type: "cylinder", args: [2.3, 2.3, 0.3, 32], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0], color: "#94a3b8", roughness: 0.25, metalness: 0.95 },
      { type: "box", args: [0.7, 1.8, 1.0], position: [0, 1.5, 0], color: "#ef4444", roughness: 0.2, metalness: 0.8 },
      { type: "cylinder", args: [0.7, 0.7, 0.4, 16], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0.1], color: "#334155", roughness: 0.4, metalness: 0.8 },
    ],
    description: "Freio esportivo de alta dissipação térmica com pinça vermelha de 6 pistões.",
  },
  {
    id: "auto_dual_exhaust",
    name: "Ponteira de Escapamento Dupla Cromada",
    category: "Rodas & Mecânica",
    color: "text-amber-200",
    hexColor: "#f8fafc",
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [4, 1.8, 3],
    subShapes: [
      { type: "box", args: [4, 1.6, 2], position: [0, 0, 0], color: "#18181b", metalness: 0.5, roughness: 0.5 },
      { type: "cylinder", args: [0.65, 0.65, 1.8, 32], rotation: [Math.PI / 2, 0, 0], position: [-1.0, 0, 0.5], color: "#f8fafc", metalness: 0.98, roughness: 0.08 },
      { type: "cylinder", args: [0.5, 0.5, 1.85, 32], rotation: [Math.PI / 2, 0, 0], position: [-1.0, 0, 0.5], color: "#09090b", metalness: 0.2, roughness: 0.9 },
      { type: "cylinder", args: [0.65, 0.65, 1.8, 32], rotation: [Math.PI / 2, 0, 0], position: [1.0, 0, 0.5], color: "#f8fafc", metalness: 0.98, roughness: 0.08 },
      { type: "cylinder", args: [0.5, 0.5, 1.85, 32], rotation: [Math.PI / 2, 0, 0], position: [1.0, 0, 0.5], color: "#09090b", metalness: 0.2, roughness: 0.9 },
    ],
    description: "Saída de escapamento duplo esportivo em aço inox polido espelhado.",
  },

  // --- VIDROS & AERODINÂMICA ---
  {
    id: "auto_windshield_tinted",
    name: "Para-brisa Curvo Fumê",
    category: "Vidros & Aerodinâmica",
    color: "text-cyan-400",
    hexColor: "#38bdf8",
    opacity: 0.35,
    transparent: true,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    cost: 5.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [14, 2, 10],
    defaultRotation: [-0.5, 0, 0],
    description: "Vidro de segurança laminado curvado com tonalidade fumê aerodinâmica.",
  },
  {
    id: "auto_gt_spoiler",
    name: "Aerofólio Esportivo GT (Asa)",
    category: "Vidros & Aerodinâmica",
    color: "text-gray-100",
    hexColor: "#09090b",
    cost: 7.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [20, 4, 5],
    subShapes: [
      { type: "box", args: [20, 0.45, 4.5], position: [0, 3.2, 0], color: "#09090b", metalness: 0.5, roughness: 0.3, clearcoat: 0.9 },
      { type: "box", args: [0.4, 1.8, 4.8], position: [-9.9, 3.2, 0], color: "#09090b", metalness: 0.5, roughness: 0.3 },
      { type: "box", args: [0.4, 1.8, 4.8], position: [9.9, 3.2, 0], color: "#09090b", metalness: 0.5, roughness: 0.3 },
      { type: "box", args: [0.5, 3.2, 1.4], position: [-5, 1.6, 0], color: "#18181b", metalness: 0.8, roughness: 0.2 },
      { type: "box", args: [0.5, 3.2, 1.4], position: [5, 1.6, 0], color: "#18181b", metalness: 0.8, roughness: 0.2 },
    ],
    description: "Asa traseira aerodinâmica de fibra de carbono com suportes verticais duplos para gerar downforce.",
  },
  {
    id: "auto_side_mirror",
    name: "Espelho Retrovisor Aerodinâmico",
    category: "Vidros & Aerodinâmica",
    color: "text-red-400",
    hexColor: "#dc2626",
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [2.5, 1.8, 2],
    subShapes: [
      { type: "box", args: [2.4, 1.4, 1.8], position: [0, 0, 0], color: "#dc2626", metalness: 0.85, roughness: 0.15, clearcoat: 1.0 },
      { type: "box", args: [2.2, 1.2, 0.15], position: [0, 0, -0.9], color: "#cbd5e1", metalness: 0.98, roughness: 0.05 },
      { type: "cylinder", args: [0.25, 0.25, 1.2, 16], rotation: [0, 0, Math.PI / 4], position: [-1.2, -0.6, 0], color: "#18181b", metalness: 0.8, roughness: 0.2 },
    ],
    description: "Capa do espelho aerodinâmica esculpida com vidro espelhado de reflexão pura.",
  },
  {
    id: "auto_grille_mesh",
    name: "Grelha Frontal / Difusor em Colmeia",
    category: "Vidros & Aerodinâmica",
    color: "text-gray-300",
    hexColor: "#09090b",
    cost: 4.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [10, 2.5, 1],
    subShapes: [
      { type: "box", args: [10, 2.5, 0.6], position: [0, 0, 0], color: "#09090b", metalness: 0.4, roughness: 0.7 },
      { type: "box", args: [9.6, 0.1, 0.7], position: [0, 0.6, 0], color: "#27272a", metalness: 0.7, roughness: 0.3 },
      { type: "box", args: [9.6, 0.1, 0.7], position: [0, 0, 0], color: "#27272a", metalness: 0.7, roughness: 0.3 },
      { type: "box", args: [9.6, 0.1, 0.7], position: [0, -0.6, 0], color: "#27272a", metalness: 0.7, roughness: 0.3 },
    ],
    description: "Grade de admissão de ar frontal esportiva em acabamento preto acetinado.",
  },

  // --- ÓCULOS INTELIGENTES & WEARABLES ---
  {
    id: "wear_ear_hook",
    name: "Ponteira Curva de Orelha (Haste)",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#171717",
    metalness: 0.1,
    roughness: 0.85,
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_hook",
    defaultScale: [3.5, 0.8, 3.5],
    defaultRotation: [0.65, 0, 0],
    description: "Curvatura anatômica em J para acabamento suave das hastes de óculos atrás da orelha.",
  },
  {
    id: "wear_temple_complete",
    name: "Haste de Óculos com Curva Ergonômica",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#18181b",
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1, 2, 16],
    subShapes: [
      { type: "box", args: [0.6, 1.0, 12], position: [0, 0, -6], color: "#18181b", metalness: 0.8, roughness: 0.2 },
      { type: "box", args: [0.8, 1.2, 1.0], position: [0, 0, 0.2], color: "#64748b", metalness: 0.95, roughness: 0.1 },
      { type: "curved_hook", args: [2.5, 0.4, 16, 32, 1.9], position: [0, -1.0, -12], rotation: [0.65, 0, 0], color: "#09090b", roughness: 0.9 },
      { type: "capsule", args: [0.35, 1.8, 4, 16], position: [0, -2.5, -14], rotation: [0.8, 0, 0], color: "#09090b", roughness: 0.9 },
    ],
    description: "Haste estrutural completa com dobradiça frontal, corpo em titânio e ponta anatômica curva de borracha macia.",
  },
  {
    id: "wear_lens_frame",
    name: "Armação de Lente Retangular Curva",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#18181b",
    cost: 4.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [7.5, 5, 0.8],
    subShapes: [
      { type: "box", args: [7.5, 0.4, 0.8], position: [0, 2.3, 0], color: "#18181b", metalness: 0.85, roughness: 0.2 },
      { type: "box", args: [7.5, 0.4, 0.8], position: [0, -2.3, 0], color: "#18181b", metalness: 0.85, roughness: 0.2 },
      { type: "box", args: [0.4, 4.6, 0.8], position: [-3.55, 0, 0], color: "#18181b", metalness: 0.85, roughness: 0.2 },
      { type: "box", args: [0.4, 4.6, 0.8], position: [3.55, 0, 0], color: "#18181b", metalness: 0.85, roughness: 0.2 },
    ],
    description: "Aro perimetral anatômico com cantos suavizados para sustentação de lentes.",
  },
  {
    id: "wear_optical_lens",
    name: "Lente Óptica Polarizada Fumê",
    category: "Óculos & Wearables",
    color: "text-cyan-400",
    hexColor: "#0f172a",
    opacity: 0.35,
    transparent: true,
    metalness: 0.1,
    roughness: 0.05,
    clearcoat: 1.0,
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "box",
    defaultScale: [7.0, 4.6, 0.2],
    description: "Lente de cristal de alta definição com proteção UV, polarização e reflexo fumê.",
  },
  {
    id: "wear_ar_hud_prism",
    name: "Prisma Holográfico HUD (Waveguide)",
    category: "Óculos & Wearables",
    color: "text-cyan-300",
    hexColor: "#38bdf8",
    emissive: "#38bdf8",
    emissiveIntensity: 2.2,
    opacity: 0.7,
    transparent: true,
    cost: 6.0,
    pins: [],
    defaultLogic: "",
    shapeType: "box",
    defaultScale: [3.2, 1.8, 0.3],
    description: "Microvisor óptico transparente com guia de ondas luminosa emissiva para Realidade Aumentada (AR).",
  },
  {
    id: "wear_nose_pads",
    name: "Plaquetas Nasais Anatômicas (Par)",
    category: "Óculos & Wearables",
    color: "text-gray-300",
    hexColor: "#cbd5e1",
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [3.0, 1.8, 1.0],
    subShapes: [
      { type: "capsule", args: [0.3, 1.2, 4, 16], position: [-1.2, 0, 0], color: "#f8fafc", opacity: 0.7, transparent: true },
      { type: "cylinder", args: [0.1, 0.1, 0.8, 8], rotation: [0, 0, 0.4], position: [-0.7, 0.5, 0], color: "#64748b", metalness: 0.95 },
      { type: "capsule", args: [0.3, 1.2, 4, 16], position: [1.2, 0, 0], color: "#f8fafc", opacity: 0.7, transparent: true },
      { type: "cylinder", args: [0.1, 0.1, 0.8, 8], rotation: [0, 0, -0.4], position: [0.7, 0.5, 0], color: "#64748b", metalness: 0.95 },
    ],
    description: "Par de almofadas nasais em silicone hipoalergênico com braquetes metálicos finos.",
  },
  {
    id: "wear_micro_camera",
    name: "Microcâmera Frontal com Aro CNC",
    category: "Óculos & Wearables",
    color: "text-cyan-300",
    hexColor: "#1e293b",
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1.4, 1.4, 1.0],
    subShapes: [
      { type: "cylinder", args: [0.65, 0.65, 0.8, 24], rotation: [Math.PI / 2, 0, 0], position: [0, 0, 0], color: "#64748b", metalness: 0.95, roughness: 0.1 },
      { type: "sphere", args: [0.35, 16, 16], position: [0, 0, 0.4], color: "#0284c7", emissive: "#38bdf8", emissiveIntensity: 1.5, roughness: 0.05 },
    ],
    description: "Módulo de microcâmera discreta para captura de imagem em wearables e óculos inteligentes.",
  },

  // --- JUNÇÕES, CURVAS & MECÂNICA DE PRECISÃO ---
  {
    id: "curve_elbow_90",
    name: "Cotovelo Suave 90° (Tubo Curvado)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#d1d5db",
    cost: 1.5,
    pins: [],
    defaultLogic: "",
    shapeType: "elbow_90",
    defaultScale: [4, 1, 4],
    description: "Curvatura uniforme de 90 graus para junções contínuas de tubos, chassis e corrimãos.",
  },
  {
    id: "curve_u_bend",
    name: "Arco 180° em U (Semi-Toroide)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#d1d5db",
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "u_bend",
    defaultScale: [4, 1, 4],
    description: "Curva semicircular de 180 graus ideal para alças, suportes, conexões de retorno e pontas de haste.",
  },
  {
    id: "mech_ball_joint",
    name: "Articulação Esférica (Ball Joint)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#64748b",
    cost: 3.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [2.5, 4.0, 2.5],
    subShapes: [
      { type: "sphere", args: [1.1, 24, 24], position: [0, 1.0, 0], color: "#cbd5e1", metalness: 0.98, roughness: 0.1 },
      { type: "cylinder", args: [0.9, 1.3, 1.8, 24], position: [0, -0.6, 0], color: "#334155", metalness: 0.8, roughness: 0.3 },
      { type: "cylinder", args: [0.4, 0.4, 1.4, 16], position: [0, 2.1, 0], color: "#cbd5e1", metalness: 0.95 },
    ],
    description: "Junta esférica omnidirecional para braços robóticos, gimbals e suportes articulados.",
  },
  {
    id: "mech_precision_hinge",
    name: "Dobradiça com Pino em Aço Inox",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#475569",
    cost: 2.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1.8, 1.8, 2.5],
    subShapes: [
      { type: "cylinder", args: [0.5, 0.5, 2.4, 24], position: [0, 0, 0], color: "#cbd5e1", metalness: 0.98, roughness: 0.1 },
      { type: "box", args: [0.8, 0.3, 2.2], position: [-0.6, 0, 0], color: "#475569", metalness: 0.85, roughness: 0.2 },
      { type: "box", args: [0.8, 0.3, 2.2], position: [0.6, 0, 0], color: "#475569", metalness: 0.85, roughness: 0.2 },
    ],
    description: "Dobradiça articulada de alta precisão para gavetas, portas e hastes dobráveis.",
  },
  {
    id: "hw_rotary_crown",
    name: "Coroa Digital Recartilhada (Smartwatch)",
    category: "Junções & Curvas",
    color: "text-gray-300",
    hexColor: "#e2e8f0",
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1.8, 1.2, 1.8],
    subShapes: [
      { type: "cylinder", args: [0.9, 0.9, 0.8, 32], rotation: [Math.PI / 2, 0, 0], position: [0, 0, 0], color: "#e2e8f0", metalness: 0.95, roughness: 0.15 },
      { type: "cylinder", args: [0.75, 0.75, 0.9, 16], rotation: [Math.PI / 2, 0, 0], position: [0, 0, 0], color: "#0284c7", metalness: 0.98, roughness: 0.1 },
    ],
    description: "Coroa giratória com textura recartilhada usinada em CNC para relógios inteligentes.",
  },
  {
    id: "hw_usbc_port",
    name: "Porta USB-C Embutida com Chanfro",
    category: "Junções & Curvas",
    color: "text-gray-400",
    hexColor: "#09090b",
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [3.2, 1.4, 1.5],
    subShapes: [
      { type: "box", args: [3.2, 1.4, 1.0], position: [0, 0, 0], color: "#09090b", metalness: 0.7, roughness: 0.4 },
      { type: "capsule", args: [0.35, 1.4, 4, 16], rotation: [0, 0, Math.PI / 2], position: [0, 0, 0.5], color: "#18181b", metalness: 0.9 },
      { type: "box", args: [1.4, 0.15, 0.6], position: [0, 0, 0.5], color: "#e2e8f0", metalness: 0.98, roughness: 0.1 },
    ],
    description: "Receptáculo tipo USB-C blindado com lingueta de contato interno para eletrônicos modernos.",
  },

  // --- PEÇAS GEOMÉTRICAS REALISTAS ADICIONAIS: ÓCULOS & WEARABLES ---
  {
    id: "wear_ear_hook_ergonomic",
    name: "Suporte Curvo Ergonômico de Orelha (Óculos)",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#18181b",
    metalness: 0.2,
    roughness: 0.85,
    cost: 2.5,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_hook",
    defaultScale: [1.0, 3.2, 3.0],
    defaultRotation: [0.65, 0, 0],
    description: "Linha curva anatômica em arco suave para dar o acabamento perfeito de encaixe atrás das orelhas, sem usar figuras automotivas.",
  },
  {
    id: "wear_temple_smart_full",
    name: "Haste Inteligente Completa (com Curva de Orelha)",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#18181b",
    cost: 6.0,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1.2, 2.5, 18],
    subShapes: [
      { type: "box", args: [0.8, 1.2, 12], position: [0, 0, -6], color: "#18181b", metalness: 0.8, roughness: 0.25 },
      { type: "box", args: [1.0, 1.4, 4.5], position: [0, 0, -5], color: "#0f172a", metalness: 0.5, roughness: 0.4 },
      { type: "box", args: [0.9, 1.3, 1.2], position: [0, 0, 0.3], color: "#64748b", metalness: 0.95, roughness: 0.1 },
      { type: "curved_hook", args: [2.8, 0.45, 16, 32, 2.0], position: [0, -1.1, -12.2], rotation: [0.65, 0, 0], color: "#171717", roughness: 0.85 },
      { type: "capsule", args: [0.4, 2.0, 4, 16], position: [0, -2.8, -14.4], rotation: [0.85, 0, 0], color: "#09090b", roughness: 0.9 },
    ],
    description: "Haste monolítica com dobradiça frontal em titânio, touchpad tátil integrado e curvatura anatômica contínua de suporte para orelhas.",
  },
  {
    id: "wear_glasses_front_frame",
    name: "Armação Frontal Dupla com Ponte Curva em Titânio",
    category: "Óculos & Wearables",
    color: "text-blue-400",
    hexColor: "#1e293b",
    cost: 5.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [18, 5.5, 1.2],
    subShapes: [
      { type: "box", args: [7.2, 4.8, 0.6], position: [-5.0, 0, 0], color: "#18181b", metalness: 0.8, roughness: 0.2 },
      { type: "box", args: [7.2, 4.8, 0.6], position: [5.0, 0, 0], color: "#18181b", metalness: 0.8, roughness: 0.2 },
      { type: "curved_hook", args: [1.8, 0.3, 16, 24, Math.PI * 0.5], position: [0, 0.8, 0], rotation: [0, 0, Math.PI], color: "#475569", metalness: 0.95 },
      { type: "box", args: [2.6, 0.5, 0.7], position: [0, 0.5, 0], color: "#475569", metalness: 0.95, roughness: 0.1 },
    ],
    description: "Estrutura frontal anatômica para óculos de grau ou inteligentes com aros simétricos e ponte nasal contínua.",
  },
  {
    id: "wear_panoramic_shield",
    name: "Visor AR Curvo Panorâmico (Lente Envolvente)",
    category: "Óculos & Wearables",
    color: "text-cyan-400",
    hexColor: "#0284c7",
    opacity: 0.45,
    transparent: true,
    metalness: 0.2,
    roughness: 0.05,
    clearcoat: 1.0,
    cost: 5.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [18, 3.5, 6.0],
    defaultRotation: [0, 0, 0],
    description: "Lente única envolvente curvada com revestimento anti-reflexo e guia de ondas para exibição holográfica.",
  },
  {
    id: "wear_bone_conduction_speaker",
    name: "Micro-Speaker de Condução Óssea para Haste",
    category: "Óculos & Wearables",
    color: "text-blue-300",
    hexColor: "#09090b",
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [1.2, 1.8, 2.4],
    subShapes: [
      { type: "box", args: [1.0, 1.6, 2.2], position: [0, 0, 0], color: "#09090b", metalness: 0.6, roughness: 0.5 },
      { type: "capsule", args: [0.35, 1.2, 4, 16], position: [0.3, 0, 0], color: "#334155", metalness: 0.9 },
    ],
    description: "Transdutor acústico ultracompacto posicionado na curva traseira da haste junto à têmpora do usuário.",
  },

  // --- PEÇAS GEOMÉTRICAS REALISTAS ADICIONAIS: CARROÇARIA & CHAPARIA ---
  {
    id: "auto_fender_arch",
    name: "Para-lama Curvado Aerodinâmico (Wheel Arch Flare)",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "fender_arch",
    defaultScale: [9, 9, 3.5],
    defaultRotation: [0, 0, 0],
    description: "Arco de roda alargado com curvatura envolvente para abrigar pneus esportivos e dar musculatura à carroçaria.",
  },
  {
    id: "auto_naca_duct",
    name: "Entrada de Ar Lateral NACA Duct em Carbono",
    category: "Carroçaria & Chaparia",
    color: "text-gray-300",
    hexColor: "#09090b",
    cost: 3.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [3.5, 2.5, 6.0],
    subShapes: [
      { type: "box", args: [3.5, 2.5, 6.0], position: [0, 0, 0], color: "#18181b", metalness: 0.4, roughness: 0.5 },
      { type: "curved_panel", args: [3.0, 4.0], position: [0, 0, 0], color: "#09090b", metalness: 0.8, roughness: 0.3 },
    ],
    description: "Duto aerodinâmico triangular submerso tipo NACA para refrigeração de freios e radiadores sem turbulência.",
  },
  {
    id: "auto_curved_door_panel",
    name: "Painel Curvo Lateral de Porta com Vinco Esportivo",
    category: "Carroçaria & Chaparia",
    color: "text-red-400",
    hexColor: "#dc2626",
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    cost: 5.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [16, 3.0, 12],
    defaultRotation: [0, 0, Math.PI / 2],
    description: "Chapa de porta automotiva esculpida com curvatura contínua e vincos dinâmicos de fluxo de ar.",
  },
  {
    id: "auto_panoramic_sunroof",
    name: "Teto Panorâmico Curvado Fumê",
    category: "Carroçaria & Chaparia",
    color: "text-cyan-400",
    hexColor: "#1e293b",
    opacity: 0.4,
    transparent: true,
    metalness: 0.2,
    roughness: 0.05,
    clearcoat: 1.0,
    cost: 6.0,
    pins: [],
    defaultLogic: "",
    shapeType: "curved_panel",
    defaultScale: [13, 2.0, 11],
    defaultRotation: [0, 0, 0],
    description: "Cúpula de teto envidraçada com curvatura esférica translúcida para veículos e protótipos futuristas.",
  },

  // --- PEÇAS GEOMÉTRICAS REALISTAS ADICIONAIS: ÓPTICA & ILUMINAÇÃO ---
  {
    id: "opt_matrix_led_triple",
    name: "Farol Matrix Triplo Projetor com Lentes Ovoides",
    category: "Óptica & Iluminação",
    color: "text-yellow-300",
    hexColor: "#0f172a",
    cost: 5.5,
    pins: [],
    defaultLogic: "",
    shapeType: "custom",
    defaultScale: [4.5, 1.8, 3.0],
    subShapes: [
      { type: "box", args: [4.5, 1.6, 2.5], position: [0, 0, 0], color: "#09090b", metalness: 0.7, roughness: 0.4 },
      { type: "cylinder", args: [0.55, 0.55, 0.6, 24], rotation: [Math.PI / 2, 0, 0], position: [-1.3, 0, 1.2], color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.8 },
      { type: "cylinder", args: [0.55, 0.55, 0.6, 24], rotation: [Math.PI / 2, 0, 0], position: [0, 0, 1.2], color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.8 },
      { type: "cylinder", args: [0.55, 0.55, 0.6, 24], rotation: [Math.PI / 2, 0, 0], position: [1.3, 0, 1.2], color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 2.8 },
      { type: "box", args: [4.2, 0.2, 0.3], position: [0, 0.7, 1.3], color: "#38bdf8", emissive: "#38bdf8", emissiveIntensity: 2.2 },
    ],
    description: "Conjunto óptico de iluminação Matrix LED com 3 projetores de alta intensidade e assinatura DRL azulada.",
  },
  {
    id: "opt_fullwidth_rear_lightbar",
    name: "Barra Traseira Contínua LED Neon Dinâmica",
    category: "Óptica & Iluminação",
    color: "text-red-400",
    hexColor: "#ff1122",
    emissive: "#ff1122",
    emissiveIntensity: 2.6,
    metalness: 0.2,
    roughness: 0.1,
    cost: 4.5,
    pins: [],
    defaultLogic: "",
    shapeType: "box",
    defaultScale: [18, 0.8, 0.8],
    description: "Lanterna traseira de largura total contínua com iluminação uniforme neon vermelho esportivo.",
  },

  // --- PEÇAS GEOMÉTRICAS REALISTAS ADICIONAIS: JUNÇÕES & CURVAS ---
  {
    id: "curve_s_bend",
    name: "Curva Suave em S (Tubo com Dupla Curvatura)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#d1d5db",
    metalness: 0.85,
    roughness: 0.2,
    cost: 2.2,
    pins: [],
    defaultLogic: "",
    shapeType: "s_bend",
    defaultScale: [4.0, 2.5, 2.0],
    description: "Tubo fluido em forma de S para transição tangencial entre peças com alturas ou eixos deslocados.",
  },
  {
    id: "curve_elbow_45",
    name: "Curvatura 45° em Arco Tórico (Cotovelo Suave)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#d1d5db",
    metalness: 0.85,
    roughness: 0.2,
    cost: 1.8,
    pins: [],
    defaultLogic: "",
    shapeType: "elbow_45",
    defaultScale: [4.0, 1.0, 4.0],
    description: "Curvatura intermediária de 45 graus para conexões aerodinâmicas e transições mecânicas não ortogonais.",
  },
  {
    id: "geom_wedge_chamfer",
    name: "Chanfro / Rampa Angular Triangular 45°",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#64748b",
    metalness: 0.7,
    roughness: 0.3,
    cost: 1.5,
    pins: [],
    defaultLogic: "",
    shapeType: "wedge",
    defaultScale: [3.0, 3.0, 4.0],
    description: "Peça de transição chanfrada em prisma triangular para reforços estruturais e quebra de cantos retos.",
  },
  {
    id: "geom_smooth_dome",
    name: "Cúpula Hemisférica Lisa (Tampa Esférica)",
    category: "Junções & Curvas",
    color: "text-emerald-400",
    hexColor: "#94a3b8",
    metalness: 0.8,
    roughness: 0.2,
    cost: 2.0,
    pins: [],
    defaultLogic: "",
    shapeType: "hemisphere",
    defaultScale: [4.0, 4.0, 4.0],
    description: "Hemisfério perfeito para tampas arredondadas, extremidades de cápsulas, sensores de radar e hubs.",
  },
];

import { HighQualityMesh } from "./Meshes3D";

function PartMesh({
  id,
  position,
  rotation,
  scale,
  color,
  name,
  shapeType,
  subShapes,
  metalness = 0.5,
  roughness = 0.5,
  emissive = "#000000",
  emissiveIntensity = 0,
  opacity = 1,
  transparent = false,
  clearcoat = 0,
  clearcoatRoughness = 0.15,
  selectedPart,
  isActive,
  onSelectPart,
  onTransformUpdate,
  transformMode = "translate",
  showLabels = true,
  showDimensions = false,
}: any) {
  const isSelected = selectedPart?.id === id;
  const meshRef = useRef<any>(null);

  // Auto-detect componentType ONLY for true electronic board components, NOT 3D parametric shapes
  let mappedType = null;
  const is3DParametric = shapeType && shapeType !== "electronic_component" && shapeType !== "component";
  if (!is3DParametric) {
    const n = name.toLowerCase();
    if (n.includes("esp32-cam") || n.includes("esp32 cam"))
      mappedType = "esp32_cam";
    else if (n.includes("esp32")) mappedType = "esp32";
    else if (n.includes("arduino")) mappedType = "arduino_uno";
    else if (n.includes("stm32")) mappedType = "stm32_bluepill";
    else if (n.includes("attiny")) mappedType = "attiny85";
    else if (n.includes("raspberry")) mappedType = "raspberry_pi";
    else if (n.includes("bateria") || n.includes("battery"))
      mappedType = "battery";
    else if (n.includes("oled") || n.includes("display")) mappedType = "oled";
    else if (
      n.includes("alto-falante") ||
      n.includes("buzzer") ||
      n.includes("speaker")
    )
      mappedType = "buzzer";
    else if (n.includes("servo")) mappedType = "servo_motor";
    else if (n.includes("motor")) mappedType = "motor";
    else if (n.includes("resistor")) mappedType = "resistor";
    else if (n.includes("capacitor cerâmico") || n.includes("ceramic capacitor"))
      mappedType = "capacitor";
    else if (
      n.includes("capacitor eletrolítico") ||
      n.includes("electrolytic capacitor")
    )
      mappedType = "capacitor_elec";
    else if (n.includes("indutor") || n.includes("inductor"))
      mappedType = "inductor";
    else if (n.includes("diodo") || n.includes("diode")) mappedType = "diode";
    else if (n.includes("led")) mappedType = "led";
    else if (n.includes("transistor npn")) mappedType = "transistor";
    else if (n.includes("transistor pnp")) mappedType = "transistor_pnp";
    else if (n.includes("mosfet n-ch")) mappedType = "mosfet";
    else if (n.includes("7 segmentos") || n.includes("7 segment"))
      mappedType = "seven_segment";
    else if (n.includes("relé") || n.includes("relay")) mappedType = "relay";
    else if (n.includes("555 timer") || n.includes("ci 555"))
      mappedType = "timer555";
    else if (n.includes("ampop") || n.includes("opamp")) mappedType = "opamp";
    else if (n.includes("potenciômetro") || n.includes("potentiometer"))
      mappedType = "potentiometer";
    else if (n.includes("chave") || n.includes("switch") || n.includes("button"))
      mappedType = "switch";
    else if (n.includes("cr2032")) mappedType = "cr2032";
    else if (n.includes("ldr")) mappedType = "ldr_smd";
    else if (n.includes("ntc")) mappedType = "ntc_smd";
    else if (n.includes("cristal") || n.includes("crystal"))
      mappedType = "crystal";
    else if (n.includes("protoboard")) mappedType = "protoboard";
    else if (n.includes("gps")) mappedType = "gps";
    else if (n.includes("acelerômetro") || n.includes("mpu6050")) mappedType = "accelerometer";
    else if (n.includes("gás") || n.includes("mq")) mappedType = "gas_sensor";
    else if (n.includes("wi-fi") || n.includes("esp8266")) mappedType = "esp8266";
    else if (n.includes("driver motor") || n.includes("a4988")) mappedType = "motor_driver";
    else if (n.includes("motor de passo") || n.includes("nema")) mappedType = "stepper_motor";
    else if (n.includes("umidade") || n.includes("dht")) mappedType = "dht11";
    else if (n.includes("bluetooth") || n.includes("hc-05")) mappedType = "hc05";
    else if (n.includes("ultrassônico") || n.includes("hc-sr04")) mappedType = "ultrasonic";
    else if (n.includes("sensor") || n.includes("mic") || n.includes("imu"))
      mappedType = "smd";
  }

  return (
    <TransformControls
      size={
        typeof window !== "undefined" && window.innerWidth < 768 ? 2.5 : 1.5
      }
      object={meshRef}
      enabled={isSelected}
      mode={transformMode}
      onMouseUp={() => {
        if (meshRef.current) {
          const newScale = [
            scale[0] * meshRef.current.scale.x,
            scale[1] * meshRef.current.scale.y,
            scale[2] * meshRef.current.scale.z,
          ];
          meshRef.current.scale.set(1, 1, 1);
          onTransformUpdate(id, {
            position: [
              meshRef.current.position.x,
              meshRef.current.position.y,
              meshRef.current.position.z,
            ],
            rotation: [
              meshRef.current.rotation.x,
              meshRef.current.rotation.y,
              meshRef.current.rotation.z,
            ],
            scale: newScale
          });
        }
      }}
      showX={isSelected}
      showY={isSelected}
      showZ={isSelected}
    >
      <group
        ref={meshRef}
        position={position}
        rotation={rotation || [0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPart(id);
        }}
      >
        {mappedType ? (
          <group scale={[scale[0] / 15, scale[1] / 15, scale[2] / 15]}>
            <HighQualityMesh id={id} type={mappedType} isActive={isActive} />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[15, 15, 15]} />
              <meshBasicMaterial transparent opacity={0.0} />
              {isSelected && (
                <Edges scale={1.05} threshold={15} color="white" />
              )}
            </mesh>
            {showDimensions && (
              <Html position={[0, scale[1]/2 + 1, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                <div className="bg-[#16161a]/90 text-white text-[10px] px-2 py-1 rounded shadow-lg border border-[#2d2d33] whitespace-nowrap">
                  {scale[0].toFixed(1)} x {scale[2].toFixed(1)} {scale[1] !== 1 ? `x ${scale[1].toFixed(1)}` : ""}
                </div>
              </Html>
            )}
          </group>
        ) : (shapeType === "custom" && Array.isArray(subShapes) && subShapes.length > 0) ? (
          <group>
            {subShapes.map((sub: any, idx: number) => (
              <mesh castShadow receiveShadow
                key={idx}
                position={sub.position || [0, 0, 0]}
                rotation={sub.rotation || [0, 0, 0]}
              >
                {sub.type === "cylinder" ? (
                  <cylinderGeometry args={sub.args || [1, 1, 1, 32]} />
                ) : sub.type === "sphere" ? (
                  <sphereGeometry args={sub.args || [1, 32, 32]} />
                ) : sub.type === "torus" ? (
                  <torusGeometry args={sub.args || [1, 0.35, 16, 32]} />
                ) : sub.type === "curved_hook" || sub.type === "bent_tube" ? (
                  <torusGeometry args={[sub.args?.[0] || 2, sub.args?.[1] || 0.4, 16, 32, sub.args?.[2] || Math.PI * 0.7]} />
                ) : sub.type === "elbow_90" ? (
                  <torusGeometry args={[sub.args?.[0] || 2, sub.args?.[1] || 0.4, 16, 32, Math.PI * 0.5]} />
                ) : sub.type === "elbow_45" ? (
                  <torusGeometry args={[sub.args?.[0] || 2, sub.args?.[1] || 0.4, 16, 32, Math.PI * 0.25]} />
                ) : sub.type === "u_bend" ? (
                  <torusGeometry args={[sub.args?.[0] || 2, sub.args?.[1] || 0.4, 16, 32, Math.PI]} />
                ) : sub.type === "s_bend" ? (
                  <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(-1.5, -1, 0), new THREE.Vector3(-0.5, -0.2, 0.2), new THREE.Vector3(0.5, 0.2, -0.2), new THREE.Vector3(1.5, 1, 0)]), 32, sub.args?.[0] || 0.35, 16, false]} />
                ) : sub.type === "curved_panel" ? (
                  <cylinderGeometry args={[sub.args?.[0] || 5, sub.args?.[0] || 5, sub.args?.[1] || 4, 32, 4, true, -Math.PI / 5, (2 * Math.PI) / 5]} />
                ) : sub.type === "fender_arch" ? (
                  <cylinderGeometry args={[sub.args?.[0] || 4, sub.args?.[0] || 4, sub.args?.[1] || 2, 32, 2, true, 0, Math.PI]} />
                ) : sub.type === "wedge" ? (
                  <cylinderGeometry args={[sub.args?.[0] || 2, sub.args?.[0] || 2, sub.args?.[1] || 2, 3]} />
                ) : sub.type === "hemisphere" ? (
                  <sphereGeometry args={[sub.args?.[0] || 1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                ) : sub.type === "cone" ? (
                  <coneGeometry args={sub.args || [1, 2, 32]} />
                ) : sub.type === "capsule" ? (
                  <capsuleGeometry args={sub.args || [0.5, 1, 4, 16]} />
                ) : sub.type === "ring" ? (
                  <ringGeometry args={sub.args || [0.5, 1, 32]} />
                ) : (
                  <boxGeometry args={sub.args || [1, 1, 1]} />
                )}
                <meshPhysicalMaterial
                  color={sub.color || color}
                  transparent={isSelected || sub.transparent || (sub.opacity !== undefined && sub.opacity < 1)}
                  opacity={isSelected ? 0.85 : (sub.opacity ?? 1)}
                  roughness={sub.roughness ?? roughness}
                  metalness={sub.metalness ?? metalness}
                  clearcoat={sub.clearcoat ?? (sub.metalness > 0.5 ? 1 : 0)}
                  clearcoatRoughness={sub.clearcoatRoughness ?? 0.2}
                  emissive={sub.emissive || "#000000"}
                  emissiveIntensity={sub.emissiveIntensity ?? (sub.emissive && sub.emissive !== "#000000" ? 1.5 : 0)}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            {isSelected && (
              <mesh castShadow receiveShadow>
                <boxGeometry args={scale} />
                <meshBasicMaterial transparent opacity={0.0} />
                <Edges scale={1.05} threshold={15} color="#00ffff" />
              </mesh>
            )}
            {showDimensions && (
              <Html position={[0, scale[1]/2 + 1, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                <div className="bg-[#16161a]/90 text-white text-[10px] px-2 py-1 rounded shadow-lg border border-[#2d2d33] whitespace-nowrap">
                  {scale[0].toFixed(1)} x {scale[2].toFixed(1)} {scale[1] !== 1 ? `x ${scale[1].toFixed(1)}` : ""}
                </div>
              </Html>
            )}
          </group>
        ) : (
          <mesh castShadow receiveShadow>
            {shapeType === "cylinder" ? (
              <cylinderGeometry args={[scale[0] / 2, scale[0] / 2, scale[1], 32]} />
            ) : shapeType === "sphere" ? (
              <sphereGeometry args={[scale[0] / 2, 32, 32]} />
            ) : shapeType === "plane" ? (
              <boxGeometry args={[scale[0], 0.5, scale[2]]} />
            ) : shapeType === "cone" ? (
              <coneGeometry args={[scale[0] / 2, scale[1], 32]} />
            ) : shapeType === "torus" ? (
              <torusGeometry args={[scale[0] / 2, scale[0] / 6, 16, 100]} />
            ) : shapeType === "pyramid" ? (
              <coneGeometry args={[scale[0] / 2, scale[1], 4]} />
            ) : shapeType === "prism" ? (
              <cylinderGeometry args={[scale[0] / 2, scale[0] / 2, scale[1], 3]} />
            ) : shapeType === "capsule" ? (
              <capsuleGeometry args={[scale[0] / 2, Math.max(0.1, scale[1] - scale[0]), 4, 32]} />
            ) : shapeType === "ring" ? (
              <ringGeometry args={[scale[0] / 3, scale[0] / 2, 32]} />
            ) : shapeType === "curved_hook" || shapeType === "bent_tube" ? (
              <torusGeometry args={[scale[0] / 2, Math.max(0.12, Math.min(scale[0], scale[1]) / 3.5), 16, 32, Math.PI * 0.7]} />
            ) : shapeType === "elbow_90" ? (
              <torusGeometry args={[scale[0] / 2, Math.max(0.12, Math.min(scale[0], scale[1]) / 3.5), 16, 32, Math.PI * 0.5]} />
            ) : shapeType === "elbow_45" ? (
              <torusGeometry args={[scale[0] / 2, Math.max(0.12, Math.min(scale[0], scale[1]) / 3.5), 16, 32, Math.PI * 0.25]} />
            ) : shapeType === "u_bend" ? (
              <torusGeometry args={[scale[0] / 2, Math.max(0.12, Math.min(scale[0], scale[1]) / 3.5), 16, 32, Math.PI]} />
            ) : shapeType === "s_bend" ? (
              <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(-scale[0]/2, -scale[1]/2, 0), new THREE.Vector3(-scale[0]/6, -scale[1]/6, scale[2]/6), new THREE.Vector3(scale[0]/6, scale[1]/6, -scale[2]/6), new THREE.Vector3(scale[0]/2, scale[1]/2, 0)]), 32, Math.max(0.12, scale[1]/4), 16, false]} />
            ) : shapeType === "curved_line" ? (
              <tubeGeometry args={[new THREE.CatmullRomCurve3([new THREE.Vector3(-scale[0]/2, -scale[1]/4, 0), new THREE.Vector3(0, scale[1]/2, scale[2]/4), new THREE.Vector3(scale[0]/2, -scale[1]/4, 0)]), 32, Math.max(0.1, scale[0]/10), 16, false]} />
            ) : shapeType === "curved_panel" ? (
              <cylinderGeometry args={[Math.max(scale[0], scale[2]) * 0.9, Math.max(scale[0], scale[2]) * 0.9, scale[2], 32, 4, true, -Math.PI / 5, (2 * Math.PI) / 5]} />
            ) : shapeType === "fender_arch" ? (
              <cylinderGeometry args={[scale[0] / 2, scale[0] / 2, scale[2], 32, 2, true, 0, Math.PI]} />
            ) : shapeType === "wedge" ? (
              <cylinderGeometry args={[scale[0] / 2, scale[0] / 2, scale[2], 3]} />
            ) : shapeType === "dodecahedron" ? (
              <dodecahedronGeometry args={[scale[0] / 2]} />
            ) : shapeType === "icosahedron" ? (
              <icosahedronGeometry args={[scale[0] / 2]} />
            ) : shapeType === "octahedron" ? (
              <octahedronGeometry args={[scale[0] / 2]} />
            ) : shapeType === "tetrahedron" ? (
              <tetrahedronGeometry args={[scale[0] / 2]} />
            ) : shapeType === "torusKnot" ? (
              <torusKnotGeometry args={[scale[0] / 3, scale[0] / 10, 100, 16]} />
            ) : shapeType === "hemisphere" ? (
              <sphereGeometry args={[scale[0] / 2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            ) : (
              <boxGeometry args={scale} />
            )}
            <meshPhysicalMaterial
              color={color}
              transparent={isSelected || transparent || opacity < 1}
              opacity={isSelected ? Math.min(opacity, 0.85) : opacity}
              roughness={roughness}
              metalness={metalness}
              clearcoat={clearcoat || (metalness > 0.5 ? 1 : 0)}
              clearcoatRoughness={clearcoatRoughness}
              emissive={emissive || "#000000"}
              emissiveIntensity={emissiveIntensity || (emissive && emissive !== "#000000" ? 1.5 : 0)}
              side={THREE.DoubleSide}
            />
            {(!transparent && opacity >= 0.9 && (!emissive || emissive === "#000000")) && (
              <Edges
                scale={1}
                threshold={30}
                color={isSelected ? "#38bdf8" : "#1e293b"}
              />
            )}
            {showDimensions && (
              <Html position={[0, scale[1]/2 + 1, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                <div className="bg-[#16161a]/90 text-white text-[10px] px-2 py-1 rounded shadow-lg border border-[#2d2d33] whitespace-nowrap">
                  {scale[0].toFixed(1)} x {scale[2].toFixed(1)} {scale[1] !== 1 ? `x ${scale[1].toFixed(1)}` : ""}
                </div>
              </Html>
            )}
          </mesh>
        )}
        {showLabels && (
        <Text
          position={[0, scale[1] / 2 + 1.2, 0]}
          fontSize={0.15}
          color={isSelected ? "#ffffff" : "#888888"}
          outlineWidth={0.02}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        )}
      </group>
    </TransformControls>
  );
}

function CopperWire3D({ startPos, endPos }: { startPos: [number, number, number], endPos: [number, number, number] }) {
  const { curve, isStartBelow, isEndBelow } = React.useMemo(() => {
    const start = new THREE.Vector3(...startPos);
    const end = new THREE.Vector3(...endPos);
    
    const isStartBelow = start.y < -1;
    const isEndBelow = end.y < -1;

    // Route trace based on component position (top or bottom of board)
    const y1 = isStartBelow ? -1 : 1;
    const y2 = isEndBelow ? -1 : 1;

    const mid1 = new THREE.Vector3(start.x, y1, start.z);
    const mid2 = new THREE.Vector3(end.x, y2, end.z);
    
    return { curve: new THREE.CatmullRomCurve3([start, mid1, mid2, end]), isStartBelow, isEndBelow };
  }, [startPos, endPos]);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 64, 1.2, 16, false]} />
        <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} clearcoat={1} emissive="#92400e" emissiveIntensity={0.3} />
      </mesh>
      {/* Pad for Start Component */}
      <mesh castShadow receiveShadow position={[startPos[0], isStartBelow ? -1 : 1, startPos[2]]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 32]} />
        <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} emissive="#92400e" emissiveIntensity={0.3} />
      </mesh>
      {/* Pad for End Component */}
      <mesh castShadow receiveShadow position={[endPos[0], isEndBelow ? -1 : 1, endPos[2]]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 32]} />
        <meshPhysicalMaterial color="#f59e0b" metalness={0.9} roughness={0.2} emissive="#92400e" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

const INITIAL_PARTS_DATA: any[] = [];

export function AllvaCreator() {
    const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem('allvacreator_welcome_seen');
    } catch(e) {
      return false;
    }
  });
  const [showTour, setShowTour] = useState(() => {
    try {
      return localStorage.getItem('tour_completed_allvacreator') !== 'true';
    } catch {
      return false;
    }
  });
  const [parts, setParts] = useState(INITIAL_PARTS_DATA);
  const [projectName, setProjectName] = useState("SEM TÍTULO");
  const [projectDesc, setProjectDesc] = useState("");
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate");
  const [viewMode, setViewMode] = useState<
    "3D" | "WIRING" | "CODE" | "ENCLOSURE"
  >("3D");
  const [logicCode, setLogicCode] = useState("");
  const [wiringConnections, setWiringConnections] = useState<
    Array<{ fromPart: string; fromPin: string; toPart: string; toPin: string }>
  >([]);
  const [selectedWireStart, setSelectedWireStart] = useState<{
    partId: string;
    pin: string;
  } | null>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const [enclosure, setEnclosure] = useState<{
    width: number;
    height: number;
    depth: number;
    color: string;
    material: string;
    description: string;
    imageUrl?: string;
  } | null>(null);
  const [isGeneratingEnclosure, setIsGeneratingEnclosure] = useState(false);
  const [showListSidebar, setShowListSidebar] = useState(true);
  const [activeSimulation, setActiveSimulation] = useState(false);
  const [studioTheme, setStudioTheme] = useState<"dark" | "light">(() => {
    try {
      return (localStorage.getItem("allvacreator_theme") as "dark" | "light") || "dark";
    } catch (e) {
      return "dark";
    }
  });
  const [dismissEmptyHint, setDismissEmptyHint] = useState<boolean>(() => {
    try {
      return localStorage.getItem("allvacreator_dismiss_hint") === "true";
    } catch {
      return false;
    }
  });
  const [catalogCategory, setCatalogCategory] = useState<string>("ALL");
  const [catalogSearch, setCatalogSearch] = useState<string>("");

  const handleDismissHint = () => {
    setDismissEmptyHint(true);
    try {
      localStorage.setItem("allvacreator_dismiss_hint", "true");
    } catch {}
  };

  useEffect(() => {
    if (showAIAssistant) {
      handleDismissHint();
    }
  }, [showAIAssistant]);

  const toggleTheme = (theme: "dark" | "light") => {
    setStudioTheme(theme);
    try {
      localStorage.setItem("allvacreator_theme", theme);
    } catch (e) {}
  };

  // Fake Simulation Loop for UI Feedback
  useEffect(() => {
    if (!activeSimulation) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const readings: Record<string, string> = {};
      parts.forEach((p) => {
        if (
          p.name.toLowerCase().includes("arduino") ||
          p.name.toLowerCase().includes("stm32") ||
          p.name.toLowerCase().includes("esp32")
        ) {
          readings[p.id + "_VCC"] = "5.00V";
          readings[p.id + "_GND"] = "0.00V";
          readings[p.id + "_D1"] = (Math.sin(frame * 0.1) > 0 ? "5.00V" : "0.00V");
        }
        if (p.name.toLowerCase().includes("motor") || p.category === "Mecânica") {
          readings[p.id + "_speed"] = (Math.abs(Math.sin(frame * 0.1)) * 100).toFixed(0) + " rpm";
        }
        if (p.name.toLowerCase().includes("oled") || p.name.toLowerCase().includes("lcd")) {
          readings[p.id + "_display"] = frame % 20 < 10 ? "HELLO" : "WORLD";
        }
      });
      (window as any)._circuitReadings = readings;
    }, 50);
    return () => clearInterval(interval);
  }, [activeSimulation, parts]);

  const [aiQuota, setAiQuota] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("aiQuota") : null;
    const savedDate =
      typeof window !== "undefined"
        ? localStorage.getItem("aiQuotaDate")
        : null;
    const today = new Date().toDateString();
    if (savedDate !== today) {
      if (typeof window !== "undefined") {
        localStorage.setItem("aiQuotaDate", today);
        localStorage.setItem("aiQuota", "10");
      }
      return 10;
    }
    return saved ? parseInt(saved, 10) : 10;
  });

  const consumeQuota = () => {
    setAiQuota((prev) => {
      const newQuota = prev - 1;
      if (typeof window !== "undefined")
        localStorage.setItem("aiQuota", newQuota.toString());
      return newQuota;
    });
  };

  const handlePinClick = (partId: string, pin: string) => {
    if (!selectedWireStart) {
      setSelectedWireStart({ partId, pin });
    } else {
      if (
        selectedWireStart.partId === partId &&
        selectedWireStart.pin === pin
      ) {
        setSelectedWireStart(null); // Deselect
        setMousePos(null);
      } else {
        // Add connection
        setWiringConnections((prev) => [
          ...prev,
          {
            fromPart: selectedWireStart.partId,
            fromPin: selectedWireStart.pin,
            toPart: partId,
            toPin: pin,
          },
        ]);
        setSelectedWireStart(null);
        setMousePos(null);
      }
    }
  };

  const isPinConnected = (partId: string, pin: string) => {
    return wiringConnections.some(
      (c) =>
        (c.fromPart === partId && c.fromPin === pin) ||
        (c.toPart === partId && c.toPin === pin),
    );
  };

  const removeConnection = (index: number) => {
    setWiringConnections((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag context
  const handleDragStart = (e: any, catalogPart: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(catalogPart));
  };

  const handleAddPart = (catalogPart: any) => {
    const newPart = {
      ...catalogPart,
      id: "p_" + Date.now(),
      transform: {
        position: catalogPart.defaultPosition || [0, 2.5, 0],
        rotation: catalogPart.defaultRotation || [0, 0, 0],
        scale: catalogPart.defaultScale || [10, 5, 10],
      },
      metalness: catalogPart.metalness ?? 0.5,
      roughness: catalogPart.roughness ?? 0.5,
      emissive: catalogPart.emissive || "#000000",
      emissiveIntensity: catalogPart.emissiveIntensity ?? 0,
      opacity: catalogPart.opacity ?? 1,
      transparent: catalogPart.transparent ?? false,
      clearcoat: catalogPart.clearcoat ?? (catalogPart.metalness > 0.5 ? 1 : 0),
      clearcoatRoughness: catalogPart.clearcoatRoughness ?? 0.15,
      subShapes: catalogPart.subShapes,
    };
    setParts([...parts, newPart]);
    handleSelectPart(newPart);
  };

  const handleAddGeneratedParts = (generatedParts: any[], replace: boolean = true, newProjectName?: string) => {
    const newParts = generatedParts.map((part, idx) => ({
      id: "p_" + Date.now() + "_" + idx,
      name: part.name || "Peça 3D",
      category: part.category || "Design 3D Ultra Realista",
      color: "text-gray-300",
      hexColor: part.hexColor || "#d1d5db",
      cost: part.cost ?? 0,
      pins: part.pins || [],
      defaultLogic: part.defaultLogic || "",
      shapeType: part.shapeType || "box",
      subShapes: part.subShapes,
      metalness: part.metalness ?? 0.5,
      roughness: part.roughness ?? 0.5,
      emissive: part.emissive || "#000000",
      emissiveIntensity: part.emissiveIntensity ?? (part.emissive && part.emissive !== "#000000" ? 1.5 : 0),
      opacity: part.opacity ?? (part.transparent ? 0.35 : 1),
      transparent: part.transparent ?? (part.opacity !== undefined && part.opacity < 1),
      clearcoat: part.clearcoat ?? (part.metalness > 0.5 ? 1 : 0),
      clearcoatRoughness: part.clearcoatRoughness ?? 0.15,
      transform: { 
        position: part.position || (part.transform?.position) || [0, 0, 0], 
        rotation: part.rotation || (part.transform?.rotation) || [0, 0, 0], 
        scale: part.scale || (part.transform?.scale) || [10, 5, 10] 
      }
    }));
    if (replace) {
      setParts(newParts);
      if (newProjectName) {
        setProjectName(newProjectName.toUpperCase());
        setProjectDesc(`Design 3D Ultra Realista: ${newProjectName.toUpperCase()}`);
      }
      setSelectedPart(null);
    } else {
      setParts(prev => [...prev, ...newParts]);
    }
    consumeQuota();
  };


  const handleDrop = (e: any) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (dataStr) {
        const item = JSON.parse(dataStr);
        handleAddPart(item);
      }
    } catch (err) {}
  };

  const handleTransformUpdate = (
    id: string,
    transformUpdate: any,
  ) => {
    setParts(
      parts.map((p) =>
        p.id === id
          ? { ...p, transform: { ...p.transform, ...transformUpdate } }
          : p,
      ),
    );
  };

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [cloudProjects, setCloudProjects] = useState<any[]>([]);

  const fetchCloudProjects = async () => {
    if (!db || isRemixed) return;
    const user = auth?.currentUser;
    if (!user) return;
    try {
      const q = query(collection(db, "allvacreator_projects"), where("ownerId", "==", user.uid));
      const snap = await getDocs(q);
      const userProjs = snap.docs.map((d) => {
        const data = d.data();
        return { id: d.id, ...data };
      });
      setCloudProjects(userProjs);
    } catch (e) {
      console.warn("fetchCloudProjects error:", e);
      handleFirestoreError(e, OperationType.LIST, "allvacreator_projects");
    }
  };

  const loadCloudProject = (proj: any) => {
    setProjectName(proj.name || "SEM TÍTULO");
    setProjectDesc(proj.desc || "");
    setParts(proj.parts || []);
    setWiringConnections(proj.wiringConnections || []);
    setShowProjectsModal(false);
  };

  const deleteCloudProject = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    try {
      await deleteDoc(doc(db, "allvacreator_projects", id));
      setCloudProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      handleFirestoreError(e, OperationType.DELETE, `allvacreator_projects/${id}`);
    }
  };

  const scaleComponent = (factor: number) => {
    if (!selectedPart) return;
    setParts(
      parts.map((p) => {
        if (p.id === selectedPart.id) {
          return {
            ...p,
            transform: {
              ...p.transform,
              scale: p.transform.scale.map((s: number) =>
                Math.max(1, s * factor),
              ),
            },
          };
        }
        return p;
      }),
    );
  };

  const saveToFirebase = async () => {
    if (!projectName) return alert("Nome do projeto necessário.");
    if (!db || isRemixed) {
      alert("Salvo localmente. Conecte ao Firebase para salvar nas nuvens.");
      return;
    }

    const user = auth?.currentUser;
    if (!user) {
      alert("É necessário estar autenticado para salvar.");
      return;
    }

    try {
      const sanitizedId = projectName.replace(/[^a-zA-Z0-9_\-]/g, "_").toLowerCase() || `proj_${Date.now()}`;
      const docRef = doc(collection(db, "allvacreator_projects"), sanitizedId);
      await setDoc(docRef, {
        ownerId: user.uid,
        name: projectName,
        desc: projectDesc,
        parts,
        wiringConnections,
        updatedAt: new Date().toISOString(),
      });
      alert("Projeto salvo na nuvem com sucesso!");
    } catch (e) {
      console.error("Erro ao salvar", e);
      handleFirestoreError(e, OperationType.WRITE, "allvacreator_projects");
      alert("Erro ao salvar o projeto. Verifique suas permissões.");
    }
  };
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLogic, setIsGeneratingLogic] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [wirePaths, setWirePaths] = useState<
    Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>
  >([]);

  const updatePaths = () => {
    if (!containerRef.current || viewMode !== "WIRING") return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPaths = wiringConnections
      .map((conn, i) => {
        const fromEl = pinRefs.current[`${conn.fromPart}-${conn.fromPin}`];
        const toEl = pinRefs.current[`${conn.toPart}-${conn.toPin}`];
        if (fromEl && toEl) {
          const r1 = fromEl.getBoundingClientRect();
          const r2 = toEl.getBoundingClientRect();
          return {
            id: `w-${i}`,
            x1:
              r1.left +
              r1.width / 2 -
              containerRect.left +
              containerRef.current!.scrollLeft,
            y1:
              r1.top +
              r1.height / 2 -
              containerRect.top +
              containerRef.current!.scrollTop,
            x2:
              r2.left +
              r2.width / 2 -
              containerRect.left +
              containerRef.current!.scrollLeft,
            y2:
              r2.top +
              r2.height / 2 -
              containerRect.top +
              containerRef.current!.scrollTop,
          };
        }
        return null;
      })
      .filter(Boolean) as any[];
    setWirePaths(newPaths);
  };

  useEffect(() => {
    updatePaths();
    window.addEventListener("resize", updatePaths);
    return () => window.removeEventListener("resize", updatePaths);
  }, [wiringConnections, viewMode, parts]);

  const handleGenerateLogic = async () => {
    if (!selectedPart) return;
    if (aiQuota <= 0) {
      alert("Você atingiu o limite de gerações por IA (Cota diária).");
      return;
    }
    setIsGeneratingLogic(true);
    try {
      const response = await fetch("/api/generate-logic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName: selectedPart.name,
          projectPrompt: projectName,
          pins: selectedPart.pins,
          currentLogic: logicCode,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setLogicCode(data.logicCode);
        // Update part's default logic
        setParts(
          parts.map((p) =>
            p.id === selectedPart.id
              ? { ...p, defaultLogic: data.logicCode }
              : p,
          ),
        );
        consumeQuota();
      } else {
        const errText = await response.text();
        let errMsg = "Erro ao gerar código";
        try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
        alert(errMsg);
      }
    } catch (e) {
      console.error("Erro ao gerar lógica:", e);
      alert("Erro ao gerar código.");
    } finally {
      setIsGeneratingLogic(false);
    }
  };

  const exportBOMToCSV = () => {
    let csv = "ID,Nome,Categoria,Custo\n";
    let totalCost = 0;
    parts.forEach((p) => {
      csv += `"${p.id}","${p.name}","${p.category}","${p.cost || 0}"\n`;
      totalCost += p.cost || 0;
    });
    csv += `\nCusto Total,,,${totalCost.toFixed(2)}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const dnNode = document.createElement("a");
    dnNode.setAttribute("href", url);
    dnNode.setAttribute(
      "download",
      projectName.replace(/\s+/g, "_") + "_BOM.csv",
    );
    document.body.appendChild(dnNode);
    dnNode.click();
    dnNode.remove();
  };

  const handleSelectPart = (part: (typeof INITIAL_PARTS_DATA)[0]) => {
    setSelectedPart(part);
    setLogicCode(part.defaultLogic);
  };

  const generateEnclosure = async () => {
    if (aiQuota <= 0) {
      alert("Você atingiu o limite de gerações por IA (Cota diária).");
      return;
    }
    setIsGeneratingEnclosure(true);
    try {
      const response = await fetch("/api/generate-enclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, parts }),
      });
      if (response.ok) {
        const data = await response.json();
        setEnclosure(data);
        consumeQuota();
      } else {
        const errText = await response.text();
        let errMsg = "Tente novamente.";
        try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
        alert("Erro ao projetar caixa: " + errMsg);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar.");
    } finally {
      setIsGeneratingEnclosure(false);
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    if (aiQuota <= 0) {
      alert("Você atingiu o limite de gerações por IA (Cota diária).");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setParts(data.parts);
        setProjectName(data.projectName.toUpperCase());
        setProjectDesc(`Conceito gerado: ${data.projectName}`);
        setSelectedPart(null);
        consumeQuota();
      } else {
        const errText = await response.text();
        let errMsg = "Erro ao gerar peças";
        try { errMsg = JSON.parse(errText).error || errMsg; } catch(e) {}
        alert(errMsg);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar peças");
    } finally {
      setIsGenerating(false);
      setAiPrompt("");
    }
  };

  const electricalCount = parts.filter((p) => p.category === "Elétrica").length;
  const mechanicalCount = parts.filter((p) => p.category !== "Elétrica").length;
  const totalCount = parts.length;
  const [mobileTab, setMobileTab] = useState<"CATALOG" | "CANVAS" | "LIST">(
    "CANVAS",
  );

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-[#16161a] text-gray-200">

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#16161a] border border-[#2d2d33] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row custom-scrollbar">
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-[#1e1e24] to-[#121215]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 md:mb-6">
                <Box className="w-5 h-5 md:w-6 md:h-6 text-teal-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Bem-vindo ao AllvaCreator</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 md:mb-6">
                O AllvaCreator é o seu estúdio de design 3D. Crie caixas, modele peças, adicione botões e ecrãs, e projete toda a estrutura física do seu produto final com perfeição.
              </p>
            </div>
            <div className="md:w-1/2 p-6 md:p-8 bg-[#121215] flex flex-col justify-center border-t md:border-t-0 md:border-l border-[#2d2d33]">
              <h3 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">O que deseja projetar hoje?</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    localStorage.setItem('allvacreator_welcome_seen', 'true');
                    setShowWelcome(false);
                  }}
                  className="w-full p-3 md:p-4 rounded-xl border border-[#2d2d33] bg-[#16161a] hover:border-teal-500/50 hover:bg-teal-500/10 text-left transition-all group"
                >
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-teal-400 mb-1">Caixas e Invólucros</div>
                  <div className="text-xs text-gray-500">Criar cases para circuitos, sensores ou painéis.</div>
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('allvacreator_welcome_seen', 'true');
                    setShowWelcome(false);
                  }}
                  className="w-full p-3 md:p-4 rounded-xl border border-[#2d2d33] bg-[#16161a] hover:border-blue-500/50 hover:bg-blue-500/10 text-left transition-all group"
                >
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 mb-1">Design de Produto</div>
                  <div className="text-xs text-gray-500">Desenhar interfaces físicas, visores e botões em 3D.</div>
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('allvacreator_welcome_seen', 'true');
                    setShowWelcome(false);
                  }}
                  className="w-full p-3 md:p-4 rounded-xl border border-[#2d2d33] bg-[#16161a] hover:border-purple-500/50 hover:bg-purple-500/10 text-left transition-all group"
                >
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-purple-400 mb-1">Modelagem Livre</div>
                  <div className="text-xs text-gray-500">Explorar ferramentas de design paramétrico para peças únicas.</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tabs */}
      <div className="md:hidden flex border-b border-[#2d2d33] bg-[#16161a] shrink-0 z-20">
        <button
          onClick={() => setMobileTab("CATALOG")}
          className={`flex-1 py-3 text-xs font-bold ${mobileTab === "CATALOG" ? "text-teal-400 border-b-2 border-teal-600" : "text-gray-500"}`}
        >
          CATÁLOGO
        </button>
        <button
          onClick={() => setMobileTab("CANVAS")}
          className={`flex-1 py-3 text-xs font-bold ${mobileTab === "CANVAS" ? "text-teal-400 border-b-2 border-teal-600" : "text-gray-500"}`}
        >
          ÁREA DE TRABALHO
        </button>
        <button
          onClick={() => setMobileTab("LIST")}
          className={`flex-1 py-3 text-xs font-bold ${mobileTab === "LIST" ? "text-teal-400 border-b-2 border-teal-600" : "text-gray-500"}`}
        >
          MATERIAIS ({parts.length})
        </button>
      </div>

      {/* Left Sidebar - Summary & Catalog */}
      <div
        className={`w-full md:w-64 border-r border-[#2d2d33] flex-col shadow-sm z-10 shrink-0 bg-[#16161a] md:flex h-full ${mobileTab === "CATALOG" ? "flex" : "hidden"}`}
      >
        <div className="p-4 border-b border-[#2d2d33] flex-shrink-0">
          <div className="text-xs font-semibold text-gray-500 mb-4 flex items-center">
            <Info className="w-4 h-4 mr-2" /> PROJETO
          </div>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-sm font-bold mb-1 w-full bg-transparent outline-none hover:bg-[#0f0f13] focus:bg-[#0f0f13] px-1 py-0.5 rounded -ml-1"
          />
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <div className="w-4 h-4 bg-teal-900/200 rounded-sm mr-2 shrink-0"></div>
            allva_creator_v2
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col md:custom-scrollbar">
          <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center justify-between">
            <span className="flex items-center"><Box className="w-4 h-4 mr-1.5 text-teal-400" /> CATÁLOGO DE PEÇAS</span>
            <span className="text-[10px] text-gray-400 font-mono bg-[#23232a] px-1.5 py-0.5 rounded">
              {CATALOG_PARTS.filter(c => (catalogCategory === "ALL" || c.category === catalogCategory) && (!catalogSearch.trim() || c.name.toLowerCase().includes(catalogSearch.toLowerCase()) || (c.description && c.description.toLowerCase().includes(catalogSearch.toLowerCase())))).length} itens
            </span>
          </div>

          {/* Busca no Catálogo */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Buscar chaparia, farol, roda..."
              className="w-full bg-[#0f0f13] border border-[#2d2d33] rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition"
            />
            {catalogSearch && (
              <button 
                onClick={() => setCatalogSearch("")} 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Abas de Categorias */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-2 mb-2">
            {[
              { id: "ALL", label: "Todos" },
              { id: "Óculos & Wearables", label: "👓 Óculos/AR" },
              { id: "Junções & Curvas", label: "🔗 Junções & Curvas" },
              { id: "Carroçaria & Chaparia", label: "🏎️ Chaparia" },
              { id: "Óptica & Iluminação", label: "💡 Faróis" },
              { id: "Rodas & Mecânica", label: "⚙️ Rodas" },
              { id: "Vidros & Aerodinâmica", label: "🏁 Vidros/Aero" },
              { id: "Geometria 3D", label: "📐 Geom 3D" },
              { id: "Geometria Curva", label: "〰️ Curvas" },
            ].map((catTab) => (
              <button
                key={catTab.id}
                onClick={() => setCatalogCategory(catTab.id)}
                className={`whitespace-nowrap px-2 py-1 rounded text-[10px] font-semibold transition shrink-0 ${
                  catalogCategory === catTab.id
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-[#0f0f13] text-gray-400 hover:text-white border border-[#2d2d33]"
                }`}
              >
                {catTab.label}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-gray-400 mb-2">
            Arraste ou clique para adicionar à área 3D
          </div>

          <div className="flex flex-col gap-1.5">
            {CATALOG_PARTS
              .filter((cat) => {
                const matchesCategory = catalogCategory === "ALL" || cat.category === catalogCategory;
                const matchesSearch = !catalogSearch.trim() || 
                  cat.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                  (cat.description && cat.description.toLowerCase().includes(catalogSearch.toLowerCase())) ||
                  cat.category.toLowerCase().includes(catalogSearch.toLowerCase());
                return matchesCategory && matchesSearch;
              })
              .map((cat) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cat)}
                  onClick={() => handleAddPart(cat)}
                  className="group border border-[#2d2d33] p-2 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-950/20 flex flex-col gap-1 transition bg-[#16161a] hover:shadow-sm"
                  title={cat.description || "Clique ou arraste para a tela 3D"}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div 
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/40" 
                        style={{ backgroundColor: cat.hexColor || '#d1d5db' }}
                      />
                      <div className="text-xs font-semibold text-gray-200 truncate group-hover:text-white">
                        {cat.name}
                      </div>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-gray-500 group-hover:text-teal-400 shrink-0 ml-1 transition" />
                  </div>
                  {cat.description && (
                    <div className="text-[9.5px] text-gray-400 leading-tight line-clamp-2">
                      {cat.description}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[8.5px] text-gray-400 pt-0.5">
                    <span className="bg-[#23232a] px-1 py-0.5 rounded text-gray-300 font-mono">
                      {cat.category}
                    </span>
                    {cat.subShapes ? (
                      <span className="text-teal-400 font-mono">Montagem 3D</span>
                    ) : (
                      <span className="text-cyan-400 font-mono">{cat.shapeType}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#2d2d33] flex-shrink-0">
          <button
            onClick={() => {
              if (parts.length > 0) {
                setParts(parts.slice(0, -1));
              }
            }}
            disabled={parts.length === 0}
            className="w-full flex items-center justify-center py-2 mb-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2d2d33] border border-[#2d2d33] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4 mr-2" /> RETROCEDER
          </button>

          <button
            onClick={() => {
              setParts([]);
              setWiringConnections([]);
              setProjectName("SEM TÍTULO");
              setProjectDesc("");
              setSelectedPart(null);
              setLogicCode("");
            }}
            className="w-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center py-2 rounded text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            <Trash className="w-4 h-4 mr-2" /> LIMPAR ÁREA DE TRABALHO
          </button>
        </div>
      </div>

      {/* Main Center Area */}
      <div
        className={`flex-1 flex-col bg-[#0f0f13] relative overflow-hidden md:flex ${mobileTab === "CANVAS" ? "flex" : "hidden"}`}
      >
        {/* Top Header */}
        <div className="h-14 border-b border-[#2d2d33] flex items-center px-4 bg-[#16161a] shrink-0 relative z-10 overflow-x-auto scrollbar-hide md:custom-scrollbar gap-4">
          <div className="flex bg-[#2d2d33] p-1 rounded shrink-0">
            <button
              onClick={() => setViewMode("3D")}
              className={`whitespace-nowrap px-4 py-1 text-[11px] font-semibold rounded flex items-center transition ${viewMode === "3D" ? "bg-[#16161a] text-white shadow-sm" : "text-gray-500 hover:text-white"}`}
            >
              <ImageIcon className="w-3 h-3 mr-2 shrink-0" /> 3D
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`whitespace-nowrap px-4 py-1 text-[11px] font-semibold rounded flex items-center transition ${showLabels ? "bg-[#16161a] text-white shadow-sm border border-teal-500/30" : "text-gray-500 hover:text-white"}`}
            >
              <Type className="w-3 h-3 mr-2 shrink-0" /> LEGENDAS
            </button>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`whitespace-nowrap px-4 py-1 text-[11px] font-semibold rounded flex items-center transition ${showDimensions ? "bg-teal-900/50 text-teal-400 border border-teal-500/30" : "text-gray-500 hover:text-white border border-transparent"}`}
            >
              <Ruler className="w-3 h-3 mr-2 shrink-0" /> DIMENSÕES REAIS
            </button>
            <button
              onClick={() => {
                if (!showAIAssistant) {
                  handleDismissHint();
                }
                setShowAIAssistant(!showAIAssistant);
              }}
              className={`whitespace-nowrap px-3.5 py-1 text-[11px] font-bold rounded flex items-center transition ${showAIAssistant ? "bg-teal-600 text-white shadow-md border border-teal-500" : "bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/40 hover:text-white shadow-sm"}`}
              title="Abrir o Assistente IA para projetar e modelar designs 3D ultra realistas e completos"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-300 animate-pulse shrink-0" />
              {showAIAssistant ? "FECHAR ASSISTENTE IA" : "ASSISTENTE IA (CRIAR 3D)"}
            </button>
          </div>
          <div className="flex bg-[#0f0f13] border border-[#2d2d33] rounded p-0.5 items-center shrink-0">
            <button
              onClick={() => toggleTheme("dark")}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 ${studioTheme === "dark" ? "bg-teal-600 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
              title="Modo Escuro (Estúdio Dark)"
            >
              <Moon className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Escuro</span>
            </button>
            <button
              onClick={() => toggleTheme("light")}
              className={`px-2 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 ${studioTheme === "light" ? "bg-teal-600 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
              title="Modo Claro (Estúdio Light CAD)"
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Claro</span>
            </button>
          </div>
          <div className="md:hidden flex bg-[#2d2d33] p-1 rounded shrink-0 ml-auto gap-1">
            <button
              onClick={() => {
                if (parts.length > 0) {
                  setParts(parts.slice(0, -1));
                }
              }}
              className="px-3 py-1 text-[11px] font-semibold rounded flex items-center text-gray-400 hover:text-white transition hover:bg-gray-700"
              title="Retroceder"
            >
              <Undo2 className="w-3 h-3 mr-1.5" /> RETROCEDER
            </button>
            <button
              onClick={() => {
                setParts([]);
                setWiringConnections([]);
                setSelectedPart(null);
              }}
              className="px-3 py-1 text-[11px] font-semibold rounded flex items-center text-red-400 hover:text-red-300 transition hover:bg-red-900/30"
              title="Limpar Área de Trabalho"
            >
              <Trash2 className="w-3 h-3 mr-1.5" /> LIMPAR
            </button>
          </div>
          <div className="flex text-xs font-medium text-gray-500 items-center gap-4 shrink-0">
            {(viewMode === "3D" || viewMode === "ENCLOSURE") && (
              <>
                <label className="flex items-center cursor-pointer select-none hover:text-gray-200 transition-colors whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showAxes}
                    onChange={(e) => setShowAxes(e.target.checked)}
                    className="mr-1.5 accent-teal-600"
                  />
                  Exibir Eixos
                </label>
                <div className="w-px h-3 bg-gray-300"></div>
                <label className="flex items-center cursor-pointer select-none hover:text-gray-200 transition-colors whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="mr-1.5 accent-teal-600"
                  />
                  Rotação Autom.
                </label>
              </>
            )}
            <button
              onClick={() => setShowListSidebar(!showListSidebar)}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0f0f13] text-gray-300 border border-[#2d2d33] hover:bg-[#2d2d33] rounded text-xs font-bold transition whitespace-nowrap"
            >
              <List className="w-3.5 h-3.5" />{" "}
              {showListSidebar ? "Ocultar Materiais" : "Ver Materiais"}
            </button>
            <button
              onClick={() => {
                setShowProjectsModal(true);
                fetchCloudProjects();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#16161a] text-teal-400 border border-[#2d2d33] hover:bg-[#2d2d33] rounded text-xs font-bold transition whitespace-nowrap"
            >
              <FolderOpen className="w-3.5 h-3.5" /> Abrir Projetos
            </button>
            <button
              onClick={saveToFirebase}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#16161a] text-teal-400 border border-[#2d2d33] hover:bg-[#2d2d33] rounded text-xs font-bold transition whitespace-nowrap"
            >
              <Cloud className="w-3.5 h-3.5" /> Salvar Projeto (Nuvem)
            </button>
            <button
              onClick={() => setShowTour(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 rounded text-xs font-bold transition whitespace-nowrap"
              title="Ver o tour explicativo do AllvaCreator 3D"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Tour 3D
            </button>
          </div>
        </div>

        {showProjectsModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#16161a] border border-[#2d2d33] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-[#2d2d33]">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-teal-500" /> Meus
                  Projetos na Nuvem
                </h2>
                <button
                  onClick={() => setShowProjectsModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2d2d33]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {cloudProjects.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    Nenhum projeto salvo na nuvem ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cloudProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-[#0f0f13] border border-[#2d2d33] p-4 rounded-lg hover:border-teal-500/50 transition relative group"
                      >
                        <h3 className="font-bold text-white truncate pr-8">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-[32px]">
                          {proj.desc || "Sem descrição"}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-3 font-mono border-t border-[#2d2d33] pt-2">
                          Componentes: {proj.parts?.length || 0}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => loadCloudProject(proj)}
                            className="flex-1 bg-teal-600 hover:bg-teal-900/300 text-white rounded py-1.5 text-xs font-bold transition"
                          >
                            Abrir
                          </button>
                        </div>
                        <button
                          onClick={() => deleteCloudProject(proj.id)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Workspace */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div
            className="flex-1 flex overflow-hidden flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
          {viewMode === "3D" || viewMode === "ENCLOSURE" ? (
            <div className={`flex-1 relative transition-colors duration-200 ${studioTheme === "light" ? "bg-[#f8fafc]" : "bg-[#0f0f13]"}`}>
              {viewMode === "ENCLOSURE" && enclosure?.imageUrl && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#2d2d33] p-12">
                  <img
                    src={enclosure.imageUrl}
                    alt="Finished Product"
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-[#2d2d33]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <Canvas shadows
                camera={{ position: [50, 40, 50], fov: 45 }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
                className={
                  viewMode === "ENCLOSURE" && enclosure?.imageUrl
                    ? "opacity-0 pointer-events-none"
                    : ""
                }
              >
                <color attach="background" args={[studioTheme === "light" ? "#f8fafc" : "#0d0d12"]} />
                <ambientLight intensity={studioTheme === "light" ? 0.65 : 0.4} />
                {/* Key Studio Light */}
                <directionalLight 
                  position={[25, 45, 25]} 
                  intensity={1.5} 
                  castShadow 
                  shadow-mapSize={[2048, 2048]} 
                  shadow-camera-far={120} 
                  shadow-camera-left={-45} 
                  shadow-camera-right={45} 
                  shadow-camera-top={45} 
                  shadow-camera-bottom={-45} 
                  shadow-bias={-0.0001}
                />
                {/* Rim / Edge Light for ultra-realistic metallic and glass edge highlights */}
                <directionalLight position={[-25, 20, -25]} intensity={0.7} color="#93c5fd" />
                {/* Soft Fill Light */}
                <pointLight position={[-15, 12, 15]} intensity={0.4} color="#fde68a" />
                <Environment preset="city" />
                <ContactShadows resolution={1024} scale={200} blur={2.2} opacity={studioTheme === "light" ? 0.35 : 0.75} far={25} color="#000000" position={[0, -0.1, 0]} />

                {showAxes && <axesHelper args={[40]} />}
                <Grid
                  infiniteGrid
                  fadeDistance={200}
                  fadeStrength={5}
                  sectionColor={studioTheme === "light" ? "#94a3b8" : "#334155"}
                  cellColor={studioTheme === "light" ? "#cbd5e1" : "#1e293b"}
                  cellThickness={0.5}
                  sectionThickness={1.2}
                />

                {viewMode === "ENCLOSURE" &&
                  enclosure &&
                  !enclosure.imageUrl && (
                    <mesh castShadow receiveShadow position={[0, enclosure.height / 2, 0]}>
                      <boxGeometry
                        args={[
                          enclosure.width,
                          enclosure.height,
                          enclosure.depth,
                        ]}
                      />
                      <meshPhysicalMaterial
                        color={enclosure.color}
                        transparent={true}
                        opacity={0.7}
                        roughness={0.1}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        transmission={0.4}
                        thickness={1}
                      />
                      <Edges scale={1.001} threshold={15} color="black" />
                    </mesh>
                  )}

                {parts.map((part) => (
                  <PartMesh
                    key={part.id}
                    id={part.id}
                    showLabels={showLabels}
                    showDimensions={showDimensions}
                    position={part.transform.position}
                    rotation={part.transform.rotation}
                    scale={part.transform.scale}
                    color={part.hexColor}
                    name={part.name}
                    shapeType={part.shapeType}
                    subShapes={part.subShapes}
                    metalness={part.metalness}
                    roughness={part.roughness}
                    emissive={part.emissive}
                    emissiveIntensity={part.emissiveIntensity}
                    opacity={part.opacity}
                    transparent={part.transparent}
                    clearcoat={part.clearcoat}
                    clearcoatRoughness={part.clearcoatRoughness}
                    selectedPart={selectedPart}
                    isActive={activeSimulation}
                    onSelectPart={() => handleSelectPart(part)}
                    onTransformUpdate={handleTransformUpdate}
                    transformMode={transformMode}
                  />
                ))}

                {/* 3D Copper Wiring */}
                {wiringConnections.map((conn, idx) => {
                  const p1 = parts.find((p) => p.id === conn.fromPart);
                  const p2 = parts.find((p) => p.id === conn.toPart);
                  if (!p1 || !p2) return null;
                  return (
                    <CopperWire3D
                      key={`wire3d_${idx}`}
                      startPos={p1.transform.position as [number, number, number]}
                      endPos={p2.transform.position as [number, number, number]}
                    />
                  );
                })}

                <OrbitControls
                  makeDefault
                  autoRotate={autoRotate && !selectedPart}
                />
              </Canvas>
              {/* Floating Light/Dark Mode Switcher on 3D Canvas */}
              {(viewMode === "3D" || viewMode === "ENCLOSURE") && (
                <div className={`absolute top-6 right-6 z-10 flex items-center backdrop-blur-md border rounded-lg p-0.5 shadow-lg transition-colors ${
                  studioTheme === "light" 
                    ? "bg-white/90 border-slate-200 shadow-slate-200/50" 
                    : "bg-[#16161a]/90 border-[#2d2d33] shadow-black/40"
                }`}>
                  <button
                    onClick={() => toggleTheme("dark")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1.5 ${
                      studioTheme === "dark" 
                        ? "bg-teal-600 text-white shadow-sm" 
                        : studioTheme === "light" 
                          ? "text-slate-600 hover:text-slate-900" 
                          : "text-gray-400 hover:text-white"
                    }`}
                    title="Modo Escuro (Estúdio Dark)"
                  >
                    <Moon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px]">Dark</span>
                  </button>
                  <button
                    onClick={() => toggleTheme("light")}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1.5 ${
                      studioTheme === "light" 
                        ? "bg-teal-600 text-white shadow-sm" 
                        : "text-gray-400 hover:text-white"
                    }`}
                    title="Modo Claro (Estúdio Light CAD)"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px]">Light</span>
                  </button>
                </div>
              )}
              {parts.length === 0 && viewMode === "3D" && !showAIAssistant && !dismissEmptyHint && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 z-10 animate-in fade-in duration-200">
                  <div className="bg-[#16161a]/95 backdrop-blur-md border border-[#2d2d33] p-6 rounded-2xl max-w-sm text-center shadow-2xl pointer-events-auto relative">
                    <button
                      onClick={handleDismissHint}
                      className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2d2d33] transition"
                      title="Fechar sugestão"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Área de Trabalho 3D</h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Abra o <strong>Assistente IA</strong> para modelar produtos ultra realistas, acabados e bem detalhados (ex: <em>"Cria um super carro"</em>, <em>"Projeta um drone com câmera 4K"</em>) ou monte peças do catálogo.
                    </p>
                    <button
                      onClick={() => {
                        handleDismissHint();
                        setShowAIAssistant(true);
                      }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" /> Abrir Assistente IA (Criar 3D)
                    </button>
                  </div>
                </div>
              )}
              {viewMode === "ENCLOSURE" && (
                <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                  <div className="text-xs text-white bg-blue-600/90 px-3 py-1.5 rounded shadow-sm border border-blue-500 font-medium">
                    Modo Produto Acabado
                  </div>
                  {enclosure && (
                    <div className="bg-[#16161a]/90 border border-[#2d2d33] p-3 rounded shadow-sm w-64 pointer-events-auto">
                      <h4 className="text-[11px] font-bold text-gray-200 mb-1">
                        Especificações:
                      </h4>
                      <div className="text-[10px] text-gray-400 mb-1">
                        Dimensões: {enclosure.width}x{enclosure.height}x
                        {enclosure.depth} mm
                      </div>
                      <div className="text-[10px] text-gray-400 mb-1">
                        Material: {enclosure.material}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-2 italic">
                        "{enclosure.description}"
                      </div>
                    </div>
                  )}
                  <button
                    onClick={generateEnclosure}
                    disabled={isGeneratingEnclosure || aiQuota <= 0}
                    className="pointer-events-auto mt-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-2 rounded text-[11px] font-bold shadow hover:opacity-90 disabled:opacity-50 flex items-center justify-center shadow-md w-64"
                  >
                    {isGeneratingEnclosure ? (
                      "Projetando..."
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 mr-1" /> GERAR DESIGN COM
                        IA ({aiQuota})
                      </>
                    )}
                  </button>
                </div>
              )}
              {selectedPart && viewMode === "3D" && (
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className="bg-[#16161a]/90 p-1 rounded shadow-sm border border-[#2d2d33] flex gap-1">
                    <button
                      onClick={() => setTransformMode("translate")}
                      className={`px-3 py-1.5 rounded text-xs font-medium flex items-center transition ${transformMode === "translate" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"}`}
                      title="Mover (Transladar)"
                    >
                      <Move className="w-3.5 h-3.5 mr-1.5" /> Mover
                    </button>
                    <button
                      onClick={() => setTransformMode("rotate")}
                      className={`px-3 py-1.5 rounded text-xs font-medium flex items-center transition ${transformMode === "rotate" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"}`}
                      title="Girar (Rotacionar)"
                    >
                      <RotateCw className="w-3.5 h-3.5 mr-1.5" /> Girar
                    </button>
                    <button
                      onClick={() => setTransformMode("scale")}
                      className={`px-3 py-1.5 rounded text-xs font-medium flex items-center transition ${transformMode === "scale" ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"}`}
                      title="Escalar (Esticar)"
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-1.5" /> Escalar
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-6 left-6 text-[10px] text-gray-200 bg-[#16161a]/90 p-3 rounded shadow-sm border border-[#2d2d33] pointer-events-none hidden md:block">
                <div className="font-bold mb-2 tracking-wider text-white border-b border-[#2d2d33] pb-1">
                  CONTROLES 3D
                </div>
                <div className="mb-1">Clique Esquerdo: Selecionar / Girar</div>
                <div className="mb-1">Clique Direito: Mover a Visão</div>
                <div>Scroll: Aproximar / Afastar</div>
              </div>
            </div>
          ) : viewMode === "CODE" && selectedPart ? (
            // Code / Logic View
            <div className="flex-1 flex flex-col bg-[#1e1e1e] text-gray-300">
              <div className="h-10 border-b border-gray-700 flex items-center px-4 bg-[#252526]">
                <Code className="w-4 h-4 text-teal-400 mr-2" />
                <span className="text-xs font-mono">
                  {selectedPart.name.replace(/ /g, "_")}.cpp
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={handleGenerateLogic}
                    disabled={isGeneratingLogic || aiQuota <= 0}
                    className="flex items-center text-[10px] px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded transition disabled:opacity-50"
                  >
                    {isGeneratingLogic ? (
                      "..."
                    ) : (
                      <Star className="w-3 h-3 mr-1" />
                    )}
                    GERAR LÓGICA ({aiQuota})
                  </button>
                  <button
                    onClick={() => setActiveSimulation(!activeSimulation)}
                    className={`flex items-center text-[10px] px-3 py-1 rounded transition ${activeSimulation ? "bg-red-500/20 text-red-400 hover:bg-red-900/300/30" : "bg-teal-600/20 text-teal-400 hover:bg-teal-600/30"}`}
                  >
                    {activeSimulation ? (
                      <X className="w-3 h-3 mr-1" />
                    ) : (
                      <Play className="w-3 h-3 mr-1" />
                    )}
                    {activeSimulation
                      ? "PARAR SIMULAÇÃO"
                      : "EXECUTAR SIMULAÇÃO"}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden bg-[#1e1e1e] relative">
                <div className="w-10 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end py-4 pr-2 select-none text-[#858585] text-xs font-mono z-10 h-full overflow-hidden shrink-0">
                  <div
                    id="line-numbers"
                    className="flex flex-col items-end transition-none"
                  >
                    {logicCode.split("\n").map((_, i) => (
                      <div key={i} className="opacity-50 h-[21px]">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <textarea
                  value={logicCode}
                  onChange={(e) => setLogicCode(e.target.value)}
                  onScroll={(e) => {
                    const ln = document.getElementById("line-numbers");
                    if (ln)
                      ln.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
                  }}
                  className="flex-1 w-full h-full bg-transparent resize-none font-mono text-[13px] focus:outline-none text-[#9cdcfe] p-4 leading-[21px]"
                  spellCheck={false}
                  wrap="off"
                />
              </div>
            </div>
          ) : viewMode === "WIRING" ? (
            // WIRING View
            <div
              ref={containerRef}
              onScroll={updatePaths}
              onMouseMove={(e) => {
                if (selectedWireStart && containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  setMousePos({
                    x: e.clientX - rect.left + containerRef.current.scrollLeft,
                    y: e.clientY - rect.top + containerRef.current.scrollTop,
                  });
                }
              }}
              className="flex-1 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:50px_50px] overflow-auto p-8 flex flex-col"
            >
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0">
                {wirePaths.map((p) => (
                  <g key={p.id}>
                    {/* Fio Base */}
                    <path
                      d={`M ${p.x1} ${p.y1} L ${p.x1 + (p.x2 - p.x1)/2} ${p.y1} L ${p.x1 + (p.x2 - p.x1)/2} ${p.y2} L ${p.x2} ${p.y2}`}
                      fill="none"
                      className={activeSimulation ? "stroke-teal-500" : "stroke-teal-500/50"}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Animação do fluxo (Flow animation) */}
                    {activeSimulation && (
                      <path
                        d={`M ${p.x1} ${p.y1} L ${p.x1 + (p.x2 - p.x1)/2} ${p.y1} L ${p.x1 + (p.x2 - p.x1)/2} ${p.y2} L ${p.x2} ${p.y2}`}
                        fill="none"
                        className="stroke-orange-400 opacity-80"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="10 15"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="25;0"
                          dur="0.8s"
                          repeatCount="indefinite"
                          calcMode="linear"
                        />
                      </path>
                    )}
                  </g>
                ))}
                {/* Linha temporária quando arrastando o fio */}
                {(() => {
                  if (selectedWireStart && mousePos && containerRef.current) {
                    const el = pinRefs.current[`${selectedWireStart.partId}-${selectedWireStart.pin}`];
                    if (el) {
                      const r1 = el.getBoundingClientRect();
                      const containerRect = containerRef.current.getBoundingClientRect();
                      const x1 = r1.left + r1.width / 2 - containerRect.left + containerRef.current.scrollLeft;
                      const y1 = r1.top + r1.height / 2 - containerRect.top + containerRef.current.scrollTop;
                      const x2 = mousePos.x;
                      const y2 = mousePos.y;
                      return (
                        <path
                          d={`M ${x1} ${y1} L ${x1 + (x2 - x1)/2} ${y1} L ${x1 + (x2 - x1)/2} ${y2} L ${x2} ${y2}`}
                          fill="none"
                          className="stroke-teal-400"
                          strokeWidth="3"
                          strokeDasharray="6 6"
                          strokeLinecap="round"
                        >
                           <animate attributeName="stroke-dashoffset" values="12;0" dur="0.5s" repeatCount="indefinite" calcMode="linear" />
                        </path>
                      );
                    }
                  }
                  return null;
                })()}
              </svg>
              <div className="absolute top-6 left-6 text-xs text-gray-500 bg-[#16161a]/90 px-3 py-1.5 rounded shadow-sm border border-[#2d2d33] z-10 shrink-0">
                Modo Fiação: Clique em um pino e depois no outro para conectar.
              </div>

              {wiringConnections.length > 0 && (
                <div className="absolute top-6 right-6 bg-[#16161a]/90 border border-[#2d2d33] rounded shadow-sm p-3 w-64 z-10">
                  <div className="text-[10px] font-bold text-gray-300 tracking-wider mb-2 border-b border-[#2d2d33] pb-1">
                    CONEXÕES ATIVAS
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {wiringConnections.map((conn, idx) => {
                      const fromP = parts.find((p) => p.id === conn.fromPart);
                      const toP = parts.find((p) => p.id === conn.toPart);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#0f0f13] border border-[#2d2d33] px-2 py-1.5 rounded text-[10px]"
                        >
                          <div className="flex flex-col flex-1 truncate">
                            <span className="font-semibold text-gray-400 truncate">
                              {fromP?.name || "Desconhecido"}{" "}
                              <span className="text-teal-400">
                                [{conn.fromPin}]
                              </span>
                            </span>
                            <span className="font-semibold text-gray-400 truncate mt-0.5">
                              {toP?.name || "Desconhecido"}{" "}
                              <span className="text-blue-400">
                                [{conn.toPin}]
                              </span>
                            </span>
                          </div>
                          <button
                            onClick={() => removeConnection(idx)}
                            className="text-gray-400 hover:text-red-500 p-1 ml-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-12 items-start justify-center mt-16 w-full max-w-4xl mx-auto pb-32 z-10">
                {parts
                  .filter((p) => p.pins && p.pins.length > 0)
                  .map((part) => (
                    <div
                      key={part.id}
                      className="bg-[#1a1a20] border-2 border-[#2d2d33] rounded-sm shadow-xl flex flex-col min-w-[140px] relative"
                    >
                      {/* Notch indicator for IC */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-[#0f0f13] border-b-2 border-r-2 border-l-2 border-[#2d2d33] rounded-b-full"></div>

                      <div className="bg-[#16161a] text-gray-300 text-[10px] font-mono font-bold p-2 pt-4 text-center border-b border-[#2d2d33] truncate">
                        {part.name}
                      </div>
                      <div className="p-3 flex justify-between gap-6 relative z-10">
                        {/* Left Pins */}
                        <div className="flex flex-col gap-3">
                          {part.pins.slice(0, Math.ceil(part.pins.length / 2)).map((pin) => {
                            const isSelectedNow =
                              selectedWireStart?.partId === part.id &&
                              selectedWireStart?.pin === pin;
                            const connected = isPinConnected(part.id, pin);
                            return (
                              <div
                                key={pin}
                                className="flex items-center gap-2 group relative"
                              >
                                <div
                                  ref={(el) => {
                                    pinRefs.current[`${part.id}-${pin}`] = el;
                                  }}
                                  onClick={() => handlePinClick(part.id, pin)}
                                  className={`w-4 h-4 rounded-full border-[3px] cursor-crosshair transition-all flex items-center justify-center shrink-0
                                         ${
                                           isSelectedNow
                                             ? "border-teal-400 bg-teal-900 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                                             : connected
                                               ? "border-blue-400 bg-[#0f0f13]"
                                               : "border-[#a1a1aa] bg-[#0f0f13] group-hover:border-teal-400"
                                         }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isSelectedNow ? "bg-teal-400" : connected ? "bg-blue-400" : "bg-[#0f0f13]"}`}></div>
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 font-semibold select-none">
                                  {pin}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Right Pins */}
                        <div className="flex flex-col gap-3 items-end">
                          {part.pins.slice(Math.ceil(part.pins.length / 2)).map((pin) => {
                            const isSelectedNow =
                              selectedWireStart?.partId === part.id &&
                              selectedWireStart?.pin === pin;
                            const connected = isPinConnected(part.id, pin);
                            return (
                              <div
                                key={pin}
                                className="flex items-center gap-2 group relative flex-row-reverse"
                              >
                                <div
                                  ref={(el) => {
                                    pinRefs.current[`${part.id}-${pin}`] = el;
                                  }}
                                  onClick={() => handlePinClick(part.id, pin)}
                                  className={`w-4 h-4 rounded-full border-[3px] cursor-crosshair transition-all flex items-center justify-center shrink-0
                                         ${
                                           isSelectedNow
                                             ? "border-teal-400 bg-teal-900 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                                             : connected
                                               ? "border-blue-400 bg-[#0f0f13]"
                                               : "border-[#a1a1aa] bg-[#0f0f13] group-hover:border-teal-400"
                                         }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${isSelectedNow ? "bg-teal-400" : connected ? "bg-blue-400" : "bg-[#0f0f13]"}`}></div>
                                </div>
                                <span className="text-[10px] font-mono text-gray-400 font-semibold select-none">
                                  {pin}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                {parts.filter((p) => p.pins && p.pins.length > 0).length ===
                  0 && (
                  <div className="mt-20 text-sm text-gray-400 font-medium border border-dashed border-[#2d2d33] p-8 rounded text-center">
                    Adicione componentes elétricos com pinos ao projeto <br />{" "}
                    para visualizar o diagrama.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-gray-500 text-sm">
              Selecione um componente para visualizar o código/lógica.
            </div>
          )}
          </div>
          {/* AI Chat Workspace */}
          {showAIAssistant && (
            <div className="h-[52vh] md:h-full md:w-84 border-t md:border-t-0 md:border-l border-[#2d2d33] flex-shrink-0 z-30 w-full flex flex-col bg-[#0f0f13] shadow-2xl absolute bottom-0 md:relative md:bottom-auto">
               <AIAssistantChat onClose={() => setShowAIAssistant(false)} inline={true} onAddParts={handleAddGeneratedParts} />
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Interactive Parts List */}
      <div
        className={`w-full md:w-80 bg-[#16161a] border-l border-[#2d2d33] flex-col shadow-[-2px_0_10px_rgba(0,0,0,0.02)] z-10 shrink-0 h-full overflow-hidden ${mobileTab === "LIST" ? "flex" : "hidden"} ${showListSidebar ? "md:flex" : "md:hidden"}`}
      >
        <div className="p-4 border-b border-[#2d2d33] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center text-xs font-bold text-gray-300 hover:text-white cursor-pointer"
              onClick={() => { setShowListSidebar(false); setMobileTab("CANVAS"); }}
            >
              <List className="w-4 h-4 mr-2" /> LISTA DE MATERIAIS
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newPart = {
                    id: "p_" + Date.now(),
                    name: "Novo Componente",
                    category: "Mecânica",
                    color: "text-gray-500",
                    hexColor: "#9ca3af",
                    cost: 0.0,
                    pins: [],
                    defaultLogic: "// Lógica do componente",
                    transform: { position: [0, 0, 0], scale: [5, 5, 5] },
                  };
                  setParts([...parts, newPart]);
                  handleSelectPart(newPart);
                }}
                className="text-teal-400 hover:text-teal-300 p-1 bg-teal-900/20 rounded hover:bg-teal-100 transition-colors"
                title="Adicionar Componente"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex bg-[#0f0f13] border border-[#2d2d33] rounded-md text-xs p-1.5 items-center transition-colors focus-within:border-teal-400 focus-within:bg-[#16161a]">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 ml-1" />
            <input
              type="text"
              placeholder="Buscar componente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:custom-scrollbar">
          {parts
            .filter((p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((part) => (
              <div
                key={part.id}
                onClick={() => handleSelectPart(part)}
                className={`flex flex-col p-2.5 mb-1 rounded-md cursor-pointer transition-all border ${selectedPart?.id === part.id ? "bg-teal-900/20 border-teal-200 shadow-sm" : "bg-transparent border-transparent hover:bg-[#0f0f13]"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center text-xs font-medium text-gray-200">
                    <Box className={`w-3.5 h-3.5 mr-2 ${part.color}`} />
                    <span className="truncate max-w-[140px]">{part.name}</span>
                  </div>
                  {activeSimulation && selectedPart?.id === part.id ? (
                    <span className="text-[10px] font-bold text-teal-500 flex items-center animate-pulse">
                      <Activity className="w-3 h-3 mr-1" /> ATIVO
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold text-gray-400 uppercase">
                      {part.category}
                    </span>
                  )}
                </div>

                {/* Expandable Meta Info */}
                {selectedPart?.id === part.id && (
                  <div className="mt-2 pl-5 animate-in fade-in slide-in-from-top-1">
                    <div className="mb-3">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Nome do Sólido / Componente
                      </div>
                      <input
                        type="text"
                        value={part.name}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          setParts(parts.map(p => p.id === part.id ? { ...p, name: e.target.value } : p));
                          if (selectedPart?.id === part.id) {
                            setSelectedPart({ ...selectedPart, name: e.target.value });
                          }
                        }}
                        className="w-full bg-[#0f0f13] border border-[#2d2d33] text-gray-200 text-[10px] p-1.5 rounded focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                    <div className="mb-3">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Dimensões (mm)
                      </div>
                      <div className="bg-[#0f0f13] border border-[#2d2d33] text-gray-200 text-xs p-2 rounded flex justify-between items-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-gray-500">LARGURA</span>
                          <span className="font-mono mt-0.5">{part.transform.scale[0].toFixed(1)}</span>
                        </div>
                        <div className="text-gray-600 text-[10px]">x</div>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-gray-500">ALTURA</span>
                          <span className="font-mono mt-0.5">{part.transform.scale[1].toFixed(1)}</span>
                        </div>
                        <div className="text-gray-600 text-[10px]">x</div>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-gray-500">PROF.</span>
                          <span className="font-mono mt-0.5">{part.transform.scale[2].toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scaleComponent(1.2);
                        }}
                        className="flex-1 flex items-center justify-center bg-[#2d2d33] hover:bg-teal-600 text-white rounded py-1 text-[10px] transition"
                      >
                        <Maximize2 className="w-3 h-3 mr-1" /> Aumentar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scaleComponent(0.8);
                        }}
                        className="flex-1 flex items-center justify-center bg-[#2d2d33] hover:bg-teal-600 text-white rounded py-1 text-[10px] transition"
                      >
                        <Minimize2 className="w-3 h-3 mr-1" /> Diminuir
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Pintar (Cores)
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#d1d5db", "#4b5563", "#ffffff", "#000000"].map(c => (
                          <button
                            key={c}
                            onClick={(e) => {
                              e.stopPropagation();
                              setParts(parts.map(p => p.id === part.id ? { ...p, hexColor: c } : p));
                            }}
                            className="w-4 h-4 rounded-full border border-[#2d2d33] hover:scale-110 transition-transform shadow-sm"
                            style={{ backgroundColor: c }}
                            title="Pintar componente"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-[10px] text-gray-500 mb-1 flex items-center">
                      <Layers className="w-3 h-3 mr-1" /> Categoria:{" "}
                      {part.category}
                    </div>
                    {part.pins.length > 0 && (
                      <div className="mt-2">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Pinos ({part.pins.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {part.pins.map((pin) => (
                            <span
                              key={pin}
                              className="text-[9px] px-1.5 py-0.5 bg-[#16161a] border border-[#2d2d33] rounded text-gray-400"
                            >
                              {pin}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setParts(parts.filter((p) => p.id !== part.id));
                          if (selectedPart?.id === part.id) {
                            setSelectedPart(null);
                            setLogicCode("");
                          }
                        }}
                        className="text-[10px] bg-[#16161a] border border-[#2d2d33] text-gray-400 px-2.5 rounded hover:bg-red-900/30 hover:text-red-400 transition flex items-center justify-center"
                        title="Remover Componente"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Tour Interativo do AllvaCreator 3D */}
      <InteractiveTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        tourId="allvacreator"
        title="Guia do AllvaCreator 3D"
        steps={ALLVACREATOR_TOUR_STEPS}
      />
    </div>
  );
}
