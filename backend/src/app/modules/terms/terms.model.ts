import mongoose, { Schema } from "mongoose";
import { ITerms } from "./terms.interface";

const termsSchema: Schema = new Schema(
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

export const Terms = mongoose.model<ITerms>("Terms", termsSchema);
