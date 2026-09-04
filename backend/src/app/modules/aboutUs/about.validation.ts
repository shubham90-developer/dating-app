import z from "zod";

export const aboutUsSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  subTitle: z.string().min(2, "Title must be at least 2 characters long"),
  shortDesc: z.string().min(2, "Title must be at least 2 characters long"),
  mission: z.string().optional(),
  vision: z.string().optional(),
  img1: z.string().optional(),
  img2: z.string().optional(),
  sta: z.string().optional(),
  founderImg: z.string().optional(),
  founderName: z.string().optional(),
  founderDesignation: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const aboutUsUpdateSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  subTitle: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  shortDesc: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  img1: z.string().optional(),
  img2: z.string().optional(),
  sta: z.string().optional(),
  founderImg: z.string().optional(),
  founderName: z.string().optional(),
  founderDesignation: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
