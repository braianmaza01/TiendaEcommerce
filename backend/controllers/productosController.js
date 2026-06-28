import Producto from '../models/Producto.js'

export async function obtenerProductos(req, res) {
  try {
    const { nombre } = req.query
    const filtro = nombre ? { nombre: { $regex: nombre, $options: 'i' } } : {}
    const productos = await Producto.find(filtro)
    res.json(productos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message })
  }
}

export async function obtenerProductoPorId(req, res) {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message })
  }
}

export async function crearProducto(req, res) {
  try {
    const producto = new Producto(req.body)
    await producto.save()
    res.status(201).json(producto)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear producto', error: error.message })
  }
}

export async function actualizarProducto(req, res) {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar producto', error: error.message })
  }
}

export async function eliminarProducto(req, res) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }
    res.json({ mensaje: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message })
  }
}
