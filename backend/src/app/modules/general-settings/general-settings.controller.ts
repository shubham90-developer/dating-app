import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { GeneralSettings } from "./general-settings.model";
import { generalSettingsValidation } from "./general-settings.validation";

export const createGeneralSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = { ...req.body };

    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (files.logo?.[0]) payload.logo = files.logo[0].path;
      if (files.favicon?.[0]) payload.favicon = files.favicon[0].path;
    }

    const validated = generalSettingsValidation.parse(payload);

    const settings = await GeneralSettings.create(validated);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "General settings created successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGeneralSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await GeneralSettings.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: "General settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getGeneralSettingsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await GeneralSettings.findById(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "General settings not found",
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "General settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGeneralSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Settings ID is required",
      });
    }

    // Check existing record
    const existingSettings = await GeneralSettings.findById(id);

    if (!existingSettings) {
      return res.status(404).json({
        success: false,
        message: "General settings not found",
      });
    }

    const payload: any = {
      ...req.body,
    };

    // Handle files
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (files.logo?.[0]) {
        payload.logo = files.logo[0].path;
      }

      if (files.favicon?.[0]) {
        payload.favicon = files.favicon[0].path;
      }
    }

    // Validate only provided fields
    const validatedData = generalSettingsValidation.partial().parse(payload);

    // Hash password if provided
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }

    delete (validatedData as any).confirmPassword;

    const updatedSettings = await GeneralSettings.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "General settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGeneralSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await GeneralSettings.findByIdAndDelete(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "General settings not found",
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "General settings deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
