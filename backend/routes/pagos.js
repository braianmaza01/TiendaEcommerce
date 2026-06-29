import express from 'express'
import { crearPreferencia, webhook } from '../controllers/pagosController.js'

const router = express.Router()

router.post('/crear-preferencia', crearPreferencia)
router.post('/webhook', webhook)

export default router
