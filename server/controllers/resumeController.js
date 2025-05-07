import cloudinary from "../cloudinaryConfig.js";
import prisma from "../db.js";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const postResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // 1. Upload to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "resumes",
          resource_type: "auto",
          format: "pdf",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // 2. Create initial resume record with just the essentials
    const newResume = await prisma.resume.create({
      data: {
        resumeUrl: cloudinaryResult.secure_url,
        summary: "Summary will be generated after form completion",
        status: false, // Mark as incomplete
        user: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: newResume.id,
        url: newResume.resumeUrl,
      },
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Processing failed",
    });
  }
};

export const updateResumeDetails = async (req, res) => {
  const userId = req.user.id;
  const formData = req.body;

  try {
    // 1. First update the resume with form data
    const updatedResume = await prisma.resume.update({
      where: { userId },
      data: {
        jobTitle: formData.jobTitle,
        yearsExperience: formData.yearsExperience,
        education: formData.education,
        skills: formData.skills,
        languages: formData.languages,
        frameworks: formData.frameworks,
        jobPreference: formData.jobPreference,
        availability: formData.availability,
        salaryExpectation: formData.salaryExpectation,
        relocation: formData.relocation,
        aboutYou: formData.aboutYou,
        projects: formData.projects,
        industry: formData.industry,
        certifications: formData.certifications,
        otherTech: formData.otherTech,
        status: true, // Mark as complete
      },
    });

    // 2. Generate AI summary with the complete data
    const prompt = `Create a professional summary for a resume with these details:
    Job Title: ${formData.jobTitle}
    Experience: ${formData.yearsExperience}
    Skills: ${formData.skills.join(", ")}
    Education: ${formData.education}
    About: ${formData.aboutYou}`;

    const aiSummary = await model.generateContent(prompt);
    const summary = (await aiSummary.response).text();

    // 3. Update with AI-generated summary
    const finalResume = await prisma.resume.update({
      where: { userId },
      data: { summary },
    });

    res.status(200).json({
      success: true,
      data: finalResume,
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Update failed",
    });
  }
};

export const getResume = async (req, res) => {
  const userId = req.user.id;

  try {
    const resume = await prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Fetch failed",
    });
  }
};

const mapEmploymentType = (type) => {
  const mapping = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACT",
    Internship: "INTERNSHIP",
  };
  return mapping[type] || "FULL_TIME";
};

const mapExperienceLevel = (level) => {
  const mapping = {
    "Mid-Senior level": "MID_SENIOR_LEVEL",
    "Entry level": "ENTRY_LEVEL",
    Associate: "ASSOCIATE",
    Director: "DIRECTOR",
    Executive: "EXECUTIVE",
  };
  return mapping[level] || "MID_SENIOR_LEVEL";
};

export const validateResume = async (req, res) => {
  try {
    const { jobId } = req.body;

    const userId = req.user.id;
    // Get user's resume
    const resume = await prisma.resume.findUnique({
      where: { userId },
      include: { user: true },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user);

    if (!resume) return res.status(404).json({ error: "Resume not found" });

    let jobData;
    const jobFoundLocally = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    let isLinkedInJob = false;
    if (!jobFoundLocally) isLinkedInJob = true;
    if (isLinkedInJob) {
      // Fetch LinkedIn job data
      const response = await fetch(
        `https://linkedin-data-api.p.rapidapi.com/get-job-details?id=${jobId}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "bb834ebd60mshbda2ab24352bae8p137102jsne7dad0e3970e",
            "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
          },
        }
      );
      const linkedInJob = await response.json();

      jobData = {
        title: linkedInJob.data.title,
        description: linkedInJob.data.description,
        company: linkedInJob.data.company.name,
        location: linkedInJob.data.location,
        remote: linkedInJob.data.workRemoteAllowed,
        employmentType: mapEmploymentType(linkedInJob.data.type),
        experienceLevel: mapExperienceLevel(
          linkedInJob.data.formattedExperienceLevel
        ),
        keywords: [
          ...(linkedInJob.data.formattedJobFunctions || []),
          ...(linkedInJob.data.company.specialities || []),
        ],
      };
    } else {
      // Fetch our platform job data
      const platformJob = await prisma.job.findUnique({
        where: { id: jobId },
        include: { keywords: true },
      });

      jobData = {
        ...platformJob,
        keywords: platformJob.keywords.map((k) => k.name),
        employmentType: platformJob.employmentType,
        experienceLevel: platformJob.experienceLevel,
      };
    }

    // Prepare Gemini prompt
    const prompt = `
    Analyze this job-resume match based on the following data. Return JSON with:
    - eligible: boolean
    - description: string summary
    - percentage: match percentage (0-100)
    - lackings: missing keywords as string array
    
    Resume:
    - Skills: ${resume.skills.join(", ")}
    - Frameworks: ${resume.frameworks.join(", ")}
    - Experience: ${resume.yearsExperience} years
    - Education: ${resume.education}
    - Summary: ${resume.summary}
    
    Job Requirements:
    - Title: ${jobData.title}
    - Description: ${jobData.description.substring(0, 2000)}
    - Required Experience: ${jobData.experienceLevel}
    - Employment Type: ${jobData.employmentType}
    - Keywords: ${jobData.keywords.join(", ")}
    `;

    console.log(prompt);

    // Get Gemini response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(
      response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
    );

    res.json(analysis);
  } catch (error) {
    console.error("Validation error:", error);
    res
      .status(500)
      .json({ error: "Validation failed", details: error.message });
  }
};

export const createQuestions = (req, res) => {};
