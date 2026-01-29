"use client";

import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
} from "@xyflow/react";
import { Panel, Group, Separator } from "react-resizable-panels";

import { useFlowStore } from "@/store/flowStore";
import { ExecutionPanel } from "@/components/ExecutionPanel";
import { QuestionNode } from "@/components/QuestionNode";
import { HttpNode } from "@/components/HttpNode";
import { GeminiNode } from "@/components/GeminiNode";
import { PuterNode } from "@/components/PuterNode";

import "@xyflow/react/dist/style.css";
import "./styles.css";

import {
  GeminiInfoNodeData,
  GeminiNodeData,
  PuterNodeData,
  HttpNodeData,
  InputNodeData,
  MyEdge,
  MyNode,
  MyNodeType,
  OutputNodeData,
  QuestionNodeData,
} from "@/types/flow";
import { useCallback, useEffect, useState } from "react";
import { InputNode } from "./InputNode";
import { OutputNode } from "./OutputNode";
import { QuestionModal } from "./QuestionModal";
import { GeminiInfoNode } from "./GeminiInfoNode";
import Properties from "./properties/Properties";
import Diagrams from "./diagrams/Diagrams";

const nodeTypes = {
  input: InputNode,
  question: QuestionNode,
  "http-request": HttpNode,
  "gemini-info": GeminiInfoNode,
  gemini: GeminiNode,
  puter: PuterNode,
  output: OutputNode,
};

const initialNodes: MyNode[] = [
  {
    id: "I",
    type: "input",
    position: { x: 0, y: 0 },
    data: {
      label: "Inicio del Flujo",
      status: "idle",
    } as InputNodeData,
  },
  {
    id: "II",
    type: "question",
    position: { x: 0, y: 150 },
    data: {
      label: "Pregunta de Edad",
      question: "¿Cuál es tu edad?",
      questionType: "number",
      // questionType: "select",
      options: [
        { id: "1", value: "Adulto menor de 50 años" },
        { id: "2", value: "Adulto mayor de 50 años" },
      ],
      // options: undefined,
      status: "idle",
    } as QuestionNodeData,
  },
  {
    id: "III",
    type: "http-request",
    position: { x: 0, y: 450 },
    data: {
      label: "Verificar API",
      endpoint: "http://metaphorpsum.com/paragraphs/2",
      method: "GET" as const,
      responseType: "text" as const,
      status: "idle",
    } as HttpNodeData,
  },
  {
    id: "IV",
    type: "output",
    position: { x: 0, y: 750 },
    data: {
      label: "Resultado Final",
      result: "Proceso completado",
      status: "idle",
    } as OutputNodeData,
  },
  {
    id: "V",
    type: "question",
    position: { x: 500, y: 150 },
    data: {
      label: "Pregunta de Gustos",
      question: "¿Qué películas te gustan más?",
      // questionType: "number",
      questionType: "select",
      options: [
        { id: "1", value: "Comedias" },
        { id: "2", value: "De acción" },
        { id: "3", value: "Musicales" },
      ],
      // options: undefined,
      status: "idle",
    } as QuestionNodeData,
  },
  {
    id: "VI",
    type: "gemini",
    position: { x: 500, y: 550 },
    data: {
      label: "Resumen de Gemini",
      prompt:
        "Resume las preferencias de películas: {{V.value}}, para una persona de {{II}} años.",
      model: "gemini-2.5-flash",
      temperature: 1.0,
      status: "idle",
    } as GeminiNodeData,
  },
  {
    id: "VII",
    type: "gemini-info",
    position: { x: 500, y: 350 },
    data: {
      label: "Info de Gemini",
      status: "idle",
    } as GeminiInfoNodeData,
  },
];

const initialEdges: MyEdge[] = [
  { id: "eI-II", source: "I", target: "II" },
  {
    id: "eII-III",
    source: "II",
    target: "III",
    // data: { condition: "answers['II'].id === '1'" },
    data: { condition: "II < 50" },
  },
  {
    id: "eII-V",
    source: "II",
    target: "V",
    // data: { condition: "answers['II'].id === '2'" },
    data: { condition: "II >= 50" },
  },
  { id: "eIII-IV", source: "III", target: "IV" },
  { id: "eV-VII", source: "V", target: "VII" },
  { id: "eVII-VI", source: "VII", target: "VI" },
  { id: "eVI-IV", source: "VI", target: "IV" },
];

function FlowWithExecution() {
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const setNodeSelected = useFlowStore((state) => state.setNodeSelected);
  const nodeSelected = useFlowStore((state) => state.nodeSelected);
  const setEdgeSelected = useFlowStore((state) => state.setEdgeSelected);
  const edgeSelected = useFlowStore((state) => state.edgeSelected);
  const setViewport = useFlowStore((state) => state.setViewport);
  const viewport = useFlowStore((state) => state.viewport);

  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);

  const addNode = useFlowStore((state) => state.addNode);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: MyNode) => {
      if (node.id === nodeSelected?.id) setNodeSelected(null);
      else setNodeSelected(node);
    },
    [setNodeSelected, nodeSelected],
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: MyEdge) => {
      if (edgeSelected?.id === edge.id) setEdgeSelected(null);
      else setEdgeSelected(edge);
    },
    [setEdgeSelected, edgeSelected],
  );

  const handlePaneClick = useCallback(
    (_: React.MouseEvent) => {
      setNodeSelected(null);
      setEdgeSelected(null);
    },
    [setNodeSelected, setEdgeSelected],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragLeave = useCallback(() => {}, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const type = e.dataTransfer.getData(
        "application/reactflow",
      ) as MyNodeType;
      if (!type) return;

      if (type === "input" && nodes.find((n) => n.type === "input")) {
        return;
      }

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      if (type === "gemini") {
        const gi = nodes.find((n) => n.type === "gemini-info");
        if (!gi) {
          addNode({
            type: "gemini-info",
            position: { x: position.x, y: position.y - 100 },
          });
        }
      }

      addNode({ type, position });
    },
    [screenToFlowPosition, addNode, nodes],
  );

  const handleNodesDelete = useCallback(() => {
    setNodeSelected(null);
    setEdgeSelected(null);
  }, [setNodeSelected, setEdgeSelected]);

  const handleEdgesDelete = useCallback(() => {
    setEdgeSelected(null);
  }, [setEdgeSelected]);

  return (
    <div className="w-full h-screen flex flex-col">
      <ExecutionPanel />

      <div className="flex flex-row flex-1">
        <div className="flex-1  [&_.react-flow__node]:bg-transparent! [&_.react-flow__node]:border-0! [&_.react-flow__node]:p-0! [&_.react-flow__node]:min-w-0!">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            viewport={viewport}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            onViewportChange={setViewport}
            fitView
            snapToGrid
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onNodesDelete={handleNodesDelete}
            onEdgesDelete={handleEdgesDelete}
          >
            <Background
              color={"#fff"}
              style={{ background: "#333" }}
              variant={BackgroundVariant.Dots}
              size={2}
            />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <QuestionModal />
    </div>
  );
}

export default function Editor() {
  const setNodes = useFlowStore((state) => state.setNodes);
  const setEdges = useFlowStore((state) => state.setEdges);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setReady = () => {
      setIsReady(true);
    };

    setNodes(initialNodes);
    setEdges(initialEdges);
    setReady();
  }, [setNodes, setEdges]);

  if (!isReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Cargando diagrama...</div>
      </div>
    );
  }

  return (
    <Group orientation="horizontal" className="h-screen w-full overflow-hidden">
      <Panel defaultSize={25} minSize={10}>
        <section className="bg-gray-800 p-4">
          <div className="h-screen flex flex-col overflow-y-auto">
            <Diagrams />
          </div>
        </section>
      </Panel>
      <Separator className="w-2 bg-gray-600 hover:bg-gray-500 transition-colors" />
      <Panel defaultSize={50} minSize={20}>
        <section className="h-full bg-black overflow-hidden">
          {/* <ReactFlowProvider>
            <FlowMachineProvider> */}
          <FlowWithExecution />
          {/* </FlowMachineProvider>
          </ReactFlowProvider> */}
        </section>
      </Panel>
      <Separator className="w-2 bg-gray-600 hover:bg-gray-500 transition-colors" />
      <Panel defaultSize={25} minSize={10}>
        <section className="bg-gray-800 p-4">
          <div className="h-screen flex flex-col overflow-y-auto">
            <Properties />
          </div>
        </section>
      </Panel>
    </Group>
  );
}
