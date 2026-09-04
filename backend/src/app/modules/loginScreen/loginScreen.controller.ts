import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { loginScreenSchema } from "./loginScreen.validation";
import { LoginScreen } from "./loginScreen.model";

export const createLoginScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginImg = req.file?.path;

    if (!loginImg) {
      return next(new Error("login Img is required"));
    }

    const existingData = await LoginScreen.findOne({ loginImg });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    const validateData = await loginScreenSchema.parse({ loginImg });

    const createLoginScreen = await LoginScreen.create(validateData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "login Screen created successfully",
      data: createLoginScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllLoginScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allLoginScreen = await LoginScreen.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "login  Screen retrieved successfully",
      data: allLoginScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getLoginScreenById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const LoginScreenById = await LoginScreen.findOne({
      _id: req.params.id,
    });

    if (!LoginScreenById) {
      next(new appError("login Screen  not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "login Screen retrieved successfully",
      data: LoginScreenById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateLoginScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const LoginScreenId = req.params.id;

    const updateData: any = { ...req.body };

    // uploaded logo
    if (req.file) {
      updateData.loginImg = req.file.path; // cloudinary/local path
    }

    const updatedLoginScreen = await LoginScreen.findByIdAndUpdate(
      LoginScreenId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedLoginScreen) {
      return next(new appError("login Screen not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "login Screen updated successfully",
      data: updatedLoginScreen,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLoginScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginScreen = await LoginScreen.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!loginScreen) {
      return next(new appError("login Screen not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "login Screen deleted successfully",
      data: LoginScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};
