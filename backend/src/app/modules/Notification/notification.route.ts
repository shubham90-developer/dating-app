import express from "express";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";
import { sendPushNotification } from "./notification";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Push notification delivery via Firebase Cloud Messaging (FCM).
 */

/**
 * @swagger
 * /v1/api/notification/send:
 *   post:
 *     summary: Send a push notification to a specific profile
 *     description: >
 *       Sends a Firebase Cloud Messaging (FCM) push notification to the device
 *       registered against the given profile's fcmToken. Requires a valid
 *       Firebase ID token. Fails with 400 if the target profile has no
 *       fcmToken saved (device never registered for push, or token expired).
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileId
 *               - title
 *               - body
 *             properties:
 *               profileId:
 *                 type: string
 *                 description: The _id of the profile to notify.
 *                 example: "66d88b4ea31a5e0f9c123456"
 *               title:
 *                 type: string
 *                 description: Notification title shown to the user.
 *                 example: "New match!"
 *               body:
 *                 type: string
 *                 description: Notification body text.
 *                 example: "You have a new match — say hi 👋"
 *               data:
 *                 type: object
 *                 description: Optional key-value payload for deep-linking or client-side handling. All values must be strings.
 *                 additionalProperties:
 *                   type: string
 *                 example:
 *                   screen: "chat"
 *                   matchId: "66e0f2a1c9d4e50012ab34cd"
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Notification sent successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     messageId: { type: string, example: "projects/myapp/messages/0:1234567890%abcd" }
 *       400:
 *         description: Target profile has no fcmToken saved.
 *       401:
 *         description: Invalid/expired Firebase token.
 *       404:
 *         description: Profile not found.
 */
router.post("/send", verifyFirebaseToken, sendPushNotification);

export const notificationRouter = router;
