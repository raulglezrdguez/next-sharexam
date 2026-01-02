import { User } from "./user";

export type ResultInput = {
  label: string;
  value: string;
  reference?: string;
};

export type ResultOutput = {
  label: string;
  value: string;
  reference?: string;
};

export type DiagramNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  measured: {
    width: number;
    height: number;
  };
  data?: Record<string, unknown>;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
};

export type DiagramViewport = {
  x?: number;
  y?: number;
  zoom?: number;
};

export type CreateDiagramInput = {
  title: string;
  description: string;
  author: string;
  public?: boolean;
  result?: ResultInput[];
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  viewport?: DiagramViewport;
};

export type UpdateDiagramInput = {
  title?: string;
  description?: string;
  public?: boolean;
  result?: ResultInput[];
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  viewport?: DiagramViewport;
};

export type DiagramInput = {
  id: string;
  title: string;
  description: string;
  author: string;
  public: boolean;
  result?: ResultInput[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  viewport: DiagramViewport;
};

export type DiagramFilterInput = {
  author?: string;
  public?: boolean;
};

export type DiagramSortInput = {
  field: "createdAt" | "updatedAt" | "title";
  order: "asc" | "desc";
};

export type DiagramPaginationInput = {
  limit: number;
  offset: number;
};

export type DiagramQueryInput = {
  filter?: DiagramFilterInput;
  sort?: DiagramSortInput;
  pagination?: DiagramPaginationInput;
};

export type DiagramOutput = {
  id: string;
  _id: string;
  title: string;
  description: string;
  author: User;
  public: boolean;
  result: ResultOutput[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  viewport: DiagramViewport;
  createdAt: Date;
  updatedAt: Date;
};

export interface MyDiagramsResponse {
  myDiagrams: DiagramOutput[];
}

export interface PublicDiagramsResponse {
  publicDiagrams: DiagramOutput[];
}

export type DiagramListOutput = {
  diagrams: DiagramOutput[];
  totalCount: number;
};
