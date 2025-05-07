import express from "express";
import {
  plannerGet,
  getPlanners,
  updatePlannerStatus,
  deletePlanner,
  getTopicResources, // Add the new controller
} from "../controllers/plannerController.js";
import { jwtAuthentication } from "../middlewares/authMiddleware.js";

const Pathrouter = express.Router();

// All routes are protected with JWT authentication
Pathrouter.get("/generate/:jobId", jwtAuthentication, plannerGet);
Pathrouter.get("/", jwtAuthentication, getPlanners);
Pathrouter.patch("/:id/status", jwtAuthentication, updatePlannerStatus);
Pathrouter.delete("/:id", jwtAuthentication, deletePlanner);

Pathrouter.get("/topic/:title", jwtAuthentication, getTopicResources);

export default Pathrouter;
