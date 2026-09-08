import dotenv from 'dotenv'

import redis from './config/redis.js'
import bullmq from './config/bullmq.js'
import {app} from './app.js'

// workers
import './workers/resizeWorker.js'
import './workers/compressWorker.js'
import './workers/convertWorker.js'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})