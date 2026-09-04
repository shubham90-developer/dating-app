import express from "express";
import { upload } from "../../config/cloudinary";
import { verifyAdminToken } from "../../middlewares/verifyAdminToken";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "./admin.controller";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", verifyAdminToken, adminMiddleware, getAdminProfile);
router.put(
  "/me",
  verifyAdminToken,
  adminMiddleware,
  upload.single("avatar"),
  updateAdminProfile,
);

export const adminRouter = router;
