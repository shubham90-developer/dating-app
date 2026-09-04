import { Document } from "mongoose";

export interface IFaq extends Document {
  qustion: string;
  answer: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
