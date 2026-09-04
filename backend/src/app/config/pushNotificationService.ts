import initializeFirebaseAdmin from "../config/firebase-admin";
import { ProfilesModel } from "../modules/profiles/profiles.model";

export const sendPushToProfile = async (
  profileId: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  try {
    const targetProfile =
      await ProfilesModel.findById(profileId).select("fcmToken");

    if (!targetProfile?.fcmToken) {
      return;
    }

    const admin = initializeFirebaseAdmin();

    await admin.messaging().send({
      token: targetProfile.fcmToken,
      notification: { title, body },
      data: data || {},
    });
  } catch (error) {
    console.error(`Push notification failed for profile ${profileId}:`, error);
  }
};
