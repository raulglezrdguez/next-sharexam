import { MyNode } from "@/types/flow";
import InputNodeProperties from "./InputNodeProperties";
import QuestionNodeProperties from "./QuestionNodeProperties";
import HttpNodeProperties from "./HttpNodeProperties";
import GeminiNodeProperties from "./GeminiNodeProperties";
import GeminiInfoNodeProperties from "./GeminiInfoNodeProperties";
import OutputNodeProperties from "./OutputNodeProperties";

type Props = { node: MyNode | null };

const NodeProperties = ({ node }: Props) => {
  if (node === null) return null;

  if (node.type === "input")
    return <InputNodeProperties id={node.id} data={node.data} />;
  if (node.type === "question")
    return <QuestionNodeProperties id={node.id} data={node.data} />;
  if (node.type === "http-request")
    return <HttpNodeProperties id={node.id} data={node.data} />;
  if (node.type === "gemini-info")
    return <GeminiInfoNodeProperties id={node.id} data={node.data} />;
  if (node.type === "gemini")
    return <GeminiNodeProperties id={node.id} data={node.data} />;
  if (node.type === "output")
    return <OutputNodeProperties id={node.id} data={node.data} />;

  return <div className="text-gray-200 text-sm">Node Properties</div>;
};

export default NodeProperties;
