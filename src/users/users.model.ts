import { ObjectId } from 'mongodb';

export class UsersModel {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  lastName: string;
  isEmailVerified = false;
  emailActivationLink = '';
  refreshTokens: string[] = [];
  createdAt: Date = new Date();
}
