import { createClient } from 'redis';
import Redis from 'ioredis'

const redis = createClient({
    url: 'redis://localhost:6379'
})

redis.connect().then(() => console.log('Redis connected'))
    .catch((err) => console.error('Redis connection error:', err));

export const subscriber = new Redis({
    host: "localhost",
    port: 6379,
});
export const publisher = new Redis({
    host: "localhost",
    port: 6379,
});
export default redis
