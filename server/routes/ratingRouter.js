import express from "express";
import {
  getResumeByUserId,
  analyzeResume,
  getAllResumes,
  updateResumeStatus,
} from "../controllers/ratingController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const ratingRouter = express.Router();

// Get resume by user ID (used by the frontend)
ratingRouter.get("/resumes/user", jwtAuthentication, getResumeByUserId);

// Analyze resume and provide feedback
ratingRouter.get("/resumes/analyze", jwtAuthentication, analyzeResume);

// Get all resumes for the authenticated user
ratingRouter.get("/resumes", jwtAuthentication, getAllResumes);

// Update resume status (active/inactive)
ratingRouter.patch(
  "/resumes/:id/status",
  jwtAuthentication,
  updateResumeStatus
);

export default ratingRouter;
