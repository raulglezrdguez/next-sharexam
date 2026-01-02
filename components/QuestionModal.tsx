"use client";

import { useSelector } from "@xstate/react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import { useFlowStore } from "@/store/flowStore";
import type { MyNode } from "@/types/flow";
import QuestionForm from "./QuestionForm";
import GeminiInfoForm from "./GeminiInfoForm";

export function QuestionModal() {
  const actorRef = useFlowMachine();
  const nodes = useFlowStore((s) => s.nodes);

  const { isWaiting, nodeId } = useSelector(
    actorRef,
    (state) => {
      const isWaiting =
        typeof state.value === "object" &&
        state.value.running === "waitingInput";
      return {
        isWaiting,
        nodeId: state.context.currentNodeId,
      };
    },
    (a, b) => a.isWaiting === b.isWaiting && a.nodeId === b.nodeId
  );

  if (!isWaiting || !nodeId) return null;

  // Tomamos el nodo actualizado desde Zustand para asegurar datos frescos
  const node = nodes.find((n: MyNode) => n.id === nodeId);
  if (!node) return null;

  if (node.type === "gemini-info") {
    return <GeminiInfoForm currentQuestion={node} />;
  }

  if (node.type === "question") {
    return <QuestionForm currentQuestion={node} />;
  }

  return null;
}
