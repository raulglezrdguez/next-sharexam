"use client";

import { useState } from "react";
import { useCreateUser } from "@/lib/hooks/useUsers";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUserMutation.mutateAsync({
        name,
        email,
        role: 1,
        status: 1,
      });

      // Reset form on success
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
      <div>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 text-black"
          required
        />
      </div>

      <div className="m-4 p-4">
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="email@test.com"
          className="border p-2 text-black border-amber-50 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-secondary"
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? "Saving..." : "Save user"}
      </button>

      {createUserMutation.isSuccess && (
        <p className="text-green-500 text-center">User created successfully!</p>
      )}
      {createUserMutation.isError && (
        <p className="text-red-500 text-center">Error creating user</p>
      )}
    </form>
  );
}
