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
      <h2 className="max-w-40 text-sm truncate">{diagram.title}</h2>
      <button
        onClick={() => setStatus("edit")}
        className="btn btn-secondary btn-sm"
      >
        <Edit2 size={14} />
      </button>
    </div>
  );
};

export default DiagramData;
