import { Queue } from 'bullmq'
import connection from '../config/bullmq.js'

export const denoiseQueue = new Queue('denoise', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: true
    }
})
