import { Document } from "mongoose";

export interface ILoginScreen extends Document {
  loginImg: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
