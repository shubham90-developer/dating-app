import { Response } from "express";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { appError } from "../../errors/appError";
import { ProfilesModel } from "../profiles/profiles.model";
import { CallsModel } from "./call.model";
import { startCallSchema, tokenSchema } from "./call.validation";
import { AGORA_APP_ID, AGORA_APP_CERTIFICATE } from "../../config/agora";
import initializeFirebaseAdmin from "../../config/firebase-admin";
import crypto from "crypto";
const TOKEN_EXPIRY_SECONDS = 3600;
const MISSED_CALL_TIMEOUT_MS = 40 * 1000;

const buildAgoraToken = (channelName: string, uid: number) => {
  const expireTs = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS;
  return RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    uid,
    RtcRole.PUBLISHER,
    expireTs,
  );
};

export const generateToken = catchAsync(async (req: any, res: Response) => {
  const parsed = tokenSchema.parse(req.body);
  const me = req.profile;
  if (!me) throw new appError("No profile found for this account", 404);

  const uid = parseInt(String(me._id).slice(-8), 16) % 100000;
  const token = buildAgoraToken(parsed.channelName, uid);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token generated",
    data: { token, appId: AGORA_APP_ID, uid },
  });
});

export const startCall = catchAsync(async (req: any, res: Response) => {
  const parsed = startCallSchema.parse(req.body);
  const me = req.profile;
  if (!me) throw new appError("No profile found for this account", 404);

  const callee = await ProfilesModel.findById(parsed.calleeId);
  if (!callee) throw new appError("Callee profile not found", 404);

  const meId = String(me._id);
  const calleeId = String(callee._id);
  if (meId === calleeId) throw new appError("Cannot call yourself", 400);

  const myBlocked: string[] = (me.blockedProfiles || []).map(String);
  const theirBlocked: string[] = (callee.blockedProfiles || []).map(String);
  if (myBlocked.includes(calleeId) || theirBlocked.includes(meId)) {
    throw new appError("Unable to call this profile", 403);
  }

  const rawChannel = `${meId}_${calleeId}_${Date.now()}`;
  const channelName = crypto.createHash("md5").update(rawChannel).digest("hex");

  const call = await CallsModel.create({
    callerId: meId,
    calleeId,
    channelName,
    type: parsed.type,
    status: "ringing",
  });

  const uid = parseInt(meId.slice(-8), 16) % 100000;
  const token = buildAgoraToken(channelName, uid);

  if (callee.fcmToken) {
    const admin = initializeFirebaseAdmin();
    await admin.messaging().send({
      token: callee.fcmToken,
      notification: {
        title: `Incoming ${parsed.type} call`,
        body: me.firstName || "Someone is calling you",
      },
      data: {
        type: "incoming_call",
        callId: String(call._id),
        channelName,
        callType: parsed.type,
        callerId: meId,
      },
    });
  }

  setTimeout(async () => {
    const current = await CallsModel.findById(call._id);
    if (current && current.status === "ringing") {
      current.status = "missed";
      await current.save();
    }
  }, MISSED_CALL_TIMEOUT_MS);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call started",
    data: { callId: call._id, channelName, token, appId: AGORA_APP_ID, uid },
  });
});

export const acceptCall = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id);
  if (!call) throw new appError("Call not found", 404);
  if (call.status !== "ringing")
    throw new appError(
      `Cannot accept a call with status "${call.status}"`,
      400,
    );

  call.status = "ongoing";
  call.startedAt = new Date();
  await call.save();

  const me = req.profile;
  const uid = parseInt(String(me._id).slice(-8), 16) % 100000;
  const token = buildAgoraToken(call.channelName, uid);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call accepted",
    data: {
      callId: call._id,
      channelName: call.channelName,
      token,
      appId: AGORA_APP_ID,
      uid,
    },
  });
});

export const rejectCall = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id);
  if (!call) throw new appError("Call not found", 404);
  if (call.status !== "ringing")
    throw new appError(
      `Cannot reject a call with status "${call.status}"`,
      400,
    );

  call.status = "rejected";
  await call.save();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call rejected",
    data: null,
  });
});

export const cancelCall = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id);
  if (!call) throw new appError("Call not found", 404);
  if (call.status !== "ringing")
    throw new appError(
      `Cannot cancel a call with status "${call.status}"`,
      400,
    );

  call.status = "cancelled";
  await call.save();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call cancelled",
    data: null,
  });
});

export const endCall = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id);
  if (!call) throw new appError("Call not found", 404);
  if (call.status !== "ongoing")
    throw new appError(`Cannot end a call with status "${call.status}"`, 400);

  call.status = "ended";
  call.endedAt = new Date();
  call.duration = call.startedAt
    ? Math.max(
        0,
        Math.floor((call.endedAt.getTime() - call.startedAt.getTime()) / 1000),
      )
    : 0;
  await call.save();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call ended",
    data: { duration: call.duration },
  });
});

export const getCallStatus = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id);
  if (!call) throw new appError("Call not found", 404);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call status fetched",
    data: { status: call.status, duration: call.duration },
  });
});

export const getCallDetails = catchAsync(async (req: any, res: Response) => {
  const { id } = req.params;
  const call = await CallsModel.findById(id).populate(
    "callerId",
    "firstName lastName photos",
  );
  if (!call) throw new appError("Call not found", 404);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call details fetched",
    data: call,
  });
});

export const getCallHistory = catchAsync(async (req: any, res: Response) => {
  const me = req.profile;
  if (!me) throw new appError("No profile found for this account", 404);

  const page = parseInt(String(req.query.page || "1"), 10);
  const limit = parseInt(String(req.query.limit || "20"), 10);
  const skip = (page - 1) * limit;

  const filter = { $or: [{ callerId: me._id }, { calleeId: me._id }] };

  const [calls, total] = await Promise.all([
    CallsModel.find(filter)
      .populate("callerId", "firstName lastName photos")
      .populate("calleeId", "firstName lastName photos")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CallsModel.countDocuments(filter),
  ]);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Call history fetched",
    data: calls,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});
