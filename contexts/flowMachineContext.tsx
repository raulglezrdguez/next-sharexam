"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useSyncExternalStore,
} from "react";
import { useMachine } from "@xstate/react";
import { ActorRefFrom } from "xstate";
import { flowMachine } from "@/machines/flowMachine";
import { useFlowStore } from "@/store/flowStore";

type FlowMachineActorRef = ActorRefFrom<typeof flowMachine>;

const FlowMachineContext = createContext<FlowMachineActorRef | null>(null);

export function FlowMachineProvider({ children }: { children: ReactNode }) {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  const [snapshot, send, actorRef] = useMachine(flowMachine, {
    input: { nodes, edges },
  });

  useEffect(() => {
    const subscription = actorRef.subscribe((nextSnapshot) => {
      // Actualiza nodo actual en Zustand
      if (
        nextSnapshot.context.currentNodeId !==
        useFlowStore.getState().currentNodeId
      ) {
        useFlowStore
          .getState()
          .setCurrentNodeId(nextSnapshot.context.currentNodeId);
      }
    });

    return () => subscription.unsubscribe();
  }, [actorRef]);

  return (
    <FlowMachineContext.Provider value={actorRef}>
      {children}
    </FlowMachineContext.Provider>
  );
}

export const useFlowMachine = (): FlowMachineActorRef => {
  const context = useContext(FlowMachineContext);
  if (!context)
    throw new Error("useFlowMachine must be used within FlowMachineProvider");
  return context;
};

export const useFlowSnapshot = () => {
  const actorRef = useFlowMachine();

  // Subscribe to the XState actorRef using useSyncExternalStore so components
  // re-render when the machine snapshot changes.
  return useSyncExternalStore(
    (notify) => {
      const sub = actorRef.subscribe(() => notify());
      return () => sub.unsubscribe();
    },
    () => actorRef.getSnapshot(),
    () => actorRef.getSnapshot()
  );
};
