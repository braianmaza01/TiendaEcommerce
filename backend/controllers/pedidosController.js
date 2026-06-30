import Pedido from '../models/Pedido.js'

export async function obtenerPedidos(req, res) {
  try {
    const pedidos = await Pedido.find().sort({ createdAt: -1 })
    res.json(pedidos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message })
  }
}

export async function obtenerPedidoPorId(req, res) {
  try {
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' })
    }
    res.json(pedido)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message })
  }
}

export async function crearPedido(req, res) {
  try {
    const pedido = new Pedido(req.body)
    await pedido.save()
    res.status(201).json(pedido)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear pedido', error: error.message })
  }
}

export async function eliminarPedido(req, res) {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id)
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' })
    }
    res.json({ mensaje: 'Pedido eliminado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar pedido', error: error.message })
  }
}

export async function cancelarPendientesViejos(req, res) {
  try {
    const haceSieteDias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const resultado = await Pedido.updateMany(
      { estado: 'pendiente', createdAt: { $lt: haceSieteDias } },
      { estado: 'cancelado' }
    )
    res.json({ cancelados: resultado.modifiedCount })
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cancelar pedidos pendientes',
      error: error.message,
    })
  }
}

export async function eliminarCancelados(req, res) {
  try {
    const resultado = await Pedido.deleteMany({ estado: 'cancelado' })
    res.json({ eliminados: resultado.deletedCount })
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar pedidos cancelados',
      error: error.message,
    })
  }
}

export async function actualizarEstadoPedido(req, res) {
  try {
    const { estado } = req.body
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    )
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' })
    }
    res.json(pedido)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar pedido', error: error.message })
  }
}
