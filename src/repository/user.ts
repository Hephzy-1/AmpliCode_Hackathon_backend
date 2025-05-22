import User, { IUser } from '../models/user';
import crypto from 'crypto';

export class UserRepository {
  static async createUser (values: IUser) {
    const OTP = crypto.randomBytes(6).toString('hex').slice(0, 6);
    const Expires = Date.now() + 60 * 60 * 1000;
    const user = new User({
      name: values.name,
      password: values.password,
      email: values.email,
      otp: OTP,
      otpExpires: Expires,
      
    })

    await user.save();
    return user;
  }

  static async getUserByEmail (email: string) {
    const user = await User.findOne({ email });

    return user;
  }

  static async getUserById (userId: string) {
    const user = await User.findById(userId);

    return user;
  }

  static async updateUser (userId: string, values: IUser) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      { new: true }
    );
    return user;
  }

  static async deleteUser (userId: string) {
    const user =
      await User.findByIdAndDelete(userId);
    return user;
  }

  static async getAllUsers () {
    const users = await User.find();

    return users;
  }

  static async getUserByName (name: string) {
    const user = await User.find
      ({ name })
      .populate('name', 'name email')
      .exec();
    return user;
  }
  
  static async getUserByOTP (otp: string) {
    const user = await User.findOne({
      otp,
      otpExpires: { $gt: Date.now() },
    });
    return user;
  }
}