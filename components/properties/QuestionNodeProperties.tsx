"use client";

import {
  QUESTION_TYPES,
  QuestionNodeData,
  QuestionOption,
  QuestionType,
} from "@/types/flow";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Save, XCircle, Check } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

type Props = { data: QuestionNodeData | null; id: string };

const QuestionNodeProperties = ({ data, id }: Props) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const [nodeId, setNodeId] = useState<string>(id || "");
  const [question, setQuestion] = useState<string>(data?.question || "");
  const [questionType, setQuestionType] = useState<string>(
    data?.questionType || ""
  );
  const [options, setOptions] = useState<QuestionOption[]>(data?.options || []);
  const [newId, setNewId] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setQuestion(data?.question || "");
      setQuestionType(data?.questionType || "");
      setOptions(data?.options || []);
    };
    if (data) update();
  }, [data]);

  if (!data) return null;

  const handleSave = () => {
    updateNodeData(id, nodeId, { question, questionType, options });
  };

  const setOption = (id: string, newId: string, newValue: string) => {
    const opts = options.map((opt) => {
      if (opt.id === id) {
        opt.id = newId;
        opt.value = newValue;
      }
      return opt;
    });

    setOptions(opts);
  };

  const removeOption = (id: string) => {
    const opts = options.filter((opt) => opt.id !== id);
    setOptions(opts);
  };

  const addOption = () => {
    if (!newId || !newValue) return;
    setOptions([...options, { id: newId, value: newValue }]);
    setNewId("");
    setNewValue("");
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-200">Question Node</h2>
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
      <label htmlFor="question" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Question:</p>
        <input
          id="question"
          name="question"
          type="text"
          placeholder="question..."
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>

      <label htmlFor="questionType" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Question type:</p>
        <select
          id={"questionType"}
          name={"questionType"}
          value={questionType || ""}
          onChange={(e) => setQuestionType(e.target.value as QuestionType)}
          className="w-full text-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {QUESTION_TYPES.map((qt) => (
            <option key={qt} value={qt}>
              {qt}
            </option>
          ))}
        </select>
      </label>

      {questionType === "select" && (
        <>
          <h2 className="text-gray-400">Options</h2>
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex flex-row justify-center align-middle items-center mt-2"
            >
              <input
                id={opt.id}
                name={opt.id}
                type="text"
                placeholder="id..."
                required
                value={opt.id}
                onChange={(e) => setOption(opt.id, e.target.value, opt.value)}
                className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 max-w-12"
                autoFocus
              />
              <input
                id={opt.value}
                name={opt.value}
                type="text"
                placeholder="value..."
                required
                value={opt.value}
                onChange={(e) => setOption(opt.id, opt.id, e.target.value)}
                className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
              />
              <Button
                variant={"outline"}
                onClick={() => removeOption(opt.id)}
                className="hover:cursor-pointer ml-2 text-red-400 hover:text-red-200 transition-colors duration-300 ease-in-out"
              >
                <XCircle size={14} />
              </Button>
            </div>
          ))}
          <div className="flex flex-row justify-center align-middle items-center mt-2">
            <input
              id={"newId"}
              name={"newId"}
              type="text"
              placeholder="id..."
              required
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 max-w-12"
              autoFocus
            />
            <input
              id={"newValue"}
              name={"newValue"}
              type="text"
              placeholder="value..."
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
            />
            <Button
              variant={"outline"}
              onClick={addOption}
              className="hover:cursor-pointer ml-2 text-green-400 hover:text-green-200 transition-colors duration-300 ease-in-out"
            >
              <Check size={14} />
            </Button>
          </div>
        </>
      )}

      <Button
        variant={"outline"}
        onClick={handleSave}
        className="w-24 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer mt-4 transition-colors duration-300 ease-in-out"
      >
        <Save size={14} />
      </Button>
    </div>
  );
};

export default QuestionNodeProperties;
