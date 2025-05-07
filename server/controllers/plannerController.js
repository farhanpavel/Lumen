import prisma from "../db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";

// Initialize the Google Generative AI with API key - only initialize once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize YouTube API
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export const plannerGet = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // Get user's resume
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

    // Get job details
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        keywords: true,
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Generate planner using Gemini
    const plannerTitles = await generatePlanner(resume, job);

    // Save the planner to the database
    const savedPlanner = await prisma.planner.create({
      data: {
        title: plannerTitles,
        priority: "HIGH", // Default to HIGH priority for job preparation
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Planner created successfully",
      data: savedPlanner,
    });
  } catch (error) {
    console.error("Error generating planner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate planner",
      error: error.message,
    });
  }
};

// Function to generate planner using Gemini
async function generatePlanner(resume, job) {
  try {
    // Access the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Calculate the number of days based on job complexity and user experience
    const daysNeeded = calculatePreparationDays(resume, job);

    // Create the query string for the prompt
    const query = `Prepare for ${job.title} at ${job.company} in ${daysNeeded} days with skills gap in ${getMissingSkills(resume, job).join(", ")}`;

    // Prepare the prompt with resume and job details
    const inputPrompt = `Create a learning roadmap based ${query}. 
    Return ONLY a JSON array with titles where take the day from this string '${query}' (one for each day) in this format:
    [
      "title: [Title 1]",
      "title: [Title 2]",
      ...
      "title: [Title ${daysNeeded}]"
    ]
    Each title should be concise (max 10 words) and describe the main focus for that day but do not mention the day and day number just title:data.
    Respond with JSON only, no explanations or markdown formatting.`;

    // Generate content
    const result = await model.generateContent(inputPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    // The response might be wrapped in markdown code blocks, so we need to extract the JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) || [null, text];
    const jsonString = jsonMatch[1] || text;

    try {
      // Parse the JSON array
      const titlesArray = JSON.parse(jsonString.trim());

      // Extract just the title content without the "title: " prefix
      const cleanTitles = titlesArray.map((item) => {
        if (typeof item === "string" && item.startsWith("title: ")) {
          return item.substring(7); // Remove "title: " prefix
        }
        return item;
      });

      return cleanTitles;
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini:", parseError);
      // Fallback: create a basic structure if parsing fails
      return [
        "Review Job Requirements",
        "Analyze Technical Skills Gap",
        "Research Company Background",
        "Practice Interview Questions",
        "Prepare Portfolio Presentation",
      ];
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error("Failed to generate planner with AI");
  }
}

// Helper function to calculate how many days of preparation are needed
function calculatePreparationDays(resume, job) {
  // Basic calculation based on experience gap
  const experienceLevels = {
    ENTRY: 1,
    MID: 2,
    SENIOR: 3,
    LEAD: 4,
  };

  // Parse resume experience (assuming format like "1-3" years)
  let userExperienceYears = 0;
  if (resume.yearsExperience) {
    const match = resume.yearsExperience.match(/(\d+)-(\d+)/);
    if (match) {
      userExperienceYears = parseInt(match[2]); // Use upper bound
    } else {
      userExperienceYears = parseInt(resume.yearsExperience) || 0;
    }
  }

  // Calculate experience gap
  const jobLevel = experienceLevels[job.experienceLevel] || 2;
  const userLevel = Math.floor(userExperienceYears / 2) + 1;
  const experienceGap = Math.max(0, jobLevel - userLevel);

  // Calculate skill gap
  const skillGap = getMissingSkills(resume, job).length;

  // Base days (5) + adjustments for gaps
  const days = 5 + experienceGap * 2 + Math.ceil(skillGap / 2);

  // Ensure reasonable range (5-14 days)
  return Math.min(14, Math.max(5, days));
}

// Helper function to identify missing skills
function getMissingSkills(resume, job) {
  // Extract all user skills from resume
  const userSkills = [
    ...(resume.skills || []),
    ...(resume.languages || []),
    ...(resume.frameworks || []),
  ].map((skill) => skill.toLowerCase());

  // Extract job required skills
  const jobSkills = job.keywords.map((k) => k.name.toLowerCase());

  // Find skills in job requirements that user doesn't have
  return jobSkills.filter((skill) => !userSkills.includes(skill));
}

// Get all planners for a user
export const getPlanners = async (req, res) => {
  try {
    const userId = req.user.id;

    const planners = await prisma.planner.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: planners,
    });
  } catch (error) {
    console.error("Error fetching planners:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch planners",
      error: error.message,
    });
  }
};

// Update planner status
export const updatePlannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!Object.values(prisma.PlannerStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Check if planner exists and belongs to user
    const existingPlanner = await prisma.planner.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPlanner) {
      return res.status(404).json({
        success: false,
        message: "Planner not found or you don't have permission",
      });
    }

    // Update planner status
    const updatedPlanner = await prisma.planner.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Planner status updated successfully",
      data: updatedPlanner,
    });
  } catch (error) {
    console.error("Error updating planner status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update planner status",
      error: error.message,
    });
  }
};

// Delete a planner
export const deletePlanner = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if planner exists and belongs to user
    const existingPlanner = await prisma.planner.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingPlanner) {
      return res.status(404).json({
        success: false,
        message: "Planner not found or you don't have permission",
      });
    }

    // Delete the planner
    await prisma.planner.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Planner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting planner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete planner",
      error: error.message,
    });
  }
};

// Generate learning resources for a specific topic
export const getTopicResources = async (req, res) => {
  try {
    const { title } = req.params;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Topic title is required",
      });
    }

    // Decode the title if it's URL-encoded
    const decodedTitle = decodeURIComponent(title);

    // Generate resources using AI
    const resources = await generateTopicResources(decodedTitle);

    // Find YouTube videos related to the topic
    const videos = await findYouTubeVideos(decodedTitle);

    return res.status(200).json({
      success: true,
      data: {
        title: decodedTitle,
        codeExamples: resources.codeExamples,
        context: resources.context,
        documentation: resources.documentation,
        videos: videos,
      },
    });
  } catch (error) {
    console.error("Error generating topic resources:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate topic resources",
      error: error.message,
    });
  }
};

// Helper function to generate topic resources using Gemini
async function generateTopicResources(topicTitle) {
  try {
    // Access the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt
    const prompt = `
    I need comprehensive learning resources for the topic: "${topicTitle}".
    
    Please provide:
    
    1. A detailed explanation of the context and importance of this topic (about 200-300 words)
    2. 3 code examples that demonstrate key concepts related to this topic
    3. 3 links to official documentation or important resources for learning more
    
    Format your response as a JSON object with these properties:
    - "context": A string with the detailed explanation
    - "codeExamples": An array of objects, each with "title", "language", and "code" properties
    - "documentation": An array of objects, each with "title" and "url" properties
    
    Make sure the content is accurate, educational, and focused specifically on "${topicTitle}".
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
        context: `Learn about ${topicTitle} to improve your skills in this area.`,
        codeExamples: [
          {
            title: "Basic Example",
            language: "javascript",
            code: "// Example code would be here",
          },
        ],
        documentation: [
          {
            title: "Official Documentation",
            url: "https://developer.mozilla.org/en-US/",
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error("Failed to generate topic resources with AI");
  }
}

// Helper function to find YouTube videos related to the topic
async function findYouTubeVideos(topicTitle) {
  try {
    // Format the search query to focus on educational content
    const searchQuery = `${topicTitle} tutorial programming`;

    // Make the API request
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      type: "video",
      maxResults: 5,
      relevanceLanguage: "en",
      videoEmbeddable: "true",
      videoDuration: "medium", // Medium length videos (4-20 minutes)
      order: "relevance",
    });

    // Format the results
    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return []; // Return empty array if there's an error
  }
}
