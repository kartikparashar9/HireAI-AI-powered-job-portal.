import { Readable } from "stream";

import cloudinary from "../../config/cloudinary.js";
import Resume from "../../models/Resume.js";
import ApiError from "../../utils/ApiError.js";

const uploadResumeToCloudinary = (file, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hireai/resumes/user_${userId}`,
        resource_type: "raw",
      },
      (error, result) => {
        if (error) {
          console.error("========== CLOUDINARY ERROR ==========");
          console.error("message:", error.message);
          console.error("http_code:", error.http_code);
          console.error("name:", error.name);
          console.error("full error:", error);
          console.error("======================================");

          return reject(
            new ApiError(
              500,
              error.message || "Failed to upload resume to Cloudinary",
            ),
          );
        }

        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

const deleteResumeFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("Cloudinary deletion failed");
    }
  } catch {
    throw new ApiError(500, "Failed to delete resume from Cloudinary");
  }
};

const createResume = async (userId, { title, file }) => {
  if (!file) {
    throw new ApiError(400, "Resume file is required");
  }

  const uploadedFile = await uploadResumeToCloudinary(file, userId);

  try {
    const existingResume = await Resume.findOne({
      user: userId,
    });

    const resume = await Resume.create({
      user: userId,
      title,
      fileUrl: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      isPrimary: !existingResume,
    });

    return resume;
  } catch (error) {
    try {
      await deleteResumeFromCloudinary(uploadedFile.public_id);
    } catch {
      // Keep original database error as the primary error.
    }

    throw error;
  }
};

const getMyResumes = async (userId) => {
  return Resume.find({ user: userId }).sort({
    isPrimary: -1,
    createdAt: -1,
  });
};

const getResumeById = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return resume;
};

const setPrimaryResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (resume.isPrimary) {
    return resume;
  }

  await Resume.updateMany(
    {
      user: userId,
      isPrimary: true,
    },
    {
      $set: {
        isPrimary: false,
      },
    },
  );

  resume.isPrimary = true;
  await resume.save();

  return resume;
};

const deleteResume = async (userId, resumeId) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  await deleteResumeFromCloudinary(resume.publicId);

  await resume.deleteOne();

  if (resume.isPrimary) {
    const nextResume = await Resume.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (nextResume) {
      nextResume.isPrimary = true;
      await nextResume.save();
    }
  }

  return resume;
};

export {
  uploadResumeToCloudinary,
  deleteResumeFromCloudinary,
  createResume,
  getMyResumes,
  getResumeById,
  setPrimaryResume,
  deleteResume,
};
