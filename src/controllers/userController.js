import {
  createUserService,
  loginUserService,
} from "../services/userService.js";
import CustomError from "../utils/customError.js";
import { errorResponse, successResponse } from "../utils/response.js";

const createUserController = async (req, res, next) => {
  try {
    const newUser = await createUserService(req.body);
    successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to create user");
    }
  }
};

const loginUserController = async (req, res, next) => {
  try {
    const { userWithoutPassword, token } = await loginUserService(req.body);
    successResponse(
      res,
      { user: userWithoutPassword, token },
      "User logged in successfully"
    );
  } catch (error) {
    if (error instanceof CustomError) {
      errorResponse(res, error.message, error.message, error.statusCode);
    } else {
      errorResponse(res, error.message, "Failed to login");
    }
  }
};

export default { createUserController, loginUserController };
