import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  _id: string;
  name: string;
  email: string;
  role: number;
  status: number;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Omit<User, "_id">) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
