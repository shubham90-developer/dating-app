import express from "express";
import { upload } from "../../config/cloudinary";

import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadKYCDocument,
  deleteUploadedFile,
} from "./upload.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/upload/single:
 *   post:
 *     summary: Upload a single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: Uploaded successfully }
 *       401: { description: Unauthorized }
 */
router.post("/single", upload.single("image"), uploadSingleImage);

/**
 * @swagger
 * /v1/api/upload/multiple:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       200: { description: Uploaded successfully }
 *       401: { description: Unauthorized }
 */
router.post(
  "/multiple",

  upload.array("images", 10),
  uploadMultipleImages,
);

/**
 * @swagger
 * /v1/api/upload/kyc-document:
 *   post:
 *     summary: Upload KYC document (public)
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document: { type: string, format: binary }
 *     responses:
 *       200: { description: Uploaded successfully }
 */
router.post("/kyc-document", upload.single("document"), uploadKYCDocument);

/**
 * @swagger
 * /v1/api/upload/delete/{publicId}:
 *   delete:
 *     summary: Delete an uploaded file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted successfully }
 *       401: { description: Unauthorized }
 */
router.delete("/delete/:publicId", deleteUploadedFile);

export const uploadRouter = router;
