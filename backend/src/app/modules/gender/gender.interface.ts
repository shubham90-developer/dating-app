import { Document } from "mongoose";

export interface IGender extends Document {
  gender: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
