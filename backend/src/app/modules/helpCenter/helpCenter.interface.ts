import { Document } from "mongoose";

export interface IHelpCenter extends Document {
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
