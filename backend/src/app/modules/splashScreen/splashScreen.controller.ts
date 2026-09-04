import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { SplashScreen } from "./splashScreen.model";
import { splashScreenSchema } from "./splashScreen.validation";

export const createSplashScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const splashImg = req.file?.path;

    if (!splashImg) {
      return next(new Error("splashImg is required"));
    }

    const existingData = await SplashScreen.findOne({ splashImg });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    const validateData = await splashScreenSchema.parse({ splashImg });

    const createSplashScreen = await SplashScreen.create(validateData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Splash Screen created successfully",
      data: createSplashScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllSplashScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allSplashScreen = await SplashScreen.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Splash Screen retrieved successfully",
      data: allSplashScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getSplashScreenById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const splashScreenById = await SplashScreen.findOne({
      _id: req.params.id,
    });

    if (!splashScreenById) {
      next(new appError("splash Screen  not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "splash Screen retrieved successfully",
      data: splashScreenById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSplashScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SplashScreenId = req.params.id;

    const updateData: any = { ...req.body };

    // uploaded logo
    if (req.file) {
      updateData.splashImg = req.file.path; // cloudinary/local path
    }

    const updatedSplashScreen = await SplashScreen.findByIdAndUpdate(
      SplashScreenId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSplashScreen) {
      return next(new appError("Splash Screen not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Splash Screen updated successfully",
      data: updatedSplashScreen,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSplashScreen = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const splashScreen = await SplashScreen.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!splashScreen) {
      return next(new appError("splash Screen not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "splash Screen deleted successfully",
      data: splashScreen,
    });
    return;
  } catch (error) {
    next(error);
  }
};
