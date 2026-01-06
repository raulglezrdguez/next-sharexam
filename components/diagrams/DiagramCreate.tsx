'use client";';

import * as Switch from "@radix-ui/react-switch";
import { Loader2, PlusSquare, Save, X } from "lucide-react";
import { useState } from "react";
import { useCreateDiagram } from "../../lib/hooks/useDiagrams";
import { CreateDiagramValidationSchema } from "../../lib/validations/diagram.validation";
import { toast } from "sonner";

const DiagramCreate = () => {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const createDiagramMutation = useCreateDiagram();

  const handleCreateDiagram = async () => {
    // Clear previous errors
    setValidationErrors({});

    // Validate form data
    const validationResult = CreateDiagramValidationSchema.safeParse({
      title,
      description,
      public: isPublic,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as string] = error.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await createDiagramMutation.mutateAsync({
        title,
        description,
        public: isPublic,
        author: "", // This will be set by the API
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      });

      setTitle("");
      setDescription("");
      setIsPublic(false);

      toast.success("Diagram created successfully!");
    } catch (error) {
      toast.error("Error creating diagram");
      console.error("Error creating diagram:", error);
    }
  };

  if (creating) {
    return (
      <div className="mt-4 flex flex-col gap-4 align-middle justify-center items-start border rounded-sm px-4 py-2 w-full">
        <h2 className="text-lg font-semibold text-gray-100">New diagram</h2>
        <label
          htmlFor={`create-diagram-title`}
          className="hover:cursor-pointer"
        >
          <p className="block text-gray-400 text-sm m-2">Title:</p>
          <input
            id={`create-diagram-title`}
            name="title"
            type="text"
            placeholder="title..."
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationErrors.title) {
                setValidationErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full"
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm">{validationErrors.title}</p>
          )}
        </label>
        <label
          htmlFor={`create-diagram-description`}
          className="hover:cursor-pointer"
        >
          <p className="block text-gray-400 text-sm m-2">Description:</p>
          <textarea
            id={`create-diagram-description`}
            name="description"
            placeholder="description..."
            cols={20}
            rows={5}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationErrors.description) {
                setValidationErrors((prev) => ({
                  ...prev,
                  description: undefined,
                }));
              }
            }}
            className="text-sm text-gray-200 focus:ring-gray-500 border-gray-300 rounded p-2 w-full resize"
          />
          {validationErrors.description && (
            <p className="text-red-500 text-sm">
              {validationErrors.description}
            </p>
          )}
        </label>
        <div className="mt-2 w-full flex flex-row justify-start align-middle items-start gap-4">
          <label
            className=" text-gray-200"
            htmlFor={`create-diagram-public-diagram`}
          >
            {isPublic ? "Public" : "Private"}
          </label>
          <Switch.Root
            className="relative h-6.25 w-10.5 cursor-default rounded-full bg-gray-600 shadow-[0_2px_10px] shadow-gray-300 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
            id={`create-diagram-public-diagram`}
            onCheckedChange={(value) => setIsPublic(value)}
            checked={isPublic}
          >
            <Switch.Thumb className="block size-5.25 translate-x-0.5 rounded-full bg-gray-200 data-[state=checked]:bg-green-600 shadow-[0_2px_2px] shadow-gray-600 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4.75" />
          </Switch.Root>
        </div>

        <div className="w-full flex flex-row items-center justify-around align-middle">
          <button
            onClick={handleCreateDiagram}
            disabled={createDiagramMutation.isPending}
            className="btn btn-primary"
          >
            {createDiagramMutation.isPending ? (
              <Loader2 size={14} />
            ) : (
              <Save size={14} />
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCreating(false);
              setValidationErrors({});
            }}
            disabled={createDiagramMutation.isPending}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="mt-4 btn btn-success"
      onClick={() => {
        setCreating(true);
        setValidationErrors({});
      }}
    >
      <PlusSquare className="w-6 h-6" />
    </button>
  );
};

export default DiagramCreate;
