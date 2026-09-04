import express from "express";
import {
  createFaq,
  deleteFaq,
  getAllFaqData,
  getFaqById,
  updateFaq,
} from "./faq.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/faq:
 *   post:
 *     summary: Create FAQ
 *     description: Adds a new frequently asked question and its answer.
 *     tags: [FAQ]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qustion:
 *                 type: string
 *                 example: "How do I reset my password?"
 *               answer:
 *                 type: string
 *                 example: "Go to Settings > Account > Reset Password."
 *     responses:
 *       201:
 *         description: FAQ created successfully.
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQ]
 *     responses:
 *       200:
 *         description: FAQs retrieved successfully.
 */
router.post("/", createFaq);
router.get("/", getAllFaqData);

/**
 * @swagger
 * /v1/api/faq/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: FAQ found.
 *   put:
 *     summary: Update FAQ
 *     tags: [FAQ]
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
 *               qustion: { type: string, example: "How do I reset my password?" }
 *               answer: { type: string, example: "Go to Settings > Account > Reset Password." }
 *     responses:
 *       200:
 *         description: FAQ updated successfully.
 *   delete:
 *     summary: Delete FAQ
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: FAQ deleted successfully.
 */
router.get("/:id", getFaqById);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export const faqRouter = router;
