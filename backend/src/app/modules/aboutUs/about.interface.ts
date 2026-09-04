import { Document } from "mongoose";

export interface IAboutUs extends Document {
  title: string;
  subTitle: string;
  shortDesc: string;
  mission: string;
  vision: string;
  img1: string;
  img2: string;
  sta: string;
  founderImg: string;
  founderName: string;
  founderDesignation: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
