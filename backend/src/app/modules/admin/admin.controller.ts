import { Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { AdminModel } from "./admin.model";
import { adminLoginSchema, adminUpdateProfileSchema } from "./admin.validation";
import { appError } from "../../errors/appError";
import { generateToken } from "../../config/generateToken";
import { userInterface } from "../../middlewares/userInterface";

export const adminLogin = async (
  req: userInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const admin = await AdminModel.findOne({ email }).select("+password");
    if (!admin) return next(new appError("Invalid email or password", 401));

    if (admin.status !== "active")
      return next(new appError("Account is inactive", 403));

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return next(new appError("Invalid email or password", 401));

    const token = generateToken({
      userId: admin._id,
      email: admin.email,
      role: admin.role,
      status: admin.status,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      token,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminProfile = async (
  req: userInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await AdminModel.findById(req.user.userId);
    if (!admin) return next(new appError("Admin not found", 404));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Admin profile retrieved successfully",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminProfile = async (
  req: userInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admin = await AdminModel.findById(req.user.userId);
    if (!admin) return next(new appError("Admin not found", 404));

    const payload: any = { ...req.body };

    if (req.file) {
      payload.avatar = req.file.path;
    }

    const validated = adminUpdateProfileSchema.parse(payload);

    if (validated.name !== undefined) admin.name = validated.name;
    if (validated.email !== undefined) admin.email = validated.email;
    if (validated.phone !== undefined) admin.phone = validated.phone;
    if (validated.avatar !== undefined) admin.avatar = validated.avatar;
    if (validated.password !== undefined) admin.password = validated.password;

    await admin.save(); // triggers pre('save') hook — re-hashes password only if it was changed

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Admin profile updated successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        avatar: admin.avatar,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
