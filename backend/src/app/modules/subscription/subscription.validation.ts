import z from "zod";

export const subscriptionSchema = z.object({
  backgroundVideo: z.string().optional(),
  mainTitle: z.string().optional(),
  highlightText: z.string().optional(),
  planName: z.string().optional(),
  trialPrice: z.string().optional(),
  trialText: z.string().optional(),
  trialDuration: z.string().optional(),
  priceAfterTrial: z.string().optional(),
  afterTrialText: z.string().optional(),
  appName: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
