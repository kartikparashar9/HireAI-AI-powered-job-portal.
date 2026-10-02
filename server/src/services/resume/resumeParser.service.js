import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

import ApiError from "../../utils/ApiError.js";

/**
 * Download resume file from Cloudinary.
 */
const downloadResumeFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to download resume: ${response.status} ${response.statusText}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Resume download error:", error);

    throw new ApiError(
      400,
      "Unable to download resume file for text extraction",
    );
  }
};

/**
 * Extract text from PDF.
 *
 * pdf-parse v2.x uses PDFParse class.
 */
const extractPdfText = async (buffer) => {
  let parser;

  try {
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    const text = result.text?.trim();

    if (!text) {
      throw new ApiError(
        400,
        "Could not extract text from the PDF resume",
      );
    }

    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      400,
      "Failed to extract text from PDF resume",
    );
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error(
          "PDF parser cleanup error:",
          destroyError,
        );
      }
    }
  }
};

/**
 * Extract text from DOCX.
 */
const extractDocxText = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({
      buffer,
    });

    const text = result.value?.trim();

    if (!text) {
      throw new ApiError(
        400,
        "Could not extract text from the DOCX resume",
      );
    }

    return text;
  } catch (error) {
    console.error("DOCX extraction error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      400,
      "Failed to extract text from DOCX resume",
    );
  }
};

/**
 * Extract text from uploaded resume.
 */
const extractResumeText = async (resume) => {
  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  if (!resume.fileUrl) {
    throw new ApiError(400, "Resume file URL is missing");
  }

  const buffer = await downloadResumeFile(resume.fileUrl);

  switch (resume.fileType) {
    case "application/pdf":
      return await extractPdfText(buffer);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return await extractDocxText(buffer);

    default:
      throw new ApiError(
        400,
        "Unsupported resume file type",
      );
  }
};

export {
  extractResumeText,
  downloadResumeFile,
  extractPdfText,
  extractDocxText,
};