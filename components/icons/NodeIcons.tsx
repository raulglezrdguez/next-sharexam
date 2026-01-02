import {
  PlayCircle, // Nodo de Inicio
  MessageCircleQuestion, // Nodo de Preguntas
  Globe, // Nodo HTTP Request
  Key, // Nodo Gemini Info (API Key)
  Sparkles, // Nodo Gemini (Servicio Generativelanguage)
  StopCircle,
  Play, // Nodo de Finalización
} from "lucide-react";

import NodeIconWrapper from "./NodeIconWrapper"; // Asegúrate de ajustar la ruta

// Estilos comunes para los iconos
const iconStyle = { color: "#eee", size: 18, strokeWidth: 2 };

// 1. Nodo de Inicio
export const StartNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #10b981, #059669)"
    label="Start"
  >
    <PlayCircle {...iconStyle} />
  </NodeIconWrapper>
);

// 2. Nodo de Preguntas
export const QuestionNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #f97316, #ea580c)"
    label="Question"
  >
    <MessageCircleQuestion {...iconStyle} />
  </NodeIconWrapper>
);

// 3. Nodo de HTTP Request
export const HttpRequestNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
    label="HTTP"
  >
    <Globe {...iconStyle} />
  </NodeIconWrapper>
);

// 4. Nodo de Gemini Info (API Key)
export const GeminiKeyNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #3b82f6, #2563eb)"
    label="Gemini Info"
  >
    <Key {...iconStyle} />
  </NodeIconWrapper>
);

// 5. Nodo de Gemini (Servicio Generativelanguage)
export const GeminiServiceNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #ef4444, #dc2626)"
    label="Gemini"
  >
    <Sparkles {...iconStyle} />
  </NodeIconWrapper>
);

// 6. Nodo de Finalización
export const EndNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #71717a, #52525b)"
    label="End"
  >
    <StopCircle {...iconStyle} />
  </NodeIconWrapper>
);

export const RunNodeIcon = () => (
  <NodeIconWrapper
    color="linear-gradient(135deg, #0a7f58, #025e41)"
    label="Run"
  >
    <Play {...iconStyle} />
  </NodeIconWrapper>
);
