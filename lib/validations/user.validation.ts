import { z } from "zod";

export const UserValidationSchema = z.object({
  name: z
    .string()
    .min(3, "Name too short (at less 3 characters)")
    .max(50, "Name too large"),
  email: z.email("Invalid email"),
  role: z
    .number()
    .min(0, "Admin role should be 0")
    .max(1, "User role should be 1"),
  status: z.number().min(0, "Inactive user should be 0"),
});
