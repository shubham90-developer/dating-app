import express from "express";
import {
  createPrivacyPolicy,
  getAllPrivacyPolicy,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
} from "./privacypolicy.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/privacy-policy:
 *   post:
 *     summary: Create privacy policy
 *     description: Creates the app's privacy policy content.
 *     tags: [Privacy Policy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Privacy Policy"
 *               content:
 *                 type: string
 *                 example: "This privacy policy describes how we collect and use your data."
 *     responses:
 *       201:
 *         description: Privacy policy created successfully.
 *       400:
 *         description: Privacy policy already exists.
 *   get:
 *     summary: Get all privacy policy entries
 *     tags: [Privacy Policy]
 *     responses:
 *       200:
 *         description: Privacy policy entries retrieved successfully.
 */
router.post("/", createPrivacyPolicy);
router.get("/", getAllPrivacyPolicy);

/**
 * @swagger
 * /v1/api/privacy-policy/{id}:
 *   get:
 *     summary: Get privacy policy by ID
 *     tags: [Privacy Policy]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Privacy policy found.
 *   put:
 *     summary: Update privacy policy
 *     tags: [Privacy Policy]
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
 *                 example: "Updated Privacy Policy"
 *               content:
 *                 type: string
 *                 example: "Updated privacy policy text."
 *     responses:
 *       200:
 *         description: Privacy policy updated successfully.
 */
router.get("/:id", getPrivacyPolicyById);
router.put("/:id", updatePrivacyPolicy);

export const privacyPolicyRouter = router;
