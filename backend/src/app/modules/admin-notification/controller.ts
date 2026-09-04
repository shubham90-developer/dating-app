import { NextFunction, Request, Response } from "express";
import { AdminNotification } from "./model";
import { appError } from "../../errors/appError";

export const getAdminNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.unread === "true") filter.isRead = false;

    const notifications = await AdminNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await AdminNotification.countDocuments({
      isRead: false,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Notifications fetched successfully",
      data: notifications,
      meta: { unreadCount },
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const notification = await AdminNotification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
    if (!notification) return next(new appError("Notification not found", 404));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await AdminNotification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All notifications marked as read",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
