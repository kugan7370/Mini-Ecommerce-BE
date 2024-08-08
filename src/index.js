import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/", routes);

//error handler
app.use(errorHandler);

//server
app.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
