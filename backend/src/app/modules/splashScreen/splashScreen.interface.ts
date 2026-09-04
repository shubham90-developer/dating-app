import { Document } from "mongoose";

export interface ISplashScreen extends Document {
  splashImg: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
