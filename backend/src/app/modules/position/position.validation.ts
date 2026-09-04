import z from "zod";

export const positionSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
