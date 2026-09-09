import dotenv from 'dotenv'

import redis from './config/redis.js'
import bullmq from './config/bullmq.js'
import { app } from './app.js'

// workers
import { denoiseWorker } from './workers/denoiseWorker.js'
import { compressWorker } from './workers/compressWorker.js'
import { resizeWorker } from './workers/resizeWorker.js'
import { convertWorker } from './workers/convertWorker.js'

const workers = [
    { name: 'Denoise', worker: denoiseWorker },
    { name: 'Compress', worker: compressWorker },
    { name: 'Resize', worker: resizeWorker },
    { name: 'Convert', worker: convertWorker }
]
// event listener for each worker for checking job logs
workers.forEach(({ name, worker }) => {
    worker.on('active', (job) => {
        console.log(`[Worker:${name}] Job ${job.id} started processing`)
    })

    worker.on('completed', (job) => {
        console.log(`[Worker:${name}] Job ${job.id} completed successfully`)
    })

    worker.on('failed', (job, err) => {
        console.error(`[Worker:${name}] Job ${job?.id} failed with error:`, err?.message || err)
    })

    worker.on('error', (err) => {
        console.error(`[Worker:${name}] Worker encountered an error:`, err?.message || err)
    })
})

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})