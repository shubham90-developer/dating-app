import { z } from "zod";

export const startConversationSchema = z.object({
  otherProfileId: z.string().min(1, "otherProfileId is required"),
});

export const notifyMessageSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
  otherProfileId: z.string().min(1, "otherProfileId is required"),
  text: z.string().min(1, "text is required").max(500, "text is too long"),
});
