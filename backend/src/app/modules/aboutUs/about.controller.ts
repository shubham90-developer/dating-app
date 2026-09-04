import { NextFunction, Request, Response } from "express";
import { AboutUs } from "./about.model";
import { aboutUsSchema, aboutUsUpdateSchema } from "./about.validation";
import { appError } from "../../errors/appError";

export const createAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      subTitle,
      shortDesc,
      mission,
      vision,
      sta,
      founderName,
      founderDesignation,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const founderImg = files?.founderImg?.[0]?.path;
    const img1 = files?.img1?.[0]?.path;
    const img2 = files?.img2?.[0]?.path;

    if (!founderImg || !img1 || !img2) {
      return next(new Error("All images are required"));
    }

    const existingData = await AboutUs.findOne({
      title,
      subTitle,
      shortDesc,
      mission,
      vision,
      sta,
      founderName,
      founderDesignation,
      founderImg,
      img1,
      img2,
    });

    if (existingData) {
      return next(new Error("Service already exists"));
    }

    const validateData = await aboutUsSchema.parse({
      title,
      subTitle,
      shortDesc,
      mission,
      vision,
      sta,
      founderName,
      founderDesignation,
      founderImg,
      img1,
      img2,
    });

    const createAboutUs = await AboutUs.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "About Us created successfully",
      data: createAboutUs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await AboutUs.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "About us retrieved successfully"
          : "No about us found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const aboutUsId = req.params.id;

    const validatedData = aboutUsUpdateSchema.parse(req.body);

    const updateAboutUs = await AboutUs.findOneAndUpdate(
      { _id: aboutUsId },
      validatedData,
      { new: true, runValidators: true },
    );

    if (!updateAboutUs) {
      next(new appError("About us not found", 404));
      return;
    }

    await updateAboutUs.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "About us updated successfully",
      data: updateAboutUs,
    });

    return;
  } catch (error) {
    next(error);
  }
};
