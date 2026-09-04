import mongoose, { Schema } from "mongoose";

const subscriptionSchema: Schema = new Schema(
  {
    backgroundVideo: {
      type: String,
    },
    mainTitle: {
      type: String,
    },
    highlightText: {
      type: String,
    },
    planName: {
      type: String,
    },
    trialPrice: {
      type: String,
    },
    trialText: {
      type: String,
    },
    trialDuration: {
      type: String,
    },
    priceAfterTrial: {
      type: String,
    },
    afterTrialText: {
      type: String,
    },
    appName: {
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

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
