// modules/auth/auth.routes.ts
import express from "express";
import { verifyOtp } from "./auth";

const router = express.Router();

/**
 * @swagger
 * /v1/api/auth/verify-otp:
 *   post:
 *     summary: Verify phone OTP (MSG91 widget)
 *     description: >
 *       Verifies the MSG91 widget access-token generated after the user
 *       completes OTP verification client-side via window.verifyOtp().
 *       Sending/resending the OTP itself is handled entirely on the
 *       frontend by the MSG91 widget — this endpoint only validates the
 *       resulting access-token server-side.
 *       - If a profile already exists for the phone number, returns an
 *         auth token and logs the user in directly.
 *       - If no profile exists, returns a short-lived phoneToken (10m)
 *         that must be used to complete signup.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, accessToken]
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Phone number with country code, no plus sign.
 *                 example: "919876543210"
 *               accessToken:
 *                 type: string
 *                 description: access-token returned by MSG91 widget's verifyOtp callback.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 isNewUser: { type: boolean }
 *                 token:
 *                   type: string
 *                   description: Present when isNewUser is false (existing profile).
 *                 phoneToken:
 *                   type: string
 *                   description: Present when isNewUser is true. Short-lived (10m), used to complete signup.
 *                 data:
 *                   type: object
 *                   description: Existing profile data, present when isNewUser is false.
 *       400:
 *         description: Missing phone or accessToken in request body.
 *       401:
 *         description: Invalid or expired OTP / access-token.
 */
router.post("/verify-otp", verifyOtp);

export const authRouter = router;
