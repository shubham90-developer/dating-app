import mongoose, { Schema } from "mongoose";
import { ILike } from "./like.interface";

const likeSchema: Schema = new Schema({
  liker: {
    type: Schema.Types.ObjectId,
    ref: "ProfilesModel",
    required: true,
  },
  likedProfile: {
    type: Schema.Types.ObjectId,
    ref: "ProfilesModel",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index: MongoDB automatically deletes this document 86400s (1 day)
    // after createdAt. No manual cleanup/scheduler needed.
    expires: 86400,
  },
});

// Prevent the same profile from spamming duplicate like docs for the same target
likeSchema.index({ liker: 1, likedProfile: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);
