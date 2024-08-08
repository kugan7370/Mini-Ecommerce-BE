import express from "express";
import userController from "../controllers/userController.js";
import { validate } from "../validation/index.js";
import { createUserValidationRules } from "../validation/userValidation.js";
const router = express.Router();

router.post(
  "/register",
  validate(createUserValidationRules),
  userController.createUserController
);
router.post("/login", userController.loginUserController);

export default router;
