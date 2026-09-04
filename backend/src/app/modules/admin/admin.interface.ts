import { Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: "admin";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
