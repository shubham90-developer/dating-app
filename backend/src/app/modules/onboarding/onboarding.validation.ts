import { z } from "zod";

export const onboardingSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  subTitle: z.string().optional(),
  img: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
