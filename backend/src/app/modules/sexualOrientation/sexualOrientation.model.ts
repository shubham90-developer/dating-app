import mongoose, { Schema } from "mongoose";
import { ISexualOrientation } from "./sexualOrientation.interface";

const sexualOrientationSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

export const SexualOrientation = mongoose.model<ISexualOrientation>(
  "SexualOrientation",
  sexualOrientationSchema,
);
