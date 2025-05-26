import asyncHandler from "../middleware/async";
import { UserUseCase } from "../usecases/user";
import { ErrorResponse } from "../utils/errorResponse";
import { comparePassword, hashPassword } from "../utils/hash";
import { PreferencesUseCase } from "../usecases/preferences";
import { AppResponse } from "../utils/appResponse";
import { loginUser, newPass, registerUser } from "../validation/users";
import { generateToken } from "../utils/jwt";
import crypto from 'crypto';

export const register = asyncHandler(async (req, res, next) => {
  const { error, value } = registerUser.validate(req.body);

  if (error) {
    throw next(new ErrorResponse("Invalid input", 400));
  }

  const { name, email, password, subject, grade, studyStyle, studyTime } = value;

  const existingUser = await UserUseCase.getUserByEmail(email);

  if (existingUser) {
    throw next(new ErrorResponse("User already exists", 400));
  }

  const hashedPassword = await hashPassword(password);

  const user: any = {
    name,
    email,
    password: hashedPassword
  }

  const newUser = await UserUseCase.createUser(user)

  if (!newUser || !newUser.otp) {
    throw next(new ErrorResponse("Failed to create user", 500));
  }

  const preference: any = {
    userId: newUser.id,
    subject,
    studyTime, 
    studyStyle
  }

  const userPreference = await PreferencesUseCase.createPreferences(preference);

  if (!userPreference) {
    throw next(new ErrorResponse("Failed to create user preferences", 500));
  }

  const userToken = generateToken(newUser.id);

  const hashOTP = await hashPassword(newUser.otp);

  newUser.otp = hashOTP;
  newUser.save();

  return AppResponse(res, 201, newUser.otp, 'New user has been created')
});

export const login = asyncHandler(async (req, res, next) => {
  const { error, value } = loginUser.validate(req.body);

  if (error) {
    throw next(new ErrorResponse("Invalid input", 400));
  }

  const { email, password } = value;

  const user = await UserUseCase.getUserByEmail(email);

  if (!user || !user.password) {
    throw next(new ErrorResponse("User not found", 404));
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw next(new ErrorResponse("Invalid password", 401));
  }

  const hashToken = generateToken(user.id);

  user.token = hashToken;
  await user.save();

  return AppResponse(res, 200, { token: hashToken, userId: user.id }, 'User logged in successfully');
});

export const resendOTP = asyncHandler(async (req, res, next) => {
  
  const { id } = req.params;

  if (!id) {
    throw next(new ErrorResponse("User ID is required", 400));
  }

  const user = await UserUseCase.getUserById(id);

  if (!user) {
    throw next(new ErrorResponse("User not found", 404));
  }

  const OTP = crypto.randomBytes(6).toString('hex').slice(0, 6);
  const newOTP = await hashPassword(OTP);
  const Expires = new Date(Date.now() + 60 * 60 * 1000);

  user.otp = newOTP;
  user.otpExpires = Expires;
  await user.save();

  return AppResponse(res, 200, { otp: newOTP }, 'New OTP has been sent');
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
  const { id, otp } = req.body;

  if (!id || !otp) {
    throw next(new ErrorResponse("Email and OTP are required", 400));
  }

  const user = await UserUseCase.getUserById(id);

  if (!user || !user.otp || !user.otpExpires) {
    throw next(new ErrorResponse("User not found", 404));
  }

  if (Date.now() > user.otpExpires.getTime()) {
    throw next(new ErrorResponse("OTP has expired", 400));
  }

  const isOtpValid = await comparePassword(otp, user.otp);

  if (!isOtpValid) {
    throw next(new ErrorResponse("Invalid OTP", 401));
  }

  user.isVerified = true;
  await user.save();

  return AppResponse(res, 200, null, 'OTP verified successfully');
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw next(new ErrorResponse("Email is required", 400));
  }

  const user = await UserUseCase.getUserByEmail(email);

  if (!user) {
    throw next(new ErrorResponse("User not found", 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = await hashPassword(resetToken);
  const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 

  user.resetToken = hashedResetToken;
  user.resetTokenExpires = resetTokenExpires;
  await user.save();

  return AppResponse(res, 200, resetToken, 'Reset token has been generated');
});

export const resetPassword = asyncHandler(async (req, res, next) => {

  const { resetToken } = req.params;

  if (!resetToken) {
    throw next(new ErrorResponse("Reset token is required", 400));
  }

  const { error, value } = newPass.validate(req.body);

  if (error) {
    throw next(new ErrorResponse("Invalid input", 400));
  }

  const { email, newPassword, confirmPassword } = value;

  const user = await UserUseCase.getUserByEmail(email);

  if (!user || !user.resetToken || !user.resetTokenExpires) {
    throw next(new ErrorResponse("User not found or reset token not set", 404));
  }

  if (confirmPassword !== newPassword) {
    throw next(new ErrorResponse("Passwords don't match", 400));
  }

  if (Date.now() > user.resetTokenExpires.getTime()) {
    throw next(new ErrorResponse("Reset token has expired", 400));
  }

  const isResetTokenValid = await comparePassword(resetToken, user.resetToken);

  if (!isResetTokenValid) {
    throw next(new ErrorResponse("Invalid reset token", 401));
  }

  user.password = await hashPassword(newPassword);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return AppResponse(res, 200, null, 'Password has been reset successfully');
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    throw next(new ErrorResponse("User ID is required", 400));
  }

  const user = await UserUseCase.getUserById(userId);

  if (!user) {
    throw next(new ErrorResponse("User not found", 404));
  }

  return AppResponse(res, 200, user, 'User profile retrieved successfully');
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await UserUseCase.getAllUsers();

  if (!users || users.length === 0) {
    throw next(new ErrorResponse("No users found", 404));
  }

  return AppResponse(res, 200, users, 'All users retrieved successfully');
});

