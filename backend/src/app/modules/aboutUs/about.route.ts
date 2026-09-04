import express from "express";
import { upload } from "../../config/cloudinary";
import { createAboutUs, getAboutUs, updateAboutUs } from "./about.controller";
const router = express.Router();

/**
 * @swagger
 * /v1/api/about-us:
 *   post:
 *     summary: Create about us content
 *     description: Creates the "About Us" page content including mission, vision, and founder details.
 *     tags: [About Us]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, subTitle, shortDesc]
 *             properties:
 *               title: { type: string, example: "About Our App" }
 *               subTitle: { type: string, example: "Connecting hearts worldwide" }
 *               shortDesc: { type: string, example: "We help people find meaningful connections." }
 *               mission: { type: string, example: "To create genuine connections between people." }
 *               vision: { type: string, example: "A world where finding love is simple and safe." }
 *               founderName: { type: string, example: "Jane Doe" }
 *               founderDesignation: { type: string, example: "Founder & CEO" }
 *               img1: { type: string, format: binary }
 *               img2: { type: string, format: binary }
 *               founderImg: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: About Us content created successfully.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get about us content
 *     tags: [About Us]
 *     responses:
 *       200:
 *         description: About Us content retrieved successfully.
 */
router.post(
  "/",
  upload.fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "founderImg", maxCount: 1 },
  ]),
  createAboutUs,
);
router.get("/", getAboutUs);

/**
 * @swagger
 * /v1/api/about-us/{id}:
 *   put:
 *     summary: Update about us content
 *     tags: [About Us]
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
 *               title: { type: string, example: "About Our App" }
 *               mission: { type: string }
 *               vision: { type: string }
 *               img1: { type: string, format: binary }
 *               img2: { type: string, format: binary }
 *               founderImg: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: About Us content updated successfully.
 */
router.put(
  "/:id",
  upload.fields([
    { name: "img1", maxCount: 1 },
    { name: "img2", maxCount: 1 },
    { name: "founderImg", maxCount: 1 },
  ]),
  updateAboutUs,
);

export const aboutUsRouter = router;
