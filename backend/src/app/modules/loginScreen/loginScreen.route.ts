import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createLoginScreen,
  deleteLoginScreen,
  getAllLoginScreen,
  getLoginScreenById,
  updateLoginScreen,
} from "./loginScreen.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/login-screen:
 *   post:
 *     summary: Create login screen
 *     description: Uploads a background image shown on the app's login screen.
 *     tags: [Login Screen]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               loginImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Login screen created successfully.
 *   get:
 *     summary: Get all login screens
 *     tags: [Login Screen]
 *     responses:
 *       200:
 *         description: Login screens retrieved successfully.
 */
router.post("/", upload.single("loginImg"), createLoginScreen);
router.get("/", getAllLoginScreen);

/**
 * @swagger
 * /v1/api/login-screen/{id}:
 *   get:
 *     summary: Get login screen by ID
 *     tags: [Login Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Login screen found.
 *       404:
 *         description: Login screen not found.
 *   put:
 *     summary: Update login screen
 *     tags: [Login Screen]
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
 *               loginImg: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Login screen updated successfully.
 *   delete:
 *     summary: Delete login screen
 *     tags: [Login Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Login screen deleted successfully.
 */
router.get("/:id", getLoginScreenById);
router.put("/:id", upload.single("loginImg"), updateLoginScreen);
router.delete("/:id", deleteLoginScreen);

export const loginScreenRouter = router;
