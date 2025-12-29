"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/actions/user.actions";

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, {
    success: false,
    errors: { name: [], email: [], role: [], status: [] },
  });

  console.log(state);
  return (
    <form action={formAction} className="flex flex-col gap-4 w-64">
      <div>
        <input
          name="name"
          placeholder="Name"
          className="border p-2 text-black"
          required
        />
        {state?.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="email@test.com"
          className="border p-2 text-black"
          required
        />
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {isPending ? "Saving..." : "Save user"}
      </button>

      {state?.success && <p className="text-green-500 text-center">Ready!</p>}
    </form>
  );
}
