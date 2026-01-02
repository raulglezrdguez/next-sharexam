"use client";

import { useFlowStore } from "@/store/flowStore";
import { useFlowMachine, useFlowSnapshot } from "@/contexts/flowMachineContext";
import NodePalette from "./icons/NodePalette";
import { RunNodeIcon } from "./icons/NodeIcons";
import { RefreshCw } from "lucide-react";

export function ExecutionPanel() {
  const nodes = useFlowStore((state) => state.nodes);
  const actorRef = useFlowMachine();
  const snapshot = useFlowSnapshot();

  const startNode = nodes.find((n) => n.type === "input");

  const handleReset = () => {
    if (snapshot.value === "completed") {
      actorRef.send({ type: "RESET" });
      useFlowStore.getState().setCurrentNodeId(null);
      useFlowStore.getState().clearAnswers();
      useFlowStore.getState().resetNodeStatuses();
    }
  };

  // Estado idle: muestra botón de inicio
  if (snapshot.value === "idle") {
    return (
      <div
        id="execution-panel"
        className="flex flex-row justify-center items-center align-middle gap-2 p-4 bg-gray-200 shadow-lg rounded-lg"
      >
        <NodePalette />

        <button
          onClick={() => {
            if (startNode) {
              useFlowStore.getState().setNodeStatus(startNode.id, "running");
            }
            actorRef.send({ type: "START" });
          }}
          className="hover:cursor-pointer"
        >
          <RunNodeIcon />
        </button>
      </div>
    );
  }

  if (snapshot.value && JSON.stringify(snapshot.value).includes("running")) {
    // No renderizar nada - el modal aparece automáticamente cuando detecta una pregunta
    return (
      <div id="execution-panel" className="p-4 bg-blue-50 shadow-lg rounded-lg">
        <p className="text-sm text-blue-700">
          ⏳ Ejecutando nodo: {snapshot.context.currentNodeId || "Iniciando..."}
        </p>
      </div>
    );
  }

  // Estado completed: muestra resultados
  if (snapshot.value === "completed") {
    return (
      <div id="execution-panel" className="p-4 bg-green-700 shadow-lg">
        <div className="flex flex-row justify-around items-center align-middle mb-4">
          <h2 className="text-gray-200 font-bold mb-2">Completed</h2>
          <button
            className="border border-gray-200 p-2 rounded bg-gray-800 shadow text-gray-200 hover:border-gray-800 hover:bg-green-200 hover:text-gray-800 hover:cursor-pointer transition duration-300 ease-in-out"
            onClick={handleReset}
          >
            <RefreshCw size={24} />
          </button>
        </div>
        <pre className="text-xs bg-green-900 text-gray-100 p-2 rounded text-wrap max-h-48 overflow-y-auto">
          {JSON.stringify(useFlowStore.getState().answers, null, 2)}
        </pre>
      </div>
    );
  }

  // Durante la ejecución, no mostrar nada (el modal aparece solo)
  return null;
}
