import { Document } from "mongoose";

export interface IOnboarding extends Document {
  title: string;
  subTitle: string;
  img: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
