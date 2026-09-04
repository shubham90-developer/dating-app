import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userInterface } from "./userInterface";
import { appError } from "../errors/appError";

export const verifyAdminToken = async (
  req: userInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return next(
        new appError("Authentication required. No token provided", 401),
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      status: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new appError("Invalid or expired token", 401));
  }
};
