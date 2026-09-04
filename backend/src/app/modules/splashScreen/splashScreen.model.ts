import mongoose, { Schema } from "mongoose";

const splashScreenSchema: Schema = new Schema(
  {
    splashImg: {
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

export const SplashScreen = mongoose.model("SplashScreen", splashScreenSchema);
