"use client";

import { InputNodeData } from "@/types/flow";
import { useState } from "react";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

type Props = { data: InputNodeData | null; id: string };

const InputNodeProperties = ({ data, id }: Props) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const [nodeId, setNodeId] = useState<string>(id || "");
  const [label, setLabel] = useState<string>(data?.label || "");

  if (!data) return null;

  const handleClick = () => {
    updateNodeData(id, nodeId, { label });
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-200">Input Node</h2>
      <hr />
      <label htmlFor="nodeId" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Node Id:</p>
        <input
          id="nodeId"
          name="nodeId"
          type="text"
          placeholder="nodeId..."
          required
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>
      <label htmlFor="label" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Label:</p>
        <input
          id="label"
          name="label"
          type="text"
          placeholder="label..."
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>
      <Button
        variant={"outline"}
        onClick={handleClick}
        className="w-24 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer mt-4 transition-colors duration-300 ease-in-out"
      >
        <Save size={14} />
      </Button>
    </div>
  );
};

export default InputNodeProperties;
