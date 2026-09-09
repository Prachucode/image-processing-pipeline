import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { resizeImage } from "../services/resizeServices.js";
import { convertQueue } from "../queues/convertQueue.js";
import { publisher } from "../config/redis.js";

export const resizeWorker = new Worker('resize', async (job) => {
    const inputPath = job.data.compressedPath || job.data.originalPath
    const { outputFormat } = job.data
    const pipelineJobId = job.data.pipelineJobId || job.id
    const { outputPath, imageUrl, downloadUrl } = await resizeImage(inputPath)

    await publisher.publish(`job:${pipelineJobId}`, JSON.stringify({
        jobId: pipelineJobId,
        stage: 'resize',
        status: 'completed',
        imageUrl: imageUrl,
        downloadUrl: downloadUrl
    }))

    await convertQueue.add('convert', {
        pipelineJobId,
        resizedPath: outputPath,
        compressedPath: outputPath,
        outputFormat: outputFormat
    }, {
        jobId: `convert-${pipelineJobId}`,
        removeOnComplete: true,
        removeOnFail: true
    })

}, {
    connection,
    concurrency: 3
})