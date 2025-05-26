import asyncHandler from "../middleware/async";
import { PreferencesUseCase } from "../usecases/preferences";
import { AppResponse } from "../utils/appResponse";
import { ErrorResponse } from "../utils/errorResponse";

// Extend the User type to include 'id'
declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export const getUserGrade = asyncHandler(async (req, res, next) => {
  
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const preferences = await PreferencesUseCase.getPreferencesByUserId(userId);

  if (!preferences) {
    return res.status(404).json({ message: "Preferences not found" });
  }

  return AppResponse(res, 200, preferences.grade, 'User grade retrieved successfully');
});

export const updateUserGrade = asyncHandler(async (req, res, next) => {
  
  const userId = req.user?.id;
  
  if (!userId) {
    throw next(new ErrorResponse('User ID is required', 400));
  }

  const grade = req.body;

  if (!grade) {
    throw next(new ErrorResponse('Grade is required', 400));
  }

  const updatedPreferences = await PreferencesUseCase.updatePreferences(userId, grade );

  if (!updatedPreferences) {
    throw next(new ErrorResponse('Failed to update user grade', 500));
  }

  return AppResponse(res, 200, updatedPreferences, 'User grade updated successfully');
});

export const getAllUsersGrades = asyncHandler(async (req, res, next) => {
  const preferences = await PreferencesUseCase.getAllPreferences();

  if (!preferences || preferences.length === 0) {
    throw next(new ErrorResponse('No user preferences found', 404));
  }

  const grades = preferences.map(pref => ({
    userId: pref.userId,
    grade: pref.grade
  }));

  return AppResponse(res, 200, grades, 'All users grades retrieved successfully');
});

export const getSameGradeUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw next(new ErrorResponse('User ID is required', 400));
  }

  const preferences = await PreferencesUseCase.getPreferencesByUserId(userId);

  if (!preferences) {
    throw next(new ErrorResponse('Preferences not found', 404));
  }

  const sameGradeUsers = await PreferencesUseCase.preferencesByGrade(preferences.grade);

  if (!sameGradeUsers || sameGradeUsers.length === 0) {
    throw next(new ErrorResponse('No users found with the same grade', 404));
  }

  return AppResponse(res, 200, sameGradeUsers, 'Users with the same grade retrieved successfully');
});

export const getSameStudyStyleUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const preferences = await PreferencesUseCase.getPreferencesByUserId(userId);

  if (!preferences) {
    throw next(new ErrorResponse('Preferences not found', 404));
  }

  const sameStudyStyleUsers = await PreferencesUseCase.getPreferencesByStudyStyle(preferences.studyStyle);

  if (!sameStudyStyleUsers || sameStudyStyleUsers.length === 0) {
    throw next(new ErrorResponse('No users found with the same study style', 404));
  }

  return AppResponse(res, 200, sameStudyStyleUsers, 'Users with the same study style retrieved successfully');
});

export const getSameStudyTimeUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw next(new ErrorResponse('User ID is required', 400));
  }

  const preferences = await PreferencesUseCase.getPreferencesByUserId(userId);

  if (!preferences) {
    throw next(new ErrorResponse('Preferences not found', 404));
  }

  const sameStudyTimeUsers = await PreferencesUseCase.getPreferencesByStudyTime(preferences.studyTime);

  if (!sameStudyTimeUsers || sameStudyTimeUsers.length === 0) {
    throw next(new ErrorResponse('No users found with the same study time', 404));
  }

  return AppResponse(res, 200, sameStudyTimeUsers, 'Users with the same study time retrieved successfully');
});

export const deleteUserPreferences = asyncHandler(async (req, res, next) => {
  
  const userId = req.user?.id;
  
  if (!userId) {
    throw next(new ErrorResponse('User ID is required', 400));
  }

  const deletedPreferences = await PreferencesUseCase.deletePreferencesByUserId(userId);

  if (!deletedPreferences) {
    throw next(new ErrorResponse('Failed to delete user preferences', 500));
  }

  return AppResponse(res, 200, null, 'User preferences deleted successfully');
});