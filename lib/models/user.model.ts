// models/User.ts
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Number, required: true, default: 1 },
    status: { type: Number, required: true, default: 1 },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
