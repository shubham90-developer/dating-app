import z from "zod";

export const loginScreenSchema = z.object({
  loginImg: z.string().optional(),
});
