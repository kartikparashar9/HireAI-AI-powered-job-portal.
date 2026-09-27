import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new ApiError(
        400,
        "Invalid resume format. Only PDF and DOCX files are allowed.",
      ),
    );
  }

  cb(null, true);
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
}).single("resume");

const handleResumeUpload = (req, res, next) => {
  uploadResume(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(new ApiError(400, "Resume file cannot exceed 5 MB"));
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return next(new ApiError(400, "Only one resume file can be uploaded"));
      }

      return next(new ApiError(400, `Resume upload failed: ${error.message}`));
    }

    return next(error);
  });
};

export default handleResumeUpload;
