import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { PositionModel } from "./position.model";
import { positionSchema } from "./position.validation";

export const createPosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subTitle } = req.body;

    // existing
    const existingData = await PositionModel.findOne({
      title,
      subTitle,
    });

    if (existingData) {
      return next(new appError("Position already exists", 400));
    }
    // validate data

    const validateData = await positionSchema.parse({
      title,
      subTitle,
    });

    // create
    const createPosition = await PositionModel.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Position created successfully",
      data: createPosition,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPositionData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await PositionModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Position retrieved successfully"
          : "No Position found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getPositionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const PositionId = await PositionModel.findOne({
      _id: req.params.id,
    });

    if (!PositionId) {
      next(new appError("Position not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Position retrieved successfully",
      data: PositionId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const PositionId = req.params.id;

    // validate
    const validateData = await positionSchema.parse(req.body);

    const UpdatePosition = await PositionModel.findOneAndUpdate(
      { _id: PositionId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdatePosition) {
      return next(new appError("Position not found", 404));
    }

    await UpdatePosition.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Position updated successfully",
      data: UpdatePosition,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePosition = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Position = await PositionModel.findOneAndDelete({
      _id: req.params.id,
    });
    if (!Position) {
      return next(new appError("Position not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Position deleted successfully",
      data: Position,
    });
    return;
  } catch (error) {
    next(error);
  }
};
