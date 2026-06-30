import express from 'express'
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  cancelarPendientesViejos,
  eliminarCancelados,
} from '../controllers/pedidosController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', verificarToken, obtenerPedidos)
router.put('/cancelar-viejos', verificarToken, cancelarPendientesViejos)
router.delete('/cancelar-todos', verificarToken, eliminarCancelados)
router.get('/:id', verificarToken, obtenerPedidoPorId)
router.post('/', crearPedido)
router.put('/:id', verificarToken, actualizarEstadoPedido)
router.delete('/:id', verificarToken, eliminarPedido)

export default router
