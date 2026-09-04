import { z } from "zod";

export const startCallSchema = z.object({
  calleeId: z.string().min(1, "calleeId is required"),
  type: z.enum(["audio", "video"]),
});

export const tokenSchema = z.object({
  channelName: z.string().min(1, "channelName is required"),
});
