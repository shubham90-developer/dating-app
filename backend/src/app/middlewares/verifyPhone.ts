// src/app/middlewares/verifyFirebaseToken.ts
import { RequestHandler } from "express";
import initializeFirebaseAdmin from "../config/firebase-admin";
import { appError } from "../errors/appError";
import { ProfilesModel } from "../modules/profiles/profiles.model";

export interface FirebaseUser {
  uid: string;
  phone: string;
}

export const verifyFirebaseToken: RequestHandler = async (
  req: any,
  res,
  next,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(new appError("Firebase ID token required", 401));
    }

    const idToken = authHeader.split(" ")[1];

    if (!idToken) {
      return next(new appError("Firebase ID token required", 401));
    }

    const admin = initializeFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);

    if (!decoded.phone_number) {
      return next(
        new appError("Token does not contain a verified phone number", 401),
      );
    }

    // trustworthy — verified by Firebase, not the client
    req.firebaseUser = {
      uid: decoded.uid,
      phone: decoded.phone_number,
    } as FirebaseUser;

    // attach existing profile if one exists for this phone (useful downstream)
    const profile = await ProfilesModel.findOne({
      phone: decoded.phone_number,
    });
    if (profile) req.profile = profile;

    next();
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      return next(
        new appError("Firebase token expired, please sign in again", 401),
      );
    }
    if (error.code === "auth/argument-error") {
      return next(new appError("Malformed Firebase token", 401));
    }
    next(new appError("Invalid or expired Firebase token", 401));
  }
};
