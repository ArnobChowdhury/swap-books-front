import JWT from 'jsonwebtoken';
import redis from 'redis';
import createError from 'http-errors';
import { client as redisClient } from './redis';
import { JWTDecoded } from '../interface';

export const generateJWT = (
  userId: string,
  email: string,
  tokenType: 'access' | 'refresh',
): string => {
  const isAccessToken = tokenType === 'access';
  const secret: string = process.env[
    isAccessToken ? 'ACCESS_SECRET' : 'REFRESH_SECRET'
  ] as string;
  const payload = { email };
  const options = {
    expiresIn: isAccessToken ? '1h' : '1y',
    issuer: 'bookbarterapp.com',
    audience: userId,
  };
  const token = JWT.sign(payload, secret, options);

  if (tokenType === 'refresh') {
    // we set the token to redis
    redisClient.SET(
      `refreshToken:${userId}`,
      token,
      'EX',
      365 * 24 * 60 * 60,
      (err, reply) => {
        // TODO should we keep the redis.print???
        redis.print(err, reply);
      },
    );
  }
  return token;
};

export const verifyRefreshToken = (
  refreshToken: string,
): Promise<{ email: string; userId: string }> => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string,
      (jwtErr, decoded) => {
        if (jwtErr) {
          reject(new createError.Unauthorized());
          return;
        }
        const { email, aud: userId } = decoded as JWTDecoded;
        redisClient.GET(`refreshToken:${userId}`, (redisErr, result) => {
          if (redisErr) {
            reject(new createError.InternalServerError());
            return;
          }
          if (result === refreshToken) {
            resolve({ email, userId });
            return;
          }
          reject(new createError.Unauthorized());
        });
      },
    );
  });
};
