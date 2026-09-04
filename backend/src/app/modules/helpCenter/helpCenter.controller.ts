import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { HelpCenter } from "./helpCenter.model";
import { helpCenterSchema } from "./helpCenter.validation";

export const createHelpCenter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;

    // existing
    const existingData = await HelpCenter.findOne({
      content,
    });

    if (existingData) {
      return next(new appError("Help Center already exists", 400));
    }
    // validate data

    const validateData = await helpCenterSchema.parse({
      title,
      content,
    });

    // create
    const createHelpCenter = await HelpCenter.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Help Center created successfully",
      data: createHelpCenter,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHelpCenter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllHelpCenterData = await HelpCenter.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllHelpCenterData.length > 0
          ? "Help Center retrieved successfully"
          : "No Help Center found",
      data: getAllHelpCenterData,
    });
  } catch (error) {
    next(error);
  }
};

export const getHelpCenterById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const HelpCenterId = await HelpCenter.findOne({
      _id: req.params.id,
    });

    if (!HelpCenterId) {
      return next(new appError("Help Center not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Help Center retrieved successfully",
      data: HelpCenterId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateHelpCenter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const HelpCenterId = req.params.id;

    // validate
    const validateData = await helpCenterSchema.parse(req.body);

    const UpdateHelpCenter = await HelpCenter.findOneAndUpdate(
      { _id: HelpCenterId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateHelpCenter) {
      return next(new appError("Help Center not found", 404));
    }

    await UpdateHelpCenter.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Help Center updated successfully",
      data: UpdateHelpCenter,
    });
  } catch (error) {
    next(error);
  }
};
