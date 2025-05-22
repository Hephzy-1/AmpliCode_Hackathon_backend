import Preferences, { IPreference } from '../models/preference';

export class PreferencesRepository {
  static async createPreferences (values: IPreference) {
    const preferences = new Preferences({
      userId: values.userId,
      subject: values.subject,
      studyStyle: values.studyStyle,
      studyTime: values.studyTime,
    });

    await preferences.save();

    return preferences;
  }

  static async getPreferencesByUserId (userId: string) {
    const preferences = await Preferences
      .findOne({ userId })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }

  static async updatePreferences (userId: string, values: IPreference) {
    const preferences = await Preferences.findOneAndUpdate(
      { userId },
      {
        subject: values.subject,
        studyStyle: values.studyStyle,
        studyTime: values.studyTime,
      },
      { new: true }
    );

    return preferences;
  }

  static async deletePreferences (userId: string) {
    const preferences = await Preferences.findOneAndDelete({ userId });

    return preferences;
  }

  static async getAllPreferences () {
    const preferences = await Preferences
      .find()
      .populate('userId', 'name email')
      .exec();

    return preferences;
  }

  static async getPreferencesBySubject (subject: string) {
    const preferences = await Preferences
      .find({ subject})
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }

  static async getPreferencesByStudyStyle (studyStyle: string) {
    const preferences = await Preferences
      .find({ studyStyle })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  static async getPreferencesByStudyTime (studyTime: string) {
    const preferences = await Preferences
      .find({ studyTime })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  static async getPreferencesByStudyStyleAndStudyTime (studyStyle: string, studyTime: string) {
    const preferences = await Preferences
      .find({ studyStyle, studyTime })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  static async getPreferencesByStudyStyleAndSubject (studyStyle: string, subject: string) {
    const preferences = await Preferences
      .find({ studyStyle, subject })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  static async getPreferencesByStudyTimeAndSubject (studyTime: string, subject: string) {
    const preferences = await Preferences
      .find({ studyTime, subject })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  static async getPreferencesByStudyStyleAndStudyTimeAndSubject (studyStyle: string, studyTime: string, subject: string) {
    const preferences = await Preferences
      .find({ studyStyle, studyTime, subject })
      .populate('userId', 'name email')
      .exec();
    return preferences;
  }
  
}