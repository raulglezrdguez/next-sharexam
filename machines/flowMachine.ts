import Handlebars from "handlebars";
import { createMachine, assign, fromPromise } from "xstate";
import type { MyNode, MyEdge } from "@/types/flow";
import { useFlowStore } from "@/store/flowStore";
import { evaluateCondition } from "@/lib/evaluator";

interface FlowContext {
  currentNodeId: string | null;
}

type FlowEvent =
  | { type: "START" }
  | { type: "ANSWER"; nodeId: string; answer: unknown }
  | { type: "COMPLETE" }
  | { type: "RESET" };

const httpActor = fromPromise(
  async ({
    input,
  }: {
    input: { endpoint: string; method: string; responseType: string };
  }) => {
    const response = await fetch(input.endpoint, {
      method: input.method,
      headers: { "Content-Type": "application/json" },
      // body: "",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return input.responseType === "text" ? response.text() : response.json();
  }
);

const geminiActor = fromPromise(
  async ({
    input,
  }: {
    input: {
      prompt: string;
      model: string;
      temperature?: number;
      answers: Record<string, unknown>;
    };
  }) => {
    const geminiApikey = localStorage.getItem("gemini-apikey")
      ? atob(localStorage.getItem("gemini-apikey") as string)
      : null;
    if (!geminiApikey) throw new Error("Gemini API key not configured");

    const template = Handlebars.compile(input.prompt);
    const filledPrompt = template(input.answers);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${input.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApikey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: filledPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: input.temperature ?? 1.0,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  }
);

export const flowMachine = createMachine(
  {
    id: "flowExecution",
    initial: "idle",

    types: {
      context: {} as FlowContext,
      events: {} as FlowEvent,
      input: {} as { nodes: MyNode[]; edges: MyEdge[] },
    },

    context: () => ({
      currentNodeId: null,
    }),

    states: {
      idle: {
        on: { START: "running" },
      },

      running: {
        initial: "evaluating",

        states: {
          evaluating: {
            entry: "findNextNode",
            always: [
              { target: "executing", guard: "isAutoExecutableNode" },
              { target: "waitingInput", guard: "isQuestionNode" },
              { target: "processingHttp", guard: "isHttpNode" },
              { target: "processingGemini", guard: "isGeminiNode" },
              { target: "#flowExecution.completed", guard: "noMoreNodes" },
            ],
          },

          waitingInput: {
            on: {
              ANSWER: {
                target: "evaluating",
                actions: [
                  ({ event }) => {
                    if (event.answer) {
                      useFlowStore
                        .getState()
                        .setAnswer(event.nodeId, event.answer);
                    }
                  },
                  "markNodeAsExecuted",
                ],
              },
            },
          },

          processingHttp: {
            invoke: {
              src: httpActor,
              input: ({ context }) => {
                const node = useFlowStore
                  .getState()
                  .nodes.find((n) => n.id === context.currentNodeId);
                if (!node || node.type !== "http-request")
                  throw new Error("Invalid node");
                return {
                  endpoint: node.data.endpoint,
                  method: node.data.method,
                  responseType: node.data.responseType,
                };
              },
              onDone: {
                target: "evaluating",
                actions: [
                  ({ context, event }) => {
                    useFlowStore
                      .getState()
                      .setAnswer(context.currentNodeId as string, event.output);
                  },
                  "markNodeAsExecuted",
                ],
              },
              onError: {
                target: "evaluating",
                actions: [
                  ({ context, event }) => {
                    useFlowStore
                      .getState()
                      .setAnswer(context.currentNodeId as string, {
                        error: (event.error as Error).message,
                      });
                  },
                  "markNodeAsError",
                ],
              },
            },
          },

          processingGemini: {
            invoke: {
              src: geminiActor,
              input: ({ context }) => {
                const node = useFlowStore
                  .getState()
                  .nodes.find((n) => n.id === context.currentNodeId);
                if (!node || node.type !== "gemini")
                  throw new Error("Invalid node");
                return {
                  prompt: node.data.prompt,
                  model: node.data.model,
                  temperature: node.data.temperature,
                  answers: useFlowStore.getState().answers,
                };
              },
              onDone: {
                target: "evaluating",
                actions: [
                  ({ context, event }) => {
                    useFlowStore
                      .getState()
                      .setAnswer(context.currentNodeId as string, event.output);
                  },
                  "markNodeAsExecuted",
                ],
              },
              onError: {
                target: "evaluating",
                actions: [
                  ({ context, event }) => {
                    useFlowStore
                      .getState()
                      .setAnswer(context.currentNodeId as string, {
                        error: (event.error as Error).message,
                      });
                  },
                  "markNodeAsError",
                ],
              },
            },
          },

          executing: {
            entry: ["markNodeAsExecuted"],
            always: "evaluating",
          },
        },
      },

      completed: {
        on: { RESET: "idle" },
      },
    },
  },
  {
    guards: {
      isAutoExecutableNode: ({ context }) => {
        const node = useFlowStore
          .getState()
          .nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "input" || node?.type === "output";
      },
      isQuestionNode: ({ context }) => {
        const node = useFlowStore
          .getState()
          .nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "question" || node?.type === "gemini-info";
      },
      isHttpNode: ({ context }) => {
        const node = useFlowStore
          .getState()
          .nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "http-request";
      },
      isGeminiNode: ({ context }) => {
        const node = useFlowStore
          .getState()
          .nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "gemini";
      },
      isOutputNode: ({ context }) => {
        const node = useFlowStore
          .getState()
          .nodes.find((n) => n.id === context.currentNodeId);
        return node?.type === "output";
      },
      noMoreNodes: ({ context }) => {
        return context.currentNodeId === null;
      },
    },

    actions: {
      findNextNode: assign(({ context }) => {
        const currentNodeId = context.currentNodeId;
        let nextNodeId: string | null = null;

        if (!currentNodeId) {
          const startNode = useFlowStore
            .getState()
            .nodes.find((n) => n.type === "input");
          return { currentNodeId: startNode?.id || null };
        }

        // Lógica para encontrar siguiente nodo basado en condiciones
        const connectedEdges = useFlowStore
          .getState()
          .edges.filter((e) => e.source === currentNodeId);

        for (const edge of connectedEdges) {
          if (edge.data?.condition) {
            try {
              if (
                evaluateCondition(
                  edge.data.condition,
                  useFlowStore.getState().answers
                )
              ) {
                nextNodeId = edge.target;
                break;
              }
            } catch (e) {
              console.error("Invalid condition:", e);
            }
          } else {
            nextNodeId = edge.target;
            break;
          }
        }

        return { currentNodeId: nextNodeId };
      }),

      markNodeAsExecuted: ({ context }) => {
        // Actualiza el status en Zustand
        if (context.currentNodeId) {
          useFlowStore
            .getState()
            .setNodeStatus(context.currentNodeId, "executed");
        }
      },

      markNodeAsError: ({ context }) => {
        // Actualiza el status en Zustand
        if (context.currentNodeId) {
          useFlowStore.getState().setNodeStatus(context.currentNodeId, "error");
        }
      },

      updateAnswer: ({ context, event }) => {
        // Acción separada para actualizar la respuesta
        if (event.type === "ANSWER") {
          // Ya manejado por assign
        }
      },
    },
  }
);
