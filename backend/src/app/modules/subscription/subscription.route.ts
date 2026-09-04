import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
} from "./subscription.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/subscription-screen:
 *   post:
 *     summary: Create subscription screen
 *     description: Creates the subscription/paywall screen content including trial and pricing details.
 *     tags: [Subscription]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               backgroundVideo: { type: string, format: binary }
 *               mainTitle: { type: string, example: "Unlock Premium" }
 *               highlightText: { type: string, example: "Most Popular" }
 *               planName: { type: string, example: "Premium Monthly" }
 *               trialPrice: { type: string, example: "0" }
 *               trialText: { type: string, example: "7 days free trial" }
 *               trialDuration: { type: string, example: "7" }
 *               priceAfterTrial: { type: string, example: "499" }
 *               afterTrialText: { type: string, example: "then ₹499/month" }
 *     responses:
 *       201:
 *         description: Subscription screen created successfully.
 *   get:
 *     summary: Get all subscription screens
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Subscription screens retrieved successfully.
 */
router.post("/", upload.single("backgroundVideo"), createSubscription);
router.get("/", getAllSubscription);

/**
 * @swagger
 * /v1/api/subscription-screen/{id}:
 *   get:
 *     summary: Get subscription screen by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Subscription screen found.
 *   put:
 *     summary: Update subscription screen
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               backgroundVideo: { type: string, format: binary }
 *               mainTitle: { type: string, example: "Unlock Premium" }
 *               priceAfterTrial: { type: string, example: "499" }
 *     responses:
 *       200:
 *         description: Subscription screen updated successfully.
 *   delete:
 *     summary: Delete subscription screen
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Subscription screen deleted successfully.
 */
router.get("/:id", getSubscriptionById);
router.put("/:id", upload.single("backgroundVideo"), updateSubscription);
router.delete("/:id", deleteSubscription);

export const subscriptionScreenRouter = router;
