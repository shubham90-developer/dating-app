// modules/auth/auth.controller.ts
import { RequestHandler } from "express";
import { verifyWidgetToken } from "../../config/msg91";
import { generateToken } from "../../config/generateToken";
import { ProfilesModel } from "../profiles/profiles.model";
import jwt from "jsonwebtoken";

export const verifyOtp: RequestHandler = async (req, res) => {
  const { phone, accessToken } = req.body;

  if (!phone || !accessToken) {
    res.status(400).json({
      success: false,
      message: "phone and accessToken are required",
    });
    return;
  }

  const data = await verifyWidgetToken(accessToken);

  if (data.type !== "success") {
    res
      .status(401)
      .json({
        success: false,
        message: data.message || "Invalid or expired OTP",
      });
    return;
  }

  // Returning user: a profile already exists for this phone -> log them in directly
  const existingProfile = await ProfilesModel.findOne({ phone });
  if (existingProfile) {
    const token = generateToken({
      userId: existingProfile._id,
      phone: existingProfile.phone,
    });

    res.json({
      success: true,
      isNewUser: false,
      token,
      data: existingProfile,
    });
    return;
  }

  // New user: issue a short-lived phoneToken so they can complete signup
  const phoneToken = jwt.sign(
    { phone, purpose: "phone-verify" },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" },
  );

  res.json({ success: true, isNewUser: true, phoneToken });
};
