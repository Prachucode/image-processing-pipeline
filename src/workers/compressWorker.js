import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { compressImage } from "../services/compressServices.js";
import { compressQueue } from "../queues/compressQueue.js";
import { convertQueue } from "../queues/convertQueue.js";
import { publisher } from "../config/redis.js";

const compressworker = new Worker('compress', async (job) => {
    const { resizedPath, outputFormat } = job.data
    const compressimgpath = await compressImage(resizedPath)
    await publisher.publish(`job:${job.id}`, JSON.stringify({
        jobId: job.id,
        stage: 'compress',
        status: 'completed',
        imageUrl: compressimgpath
    }))
    await convertQueue.add('convert', {
        compressedPath: compressimgpath,
        outputFormat: outputFormat
    }, {
        jobId: `convert-${compressimgpath}`,
        removeOnComplete: true
    })

}, {
    connection,
    concurrency: 3
})