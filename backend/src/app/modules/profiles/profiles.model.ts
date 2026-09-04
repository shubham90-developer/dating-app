// profiles.model.ts
import mongoose, { Schema } from "mongoose";
import { IProfiles } from "./profiles.interface";

const photoSchema: Schema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

const profilesSchema: Schema = new Schema(
  {
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    photos: {
      type: [photoSchema],
      default: [],
    },

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

    birthday: {
      type: Date,
      required: true,
    },

    placeToMeet: {
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
    firebaseUid: {
      type: String,
      index: true,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },

    sexOrientation: {
      type: Schema.Types.ObjectId,
      ref: "SexualOrientation",
      required: true,
    },

    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "ProfilesModel",
      default: [],
    },

    interest: {
      type: String,
      trim: true,
      default: "",
    },

    looking: {
      type: Schema.Types.ObjectId,
      ref: "Interest",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isBlocked: { type: Boolean, default: false },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    weight: {
      type: String,
      default: "",
    },
    likedProfiles: {
      type: [Schema.Types.ObjectId],
      ref: "ProfilesModel",
      default: [],
    },

    savedProfiles: {
      type: [Schema.Types.ObjectId],
      ref: "ProfilesModel",
      default: [],
    },
    blockedProfiles: {
      type: [Schema.Types.ObjectId],
      ref: "ProfilesModel",
      default: [],
    },
    reviews: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "ProfilesModel",
          required: true,
        },
        review: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    selfie: {
      type: String,
      default: "",
    },
    document: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      required: true,
      default: "",
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
profilesSchema.index({ location: "2dsphere" });
export const ProfilesModel = mongoose.model<IProfiles>(
  "ProfilesModel",
  profilesSchema,
);
