import uploadimg from '../controllers/uploadController.js'
import multer from 'multer'
const upload = multer({ dest: 'uploads/' })
import Router from 'express'

const router = Router()

router.route('/upload').post(upload.single('image'), uploadimg)

export default router