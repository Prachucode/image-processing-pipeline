import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { compressImage } from "../services/compressServices.js";
import { compressQueue } from "../queues/compressQueue.js";
import { resizeQueue } from "../queues/resizeQueue.js";
import { publisher } from "../config/redis.js";

export const compressWorker = new Worker('compress', async (job) => {
    const inputPath = job.data.denoisedPath || job.data.resizedPath
    const { outputFormat } = job.data
    const pipelineJobId = job.data.pipelineJobId || job.id
    const { outputPath, imageUrl, downloadUrl } = await compressImage(inputPath)

    await publisher.publish(`job:${pipelineJobId}`, JSON.stringify({
        jobId: pipelineJobId,
        stage: 'compress',
        status: 'completed',
        imageUrl: imageUrl,
        downloadUrl: downloadUrl
    }))

    await resizeQueue.add('resize', {
        pipelineJobId,
        compressedPath: outputPath,
        outputFormat: outputFormat
    }, {
        jobId: `resize-${pipelineJobId}`,
        removeOnComplete: true,
        removeOnFail: true
    })

}, {
    connection,
    concurrency: 3
})