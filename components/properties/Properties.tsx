"use client";

import { useFlowStore } from "@/store/flowStore";
import NodeProperties from "./NodeProperties";
import EdgeProperties from "./EdgeProperties";

const Properties = () => {
  const nodeSelected = useFlowStore((state) => state.nodeSelected);
  const edgeSelected = useFlowStore((state) => state.edgeSelected);

  if (!nodeSelected && !edgeSelected) return null;

  return (
    <div className="min-w-24 mx-4 my-2 flex flex-col gap-4 overflow-y-auto pb-4">
      {nodeSelected && <NodeProperties node={nodeSelected} />}
      {edgeSelected && <EdgeProperties edge={edgeSelected} />}
    </div>
  );
};

export default Properties;
