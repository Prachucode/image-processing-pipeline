# Image Editing Application

A full-stack, asynchronous image editing application built with **Node.js**, **BullMQ**, **Redis**, and **React**. Upload an image and run it through a series of processing stages � resize, compress, denoise, and convert � with real-time progress updates streamed directly to the browser via **Server-Sent Events (SSE)**.

---

## ? Features

- ?? **Image Upload** � Upload images via a clean React frontend
- ?? **Async Job Queue** � Each processing stage runs as an independent BullMQ job (brings scalability to the project)
- ??? **Four Processing Stages:**
  - **Resize** � Scales images down to a max width of 1024px (no upscaling)
  - **Compress** � Reduces file size at 80% quality (supports JPEG, PNG, WebP, AVIF)
  - **Denoise** � Applies a median filter to reduce image noise
  - **Convert** � Converts images between formats (JPEG, PNG, WebP, AVIF, etc.)
- ?? **Real-time Updates** � Job progress is pushed to the frontend via SSE using Redis Pub/Sub
- ?? **Download Results** � Download processed images directly from the UI. Each processed image is served as separate component

---

## ??? Architecture

```
+-------------+       HTTP POST /api/upload        +------------------+
�   React UI  � ---------------------------------? �  Express Server  �
�  (Vite)     � ?---------------------------------  �  (Node.js)       �
�  port: 5173 �    SSE /events/:jobId (progress)    �  port: 3000      �
+-------------+                                     +------------------+
                                                             �
                                                   Enqueue jobs to BullMQ
                                                             �
                                              +--------------?--------------+
                                              �           Redis              �
                                              �  - BullMQ job queues         �
                                              �  - Pub/Sub (job:* channels)  �
                                              +------------------------------+
                                                             �
                                          +------------------?------------------+
                                          �           BullMQ Workers             �
                                          �  resizeWorker  �  compressWorker     �
                                          �  denoiseWorker �  convertWorker      �
                                          �                                      �
                                          �         (powered by Sharp)           �
                                          +--------------------------------------+
```

Each processing stage has its own **queue**, **worker**, and **service**:

| Stage    | Queue              | Worker             | Service               |
|----------|--------------------|--------------------|-----------------------|
| Resize   | `resizeQueue.js`   | `resizeWorker.js`  | `resizeServices.js`   |
| Compress | `compressQueue.js` | `compressWorker.js`| `compressServices.js` |
| Denoise  | `denoiseQueue.js`  | `denoiseWorker.js` | `denoiseServices.js`  |
| Convert  | `convertQueue.js`  | `convertWorker.js` | `convertService.js`   |

---

## ??? Project Structure

```
image-processing-pipeline/
+-- src/                        # Backend (Node.js / Express)
�   +-- server.js               # Entry point � starts server & registers workers
�   +-- app.js                  # Express app � routes, SSE, Redis Pub/Sub
�   +-- config/
�   �   +-- redis.js            # Redis client & subscriber setup
�   �   +-- bullmq.js           # BullMQ connection config
�   +-- routes/
�   �   +-- uploadRoutes.js     # POST /api/upload (Multer file handling)
�   +-- controllers/
�   �   +-- uploadController.js # Handles upload, enqueues jobs
�   +-- queues/                 # BullMQ queue definitions
�   �   +-- resizeQueue.js
�   �   +-- compressQueue.js
�   �   +-- denoiseQueue.js
�   �   +-- convertQueue.js
�   +-- workers/                # BullMQ job processors
�   �   +-- resizeWorker.js
�   �   +-- compressWorker.js
�   �   +-- denoiseWorker.js
�   �   +-- convertWorker.js
�   +-- services/               # Core image processing logic (Sharp)
�   �   +-- resizeServices.js
�   �   +-- compressServices.js
�   �   +-- denoiseServices.js
�   �   +-- convertService.js
�   +-- middlewares/
�       +-- globalErrorHandler.js
+-- frontend/                   # Frontend (React + Vite + Tailwind CSS)
�   +-- src/
�       +-- App.jsx             # Main application component
�       +-- components/
�       �   +-- Pipeline.jsx    # Pipeline stage visualizer
�       �   +-- ImageOutput.jsx # Processed image display & download
�       +-- hooks/              # Custom React hooks
+-- uploads/                    # Temporary storage for uploaded images
+-- processed/                  # Output directory for processed images
�   +-- resized/
�   +-- compressed/
�   +-- denoised/
�   +-- converted/
+-- .env                        # Environment variables
+-- package.json
```

---

## ?? Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Redis](https://redis.io/) (running locally or via Docker)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd image-processing-pipeline
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
```

### 4. Start Redis

Using Docker:
```bash
docker run -d -p 6379:6379 redis
```

Or install Redis locally and run `redis-server`.

### 5. Run the Application

**Start the backend** (from the project root):
```bash
npm run dev
```

**Start the frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

- **Backend API:** http://localhost:3000
- **Frontend UI:** http://localhost:5173

---

## ?? API Reference

### `POST /api/upload`
Upload an image to start processing.

- **Content-Type:** `multipart/form-data`
- **Body:** `image` (file)
- **Response:**
  ```json
  {
    "jobId": "upload-1234567890"
  }
  ```

### `GET /events/:jobId`
Server-Sent Events stream for real-time job progress updates.

- **Event:** `stage_completed`
- **Data:** JSON string with stage name, status, output URL, and download URL

### `GET /api/download?path=<relative-path>`
Download a processed image from the server.

### `GET /processed/:filename`
Serve static processed images.

---

## ??? Tech Stack

### Backend
| Package    | Purpose                            |
|------------|------------------------------------|
| `express`  | HTTP server & REST API             |
| `bullmq`   | Redis-backed job queue & workers   |
| `ioredis`  | Redis client                       |
| `sharp`    | High-performance image processing  |
| `multer`   | Multipart file upload handling     |
| `dotenv`   | Environment variable management    |

### Frontend
| Package         | Purpose                        |
|-----------------|--------------------------------|
| `react`         | UI framework                   |
| `vite`          | Fast build tool & dev server   |
| `tailwindcss`   | Utility-first CSS styling      |
| `lucide-react`  | Icon library                   |

---

## ?? How Real-Time Updates Work

1. Client uploads an image ? server enqueues all processing jobs and returns a `jobId`
2. Client opens an SSE connection to `/events/:jobId`
3. As each worker completes a job, it **publishes** a message to a Redis channel (`job:<jobId>`)
4. The server's Redis **subscriber** receives the message and **pushes** it to the browser via SSE
5. The React frontend updates the pipeline UI in real-time as each stage completes

---

## ?? License

ISC
