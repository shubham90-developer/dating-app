import { z } from "zod";

export const generalSettingsValidation = z.object({
  logo: z.string().optional(),
  favicon: z.string().optional(),

  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),

  mail: z.string().email("Invalid email address").optional(),
  alternateEmail: z.string().email("Invalid email address").optional(),

  address: z.string().optional(),
  addressIframe: z.string().optional(),
  workingHrs: z.string().optional(),

  facebook: z.string().url("Invalid Facebook URL").optional(),
  instagram: z.string().url("Invalid Instagram URL").optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
  youtube: z.string().url("Invalid YouTube URL").optional(),
  whatsApp: z.string().optional(),

  homeIntroVideo: z.string().optional(),
  homeSlidingTitle: z.string().optional(),
  footerCopyrights: z.string().optional(),
});
