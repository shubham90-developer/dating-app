import mongoose, { Schema } from "mongoose";
import { IUsers } from "./users.interface";

const usersSchema: Schema = new Schema(
  {
    profileImages: [
      {
        type: String,
        required: true,
      },
    ],

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    nickName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    haveMeetingPlace: {
      type: Boolean,
      default: false,
    },

    position: {
      type: Schema.Types.ObjectId,
      ref: "PositionModel",
      required: true,
    },

    gender: {
      type: Schema.Types.ObjectId,
      ref: "GenderModel",
      required: true,
    },

    sexualOrientation: {
      type: Schema.Types.ObjectId,
      ref: "SexualOrientation",
      required: true,
    },

    lookingFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Interest",
      },
    ],

    bio: {
      type: String,
      trim: true,
      default: "",
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

export const Users = mongoose.model<IUsers>("Users", usersSchema);
