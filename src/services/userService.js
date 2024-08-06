import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import CustomError from "../utils/customError.js";
import generateToken from "../utils/generateToken.js";

const createUserService = async (userData) => {
  const { username, email, password, confirmPassword } = userData;

  if (password !== confirmPassword) {
    throw new CustomError("Passwords do not match", 400);
  }

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new CustomError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();

  const { password: userPassword, ...userWithoutPassword } = newUser._doc;

  return userWithoutPassword;
};

const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid password", 400);
  }

  const token = generateToken(user);

  const { password: userPassword, ...userWithoutPassword } = user._doc;

  return { userWithoutPassword, token };
};

export { createUserService, loginUserService };
