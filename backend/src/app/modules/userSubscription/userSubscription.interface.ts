import { Document, Types } from "mongoose";

export type SubscriptionStatus =
  | "created"
  | "authenticated"
  | "active"
  | "charged"
  | "cancelled"
  | "failed";

export interface IUserSubscription extends Document {
  razorpayPaymentId?: string;
  paymentMethod?: string;
  profile?: Types.ObjectId;
  firebaseUid: string;
  phone: string;
  subscriptionPlan: Types.ObjectId;
  razorpayPlanId: string;
  razorpaySubscriptionId: string;
  invoiceId?: string;
  amount: number;
  authAmount: number;
  startAt: Date;
  currentPeriodEnd?: Date;
  status: SubscriptionStatus;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
