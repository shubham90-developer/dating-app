import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ProfilesModel } from "../modules/profiles/profiles.model";
import { appError } from "../errors/appError";

export interface ProfileRequest extends Request {
  profile?: any;
}

export const auth = () => {
  return async (req: ProfileRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(
          new appError("Authentication required. No token provided", 401),
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const profile = await ProfilesModel.findById(decoded.userId);

      if (!profile) {
        return next(new appError("Profile not found", 401));
      }

      req.profile = profile;
      next();
    } catch (error) {
      next(new appError("Invalid or expired token", 401));
    }
  };
};

export const optionalAuth = () => {
  return async (req: ProfileRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        req.profile = undefined;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const profile = await ProfilesModel.findById(decoded.userId);
      if (profile) req.profile = profile;
      next();
    } catch (error) {
      req.profile = undefined;
      next();
    }
  };
};
