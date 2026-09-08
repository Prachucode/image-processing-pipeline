import redis from './redis.js'
import { createNodeRedisClient } from 'bullmq';

const connection = createNodeRedisClient(redis);
console.log('Redis connected for BullMQ')
export default connection