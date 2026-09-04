import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { Advertisement } from "./advertisement.model";
import { advertisementSchema } from "./advertisement.validation";

export const createAdvertisement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;

    const files = req.files as {
      backgroundVideo?: Express.Multer.File[];
      featureIcons?: Express.Multer.File[];
    };

    const backgroundVideo = files?.backgroundVideo?.[0]?.path;

    if (!backgroundVideo) {
      return next(new appError("Background video is required", 400));
    }

    let features = [];

    if (req.body.features) {
      features =
        typeof req.body.features === "string"
          ? JSON.parse(req.body.features)
          : req.body.features;
    }

    const iconFiles = files?.featureIcons || [];
    features = features.map((f: any, i: number) => ({
      ...f,
      icon: iconFiles[i]?.path || f.icon,
    }));

    const existingAdvertisement = await Advertisement.findOne({
      title,
      isDeleted: false,
    });

    if (existingAdvertisement) {
      return next(new appError("Advertisement already exists", 400));
    }

    const validatedData = advertisementSchema.parse({
      title,
      backgroundVideo,
      features,
    });

    const advertisement = await Advertisement.create(validatedData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Advertisement created successfully",
      data: advertisement,
    });
  } catch (error) {
    const files = req.files as {
      backgroundVideo?: Express.Multer.File[];
    };

    const uploadedVideo = files?.backgroundVideo?.[0];

    if (uploadedVideo?.filename) {
      await cloudinary.uploader.destroy(uploadedVideo.filename, {
        resource_type: "video",
      });
    }

    next(error);
  }
};

export const getAllAdertisement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adertisement = await Advertisement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        adertisement.length > 0
          ? "Adertisement retrieved successfully"
          : "No banner found",
      data: adertisement,
    });
  } catch (error) {
    next(error);
  }
};

export const AdertisementById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adertisement = await Advertisement.findOne({
      _id: req.params.id,
    });

    if (!adertisement) {
      next(new appError("Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Adertisement retrieved successfully",
      data: adertisement,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdvertisementById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const advertisementId = req.params.id;

    const advertisement = await Advertisement.findById(advertisementId);

    if (!advertisement) {
      return next(new appError("Advertisement not found", 404));
    }

    // Get uploaded files
    const files = req.files as {
      backgroundVideo?: Express.Multer.File[];
      featureIcons?: Express.Multer.File[];
    };

    // Use uploaded video if available, otherwise keep existing
    const backgroundVideo =
      files?.backgroundVideo?.[0]?.path || advertisement.backgroundVideo;

    // Parse features
    let features = advertisement.features;

    if (req.body.features) {
      features =
        typeof req.body.features === "string"
          ? JSON.parse(req.body.features)
          : req.body.features;
    }

    const iconFiles = files?.featureIcons || [];
    features = features.map((f: any, i: number) => ({
      ...f,
      icon: iconFiles[i]?.path || f.icon,
    }));

    const payload = {
      title: req.body.title || advertisement.title,
      backgroundVideo,
      features,
    };

    const validatedData = advertisementSchema.parse(payload);

    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      advertisementId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Advertisement updated successfully",
      data: updatedAdvertisement,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdvertisementById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) {
      return next(new appError("Advertisement not found", 404));
    }

    if (advertisement.backgroundVideo) {
      const publicId = advertisement.backgroundVideo
        .split("/")
        .pop()
        ?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "video",
        });
      }
    }

    await Advertisement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
