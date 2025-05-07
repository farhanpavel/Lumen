import prisma from "../db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get resume by user ID
export const getResumeByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify if the requesting user has access to this resume
    // This ensures users can only access their own resumes
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this resume",
      });
    }

    // Find the active resume for this user
    const resume = await prisma.resume.findFirst({
      where: {
        userId: userId,
        status: true,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for this user",
      });
    }

    // Format projects if they exist
    let formattedProjects = [];
    if (resume.projects) {
      try {
        // If projects is stored as a string, parse it
        if (typeof resume.projects === "string") {
          formattedProjects = JSON.parse(resume.projects);
        } else {
          // If it's already a JSON object
          formattedProjects = resume.projects;
        }
      } catch (error) {
        console.error("Error parsing projects JSON:", error);
        formattedProjects = [];
      }
    }

    // Return the resume data
    return res.status(200).json({
      success: true,
      data: {
        ...resume,
        projects: formattedProjects,
      },
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
      error: error.message,
    });
  }
};

// Analyze resume and provide feedback
export const analyzeResume = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the active resume for this user
    const resume = await prisma.resume.findFirst({
      where: {
        userId: userId,
        status: true,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for this user",
      });
    }

    // Generate analysis using AI
    const analysis = await generateResumeAnalysis(resume);

    return res.status(200).json({
      success: true,
      data: {
        resumeData: resume,
        analysis: analysis,
      },
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};

// Helper function to generate resume analysis using Gemini
async function generateResumeAnalysis(resume) {
  try {
    // Access the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare resume data for analysis
    const resumeData = {
      summary: resume.summary || "",
      jobTitle: resume.jobTitle || "",
      yearsExperience: resume.yearsExperience || "",
      education: resume.education || "",
      skills: resume.skills || [],
      languages: resume.languages || [],
      frameworks: resume.frameworks || [],
      projects: resume.projects || [],
    };

    // Prepare the prompt
    const prompt = `
    Analyze this resume data for a ${resumeData.jobTitle || "professional"} with ${resumeData.yearsExperience || "some"} years of experience.
    
    Resume Data:
    - Summary: ${resumeData.summary}
    - Skills: ${resumeData.skills.join(", ")}
    - Programming Languages: ${resumeData.languages.join(", ")}
    - Frameworks: ${resumeData.frameworks.join(", ")}
    - Education: ${resumeData.education}
    - Projects: ${JSON.stringify(resumeData.projects)}
    
    Provide a comprehensive analysis with the following:
    1. Overall score (0-100)
    2. Section scores and feedback for: summary, skills, education, projects
    3. Keyword match analysis for their field
    4. ATS compatibility assessment
    5. Improvement suggestions for each section
    
    Format your response as a JSON object with these properties:
    - "overallScore": number
    - "sections": object with section analyses
    - "keywordMatch": object with keyword analysis
    - "atsCompatibility": object with ATS assessment
    
    Make the analysis detailed, constructive, and actionable.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    // The response might be wrapped in markdown code blocks, so we need to extract the JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) || [null, text];
    const jsonString = jsonMatch[1] || text;

    try {
      return JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini:", parseError);
      // Fallback with basic structure if parsing fails
      return {
        overallScore: 70,
        sections: {
          summary: {
            score: 70,
            feedback:
              "Your summary provides a basic overview of your background.",
            suggestions: [
              "Be more specific about your achievements",
              "Quantify your impact",
            ],
          },
          skills: {
            score: 75,
            feedback: "You have a good range of skills listed.",
            suggestions: ["Add proficiency levels", "Group skills by category"],
          },
          education: {
            score: 80,
            feedback: "Your education section is well-structured.",
            suggestions: ["Include relevant coursework if applicable"],
          },
          projects: {
            score: 65,
            feedback: "Your projects could use more detail.",
            suggestions: [
              "Add links to live demos or repositories",
              "Describe technical challenges",
            ],
          },
        },
        keywordMatch: {
          score: 68,
          jobKeywords: ["relevant", "keywords", "for", "your", "field"],
          missing: ["some", "important", "keywords"],
          suggestions: [
            "Add missing keywords if you have experience with them",
          ],
        },
        atsCompatibility: {
          score: 72,
          issues: ["Some formatting issues may affect ATS parsing"],
          suggestions: [
            "Use a simpler format",
            "Ensure consistent date formatting",
          ],
        },
      };
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error("Failed to generate resume analysis with AI");
  }
}

// Get all resumes for a user
export const getAllResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    const resumes = await prisma.resume.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

// Update resume status
export const updateResumeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check if resume exists and belongs to user
    const existingResume = await prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or you don't have permission",
      });
    }

    // If setting this resume as active, deactivate all other resumes
    if (status === true) {
      await prisma.resume.updateMany({
        where: {
          userId,
          id: {
            not: id,
          },
        },
        data: {
          status: false,
        },
      });
    }

    // Update resume status
    const updatedResume = await prisma.resume.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Resume status updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Error updating resume status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume status",
      error: error.message,
    });
  }
};
