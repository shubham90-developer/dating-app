import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { ChildPolicy } from "./childPolicy.model";
import { childPolicySchema } from "./childPolicy.validation";

export const createChildPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;

    // existing
    const existingData = await ChildPolicy.findOne({
      content,
    });

    if (existingData) {
      return next(new appError("Child Policy already exists", 400));
    }
    // validate data

    const validateData = await childPolicySchema.parse({
      title,
      content,
    });

    // create
    const createChildPolicy = await ChildPolicy.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Child Policy created successfully",
      data: createChildPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChildPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllChildPolicyData = await ChildPolicy.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllChildPolicyData.length > 0
          ? "Child Policy retrieved successfully"
          : "No Child Policy found",
      data: getAllChildPolicyData,
    });
  } catch (error) {
    next(error);
  }
};

export const getChildPolicyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ChildPolicyId = await ChildPolicy.findOne({
      _id: req.params.id,
    });

    if (!ChildPolicyId) {
      return next(new appError("Child Policy not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Child Policy retrieved successfully",
      data: ChildPolicyId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateChildPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ChildPolicyId = req.params.id;

    // validate
    const validateData = await childPolicySchema.parse(req.body);

    const UpdateChildPolicy = await ChildPolicy.findOneAndUpdate(
      { _id: ChildPolicyId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateChildPolicy) {
      return next(new appError("Child Policy not found", 404));
    }

    await UpdateChildPolicy.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Child Policy updated successfully",
      data: UpdateChildPolicy,
    });
  } catch (error) {
    next(error);
  }
};
