import express from "express";
import {
  postResume,
  updateResumeDetails,
  getResume, validateResume,
} from "../controllers/resumeController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const resumeRouter = express.Router();

resumeRouter.post("/", jwtAuthentication, upload.single("file"), postResume);
resumeRouter.put("/details", jwtAuthentication, updateResumeDetails);
resumeRouter.post("/validate", jwtAuthentication, validateResume);
resumeRouter.get("/", jwtAuthentication, getResume);

export default resumeRouter;
