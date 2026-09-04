import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { PrivacyPolicy } from "./privacypolicy.model";
import {
  privacyPolicySchema,
  updatePrivacyPolicySchema,
} from "./privacypolicy.validation";

export const createPrivacyPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, content } = req.body;

    // existing
    const existingData = await PrivacyPolicy.findOne({
      content,
    });

    if (existingData) {
      return next(new appError("Privacy Policy already exists", 400));
    }
    // validate data

    const validateData = await privacyPolicySchema.parse({
      title,
      content,
    });

    // create
    const createPrivacyPolicy = await PrivacyPolicy.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Privacy Policy created successfully",
      data: createPrivacyPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPrivacyPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllPrivacyPolicyData = await PrivacyPolicy.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllPrivacyPolicyData.length > 0
          ? "Privacy Policy retrieved successfully"
          : "No Privacy Policy found",
      data: getAllPrivacyPolicyData,
    });
  } catch (error) {
    next(error);
  }
};

export const getPrivacyPolicyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const PrivacyPolicyId = await PrivacyPolicy.findOne({
      _id: req.params.id,
    });

    if (!PrivacyPolicyId) {
      return next(new appError("Privacy Policy not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Privacy Policy retrieved successfully",
      data: PrivacyPolicyId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePrivacyPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const PrivacyPolicyId = req.params.id;

    // validate
    const validateData = await updatePrivacyPolicySchema.parse(req.body);

    const UpdatePrivacyPolicy = await PrivacyPolicy.findOneAndUpdate(
      { _id: PrivacyPolicyId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdatePrivacyPolicy) {
      return next(new appError("PrivacyPolicynot found", 404));
    }

    await UpdatePrivacyPolicy.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Privacy Policy updated successfully",
      data: UpdatePrivacyPolicy,
    });
  } catch (error) {
    next(error);
  }
};
