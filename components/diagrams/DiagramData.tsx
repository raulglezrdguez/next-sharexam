"use client";

import { DiagramOutput } from "@/lib/types/diagram";
import { Check, Edit2 } from "lucide-react";
import { useState } from "react";
import DiagramEdit from "./DiagramEdit";
import { Button } from "../ui/button";

type Props = { diagram: DiagramOutput; refresh: () => void };

const DiagramData = ({ diagram, refresh }: Props) => {
  const [status, setStatus] = useState<"show" | "edit">("show");

  if (status === "edit") {
    return (
      <DiagramEdit
        diagram={diagram}
        back={() => setStatus("show")}
        refresh={refresh}
      />
    );
  }

  return (
    <div className="flex flex-row justify-between items-center align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
      <Button
        variant={"outline"}
        onClick={() => {}}
        className="w-6 h-6 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
      >
        <Check size={14} />
      </Button>

      <h2>{diagram.title}</h2>
      <Button
        variant={"outline"}
        onClick={() => setStatus("edit")}
        className="w-6 h-6 self-center text-gray-200 hover:text-green-200 hover:cursor-pointer transition-colors duration-300 ease-in-out"
      >
        <Edit2 size={14} />
      </Button>
    </div>
  );
};

export default DiagramData;
