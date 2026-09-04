import { Document } from "mongoose";

export interface ISubscription extends Document {
  backgroundVideo: string;
  mainTitle: string;
  highlightText: string;
  planName: string;
  trialPrice: string;
  trialText: string;
  trialDuration: string;
  priceAfterTrial: string;
  afterTrialText: string;
  appName: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
