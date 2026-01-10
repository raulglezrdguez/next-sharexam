"use client";

import { DiagramEdge, DiagramNode, DiagramOutput } from "@/lib/types/diagram";
import { Edit2 } from "lucide-react";
import DiagramEdit from "./DiagramEdit";
import { useFlowStore } from "@/store/flowStore";
import {
  GeminiInfoNodeData,
  GeminiNodeData,
  HttpNodeData,
  InputNodeData,
  MyEdge,
  MyNode,
  OutputNodeData,
  QuestionNodeData,
} from "@/types/flow";
import { useFlowMachine, useFlowSnapshot } from "@/contexts/flowMachineContext";

type Props = {
  diagram: DiagramOutput;
  refresh: () => void;
  editId: string | null;
  setEditId: (id: string | null) => void;
};

const DiagramData = ({ diagram, refresh, editId, setEditId }: Props) => {
  const setNodes = useFlowStore((state) => state.setNodes);
  const setEdges = useFlowStore((state) => state.setEdges);
  const setViewport = useFlowStore((state) => state.setViewport);
  const setNodeSelected = useFlowStore((state) => state.setNodeSelected);
  const setEdgeSelected = useFlowStore((state) => state.setEdgeSelected);
  const setResults = useFlowStore((state) => state.setResults);
  const actorRef = useFlowMachine();
  const snapshot = useFlowSnapshot();

  const buildNodes = (nodes: DiagramNode[]) => {
    const myNodes: MyNode[] = [];
    nodes.forEach((n) => {
      switch (n.type) {
        case "input":
          myNodes.push({
            id: n.id,
            type: "input",
            position: n.position,
            data: n.data as InputNodeData,
          });
          break;
        case "question":
          myNodes.push({
            id: n.id,
            type: "question",
            position: n.position,
            data: n.data as QuestionNodeData,
          });
          break;
        case "http-request":
          myNodes.push({
            id: n.id,
            type: "http-request",
            position: n.position,
            data: n.data as HttpNodeData,
          });
          break;
        case "output":
          myNodes.push({
            id: n.id,
            type: "output",
            position: n.position,
            data: n.data as OutputNodeData,
          });
          break;
        case "gemini":
          myNodes.push({
            id: n.id,
            type: "gemini",
            position: n.position,
            data: n.data as GeminiNodeData,
          });
          break;
        case "gemini-info":
          myNodes.push({
            id: n.id,
            type: "gemini-info",
            position: n.position,
            data: n.data as GeminiInfoNodeData,
          });
          break;
      }
    });
    setNodes(myNodes);
  };

  const buildEdges = (edges: DiagramEdge[]) => {
    const myEdges: MyEdge[] = [];
    edges.forEach((e) => {
      const newEdge: MyEdge = { id: e.id, source: e.source, target: e.target };
      if (e.data && e.data.condition) {
        newEdge.data = { condition: e.data.condition as string };
      }
      myEdges.push(newEdge);
    });
    setEdges(myEdges);
  };

  const handleReset = () => {
    console.log(snapshot.value);
    if (snapshot.value === "completed") {
      actorRef.send({ type: "RESET" });
      useFlowStore.getState().setCurrentNodeId(null);
      useFlowStore.getState().clearAnswers();
      useFlowStore.getState().resetNodeStatuses();
    }
  };

  const selectDiagram = () => {
    setNodeSelected(null);
    setEdgeSelected(null);
    buildNodes(diagram.nodes);
    buildEdges(diagram.edges);
    setViewport(diagram.viewport as { x: number; y: number; zoom: number });
    setResults(diagram.result || []);
    handleReset();

    setEditId(diagram._id);
  };

  const unselectDiagram = () => {
    setNodeSelected(null);
    setEdgeSelected(null);
    setNodes([]);
    setEdges([]);
    setViewport({ x: 0, y: 0, zoom: 1 });
    setResults([]);
    handleReset();

    setEditId(null);
  };

  if (editId === diagram._id) {
    return (
      <DiagramEdit diagram={diagram} back={unselectDiagram} refresh={refresh} />
    );
  }

  return (
    <div className="flex flex-row justify-between items-center align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
      <h2 className="max-w-40 text-sm truncate">{diagram.title}</h2>
      <button onClick={selectDiagram} className="btn btn-secondary btn-sm">
        <Edit2 size={14} />
      </button>
    </div>
  );
};

export default DiagramData;
