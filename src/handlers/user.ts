import asyncHandler from "../middleware/async";
import { UserUseCase } from "../usecases/user";
import { ErrorResponse } from "../utils/errorResponse";
import { hashPassword } from "../utils/hash";

export const createUser = asyncHandler(async (req, res, next) => {
  const { errors, value } = req.body;

  if (errors) {
    throw next(new ErrorResponse("Invalid input", 400));
  }

  const { name, email, password, subject } = value;

  const existingUser = await UserUseCase.getUserByEmail(email);

  if (existingUser) {
    throw next(new ErrorResponse("User already exists", 400));
  }

  const hashedPassword = await hashPassword(password);

  

});