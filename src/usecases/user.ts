import { UserRepository } from '../repository/user';
import { IUser } from '../models/user';

export class UserUseCase {
  static async createUser (values: IUser) {
    const user = await UserRepository.createUser(values);
    return user;
  }

  static async getUserByEmail (email: string) {
    const user = await UserRepository.getUserByEmail(email);
    return user;
  }

  static async getUserById (userId: string) {
    const user = await UserRepository.getUserById(userId);
    return user;
  }
  static async updateUser (userId: string, values: IUser) {
    const user = await UserRepository.updateUser(userId, values);
    return user;
  }
  static async deleteUser (userId: string) {
    const user = await UserRepository.deleteUser(userId);
    return user;
  }
  static async getAllUsers () {
    const users = await UserRepository.getAllUsers();
    return users;
  }
  static async getUserByName (name: string) {
    const user = await UserRepository.getUserByName(name);
    return user;
  }
  static async getUserByOTP (otp: string) {
    const user = await UserRepository.getUserByOTP(otp);
    return user;
  }
}