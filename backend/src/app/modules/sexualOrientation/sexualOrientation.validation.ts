import z from "zod";

export const sexualOrientationSchema = z.object({
  title: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
