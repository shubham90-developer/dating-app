import { Document } from "mongoose";

export interface IPrivacyPolicy extends Document {
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
