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
  try {
    let secretVar: string;
    let expiresIn: string | undefined;
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
        secretVar = 'MAIL_SECRET';
        expiresIn = '24h';
        break;
    }
    const secret: string = (process.env[secretVar] as string) + additionalSecret;
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
  } catch (err) {
    throw err;
  }
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
export const decodeMailLinkToken = (
  token: string,
  additionalSecret: string = '',
) => {
  try {
    const decoded = JWT.verify(
      token,
      (process.env.MAIL_SECRET as string) + additionalSecret,
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

export const createEmailVerifyLink = (userId: string, email: string): string => {
  const secret = process.env.MAIL_SECRET as string;
  const token = JWT.sign({ email }, secret, {
    audience: userId,
    issuer: 'www.pustokio.com',
  });

  const action_url =
    process.env.NODE_ENV === 'production'
      ? `https://www.pustokio.com/mail-verify/${token}`
      : `http://localhost:${process.env.PORT}/mail-verify/${token}`;

  return action_url;
};
