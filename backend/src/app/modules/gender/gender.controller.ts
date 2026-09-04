import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { GenderModel } from "./gender.model";
import { genderSchema } from "./gender.validation";

export const createGender = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { gender } = req.body;

    // existing
    const existingData = await GenderModel.findOne({
      gender,
    });

    if (existingData) {
      return next(new appError("Gender already exists", 400));
    }
    // validate data

    const validateData = await genderSchema.parse({
      gender,
    });

    // create
    const createGender = await GenderModel.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Gender created successfully",
      data: createGender,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGenderData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await GenderModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Gender retrieved successfully"
          : "No Gender found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getGenderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const GenderId = await GenderModel.findOne({
      _id: req.params.id,
    });

    if (!GenderId) {
      next(new appError("Gender not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Gender retrieved successfully",
      data: GenderId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateGender = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const GenderId = req.params.id;

    // validate
    const validateData = await genderSchema.parse(req.body);

    const UpdateGender = await GenderModel.findOneAndUpdate(
      { _id: GenderId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateGender) {
      return next(new appError("Gender not found", 404));
    }

    await UpdateGender.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Gender updated successfully",
      data: UpdateGender,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGender = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Gender = await GenderModel.findOneAndDelete({
      _id: req.params.id,
    });
    if (!Gender) {
      return next(new appError("Gender not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Gender deleted successfully",
      data: Gender,
    });
    return;
  } catch (error) {
    next(error);
  }
};
