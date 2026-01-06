import { z } from "zod";

const ResultValidationSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  reference: z.string().optional(),
});

const PositionValidationSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const MeasuredValidationSchema = z.object({
  width: z.number(),
  height: z.number(),
});

const NodeValidationSchema = z.object({
  id: z.string().min(1, "Node ID is required"),
  type: z.string().min(1, "Node type is required"),
  position: PositionValidationSchema,
  measured: MeasuredValidationSchema,
  data: z.record(z.string(), z.unknown()).optional(),
});

const EdgeValidationSchema = z.object({
  id: z.string().min(1, "Edge ID is required"),
  source: z.string().min(1, "Edge source is required"),
  target: z.string().min(1, "Edge target is required"),
  type: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const ViewportValidationSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  zoom: z.number().optional(),
});

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
  result: ResultValidationSchema.array().optional(),
  nodes: NodeValidationSchema.array().optional(),
  edges: EdgeValidationSchema.array().optional(),
  viewport: ViewportValidationSchema.optional(),
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
  result: ResultValidationSchema.array().optional(),
  nodes: NodeValidationSchema.array().optional(),
  edges: EdgeValidationSchema.array().optional(),
  viewport: ViewportValidationSchema.optional(),
});
