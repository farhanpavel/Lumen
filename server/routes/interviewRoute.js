import express from "express";

import {
  evaluateAnswers,
  generateQuestions,
  generateQuestionsForUser,
} from "../controllers/interviewController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const interviewRouter = express.Router();
interviewRouter.post(
  "/generate-questions",
  jwtAuthentication,
  generateQuestions
);
interviewRouter.post(
  "/generate-questions-for-user",
  jwtAuthentication,

  generateQuestionsForUser
);
interviewRouter.get("/evaluate-answers", evaluateAnswers);

export default interviewRouter;
