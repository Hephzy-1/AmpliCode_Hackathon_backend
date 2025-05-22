import { Document, model, Schema } from 'mongoose';

export interface IPreference extends Document {
  userId: string;
  subject: string;
  grade: string;
  studyStyle: string;
  studyTime: string;
}

const preferenceSchema = new Schema<IPreference>({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  studyStyle: { type: String, required: true },
  studyTime: { type: String }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v,
      delete ret.createdAt,
      delete ret.updatedAt
    }
  }
});

const Preference = model<IPreference>('Preference', preferenceSchema);

export default Preference;