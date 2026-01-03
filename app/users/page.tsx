"use client";

import CreateUserForm from "@/components/CreateUserForm";
import { useUsers } from "@/lib/hooks/useUsers";

export default function Page() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error loading users</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users admin</h1>

      <CreateUserForm />
      <hr className="my-8" />

      <h2 className="text-xl mb-4">Users registered:</h2>
      {users?.map((u) => (
        <p key={u._id}>
          {u.name} - {u.email}
        </p>
      ))}
    </div>
  );
}
