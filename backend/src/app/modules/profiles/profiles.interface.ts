import { Types, Document } from "mongoose";

interface photos {
  id: string;
  image: string;
}

interface reviews {
  id: Types.ObjectId;
  review: string;
}

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IProfiles extends Document {
  phone: number;
  firebaseUid?: string;
  photos: photos[];
  firstName: string;
  lastName: string;
  nickName: string;
  birthday: Date;
  isBlocked: boolean;
  placeToMeet: boolean;
  position: Types.ObjectId;
  gender: Types.ObjectId;
  sexOrientation: Types.ObjectId;
  interest: string;
  location: ILocation;
  looking: Types.ObjectId;
  bio: string;
  likes: number;
  height: string;
  weight: string;
  likedProfiles: Types.ObjectId[];
  savedProfiles: Types.ObjectId[];
  blockedProfiles: Types.ObjectId[];
  likedBy: Types.ObjectId[];
  reviews: reviews[];
  selfie: string;
  document: string;
  isVerified: boolean;
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
