import { create } from "zustand";
import type { MyNode, MyEdge, MyNodeType } from "@/types/flow";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type {
  NodeChange,
  EdgeChange,
  Connection,
  XYPosition,
} from "@xyflow/react";
import { getNodeDataByType } from "@/lib/nodeDataGenerator";

type FlowStore = {
  nodes: MyNode[];
  edges: MyEdge[];
  answers: Record<string, unknown>;
  currentNodeId: string | null;
  executionStatus: "idle" | "running" | "paused" | "completed";
  nodeSelected: MyNode | null;
  edgeSelected: MyEdge | null;
  viewport: { x: number; y: number; zoom: number };

  // Acciones del diagrama
  setNodes: (nodes: MyNode[] | ((nds: MyNode[]) => MyNode[])) => void;
  setEdges: (edges: MyEdge[] | ((eds: MyEdge[]) => MyEdge[])) => void;
  onNodesChange: (changes: NodeChange<MyNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<MyEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  setNodeStatus: (nodeId: string, status: string) => void;
  setCurrentNodeId: (nodeId: string | null) => void;
  setAnswer: (nodeId: string, answer: unknown) => void;
  clearAnswers: () => void;
  resetNodeStatuses: () => void;
  setExecutionStatus: (
    status: "idle" | "running" | "paused" | "completed"
  ) => void;
  setNodeSelected: (node: MyNode | null) => void;
  setEdgeSelected: (node: MyEdge | null) => void;

  updateNodeData: (nodeId: string, newNodeId: string, data: object) => void;
  updateEdgeData: (edgeId: string, data: object) => void;

  addNode: (params: { type: MyNodeType; position: XYPosition }) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
};

export const useFlowStore = create<FlowStore>()((set) => ({
  nodes: [],
  edges: [],
  answers: {},
  currentNodeId: null,
  executionStatus: "idle",
  nodeSelected: null,
  edgeSelected: null,
  viewport: { x: 0, y: 0, zoom: 1 },

  setNodes: (nodes) =>
    set(
      typeof nodes === "function"
        ? (state) => ({ nodes: nodes(state.nodes) })
        : { nodes }
    ),
  setEdges: (edges) =>
    set(
      typeof edges === "function"
        ? (state) => ({ edges: edges(state.edges) })
        : { edges }
    ),
  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),

  setNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        return { ...n, data: { ...n.data, status } } as MyNode;
      }),
    })),

  setCurrentNodeId: (nodeId) => set({ currentNodeId: nodeId }),

  setAnswer: (nodeId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [nodeId]: answer },
    })),

  clearAnswers: () => set({ answers: {} }),

  resetNodeStatuses: () =>
    set((state) => ({
      nodes: state.nodes.map(
        (n) =>
          ({
            ...n,
            data: { ...n.data, status: "idle" },
          } as MyNode)
      ),
    })),

  setExecutionStatus: (status) => set({ executionStatus: status }),

  setNodeSelected: (node) => set({ nodeSelected: node }),
  setEdgeSelected: (edge) => set({ edgeSelected: edge }),

  updateNodeData: (nodeId, newNodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        return { ...n, id: newNodeId, data: { ...n.data, ...data } } as MyNode;
      }),
      edges: state.edges.map((e) => {
        const updatedEdge = { ...e };
        if (e.source === nodeId) {
          updatedEdge.source = newNodeId;
        }
        if (e.target === nodeId) {
          updatedEdge.target = newNodeId;
        }
        return updatedEdge;
      }),
    })),

  updateEdgeData: (edgeId, data) =>
    set((state) => ({
      edges: state.edges.map((e) => {
        if (e.id !== edgeId) return e;
        return { ...e, data: { ...e.data, ...data } } as MyEdge;
      }),
    })),

  addNode: ({ type, position }) =>
    set((state) => {
      const id = `${Math.random().toString(36).substring(2)}`;
      const defaultData = getNodeDataByType(type);

      const newNode: MyNode = {
        id,
        type,
        position,
        data: { ...defaultData },
      } as MyNode;

      return { nodes: [...state.nodes, newNode] };
    }),

  setViewport: (viewport) => set({ viewport }),
}));
