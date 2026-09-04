import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Subscription } from "./subscription.model";
import { subscriptionSchema } from "./subscription.validation";

export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      mainTitle,
      highlightText,
      planName,
      trialPrice,
      trialText,
      trialDuration,
      priceAfterTrial,
      afterTrialText,
      appName,
    } = req.body;

    const backgroundVideo = req.file?.path;

    if (!backgroundVideo) {
      return next(new Error("backgroundVideo is required"));
    }

    const existingData = await Subscription.findOne({
      mainTitle,
      highlightText,
      planName,
      trialPrice,
      trialText,
      trialDuration,
      priceAfterTrial,
      afterTrialText,
      backgroundVideo,
      appName,
    });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    const validateData = await subscriptionSchema.parse({
      mainTitle,
      highlightText,
      planName,
      trialPrice,
      trialText,
      trialDuration,
      priceAfterTrial,
      afterTrialText,
      backgroundVideo,
      appName,
    });

    const createSubscription = await Subscription.create(validateData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription created successfully",
      data: createSubscription,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allSubscription = await Subscription.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription retrieved successfully",
      data: allSubscription,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SubscriptionById = await Subscription.findOne({
      _id: req.params.id,
    });

    if (!SubscriptionById) {
      next(new appError("Subscription  not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Subscription retrieved successfully",
      data: SubscriptionById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SubscriptionId = req.params.id;

    const updateData: any = { ...req.body };

    // uploaded logo
    if (req.file) {
      updateData.backgroundVideo = req.file.path; // cloudinary/local path
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      SubscriptionId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSubscription) {
      return next(new appError("Subscription not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subscription = await Subscription.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!subscription) {
      return next(new appError("subscription not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "subscription deleted successfully",
      data: Subscription,
    });
    return;
  } catch (error) {
    next(error);
  }
};
