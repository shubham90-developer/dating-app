import mongoose, { Schema } from "mongoose";
import { IGeneralSettings } from "./general-settings.interface";

const GeneralSettingsSchema: Schema = new Schema(
  {
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },

    mobileNo: { type: String, default: "" },
    alternateMobileNo: { type: String, default: "" },

    mail: { type: String, default: "" },
    alternateEmail: { type: String, default: "" },

    address: { type: String, default: "" },
    addressIframe: { type: String, default: "" },
    workingHrs: { type: String, default: "" },

    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },
    whatsApp: { type: String, default: "" },

    homeIntroVideo: { type: String, default: "" },
    homeSlidingTitle: { type: String, default: "" },

    footerCopyrights: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.password;
        delete ret.__v;

        if (ret.createdAt) {
          ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }

        if (ret.updatedAt) {
          ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }

        return ret;
      },
    },
  },
);

export const GeneralSettings = mongoose.model<IGeneralSettings>(
  "GeneralSettings",
  GeneralSettingsSchema,
);
