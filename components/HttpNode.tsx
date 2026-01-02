"use client";

import { useFlowStore } from "@/store/flowStore";
// import { useEffect } from "react";
// import { useSelector } from "@xstate/react";
// import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { MyNode, HttpNodeData } from "@/types/flow";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { CheckCircle, Clock, Play, XCircle } from "lucide-react";

export function HttpNode({ data, id }: NodeProps<MyNode>) {
  // const actorRef = useFlowMachine();
  const nodeData = data as HttpNodeData;

  const status = nodeData.status || "idle";

  const nodeSelected = useFlowStore((state) => state.nodeSelected);
  const nodeBorder = nodeSelected?.id === id ? "border-4" : "border-2";

  const statusStyles = {
    idle: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-gray-400 text-gray-100",
    running: "bg-green-100 border-green-500 text-green-700 animate-pulse",
    executed: "bg-blue-100 border-blue-500 text-blue-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  const StatusIcon = {
    idle: Clock,
    running: Play,
    executed: CheckCircle,
    error: XCircle,
  }[status];

  // const isThisNodeRunning = useSelector(actorRef, (state) => {
  //   const isProcessiongHttp =
  //     typeof state.value === "object" &&
  //     state.value.running === "processingHttp";
  //   return isProcessiongHttp && state.context.currentNodeId === id;
  // });

  // useEffect(() => {
  //   if (isThisNodeRunning) {
  //     actorRef.send({
  //       type: "ANSWER",
  //       nodeId: id,
  //       answer: { endpoint: nodeData.endpoint, method: nodeData.method },
  //     });
  //   }
  // }, [isThisNodeRunning, id, nodeData.endpoint, nodeData.method, actorRef]);

  return (
    <div
      className={`relative min-w-48 px-4 py-3 rounded-xl ${nodeBorder} shadow-md ${statusStyles[status]}`}
    >
      <div className={`flex flex-col justify-center`}>
        <div className="text-sm font-semibold truncate">
          🌐 {nodeData.label}
        </div>

        <div className="mt-2 text-xs max-w-48">{nodeData.method}</div>
        <div className="mt-2 text-xs max-w-48 truncate">
          {nodeData.endpoint}
        </div>
        <div className="mt-2 text-xs max-w-48">{nodeData.responseType}</div>

        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-gray-600 rounded-full border border-gray-600 flex items-center justify-center shadow-sm">
          <StatusIcon size={14} />
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
