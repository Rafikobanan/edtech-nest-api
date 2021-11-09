import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { envs } from '../config';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const client = new MongoClient(envs.MONGO_URI);

          const connection = await client.connect();

          const db = connection.db(envs.DB_NAME);

          await db
            .collection('users')
            .createIndex({ email: 1 }, { unique: true });

          await db.collection('users').createIndex(
            { createdAt: 1 },
            {
              expireAfterSeconds: 60 * 60 * 24,
              partialFilterExpression: { isEmailVerified: false }
            }
          );

          return db;
        } catch (e) {
          throw e;
        }
      }
    }
  ],
  exports: ['DATABASE_CONNECTION']
})
export class DatabaseModule {}
