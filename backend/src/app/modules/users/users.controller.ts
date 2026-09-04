import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { Users } from "./users.model";
import { usersSchema } from "./users.validation";

export const createUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      firstName,
      lastName,
      nickName,
      dateOfBirth,
      haveMeetingPlace,
      position,
      gender,
      sexualOrientation,
      interestedIn,
      bio,
    } = req.body;

    // Multiple uploaded images
    const files = req.files as Express.Multer.File[];

    const profileImages = files?.map((file) => file.path) || [];

    if (profileImages.length === 0) {
      return next(new appError("At least one profile image is required", 400));
    }

    // Parse lookingFor
    const lookingFor = req.body.lookingFor
      ? typeof req.body.lookingFor === "string"
        ? JSON.parse(req.body.lookingFor)
        : req.body.lookingFor
      : [];

    const validatedData = usersSchema.parse({
      profileImages,
      firstName,
      lastName,
      nickName,
      dateOfBirth,
      haveMeetingPlace:
        haveMeetingPlace === "true" || haveMeetingPlace === true,
      position,
      gender,
      sexualOrientation,
      interestedIn,
      lookingFor,
      bio,
    });

    const user = await Users.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Users.find({ isDeleted: false })
      .populate("position")
      .populate("gender")
      .populate("sexualOrientation")
      .populate("lookingFor")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        users.length > 0 ? "Users retrieved successfully" : "No users found",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const UsersById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await Users.findById(req.params.id)
      .populate("position")
      .populate("gender")
      .populate("sexualOrientation")
      .populate("lookingFor");

    if (!user) {
      return next(new appError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.id;

    const user = await Users.findById(userId);

    if (!user) {
      return next(new appError("User not found", 404));
    }

    // Uploaded images
    const files = req.files as Express.Multer.File[];

    const profileImages =
      files?.length > 0 ? files.map((file) => file.path) : user.profileImages;

    // Parse lookingFor
    const lookingFor = req.body.lookingFor
      ? typeof req.body.lookingFor === "string"
        ? JSON.parse(req.body.lookingFor)
        : req.body.lookingFor
      : user.lookingFor;

    const payload = {
      profileImages,
      firstName: req.body.firstName ?? user.firstName,
      lastName: req.body.lastName ?? user.lastName,
      nickName: req.body.nickName ?? user.nickName,
      dateOfBirth: req.body.dateOfBirth ?? user.dateOfBirth,
      haveMeetingPlace:
        req.body.haveMeetingPlace !== undefined
          ? req.body.haveMeetingPlace === "true" ||
            req.body.haveMeetingPlace === true
          : user.haveMeetingPlace,
      position: req.body.position ?? user.position,
      gender: req.body.gender ?? user.gender,
      sexualOrientation: req.body.sexualOrientation ?? user.sexualOrientation,
      lookingFor,
      bio: req.body.bio ?? user.bio,
    };

    const validatedData = usersSchema.parse(payload);

    // Delete old images if new ones are uploaded
    if (files?.length > 0) {
      for (const image of user.profileImages) {
        const publicId = image.split("/").pop()?.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    const updatedUser = await Users.findByIdAndUpdate(userId, validatedData, {
      new: true,
      runValidators: true,
    })
      .populate("position")
      .populate("gender")
      .populate("sexualOrientation")
      .populate("lookingFor");

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Users.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!users) {
      next(new appError("Users not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Users deleted successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
