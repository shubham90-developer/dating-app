import express from "express";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";
import validateRequest from "../../middlewares/validateRequest";
import {
  createUserSubscription,
  getMyUserSubscription,
  verifyUserSubscription,
  cancelUserSubscription,
  getAllUserSubscriptions,
} from "./userSubscription.controller";
import { createUserSubscriptionSchema } from "./userSubscription.validation";
import { verifyUserSubscriptionSchema } from "./userSubscription.validation";
import { verifyAdminToken } from "../../middlewares/verifyAdminToken";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserSubscription
 *   description: Autopay subscription flow (Razorpay) — small authentication charge now, full amount auto-charged after the trial period.
 */

/**
 * @swagger
 * /v1/api/user-subscription/subscribe:
 *   post:
 *     summary: Start an autopay subscription for the logged-in user
 *     description: >
 *       Creates a Razorpay Plan + Subscription for the chosen plan, with billing
 *       delayed by the plan's trialDuration. Returns a razorpaySubscriptionId
 *       which the app must pass to Razorpay Checkout (subscription mode) to
 *       collect the ₹1 UPI Autopay mandate authentication. The full amount is
 *       auto-charged later by Razorpay — no further action needed from the app.
 *       Requires a Firebase ID token; a matching Profile must already exist
 *       for the verified phone number.
 *     tags: [UserSubscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionPlanId
 *             properties:
 *               subscriptionPlanId:
 *                 type: string
 *                 description: The _id of the plan from the subscription-screen (CMS) collection.
 *                 example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Razorpay subscription created successfully. Open Checkout with the returned id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Subscription created, proceed to checkout" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     razorpaySubscriptionId: { type: string, example: "sub_QwErTyUiOp1234" }
 *                     keyId: { type: string, example: "rzp_test_1234567890" }
 *                     userSubscriptionId: { type: string, example: "66e0f2a1c9d4e50012ab34cd" }
 *       400:
 *         description: Invalid plan price or malformed request.
 *       401:
 *         description: Invalid/expired Firebase token, or no profile exists yet for this phone number.
 *       404:
 *         description: Subscription plan not found.
 */
router.post(
  "/subscribe",
  verifyFirebaseToken,
  validateRequest(createUserSubscriptionSchema),
  createUserSubscription,
);

router.get(
  "/admin/all",
  verifyAdminToken,
  adminMiddleware,
  getAllUserSubscriptions,
);

/**
 * @swagger
 * /v1/api/user-subscription/me:
 *   get:
 *     summary: Get the logged-in user's latest subscription status
 *     description: >
 *       Returns the most recent UserSubscription record for the authenticated
 *       profile. Use this to check whether the user's autopay mandate has been
 *       authenticated and whether the full amount has been charged yet
 *       (status: created | authenticated | active | charged | cancelled | failed).
 *     tags: [UserSubscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current subscription status (null if the user never subscribed).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Subscription status retrieved" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "66e0f2a1c9d4e50012ab34cd" }
 *                     profile: { type: string, nullable: true, example: null }
 *                     subscriptionPlan: { type: string, example: "66d88b4ea31a5e0f9c123457" }
 *                     razorpaySubscriptionId: { type: string, example: "sub_QwErTyUiOp1234" }
 *                     amount: { type: number, example: 49900 }
 *                     authAmount: { type: number, example: 100 }
 *                     startAt: { type: string, example: "2026-08-05T10:00:00.000Z" }
 *                     currentPeriodEnd: { type: string, example: "2026-09-05T10:00:00.000Z" }
 *                     status:
 *                       type: string
 *                       enum: [created, authenticated, active, charged, cancelled, failed]
 *                       example: "active"
 *       401:
 *         description: Authentication required — missing or invalid Firebase ID token.
 */
router.get("/me", verifyFirebaseToken, getMyUserSubscription);

/**
 * @swagger
 * /v1/api/user-subscription/cancel:
 *   post:
 *     summary: Cancel the logged-in user's active subscription (turns off autopay)
 *     description: >
 *       Cancels the user's currently active/authenticated/created Razorpay
 *       subscription immediately. This calls Razorpay's subscription cancel
 *       API, which turns off the UPI Autopay mandate so no further charges
 *       will be attempted. The local UserSubscription record is updated to
 *       status "cancelled" with a cancelledAt timestamp. Requires a Firebase
 *       ID token; cancellation takes effect immediately (not at end of the
 *       current billing cycle).
 *     tags: [UserSubscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Subscription cancelled successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "66e0f2a1c9d4e50012ab34cd" }
 *                     razorpaySubscriptionId: { type: string, example: "sub_QwErTyUiOp1234" }
 *                     status:
 *                       type: string
 *                       enum: [created, authenticated, active, charged, cancelled, failed]
 *                       example: "cancelled"
 *                     cancelledAt: { type: string, example: "2026-08-06T10:15:00.000Z" }
 *       401:
 *         description: Authentication required — missing or invalid Firebase ID token.
 *       404:
 *         description: No active subscription found for this user.
 */
router.post("/cancel", verifyFirebaseToken, cancelUserSubscription);
/**
 * @swagger
 * /v1/api/user-subscription/verify:
 *   post:
 *     summary: Verify a Razorpay payment and update the subscription status
 *     description: >
 *       Called by the app right after Razorpay Checkout succeeds, using the
 *       razorpay_payment_id, razorpay_subscription_id, and razorpay_signature
 *       returned in the Checkout success handler. The backend recomputes the
 *       HMAC-SHA256 signature (payment_id|subscription_id, signed with
 *       RAZORPAY_KEY_SECRET) and rejects the request if it doesn't match.
 *       On a valid signature, the subscription's live status is fetched
 *       directly from Razorpay (not trusted from the client) and the local
 *       UserSubscription record is updated accordingly. Requires a Firebase
 *       ID token; the subscription must belong to the authenticated user.
 *     tags: [UserSubscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_payment_id
 *               - razorpay_subscription_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *                 description: Payment ID returned by Razorpay Checkout on success.
 *                 example: "pay_QwErTyUiOp1234"
 *               razorpay_subscription_id:
 *                 type: string
 *                 description: Subscription ID returned by Razorpay Checkout on success.
 *                 example: "sub_QwErTyUiOp1234"
 *               razorpay_signature:
 *                 type: string
 *                 description: HMAC-SHA256 signature returned by Razorpay Checkout on success.
 *                 example: "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
 *     responses:
 *       200:
 *         description: Signature valid — subscription status updated from Razorpay.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Payment verified, subscription updated" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "66e0f2a1c9d4e50012ab34cd" }
 *                     razorpaySubscriptionId: { type: string, example: "sub_QwErTyUiOp1234" }
 *                     razorpayPaymentId: { type: string, example: "pay_QwErTyUiOp1234" }
 *                     currentPeriodEnd: { type: string, example: "2026-09-05T10:00:00.000Z" }
 *                     status:
 *                       type: string
 *                       enum: [created, authenticated, active, charged, cancelled, failed]
 *                       example: "active"
 *       400:
 *         description: Invalid/mismatched payment signature — request rejected.
 *       401:
 *         description: Authentication required — missing or invalid Firebase ID token.
 *       404:
 *         description: No matching subscription found for this user.
 */
router.post(
  "/verify",
  verifyFirebaseToken,
  validateRequest(verifyUserSubscriptionSchema),
  verifyUserSubscription,
);

export const userSubscriptionRouter = router;
