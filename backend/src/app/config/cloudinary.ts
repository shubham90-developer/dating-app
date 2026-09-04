import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    let folder = "uploads";

    if (req.originalUrl.includes("/advertisement")) {
      folder = "advertisement";
    } else if (req.originalUrl.includes("/splash-screen")) {
      folder = "splash-screen";
    } else if (req.originalUrl.includes("/login-screen")) {
      folder = "login-screen";
    } else if (req.originalUrl.includes("/lunching-products")) {
      folder = "launchingProducts";
    } else if (req.originalUrl.includes("/drone-products")) {
      folder = "droneProducts";
    } else if (req.originalUrl.includes("/digital-experience")) {
      folder = "digitalExperience";
    } else if (req.originalUrl.includes("/we-offer")) {
      folder = "weOffer";
    } else if (req.originalUrl.includes("/life")) {
      folder = "life";
    } else if (req.originalUrl.includes("/drone-catlouge")) {
      folder = "droneCatlouge";
    } else if (req.originalUrl.includes("/awards")) {
      folder = "awards";
    } else if (req.originalUrl.includes("/certificates")) {
      folder = "certificates";
    } else if (req.originalUrl.includes("/media-coverage")) {
      folder = "media-coverage";
    } else if (req.originalUrl.includes("/services")) {
      folder = "services";
    } else if (req.originalUrl.includes("/enquiries-careers")) {
      folder = "enquiries-careers";
    } else if (req.originalUrl.includes("/testimonials")) {
      folder = "testimonials";
    } else if (req.originalUrl.includes("/gallery")) {
      folder = "gallery";
    } else if (req.originalUrl.includes("/products")) {
      folder = "products";
    } else if (req.originalUrl.includes("/seo-pages")) {
      folder = "seo-pages";
    } else if (req.originalUrl.includes("/chat")) {
      folder = "chat-media";
    }

    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder,
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")}`,

      ...(isVideo
        ? {
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          }
        : {
            transformation: [
              {
                width: 1200,
                height: 600,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          }),
    } as any;
  },
});

// Multer Upload
export const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",

      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",

      // PDF
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image, video and PDF files are allowed") as any,
        false,
      );
    }
  },
});

export { cloudinary };
