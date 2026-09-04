import z from "zod";

export const privacyPolicySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updatePrivacyPolicySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
