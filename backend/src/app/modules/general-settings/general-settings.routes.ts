import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createGeneralSettings,
  deleteGeneralSettings,
  getAllGeneralSettings,
  getGeneralSettingsById,
  updateGeneralSettings,
} from "./general-settings.controller";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "homeIntroVideo", maxCount: 1 },
]);

/**
 * @swagger
 * /v1/api/settings:
 *   post:
 *     summary: Create general settings
 *     description: Creates site-wide settings such as contact info, social links, and branding assets.
 *     tags: [General Settings]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNo: { type: string, example: "+91 9876543210" }
 *               mail: { type: string, example: "support@datingapp.com" }
 *               address: { type: string, example: "123 Main Street, Mumbai" }
 *               facebook: { type: string, example: "https://facebook.com/datingapp" }
 *               instagram: { type: string, example: "https://instagram.com/datingapp" }
 *               footerCopyrights: { type: string, example: "© 2026 Dating App. All rights reserved." }
 *               logo: { type: string, format: binary }
 *               favicon: { type: string, format: binary }
 *               homeIntroVideo: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: General settings created successfully.
 *   get:
 *     summary: Get all general settings
 *     tags: [General Settings]
 *     responses:
 *       200:
 *         description: General settings retrieved successfully.
 */
router.post("/", uploadFields, createGeneralSettings);
router.get("/", getAllGeneralSettings);

/**
 * @swagger
 * /v1/api/settings/{id}:
 *   get:
 *     summary: Get general settings by ID
 *     tags: [General Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: General settings found.
 *   put:
 *     summary: Update general settings
 *     tags: [General Settings]
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
 *               mobileNo: { type: string, example: "+91 9876543210" }
 *               mail: { type: string, example: "support@datingapp.com" }
 *               logo: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: General settings updated successfully.
 *   delete:
 *     summary: Delete general settings
 *     tags: [General Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: General settings deleted successfully.
 */
router.get("/:id", getGeneralSettingsById);
router.put("/:id", uploadFields, updateGeneralSettings);
router.delete("/:id", deleteGeneralSettings);

export const generalSettingsRouter = router;
