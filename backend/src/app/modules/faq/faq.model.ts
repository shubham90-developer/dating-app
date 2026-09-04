import mongoose, { Schema } from "mongoose";
import { IFaq } from "./faq.interface";

const faqSchema: Schema = new Schema(
  {
    qustion: {
      type: String,
    },
    answer: {
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

export const FaqModel = mongoose.model<IFaq>("FaqModel", faqSchema);
