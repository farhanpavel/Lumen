import express from "express";
import {getJobDescription, getJobs, postJob} from "../controllers/jobController.js";
import {jwtAuthentication} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create', jwtAuthentication, postJob)
router.get('/', getJobs)
router.get('/:id', getJobDescription)

export default router