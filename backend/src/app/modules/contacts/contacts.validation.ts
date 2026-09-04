import z from "zod";

export const contactSchema = z.object({
  fullName: z.string().optional(),
  emailAddress: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updatecontactSchema = z.object({
  fullName: z.string().optional(),
  emailAddress: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
