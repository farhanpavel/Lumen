import prisma from "../db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate interview questions based on job and resume details
 */
export const generateInterviewQuestions = async (
  job,
  resume,
  difficulty = "medium"
) => {
  // Create a comprehensive prompt using job and resume details
  const inputPrompt = `Generate 5 interview questions for the job titled "${job.title}". 
  
  Job details:
  - Title: ${job.title}
  - Company: ${job.company}
  - Description: ${job.description}
  - Employment Type: ${job.employmentType}
  - Experience Level: ${job.experienceLevel}
  - Location: ${job.location || "Remote"}
  ${job.remote ? "- This is a remote position" : ""}
  
  Candidate's resume summary: "${resume.summary}"
  Candidate's skills: ${resume.skills.join(", ")}
  Candidate's experience: ${resume.yearsExperience || "Not specified"}
  Candidate's education: ${resume.education || "Not specified"}
  
  The difficulty level is: "${difficulty}".
  
  Please ask the questions directly without any additional text or explanation. Focus on skills relevant to this specific job and the candidate's background.`;

  try {
    const response = await model.generateContent(inputPrompt);
    const questionsText = response.response.text();

    // Split the generated text into individual questions
    const questionsArray = questionsText
      .split("\n")
      .filter((q) => q.trim() !== "")
      .map((q) => {
        return q
          .replace(/^\d+\.\s*/, "") // Remove numbering (e.g., "1. ")
          .replace(/\s*$$[^)]*$$/g, ""); // Remove parenthetical explanations
      });

    // Map the questions to a simple format
    return questionsArray.map((question) => ({ question, answer: "" }));
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions.");
  }
};

/**
 * Generate interview questions based on job and resume IDs
 */
export const generateQuestions = async (req, res) => {
  try {
    const { jobId, resumeId, difficulty } = req.body;

    // Validate required parameters
    if (!jobId || !resumeId) {
      return res.status(400).json({
        error: "Both jobId and resumeId are required.",
      });
    }

    // Find the job in the database
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { keywords: true },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Find the resume in the database
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found." });
    }

    // Generate interview questions based on job and resume details
    const questions = await generateInterviewQuestions(
      job,
      resume,
      difficulty || "medium"
    );

    // Return the generated questions directly
    res.status(200).json({
      success: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
        },
        resume: {
          id: resume.id,
          summary: resume.summary,
        },
        questions: questions,
      },
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Alternative endpoint that uses userId instead of resumeId
 */
export const generateQuestionsForUser = async (req, res) => {
  try {
    const { jobId, difficulty } = req.body;
    const userId = req.user.id;
    // Validate required parameters
    if (!jobId || !userId) {
      return res.status(400).json({
        error: "Both jobId and userId are required.",
      });
    }

    // Find the job in the database
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Find the resume for this user
    const resume = await prisma.resume.findUnique({
      where: { userId: userId },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found for this user." });
    }

    // Generate interview questions based on job and resume details
    const questions = await generateInterviewQuestions(
      job,
      resume,
      difficulty || "medium"
    );

    // Return the generated questions directly
    res.status(200).json({
      success: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
        },
        resume: {
          id: resume.id,
          summary: resume.summary,
        },
        questions: questions,
      },
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Evaluate answers with AI
 */
export const evaluateAnswers = async (req, res) => {
  try {
    const { resumeId, jobId, questions } = req.body;

    // Validate required parameters
    if (!resumeId || !jobId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: "resumeId, jobId, and questions array are required.",
      });
    }

    // Check if all questions have answers
    const unansweredQuestions = questions.filter((q) => !q.answer);
    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        error: "All questions must be answered before evaluation.",
        unansweredCount: unansweredQuestions.length,
      });
    }

    // Find the resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found." });
    }

    // Evaluate the answers
    const inputPrompt = `Evaluate the following interview answers based on the candidate's summary and provide a mark out of 10 along with some suggestions for improvement:
    
    Candidate Summary:
    ${resume.summary}
    
    Skills: ${resume.skills.join(", ")}
    
    Questions and Answers:
    ${questions
      .map((q, index) => `${index + 1}. ${q.question}\nAnswer: ${q.answer}`)
      .join("\n\n")}
      
    Please provide the evaluation in the following JSON format:
    {
      "marks": <mark out of 10>,
      "suggestions": "<short suggestions for improvement in just two lines>"
    }`;

    const response = await model.generateContent(inputPrompt);
    const evaluationText = response.response.text();

    // Clean up any unwanted characters or markdown
    const cleanText = evaluationText.replace(/```json|```|```/g, "").trim();

    // Parse the cleaned evaluation text
    const evaluation = JSON.parse(cleanText);

    // Return the evaluation directly
    res.status(200).json({
      success: true,
      data: {
        score: evaluation.marks,
        feedback: evaluation.suggestions,
        resumeId,
        jobId,
      },
    });
  } catch (error) {
    console.error("Error evaluating answers:", error);
    res.status(500).json({ error: error.message });
  }
};
