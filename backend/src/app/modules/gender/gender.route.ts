import express from "express";
import {
  createGender,
  deleteGender,
  getAllGenderData,
  getGenderById,
  updateGender,
} from "./gender.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/gender:
 *   post:
 *     summary: Create gender
 *     description: Adds a gender option that users can select on their profile.
 *     tags: [Gender]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 example: "Female"
 *     responses:
 *       201:
 *         description: Gender created successfully.
 *   get:
 *     summary: Get all genders
 *     tags: [Gender]
 *     responses:
 *       200:
 *         description: Genders retrieved successfully.
 */
router.post("/", createGender);
router.get("/", getAllGenderData);

/**
 * @swagger
 * /v1/api/gender/{id}:
 *   get:
 *     summary: Get gender by ID
 *     tags: [Gender]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Gender found.
 *   put:
 *     summary: Update gender
 *     tags: [Gender]
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
 *               gender:
 *                 type: string
 *                 example: "Female"
 *     responses:
 *       200:
 *         description: Gender updated successfully.
 *   delete:
 *     summary: Delete gender
 *     tags: [Gender]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Gender deleted successfully.
 */
router.get("/:id", getGenderById);
router.put("/:id", updateGender);
router.delete("/:id", deleteGender);

export const genderRouter = router;
