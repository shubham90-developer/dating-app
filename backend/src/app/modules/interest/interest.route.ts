import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createIntrest,
  deleteIntrestById,
  getAllIntrest,
  IntrestById,
  updateIntrestById,
} from "./interest.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/interest:
 *   post:
 *     summary: Create interest
 *     description: Adds a new interest option that users can select on their profile (e.g. Hiking, Music).
 *     tags: [Interest]
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
 *                 example: "Hiking"
 *               icon:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Interest created successfully.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get all interests
 *     tags: [Interest]
 *     responses:
 *       200:
 *         description: Interests retrieved successfully.
 */
router.post("/", upload.single("icon"), createIntrest);
router.get("/", getAllIntrest);

/**
 * @swagger
 * /v1/api/interest/{id}:
 *   get:
 *     summary: Get interest by ID
 *     tags: [Interest]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Interest found.
 *   put:
 *     summary: Update interest
 *     tags: [Interest]
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
 *               title: { type: string, example: "Hiking" }
 *               icon: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Interest updated successfully.
 *   delete:
 *     summary: Delete interest
 *     tags: [Interest]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Interest deleted successfully.
 */
router.get("/:id", IntrestById);
router.put("/:id", upload.single("icon"), updateIntrestById);
router.delete("/:id", deleteIntrestById);

export const intrestRouter = router;
