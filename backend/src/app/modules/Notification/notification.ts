import { NextFunction, Request, Response } from "express";
import initializeFirebaseAdmin from "../../config/firebase-admin";
import { appError } from "../../errors/appError";
import { ProfilesModel } from "../profiles/profiles.model";

export const sendPushNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profileId, title, body, data } = req.body as {
      profileId: string;
      title: string;
      body: string;
      data?: Record<string, string>;
    };

    const profile = await ProfilesModel.findById(profileId);
    if (!profile) return next(new appError("Profile not found", 404));
    if (!profile.fcmToken)
      return next(new appError("No FCM token for this profile", 400));

    const admin = initializeFirebaseAdmin();

    const response = await admin.messaging().send({
      token: profile.fcmToken,
      notification: { title, body },
      data: data || {},
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Notification sent successfully",
      data: { messageId: response },
    });
  } catch (error) {
    next(error);
  }
};
