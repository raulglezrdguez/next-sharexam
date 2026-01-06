"use client";

import { useCallback, useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { DiagramOutput } from "@/lib/types/diagram";
import DiagramData from "./DiagramData";
import DiagramCreate from "./DiagramCreate";

const Diagrams = () => {
  const [publicDiagrams, setPublicDiagrams] = useState<boolean>(false);
  const [diagrams, setDiagrams] = useState<DiagramOutput[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const response = await fetch(`/api/diagrams?public=${publicDiagrams}`);
        if (response.ok) {
          const { diagrams } = await response.json();
          setDiagrams(diagrams);
        } else {
          console.error("Error fetching diagrams");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDiagrams();
  }, [publicDiagrams]);

  const handleCheckedChange = (value: boolean) => {
    setPublicDiagrams(value);
  };

  const refreshDiagrams = useCallback(async () => {
    try {
      const response = await fetch(`/api/diagrams?public=${publicDiagrams}`);
      if (response.ok) {
        const { diagrams } = await response.json();
        setDiagrams(diagrams);
      } else {
        console.error("Error fetching diagrams");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [publicDiagrams]);

  return (
    <div className="flex flex-col items-start justify-center align-middle">
      <div className="flex items-center">
        <label
          className="pr-3.75 text-[15px] leading-none text-gray-200"
          htmlFor="public-diagrams"
        >
          {publicDiagrams ? "Public diagrams" : "My diagrams"}
        </label>
        <Switch.Root
          className="relative h-6.25 w-10.5 cursor-default rounded-full bg-gray-600 shadow-[0_2px_10px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
          id="public-diagrams"
          onCheckedChange={handleCheckedChange}
          checked={publicDiagrams}
        >
          <Switch.Thumb className="block size-5.25 translate-x-0.5 rounded-full bg-gray-200 data-[state=checked]:bg-green-600 shadow-[0_2px_2px] shadow-gray-600 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4.75" />
        </Switch.Root>
      </div>

      {!publicDiagrams && <DiagramCreate />}

      {diagrams && diagrams.length !== 0 && (
        <div className="mt-4 flex flex-col justify-start items-start align-middle">
          {diagrams.map((diagram: DiagramOutput) => (
            <DiagramData
              key={diagram._id}
              diagram={diagram}
              refresh={refreshDiagrams}
              editId={editId}
              setEditId={setEditId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Diagrams;
