import express from "express";
import {
  createSexualOrientation,
  deleteSexualOrientation,
  getAllSexualOrientationData,
  getSexualOrientationById,
  updateSexualOrientation,
} from "./sexualOrientation.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/sexual-orientation:
 *   post:
 *     summary: Create sexual orientation
 *     description: Adds a sexual orientation option that users can select on their profile.
 *     tags: [Sexual Orientation]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Bisexual"
 *     responses:
 *       201:
 *         description: Sexual orientation created successfully.
 *   get:
 *     summary: Get all sexual orientations
 *     tags: [Sexual Orientation]
 *     responses:
 *       200:
 *         description: Sexual orientations retrieved successfully.
 */
router.post("/", createSexualOrientation);
router.get("/", getAllSexualOrientationData);

/**
 * @swagger
 * /v1/api/sexual-orientation/{id}:
 *   get:
 *     summary: Get sexual orientation by ID
 *     tags: [Sexual Orientation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Sexual orientation found.
 *   put:
 *     summary: Update sexual orientation
 *     tags: [Sexual Orientation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Bisexual"
 *     responses:
 *       200:
 *         description: Sexual orientation updated successfully.
 *   delete:
 *     summary: Delete sexual orientation
 *     tags: [Sexual Orientation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Sexual orientation deleted successfully.
 */
router.get("/:id", getSexualOrientationById);
router.put("/:id", updateSexualOrientation);
router.delete("/:id", deleteSexualOrientation);

export const sexualOrientationRouter = router;
