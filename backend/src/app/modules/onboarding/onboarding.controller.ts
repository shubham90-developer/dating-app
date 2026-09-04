import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { onboardingSchema } from "./onboarding.validation";
import { Onboarding } from "./onboarding.model";

export const createOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subTitle } = req.body;

    const img = req.file?.path;

    if (!img) {
      return next(new appError("img is required", 400));
    }

    // existing
    const exixtingOnboarding = await Onboarding.findOne({
      title,
      subTitle,
      img,
    });

    if (exixtingOnboarding) {
      return next(new appError("Onboarding already exists", 400));
    }

    const validateData = onboardingSchema.parse({
      title,
      subTitle,
      img,
    });

    const onboarding = await Onboarding.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "onboarding created successfully",
      data: onboarding,
    });
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`restaurant-categories/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const onboarding = await Onboarding.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        Onboarding.length > 0
          ? "onboarding retrieved successfully"
          : "No banner found",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const OnboardingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const onboarding = await Onboarding.findOne({
      _id: req.params.id,
    });

    if (!Onboarding) {
      next(new appError("Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "onboarding retrieved successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOnboardingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const onboardingId = req.params.id;

    const validatedData = onboardingSchema.parse(req.body);

    // If image uploaded
    if (req.file) {
      validatedData.img = req.file.path;
    }

    const updateOnboarding = await Onboarding.findByIdAndUpdate(
      onboardingId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateOnboarding) {
      return next(new appError("Onboarding Banner not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Onboarding updated successfully",
      data: updateOnboarding,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOnboardingById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const onboarding = await Onboarding.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!onboarding) {
      next(new appError("onboarding not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "onboarding deleted successfully",
      data: onboarding,
    });
  } catch (error) {
    next(error);
  }
};
