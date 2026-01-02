"use client";

import { useState } from "react";
import { useFlowMachine } from "@/contexts/flowMachineContext";
import type { QuestionNodeData, QuestionOption } from "@/types/flow";
import { Node } from "@xyflow/react";

const QuestionForm = ({
  currentQuestion,
}: {
  currentQuestion: Node<QuestionNodeData, "question">;
}) => {
  const actorRef = useFlowMachine();
  const [answer, setAnswer] = useState<QuestionOption | string>("");

  const handleSubmit = () => {
    actorRef.send({
      type: "ANSWER",
      nodeId: currentQuestion.id,
      answer:
        currentQuestion.data.questionType === "number"
          ? Number(answer)
          : answer,
    });

    setAnswer("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl text-gray-800 font-bold mb-4">
          {currentQuestion.data.label}
        </h2>
        <p className="mb-4 text-gray-700">{currentQuestion.data.question}</p>

        {currentQuestion.data.questionType === "select" &&
        currentQuestion.data.options ? (
          <select
            value={(answer as QuestionOption).id?.toString() || ""}
            onChange={(e) => {
              const selectedId = e.target.value; // El id de la opción
              const selectedOption = currentQuestion.data.options?.find(
                (opt) => opt.id.toString() === selectedId
              );

              if (selectedOption) {
                setAnswer({
                  id: selectedOption.id,
                  value: selectedOption.value,
                });
              } else {
                setAnswer({
                  id: "0",
                  value: "",
                });
              }
            }}
            className="text-gray-800 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            <option id="0">Selecciona una opción...</option>
            {currentQuestion.data.options?.map((opt) => (
              <option key={opt.id} value={opt.id.toString()}>
                {opt.value}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={currentQuestion.data.questionType}
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            className="text-gray-800 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu respuesta..."
            autoFocus
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={!answer}
          className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
            answer
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Enviar Respuesta
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;
