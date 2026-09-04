import z from "zod";

export const termsSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updateTermsSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
