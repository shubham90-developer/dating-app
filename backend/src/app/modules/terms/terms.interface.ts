import { Document } from "mongoose";

export interface ITerms extends Document {
  terms: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
