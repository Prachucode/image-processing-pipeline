import uploadimg from '../controllers/uploadController.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Router from 'express'

const uploadDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg'
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        cb(null, `${uniqueSuffix}${ext}`)
    }
})

const upload = multer({ storage })

const router = Router()

router.route('/upload').post(upload.single('image'), uploadimg)

export default router