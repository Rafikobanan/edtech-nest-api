import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const envs = {
  MONGO_URI: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  API_URL: process.env.API_URL,
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  NODE_ENV: process.env.NODE_ENV
};

export const cookies = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  DEFAULT_COOKIE_OPTIONS: { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }
};
