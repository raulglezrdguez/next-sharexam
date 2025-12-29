"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { UserValidationSchema } from "../validations/user.validation";

type FormState =
  | {
      success: boolean;
      errors: Partial<Record<"name" | "email" | "role" | "status", string[]>>;
      message?: never;
    }
  | {
      success: boolean;
      message: string;
      errors?: never;
    };

export async function createUser(_: FormState, formData: FormData) {
  const session = await auth();

  if (!session) {
    return { success: false, error: "User unauthenticated" };
  }

  await dbConnect();

  const validatedFields = UserValidationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: 1,
    status: 1,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const newUser = new User(validatedFields.data);
    await newUser.save();

    revalidatePath("/users");

    return { success: true, message: "User created" };
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === 11000) {
      return { success: false, errors: { email: ["Email exists"] } };
    }
    return { success: false, message: "Database error" };
  }
}
