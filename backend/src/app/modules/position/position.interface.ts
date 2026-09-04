import { Document } from "mongoose";

export interface IPosition extends Document {
  title: string;
  subTitle: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
