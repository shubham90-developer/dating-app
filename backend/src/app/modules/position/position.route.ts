import express from "express";
import {
  createPosition,
  deletePosition,
  getAllPositionData,
  getPositionById,
  updatePosition,
} from "./position.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/position:
 *   post:
 *     summary: Create position
 *     description: Adds a "looking to meet" position option (e.g. dating preference/relationship goal) for user profiles.
 *     tags: [Position]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Long-term relationship" }
 *               subTitle: { type: string, example: "Looking for something serious" }
 *     responses:
 *       201:
 *         description: Position created successfully.
 *   get:
 *     summary: Get all positions
 *     tags: [Position]
 *     responses:
 *       200:
 *         description: Positions retrieved successfully.
 */
router.post("/", createPosition);
router.get("/", getAllPositionData);

/**
 * @swagger
 * /v1/api/position/{id}:
 *   get:
 *     summary: Get position by ID
 *     tags: [Position]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Position found.
 *   put:
 *     summary: Update position
 *     tags: [Position]
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
 *               title: { type: string, example: "Long-term relationship" }
 *               subTitle: { type: string, example: "Looking for something serious" }
 *     responses:
 *       200:
 *         description: Position updated successfully.
 *   delete:
 *     summary: Delete position
 *     tags: [Position]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Position deleted successfully.
 */
router.get("/:id", getPositionById);
router.put("/:id", updatePosition);
router.delete("/:id", deletePosition);

export const positionRouter = router;
