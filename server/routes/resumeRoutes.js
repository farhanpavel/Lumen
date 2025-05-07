import express from "express";
import { postResume } from "../controllers/resumeController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
const resumeRouter = express.Router();
resumeRouter.post("/", jwtAuthentication, postResume);

export default resumeRouter;
