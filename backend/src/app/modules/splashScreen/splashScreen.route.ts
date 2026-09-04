import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createSplashScreen,
  deleteSplashScreen,
  getAllSplashScreen,
  getSplashScreenById,
  updateSplashScreen,
} from "./splashScreen.controller";

const router = express.Router();

/**
 * @swagger
 * /v1/api/splash-screen:
 *   post:
 *     summary: Create splash screen
 *     description: Uploads a splash screen image shown when the app launches.
 *     tags: [Splash Screen]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               splashImg:
 *                 type: string
 *                 format: binary
 *                 description: Splash screen image file
 *     responses:
 *       201:
 *         description: Splash screen created successfully.
 *       400:
 *         description: Validation error.
 *   get:
 *     summary: Get all splash screens
 *     description: Retrieves the list of splash screen entries.
 *     tags: [Splash Screen]
 *     responses:
 *       200:
 *         description: Splash screens retrieved successfully.
 */
router.post("/", upload.single("splashImg"), createSplashScreen);
router.get("/", getAllSplashScreen);

/**
 * @swagger
 * /v1/api/splash-screen/{id}:
 *   get:
 *     summary: Get splash screen by ID
 *     tags: [Splash Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Splash screen found.
 *       404:
 *         description: Splash screen not found.
 *   put:
 *     summary: Update splash screen
 *     tags: [Splash Screen]
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
 *               splashImg:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Splash screen updated successfully.
 *       404:
 *         description: Splash screen not found.
 *   delete:
 *     summary: Delete splash screen
 *     tags: [Splash Screen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "66d88b4ea31a5e0f9c123456"
 *     responses:
 *       200:
 *         description: Splash screen deleted successfully.
 */
router.get("/:id", getSplashScreenById);
router.put("/:id", upload.single("splashImg"), updateSplashScreen);
router.delete("/:id", deleteSplashScreen);

export const splashScreenRouter = router;
