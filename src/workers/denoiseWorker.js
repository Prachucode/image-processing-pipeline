import { Worker } from "bullmq";
import connection from "../config/bullmq.js";
import { denoiseImage } from "../services/denoiseServices.js";
import { compressQueue } from "../queues/compressQueue.js";
import { publisher } from "../config/redis.js";

export const denoiseWorker = new Worker('denoise', async (job) => {
    const { originalPath, outputFormat } = job.data;
    const pipelineJobId = job.data.pipelineJobId || job.id;
    const { outputPath, imageUrl, downloadUrl } = await denoiseImage(originalPath);

    await publisher.publish(`job:${pipelineJobId}`, JSON.stringify({
        jobId: pipelineJobId,
        stage: 'denoise',
        status: 'completed',
        imageUrl: imageUrl,
        downloadUrl: downloadUrl
    }));

    await compressQueue.add('compress', {
        pipelineJobId,
        denoisedPath: outputPath,
        outputFormat: outputFormat
    }, {
        jobId: `compress-${pipelineJobId}`,
        removeOnComplete: true,
        removeOnFail: true
    });
}, {
    connection,
    concurrency: 3
});
