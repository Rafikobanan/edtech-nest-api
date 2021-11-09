import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Collection, Db, ObjectId } from 'mongodb';
import { envs } from '../config';
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

  async loginById(_id: ObjectId) {
    const accessToken = jwt.sign({ _id }, envs.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s'
    });

    const refreshToken = jwt.sign({ _id }, envs.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    await this.pushRefreshToken(_id, refreshToken);

    return { accessToken, refreshToken };
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

  async pushRefreshToken(_id: ObjectId, refreshToken: string) {
    await this.collection.updateOne(
      { _id },
      { $push: { refreshTokens: refreshToken } }
    );
  }

  async findById(_id: ObjectId) {
    return this.collection.findOne({ _id });
  }

  async findByEmail(email: string) {
    return this.collection.findOne({ email });
  }
}
