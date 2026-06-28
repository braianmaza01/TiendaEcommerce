import express from 'express'
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/productosController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', obtenerProductos)
router.get('/:id', obtenerProductoPorId)
router.post('/', verificarToken, crearProducto)
router.put('/:id', verificarToken, actualizarProducto)
router.delete('/:id', verificarToken, eliminarProducto)

export default router
