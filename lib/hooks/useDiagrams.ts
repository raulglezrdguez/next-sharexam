import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateDiagramInput,
  UpdateDiagramInput,
  DiagramOutput,
  DiagramListOutput,
} from "@/lib/types/diagram";

export function useDiagrams(author?: string, publicOnly = false) {
  return useQuery({
    queryKey: ["diagrams", { author, publicOnly }],
    queryFn: async (): Promise<DiagramListOutput> => {
      const params = new URLSearchParams();
      if (author) params.append("author", author);
      if (publicOnly) params.append("public", "true");

      const response = await fetch(`/api/diagrams?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diagrams");
      }
      return response.json();
    },
  });
}

export function useDiagram(id: string) {
  return useQuery({
    queryKey: ["diagram", id],
    queryFn: async (): Promise<DiagramOutput> => {
      const response = await fetch(`/api/diagrams/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diagram");
      }
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateDiagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      diagramData: CreateDiagramInput
    ): Promise<DiagramOutput> => {
      const response = await fetch("/api/diagrams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagramData),
      });
      if (!response.ok) {
        throw new Error("Failed to create diagram");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagrams"] });
    },
  });
}

export function useUpdateDiagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDiagramInput;
    }): Promise<DiagramOutput> => {
      const response = await fetch(`/api/diagrams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update diagram");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["diagrams"] });
      queryClient.invalidateQueries({ queryKey: ["diagram", variables.id] });
    },
  });
}

export function useDeleteDiagram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/diagrams/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete diagram");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagrams"] });
    },
  });
}
