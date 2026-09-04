import express from "express";
import {
  createHelpCenter,
  getAllHelpCenter,
  getHelpCenterById,
  updateHelpCenter,
} from "./helpCenter.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/help-center:
 *   post:
 *     summary: Create help center entry
 *     description: Creates the help center page content.
 *     tags: [Help Center]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Help Center"
 *               content:
 *                 type: string
 *                 example: "Welcome to our Help Center. Find answers to common questions below."
 *     responses:
 *       201:
 *         description: Help center entry created successfully.
 *   get:
 *     summary: Get all help center entries
 *     tags: [Help Center]
 *     responses:
 *       200:
 *         description: Help center entries retrieved successfully.
 */
router.post("/", createHelpCenter);
router.get("/", getAllHelpCenter);

/**
 * @swagger
 * /v1/api/help-center/{id}:
 *   get:
 *     summary: Get help center entry by ID
 *     tags: [Help Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Help center entry found.
 *   put:
 *     summary: Update help center entry
 *     tags: [Help Center]
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
 *                 example: "Updated Help Center"
 *               content:
 *                 type: string
 *                 example: "Updated help center content."
 *     responses:
 *       200:
 *         description: Help center entry updated successfully.
 */
router.get("/:id", getHelpCenterById);
router.put("/:id", updateHelpCenter);

export const helpCenterRouter = router;
