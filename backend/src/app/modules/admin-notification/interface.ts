import { Types } from "mongoose";

export interface IAdminNotification {
  type: string;
  title: string;
  message: string;
  profile?: Types.ObjectId;
  isRead: boolean;
}
