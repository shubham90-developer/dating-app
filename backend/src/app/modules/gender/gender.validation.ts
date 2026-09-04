import z from "zod";

export const genderSchema = z.object({
  gender: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
