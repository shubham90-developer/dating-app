import z from "zod";

export const faqSchema = z.object({
  qustion: z.string().optional(),
  answer: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updateFaqSchema = z.object({
  qustion: z.string().optional(),
  answer: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
