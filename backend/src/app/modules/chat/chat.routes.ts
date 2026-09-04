import express from "express";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";
import { startConversation, notifyNewMessage } from "./chat.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/chat/start:
 *   post:
 *     summary: Start (or fetch) a conversation between two profiles
 *     description: >
 *       Creates a Firestore conversation between the authenticated profile and
 *       another profile, or returns the existing one if it already exists.
 *       Blocked profile pairs are rejected.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otherProfileId]
 *             properties:
 *               otherProfileId:
 *                 type: string
 *                 example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Conversation ready.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Conversation ready" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     conversationId:
 *                       type: string
 *                       example: "66d88b4e_66d88c1a"
 *       400:
 *         description: Invalid request, or one/both profiles not Firebase-verified.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 *       403:
 *         description: One profile has blocked the other.
 *       404:
 *         description: Authenticated profile or target profile not found.
 */
router.post("/start", verifyFirebaseToken, startConversation);

/**
 * @swagger
 * /v1/api/chat/notify:
 *   post:
 *     summary: Send a push notification for a newly sent chat message
 *     description: >
 *       Called by the client right after writing a message to Firestore.
 *       Looks up the recipient's stored FCM token and sends a push via
 *       Firebase Cloud Messaging. If the recipient has no token on file,
 *       this is a no-op (not an error).
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, otherProfileId, text]
 *             properties:
 *               conversationId:
 *                 type: string
 *                 example: "66d88b4e_66d88c1a"
 *               otherProfileId:
 *                 type: string
 *                 example: "66d88c1a4e31a5e0f9c98765"
 *               text:
 *                 type: string
 *                 example: "Hey, how's it going?"
 *     responses:
 *       200:
 *         description: Notification sent, or skipped if recipient has no device token.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Missing or invalid Firebase ID token.
 */
router.post("/notify", verifyFirebaseToken, notifyNewMessage);

export const chatRouter = router;
