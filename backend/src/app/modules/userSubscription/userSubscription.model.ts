import mongoose, { Schema } from "mongoose";
import { IUserSubscription } from "./userSubscription.interface";

const userSubscriptionSchema: Schema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "ProfilesModel",
      required: false,
    },
    firebaseUid: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    cancelledAt: { type: Date },
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    invoiceId: { type: String },
    razorpayPlanId: { type: String, required: true },
    razorpaySubscriptionId: { type: String, required: true },
    amount: { type: Number, required: true },
    authAmount: { type: Number, required: true },
    startAt: { type: Date, required: true },
    currentPeriodEnd: { type: Date },
    status: {
      type: String,
      enum: [
        "created",
        "authenticated",
        "active",
        "charged",
        "cancelled",
        "failed",
      ],
      default: "created",
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

export const UserSubscription = mongoose.model<IUserSubscription>(
  "UserSubscription",
  userSubscriptionSchema,
);
