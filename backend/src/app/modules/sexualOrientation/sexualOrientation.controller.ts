import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { sexualOrientationSchema } from "./sexualOrientation.validation";
import { SexualOrientation } from "./sexualOrientation.model";

export const createSexualOrientation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;

    // existing
    const existingData = await SexualOrientation.findOne({
      title,
    });

    if (existingData) {
      return next(new appError("SexualOrientation already exists", 400));
    }
    // validate data

    const validateData = await sexualOrientationSchema.parse({
      title,
    });

    // create
    const createSexualOrientation =
      await SexualOrientation.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "SexualOrientation created successfully",
      data: createSexualOrientation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSexualOrientationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await SexualOrientation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "SexualOrientation retrieved successfully"
          : "No SexualOrientation found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getSexualOrientationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SexualOrientationId = await SexualOrientation.findOne({
      _id: req.params.id,
    });

    if (!SexualOrientationId) {
      next(new appError("Sexual Orientation not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Sexual Orientation retrieved successfully",
      data: SexualOrientationId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSexualOrientation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SexualOrientationId = req.params.id;

    // validate
    const validateData = await sexualOrientationSchema.parse(req.body);

    const UpdateSexualOrientation = await SexualOrientation.findOneAndUpdate(
      { _id: SexualOrientationId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateSexualOrientation) {
      return next(new appError("SexualOrientation not found", 404));
    }

    await UpdateSexualOrientation.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sexual Orientation updated successfully",
      data: UpdateSexualOrientation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSexualOrientation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sexualOrientation = await SexualOrientation.findOneAndDelete({
      _id: req.params.id,
    });
    if (!sexualOrientation) {
      return next(new appError("Sexual Orientation not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sexual Orientation deleted successfully",
      data: sexualOrientation,
    });
    return;
  } catch (error) {
    next(error);
  }
};
