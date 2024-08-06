import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.createUserController);
router.post("/login", userController.loginUserController);

export default router;
