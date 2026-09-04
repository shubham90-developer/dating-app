import { Document, Types } from "mongoose";

export type CallType = "audio" | "video";
export type CallStatus =
  | "ringing"
  | "ongoing"
  | "ended"
  | "rejected"
  | "cancelled"
  | "missed";

export interface ICall extends Document {
  callerId: Types.ObjectId;
  calleeId: Types.ObjectId;
  channelName: string;
  type: CallType;
  status: CallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStartCall {
  calleeId: string;
  type: CallType;
}
