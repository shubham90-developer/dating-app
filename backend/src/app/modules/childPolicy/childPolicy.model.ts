import mongoose, { Schema } from "mongoose";
import { IChildPolicy } from "./childPolicy.interface";

const childPolicySchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
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

export const ChildPolicy = mongoose.model<IChildPolicy>(
  "ChildPolicy",
  childPolicySchema,
);
