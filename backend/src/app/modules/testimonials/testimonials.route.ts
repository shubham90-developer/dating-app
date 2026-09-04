import express from "express";
import {
  createTestimonials,
  deleteTestimonials,
  getAllTestimonials,
  getTestimonialsById,
  updateTestimonials,
} from "./testimonials.controller";
import { upload } from "../../config/cloudinary";

const router = express.Router();

/**
 * @swagger
 * /v1/api/testimonials:
 *   post:
 *     summary: Create testimonial
 *     description: Adds a customer testimonial with their photo, name, designation, and review.
 *     tags: [Testimonials]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Priya Sharma" }
 *               designation: { type: string, example: "Verified User" }
 *               description: { type: string, example: "I found my partner within a month of using this app!" }
 *               rating: { type: string, example: "5" }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Testimonial created successfully.
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully.
 */
router.post("/", upload.single("image"), createTestimonials);
router.get("/", getAllTestimonials);

/**
 * @swagger
 * /v1/api/testimonials/{id}:
 *   get:
 *     summary: Get testimonial by ID
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Testimonial found.
 *   put:
 *     summary: Update testimonial
 *     tags: [Testimonials]
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
 *               name: { type: string, example: "Priya Sharma" }
 *               rating: { type: string, example: "5" }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Testimonial updated successfully.
 *   delete:
 *     summary: Delete testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully.
 */
router.get("/:id", getTestimonialsById);
router.put("/:id", upload.single("image"), updateTestimonials);
router.delete("/:id", deleteTestimonials);

export const testimonialsRouter = router;
