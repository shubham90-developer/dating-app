import { Document } from "mongoose";

export interface IChildPolicy extends Document {
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
