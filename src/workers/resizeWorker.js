import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { resizeImage } from "../services/resizeServices.js";
import { compressQueue } from "../queues/compressQueue.js";
import { publisher } from "../config/redis.js";

const resizeworker = new Worker('resize', async (job) => {
    const { originalPath, outputFormat } = job.data
    const resizeimgpath = await resizeImage(originalPath)
    await publisher.publish(`job:${job.id}`, JSON.stringify({
        jobId: job.id,
        stage: 'resize',
        status: 'completed',
        imageUrl: resizeimgpath
    }))
    await compressQueue.add('compress', {
        resizedPath: resizeimgpath,
        outputFormat: outputFormat
    }, {
        jobId: `compress-${resizeimgpath}`,
        removeOnComplete: true
    })

}, {
    connection,
    concurrency: 3
})