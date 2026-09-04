// profiles.route.ts
import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createProfile,
  deleteProfileById,
  getAllProfiles,
  getProfileById,
  updateProfileById,
  verifyProfile,
  unblockProfile,
  blockProfile,
  unlikeProfile,
  unverifyProfile,
  getBlockedProfiles,
  likeProfile,
  getLikedProfiles,
  saveProfile,
  unsaveProfile,
  getSavedProfiles,
  filterProfiles,
  addReview,
  getProfileReviews,
  getProfilesWhoLikedMe,
  updateFcmToken,
  adminCreateProfile,
  getDashboardStats,
  adminBlockProfile,
  adminUnblockProfile,
} from "./profiles.controllers";
import { verifyAdminToken } from "../../middlewares/verifyAdminToken";
import { verifyFirebaseToken } from "../../middlewares/verifyPhone";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Firebase ID token obtained on the client after phone OTP verification. Send as `Authorization: Bearer <idToken>`.
 *   schemas:
 *     ProfilePhoto:
 *       type: object
 *       properties:
 *         id: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *         image: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/profiles/photo1.jpg" }
 *     ProfileReview:
 *       type: object
 *       properties:
 *         id: { type: string, description: "Profile ID of the reviewer", example: 64f1a2b3c4d5e6f7a8b9c0d9 }
 *         review: { type: string, example: "Great person, had a lovely time!" }
 *     Profile:
 *       type: object
 *       properties:
 *         _id: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d1 }
 *         phone: { type: number, example: 9876543210, description: "Unique phone number for the profile, sourced from the verified Firebase token" }
 *         photos:
 *           type: array
 *           items: { $ref: '#/components/schemas/ProfilePhoto' }
 *         firstName: { type: string, example: John }
 *         lastName: { type: string, example: Doe }
 *         nickName: { type: string, example: Johnny }
 *         birthday: { type: string, format: date, example: "1998-05-20" }
 *         placeToMeet: { type: boolean, example: true, description: "Whether the user is open to meeting in person" }
 *         position: { type: string, description: "Position ObjectId reference", example: 64f1a2b3c4d5e6f7a8b9c0d2 }
 *         gender: { type: string, description: "Gender ObjectId reference", example: 64f1a2b3c4d5e6f7a8b9c0d3 }
 *         sexOrientation: { type: string, description: "Sexual orientation ObjectId reference", example: 64f1a2b3c4d5e6f7a8b9c0d4 }
 *         interest: { type: string, example: "Hiking, Movies" }
 *         looking: { type: string, description: "Looking-for (Interest) ObjectId reference", example: 64f1a2b3c4d5e6f7a8b9c0d5 }
 *         location:
 *           type: object
 *           description: "GeoJSON Point — profile's coordinates"
 *           properties:
 *             type: { type: string, enum: [Point], example: Point }
 *             coordinates:
 *               type: array
 *               items: { type: number }
 *               minItems: 2
 *               maxItems: 2
 *               description: "[longitude, latitude]"
 *               example: [73.8567, 18.5204]
 *         bio: { type: string, example: "Coffee lover and weekend traveller.", maxLength: 500 }
 *         height: { type: string, example: "5'9\"" }
 *         weight: { type: string, example: "70kg" }
 *         likedProfiles:
 *           type: array
 *           items: { type: string }
 *           description: "Array of profile IDs liked by this profile"
 *         savedProfiles:
 *           type: array
 *           items: { type: string }
 *           description: "Array of profile IDs saved by this profile"
 *         blockedProfiles:
 *           type: array
 *           items: { type: string }
 *           description: "Array of profile IDs blocked by this profile"
 *         selfie: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/profiles/selfie.jpg" }
 *         document: { type: string, format: uri, example: "https://res.cloudinary.com/demo/image/upload/v1/profiles/document.pdf" }
 *         isVerified: { type: boolean, example: false }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     ProfileSuccessResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "Profile retrieved successfully" }
 *         data: { $ref: '#/components/schemas/Profile' }
 *     ProfileListResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         statusCode: { type: integer, example: 200 }
 *         message: { type: string, example: "Profiles retrieved successfully" }
 *         data:
 *           type: array
 *           items: { $ref: '#/components/schemas/Profile' }
 *     ProfileErrorResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         statusCode: { type: integer, example: 400 }
 *         message: { type: string, example: "Validation error" }
 */

const profileUpload = upload.fields([
  { name: "photos", maxCount: 6 },
  { name: "selfie", maxCount: 1 },
  { name: "document", maxCount: 1 },
]);

const router = express.Router();

/**
 * @swagger
 * /v1/api/profiles/{id}/block/{targetId}:
 *   post:
 *     summary: Block a profile
 *     description: |
 *       Adds `targetId` to the caller profile's blocked list.
 *       Blocking also removes the target from the `likedProfiles` and `savedProfiles` lists on both sides.
 *       A profile cannot block itself.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the block
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be blocked
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Blocked successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       400:
 *         description: Cannot block your own profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       404:
 *         description: Profile or target profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *   delete:
 *     summary: Unblock a profile
 *     description: Removes `targetId` from the caller profile's blocked list.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the unblock
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be unblocked
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Unblocked successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */

router.post(
  "/admin-create",
  verifyAdminToken,
  profileUpload,
  adminCreateProfile,
);
router.patch("/:id/admin-block", verifyAdminToken, adminBlockProfile);
router.patch("/:id/admin-unblock", verifyAdminToken, adminUnblockProfile);
router.get("/admin/dashboard-stats", verifyAdminToken, getDashboardStats);
router.get("/admin/all", verifyAdminToken, getAllProfiles);
router.get("/admin/:id", verifyAdminToken, getProfileById);
router.put("/admin/:id", verifyAdminToken, profileUpload, updateProfileById);
router.delete("/admin/:id", verifyAdminToken, deleteProfileById);

router.post("/:id/block/:targetId", verifyFirebaseToken, blockProfile);
router.delete("/:id/block/:targetId", verifyFirebaseToken, unblockProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/blocked:
 *   get:
 *     summary: Get blocked profiles list
 *     description: Returns the list of profiles blocked by the given profile, populated with full profile data.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Blocked profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Blocked profiles retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Profile' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.get("/:id/blocked", verifyFirebaseToken, getBlockedProfiles);

/**
 * @swagger
 * /v1/api/profiles/{id}/verify:
 *   patch:
 *     summary: Verify profile (Admin)
 *     description: Sets `isVerified` to `true` on the given profile. Typically used by an admin after reviewing the uploaded selfie/document.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Verified successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.patch("/:id/verify", verifyAdminToken, verifyProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/unverify:
 *   patch:
 *     summary: Unverify profile (Admin)
 *     description: Sets `isVerified` to `false` on the given profile, revoking a previous verification.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Profile verification revoked
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.patch("/:id/unverify", verifyAdminToken, unverifyProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/like/{targetId}:
 *   patch:
 *     summary: Like a profile
 *     description: |
 *       Adds `targetId` to the caller profile's `likedProfiles` list.
 *       A profile cannot like itself, and a blocked profile cannot be liked.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the like
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be liked
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Liked successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       400:
 *         description: Cannot like your own profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       404:
 *         description: Profile or target profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.patch("/:id/like/:targetId", verifyFirebaseToken, likeProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/unlike/{targetId}:
 *   patch:
 *     summary: Unlike a profile
 *     description: Removes `targetId` from the caller profile's `likedProfiles` list.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the unlike
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be unliked
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Unliked successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.patch("/:id/unlike/:targetId", verifyFirebaseToken, unlikeProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/liked:
 *   get:
 *     summary: Get liked profiles list
 *     description: Returns the list of profiles liked by the given profile, populated with full profile data.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Liked profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Liked profiles retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Profile' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.get("/:id/liked", verifyFirebaseToken, getLikedProfiles);

/**
 * @swagger
 * /v1/api/profiles/{id}/save/{targetId}:
 *   patch:
 *     summary: Save a profile
 *     description: Adds `targetId` to the caller profile's `savedProfiles` list.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the save
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be saved
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Saved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       400:
 *         description: Cannot save your own profile
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       404:
 *         description: Profile or target profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.patch("/:id/save/:targetId", verifyFirebaseToken, saveProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/save/{targetId}:
 *   delete:
 *     summary: Unsave a profile
 *     description: Removes `targetId` from the caller profile's `savedProfiles` list.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID performing the unsave
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID to be unsaved
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     responses:
 *       200:
 *         description: Unsaved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.delete("/:id/save/:targetId", verifyFirebaseToken, unsaveProfile);

/**
 * @swagger
 * /v1/api/profiles/{id}/saved:
 *   get:
 *     summary: Get saved profiles list
 *     description: Returns the list of profiles saved by the given profile, populated with full profile data.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Saved profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Saved profiles retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Profile' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.get("/:id/saved", verifyFirebaseToken, getSavedProfiles);

/**
 * @swagger
 * /v1/api/profiles/{id}/reviews/{reviewerId}:
 *   post:
 *     summary: Add a review to a profile
 *     description: |
 *       Adds a review from `reviewerId` onto profile `id`.
 *       A profile cannot review itself, and a reviewer can only leave one review per profile.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID being reviewed
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *       - in: path
 *         name: reviewerId
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID of the reviewer
 *         example: 64f1a2b3c4d5e6f7a8b9c0d9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [review]
 *             properties:
 *               review: { type: string, example: "Great person, had a lovely time!" }
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: "Review added successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ProfileReview' }
 *       400:
 *         description: Cannot review own profile / already reviewed / validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       404:
 *         description: Profile or reviewer not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.post("/:id/reviews/:reviewerId", verifyFirebaseToken, addReview);

/**
 * @swagger
 * /v1/api/profiles/{id}/reviews:
 *   get:
 *     summary: Get reviews for a profile
 *     description: Returns all reviews for the given profile, with each reviewer's `firstName`, `lastName`, and `photos` populated.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Reviews retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ProfileReview' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
router.get("/:id/reviews", verifyFirebaseToken, getProfileReviews);

/**
 * @swagger
 * /v1/api/profiles:
 *   post:
 *     summary: Create profile
 *     description: |
 *       Creates a new dating profile. Requires a valid Firebase ID token (Bearer) — the phone number is
 *       taken from the verified token, not from the request body, so it cannot be spoofed.
 *       At least one photo is required.
 *       `position`, `gender`, `sexOrientation` and `looking` must be valid ObjectIds referencing their respective master data collections.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - nickName
 *               - birthday
 *               - position
 *               - gender
 *               - sexOrientation
 *               - looking
 *               - location
 *               - photos
 *             properties:
 *               firstName: { type: string, example: John }
 *               lastName: { type: string, example: Doe }
 *               nickName: { type: string, example: Johnny }
 *               birthday: { type: string, format: date, example: "1998-05-20" }
 *               placeToMeet: { type: boolean, example: true }
 *               position: { type: string, description: "Position ObjectId", example: 64f1a2b3c4d5e6f7a8b9c0d2 }
 *               gender: { type: string, description: "Gender ObjectId", example: 64f1a2b3c4d5e6f7a8b9c0d3 }
 *               sexOrientation: { type: string, description: "Sexual orientation ObjectId", example: 64f1a2b3c4d5e6f7a8b9c0d4 }
 *               interest: { type: string, example: "Hiking, Movies" }
 *               looking: { type: string, description: "Looking-for (Interest) ObjectId", example: 64f1a2b3c4d5e6f7a8b9c0d5 }
 *               location:
 *                 type: string
 *                 description: |
 *                   GeoJSON Point as a JSON string (multipart/form-data can't send nested objects directly).
 *                   Coordinates are [longitude, latitude].
 *                 example: '{"type":"Point","coordinates":[73.8567,18.5204]}'
 *               bio: { type: string, example: "Coffee lover and weekend traveller." }
 *               height: { type: string, example: "5'9\"" }
 *               weight: { type: string, example: "70kg" }
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: Up to 6 profile photos (at least 1 required)
 *               selfie: { type: string, format: binary, description: "Single selfie image for verification" }
 *               document: { type: string, format: binary, description: "Single ID document for verification" }
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       400:
 *         description: Validation error / missing photo
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       401:
 *         description: Missing, invalid, or expired Firebase ID token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       409:
 *         description: A profile already exists with this phone number
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *   get:
 *     summary: Get all profiles
 *     description: Returns all profiles sorted by most recently created, with `position`, `gender`, `sexOrientation` and `looking` populated.
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileListResponse' }
 */
router.post("/", verifyFirebaseToken, profileUpload, createProfile);
router.get("/", verifyFirebaseToken, getAllProfiles);

/**
 * @swagger
 * /v1/api/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     description: Returns a single profile with `position`, `gender`, `sexOrientation` and `looking` populated.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *   put:
 *     summary: Update profile
 *     description: |
 *       Partially updates a profile. Requires a valid Firebase ID token (Bearer).
 *       Any field omitted keeps its previous value.
 *       If new `photos` are uploaded, all existing photos are replaced and the old Cloudinary assets are cleaned up.
 *       The same applies independently to `selfie` and `document`.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string, example: John }
 *               lastName: { type: string, example: Doe }
 *               nickName: { type: string, example: Johnny }
 *               birthday: { type: string, format: date, example: "1998-05-20" }
 *               placeToMeet: { type: boolean, example: true }
 *               position: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d2 }
 *               gender: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d3 }
 *               sexOrientation: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d4 }
 *               interest: { type: string, example: "Hiking, Movies" }
 *               looking: { type: string, example: 64f1a2b3c4d5e6f7a8b9c0d5 }
 *               location:
 *                 type: string
 *                 description: |
 *                   GeoJSON Point as a JSON string. Coordinates are [longitude, latitude].
 *                 example: '{"type":"Point","coordinates":[73.8567,18.5204]}'
 *               bio: { type: string, example: "Coffee lover and weekend traveller." }
 *               height: { type: string, example: "5'9\"" }
 *               weight: { type: string, example: "70kg" }
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: Replaces all existing photos if provided
 *               selfie: { type: string, format: binary }
 *               document: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       401:
 *         description: Missing, invalid, or expired Firebase ID token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 *   delete:
 *     summary: Delete profile
 *     description: Permanently deletes a profile document. Does not currently remove associated Cloudinary assets.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileSuccessResponse' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */

/**
 * @swagger
 * /v1/api/profiles/filter:
 *   get:
 *     summary: Filter profiles by age range and distance
 *     description: |
 *       Returns profiles filtered by age range and/or distance from given coordinates.
 *       All query parameters are optional.
 *       - If `lat`/`lng` are provided, results are sorted by proximity (nearest first) and include a computed `distanceKm` field.
 *       - If `distance` is provided without `lat`/`lng`, it is ignored (no radius without a reference point).
 *       - If `lat`/`lng` are provided without `distance`, all profiles are returned sorted by proximity with no radius cap.
 *       - `minAge` and `maxAge` filter profiles within an age range, computed from `birthday`. Either can be provided alone or together.
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: false
 *         schema: { type: number }
 *         description: Latitude of the reference point
 *         example: 18.5204
 *       - in: query
 *         name: lng
 *         required: false
 *         schema: { type: number }
 *         description: Longitude of the reference point
 *         example: 73.8567
 *       - in: query
 *         name: distance
 *         required: false
 *         schema: { type: number }
 *         description: Max distance in kilometers from the given lat/lng
 *         example: 25
 *       - in: query
 *         name: minAge
 *         required: false
 *         schema: { type: integer }
 *         description: Minimum age to filter by (inclusive), computed from birthday
 *         example: 21
 *       - in: query
 *         name: maxAge
 *         required: false
 *         schema: { type: integer }
 *         description: Maximum age to filter by (inclusive), computed from birthday
 *         example: 35
 *     responses:
 *       200:
 *         description: Profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Profiles retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Profile'
 *                       - type: object
 *                         properties:
 *                           age: { type: integer, example: 25 }
 *                           distanceKm: { type: number, example: 4.32 }
 *       400:
 *         description: Invalid lat, lng, minAge, or maxAge value
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
/**
 * @swagger
 * /v1/api/profiles/{id}/liked-by:
 *   get:
 *     summary: Get profiles who liked me
 *     description: Returns the list of profiles that liked the given profile, populated with full profile data.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Profile ID
 *         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       200:
 *         description: Profiles who liked you retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: "Profiles who liked you retrieved successfully" }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Profile' }
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProfileErrorResponse' }
 */
/**
 * @swagger
 * /v1/api/profiles/{id}/fcm-token:
 *   patch:
 *     summary: Update FCM token for a profile
 *     description: Updates the push-notification token stored on a profile. Call after login on any device (and on Firebase's onTokenRefresh) so pushes always reach the latest device.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fcmToken]
 *             properties:
 *               fcmToken: { type: string }
 *     responses:
 *       200:
 *         description: FCM token updated successfully
 *       400:
 *         description: fcmToken missing or invalid
 *       404:
 *         description: Profile not found
 */
router.patch("/:id/fcm-token", verifyFirebaseToken, updateFcmToken);
router.get("/:id/liked-by", verifyFirebaseToken, getProfilesWhoLikedMe);
router.get("/filter", verifyFirebaseToken, filterProfiles);
router.get("/:id", verifyFirebaseToken, getProfileById);
router.put("/:id", verifyFirebaseToken, profileUpload, updateProfileById);
router.delete("/:id", verifyFirebaseToken, deleteProfileById);

export const profilesRouter = router;
