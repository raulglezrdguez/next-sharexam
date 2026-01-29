"use client";

import { PUTER_MODELS, PuterModel, PuterNodeData } from "@/types/flow";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

type Props = { data: PuterNodeData | null; id: string };

const PuterNodeProperties = ({ data, id }: Props) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const [nodeId, setNodeId] = useState<string>(id || "");
  const [prompt, setPrompt] = useState<string>(data?.prompt || "");
  const [model, setModel] = useState<string>(data?.model || PUTER_MODELS[0]);

  useEffect(() => {
    const update = () => {
      setPrompt(data?.prompt || "");
      setModel(data?.model || PUTER_MODELS[0]);
    };
    if (data) update();
  }, [data]);

  useEffect(() => {
    const update = () => {
      setNodeId(id);
    };
    if (id) {
      update();
    }
  }, [id]);

  if (!data) return null;

  const handleSave = () => {
    updateNodeData(id, nodeId, { prompt, model });
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-200">Puter Node</h2>
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
      <label htmlFor="prompt" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Prompt:</p>
        <textarea
          id="prompt"
          name="prompt"
          placeholder="prompt..."
          required
          cols={20}
          rows={10}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>

      <label htmlFor="model" className="mt-2 hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Model:</p>
        <select
          id={"model"}
          name={"model"}
          value={model || PUTER_MODELS[0]}
          onChange={(e) => setModel(e.target.value as PuterModel)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
        >
          {PUTER_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </label>

      <button onClick={handleSave} className="mt-4 self-center btn btn-primary">
        <Save size={14} />
      </button>
    </div>
  );
};

export default PuterNodeProperties;
