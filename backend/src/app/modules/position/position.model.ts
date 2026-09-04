import mongoose, { Schema } from "mongoose";
import { IPosition } from "./position.interface";

const positionSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    subTitle: {
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

export const PositionModel = mongoose.model<IPosition>(
  "PositionModel",
  positionSchema,
);
