import express from "express";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";
import { getMyLikes } from "./like.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Like
 *   description: >
 *     24-hour "who liked me" feed. Like records here are created automatically
 *     whenever a profile is liked via profiles/{id}/like/{targetId}, and are
 *     auto-deleted from the database 1 day after creation (MongoDB TTL index).
 */

/**
 * @swagger
 * /v1/api/like/{profileId}/me:
 *   get:
 *     summary: Get profiles who liked the given profile (last 24 hours)
 *     description: >
 *       Returns profiles that liked the given profileId, most recent first,
 *       each including firstName, lastName, and photos. Because these records
 *       auto-expire 1 day after creation, this only ever reflects likes
 *       received in the last 24 hours — for the permanent liked-by list, use
 *       GET /profiles/{id}/liked-by instead.
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to fetch recent likes for.
 *     responses:
 *       200:
 *         description: List of profiles who liked you in the last 24 hours, newest first.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Likes retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string, example: "66d88b4ea31a5e0f9c123456" }
 *                       firstName: { type: string, example: "Riya" }
 *                       lastName: { type: string, example: "Shah" }
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: object
 *       400:
 *         description: profileId missing.
 *       401:
 *         description: Invalid/expired Firebase token.
 */
router.get("/:profileId/me", verifyFirebaseToken, getMyLikes);

export const likeRouter = router;
