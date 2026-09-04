import express from "express";
import { upload } from "../../config/cloudinary";
import {
  AdertisementById,
  createAdvertisement,
  deleteAdvertisementById,
  getAllAdertisement,
  updateAdvertisementById,
} from "./advertisement.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/advertisement:
 *   post:
 *     summary: Create advertisement
 *     description: Creates an advertisement with a background video and a list of feature highlights, each with an icon, title, and description.
 *     tags: [Advertisement]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Find your perfect match"
 *               backgroundVideo:
 *                 type: string
 *                 format: binary
 *               featureIcons:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               features:
 *                 type: string
 *                 description: JSON string array of { icon, title, description }
 *                 example: '[{"icon":"icon1.png","title":"Verified Profiles","description":"All profiles are manually verified"}]'
 *     responses:
 *       201:
 *         description: Advertisement created successfully.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get all advertisements
 *     tags: [Advertisement]
 *     responses:
 *       200:
 *         description: Advertisements retrieved successfully.
 */
router.post(
  "/",
  upload.fields([
    { name: "backgroundVideo", maxCount: 1 },
    { name: "featureIcons", maxCount: 20 },
  ]),
  createAdvertisement,
);
router.get("/", getAllAdertisement);

/**
 * @swagger
 * /v1/api/advertisement/{id}:
 *   get:
 *     summary: Get advertisement by ID
 *     tags: [Advertisement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Advertisement found.
 *       404:
 *         description: Advertisement not found.
 *   put:
 *     summary: Update advertisement
 *     tags: [Advertisement]
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
 *               title: { type: string, example: "Find your perfect match" }
 *               backgroundVideo: { type: string, format: binary }
 *               featureIcons:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Advertisement updated successfully.
 *   delete:
 *     summary: Delete advertisement
 *     tags: [Advertisement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Advertisement deleted successfully.
 */
router.get("/:id", AdertisementById);
router.put(
  "/:id",
  upload.fields([
    { name: "backgroundVideo", maxCount: 1 },
    { name: "featureIcons", maxCount: 20 },
  ]),
  updateAdvertisementById,
);
router.delete("/:id", deleteAdvertisementById);

export const advertisementRouter = router;
