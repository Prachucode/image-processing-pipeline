import asynchandler from "../middlewares/asyncHandler.js"

import { resizeQueue } from "../queues/resizeQueue.js";

const uploadimg = asynchandler(async (req, res, next) => {
    const { outputFormat } = req.body;
    if (!req.file) {
        const error = new Error('Upload a file')
        error.statusCode = 400
        throw error
    }

    const job = await resizeQueue.add('resize', {
        originalPath: req.file.path, // actual upload path from /uploads directory
        filename: req.file.filename, // the file name converted by server to another name
        outputFormat: outputFormat
    }, {
        jobId: `upload-${req.file.filename}`, // idempotency key 
        removeOnComplete: true
    })
    res.status(202).json({
        success: true,
        message: 'File uploaded',
        file: req.file.filename,
        Format: outputFormat
    })

})

export default uploadimg