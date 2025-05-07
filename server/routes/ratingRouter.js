import express from "express";
import {
  upsertResume,
  getResumeByUserId,
  deleteResumeByUserId,
  getAllResumes,
} from "../controllers/ratingController.js";

import { jwtAuthentication } from "../middlewares/authMiddleware.js";

// Example: import verifyToken from "../middleware/authMiddleware.js"; // Your auth middleware
// Example: import { isAdmin } from "../middleware/roleMiddleware.js"; // Your role check middleware

const ratingRouter = express.Router();

// --- Routes for a specific user's resume ---

// Create or Update a resume for a specific user (identified by userId in URL)
// PUT is suitable for upsert operations where the resource identifier is known.
ratingRouter.put("/user", jwtAuthentication, upsertResume);

// Get a resume for a specific user
ratingRouter.get("/user", jwtAuthentication, getResumeByUserId);

// Delete a resume for a specific user
ratingRouter.delete("/user", jwtAuthentication, deleteResumeByUserId);

// --- Routes for general resume operations (e.g., for Admin) ---

// Get all resumes (potentially for admin dashboard)
// This route should be protected and restricted to admin roles.
ratingRouter.get("/", /* verifyToken, isAdmin, */ getAllResumes);

export default ratingRouter;
