import express from "express";
const app = express();
import userRoutes from "./userRoute.js";

app.use("/user", userRoutes);

export default app;
