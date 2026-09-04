import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Like } from "./like.model";

export const getMyLikes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { profileId } = req.params as { profileId: string };
    if (!profileId) return next(new appError("profileId is required", 400));

    // Only likes still within the 1-day TTL window exist in the DB —
    // MongoDB auto-deletes older docs.
    const likes = await Like.find({ likedProfile: profileId })
      .populate("liker", "firstName lastName photos")
      .sort({ createdAt: -1 });

    const likerProfiles = likes.map((like: any) => like.liker);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Likes retrieved successfully",
      data: likerProfiles,
    });
  } catch (error) {
    next(error);
  }
};
