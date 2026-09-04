import { UserSubscription } from "../userSubscription/userSubscription.model";
import { razorpay } from "../../config/razorpay";

const BUFFER_HOURS = 23.5;

export async function cleanupAbandonedSubscriptions() {
  const cutoff = new Date(Date.now() - BUFFER_HOURS * 60 * 60 * 1000);

  const abandoned = await UserSubscription.find({
    status: { $in: ["authenticated", "active"] },
    profile: { $exists: false },
    createdAt: { $lte: cutoff },
  });

  for (const sub of abandoned) {
    try {
      await razorpay.subscriptions.cancel(sub.razorpaySubscriptionId);
    } catch (err: any) {
      console.error(
        `Failed to cancel ${sub.razorpaySubscriptionId}:`,
        err?.message || err,
      );
    }
    sub.status = "cancelled";
    sub.cancelledAt = new Date();
    await sub.save();
  }
}

export function startSubscriptionCleanupScheduler(intervalMs = 30 * 60 * 1000) {
  setInterval(() => {
    cleanupAbandonedSubscriptions().catch((err) =>
      console.error("Subscription cleanup job failed:", err),
    );
  }, intervalMs);
}
