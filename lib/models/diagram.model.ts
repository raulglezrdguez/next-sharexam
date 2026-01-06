import mongoose, { Schema } from "mongoose";
import User from "./user.model";

const DiagramSchema = new Schema(
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
    nodes: {
      type: [{}],
      default: [],
      required: true,
    },
    edges: {
      type: [{}],
      default: [],
      required: true,
    },
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
  mongoose.model("Diagram", DiagramSchema);
