import express from "express";
import {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
} from "./terms.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/terms-and-conditions:
 *   post:
 *     summary: Create terms and conditions
 *     description: Creates the app's terms and conditions content.
 *     tags: [Terms & Conditions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Terms & Conditions"
 *               content:
 *                 type: string
 *                 example: "By using this app, you agree to the following terms..."
 *     responses:
 *       201:
 *         description: Terms and conditions created successfully.
 *   get:
 *     summary: Get all terms and conditions
 *     tags: [Terms & Conditions]
 *     responses:
 *       200:
 *         description: Terms and conditions retrieved successfully.
 */
router.post("/", createTerms);
router.get("/", getAllTerms);

/**
 * @swagger
 * /v1/api/terms-and-conditions/{id}:
 *   get:
 *     summary: Get terms by ID
 *     tags: [Terms & Conditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Terms found.
 *   put:
 *     summary: Update terms
 *     tags: [Terms & Conditions]
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
 *                 example: "Updated Terms & Conditions"
 *               content:
 *                 type: string
 *                 example: "Updated terms and conditions text."
 *     responses:
 *       200:
 *         description: Terms updated successfully.
 */
router.get("/:id", getTermsById);
router.put("/:id", updateTerms);

export const termsRouter = router;
