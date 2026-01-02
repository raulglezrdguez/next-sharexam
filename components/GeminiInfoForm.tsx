"use client";

import { useFlowMachine } from "@/contexts/flowMachineContext";
import { type GeminiInfoNodeData } from "@/types/flow";
import { Node } from "@xyflow/react";
import { useState } from "react";

const GeminiInfoForm = ({
  currentQuestion,
}: {
  currentQuestion: Node<GeminiInfoNodeData, "gemini-info">;
}) => {
  const actorRef = useFlowMachine();
  const [geminiApiKey, setGeminiApikey] = useState<string>("");

  // const [model, setModel] = useState<GeminiModel | null>(
  //   localStorage.getItem("gemini-model") as GeminiModel
  // );

  const handleSubmit = () => {
    if (!geminiApiKey.trim()) return;

    const encriptedApikey = btoa(geminiApiKey);
    localStorage.setItem("gemini-apikey", encriptedApikey);

    actorRef.send({
      type: "ANSWER",
      nodeId: currentQuestion.id,
      answer: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl text-gray-800 font-bold mb-4">
          {currentQuestion.data.label}
        </h2>

        <input
          type={"password"}
          value={geminiApiKey || ""}
          onChange={(e) => setGeminiApikey(e.target.value)}
          className="text-gray-800 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="gemini apikey..."
          autoFocus
        />

        {/* <select
          value={model || ""}
          onChange={(e) => setModel(e.target.value as GeminiModel)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {GEMINI_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select> */}

        <button
          onClick={handleSubmit}
          disabled={!geminiApiKey}
          className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
            geminiApiKey
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default GeminiInfoForm;
