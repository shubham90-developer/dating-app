import mongoose, { Schema } from "mongoose";
import { IPrivacyPolicy } from "./privacypolicy.interface";

const privacyPolicySchema: Schema = new Schema(
  {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        return ret;
      },
    },
  },
);

export const PrivacyPolicy = mongoose.model<IPrivacyPolicy>(
  "PrivacyPolicy",
  privacyPolicySchema,
);
