import express from "express";
import { verifyAdminToken } from "../../middlewares/verifyAdminToken";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./controller";

const router = express.Router();

router.get("/", verifyAdminToken, adminMiddleware, getAdminNotifications);
router.patch(
  "/:id/read",
  verifyAdminToken,
  adminMiddleware,
  markNotificationRead,
);
router.patch(
  "/read-all",
  verifyAdminToken,
  adminMiddleware,
  markAllNotificationsRead,
);

export const adminNotificationRouter = router;
