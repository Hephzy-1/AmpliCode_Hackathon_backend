import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  password?: string;
  email: string;
  googleId?: Number;
  isVerified: boolean;
  token: string;
  otp?: string;
  otpExpires?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  profilePic?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  email: { type: String, required: true, unique: true, },
  googleId: { type: Number, unique: true, sparse: true },
  isVerified: { type: Boolean, default: false },
  token: { type: String, select: false },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpires: Date,
  profilePic: String
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

const User = model<IUser>('User', userSchema);

export default User;