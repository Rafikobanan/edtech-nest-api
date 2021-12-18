import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { UsersModel } from './users.model';

@Injectable()
export class UsersService {
  private collection: Collection<UsersModel>;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db
  ) {
    this.collection = db.collection('users');
  }

  getUserInfo(user: UsersModel) {
    return {
      email: user.email,
      name: user.name,
      lastName: user.lastName
    };
  }

  async save(user: UsersModel) {
    return this.collection.insertOne(user).then((res) => res.insertedId);
  }

  async verifyEmail(emailActivationLink: string) {
    return this.collection
      .findOneAndUpdate(
        { emailActivationLink },
        { $set: { isEmailVerified: true, emailActivationLink: '' } }
      )
      .then((res) => res.value._id);
  }

  async isRefreshTokenExisted(_id: ObjectId, refreshToken: string) {
    return this.collection.count({
      _id,
      refreshTokens: { $in: [refreshToken] }
    });
  }

  async pushRefreshToken(_id: ObjectId, refreshToken: string) {
    await this.collection.updateOne(
      { _id },
      { $push: { refreshTokens: refreshToken } }
    );
  }

  async removeRefreshToken(_id: ObjectId, refreshToken: string) {
    await this.collection.updateOne(
      { _id },
      {
        $pull: { refreshTokens: refreshToken }
      }
    );
  }

  async findById(_id: ObjectId) {
    return this.collection.findOne({ _id });
  }

  async findByEmail(email: string) {
    return this.collection.findOne({ email });
  }
}
