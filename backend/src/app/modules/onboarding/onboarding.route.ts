import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createOnboarding,
  deleteOnboardingById,
  getAllOnboarding,
  OnboardingById,
  updateOnboardingById,
} from "./onboarding.controller";
const router = express.Router();

/**
 * @swagger
 * /v1/api/onboarding:
 *   post:
 *     summary: Create onboarding screen
 *     description: Adds a new onboarding slide with title, subtitle, and image.
 *     tags: [Onboarding]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, subTitle]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Meet new people"
 *               subTitle:
 *                 type: string
 *                 example: "Connect with people near you who share your interests"
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Onboarding screen created successfully.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get all onboarding screens
 *     tags: [Onboarding]
 *     responses:
 *       200:
 *         description: Onboarding screens retrieved successfully.
 */
router.post("/", upload.single("img"), createOnboarding);
router.get("/", getAllOnboarding);

/**
 * @swagger
 * /v1/api/onboarding/{id}:
 *   get:
 *     summary: Get onboarding screen by ID
 *     tags: [Onboarding]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Onboarding screen found.
 *       404:
 *         description: Onboarding screen not found.
 *   put:
 *     summary: Update onboarding screen
 *     tags: [Onboarding]
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
 *               title: { type: string, example: "Meet new people" }
 *               subTitle: { type: string, example: "Updated subtitle text" }
 *               img: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Onboarding screen updated successfully.
 *   delete:
 *     summary: Delete onboarding screen
 *     tags: [Onboarding]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Onboarding screen deleted successfully.
 */
router.get("/:id", OnboardingById);
router.put("/:id", upload.single("img"), updateOnboardingById);
router.delete("/:id", deleteOnboardingById);

export const onboardingRouter = router;
