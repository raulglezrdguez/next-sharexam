"use client";

import { PlusSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import { DiagramOutput } from "@/lib/types/diagram";
import DiagramData from "./DiagramData";

const Diagrams = () => {
  const [publicDiagrams, setPublicDiagrams] = useState<boolean>(false);
  const [diagrams, setDiagrams] = useState<DiagramOutput[]>([]);

  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const response = await fetch(`/api/diagrams?public=${publicDiagrams}`);
        if (response.ok) {
          const data = await response.json();
          setDiagrams(data);
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
        const data = await response.json();
        setDiagrams(data);
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
          className="pr-[15px] text-[15px] leading-none text-gray-200"
          htmlFor="public-diagrams"
        >
          {publicDiagrams ? "Public diagrams" : "My diagrams"}
        </label>
        <Switch.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-gray-600 shadow-[0_2px_10px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
          id="public-diagrams"
          onCheckedChange={handleCheckedChange}
          checked={publicDiagrams}
        >
          <Switch.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-gray-200 data-[state=checked]:bg-green-600 shadow-[0_2px_2px] shadow-gray-600 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      </div>

      {!publicDiagrams && (
        <button className="mt-2 hover:cursor-pointer">
          <PlusSquare className="w-6 h-6" />
        </button>
      )}

      <div className="mt-4 flex flex-col justify-start items-start align-middle">
        {diagrams.map((diagram: DiagramOutput) => (
          <DiagramData
            key={diagram._id}
            diagram={diagram}
            refresh={refreshDiagrams}
          />
        ))}
      </div>
    </div>
  );
};

export default Diagrams;
