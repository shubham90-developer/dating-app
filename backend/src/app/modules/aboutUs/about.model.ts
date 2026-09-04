import mongoose, { Schema } from "mongoose";
import { IAboutUs } from "./about.interface";

const aboutUsSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
    },
    shortDesc: {
      type: String,
      required: true,
      trim: true,
    },
    mission: {
      type: String,
      required: true,
      trim: true,
    },
    vision: {
      type: String,
      required: true,
      trim: true,
    },
    img1: {
      type: String,
    },
    img2: {
      type: String,
    },
    sta: {
      type: String,
      trim: true,
    },
    founderImg: {
      type: String,
    },
    founderName: {
      type: String,
    },
    founderDesignation: {
      type: String,
      trim: true,
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

export const AboutUs = mongoose.model<IAboutUs>("AboutUs", aboutUsSchema);
