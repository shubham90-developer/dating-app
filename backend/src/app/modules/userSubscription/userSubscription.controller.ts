import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { razorpay } from "../../config/razorpay";
import { appError } from "../../errors/appError";
import { Subscription } from "../subscription/subscription.model";
import { UserSubscription } from "./userSubscription.model";
import { FirebaseUser } from "../../middlewares/verifyPhone";

const TRIAL_HOURS = 24;

export const createUserSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { subscriptionPlanId } = req.body as { subscriptionPlanId: string };
    const firebaseUser = (req as any).firebaseUser as FirebaseUser | undefined;

    if (!firebaseUser) return next(new appError("Phone not verified", 401));

    // 1. Dedupe: reuse existing non-terminal subscription instead of creating a new one
    const existing = await UserSubscription.findOne({
      firebaseUid: firebaseUser.uid,
      status: { $in: ["created", "authenticated", "active"] },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Existing subscription found, proceed to checkout",
        data: {
          razorpaySubscriptionId: existing.razorpaySubscriptionId,
          userSubscriptionId: existing._id,
        },
      });
    }

    const plan = (await Subscription.findById(subscriptionPlanId)) as any;
    if (!plan) return next(new appError("Subscription plan not found", 404));

    const fullAmountRupees = Number(plan.priceAfterTrial);
    if (!fullAmountRupees || fullAmountRupees <= 0)
      return next(new appError("Invalid plan price", 400));

    const planName: string = plan.planName || "Premium Subscription";

    const razorpayPlan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: planName,
        amount: fullAmountRupees * 100,
        currency: "INR",
      },
    });

    const startAt = Math.floor(Date.now() / 1000) + TRIAL_HOURS * 60 * 60; // first real charge delayed 24 hrs

    const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlan.id,
      customer_notify: 1,
      total_count: 29,
      start_at: startAt,
    });

    const userSubscription = await UserSubscription.create({
      firebaseUid: firebaseUser.uid,
      phone: firebaseUser.phone,
      subscriptionPlan: plan._id,
      razorpayPlanId: razorpayPlan.id,
      razorpaySubscriptionId: razorpaySubscription.id,
      amount: fullAmountRupees * 100,
      authAmount: 100,
      startAt: new Date(startAt * 1000),
      status: "created",
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription created, proceed to checkout",
      data: {
        razorpaySubscriptionId: razorpaySubscription.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        userSubscriptionId: userSubscription._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUserSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body as {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
    };

    const firebaseUser = (req as any).firebaseUser as FirebaseUser | undefined;
    if (!firebaseUser) return next(new appError("Phone not verified", 401));

    // 1. Find the local record first — confirms this subscription belongs to this user
    const userSubscription = await UserSubscription.findOne({
      firebaseUid: firebaseUser.uid,
      razorpaySubscriptionId: razorpay_subscription_id,
    });

    if (!userSubscription)
      return next(new appError("Subscription not found for this user", 404));

    // 2. Recompute signature: HMAC-SHA256(payment_id + "|" + subscription_id, key_secret)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return next(new appError("Invalid payment signature", 400));

    // 3. Don't trust client — fetch real subscription status from Razorpay
    const razorpaySubscription = await razorpay.subscriptions.fetch(
      razorpay_subscription_id,
    );

    // 4. Fetch payment details — gives us payment method (card/upi/netbanking) and invoice id
    let paymentMethod: string | undefined;
    let invoiceId: string | undefined;
    try {
      const razorpayPayment =
        await razorpay.payments.fetch(razorpay_payment_id);
      paymentMethod = razorpayPayment.method;
      invoiceId = razorpayPayment.invoice_id || undefined;
    } catch (paymentFetchError) {
      // Don't fail the whole verification just because payment details couldn't be fetched —
      // signature is already verified above, so the subscription itself is legitimately confirmed.
      console.error("Failed to fetch payment details:", paymentFetchError);
    }

    const statusMap: Record<string, string> = {
      authenticated: "authenticated",
      active: "active",
      charged: "charged",
      cancelled: "cancelled",
      halted: "failed",
    };

    const newStatus =
      statusMap[razorpaySubscription.status] || userSubscription.status;

    userSubscription.status = newStatus as any;
    userSubscription.razorpayPaymentId = razorpay_payment_id;

    if (paymentMethod) {
      userSubscription.paymentMethod = paymentMethod;
    }
    if (invoiceId) {
      userSubscription.invoiceId = invoiceId;
    }

    if (razorpaySubscription.current_end) {
      userSubscription.currentPeriodEnd = new Date(
        razorpaySubscription.current_end * 1000,
      );
    }
    await userSubscription.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Payment verified, subscription updated",
      data: userSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyUserSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const firebaseUser = (req as any).firebaseUser as FirebaseUser | undefined;
    if (!firebaseUser)
      return next(new appError("Authentication required", 401));

    const subscription = await UserSubscription.findOne({
      firebaseUid: firebaseUser.uid,
    })
      .populate("subscriptionPlan")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription status retrieved",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelUserSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const firebaseUser = (req as any).firebaseUser as FirebaseUser | undefined;
    if (!firebaseUser)
      return next(new appError("Authentication required", 401));

    const subscription = await UserSubscription.findOne({
      firebaseUid: firebaseUser.uid,
      status: { $in: ["created", "authenticated", "active"] },
    });

    if (!subscription)
      return next(new appError("No active subscription found", 404));

    // Turn off autopay on Razorpay's side (immediate cancellation)
    try {
      await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
    } catch (rzpError: any) {
      console.error(
        "RAZORPAY CANCEL ERROR:",
        JSON.stringify(rzpError, null, 2),
      );

      const description =
        rzpError?.error?.description ||
        rzpError?.message ||
        "Failed to cancel subscription on Razorpay";

      return next(new appError(description, rzpError?.statusCode || 400));
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    await subscription.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const statusFilter = req.query.status as string | undefined;

    const filter: any = {};
    if (statusFilter) filter.status = statusFilter;

    const total = await UserSubscription.countDocuments(filter);

    const records = await UserSubscription.find(filter)
      .populate("profile", "firstName lastName phone")
      .populate("subscriptionPlan", "planName priceAfterTrial")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Only real Razorpay payments are eligible for a live lookup —
    // admin-granted records (razorpayPlanId: "ADMIN_GRANTED") don't exist in Razorpay at all.
    const enriched = await Promise.all(
      records.map(async (record) => {
        const isAdminGranted = record.razorpayPlanId === "ADMIN_GRANTED";

        if (isAdminGranted || !record.razorpayPaymentId) {
          return {
            ...record.toJSON(),
            source: "admin",
          };
        }

        try {
          const razorpayPayment = await razorpay.payments.fetch(
            record.razorpayPaymentId,
          );
          return {
            ...record.toJSON(),
            source: "razorpay",
            razorpayDetails: {
              method: razorpayPayment.method,
              captured: razorpayPayment.captured,
              fee: razorpayPayment.fee,
              tax: razorpayPayment.tax,
              email: razorpayPayment.email,
              contact: razorpayPayment.contact,
            },
          };
        } catch (razorpayError) {
          // Fall back to local data — never let one bad lookup break the whole list.
          console.error(
            `Failed to fetch Razorpay payment ${record.razorpayPaymentId}:`,
            razorpayError,
          );
          return {
            ...record.toJSON(),
            source: "razorpay",
            razorpayDetails: null,
          };
        }
      }),
    );

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Payment history retrieved successfully",
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
