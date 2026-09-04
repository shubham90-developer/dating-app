import mongoose, { Schema } from "mongoose";
import { ICall } from "./call.interface";

const callSchema: Schema = new Schema(
  {
    callerId: { type: Schema.Types.ObjectId, ref: "Profiles", required: true },
    calleeId: { type: Schema.Types.ObjectId, ref: "Profiles", required: true },
    channelName: { type: String, required: true, unique: true },
    type: { type: String, enum: ["audio", "video"], required: true },
    status: {
      type: String,
      enum: ["ringing", "ongoing", "ended", "rejected", "cancelled", "missed"],
      default: "ringing",
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number, default: 0 },
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

export const CallsModel = mongoose.model<ICall>("Calls", callSchema);
