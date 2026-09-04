import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IAdmin } from "./admin.interface";

const adminSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, default: "admin" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password as string, 10);
  next();
});

export const AdminModel = mongoose.model<IAdmin>("Admin", adminSchema);
