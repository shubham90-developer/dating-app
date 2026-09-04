import jwt from "jsonwebtoken";

export const generateToken = (payload: Record<string, any>) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
