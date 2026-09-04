import { z } from "zod";

export const interestSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  icon: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
