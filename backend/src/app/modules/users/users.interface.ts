import { Document, Types } from "mongoose";

export interface IUsers extends Document {
  profileImages: string[];

  firstName: string;
  lastName: string;
  nickName: string;

  dateOfBirth: Date;

  haveMeetingPlace: boolean;

  position: Types.ObjectId;

  gender: Types.ObjectId;

  sexualOrientation: Types.ObjectId;

  lookingFor: Types.ObjectId[];

  bio: string;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
