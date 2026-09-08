import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { convertImage } from "../services/convertService.js";
import { publisher } from "../config/redis.js";

const convertworker = new Worker('convert', async (job) => {
    const { compressedPath, outputFormat } = job.data
    const convertimgpath = await convertImage(compressedPath)
    await publisher.publish(`job:${job.id}`, JSON.stringify({
        jobId: job.id,
        stage: 'convert',
        status: 'completed',
        imageUrl: convertimgpath
    }))
}, {
    connection,
    concurrency: 3
})