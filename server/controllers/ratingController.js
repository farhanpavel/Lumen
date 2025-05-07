import prisma from "../db.js";

// Adjust path to your Prisma Client instance

/**
 * @desc    Create or Update (Upsert) a user's resume
 * @route   PUT /api/resumes/user/:userId
 * @access  Private (assumed)
 */
export const upsertResume = async (req, res) => {
  const { userId } = req.params;
  const body = req.body;

  // --- Core Validation for non-nullable fields in Prisma model ---
  if (typeof body.resumeUrl !== "string" || body.resumeUrl.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Resume URL is required and must be a non-empty string.",
    });
  }
  if (typeof body.summary !== "string" || body.summary.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Summary is required and must be a non-empty string.",
    });
  }

  // --- Prepare data for Prisma ---
  // This object takes all fields from the body. Undefined fields will be handled by Prisma:
  // - For `update`: undefined fields are skipped (not updated).
  // - For `create`: undefined optional fields become null or their DB default. Non-optional undefined fields would error.
  const dataForPrisma = {
    resumeUrl: body.resumeUrl,
    summary: body.summary,
    jobTitle: body.jobTitle, // Optional: String?
    yearsExperience: body.yearsExperience, // Optional: String?
    education: body.education, // Optional: String?
    jobPreference: body.jobPreference, // Optional: String?
    availability: body.availability, // Optional: String?
    salaryExpectation: body.salaryExpectation, // Optional: String?
    aboutYou: body.aboutYou, // Optional: String?
    industry: body.industry, // Optional: String?
    certifications: body.certifications, // Optional: String?
    otherTech: body.otherTech, // Optional: String?

    // Array fields: Ensure they are arrays. If not provided or not an array, handle for create/update.
    skills: Array.isArray(body.skills) ? body.skills : undefined,
    languages: Array.isArray(body.languages) ? body.languages : undefined,
    frameworks: Array.isArray(body.frameworks) ? body.frameworks : undefined,

    // Boolean fields: Ensure they are booleans.
    relocation:
      typeof body.relocation === "boolean" ? body.relocation : undefined,
    status: typeof body.status === "boolean" ? body.status : undefined,

    // JSON field: Allow object, null, or undefined.
    projects:
      body.projects === null || typeof body.projects === "object"
        ? body.projects
        : undefined,
  };

  // For the 'create' part of upsert, ensure non-optional array fields get a default empty array.
  // Prisma handles defaults for booleans (`@default(false)`) and nulls for optional fields (`Json?`)
  // automatically when a field is undefined in the create payload.
  const createPayload = {
    userId: userId, // Link to the user
    ...dataForPrisma,
    skills: dataForPrisma.skills || [], // Prisma `String[]` needs an array
    languages: dataForPrisma.languages || [], // Prisma `String[]` needs an array
    frameworks: dataForPrisma.frameworks || [], // Prisma `String[]` needs an array
  };

  // For the 'update' part, we remove any top-level `undefined` properties from `dataForPrisma`.
  // Prisma naturally skips updating fields that are not present in the update payload.
  const updatePayload = { ...dataForPrisma };
  Object.keys(updatePayload).forEach((key) => {
    if (updatePayload[key] === undefined) {
      delete updatePayload[key];
    }
  });

  try {
    const resume = await prisma.resume.upsert({
      where: { userId: userId },
      update: updatePayload,
      create: createPayload,
    });
    res.status(200).json({
      success: true,
      data: resume,
      message: "Resume saved successfully.",
    });
  } catch (error) {
    console.error("Error upserting resume:", error);
    if (error.code === "P2003" && error.meta?.field_name?.includes("userId")) {
      // Foreign key constraint failed on userId, meaning the User does not exist.
      return res.status(400).json({
        success: false,
        message: "Invalid user ID: The specified user does not exist.",
      });
    }
    if (error.code === "P2002") {
      // Unique constraint failed
      return res.status(409).json({
        success: false,
        message: `A unique constraint was violated. Field(s): ${error.meta?.target?.join(", ")}`,
      });
    }
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while saving the resume.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get a user's resume by User ID
 * @route   GET /api/resumes/user/:userId
 * @access  Private (assumed)
 */
export const getResumeByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const resume = await prisma.resume.findUnique({
      where: { userId: userId },
    });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found for this user." });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Error fetching resume by User ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a user's resume by User ID
 * @route   DELETE /api/resumes/user/:userId
 * @access  Private (assumed)
 */
export const deleteResumeByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if resume exists first for a slightly better DX, though delete handles non-existence.
    const existingResume = await prisma.resume.findUnique({
      where: { userId },
    });
    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for this user. Nothing to delete.",
      });
    }

    await prisma.resume.delete({
      where: { userId: userId },
    });
    res
      .status(200)
      .json({ success: true, message: "Resume deleted successfully." });
  } catch (error) {
    console.error("Error deleting resume by User ID:", error);
    // Prisma specific error code for "Record to delete does not exist"
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found for this user." });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all resumes (for admin purposes)
 * @route   GET /api/resumes
 * @access  Private/Admin (assumed)
 */
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      include: { user: { select: { id: true, name: true, email: true } } }, // Optionally include some user details
    });
    res
      .status(200)
      .json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error("Error fetching all resumes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all resumes.",
      error: error.message,
    });
  }
};
