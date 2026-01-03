import mongoose, { Schema, Document } from "mongoose";

export interface IDiagram extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  public: boolean;
  result?: {
    label: string;
    value: string;
    reference?: string;
  }[];
  nodes: {
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
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    type?: string;
    data?: Record<string, unknown>;
  }[];
  viewport: {
    x?: number;
    y?: number;
    zoom?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DiagramSchema = new Schema<IDiagram>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
    result: [
      {
        label: String,
        value: String,
        reference: String,
      },
    ],
    nodes: [
      {
        id: String,
        type: String,
        position: {
          x: Number,
          y: Number,
        },
        measured: {
          width: Number,
          height: Number,
        },
        data: Schema.Types.Mixed,
      },
    ],
    edges: [
      {
        id: String,
        source: String,
        target: String,
        type: String,
        data: Schema.Types.Mixed,
      },
    ],
    viewport: {
      x: Number,
      y: Number,
      zoom: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Diagram ||
  mongoose.model<IDiagram>("Diagram", DiagramSchema);
