import { Document } from "mongoose";

export interface ISexualOrientation extends Document {
  title: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
