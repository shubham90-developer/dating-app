import { Schema, model } from "mongoose";
import { IAdminNotification } from "./interface";

const adminNotificationSchema = new Schema<IAdminNotification>(
  {
    type: { type: String, default: "new_profile" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: "Profiles" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AdminNotification = model<IAdminNotification>(
  "AdminNotification",
  adminNotificationSchema,
);
