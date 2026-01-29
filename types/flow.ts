import { Node, Edge } from "@xyflow/react";

export type MyNodeType =
  | "input"
  | "question"
  | "http-request"
  | "gemini-info"
  | "gemini"
  | "puter"
  | "output";
export type NodeStatus = "idle" | "running" | "executed" | "error";
export const QUESTION_TYPES = ["text", "select", "number"];
export type QuestionType = (typeof QUESTION_TYPES)[number];
export type QuestionOption = { id: string; value: string };
export const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash-lite",
] as const;
export const PUTER_MODELS = [
  "gpt-5-nano",
  "claude-sonnet-4-5",
  "deepseek/deepseek-v3.2",
  "openai/gpt-5.2-codex",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b:free",
  "gemini-3-flash-preview",
  "x-ai/grok-4.1-fast",
  "prime-intellect/intellect-3",
  "meta-llama/llama-4-maverick",
  "meta-llama/llama-4-maverick:free",
  "amazon/nova-2-lite-v1",
  "microsoft/phi-4",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "gpt-4.1-nano",
  "claude-sonnet-4",
  "google/gemini-2.5-flash",
  "mistralai/mistral-large-2512",
  "google/gemini-2.5-pro",
  "cohere/command-r-plus-08-2024",
  "qwen/qwq-32b",
  "kwaipilot/kat-coder-pro:free",
  "perplexity/sonar",
  "moonshotai/kimi-k2.5",
  "moonshotai/kimi-k2:free",
  "z-ai/glm-4.7",
  "bytedance-seed/seed-1.6-flash",
];
export type GeminiModel = (typeof GEMINI_MODELS)[number];
export type PuterModel = (typeof PUTER_MODELS)[number];
interface MyNodeDataRoot extends Record<string, unknown> {
  label: string;
}

export interface QuestionNodeData extends MyNodeDataRoot {
  question: string;
  valid: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  status?: NodeStatus;
}

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];
export const RESPONSE_TYPES = ["json", "text"];
export type HttpMethod = (typeof HTTP_METHODS)[number];
export type ResponseType = (typeof RESPONSE_TYPES)[number];
export interface HttpNodeData extends MyNodeDataRoot {
  endpoint: string;
  method: HttpMethod;
  responseType: ResponseType;
  status?: NodeStatus;
  response?: unknown;
}

export interface GeminiInfoNodeData extends MyNodeDataRoot {
  apiKey?: string;
  status?: NodeStatus;
}

export interface GeminiNodeData extends MyNodeDataRoot {
  prompt: string;
  model: GeminiModel;
  temperature?: number;
  status?: NodeStatus;
  response?: unknown;
}

export interface PuterNodeData extends MyNodeDataRoot {
  prompt: string;
  model: PuterModel;
  status?: NodeStatus;
  response?: unknown;
}

export interface InputNodeData extends MyNodeDataRoot {
  status?: NodeStatus;
}

export interface OutputNodeData extends MyNodeDataRoot {
  status?: NodeStatus;
  result: unknown;
}

export type MyNode =
  | Node<InputNodeData, "input">
  | Node<QuestionNodeData, "question">
  | Node<HttpNodeData, "http-request">
  | Node<GeminiInfoNodeData, "gemini-info">
  | Node<GeminiNodeData, "gemini">
  | Node<PuterNodeData, "puter">
  | Node<OutputNodeData, "output">;

export interface MyEdge extends Edge {
  data?: {
    condition?: string; // expresión JS: "answers['nodo1'] === 'si'"
  };
}
