import express from "express";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";
import {
  generateToken,
  startCall,
  acceptCall,
  rejectCall,
  cancelCall,
  endCall,
  getCallStatus,
  getCallDetails,
  getCallHistory,
} from "./call.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/calls/token:
 *   post:
 *     summary: Generate an Agora RTC token for an existing channel
 *     description: >
 *       Used to (re)join a channel that already exists — e.g. rejoining after
 *       a dropped connection. To start a brand new call, use /calls/start instead,
 *       which creates the channel and returns a token in one step.
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [channelName]
 *             properties:
 *               channelName:
 *                 type: string
 *                 example: "66d88b4e_66d88c1a_1732000000000"
 *     responses:
 *       200:
 *         description: Token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Token generated" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string, example: "006eJxT..." }
 *                     appId: { type: string, example: "a1b2c3d4e5f6" }
 *                     uid: { type: integer, example: 48213 }
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Authenticated profile not found.
 */
router.post("/token", verifyFirebaseToken, generateToken);

/**
 * @swagger
 * /v1/api/calls/start:
 *   post:
 *     summary: Start a new audio or video call
 *     description: >
 *       Creates the call record (status "ringing"), generates a unique Agora
 *       channel + token for the caller, and sends an FCM push notification to
 *       the callee if a device token is on file. If the callee doesn't accept
 *       or reject within ~40 seconds, the call is automatically marked "missed".
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [calleeId, type]
 *             properties:
 *               calleeId:
 *                 type: string
 *                 example: "66d88c1a4e31a5e0f9c98765"
 *               type:
 *                 type: string
 *                 enum: [audio, video]
 *                 example: "video"
 *     responses:
 *       200:
 *         description: Call started, returns channel + token for the caller to join.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Call started" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     callId: { type: string, example: "66e0a1b2c3d4e5f678901234" }
 *                     channelName: { type: string, example: "66d88b4e_66d88c1a_1732000000000" }
 *                     token: { type: string }
 *                     appId: { type: string }
 *                     uid: { type: integer }
 *       400:
 *         description: Invalid request, or caller tried to call themselves.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       403:
 *         description: One profile has blocked the other.
 *       404:
 *         description: Caller profile or callee profile not found.
 */
router.post("/start", verifyFirebaseToken, startCall);

/**
 * @swagger
 * /v1/api/calls/{id}/accept:
 *   patch:
 *     summary: Accept an incoming call
 *     description: >
 *       Callee accepts a "ringing" call. Moves status to "ongoing", records
 *       startedAt, and returns an Agora token for the callee to join the same channel.
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Call accepted, returns channel + token for the callee.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Call accepted" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     callId: { type: string }
 *                     channelName: { type: string }
 *                     token: { type: string }
 *                     appId: { type: string }
 *                     uid: { type: integer }
 *       400:
 *         description: Call is not in "ringing" state (already answered/ended/expired).
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.patch("/:id/accept", verifyFirebaseToken, acceptCall);

/**
 * @swagger
 * /v1/api/calls/{id}/reject:
 *   patch:
 *     summary: Reject an incoming call
 *     description: Callee declines a "ringing" call. Moves status to "rejected".
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Call rejected.
 *       400:
 *         description: Call is not in "ringing" state.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.patch("/:id/reject", verifyFirebaseToken, rejectCall);

/**
 * @swagger
 * /v1/api/calls/{id}/cancel:
 *   patch:
 *     summary: Cancel an outgoing call before it's answered
 *     description: >
 *       Caller backs out of a "ringing" call before the callee responds.
 *       Distinct from reject (callee declines) and end (hangup after connecting) —
 *       kept separate so call history accurately shows "cancelled" vs "rejected" vs "ended".
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Call cancelled.
 *       400:
 *         description: Call is not in "ringing" state.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.patch("/:id/cancel", verifyFirebaseToken, cancelCall);

/**
 * @swagger
 * /v1/api/calls/{id}/end:
 *   patch:
 *     summary: End an ongoing call
 *     description: >
 *       Either participant hangs up on an "ongoing" call. Moves status to "ended",
 *       records endedAt, and computes duration in seconds from startedAt.
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Call ended.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Call ended" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     duration:
 *                       type: integer
 *                       example: 184
 *                       description: Call duration in seconds
 *       400:
 *         description: Call is not in "ongoing" state.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.patch("/:id/end", verifyFirebaseToken, endCall);

/**
 * @swagger
 * /v1/api/calls/{id}/status:
 *   get:
 *     summary: Get current status of a call
 *     description: >
 *       Poll this if the client isn't using a live listener for call state
 *       (e.g. to check whether a call was answered on another device).
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Status fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Call status fetched" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [ringing, ongoing, ended, rejected, cancelled, missed]
 *                       example: "ongoing"
 *                     duration: { type: integer, example: 0 }
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.get("/:id/status", verifyFirebaseToken, getCallStatus);

/**
 * @swagger
 * /v1/api/calls/history:
 *   get:
 *     summary: Get paginated call history for the logged-in profile
 *     description: Returns calls where the authenticated profile was either caller or callee, most recent first.
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *         example: 20
 *     responses:
 *       200:
 *         description: Call history fetched.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Call history fetched" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       callerId: { type: object }
 *                       calleeId: { type: object }
 *                       type: { type: string, enum: [audio, video] }
 *                       status: { type: string, enum: [ringing, ongoing, ended, rejected, cancelled, missed] }
 *                       duration: { type: integer }
 *                       createdAt: { type: string }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Authenticated profile not found.
 */
router.get("/history", verifyFirebaseToken, getCallHistory);

/**
 * @swagger
 * /v1/api/calls/{id}:
 *   get:
 *     summary: Get incoming call details (caller name/photo)
 *     description: >
 *       Called by the callee's app right after receiving the incoming-call push,
 *       since a push notification payload is too small to carry full caller profile info.
 *     tags: [Calls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66e0a1b2c3d4e5f678901234"
 *     responses:
 *       200:
 *         description: Call details fetched, including populated caller profile.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       404:
 *         description: Call not found.
 */
router.get("/:id", verifyFirebaseToken, getCallDetails);

export const callsRouter = router;
