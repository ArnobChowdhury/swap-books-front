import redis, { ClientOpts } from 'redis';

let redisConnectionConfig: string | ClientOpts = {
  port: 6379,
  host: '127.0.0.1',
};

if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  redisConnectionConfig = process.env.REDIS_URL;
}

// @ts-ignore
export const client = redis.createClient(redisConnectionConfig);

client.on('connect', () => {
  // eslint-disable-next-line
  console.log('Client connected to redis.');
});

client.on('ready', () => {
  // eslint-disable-next-line
  console.log('Client connected to redis and ready to use.');
});

client.on('error', (err: Error) => {
  // eslint-disable-next-line
  console.log(err.message);
});

client.on('end', () => {
  // eslint-disable-next-line
  console.log('Client disconnected from redis.');
});
