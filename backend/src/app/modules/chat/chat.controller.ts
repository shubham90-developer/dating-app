import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { appError } from "../../errors/appError";
import { ProfilesModel } from "../profiles/profiles.model";
import initializeFirebaseAdmin from "../../config/firebase-admin";
import {
  startConversationSchema,
  notifyMessageSchema,
} from "./chat.validation";

export const startConversation = catchAsync(async (req: any, res: Response) => {
  const parsed = startConversationSchema.parse(req.body);
  const me = req.profile;

  if (!me) throw new appError("No profile found for this account", 404);

  const other = await ProfilesModel.findById(parsed.otherProfileId);
  if (!other) throw new appError("Profile not found", 404);

  const meId = String(me._id);
  const otherId = String(other._id);
  if (meId === otherId)
    throw new appError("Cannot start a conversation with yourself", 400);

  const myBlocked: string[] = (me.blockedProfiles || []).map(String);
  const theirBlocked: string[] = (other.blockedProfiles || []).map(String);
  const isBlocked = myBlocked.includes(otherId) || theirBlocked.includes(meId);

  if (isBlocked) throw new appError("Unable to start this conversation", 403);
  if (!me.firebaseUid || !other.firebaseUid) {
    throw new appError("Both profiles must be Firebase-verified to chat", 400);
  }

  const ids = [meId, otherId].sort();
  const conversationId = `${ids[0]}_${ids[1]}`;

  const admin = initializeFirebaseAdmin();
  const db = admin.firestore();
  const ref = db.collection("conversations").doc(conversationId);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      participants: ids,
      participantFirebaseUids: [me.firebaseUid, other.firebaseUid],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessage: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Conversation ready",
    data: { conversationId },
  });
});

export const notifyNewMessage = catchAsync(async (req: any, res: Response) => {
  const parsed = notifyMessageSchema.parse(req.body);
  const me = req.profile;

  const other = await ProfilesModel.findById(parsed.otherProfileId);
  if (!other?.fcmToken) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "No device token on file, notification skipped",
      data: null,
    });
  }

  const admin = initializeFirebaseAdmin();
  await admin.messaging().send({
    token: other.fcmToken,
    notification: {
      title: me?.firstName || "New message",
      body: parsed.text,
    },
    data: { conversationId: parsed.conversationId, type: "chat_message" },
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Notification sent",
    data: null,
  });
});
