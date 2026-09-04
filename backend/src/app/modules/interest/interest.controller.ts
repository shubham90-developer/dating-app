import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { interestSchema } from "./interest.validation";
import { Interest } from "./interest.model";

export const createIntrest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;

    const icon = req.file?.path;

    if (!icon) {
      return next(new appError("icon is required", 400));
    }

    // existing
    const exixtingIntrest = await Interest.findOne({
      title,
      icon,
    });

    if (exixtingIntrest) {
      return next(new appError("Intrest already exists", 400));
    }

    const validateData = interestSchema.parse({
      title,
      icon,
    });

    const intrest = await Interest.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Intrest created successfully",
      data: intrest,
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

export const getAllIntrest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const intrest = await Interest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        intrest.length > 0
          ? "Intrest retrieved successfully"
          : "No banner found",
      data: intrest,
    });
  } catch (error) {
    next(error);
  }
};

export const IntrestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const intrest = await Interest.findOne({
      _id: req.params.id,
    });

    if (!intrest) {
      next(new appError("Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Intrest retrieved successfully",
      data: intrest,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIntrestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const IntrestId = req.params.id;

    const validatedData = interestSchema.parse(req.body);

    // If image uploaded
    if (req.file) {
      validatedData.icon = req.file.path;
    }

    const updateIntrest = await Interest.findByIdAndUpdate(
      IntrestId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateIntrest) {
      return next(new appError("Intrest Banner not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Intrest updated successfully",
      data: updateIntrest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIntrestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Intrest = await Interest.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!Intrest) {
      next(new appError("Intrest not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Intrest deleted successfully",
      data: Intrest,
    });
  } catch (error) {
    next(error);
  }
};
