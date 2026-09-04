import z from "zod";

export const helpCenterSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
