import { Document, Types } from "mongoose";

export interface ILike extends Document {
  liker: Types.ObjectId;
  likedProfile: Types.ObjectId;
  createdAt: Date;
}
