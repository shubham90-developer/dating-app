import { z } from "zod";

export const usersSchema = z.object({
  profileImages: z
    .array(z.string().url("Each profile image must be a valid URL"))
    .min(1, "At least one profile image is required"),

  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  nickName: z.string().trim().min(1, "Nickname is required"),

  dateOfBirth: z.coerce.date(),

  haveMeetingPlace: z.boolean(),

  position: z.string().min(1, "Position is required"),

  gender: z.string().min(1, "Gender is required"),

  sexualOrientation: z.string().min(1, "Sexual orientation is required"),

  lookingFor: z.array(z.string()).min(1, "Select at least one option"),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .default(""),

  isDeleted: z.boolean().optional(),
});
