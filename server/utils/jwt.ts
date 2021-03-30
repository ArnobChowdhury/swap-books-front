import JWT from 'jsonwebtoken';
import redis from 'redis';
import createError from 'http-errors';
import { client as redisClient } from './redis';
import { JWTDecoded } from '../interface';

export const generateJWT = (
  userId: string,
  email: string,
  tokenType: 'access' | 'refresh' | 'passReset',
  additionalSecret: string = '',
): string => {
  let secretVar: string;
  let expiresIn: string;
  switch (tokenType) {
    case 'access':
      secretVar = 'ACCESS_SECRET';
      expiresIn = '1h';
      break;
    case 'refresh':
      secretVar = 'REFRESH_SECRET';
      expiresIn = '1y';
      break;
    case 'passReset':
      secretVar = 'PASS_RESET_SECRET';
      expiresIn = '24h';
      break;
  }
  const secret: string = (process.env[secretVar] as string) + additionalSecret;
  console.log(secret);
  const payload = { email };
  const options = {
    expiresIn,
    issuer: 'www.pustokio.com',
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

// This function can be changed to a generic one to only decode JWT tokens
export const decodePasswordResetToken = (
  token: string,
  additionalSecret: string,
) => {
  try {
    const decoded = JWT.verify(
      token,
      (process.env.PASS_RESET_SECRET as string) + additionalSecret,
    );
    const { email, aud: userId } = decoded as JWTDecoded;
    return { email, userId };
  } catch (err) {
    const message =
      err.name === 'JsonWebTokenError'
        ? 'Unauthorized'
        : 'TokenExpiredError'
        ? 'Link has expired.'
        : err.message;
    throw new createError.Unauthorized(message);
  }
};
