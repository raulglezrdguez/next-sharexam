"use client";

import { useFlowStore } from "@/store/flowStore";
import type { MyNode, PuterNodeData } from "@/types/flow";
import { NodeProps, Handle, Position } from "@xyflow/react";
import { CheckCircle, Clock, Play, XCircle } from "lucide-react";

export function PuterNode({ data, id }: NodeProps<MyNode>) {
  const nodeData = data as PuterNodeData;
  const status = nodeData.status || "idle";

  const nodeSelected = useFlowStore((state) => state.nodeSelected);
  const nodeBorder = nodeSelected?.id === id ? "border-4" : "border-2";

  const statusStyles = {
    idle: "bg-gradient-to-br from-[#358a4f] to-[#27a455] border-gray-400 text-gray-100",
    running: "bg-purple-100 border-purple-500 text-purple-700 animate-pulse",
    executed: "bg-indigo-100 border-indigo-500 text-indigo-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  const StatusIcon = {
    idle: Clock,
    running: Play,
    executed: CheckCircle,
    error: XCircle,
  }[status];

  return (
    <div
      className={`relative min-w-56 px-4 py-3 rounded-xl ${nodeBorder} shadow-md ${statusStyles[status]}`}
    >
      <div className={`flex flex-col justify-center`}>
        <div className="text-lg font-semibold truncate">{id}</div>

        <div className="text-sm font-semibold truncate">
          ☁️ {nodeData.label}
        </div>

        <div className="mt-2 text-xs max-w-56 line-clamp-2">
          Prompt: {nodeData.prompt}
        </div>

        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-gray-600 rounded-full border border-purple-600 flex items-center justify-center shadow-sm">
          <StatusIcon size={14} />
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
