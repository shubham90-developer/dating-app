import { Document } from "mongoose";

export interface IInterest extends Document {
  title: string;
  icon: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
