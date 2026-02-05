import { Request, Router } from "express";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { BAD_REQUEST, OK } from "../constants/http.js";

export const uploadRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 10 * 1024 * 1024
  }
});

uploadRouter.post("/image-upload", upload.single("file"), async(req: Request, res, next) => {
  try {
    if (!req.file) {
      return res.status(BAD_REQUEST).json({ error: "No file provided" });
    }

    const file = req.file;

    if (!file.mimetype.startsWith("image/")) {
      return res.status(BAD_REQUEST).json({ error: "Only image files are allowed" });
    }

    const result = await new Promise<{
      secure_url: string;
      width: number;
      height: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: "real_time_chat_threads_app"
      },
    (err, uploaded) => {
      if (err || !uploaded) {
        return reject(err ?? new Error("Image upload failed"));
      }

      resolve({
        secure_url: uploaded.secure_url,
        width: uploaded.width,
        height: uploaded.height
      });
    });

    uploadStream.end(file.buffer);
    })

    return res.status(OK).json({
      url: result.secure_url,
      width: result.width,
      height: result.height
    });

  } catch (error) {
    next(error);
  }
});