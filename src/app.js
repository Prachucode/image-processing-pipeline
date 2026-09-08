import express from 'express'
import cors from 'cors'
import { subscriber } from './config/redis.js'
export const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

import uploadRoutes from './controllers/uploadController.js'

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
subscriber.on("message", (channel, message) => {

    console.log("Redis message:", message);

    // channel = job:123
    const jobId = channel.split(":")[1];

    // Find the SSE connection for the respective jobId
    const client = clients.get(jobId);

    if (!client) {
        console.log("No SSE client for:", jobId);
        return;
    }

    // Send Redis message to browser
    client.write(
        `event:stage_completed\n
        data: ${message}\n\n`
    );

});




import errorhandler from './middlewares/globalErrorHandler.js'
app.use(errorhandler)