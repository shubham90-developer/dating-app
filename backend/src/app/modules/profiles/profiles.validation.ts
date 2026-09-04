// profiles.validation.ts
import { z } from "zod";

// International phone validation: digits only, 7-15 digits (E.164 without '+')
const internationalPhoneRegex = /^\d{7,15}$/;

const validatePhone = (phone: string) => {
  const cleanedPhone = phone.replace(/[\s\-\+]/g, "").trim();
  return internationalPhoneRegex.test(cleanedPhone);
};

const photoSchema = z.object({
  image: z.string().url("Each photo must be a valid URL"),
});

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = z.string().regex(objectIdRegex, "Invalid id format");

export const profilesSchema = z.object({
  photos: z.array(photoSchema).min(1, "At least one photo is required"),

  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  nickName: z.string().trim().min(1, "Nickname is required"),
  location: z.object({
    type: z.literal("Point").default("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  birthday: z.coerce.date(),

  placeToMeet: z.boolean(),

  position: objectId,

  gender: objectId,

  sexOrientation: objectId,

  interest: z.string().trim().optional().default(""),

  looking: objectId,

  phone: z.string().refine(validatePhone, {
    message:
      "Invalid phone number. Please provide your full phone number with country code (digits only, 7-15 digits).",
  }),

  bio: z
    .string()
    .trim()
    .max(500, "Bio cannot exceed 500 characters")
    .optional()
    .default(""),

  height: z.string().trim().optional().default(""),

  weight: z.string().trim().optional().default(""),

  selfie: z.string().trim().optional().default(""),

  document: z.string().trim().optional().default(""),

  isVerified: z.boolean().optional().default(false),
  fcmToken: z.string("fcm token is required"),

  likedProfiles: z.array(objectId).optional().default([]),
  savedProfiles: z.array(objectId).optional().default([]),
  blockedProfiles: z.array(objectId).optional().default([]),
});

export const reviewSchema = z.object({
  review: z
    .string("Review is required")
    .trim()
    .min(1, "Review cannot be empty")
    .max(500, "Review must be under 500 characters"),
});
