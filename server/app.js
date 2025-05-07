import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
<<<<<<< HEAD
import resumeRouter from "./routes/resumeRoutes.js";
=======
import jobRoute from "./routes/jobRoute.js";
>>>>>>> 5d50d816c3ccd51754574eb7dd1816e25306d102

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("hello");
});

app.listen(PORT, () => {
  console.log(`app is listening on Port ${PORT}`);
});

app.use("/api/user", userRouter);
<<<<<<< HEAD
app.use("/api/resume", resumeRouter);
=======
app.use("/api/job", jobRoute);
>>>>>>> 5d50d816c3ccd51754574eb7dd1816e25306d102
