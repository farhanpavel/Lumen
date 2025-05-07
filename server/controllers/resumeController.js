import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import "dotenv/config";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const postResume = async (req, res) => {
  const userId = req.user.id;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "resume" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // 2. Prepare for PDF.co API call
    const PDF_CO_API_KEY = process.env.PDF_CO;
    const pdfCoExtractEndpoint = "https://api.pdf.co/v1/pdf/convert/to/text";

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // 3. Extract text using PDF.co
    let summary = "";
    try {
      const pdfCoResponse = await axios.post(pdfCoExtractEndpoint, formData, {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": PDF_CO_API_KEY,
        },
        maxBodyLength: Infinity, // For larger files
      });

      if (pdfCoResponse.data.error) {
        console.warn("PDF.co extraction error:", pdfCoResponse.data.message);
        summary = "Summary extraction failed";
      } else {
        // Clean and truncate the extracted text
        const rawText = pdfCoResponse.data.body || "";
        summary = rawText
          .replace(/\s+/g, " ") // Remove excessive whitespace
          .substring(0, 2000); // Limit to 2000 characters
      }
    } catch (pdfCoError) {
      console.error(
        "PDF.co API error:",
        pdfCoError.response?.data || pdfCoError.message
      );
      summary = "Summary extraction failed - service error";
    }

    // 4. Store in database
    const newResume = await prisma.resume.create({
      data: {
        resumeUrl: cloudinaryResult.secure_url,
        summary: summary,
        user: {
          connect: { id: userId },
        },
        status: false, // Explicitly set status to false or remove this line to use the default value
      },
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded and processed successfully",
      data: {
        url: newResume.resumeUrl,
        summary: newResume.summary,
        id: newResume.id,
      },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
};
