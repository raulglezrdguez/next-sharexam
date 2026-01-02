"use client";

import {
  HTTP_METHODS,
  HttpMethod,
  HttpNodeData,
  RESPONSE_TYPES,
} from "@/types/flow";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Save } from "lucide-react";
import { useFlowStore } from "@/store/flowStore";

type Props = { data: HttpNodeData | null; id: string };

const HttpNodeProperties = ({ data, id }: Props) => {
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const [nodeId, setNodeId] = useState<string>(id || "");
  const [endpoint, setEndpoint] = useState<string>(data?.endpoint || "");
  const [method, setMethod] = useState<string>(data?.method || "");
  const [responseType, setResponseType] = useState<string>(
    data?.responseType || ""
  );

  useEffect(() => {
    const update = () => {
      setEndpoint(data?.endpoint || "");
      setMethod(data?.method || "");
      setResponseType(data?.responseType || "");
    };
    if (data) update();
  }, [data]);

  if (!data) return null;

  const handleSave = () => {
    updateNodeData(id, nodeId, { endpoint, method, responseType });
  };

  return (
    <div className="flex flex-col border rounded-2xl px-4 py-2">
      <h2 className="text-gray-200">HTTP Node</h2>
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
      <label htmlFor="endpoint" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Endpoint:</p>
        <input
          id="endpoint"
          name="endpoint"
          type="text"
          placeholder="endpoint..."
          required
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
        />
      </label>

      <label htmlFor="method" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Method:</p>
        <select
          id={"method"}
          name={"method"}
          value={method || "GET"}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {HTTP_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="responseType" className="hover:cursor-pointer">
        <p className="block text-gray-400 text-sm m-2">Response type:</p>
        <select
          id={"responseType"}
          name={"responseType"}
          value={responseType || "json"}
          onChange={(e) => setResponseType(e.target.value as ResponseType)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {RESPONSE_TYPES.map((rt) => (
            <option key={rt} value={rt}>
              {rt}
            </option>
          ))}
        </select>
      </label>

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

export default HttpNodeProperties;
