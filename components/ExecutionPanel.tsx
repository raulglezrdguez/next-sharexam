"use client";

import { useFlowStore } from "@/store/flowStore";
import { useFlowMachine, useFlowSnapshot } from "@/contexts/flowMachineContext";
import NodePalette from "./icons/NodePalette";
import { RunNodeIcon } from "./icons/NodeIcons";
import { RefreshCw } from "lucide-react";
import { evaluateCondition } from "@/lib/evaluator";
import { ResultInput } from "@/lib/types/diagram";

export function ExecutionPanel() {
  const nodes = useFlowStore((state) => state.nodes);
  const actorRef = useFlowMachine();
  const snapshot = useFlowSnapshot();

  const startNode = nodes.find((n) => n.type === "input");

  const handleReset = () => {
    if (snapshot.value === "completed" || snapshot.value === "stopped") {
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
        className="flex flex-row justify-center items-center align-middle gap-2 p-4 bg-gray-200 shadow-lg rounded"
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
      <div id="execution-panel" className="p-4 bg-blue-50 shadow-lg rounded">
        <p className="text-sm text-blue-700">
          ⏳ Ejecutando nodo: {snapshot.context.currentNodeId || "Iniciando..."}
        </p>
      </div>
    );
  }

  // Estado completed: muestra resultados
  if (snapshot.value === "completed" || snapshot.value === "stopped") {
    const results = useFlowStore.getState().results;
    const answers = useFlowStore.getState().answers || {};
    const resultsToShow: ResultInput[] = [];
    results.forEach((res) => {
      if (res.value && res.label) {
        if (evaluateCondition(res.value, answers)) {
          resultsToShow.push({
            label: res.label,
            value: res.value,
            reference: res.reference,
          });
        }
      }
    });

    const answersToShow: {
      valid: boolean;
      id: string;
      answer: Record<string, unknown>;
    }[] = [];
    Object.keys(answers).forEach((value) => {
      const n = nodes.find((n) => n.id === value);
      if (n && n.data?.valid !== "") {
        if (evaluateCondition(n.data.valid as string, answers)) {
          answersToShow.push({
            valid: true,
            id: value,
            answer: answers[value] as Record<string, unknown>,
          });
        } else {
          answersToShow.push({
            valid: false,
            id: value,
            answer: answers[value] as Record<string, unknown>,
          });
        }
      } else {
        answersToShow.push({
          valid: false,
          id: value,
          answer: answers[value] as Record<string, unknown>,
        });
      }
    });

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

        {answersToShow.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-200 font-bold mb-2">Answers:</h3>
            <div className="max-h-42 overflow-y-auto">
              {answersToShow.map((res, index) => (
                <div key={index} className="mb-2 p-2 bg-green-800 rounded">
                  <p className="font-semibold text-gray-200">{res.id}</p>
                  <pre
                    className={`text-xs text-gray-100 p-2 rounded text-wrap max-h-32 overflow-y-auto ${
                      res.valid ? "bg-green-900" : "bg-red-900"
                    }`}
                  >
                    {JSON.stringify(res.answer, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {resultsToShow.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-200 font-bold mb-2">Results:</h3>
            <div className="max-h-42 overflow-y-auto">
              {resultsToShow.map((res, index) => (
                <div key={index} className="mb-2 p-2 bg-green-800 rounded">
                  <p className="font-semibold text-gray-200">{res.label}:</p>
                  <pre className="text-xs bg-green-900 text-gray-100 p-2 rounded text-wrap max-h-32 overflow-y-auto">
                    {JSON.stringify(res.value, null, 2)}
                  </pre>
                  {res.reference && (
                    <p className="text-xs text-gray-300 mt-1">
                      Reference: {res.reference}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Durante la ejecución, no mostrar nada (el modal aparece solo)
  return null;
}
