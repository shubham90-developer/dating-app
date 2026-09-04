// profiles.controller.ts
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { ProfilesModel } from "./profiles.model";
import { profilesSchema, reviewSchema } from "./profiles.validation";
import { generateToken } from "../../config/generateToken";
import { IProfiles } from "./profiles.interface";
import { UserSubscription } from "../userSubscription/userSubscription.model";
import { sendPushToProfile } from "../../config/pushNotificationService";
import { Like } from "../like/like.model";
import initializeFirebaseAdmin from "../../config/firebase-admin";
import { Subscription } from "../subscription/subscription.model";
import { AdminNotification } from "../admin-notification/model";
import { getIO } from "../../config/socket";

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const verifiedPhone = (req as any).firebaseUser?.phone;
    const verifiedUid = (req as any).firebaseUser?.uid;
    if (!verifiedPhone) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Phone not verified",
      });
    }

    // Payment gate — block profile creation until subscription payment is confirmed
    // const activeSub = await UserSubscription.findOne({
    //   firebaseUid: verifiedUid,
    //   status: { $in: ["authenticated", "active", "charged"] },
    // });
    // if (!activeSub) {
    //   return next(
    //     new appError("Please complete payment before creating a profile", 402),
    //   );
    // }

    const {
      firstName,
      lastName,
      nickName,
      birthday,
      placeToMeet,
      position,
      gender,
      sexOrientation,
      interest,
      looking,
      bio,
      height,
      weight,
      location,
      fcmToken,
    } = req.body;

    let parsedLocation;
    try {
      parsedLocation =
        typeof location === "string" ? JSON.parse(location) : location;
    } catch {
      return next(new appError("location must be valid JSON", 400));
    }

    const files = req.files as {
      photos?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
      document?: Express.Multer.File[];
    };

    const existingProfile = await ProfilesModel.findOne({
      phone: verifiedPhone,
    });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "profile already exists with this phone",
      });
    }

    const photos =
      files.photos?.map((file) => ({
        id: new Types.ObjectId().toString(),
        image: file.path,
      })) || [];

    const selfie = files.selfie?.[0]?.path; // single file
    const document = files.document?.[0]?.path; // single file
    if (photos.length === 0) {
      return next(new appError("At least one photo is required", 400));
    }

    const validatedData = profilesSchema.parse({
      photos,
      firstName,
      lastName,
      nickName,
      birthday,
      placeToMeet: placeToMeet === "true" || placeToMeet === true,
      position,
      gender,
      sexOrientation,
      interest,
      looking,
      phone: verifiedPhone,
      bio,
      height,
      weight,
      document,
      selfie,
      location: parsedLocation,
      fcmToken,
    });

    const profile = await ProfilesModel.create({
      ...validatedData,
      firebaseUid: verifiedUid,
    });
    try {
      const notif = await AdminNotification.create({
        type: "new_profile",
        title: "New profile created",
        message: `${profile.firstName} ${profile.lastName} just signed up`,
        profile: profile._id,
      });
      getIO()?.to("admin").emit("new-profile", notif);
    } catch (notifyErr) {
      console.error("Failed to send admin notification:", notifyErr);
    }

    // Link this subscription record to the newly created profile
    // await UserSubscription.updateOne(
    //   { _id: activeSub._id },
    //   { $set: { profile: profile._id } },
    // );

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    const files = req.files as Express.Multer.File[];

    if (files?.length) {
      for (const file of files) {
        if (file.filename) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }
    }

    next(error);
  }
};

export const adminCreateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firebaseToken, subscriptionPlanId } = req.body;

    if (!firebaseToken) {
      return next(
        new appError(
          "firebaseToken is required to verify the user's phone number",
          400,
        ),
      );
    }
    if (!subscriptionPlanId) {
      return next(new appError("subscriptionPlanId is required", 400));
    }

    const firebaseAdmin = initializeFirebaseAdmin();
    let decoded;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(firebaseToken);
    } catch (err: any) {
      return next(new appError("Invalid or expired Firebase token", 401));
    }

    if (!decoded.phone_number) {
      return next(
        new appError("Token does not contain a verified phone number", 401),
      );
    }

    const verifiedPhone = decoded.phone_number;
    const verifiedUid = decoded.uid;
    // no payment check here

    // Validate the selected plan exists before doing any profile creation work
    const plan = await Subscription.findOne({
      _id: subscriptionPlanId,
      isDeleted: false,
    });
    if (!plan) {
      return next(new appError("Selected subscription plan not found", 404));
    }

    const {
      firstName,
      lastName,
      nickName,
      birthday,
      placeToMeet,
      position,
      gender,
      sexOrientation,
      interest,
      looking,
      bio,
      height,
      weight,
      location,
      fcmToken,
    } = req.body;

    let parsedLocation;
    try {
      parsedLocation =
        typeof location === "string" ? JSON.parse(location) : location;
    } catch {
      return next(new appError("location must be valid JSON", 400));
    }

    const files = req.files as {
      photos?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
      document?: Express.Multer.File[];
    };

    const existingProfile = await ProfilesModel.findOne({
      phone: verifiedPhone,
    });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "profile already exists with this phone",
      });
    }

    const photos =
      files.photos?.map((file) => ({
        id: new Types.ObjectId().toString(),
        image: file.path,
      })) || [];
    const selfie = files.selfie?.[0]?.path;
    const document = files.document?.[0]?.path;
    if (photos.length === 0) {
      return next(new appError("At least one photo is required", 400));
    }

    const validatedData = profilesSchema.parse({
      photos,
      firstName,
      lastName,
      nickName,
      birthday,
      placeToMeet: placeToMeet === "true" || placeToMeet === true,
      position,
      gender,
      sexOrientation,
      interest,
      looking,
      phone: verifiedPhone,
      bio,
      height,
      weight,
      document,
      selfie,
      location: parsedLocation,
      fcmToken: fcmToken || "admin-created",
    });

    const profile = await ProfilesModel.create({
      ...validatedData,
      firebaseUid: verifiedUid,
    });
    try {
      const notif = await AdminNotification.create({
        type: "new_profile",
        title: "New profile created",
        message: `${profile.firstName} ${profile.lastName} just signed up`,
        profile: profile._id,
      });
      getIO()?.to("admin").emit("new-profile", notif);
    } catch (notifyErr) {
      console.error("Failed to send admin notification:", notifyErr);
    }

    // Link a real plan, but mark it as admin-granted — no payment collected.
    await UserSubscription.create({
      profile: profile._id,
      firebaseUid: verifiedUid,
      phone: verifiedPhone,
      subscriptionPlan: plan._id,
      razorpayPlanId: "ADMIN_GRANTED",
      razorpaySubscriptionId: `admin_${profile._id}`,
      amount: 0,
      authAmount: 0,
      startAt: new Date(),
      status: "active",
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Profile created successfully by admin",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hasPagination =
      req.query.page !== undefined || req.query.limit !== undefined;

    const query = ProfilesModel.find()
      .populate("position")
      .populate("gender")
      .populate("sexOrientation")
      .populate("looking")
      .sort({ createdAt: -1 });

    let profiles;
    let meta:
      | { page: number; limit: number; total: number; totalPages: number }
      | undefined;

    if (hasPagination) {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.max(Number(req.query.limit) || 20, 1);
      const skip = (page - 1) * limit;

      const [paginatedProfiles, total] = await Promise.all([
        query.skip(skip).limit(limit),
        ProfilesModel.countDocuments(),
      ]);

      profiles = paginatedProfiles;
      meta = { page, limit, total, totalPages: Math.ceil(total / limit) };
    } else {
      profiles = await query;
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        profiles.length > 0
          ? "Profiles retrieved successfully"
          : "No profiles found",
      data: profiles,
      ...(meta && { meta }),
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findById(req.params.id)
      .populate("position")
      .populate("gender")
      .populate("sexOrientation")
      .populate("looking");

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profileId = req.params.id;

    const profile = await ProfilesModel.findById(profileId);

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    // req.files is now an object (from upload.fields), not an array
    const files = req.files as {
      photos?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
      document?: Express.Multer.File[];
    };

    const hasNewPhotos = (files?.photos?.length ?? 0) > 0;

    const photos = hasNewPhotos
      ? files!.photos!.map((file) => ({
          id: new Types.ObjectId().toString(),
          image: file.path,
        }))
      : profile.photos;

    const selfie = files?.selfie?.[0]?.path ?? profile.selfie;
    const document = files?.document?.[0]?.path ?? profile.document;

    const payload = {
      photos,
      selfie,
      document,
      firstName: req.body.firstName || profile.firstName,
      lastName: req.body.lastName || profile.lastName,
      nickName: req.body.nickName || profile.nickName,
      birthday: req.body.birthday || profile.birthday,
      placeToMeet:
        req.body.placeToMeet !== undefined
          ? req.body.placeToMeet === "true" || req.body.placeToMeet === true
          : profile.placeToMeet,

      // Cast ObjectId fallbacks to string
      position: req.body.position || profile.position?.toString(),
      gender: req.body.gender || profile.gender?.toString(),
      sexOrientation:
        req.body.sexOrientation || profile.sexOrientation?.toString(),
      looking: req.body.looking || profile.looking?.toString(),
      location: req.body.location
        ? typeof req.body.location === "string"
          ? JSON.parse(req.body.location)
          : req.body.location
        : profile.location,
      interest: req.body.interest ?? profile.interest,
      phone: String(profile.phone),
      bio: req.body.bio ?? profile.bio,
      height: req.body.height ?? profile.height,
      weight: req.body.weight ?? profile.weight,
      fcmToken: req.body.fcmToken ?? profile.fcmToken,
    };

    const validatedData = profilesSchema.parse(payload);

    // Clean up old Cloudinary assets only for what was actually replaced
    const filesToDelete: string[] = [];

    if (hasNewPhotos) {
      filesToDelete.push(
        ...profile.photos.map((p) => p.image.split("/").pop()?.split(".")[0]!),
      );
    }
    if (files?.selfie?.[0] && profile.selfie) {
      filesToDelete.push(profile.selfie.split("/").pop()?.split(".")[0]!);
    }
    if (files?.document?.[0] && profile.document) {
      filesToDelete.push(profile.document.split("/").pop()?.split(".")[0]!);
    }

    const updatedProfile = await ProfilesModel.findByIdAndUpdate(
      profileId,
      validatedData,
      { new: true, runValidators: true },
    )
      .populate("position")
      .populate("gender")
      .populate("sexOrientation")
      .populate("looking");

    if (filesToDelete.length > 0) {
      Promise.all(
        filesToDelete.map((id) => cloudinary.uploader.destroy(id)),
      ).catch((err) => console.error("Cleanup failed:", err));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Profile deleted successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const likeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params as { id: string; targetId: string };

    if (id === targetId) {
      return next(new appError("You cannot like your own profile", 400));
    }

    const targetProfile = await ProfilesModel.findById(targetId);
    if (!targetProfile) {
      return next(new appError("Target profile not found", 404));
    }

    const alreadyLiked = targetProfile.likedBy.some(
      (likerId) => likerId.toString() === id,
    );
    if (alreadyLiked) {
      return next(new appError("You already liked this profile", 400));
    }

    const [profile, likerProfile] = await Promise.all([
      ProfilesModel.findByIdAndUpdate(
        targetId,
        {
          $addToSet: { likedBy: id },
          $inc: { likes: 1 },
        },
        { new: true },
      ),
      ProfilesModel.findByIdAndUpdate(id, {
        $addToSet: { likedProfiles: targetId },
      }),
      Like.findOneAndUpdate(
        { liker: id, likedProfile: targetId },
        { liker: id, likedProfile: targetId },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ),
    ]);
    sendPushToProfile(
      targetId,
      "New Like! ❤️",
      `${likerProfile?.firstName || "Someone"} liked your profile`,
      { type: "like", fromProfileId: id },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile liked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params;

    if (id === targetId) {
      return next(new appError("You cannot unlike your own profile", 400));
    }

    const targetProfile = await ProfilesModel.findById(targetId);
    if (!targetProfile) {
      return next(new appError("Target profile not found", 404));
    }

    const alreadyLiked = targetProfile.likedBy.some(
      (likerId) => likerId.toString() === id,
    );
    if (!alreadyLiked) {
      return next(new appError("You have not liked this profile", 400));
    }

    const [profile] = await Promise.all([
      ProfilesModel.findByIdAndUpdate(
        targetId,
        {
          $pull: { likedBy: id },
          $inc: { likes: -1 },
        },
        { new: true },
      ),
      ProfilesModel.findByIdAndUpdate(id, {
        $pull: { likedProfiles: targetId },
      }),
    ]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile unliked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get all profiles liked by a given profile
export const getLikedProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const profile = await ProfilesModel.findById(id).populate("likedProfiles");

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Liked profiles retrieved successfully",
      data: profile.likedProfiles,
    });
  } catch (error) {
    next(error);
  }
};

// Save a profile
export const saveProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params;

    if (id === targetId) {
      return next(new appError("You cannot save your own profile", 400));
    }

    const targetProfile = await ProfilesModel.findById(targetId);
    if (!targetProfile) {
      return next(new appError("Target profile not found", 404));
    }

    const profile = await ProfilesModel.findByIdAndUpdate(
      id,
      { $addToSet: { savedProfiles: targetId } },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Unsave a profile
export const unsaveProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params;

    const profile = await ProfilesModel.findByIdAndUpdate(
      id,
      { $pull: { savedProfiles: targetId } },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile unsaved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get all profiles saved by a given profile
export const getSavedProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const profile = await ProfilesModel.findById(id).populate("savedProfiles");

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Saved profiles retrieved successfully",
      data: profile.savedProfiles,
    });
  } catch (error) {
    next(error);
  }
};

// Block a profile
export const blockProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params;

    if (id === targetId) {
      return next(new appError("You cannot block your own profile", 400));
    }

    const targetProfile = await ProfilesModel.findById(targetId);
    if (!targetProfile) {
      return next(new appError("Target profile not found", 404));
    }

    const profile = await ProfilesModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { blockedProfiles: targetId },
        // blocking implies un-liking/un-saving each other, optional but common
        $pull: { likedProfiles: targetId, savedProfiles: targetId },
      },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile blocked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Unblock a profile
export const unblockProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, targetId } = req.params;

    const profile = await ProfilesModel.findByIdAndUpdate(
      id,
      { $pull: { blockedProfiles: targetId } },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile unblocked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Get all profiles blocked by a given profile
export const getBlockedProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findById(req.params.id).populate(
      "blockedProfiles",
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blocked profiles retrieved successfully",
      data: profile.blockedProfiles,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: verify a profile
export const verifyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile verified successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: reject/unverify a profile
export const unverifyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile verification revoked",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const filterProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { lat, lng, distance, minAge, maxAge } = req.query;

    const hasCoords = lat !== undefined && lng !== undefined;

    const latitude = hasCoords ? parseFloat(lat as string) : undefined;
    const longitude = hasCoords ? parseFloat(lng as string) : undefined;

    if (hasCoords && (isNaN(latitude!) || isNaN(longitude!))) {
      return next(new appError("lat and lng must be valid numbers", 400));
    }

    const pipeline: any[] = [];

    if (hasCoords) {
      const maxDistanceMeters = distance
        ? parseFloat(distance as string) * 1000
        : undefined;

      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [longitude, latitude] },
          distanceField: "distance",
          ...(maxDistanceMeters !== undefined && {
            maxDistance: maxDistanceMeters,
          }),
          spherical: true,
        },
      });
    }

    pipeline.push({
      $addFields: {
        ...(hasCoords && {
          distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 2] },
        }),
        age: {
          $dateDiff: {
            startDate: "$birthday",
            endDate: "$$NOW",
            unit: "year",
          },
        },
      },
    });

    // --- Age range filter (minAge / maxAge) ---
    if (minAge !== undefined || maxAge !== undefined) {
      const parsedMinAge =
        minAge !== undefined ? parseInt(minAge as string, 10) : undefined;
      const parsedMaxAge =
        maxAge !== undefined ? parseInt(maxAge as string, 10) : undefined;

      if (
        (parsedMinAge !== undefined && isNaN(parsedMinAge)) ||
        (parsedMaxAge !== undefined && isNaN(parsedMaxAge))
      ) {
        return next(
          new appError("minAge and maxAge must be valid numbers", 400),
        );
      }

      const ageMatch: Record<string, number> = {};
      if (parsedMinAge !== undefined) ageMatch.$gte = parsedMinAge;
      if (parsedMaxAge !== undefined) ageMatch.$lte = parsedMaxAge;

      pipeline.push({ $match: { age: ageMatch } });
    }

    if (!hasCoords) {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const profiles = await ProfilesModel.aggregate<
      IProfiles & {
        distance?: number;
        distanceKm?: number;
        age: number;
      }
    >(pipeline);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        profiles.length > 0
          ? "Profiles retrieved successfully"
          : "No profiles found",
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

// Add a review — reviewerId writes a review on profile `id`
export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, reviewerId } = req.params as { id: string; reviewerId: string };

    if (id === reviewerId) {
      return next(new appError("You cannot review your own profile", 400));
    }

    const reviewer = await ProfilesModel.findById(reviewerId);
    if (!reviewer) {
      return next(new appError("Reviewer profile not found", 404));
    }

    const targetProfile = await ProfilesModel.findById(id);
    if (!targetProfile) {
      return next(new appError("Profile not found", 404));
    }

    const validatedData = reviewSchema.parse(req.body);

    const alreadyReviewed = targetProfile.reviews.some(
      (r) => r.id.toString() === reviewerId,
    );
    if (alreadyReviewed) {
      return next(new appError("You already reviewed this profile", 400));
    }

    targetProfile.reviews.push({
      id: new Types.ObjectId(reviewerId),
      review: validatedData.review,
    } as any);

    await targetProfile.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Review added successfully",
      data: targetProfile.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews for a profile, with reviewer's name & photo populated
export const getProfileReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findById(req.params.id)
      .select("reviews")
      .populate({
        path: "reviews.id",
        select: "firstName lastName photos",
      });

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Reviews retrieved successfully",
      data: profile.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get all profiles that liked a given profile ("who liked me")
export const getProfilesWhoLikedMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const profile = await ProfilesModel.findById(id).populate({
      path: "likedBy",
      select: "firstName lastName photos",
    });

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profiles who liked you retrieved successfully",
      data: profile.likedBy,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFcmToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken || typeof fcmToken !== "string") {
      return next(new appError("fcmToken is required", 400));
    }

    const profile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { fcmToken },
      { new: true, runValidators: true },
    ).select("_id fcmToken");

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "FCM token updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

    const [
      totalUsers,
      verifiedUsers,
      todayUsers,
      totalRevenueAgg,
      todayRevenueAgg,
    ] = await Promise.all([
      ProfilesModel.countDocuments(),
      ProfilesModel.countDocuments({ isVerified: true }),
      ProfilesModel.countDocuments({ createdAt: { $gte: startOfToday } }),
      UserSubscription.aggregate([
        { $match: { status: "charged" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      UserSubscription.aggregate([
        { $match: { status: "charged", createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        todayUsers,
        verifiedUsers,
        blockedUsers: 0, // pending — admin-block feature not built yet
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        todayRevenue: todayRevenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: block a profile (prevents platform access)
export const adminBlockProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile blocked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: unblock a profile
export const adminUnblockProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profile = await ProfilesModel.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true },
    );

    if (!profile) {
      return next(new appError("Profile not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile unblocked successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
