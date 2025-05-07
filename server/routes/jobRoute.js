import express from "express";
import {getJobDescription, getJobs, postJob} from "../controllers/jobController.js";
import {jwtAuthentication} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/jobs', jwtAuthentication, postJob)
router.get('/jobs', getJobs)
router.get('/jobs/:id', getJobDescription)

export default router