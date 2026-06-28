import express from 'express'
import upload from '../middleware/upload.js'
import { subirImagen } from '../controllers/uploadController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', verificarToken, upload.single('imagen'), subirImagen)

export default router
