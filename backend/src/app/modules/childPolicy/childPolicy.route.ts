import express from "express";
import {
  createChildPolicy,
  getAllChildPolicy,
  getChildPolicyById,
  updateChildPolicy,
} from "./childPolicy.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/child-policy:
 *   post:
 *     summary: Create child policy
 *     description: Creates the app's child safety policy content.
 *     tags: [Child Policy]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Child Safety Policy"
 *               content:
 *                 type: string
 *                 example: "Our platform is strictly for adults aged 18 and above."
 *     responses:
 *       201:
 *         description: Child policy created successfully.
 *   get:
 *     summary: Get all child policy entries
 *     tags: [Child Policy]
 *     responses:
 *       200:
 *         description: Child policy entries retrieved successfully.
 */
router.post("/", createChildPolicy);
router.get("/", getAllChildPolicy);

/**
 * @swagger
 * /v1/api/child-policy/{id}:
 *   get:
 *     summary: Get child policy by ID
 *     tags: [Child Policy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Child policy found.
 *   put:
 *     summary: Update child policy
 *     tags: [Child Policy]
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
 *                 example: "Updated Child Safety Policy"
 *               content:
 *                 type: string
 *                 example: "Updated child policy text."
 *     responses:
 *       200:
 *         description: Child policy updated successfully.
 */
router.get("/:id", getChildPolicyById);
router.put("/:id", updateChildPolicy);

export const childPolicyRouter = router;
