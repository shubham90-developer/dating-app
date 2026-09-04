import z from "zod";

export const createUserSubscriptionSchema = z.object({
  body: z.object({
    subscriptionPlanId: z.string({ message: "subscriptionPlanId is required" }),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const verifyUserSubscriptionSchema = z.object({
  body: z.object({
    razorpay_payment_id: z.string({
      message: "razorpay_payment_id is required",
    }),
    razorpay_subscription_id: z.string({
      message: "razorpay_subscription_id is required",
    }),
    razorpay_signature: z.string({ message: "razorpay_signature is required" }),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
