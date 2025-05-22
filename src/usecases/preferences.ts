import { PreferencesRepository } from "../repository/preferences";
import { IPreference } from "../models/preference";

export class PreferencesUseCase {
  static async createPreferences(values: IPreference) {
    const preferences = await PreferencesRepository.createPreferences(values);
    return preferences;
  }

  static async getPreferencesByUserId(userId: string) {
    const preferences = await PreferencesRepository.getPreferencesByUserId(userId);
    return preferences;
  }

  static async updatePreferences(userId: string, values: IPreference) {
    const preferences = await PreferencesRepository.updatePreferences(userId, values);
    return preferences;
  }

  static async deletePreferences(userId: string) {
    const preferences = await PreferencesRepository.deletePreferences(userId);
    return preferences;
  }
  static async getAllPreferences() {
    const preferences = await PreferencesRepository.getAllPreferences();
    return preferences;
  }
  static async getPreferencesBySubject(subject: string) {
    const preferences = await PreferencesRepository.getPreferencesBySubject(subject);
    return preferences;
  }
  static async getPreferencesByStudyStyle(studyStyle: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyStyle(studyStyle);
    return preferences;
  }
  static async getPreferencesByStudyTime(studyTime: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyTime(studyTime);
    return preferences;
  }
  static async getPreferencesByStudyStyleAndStudyTime(studyStyle: string, studyTime: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyStyleAndStudyTime(studyStyle, studyTime);
    return preferences;
  }
  static async getPreferencesByStudyStyleAndSubject(studyStyle: string, subject: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyStyleAndSubject(studyStyle, subject);
    return preferences;
  }
  static async getPreferencesByStudyTimeAndSubject(studyTime: string, subject: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyTimeAndSubject(studyTime, subject);
    return preferences;
  }
  static async getPreferencesByStudyStyleAndStudyTimeAndSubject(studyStyle: string, studyTime: string, subject: string) {
    const preferences = await PreferencesRepository.getPreferencesByStudyStyleAndStudyTimeAndSubject(studyStyle, studyTime, subject);
    return preferences;
  }
}