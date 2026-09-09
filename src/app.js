import express from 'express'
import cors from 'cors'
import { subscriber } from './config/redis.js'
export const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "multipart/form-data"],
    credentials: true
}))

import path from 'path'
import uploadRoutes from './routes/uploadRoutes.js'

app.use('/processed', express.static(path.resolve(process.cwd(), 'processed')))
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))

app.get('/api/download', (req, res) => {
    const filePathParam = req.query.path
    if (!filePathParam) {
        return res.status(400).json({ error: 'File path parameter is required' })
    }

    const processedRoot = path.resolve(process.cwd(), 'processed')
    const safePath = path.resolve(processedRoot, filePathParam.replace(/^(\.\.[\/\\])+/, ''))

    if (!safePath.startsWith(processedRoot)) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    res.download(safePath, (err) => {
        if (err && !res.headersSent) {
            res.status(404).json({ error: 'File not found' })
        }
    })
})

app.use('/api', uploadRoutes)


const clients = new Map(); // handle browser clients

app.get("/events/:jobId", async (req, res) => {
    const { jobId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders()
    clients.set(jobId, res);

    console.log("SSE connected:", jobId);

    req.on("close", () => {
        clients.delete(jobId);
    });
});

// subscribe to every job channel
subscriber.psubscribe('job:*');

// send map data from the client map to react frontend through pub/sub
subscriber.on("pmessage", (pattern, channel, message) => {

    console.log("Redis message:", message);

    // channel = job:upload-123 -> extract the jobId
    const jobId = channel.replace(/^job:/, '');

    // Find the SSE connection for the respective jobId
    const client = clients.get(jobId);

    if (!client) {
        console.log("No SSE client for:", jobId);
        return;
    }

    // Send Redis message to browser
    client.write(`event: stage_completed\ndata: ${message}\n\n`);

});




import errorhandler from './middlewares/globalErrorHandler.js'
app.use(errorhandler)