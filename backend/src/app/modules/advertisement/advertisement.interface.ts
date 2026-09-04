import { Document } from "mongoose";

export interface IAdvertisement extends Document {
  title: string;
  backgroundVideo: string;
  features: IUpgradeFeature[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpgradeFeature {
  icon: string;
  title: string;
  description: string;
}
