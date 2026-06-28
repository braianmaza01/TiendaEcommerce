import express from 'express'
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
} from '../controllers/pedidosController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verificarToken, obtenerPedidos)
router.get('/:id', verificarToken, obtenerPedidoPorId)
router.post('/', crearPedido)
router.put('/:id', verificarToken, actualizarEstadoPedido)
router.delete('/:id', verificarToken, eliminarPedido)

export default router
