import redis from 'redis';
import { client as redisClient } from './redis';

export const setSocketIdToRedis = (
  socketId: string,
  userId: string,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    /**
     * TODO for socket
     * For multiple device sign-in we need to keep socketIds in a set.
     * We will iterate through the set and delete the socket that has been logging out
     */
    redisClient.SET(`socket:${userId}`, socketId, (err, reply) => {
      redis.print(err, reply);
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
};

export const getSocketIdFromRedis = (userId: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    redisClient.GET(`socket:${userId}`, (err, reply) => {
      if (err) {
        reject(err);
      }
      resolve(reply);
    });
  });
};

export const delSocketIdFromRedis = (userId: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    redisClient.DEL(`socket:${userId}`, (err, reply) => {
      if (reply === 1) {
        resolve();
      } else if (reply === 0) {
        const notFound = new Error('Not found in redis');
        reject(notFound);
      }
      if (err) {
        reject(err);
      }
    });
  });
};
