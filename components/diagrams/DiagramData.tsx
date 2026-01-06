"use client";

import { DiagramOutput } from "@/lib/types/diagram";
import { Edit2 } from "lucide-react";
import DiagramEdit from "./DiagramEdit";

type Props = {
  diagram: DiagramOutput;
  refresh: () => void;
  editId: string | null;
  setEditId: (id: string | null) => void;
};

const DiagramData = ({ diagram, refresh, editId, setEditId }: Props) => {
  if (editId === diagram._id) {
    return (
      <DiagramEdit
        diagram={diagram}
        back={() => setEditId(null)}
        refresh={refresh}
      />
    );
  }

  return (
    <div className="flex flex-row justify-between items-center align-middle gap-2 text-gray-200 mb-2 border rounded py-2 px-4">
      <h2 className="max-w-40 text-sm truncate">{diagram.title}</h2>
      <button
        onClick={() => setEditId(diagram._id)}
        className="btn btn-secondary btn-sm"
      >
        <Edit2 size={14} />
      </button>
    </div>
  );
};

export default DiagramData;
