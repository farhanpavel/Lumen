import express from "express";
import {
  postResume,
  updateResumeDetails,
  getResume,
} from "../controllers/resumeController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const resumeRouter = express.Router();

resumeRouter.post("/", jwtAuthentication, upload.single("file"), postResume);
resumeRouter.put("/details", jwtAuthentication, updateResumeDetails);
resumeRouter.get("/", jwtAuthentication, getResume);

export default resumeRouter;
