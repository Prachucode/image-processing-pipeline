import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { convertImage } from "../services/convertService.js";
import { publisher } from "../config/redis.js";

export const convertWorker = new Worker('convert', async (job) => {
    const inputPath = job.data.resizedPath || job.data.compressedPath
    const { outputFormat } = job.data
    const pipelineJobId = job.data.pipelineJobId || job.id
    const { outputPath, imageUrl, downloadUrl } = await convertImage(inputPath, outputFormat)

    await publisher.publish(`job:${pipelineJobId}`, JSON.stringify({
        jobId: pipelineJobId,
        stage: 'convert',
        status: 'completed',
        imageUrl: imageUrl,
        downloadUrl: downloadUrl
    }))
}, {
    connection,
    concurrency: 3
})