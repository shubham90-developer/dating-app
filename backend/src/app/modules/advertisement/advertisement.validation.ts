import { z } from "zod";

const featureSchema = z.object({
  icon: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const advertisementSchema = z.object({
  title: z.string().min(1),
  backgroundVideo: z.string(),
  features: z.array(featureSchema),
});
