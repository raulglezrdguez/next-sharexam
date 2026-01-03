import { z } from "zod";

export const CreateDiagramValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long (max 100 characters)"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long (max 500 characters)"),
  public: z.boolean().optional(),
});

export const UpdateDiagramValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long (max 100 characters)")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long (max 500 characters)")
    .optional(),
  public: z.boolean().optional(),
});
