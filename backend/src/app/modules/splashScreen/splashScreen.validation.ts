import z from "zod";

export const splashScreenSchema = z.object({
  splashImg: z.string().optional(),
});
