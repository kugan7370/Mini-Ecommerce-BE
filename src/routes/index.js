import express from "express";
const app = express();
import userRoutes from "./userRoute.js";
import productRoutes from "./productRoute.js";

app.use("/user", userRoutes);
app.use("/product", productRoutes);

export default app;
