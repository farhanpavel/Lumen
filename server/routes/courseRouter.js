import express from "express";
import {getCoursesCoursera} from "../controllers/courseController.js";

const courseRouter = express.Router()
courseRouter.get("/coursera",getCoursesCoursera)